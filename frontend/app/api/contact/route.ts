import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import connectToDatabase from "~/lib/db/mongodb";
import Booking from "~/lib/db/models/Booking";
import Visitor from "~/lib/db/models/Visitor";
import Message from "~/lib/db/models/Message";
import {
    sendBookingPendingEmails,
    sendGeneralContactEmail,
} from "~/lib/mailer";
import { isValidEmail, sanitizeText } from "~/lib/validation";
import { checkRateLimit, getClientIp } from "~/lib/rateLimit";
import { VISITOR_COOKIE_NAME } from "~/lib/visitorCookie";

export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);
        const { allowed } = checkRateLimit(ip, 8, 10 * 60 * 1000);
        if (!allowed) {
            return NextResponse.json(
                { error: "Too many requests. Please wait a few minutes before trying again." },
                { status: 429 }
            );
        }

        const cookieStore = await cookies();
        let visitorId = cookieStore.get(VISITOR_COOKIE_NAME)?.value;

        // If visitor hasn't received cookie yet, create one
        let setCookieHeader = false;
        if (!visitorId) {
            visitorId = `vid_${crypto.randomUUID().replace(/-/g, "")}`;
            setCookieHeader = true;
        }

        const body = await request.json();
        
        // Anti-bot honeypot check
        if (body.hp || body._gotcha || body.website_url) {
            return NextResponse.json({ success: true, message: "Request received" });
        }

        const type = body.type || (body.date || body.timeSlot || body.topic ? "consultation" : "inquiry");

        await connectToDatabase();

        if (type === "consultation") {
            const { name, email, phone, topic, date, timeSlot, timezone, message } = body;

            const cleanName = sanitizeText(name, 120);
            const cleanEmail = sanitizeText(email, 150).toLowerCase();
            const cleanPhone = sanitizeText(phone, 40);
            const cleanTopic = sanitizeText(topic, 150);
            const cleanDate = sanitizeText(date, 50);
            const cleanTime = sanitizeText(timeSlot, 50);
            const cleanMsg = sanitizeText(message, 5000);

            if (!cleanName || !cleanEmail || !cleanTopic || !cleanDate || !cleanTime) {
                return NextResponse.json(
                    {
                        error: "Missing required fields: name, email, topic, date, and timeSlot are required.",
                    },
                    { status: 400 }
                );
            }

            if (!isValidEmail(cleanEmail)) {
                return NextResponse.json(
                    { error: "Please provide a valid email address." },
                    { status: 400 }
                );
            }

            const bookingId = `bk_${crypto.randomUUID().replace(/-/g, "").substring(0, 12)}`;

            // 1. Create Booking in MongoDB with status: "pending"
            const booking = await Booking.create({
                bookingId,
                visitorId,
                name: cleanName,
                email: cleanEmail,
                phone: cleanPhone || undefined,
                topic: cleanTopic,
                date: cleanDate,
                timeSlot: cleanTime,
                timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                message: cleanMsg,
                status: "pending",
                createdAt: new Date(),
            });

            // 2. Backfill name, email, phone onto the Visitor document in MongoDB
            await Visitor.findOneAndUpdate(
                { visitorId },
                {
                    $setOnInsert: {
                        visitorId,
                        firstSeen: new Date(),
                    },
                    $set: {
                        name: cleanName,
                        email: cleanEmail,
                        ...(cleanPhone ? { phone: cleanPhone } : {}),
                        lastSeen: new Date(),
                    },
                },
                { upsert: true, new: true }
            );

            // 3. Send immediate pending emails (NO Google Meet created yet)
            const emailResult = await sendBookingPendingEmails({
                name: cleanName,
                email: cleanEmail,
                topic: cleanTopic,
                date: cleanDate,
                timeSlot: cleanTime,
                timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                message: cleanMsg,
            });

            const res = NextResponse.json({
                success: true,
                status: "pending",
                bookingId: booking.bookingId,
                message: "Consultation request received! Our team is reviewing availability and will email your confirmation shortly.",
                mode: emailResult.mode,
            });

            if (setCookieHeader) {
                res.cookies.set(VISITOR_COOKIE_NAME, visitorId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 365,
                });
            }

            return res;
        } else {
            // General contact message
            const { name, email, phone, message } = body;

            const cleanName = sanitizeText(name, 120);
            const cleanEmail = sanitizeText(email, 150).toLowerCase();
            const cleanPhone = sanitizeText(phone, 40);
            const cleanMsg = sanitizeText(message, 5000);

            if (!cleanName || !cleanEmail || !cleanMsg) {
                return NextResponse.json(
                    { error: "Missing required fields: name, email, and message." },
                    { status: 400 }
                );
            }

            if (!isValidEmail(cleanEmail)) {
                return NextResponse.json(
                    { error: "Please provide a valid email address." },
                    { status: 400 }
                );
            }

            // 1. Save inbound contact message to MongoDB Message collection
            const savedMessage = await Message.create({
                direction: "inbound",
                name: cleanName,
                email: cleanEmail,
                phone: cleanPhone || undefined,
                subject: `Inquiry from ${cleanName}`,
                body: cleanMsg,
                status: "unread",
                visitorId: visitorId || undefined,
                sentTo: "ajshajimmax@gmail.com",
                sentAt: new Date(),
            });

            // 2. Backfill identity onto Visitor in MongoDB
            await Visitor.findOneAndUpdate(
                { visitorId },
                {
                    $setOnInsert: {
                        visitorId,
                        firstSeen: new Date(),
                    },
                    $set: {
                        name: cleanName,
                        email: cleanEmail,
                        ...(cleanPhone ? { phone: cleanPhone } : {}),
                        lastSeen: new Date(),
                    },
                },
                { upsert: true, new: true }
            );

            // 3. Dispatch confirmation email to client & notification to ajshajimmax@gmail.com + strixdevs CC
            const result = await sendGeneralContactEmail({
                name: cleanName,
                email: cleanEmail,
                message: cleanPhone ? `${cleanMsg}\n\nPhone: ${cleanPhone}` : cleanMsg,
            });

            const res = NextResponse.json({
                success: true,
                messageId: savedMessage._id,
                message: "Message sent successfully and saved to database. An engineer will follow up within 24 hours.",
                mode: result.mode,
            });

            if (setCookieHeader) {
                res.cookies.set(VISITOR_COOKIE_NAME, visitorId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 365,
                });
            }

            return res;
        }
    } catch (error) {
        console.error("Error processing contact/booking submission:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to process request. Please try again.",
            },
            { status: 500 }
        );
    }
}

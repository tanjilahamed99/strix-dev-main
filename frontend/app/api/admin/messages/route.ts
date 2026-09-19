import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "~/lib/auth";
import connectToDatabase from "~/lib/db/mongodb";
import Message from "~/lib/db/models/Message";
import { sendDirectVisitorEmail } from "~/lib/mailer";
import { isValidEmail } from "~/lib/validation";

export async function GET(request: Request) {
    try {
        const authenticated = await isAuthenticatedAdmin(request);
        if (!authenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const messages = await Message.find().sort({ sentAt: -1 }).lean();
        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Error fetching messages from MongoDB:", error);
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const authenticated = await isAuthenticatedAdmin(request);
        if (!authenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { recipientEmail, recipientName, subject, body: messageBody, visitorId, bookingId } = body;

        if (!recipientEmail || !isValidEmail(recipientEmail)) {
            return NextResponse.json(
                { error: "Valid recipient email is required" },
                { status: 400 }
            );
        }

        if (!subject || !messageBody) {
            return NextResponse.json(
                { error: "Subject and message body are required" },
                { status: 400 }
            );
        }

        // Send direct email via Nodemailer
        await sendDirectVisitorEmail({
            to: recipientEmail,
            name: recipientName,
            subject,
            message: messageBody,
        });

        // Log message to MongoDB
        await connectToDatabase();
        const log = await Message.create({
            sentTo: recipientEmail,
            subject,
            body: messageBody,
            visitorId: visitorId || undefined,
            bookingId: bookingId || undefined,
            sentAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            message: "Email sent and logged to MongoDB successfully",
            log,
        });
    } catch (error) {
        console.error("Error sending direct visitor message:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to send message" },
            { status: 500 }
        );
    }
}

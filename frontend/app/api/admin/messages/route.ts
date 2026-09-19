import { NextResponse } from "next/server";
import mongoose from "mongoose";
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

        const allMessages = await Message.find().sort({ createdAt: -1, sentAt: -1 }).lean();

        const inbox = allMessages.filter(
            (m) => m.direction === "inbound" || (!m.direction && m.email && !m.sentTo)
        );
        const outbox = allMessages.filter(
            (m) => m.direction === "outbound" || (!m.direction && m.sentTo)
        );

        const unreadCount = inbox.filter((m) => m.status === "unread").length;

        return NextResponse.json({
            messages: allMessages,
            inbox,
            outbox,
            counts: {
                unreadInbox: unreadCount,
                totalInbox: inbox.length,
                totalOutbox: outbox.length,
            },
        });
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
        const {
            recipientEmail,
            recipientName,
            subject,
            body: messageBody,
            visitorId,
            bookingId,
            replyToMessageId,
        } = body;

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

        // Log outbound message to MongoDB
        await connectToDatabase();
        const log = await Message.create({
            direction: "outbound",
            sentTo: recipientEmail,
            recipientName: recipientName || undefined,
            subject,
            body: messageBody,
            status: "sent",
            visitorId: visitorId || undefined,
            bookingId: bookingId || undefined,
            sentAt: new Date(),
        });

        // If this is a reply to an inbound message, mark it as replied
        if (replyToMessageId) {
            await Message.findByIdAndUpdate(replyToMessageId, {
                status: "replied",
            });
        }

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

export async function PATCH(request: Request) {
    try {
        const authenticated = await isAuthenticatedAdmin(request);
        if (!authenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { messageId, status } = body;

        if (!messageId || !mongoose.isValidObjectId(messageId) || !status) {
            return NextResponse.json(
                { error: "Valid messageId and status are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();
        const updated = await Message.findByIdAndUpdate(
            messageId,
            { status },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ error: "Message not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: updated });
    } catch (error) {
        console.error("Error updating message status:", error);
        return NextResponse.json(
            { error: "Failed to update message" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const authenticated = await isAuthenticatedAdmin(request);
        if (!authenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const messageId = searchParams.get("id");

        if (!messageId || !mongoose.isValidObjectId(messageId)) {
            return NextResponse.json({ error: "Valid message id required" }, { status: 400 });
        }

        await connectToDatabase();
        await Message.findByIdAndDelete(messageId);

        return NextResponse.json({ success: true, message: "Message deleted" });
    } catch (error) {
        console.error("Error deleting message:", error);
        return NextResponse.json(
            { error: "Failed to delete message" },
            { status: 500 }
        );
    }
}

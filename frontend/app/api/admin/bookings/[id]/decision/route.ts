import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "~/lib/auth";
import connectToDatabase from "~/lib/db/mongodb";
import Booking from "~/lib/db/models/Booking";
import { createConsultationMeeting } from "~/lib/googleCalendar";
import {
    sendBookingConfirmedEmails,
    sendBookingDeclinedEmail,
} from "~/lib/mailer";

export async function POST(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authenticated = await isAuthenticatedAdmin(request);
        if (!authenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;
        await connectToDatabase();

        const booking = await Booking.findOne({
            $or: [{ bookingId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        const body = await request.json();
        const { action, decision, declineReason } = body as {
            action?: "accept" | "reject" | "cancel";
            decision?: "accept" | "reject" | "cancel";
            declineReason?: string;
        };
        const resolvedAction = action || decision;

        if (resolvedAction === "accept") {
            // 1. Create real Google Calendar + Meet event
            let meetUrl = process.env.NEXT_PUBLIC_GOOGLE_MEET_URL || "https://meet.google.com/strix-devs-meet";
            let calendarEventId: string | undefined;
            let calendarHtmlLink: string | undefined;

            try {
                const meeting = await createConsultationMeeting({
                    name: booking.name,
                    email: booking.email,
                    topic: booking.topic,
                    date: booking.date,
                    timeSlot: booking.timeSlot,
                    timezone: booking.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                });
                if (meeting.meetLink) meetUrl = meeting.meetLink;
                if (meeting.eventId) calendarEventId = meeting.eventId;
                if (meeting.eventLink) calendarHtmlLink = meeting.eventLink;
            } catch (calErr) {
                console.warn(
                    "Google Calendar meeting creation warning (falling back to default URL):",
                    calErr
                );
            }

            // 2. Update booking status to confirmed in MongoDB
            booking.status = "confirmed";
            booking.meetLink = meetUrl;
            booking.calendarEventId = calendarEventId;
            booking.calendarHtmlLink = calendarHtmlLink;
            booking.confirmedAt = new Date();
            await booking.save();

            // 3. Send official confirmation emails with Google Meet URL and .ics attachment
            await sendBookingConfirmedEmails({
                name: booking.name,
                email: booking.email,
                topic: booking.topic,
                date: booking.date,
                timeSlot: booking.timeSlot,
                timezone: booking.timezone,
                message: booking.message,
                googleMeetUrl: meetUrl,
            });

            return NextResponse.json({
                success: true,
                message: "Consultation confirmed! Google Meet scheduled and confirmation emails sent.",
                booking,
            });
        } else if (resolvedAction === "reject") {
            booking.status = "rejected";
            booking.declineReason = declineReason || "Schedule conflict";
            await booking.save();

            // Send polite decline email to client
            await sendBookingDeclinedEmail(
                {
                    name: booking.name,
                    email: booking.email,
                    topic: booking.topic,
                    date: booking.date,
                    timeSlot: booking.timeSlot,
                },
                declineReason
            );

            return NextResponse.json({
                success: true,
                message: "Booking rejected and notification email sent.",
                booking,
            });
        } else if (resolvedAction === "cancel") {
            booking.status = "cancelled";
            await booking.save();

            return NextResponse.json({
                success: true,
                message: "Booking cancelled.",
                booking,
            });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Error processing booking decision in MongoDB:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to process decision" },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "~/lib/auth";
import connectToDatabase from "~/lib/db/mongodb";
import Visitor from "~/lib/db/models/Visitor";
import PageView from "~/lib/db/models/PageView";
import Booking from "~/lib/db/models/Booking";
import Message from "~/lib/db/models/Message";

export async function GET(request: Request) {
    try {
        const authenticated = await isAuthenticatedAdmin(request);
        if (!authenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const limitParam = parseInt(searchParams.get("limit") || "250", 10);
        const limit = isNaN(limitParam) ? 250 : Math.min(500, Math.max(10, limitParam));

        const visitors = await Visitor.find().sort({ lastSeen: -1 }).limit(limit).lean();

        // Attach full page-view timeline, linked bookings, and messages for each visitor
        const enriched = await Promise.all(
            visitors.map(async (v) => {
                const [pageViews, linkedBookings, linkedMessages] = await Promise.all([
                    PageView.find({ visitorId: v.visitorId }).sort({ viewedAt: 1 }).lean(),
                    Booking.find({ visitorId: v.visitorId })
                        .select("bookingId topic date timeSlot status meetLink createdAt")
                        .sort({ createdAt: -1 })
                        .lean(),
                    Message.find({ visitorId: v.visitorId })
                        .select("subject body status direction createdAt sentAt")
                        .sort({ createdAt: -1 })
                        .lean(),
                ]);

                return {
                    ...v,
                    id: v.visitorId,
                    pageViews,
                    linkedBookings,
                    linkedMessages,
                };
            })
        );

        return NextResponse.json({ visitors: enriched });
    } catch (error) {
        console.error("Error fetching visitors from MongoDB:", error);
        return NextResponse.json(
            { error: "Failed to fetch visitors" },
            { status: 500 }
        );
    }
}

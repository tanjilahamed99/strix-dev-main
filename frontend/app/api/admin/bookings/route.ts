import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "~/lib/auth";
import connectToDatabase from "~/lib/db/mongodb";
import Booking from "~/lib/db/models/Booking";
import PageView from "~/lib/db/models/PageView";
import Visitor from "~/lib/db/models/Visitor";
import { runHygieneMaintenance } from "~/lib/cleanup";

export async function GET(request: Request) {
    try {
        const authenticated = await isAuthenticatedAdmin(request);
        if (!authenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        // 1. Run automatic 48h pending expiry and 90d pageview purge
        await runHygieneMaintenance();

        const { searchParams } = new URL(request.url);
        const statusFilter = searchParams.get("status");

        const query: Record<string, unknown> = {};
        if (statusFilter && statusFilter !== "all") {
            query.status = statusFilter;
        }

        const bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();

        // Attach visitor page trail count for each booking
        const enriched = await Promise.all(
            bookings.map(async (b) => {
                let pageViewsCount = 0;
                if (b.visitorId) {
                    pageViewsCount = await PageView.countDocuments({ visitorId: b.visitorId });
                }
                return {
                    ...b,
                    id: b.bookingId,
                    pageViewsCount,
                };
            })
        );

        // Calculate summary stats
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const [pendingCount, bookingsThisWeek, totalVisitors] = await Promise.all([
            Booking.countDocuments({ status: "pending" }),
            Booking.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
            Visitor.countDocuments(),
        ]);

        return NextResponse.json({
            bookings: enriched,
            stats: {
                pendingCount,
                bookingsThisWeek,
                totalVisitors,
            },
        });
    } catch (error) {
        console.error("Error fetching bookings from MongoDB:", error);
        return NextResponse.json(
            { error: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}

import connectToDatabase from "./db/mongodb";
import Booking from "./db/models/Booking";
import PageView from "./db/models/PageView";

/**
 * Runs routine maintenance in MongoDB:
 * 1. Auto-expires pending bookings untouched after 48h (Phase 6 requirement)
 * 2. Periodic purge of PageView documents older than 90 days (Phase 6 requirement)
 */
export async function runHygieneMaintenance(): Promise<{
    expiredBookings: number;
    purgedPageViews: number;
}> {
    try {
        await connectToDatabase();

        // 1. 48-hour cutoff for pending bookings
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        const expireResult = await Booking.updateMany(
            { status: "pending", createdAt: { $lt: fortyEightHoursAgo } },
            { $set: { status: "rejected", declineReason: "Auto-expired (untouched after 48h)" } }
        );

        // 2. 90-day cutoff for old PageViews
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const purgeResult = await PageView.deleteMany({
            viewedAt: { $lt: ninetyDaysAgo },
        });

        return {
            expiredBookings: expireResult.modifiedCount || 0,
            purgedPageViews: purgeResult.deletedCount || 0,
        };
    } catch (err) {
        console.warn("Hygiene maintenance warning:", err);
        return { expiredBookings: 0, purgedPageViews: 0 };
    }
}

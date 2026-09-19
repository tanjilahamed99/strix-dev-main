import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import connectToDatabase from "~/lib/db/mongodb";
import Visitor from "~/lib/db/models/Visitor";
import PageView from "~/lib/db/models/PageView";
import { getClientIp } from "~/lib/rateLimit";
import { VISITOR_COOKIE_NAME } from "~/lib/visitorCookie";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        let visitorId = cookieStore.get(VISITOR_COOKIE_NAME)?.value;

        const body = await request.json().catch(() => ({}));
        const path = body.path;

        if (!path) {
            return NextResponse.json({ success: false, error: "Missing path" }, { status: 400 });
        }

        // If no cookie set (e.g. before consent), do not track
        if (!visitorId) {
            return NextResponse.json({ success: false, message: "No visitor session" });
        }

        await connectToDatabase();

        const ip = getClientIp(request);
        const ipHash = crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16);
        const userAgent = body.userAgent || request.headers.get("user-agent") || undefined;
        const referrer = body.referrer || request.headers.get("referer") || undefined;

        // Server-side location extraction from edge/proxy headers
        const city = request.headers.get("x-vercel-ip-city") || request.headers.get("cf-ipcity");
        const country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry");
        const location = city && country ? `${city}, ${country}` : country || undefined;

        // 1. Upsert Visitor in MongoDB
        await Visitor.findOneAndUpdate(
            { visitorId },
            {
                $setOnInsert: {
                    visitorId,
                    firstSeen: new Date(),
                },
                $inc: { visitCount: 1 },
                $set: {
                    lastSeen: new Date(),
                    ipHash,
                    ...(userAgent ? { userAgent } : {}),
                    ...(referrer ? { referrer } : {}),
                    ...(location ? { location } : {}),
                },
            },
            { upsert: true, new: true }
        );

        // 2. Insert PageView document in MongoDB
        await PageView.create({
            visitorId,
            path,
            viewedAt: new Date(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.warn("Track API warning:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import connectToDatabase from "~/lib/db/mongodb";
import Visitor from "~/lib/db/models/Visitor";
import PageView from "~/lib/db/models/PageView";
import { resolveGeoLocation } from "~/lib/geo";
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

        const geo = await resolveGeoLocation(request, {
            timezone: body.timezone,
            language: body.language,
        });

        const ipHash = crypto
            .createHash("sha256")
            .update(geo.ip)
            .digest("hex")
            .substring(0, 16);

        const userAgent = body.userAgent || request.headers.get("user-agent") || undefined;
        const referrer = body.referrer || request.headers.get("referer") || undefined;

        // 1. Upsert Visitor in MongoDB with exact location and identity
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
                    ip: geo.ip,
                    ipHash,
                    country: geo.country,
                    countryCode: geo.countryCode,
                    city: geo.city,
                    region: geo.region,
                    location: geo.location,
                    timezone: geo.timezone,
                    device: geo.device,
                    browser: geo.browser,
                    os: geo.os,
                    ...(userAgent ? { userAgent } : {}),
                    ...(referrer ? { referrer } : {}),
                    ...(body.screen ? { screen: body.screen } : {}),
                    ...(body.language ? { language: body.language } : {}),
                    ...(body.name ? { name: body.name } : {}),
                    ...(body.email ? { email: body.email } : {}),
                    ...(body.phone ? { phone: body.phone } : {}),
                    ...(body.utmSource ? { utmSource: body.utmSource } : {}),
                    ...(body.utmMedium ? { utmMedium: body.utmMedium } : {}),
                    ...(body.utmCampaign ? { utmCampaign: body.utmCampaign } : {}),
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

        return NextResponse.json({ success: true, location: geo.location });
    } catch (error) {
        console.warn("Track API warning:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

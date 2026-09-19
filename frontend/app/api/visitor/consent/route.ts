import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import connectToDatabase from "~/lib/db/mongodb";
import Visitor from "~/lib/db/models/Visitor";
import { resolveGeoLocation } from "~/lib/geo";
import { VISITOR_COOKIE_NAME } from "~/lib/visitorCookie";

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const cookieStore = await cookies();
        let visitorId = cookieStore.get(VISITOR_COOKIE_NAME)?.value;

        if (!visitorId) {
            visitorId = `vid_${crypto.randomUUID().replace(/-/g, "")}`;
        }

        const body = await request.json().catch(() => ({}));
        const userAgent = request.headers.get("user-agent") || undefined;

        // Resolve exact IP geolocation and device details
        const geo = await resolveGeoLocation(request, {
            timezone: body.timezone,
            language: body.language,
        });

        const ipHash = crypto
            .createHash("sha256")
            .update(geo.ip)
            .digest("hex")
            .substring(0, 16);

        await Visitor.findOneAndUpdate(
            { visitorId },
            {
                $setOnInsert: {
                    visitorId,
                    firstSeen: new Date(),
                    visitCount: 1,
                },
                $set: {
                    lastSeen: new Date(),
                    consentedAt: new Date(),
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
                    ...(body.screen ? { screen: body.screen } : {}),
                    ...(body.language ? { language: body.language } : {}),
                    ...(body.referrer ? { referrer: body.referrer } : {}),
                    ...(body.name ? { name: body.name } : {}),
                    ...(body.email ? { email: body.email } : {}),
                    ...(body.phone ? { phone: body.phone } : {}),
                },
            },
            { upsert: true, new: true }
        );

        const response = NextResponse.json({
            success: true,
            visitorId,
            location: geo.location,
            country: geo.country,
            city: geo.city,
        });

        response.cookies.set(VISITOR_COOKIE_NAME, visitorId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 365, // 1 year
        });

        return response;
    } catch (error) {
        console.error("Error setting visitor consent:", error);
        return NextResponse.json({ error: "Failed to record consent" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import connectToDatabase from "~/lib/db/mongodb";
import Visitor from "~/lib/db/models/Visitor";
import { getClientIp } from "~/lib/rateLimit";

import { VISITOR_COOKIE_NAME } from "~/lib/visitorCookie";

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const cookieStore = await cookies();
        let visitorId = cookieStore.get(VISITOR_COOKIE_NAME)?.value;

        if (!visitorId) {
            visitorId = `vid_${crypto.randomUUID().replace(/-/g, "")}`;
        }

        // Set httpOnly, secure cookie
        cookieStore.set(VISITOR_COOKIE_NAME, visitorId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 365, // 1 year
        });

        const ip = getClientIp(request);
        const ipHash = crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16);
        const userAgent = request.headers.get("user-agent") || undefined;
        const city = request.headers.get("x-vercel-ip-city") || request.headers.get("cf-ipcity");
        const country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry");
        const location = city && country ? `${city}, ${country}` : country || undefined;

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
                    ipHash,
                    userAgent,
                    ...(location ? { location } : {}),
                },
            },
            { upsert: true, new: true }
        );

        const response = NextResponse.json({ success: true, visitorId });
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

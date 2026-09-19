import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "~/lib/db/mongodb";
import Visitor from "~/lib/db/models/Visitor";

import { VISITOR_COOKIE_NAME } from "~/lib/visitorCookie";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const visitorId = cookieStore.get(VISITOR_COOKIE_NAME)?.value;

        if (!visitorId) {
            return NextResponse.json({
                found: false,
                name: "",
                email: "",
                phone: "",
            });
        }

        await connectToDatabase();
        const visitor = await Visitor.findOne({ visitorId }).lean();

        if (!visitor) {
            return NextResponse.json({
                found: false,
                name: "",
                email: "",
                phone: "",
            });
        }

        return NextResponse.json({
            found: Boolean(visitor.name || visitor.email || visitor.phone),
            name: visitor.name || "",
            email: visitor.email || "",
            phone: visitor.phone || "",
            location: visitor.location || "",
        });
    } catch (error) {
        console.error("Error fetching visitor me profile:", error);
        return NextResponse.json(
            { found: false, name: "", email: "", phone: "" },
            { status: 500 }
        );
    }
}

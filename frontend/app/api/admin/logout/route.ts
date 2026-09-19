import { NextResponse } from "next/server";
import { clearAdminSession } from "~/lib/auth";

export async function POST() {
    try {
        const response = NextResponse.json({ success: true });
        await clearAdminSession(response);
        return response;
    } catch {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { checkAdminPassword, setAdminSession } from "~/lib/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        if (!password || !checkAdminPassword(password)) {
            return NextResponse.json(
                { error: "Invalid admin password" },
                { status: 401 }
            );
        }

        const response = NextResponse.json({
            success: true,
            message: "Authenticated successfully",
        });

        await setAdminSession(response);

        return response;
    } catch (error) {
        console.error("Admin login error:", error);
        return NextResponse.json(
            { error: "Failed to authenticate" },
            { status: 500 }
        );
    }
}

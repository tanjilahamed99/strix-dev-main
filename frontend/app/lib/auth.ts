import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "strix_admin_token";
const SECRET = process.env.ADMIN_SESSION_SECRET || "strix-devs-secure-admin-secret-2026-key";
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "strixdevs123";

function signToken(payload: string): string {
    const signature = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    return `${payload}.${signature}`;
}

function verifyToken(token: string): boolean {
    if (!token || !token.includes(".")) return false;
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return false;

    const expectedSig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    
    // Constant-time signature comparison to prevent timing attacks
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
        return false;
    }

    // Check expiry (24 hours)
    const timestamp = parseInt(payload, 10);
    if (isNaN(timestamp)) return false;
    const ageMs = Date.now() - timestamp;
    return ageMs >= 0 && ageMs < 24 * 60 * 60 * 1000;
}

export function checkAdminPassword(password: string): boolean {
    if (typeof password !== "string") return false;
    const inputBuf = Buffer.from(password);
    const targetBuf = Buffer.from(DEFAULT_PASSWORD);
    if (inputBuf.length !== targetBuf.length) return false;
    return crypto.timingSafeEqual(inputBuf, targetBuf);
}

export async function setAdminSession(response?: any): Promise<string> {
    const token = signToken(Date.now().toString());
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
    };
    if (response && response.cookies) {
        response.cookies.set(COOKIE_NAME, token, cookieOptions);
    }
    try {
        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, token, cookieOptions);
    } catch {
        // Ignored if called where cookies() cannot be mutated
    }
    return token;
}

export async function clearAdminSession(response?: any): Promise<void> {
    if (response && response.cookies) {
        response.cookies.delete(COOKIE_NAME);
    }
    try {
        const cookieStore = await cookies();
        cookieStore.delete(COOKIE_NAME);
    } catch {
        // Ignored
    }
}

export async function isAuthenticatedAdmin(request?: Request): Promise<boolean> {
    if (request) {
        const headerPass = request.headers.get("x-admin-passcode");
        if (headerPass && checkAdminPassword(headerPass)) {
            return true;
        }
    }
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        if (!token) return false;
        return verifyToken(token);
    } catch {
        return false;
    }
}

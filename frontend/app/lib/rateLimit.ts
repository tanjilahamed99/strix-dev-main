interface RateLimitRecord {
    count: number;
    resetAt: number;
}

const ipMap = new Map<string, RateLimitRecord>();

/**
 * Basic in-memory rate limiter per IP address
 * @param ip Client IP address
 * @param limit Max allowed requests within windowMs
 * @param windowMs Window duration in milliseconds (default: 10 minutes)
 */
export function checkRateLimit(
    ip: string,
    limit = 6,
    windowMs = 10 * 60 * 1000
): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const record = ipMap.get(ip);

    // Clean up if expired
    if (!record || now > record.resetAt) {
        ipMap.set(ip, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: limit - 1 };
    }

    if (record.count >= limit) {
        return { allowed: false, remaining: 0 };
    }

    record.count += 1;
    return { allowed: true, remaining: limit - record.count };
}

export function getClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    return request.headers.get("x-real-ip") || "127.0.0.1";
}

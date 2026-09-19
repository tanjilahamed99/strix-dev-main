export interface GeoData {
    ip: string;
    country?: string;
    countryCode?: string;
    city?: string;
    region?: string;
    location?: string;
    timezone?: string;
    device?: string;
    browser?: string;
    os?: string;
}

/**
 * Checks if an IP is localhost or a private local network address
 */
export function isPrivateOrLocalIp(ip: string): boolean {
    if (!ip) return true;
    const clean = ip.replace(/^::ffff:/, "").trim();
    return (
        clean === "127.0.0.1" ||
        clean === "::1" ||
        clean === "localhost" ||
        clean.startsWith("10.") ||
        clean.startsWith("192.168.") ||
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(clean) ||
        clean.startsWith("fc00:") ||
        clean.startsWith("fe80:")
    );
}

/**
 * Extracts client IP from standard proxy / CDN headers
 */
export function getClientIpAddress(request: Request): string {
    const cfIp = request.headers.get("cf-connecting-ip");
    if (cfIp) return cfIp.trim();

    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();

    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        const first = forwarded.split(",")[0]?.trim();
        if (first) return first;
    }

    return "127.0.0.1";
}

/**
 * Parses User-Agent header into readable Device, Browser, and OS strings
 */
export function parseUserAgent(ua?: string): { device: string; browser: string; os: string } {
    if (!ua) {
        return { device: "Desktop", browser: "Unknown", os: "Unknown" };
    }

    // Device
    let device = "Desktop";
    if (/tablet|ipad/i.test(ua)) {
        device = "Tablet";
    } else if (/mobile|iphone|android/i.test(ua)) {
        device = "Mobile";
    }

    // OS
    let os = "Unknown";
    if (/windows/i.test(ua)) os = "Windows";
    else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
    else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
    else if (/android/i.test(ua)) os = "Android";
    else if (/linux/i.test(ua)) os = "Linux";

    // Browser
    let browser = "Unknown";
    if (/edg\//i.test(ua)) browser = "Edge";
    else if (/opr\/|opera/i.test(ua)) browser = "Opera";
    else if (/chrome|crios/i.test(ua)) browser = "Chrome";
    else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";

    return { device, browser, os };
}

/**
 * Resolves precise Geolocation using edge headers with fallback to ip-api.com
 */
export async function resolveGeoLocation(
    request: Request,
    clientHint?: { timezone?: string; language?: string }
): Promise<GeoData> {
    const ip = getClientIpAddress(request);
    const ua = request.headers.get("user-agent") || undefined;
    const { device, browser, os } = parseUserAgent(ua);

    // 1. Check CDN edge headers first (Vercel, Cloudflare)
    const headerCity =
        request.headers.get("x-vercel-ip-city") ||
        request.headers.get("cf-ipcity") ||
        undefined;
    const headerCountry =
        request.headers.get("x-vercel-ip-country") ||
        request.headers.get("cf-ipcountry") ||
        undefined;
    const headerRegion =
        request.headers.get("x-vercel-ip-country-region") || undefined;
    const headerTimezone =
        request.headers.get("x-vercel-ip-timezone") ||
        clientHint?.timezone ||
        undefined;

    if (headerCountry) {
        const city = headerCity ? decodeURIComponent(headerCity) : undefined;
        const country = headerCountry;
        const location = city ? `${city}, ${country}` : country;

        return {
            ip,
            country,
            city,
            region: headerRegion,
            location,
            timezone: headerTimezone,
            device,
            browser,
            os,
        };
    }

    // 2. If running locally or private IP, return local info
    if (isPrivateOrLocalIp(ip)) {
        return {
            ip: "127.0.0.1 (Local Dev)",
            country: "Localhost",
            countryCode: "LOC",
            city: "Dev Environment",
            region: "Local",
            location: "Localhost / Dev Environment",
            timezone: clientHint?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            device,
            browser,
            os,
        };
    }

    // 3. For public IP, query IP Geolocation service with 1.8s timeout
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1800);

        const res = await fetch(
            `http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,timezone`,
            { signal: controller.signal }
        );
        clearTimeout(timeout);

        if (res.ok) {
            const data = await res.json();
            if (data?.status === "success") {
                const city = data.city || undefined;
                const country = data.country || undefined;
                const location =
                    city && country ? `${city}, ${country}` : country || city || undefined;

                return {
                    ip,
                    country,
                    countryCode: data.countryCode,
                    city,
                    region: data.regionName,
                    location,
                    timezone: data.timezone || clientHint?.timezone,
                    device,
                    browser,
                    os,
                };
            }
        }
    } catch {
        // Fallback silently if offline or service unavailable
    }

    return {
        ip,
        timezone: clientHint?.timezone,
        device,
        browser,
        os,
    };
}

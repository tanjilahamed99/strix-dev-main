"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { COOKIE_CONSENT_KEY } from "./CookieConsent";

export const VISITOR_IDENTITY_KEY = "strix_visitor_identity";

export default function VisitorTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window === "undefined" || pathname?.startsWith("/admin")) {
            return;
        }

        // 1. Auto-capture identity and campaign parameters from URL if present
        let currentIdentity: {
            name?: string;
            email?: string;
            phone?: string;
            utmSource?: string;
            utmMedium?: string;
            utmCampaign?: string;
        } = {};

        try {
            const stored = localStorage.getItem(VISITOR_IDENTITY_KEY);
            if (stored) currentIdentity = JSON.parse(stored);
        } catch {}

        if (searchParams) {
            const paramName = searchParams.get("name");
            const paramEmail = searchParams.get("email");
            const paramPhone = searchParams.get("phone");
            const utmSource = searchParams.get("utm_source");
            const utmMedium = searchParams.get("utm_medium");
            const utmCampaign = searchParams.get("utm_campaign");

            let hasNewParams = false;
            if (paramName && paramName !== currentIdentity.name) {
                currentIdentity.name = paramName;
                hasNewParams = true;
            }
            if (paramEmail && paramEmail !== currentIdentity.email) {
                currentIdentity.email = paramEmail;
                hasNewParams = true;
            }
            if (paramPhone && paramPhone !== currentIdentity.phone) {
                currentIdentity.phone = paramPhone;
                hasNewParams = true;
            }
            if (utmSource) currentIdentity.utmSource = utmSource;
            if (utmMedium) currentIdentity.utmMedium = utmMedium;
            if (utmCampaign) currentIdentity.utmCampaign = utmCampaign;

            if (hasNewParams || utmSource || utmCampaign) {
                try {
                    localStorage.setItem(VISITOR_IDENTITY_KEY, JSON.stringify(currentIdentity));
                } catch {}
            }
        }

        const trackCurrentPage = () => {
            const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (consent !== "accepted") return;

            fetch("/api/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    path: pathname,
                    referrer: document.referrer || undefined,
                    userAgent: navigator.userAgent,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    screen: `${window.screen.width}x${window.screen.height}`,
                    language: navigator.language,
                    ...currentIdentity,
                }),
            }).catch(() => {
                // Ignore tracking failures silently
            });
        };

        trackCurrentPage();

        const onConsentAccepted = () => {
            trackCurrentPage();
        };

        window.addEventListener("strix-cookie-consent-accepted", onConsentAccepted);
        return () => {
            window.removeEventListener("strix-cookie-consent-accepted", onConsentAccepted);
        };
    }, [pathname, searchParams]);

    return null;
}

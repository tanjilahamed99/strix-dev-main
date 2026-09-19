"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { COOKIE_CONSENT_KEY } from "./CookieConsent";

export default function VisitorTracker() {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === "undefined" || pathname?.startsWith("/admin")) {
            return;
        }

        const trackCurrentPage = () => {
            const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (consent !== "accepted") return;

            fetch("/api/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    path: pathname,
                    referrer: document.referrer,
                    userAgent: navigator.userAgent,
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
    }, [pathname]);

    return null;
}

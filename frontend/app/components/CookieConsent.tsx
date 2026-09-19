"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

export const COOKIE_CONSENT_KEY = "strix_cookie_consent";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1200);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = async () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
        setIsVisible(false);

        try {
            // Server sets httpOnly, secure, opaque visitor_id cookie and registers visitor
            await fetch("/api/visitor/consent", { method: "POST" });
            window.dispatchEvent(new CustomEvent("strix-cookie-consent-accepted"));
        } catch (err) {
            console.warn("Consent registration warning:", err);
        }
    };

    const handleDecline = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 80, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50"
                >
                    <div className="p-5 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-[0_10px_40px_rgba(0,0,0,0.6)] text-foreground">
                        <div className="flex items-start gap-3.5">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                                <Cookie className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                        Cookie & Privacy Preferences
                                    </h4>
                                    <button
                                        onClick={handleDecline}
                                        className="text-muted-foreground hover:text-foreground p-1"
                                        aria-label="Close"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                                    We use privacy-friendly analytics cookies to improve our consultation matching and understand your technical requirements. We never sell your data.
                                </p>
                                <div className="flex items-center gap-2.5 mt-4">
                                    <button
                                        onClick={handleAccept}
                                        className="btn-primary text-xs py-2 px-4 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                                    >
                                        Accept Cookies
                                    </button>
                                    <button
                                        onClick={handleDecline}
                                        className="btn-outline text-xs py-2 px-3.5"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

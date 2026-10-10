"use client";

import dynamic from "next/dynamic";

// Code-split and defer non-critical interactive widgets out of the initial server and critical JS bundle
const CustomCursor = dynamic(() => import("~/components/CustomCursor"), {
    ssr: false,
});

const BookConsultationModal = dynamic(
    () => import("~/components/BookConsultationModal"),
    { ssr: false }
);

const CookieConsent = dynamic(() => import("~/components/CookieConsent"), {
    ssr: false,
});

export default function ClientWidgets() {
    return (
        <>
            <BookConsultationModal />
            <CookieConsent />
            <CustomCursor />
        </>
    );
}

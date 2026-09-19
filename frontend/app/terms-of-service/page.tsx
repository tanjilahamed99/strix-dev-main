import type { Metadata } from "next";
import LegalDocument from "~/components/LegalDoc/Legaldocument";
import { termsOfServiceData } from "~/Data/Termsofservice";

export const metadata: Metadata = {
    title: "Terms of Service | Strix Devs",
    description: "Read the Terms of Service for working with Strix Devs software development agency.",
    alternates: {
        canonical: "/terms-of-service",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function TermsOfServicePage() {
    return <LegalDocument data={termsOfServiceData} />;
}

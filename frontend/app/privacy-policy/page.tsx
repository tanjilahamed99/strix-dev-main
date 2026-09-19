import type { Metadata } from "next";
import LegalDocument from "~/components/LegalDoc/Legaldocument";
import { privacyPolicyData } from "~/Data/Privacypolicy";

export const metadata: Metadata = {
    title: "Privacy Policy | Strix Devs",
    description: "Read the Strix Devs Privacy Policy. Learn how we handle, collect, and protect your data.",
    alternates: {
        canonical: "/privacy-policy",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function PrivacyPolicyPage() {
    return <LegalDocument data={privacyPolicyData} />;
}

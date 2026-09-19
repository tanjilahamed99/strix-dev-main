import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./app.css";
import Navbar from "~/components/Navbar";
import CustomCursor from "~/components/CustomCursor";
import Footer from "~/components/Footer";
import FloatingContactFAB from "~/components/FloatingContactFAB";
import BookConsultationModal from "~/components/BookConsultationModal";
import CookieConsent from "~/components/CookieConsent";
import VisitorTracker from "~/components/VisitorTracker";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://strixdevs.com";
const COMPANY = "Strix Devs";
const TAGLINE = "Full-Stack Web Development, SaaS & AI Automation Agency";
const DESCRIPTION =
    "Strix Devs is a full-stack engineering and software development agency. We build custom web applications, scalable SaaS MVPs, AI automation pipelines, and cloud systems using Next.js, React, Node.js, and modern AI/LLM technologies. Book a free 30-minute consultation.";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${COMPANY} — ${TAGLINE}`,
        template: `%s | ${COMPANY}`,
    },
    description: DESCRIPTION,
    applicationName: COMPANY,
    authors: [{ name: COMPANY, url: SITE_URL }],
    generator: "Next.js",
    keywords: [
        "Strix Devs",
        "custom web application development",
        "SaaS development agency",
        "Next.js agency",
        "React developers",
        "AI automation agency",
        "RAG development",
        "hire software engineers",
        "MVP development for startups",
        "full stack web development",
        "Node.js development services",
        "free software consultation",
        "book tech consultation",
    ],
    creator: COMPANY,
    publisher: COMPANY,
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: SITE_URL,
        siteName: COMPANY,
        title: `${COMPANY} — ${TAGLINE}`,
        description: DESCRIPTION,
        images: [
            {
                url: "https://i.ibb.co.com/Z189FpgK/strixdevs.png",
                width: 1200,
                height: 630,
                alt: "Strix Devs - Web Development & AI Solutions Agency",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${COMPANY} — ${TAGLINE}`,
        description: DESCRIPTION,
        creator: "@strixdevs",
        site: "@strixdevs",
        images: ["https://i.ibb.co.com/Z189FpgK/strixdevs.png"],
    },
    icons: {
        icon: [
            { url: "/images/icon.png" },
            { url: "/favicon.svg", type: "image/svg+xml" },
        ],
        apple: [{ url: "/images/strixdevs.png" }],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Global Schema.org JSON-LD definitions for Organization, ProfessionalService, and WebSite
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: COMPANY,
        url: SITE_URL,
        logo: `${SITE_URL}/images/icon1.png`,
        image: "https://i.ibb.co.com/Z189FpgK/strixdevs.png",
        description: DESCRIPTION,
        email: "info@strixdevs.com",
        foundingDate: "2024",
        areaServed: "Worldwide",
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: "info@strixdevs.com",
            availableLanguage: ["English"],
        },
        sameAs: [
            "https://linkedin.com/company/strixdevs",
            "https://x.com/strixdevs",
            "https://github.com/strixdevs1",
            "https://facebook.com/strixdevs.1",
            "https://instagram.com/strix.devs",
        ],
    };

    const professionalServiceSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: COMPANY,
        url: SITE_URL,
        image: "https://i.ibb.co.com/Z189FpgK/strixdevs.png",
        priceRange: "$$",
        address: {
            "@type": "PostalAddress",
            addressLocality: "Toronto",
            addressRegion: "Ontario",
            addressCountry: "CA",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: 43.6532,
            longitude: -79.3832,
        },
        serviceType: [
            "Custom Web Application Development",
            "SaaS MVP Development",
            "AI Automation & RAG Systems",
            "API Development & System Integration",
            "Cloud Deployment & DevOps",
            "Software Architecture Consultation",
        ],
        potentialAction: {
            "@type": "ReserveAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/contact`,
                actionPlatform: [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform",
                ],
            },
            result: {
                "@type": "Reservation",
                name: "Free 30-Minute Google Meet Consultation",
            },
        },
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: COMPANY,
        url: SITE_URL,
        potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <html lang="en" className="dark scroll-smooth">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationSchema),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(professionalServiceSchema),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(websiteSchema),
                    }}
                />
            </head>
            <body className="min-h-screen bg-background text-foreground overflow-x-hidden antialiased selection:bg-foreground selection:text-background">
                <Navbar />
                <main className="min-h-screen">
                    {children}
                </main>
                <BookConsultationModal />
                <FloatingContactFAB />
                <CookieConsent />
                <Suspense fallback={null}>
                    <VisitorTracker />
                </Suspense>
                <CustomCursor />
                <Footer />
            </body>
        </html>
    );
}

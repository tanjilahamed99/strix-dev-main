import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Outfit, Playfair_Display } from "next/font/google";
import "./app.css";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import FloatingContactFAB from "~/components/FloatingContactFAB";
import VisitorTracker from "~/components/VisitorTracker";
import ClientWidgets from "~/components/ClientWidgets";

const outfit = Outfit({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-outfit",
});

const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-playfair",
});

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
        "web development agency New York",
        "custom software development Chicago",
        "SaaS development agency Toronto",
        "AI automation agency San Francisco",
        "software development company London UK",
        "web developers Toronto ON Canada",
        "Next.js agency New York NY",
        "hire software engineers Chicago IL",
        "full stack developers San Francisco CA",
        "tech consulting London",
    ],
    creator: COMPANY,
    publisher: COMPANY,
    other: {
        "geo.region": "US-NY;US-IL;CA-ON;US-CA;GB-ENG",
        "geo.placename": "New York, Chicago, Toronto, San Francisco, London",
    },
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
        types: {
            "text/markdown": "/llms.txt",
        },
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
                url: `${SITE_URL}/images/strixdevs.jpg`,
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
        images: [`${SITE_URL}/images/strixdevs.jpg`],
    },
    icons: {
        icon: [
            { url: "/images/icon.jpg" },
            { url: "/favicon.svg", type: "image/svg+xml" },
        ],
        apple: [{ url: "/images/strixdevs.jpg" }],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Target strategic service locations for Local SEO & Schema.org indexing
    const serviceAreas = [
        {
            "@type": "City",
            name: "New York",
            addressRegion: "NY",
            addressCountry: "US",
        },
        {
            "@type": "City",
            name: "Chicago",
            addressRegion: "IL",
            addressCountry: "US",
        },
        {
            "@type": "City",
            name: "Toronto",
            addressRegion: "ON",
            addressCountry: "CA",
        },
        {
            "@type": "City",
            name: "San Francisco",
            addressRegion: "CA",
            addressCountry: "US",
        },
        {
            "@type": "City",
            name: "London",
            addressCountry: "GB",
        },
    ];

    // Global Schema.org JSON-LD definitions for Organization, ProfessionalService, and WebSite
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: COMPANY,
        url: SITE_URL,
        logo: `${SITE_URL}/images/icon1.jpg`,
        image: `${SITE_URL}/images/strixdevs.jpg`,
        description: DESCRIPTION,
        email: "info@strixdevs.com",
        foundingDate: "2024",
        areaServed: [
            ...serviceAreas,
            {
                "@type": "Country",
                name: "United States",
            },
            {
                "@type": "Country",
                name: "Canada",
            },
            {
                "@type": "Country",
                name: "United Kingdom",
            },
            {
                "@type": "AdministrativeArea",
                name: "Worldwide",
            },
        ],
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: "info@strixdevs.com",
            availableLanguage: ["English"],
        },
        sameAs: [
            "https://linkedin.com/company/strixdevs",
            "https://x.com/strixdevs",
            "https://github.com/strixdevsagency",
            "https://facebook.com/strixdevsagency",
            "https://instagram.com/strixdevsagency",
        ],
    };

    const professionalServiceSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: COMPANY,
        url: SITE_URL,
        logo: `${SITE_URL}/images/icon1.jpg`,
        image: `${SITE_URL}/images/strixdevs.jpg`,
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
        areaServed: serviceAreas,
        serviceArea: serviceAreas,
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
        <html
            lang="en"
            className={`${outfit.variable} ${playfairDisplay.variable} dark scroll-smooth`}
        >
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
                <ClientWidgets />
                <FloatingContactFAB />
                <Suspense fallback={null}>
                    <VisitorTracker />
                </Suspense>
                <Footer />
            </body>
        </html>
    );
}

import {
    isRouteErrorResponse,
    Meta,
    Links,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";
import Footer from "./components/Footer";

/* ─── Site-wide SEO constants ─────────────────────────────────── */
const SITE_URL = "https://strixdevs.com";
const COMPANY = "Strix Devs";
const TAGLINE = "We Build Scalable Web Applications";
const DESCRIPTION =
    "Strix Devs is a full-stack software development studio building high-performance web applications, SaaS platforms, and custom business systems using React, Next.js, Node.js and cloud infrastructure. We help startups and companies turn ideas into production-ready products.";

const OG_IMAGE = "https://i.ibb.co.com/Z189FpgK/strixdevs.png";
const TWITTER = "@strixdevs";

/* ─── META ─────────────────────────────────────────────────────── */
export function meta(): Route.MetaDescriptors {
    return [
        { title: `${COMPANY} — ${TAGLINE}` },

        { name: "description", content: DESCRIPTION },

        { name: "robots", content: "index, follow" },
        {
            name: "googlebot",
            content: "index, follow, max-snippet:-1, max-image-preview:large",
        },

        { name: "author", content: COMPANY },
        { name: "geo.region", content: "BD" },
        { name: "geo.placename", content: "Dhaka" },
        { name: "geo.position", content: "23.8103;90.4125" },
        { name: "ICBM", content: "23.8103, 90.4125" },

        /* ── Keywords (FIXED) ── */
        {
            name: "keywords",
            content: [
                "Strix Devs",
                "software development agency",
                "web application development",
                "SaaS development",
                "React developers",
                "Next.js agency",
                "Node.js development",
                "custom software development",
                "startup tech partner",
                "full stack development company",
                "hire web developers",
            ].join(", "),
        },

        /* ── Open Graph ── */
        { property: "og:type", content: "website" },
        { property: "og:url", content: SITE_URL },
        { property: "og:site_name", content: COMPANY },
        { property: "og:title", content: `${COMPANY} — ${TAGLINE}` },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:image", content: OG_IMAGE },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: `${COMPANY} preview` },
        { property: "og:locale", content: "en_US" },

        /* ── Twitter ── */
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: TWITTER },
        { name: "twitter:creator", content: TWITTER },
        { name: "twitter:title", content: `${COMPANY} — ${TAGLINE}` },
        { name: "twitter:description", content: DESCRIPTION },
        { name: "twitter:image", content: OG_IMAGE },

        /* ── Canonical ── */
        { tagName: "link", rel: "canonical", href: SITE_URL },
    ];
}

/* ─── LAYOUT ─────────────────────────────────────────────────── */
export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />

                {/* UX + SEO */}
                <meta name="theme-color" content="#0a0a0a" />
                <meta name="format-detection" content="telephone=no" />

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link
                    rel="apple-touch-icon"
                    href="https://i.ibb.co.com/Z189FpgK/strixdevs.png"
                />

                {/* ── Organization Schema ── */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: COMPANY,
                            url: SITE_URL,
                            logo: OG_IMAGE,
                            description: DESCRIPTION,
                            email: "ajshajimmax@gmail.com",
                            foundingDate: "2024",
                            areaServed: "Worldwide",
                            contactPoint: {
                                "@type": "ContactPoint",
                                contactType: "sales",
                                email: "ajshajimmax@gmail.com",
                            },
                            sameAs: [
                                "https://linkedin.com/company/strixdevs",
                                "https://twitter.com/strixdevs",
                                "https://github.com/strixdevs",
                            ],
                        }),
                    }}
                />

                {/* ── Local Business Schema ── */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ProfessionalService",
                            name: COMPANY,
                            url: SITE_URL,
                            image: OG_IMAGE,
                            telephone: "+881518933208",
                            priceRange: "$$",
                            address: {
                                "@type": "PostalAddress",
                                addressCountry: "BD",
                                addressLocality: "Dhaka",
                            },
                            geo: {
                                "@type": "GeoCoordinates",
                                latitude: 23.8103,
                                longitude: 90.4125,
                            },
                            serviceType: [
                                "Web Development",
                                "E-Commerce Development",
                                "SaaS Development",
                                "Custom Web App",
                                "UI/UX Design",
                                "API Development",
                                "Web Support & Maintenance",
                            ],
                        }),
                    }}
                />

                {/* ── Website Schema ── */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            name: COMPANY,
                            url: SITE_URL,
                            potentialAction: {
                                "@type": "SearchAction",
                                target: `${SITE_URL}/?q={search_term_string}`,
                                "query-input":
                                    "required name=search_term_string",
                            },
                        }),
                    }}
                />

                <Meta />
                <Links />
            </head>

            <body>
                <Navbar />
                {children}
                <CustomCursor />
                <Footer />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

/* ─── APP ─────────────────────────────────────────────────────── */
export default function App() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Outlet />
        </div>
    );
}

/* ─── ERROR BOUNDARY ─────────────────────────────────────────── */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Something went wrong";
    let details = "Unexpected error occurred.";
    let is404 = false;
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        is404 = error.status === 404;
        message = is404 ? "Page not found" : `Error ${error.status}`;
        details = is404
            ? "This page doesn’t exist or was moved."
            : error.statusText || details;
    } else if (import.meta.env.DEV && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-lg text-center">
                <h1 className="text-6xl font-bold text-primary mb-4">
                    {is404 ? "404" : "500"}
                </h1>
                <h2 className="text-2xl font-semibold mb-3">{message}</h2>
                <p className="text-muted-foreground mb-8">{details}</p>

                <a
                    href="/"
                    className="px-6 py-3 rounded-lg bg-primary text-white"
                >
                    Go Home
                </a>

                {stack && (
                    <pre className="mt-8 text-xs text-left bg-muted p-4 overflow-x-auto">
                        <code>{stack}</code>
                    </pre>
                )}
            </div>
        </main>
    );
}

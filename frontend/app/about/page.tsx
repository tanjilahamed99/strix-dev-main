import type { Metadata } from "next";
import HeroSection from "~/components/about/HeroSection";
import OwlVisual from "~/components/about/OwlVisual";
import { Team } from "~/components/about/Team";
import AboutCTA from "~/components/about/AboutCTA";
import { team } from "~/Data/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://strixdevs.com";

export const metadata: Metadata = {
    title: "About Us & Engineering Team",
    description:
        "Meet the engineers and architects behind Strix Devs. We build high-performance, scalable SaaS platforms, AI automation systems, and custom software for businesses worldwide. Book a free consultation.",
    alternates: {
        canonical: "/about",
    },
    openGraph: {
        title: "About Us & Engineering Team | Strix Devs",
        description:
            "Meet Strix Devs — an engineering team focused on building production-ready, scalable software with Next.js, React, Node.js, and modern AI architectures.",
        url: `${SITE_URL}/about`,
        images: [
            {
                url: `${SITE_URL}/images/strixdevs.jpg`,
                width: 1200,
                height: 630,
                alt: "Strix Devs Team",
            },
        ],
    },
    keywords: [
        "engineering team Toronto",
        "software architects New York",
        "Next.js engineers Chicago",
        "AI developers San Francisco",
        "full stack developers London",
    ],
};

const SERVICE_AREAS = [
    { "@type": "City", name: "New York", addressRegion: "NY", addressCountry: "US" },
    { "@type": "City", name: "Chicago", addressRegion: "IL", addressCountry: "US" },
    { "@type": "City", name: "Toronto", addressRegion: "ON", addressCountry: "CA" },
    { "@type": "City", name: "San Francisco", addressRegion: "CA", addressCountry: "US" },
    { "@type": "City", name: "London", addressCountry: "GB" },
];

export default function AboutPage() {
    const aboutSchema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Strix Devs",
        url: `${SITE_URL}/about`,
        description:
            "Strix Devs is a modern full-stack web and AI engineering agency building scalable software for startups and businesses.",
        mainEntity: {
            "@type": "Organization",
            name: "Strix Devs",
            url: SITE_URL,
            areaServed: SERVICE_AREAS,
            member: team.map((member) => ({
                "@type": "Person",
                name: member.name,
                jobTitle: member.role,
                image: `${SITE_URL}${member.image}`,
                description: member.bio,
            })),
        },
    };

    const breadcrumbsSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "About",
                item: `${SITE_URL}/about`,
            },
        ],
    };

    return (
        <div className="pt-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(aboutSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbsSchema),
                }}
            />
            <HeroSection />
            <OwlVisual />
            <Team />
            <AboutCTA />
        </div>
    );
}

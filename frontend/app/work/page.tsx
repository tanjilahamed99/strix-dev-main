import type { Metadata } from "next";
import HeroSection from "~/components/work/HeroSection";
import Projects from "~/components/work/Projects";
import WorkCTA from "~/components/work/WorkCTA";
import { projects } from "~/Data/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://strixdevs.com";

export const metadata: Metadata = {
    title: "Case Studies & Portfolio",
    description:
        "Explore Strix Devs case studies: SaaS platforms, custom enterprise web applications, and e-commerce systems engineered with Next.js, React, Node.js, and TypeScript. Book a free project consultation.",
    alternates: {
        canonical: "/work",
    },
    openGraph: {
        title: "Case Studies & Portfolio | Strix Devs",
        description:
            "High-performance digital products and scalable SaaS applications engineered by Strix Devs.",
        url: `${SITE_URL}/work`,
        images: [
            {
                url: `${SITE_URL}/images/strixdevs.jpg`,
                width: 1200,
                height: 630,
                alt: "Strix Devs Work",
            },
        ],
    },
    keywords: [
        "web development portfolio New York",
        "SaaS case studies Chicago",
        "software engineering projects Toronto",
        "AI applications portfolio San Francisco",
        "web apps case studies London",
    ],
};

const SERVICE_AREAS = [
    { "@type": "City", name: "New York", addressRegion: "NY", addressCountry: "US" },
    { "@type": "City", name: "Chicago", addressRegion: "IL", addressCountry: "US" },
    { "@type": "City", name: "Toronto", addressRegion: "ON", addressCountry: "CA" },
    { "@type": "City", name: "San Francisco", addressRegion: "CA", addressCountry: "US" },
    { "@type": "City", name: "London", addressCountry: "GB" },
];

export default function WorkPage() {
    const portfolioSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Strix Devs Portfolio & Case Studies",
        url: `${SITE_URL}/work`,
        description: "Showcase of web apps, SaaS platforms, and software developed by Strix Devs.",
        mainEntity: {
            "@type": "ItemList",
            itemListElement: projects.map((p, idx) => ({
                "@type": "CreativeWork",
                position: idx + 1,
                name: p.title,
                description: p.description,
                image: `${SITE_URL}${p.image}`,
                url: p.link,
                creator: {
                    "@type": "Organization",
                    name: "Strix Devs",
                    url: SITE_URL,
                    areaServed: SERVICE_AREAS,
                },
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
                name: "Work",
                item: `${SITE_URL}/work`,
            },
        ],
    };

    return (
        <div className="pt-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(portfolioSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbsSchema),
                }}
            />
            <HeroSection />
            <Projects />
            <WorkCTA />
        </div>
    );
}

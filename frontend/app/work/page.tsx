import type { Metadata } from "next";
import HeroSection from "~/components/work/HeroSection";
import Projects from "~/components/work/Projects";
import WorkCTA from "~/components/work/WorkCTA";
import { projects } from "~/Data/data";

export const metadata: Metadata = {
    title: "Case Studies & Portfolio | Strix Devs",
    description:
        "Explore Strix Devs case studies: SaaS platforms, custom enterprise web applications, and e-commerce systems engineered with Next.js, React, Node.js, and TypeScript. Book a free project consultation.",
    alternates: {
        canonical: "/work",
    },
    openGraph: {
        title: "Case Studies & Portfolio | Strix Devs",
        description:
            "High-performance digital products and scalable SaaS applications engineered by Strix Devs.",
        url: "https://strixdevs.com/work",
        images: [
            {
                url: "https://i.ibb.co.com/Z189FpgK/strixdevs.png",
                width: 1200,
                height: 630,
                alt: "Strix Devs Work",
            },
        ],
    },
};

export default function WorkPage() {
    const portfolioSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Strix Devs Portfolio & Case Studies",
        description: "Showcase of web apps, SaaS platforms, and software developed by Strix Devs.",
        mainEntity: {
            "@type": "ItemList",
            itemListElement: projects.map((p, idx) => ({
                "@type": "CreativeWork",
                position: idx + 1,
                name: p.title,
                description: p.description,
                image: p.image,
                url: p.link,
                creator: {
                    "@type": "Organization",
                    name: "Strix Devs",
                },
            })),
        },
    };

    return (
        <div className="pt-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(portfolioSchema),
                }}
            />
            <HeroSection />
            <Projects />
            <WorkCTA />
        </div>
    );
}

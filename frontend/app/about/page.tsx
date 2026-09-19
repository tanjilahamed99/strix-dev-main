import type { Metadata } from "next";
import HeroSection from "~/components/about/HeroSection";
import OwlVisual from "~/components/about/OwlVisual";
import { Team } from "~/components/about/Team";
import AboutCTA from "~/components/about/AboutCTA";
import { team } from "~/Data/data";

export const metadata: Metadata = {
    title: "About Us & Engineering Team | Strix Devs",
    description:
        "Meet the engineers and architects behind Strix Devs. We build high-performance, scalable SaaS platforms, AI automation systems, and custom software for businesses worldwide. Book a free consultation.",
    alternates: {
        canonical: "/about",
    },
    openGraph: {
        title: "About Us & Engineering Team | Strix Devs",
        description:
            "Meet Strix Devs — an engineering team focused on building production-ready, scalable software with Next.js, React, Node.js, and modern AI architectures.",
        url: "https://strixdevs.com/about",
        images: [
            {
                url: "https://i.ibb.co.com/Z189FpgK/strixdevs.png",
                width: 1200,
                height: 630,
                alt: "Strix Devs Team",
            },
        ],
    },
};

export default function AboutPage() {
    const aboutSchema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Strix Devs",
        description:
            "Strix Devs is a modern full-stack web and AI engineering agency building scalable software for startups and businesses.",
        mainEntity: {
            "@type": "Organization",
            name: "Strix Devs",
            url: "https://strixdevs.com",
            member: team.map((member) => ({
                "@type": "Person",
                name: member.name,
                jobTitle: member.role,
                image: member.image,
                description: member.bio,
            })),
        },
    };

    return (
        <div className="pt-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(aboutSchema),
                }}
            />
            <HeroSection />
            <OwlVisual />
            <Team />
            <AboutCTA />
        </div>
    );
}

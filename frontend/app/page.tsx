import type { Metadata } from "next";
import HeroSection from "~/components/home/HeroSection";
import PortfolioSection from "~/components/home/PortfolioSection";
import ServicesSection from "~/components/home/ServicesSection";
import AboutSection from "~/components/home/AboutSection";
import ContactSection from "~/components/home/ContactSection";
import { Process } from "~/components/home/Process";
import { WhyUs } from "~/components/home/WhyUs";
import { FAQ } from "~/components/home/FAQ";

export const metadata: Metadata = {
    title: {
        absolute: "Strix Devs — Full-Stack Web Development, SaaS & AI Automation Agency",
    },
    description:
        "Strix Devs is a full-stack software development agency specializing in custom web applications, SaaS platforms, and AI automations using Next.js, React, Node.js, and cloud technologies. Book a free 30-minute consultation.",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "Strix Devs | Custom Web & Software Development Agency",
        description:
            "We build scalable web applications, SaaS platforms, and custom business software. Book a free 30-minute consultation on Google Meet.",
        url: "https://strixdevs.com/",
        images: [
            {
                url: "/images/strixdevs.jpg",
                width: 1200,
                height: 630,
                alt: "Strix Devs Agency",
            },
        ],
    },
    keywords: [
        "web development agency New York",
        "custom software development Chicago",
        "SaaS development agency Toronto",
        "AI automation agency San Francisco",
        "software development company London UK",
    ],
};

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <ServicesSection />
            <PortfolioSection />
            <Process />
            <WhyUs />
            <AboutSection />
            <FAQ limit={6} />
            <ContactSection />
        </>
    );
}

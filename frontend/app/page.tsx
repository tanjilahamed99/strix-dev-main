import type { Metadata } from "next";
import HeroSection from "~/components/home/HeroSection";
import PortfolioSection from "~/components/home/PortfolioSection";
import ServicesSection from "~/components/home/ServicesSection";
import AboutSection from "~/components/home/AboutSection";
import ContactSection from "~/components/home/ContactSection";
import { Process } from "~/components/home/Process";
import { WhyUs } from "~/components/home/WhyUs";
import { FAQ } from "~/components/home/FAQ";
import { faqs } from "~/Data/data";

export const metadata: Metadata = {
    title: "Strix Devs | Custom Web Applications, SaaS & AI Automation Agency",
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
                url: "https://i.ibb.co.com/Z189FpgK/strixdevs.png",
                width: 1200,
                height: 630,
                alt: "Strix Devs Agency",
            },
        ],
    },
};

export default function HomePage() {
    // Generate FAQPage JSON-LD Schema for rich search snippet results
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
            },
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema),
                }}
            />
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

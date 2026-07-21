import type { Route } from "./+types/home";
import HeroSection from "~/components/home/HeroSection";
import PortfolioSection from "~/components/home/PortfolioSection";
import ServicesSection from "~/components/home/ServicesSection";
import AboutSection from "~/components/home/AboutSection";
import ContactSection from "~/components/home/ContactSection";
import FloatingContactFAB from "~/components/FloatingContactFAB";
import { Process } from "~/components/home/Process";
import { WhyUs } from "~/components/home/WhyUs";
import { FAQ } from "~/components/home/FAQ";

export function meta({}: Route.MetaArgs) {
    return [
        {
            title: "Strix Devs | Custom Web & Software Development Agency",
        },
        {
            name: "description",
            content:
                "Strix Devs is a full-stack software development agency specializing in custom web applications, SaaS platforms, and business software using React, Next.js, Node.js, and modern cloud technologies. We help startups and growing businesses build scalable digital products.",
        },
        {
            property: "og:title",
            content: "Strix Devs | Custom Web & Software Development Agency",
        },
        {
            property: "og:description",
            content:
                "We build scalable web applications, SaaS platforms, and custom business software using React, Next.js, Node.js, and modern cloud technologies.",
        },
        {
            property: "og:type",
            content: "website",
        },
        {
            property: "og:url",
            content: "https://strixdevs.com/",
        },
        {
            property: "og:image",
            content: "https://i.ibb.co.com/Z189FpgK/strixdevs.png",
        },
        {
            property: "og:image:alt",
            content: "Strix Devs - Custom Web and Software Development Agency",
        },
        {
            property: "og:site_name",
            content: "Strix Devs",
        },
        {
            name: "twitter:card",
            content: "summary_large_image",
        },
        {
            name: "twitter:title",
            content: "Strix Devs | Custom Web & Software Development Agency",
        },
        {
            name: "twitter:description",
            content:
                "Strix Devs builds scalable web applications, SaaS platforms, and custom business software using React, Next.js, Node.js, and modern cloud technologies.",
        },
        {
            name: "twitter:image",
            content: "https://i.ibb.co.com/Z189FpgK/strixdevs.png",
        },
    ];
}

export default function Home() {
    return (
        <main>
            <HeroSection />
            <ServicesSection />
            <PortfolioSection />
            <Process />
            {/* <TechStack /> */}
            <WhyUs />
            <AboutSection />
            <FAQ limit={6} />
            <ContactSection />
            <FloatingContactFAB />
        </main>
    );
}

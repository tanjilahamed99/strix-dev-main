import type { Route } from "./+types/home";
import HeroSection from "~/components/about/HeroSection";
import OwlVisual from "~/components/about/OwlVisual";
import Team from "~/components/about/Team";
import AboutTImeline from "~/components/about/AboutTImeline";
import AboutCTA from "~/components/about/AboutCTA";

export function meta({}: Route.MetaArgs) {
    return [
        {
            title: "Strix Devs | About ",
        },

        {
            name: "description",
            content:
                "Learn about Strix Devs — a full-stack web development agency specializing in React, Next.js, Node.js, and scalable SaaS architecture. We are a team of engineers focused on building high-performance, production-ready web applications for startups and businesses worldwide.",
        },

        {
            name: "keywords",
            content:
                "about Strix Devs, web development agency team, full stack developers Bangladesh, React developers, Next.js agency, Node.js developers, SaaS development company, software engineering team, custom web application developers",
        },

        {
            name: "robots",
            content: "index, follow",
        },

        /* ── Open Graph ── */
        {
            property: "og:title",
            content: "About Strix Devs | Full-Stack Web Development Agency",
        },
        {
            property: "og:description",
            content:
                "Meet Strix Devs — a team of full-stack engineers building scalable SaaS platforms, web apps, and digital products using modern technologies like React, Next.js, and Node.js.",
        },
        {
            property: "og:type",
            content: "website",
        },
        {
            property: "og:image",
            content: "https://i.ibb.co.com/Z189FpgK/strixdevs.png",
        },

        /* ── Twitter ── */
        {
            name: "twitter:card",
            content: "summary_large_image",
        },
        {
            name: "twitter:title",
            content: "About Strix Devs | Full-Stack Web Development Agency",
        },
        {
            name: "twitter:description",
            content:
                "Meet the engineers behind Strix Devs — building scalable SaaS platforms and modern web applications.",
        },
        {
            name: "twitter:image",
            content: "https://i.ibb.co.com/Z189FpgK/strixdevs.png",
        },
    ];
}

export default function About() {
    return (
        <main className="pt-24">
            <HeroSection />
            <OwlVisual />
            <Team />
            <AboutCTA />
        </main>
    );
}




import type { Route } from "./+types/home";
import HeroSection from "~/components/home/HeroSection";
import PortfolioSection from "~/components/home/PortfolioSection";
import ServicesSection from "~/components/home/ServicesSection";
import AboutSection from "~/components/home/AboutSection";
import ContactSection from "~/components/home/ContactSection";
import FloatingContactFAB from "~/components/FloatingContactFAB";
import { Process } from "~/components/home/Process";
import { TechStack } from "~/components/home/TechStack";
import { WhyUs } from "~/components/home/WhyUs";
import { FAQ } from "~/components/home/FAQ";

export function meta({}: Route.MetaArgs) {
    return [
        /* ── Primary SEO Title ── */
        {
            title: "Strix Devs | Home",
        },

        /* ── SEO Description ── */
        {
            name: "description",
            content:
                "Strix Devs is a full-stack web development agency building scalable SaaS platforms, custom web applications, and business systems using React, Next.js, Node.js, and modern cloud infrastructure. We help startups and companies ship production-ready products faster.",
        },

        /* ── Keywords ── */
        {
            name: "keywords",
            content:
                "Strix Devs, web development agency, full stack developers, React developers, Next.js agency, Node.js backend, SaaS development company, custom software development, startup tech partner, hire web developers, Bangladesh software agency",
        },

        /* ── Robots ── */
        {
            name: "robots",
            content: "index, follow",
        },

        /* ── Open Graph (Facebook / LinkedIn) ── */
        {
            property: "og:title",
            content: "Strix Devs | Full-Stack Web Development Agency",
        },
        {
            property: "og:description",
            content:
                "We build scalable SaaS platforms, web apps, and business systems using React, Next.js, Node.js, and cloud infrastructure.",
        },
        {
            property: "og:type",
            content: "website",
        },
        {
            property: "og:image",
            content: "https://i.ibb.co.com/Z189FpgK/strixdevs.png",
        },
        {
            property: "og:site_name",
            content: "Strix Devs",
        },

        /* ── Twitter ── */
        {
            name: "twitter:card",
            content: "summary_large_image",
        },
        {
            name: "twitter:title",
            content: "Strix Devs | Full-Stack Web Development Agency",
        },
        {
            name: "twitter:description",
            content:
                "We build scalable SaaS platforms, web apps, and business systems using modern web technologies.",
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
           <FAQ limit={6}/>
           <ContactSection />
           <FloatingContactFAB />
       </main>
   );
}

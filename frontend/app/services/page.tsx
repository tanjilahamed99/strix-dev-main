import type { Metadata } from "next";
import HeroSection from "~/components/services/HeroSection";
import ServiceProcess from "~/components/services/ServiceProcess";
import ServiceCTA from "~/components/services/ServiceCTA";
import ServicesSection from "~/components/services/Services";
import { services } from "~/Data/data";

export const metadata: Metadata = {
    title: "Software & Web Development Services | Strix Devs",
    description:
        "Explore Strix Devs engineering services: Custom Web Applications, SaaS MVP Development, AI Automation Solutions, Business Dashboards, API Integration, and Cloud DevOps. Book a free 30-minute consultation.",
    alternates: {
        canonical: "/services",
    },
    openGraph: {
        title: "Software & Web Development Services | Strix Devs",
        description:
            "From SaaS platforms to AI automation agents and custom web apps. High-performance, scalable software solutions engineered for growth.",
        url: "https://strixdevs.com/services",
        images: [
            {
                url: "https://i.ibb.co.com/Z189FpgK/strixdevs.png",
                width: 1200,
                height: 630,
                alt: "Strix Devs Services",
            },
        ],
    },
};

export default function ServicesPage() {
    const servicesSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Strix Devs Software Engineering Services",
        itemListElement: services.map((service, idx) => ({
            "@type": "Service",
            position: idx + 1,
            name: service.title,
            description: service.description,
            provider: {
                "@type": "Organization",
                name: "Strix Devs",
            },
            serviceType: service.title,
            offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Free 30-minute initial consultation and project discovery session.",
            },
        })),
    };

    return (
        <div className="pt-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(servicesSchema),
                }}
            />
            <HeroSection />
            <ServicesSection />
            <ServiceProcess />
            <ServiceCTA />
        </div>
    );
}

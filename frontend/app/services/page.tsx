import type { Metadata } from "next";
import HeroSection from "~/components/services/HeroSection";
import ServiceProcess from "~/components/services/ServiceProcess";
import ServiceCTA from "~/components/services/ServiceCTA";
import ServicesSection from "~/components/services/Services";
import { services } from "~/Data/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://strixdevs.com";

export const metadata: Metadata = {
    title: "Software & Web Development Services",
    description:
        "Explore Strix Devs engineering services: Custom Web Applications, SaaS MVP Development, AI Automation Solutions, Business Dashboards, API Integration, and Cloud DevOps. Book a free 30-minute consultation.",
    alternates: {
        canonical: "/services",
    },
    openGraph: {
        title: "Software & Web Development Services | Strix Devs",
        description:
            "From SaaS platforms to AI automation agents and custom web apps. High-performance, scalable software solutions engineered for growth.",
        url: `${SITE_URL}/services`,
        images: [
            {
                url: `${SITE_URL}/images/strixdevs.jpg`,
                width: 1200,
                height: 630,
                alt: "Strix Devs Services",
            },
        ],
    },
    keywords: [
        "custom web applications New York",
        "SaaS development Chicago",
        "AI automation Toronto",
        "API integration San Francisco",
        "cloud DevOps London UK",
        "custom software development services",
        "SaaS MVP engineering",
        "enterprise web apps",
    ],
};

const SERVICE_AREAS = [
    { "@type": "City", name: "New York", addressRegion: "NY", addressCountry: "US" },
    { "@type": "City", name: "Chicago", addressRegion: "IL", addressCountry: "US" },
    { "@type": "City", name: "Toronto", addressRegion: "ON", addressCountry: "CA" },
    { "@type": "City", name: "San Francisco", addressRegion: "CA", addressCountry: "US" },
    { "@type": "City", name: "London", addressCountry: "GB" },
];

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
                url: SITE_URL,
            },
            serviceType: service.title,
            areaServed: SERVICE_AREAS,
            offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Free 30-minute initial consultation and project discovery session.",
            },
        })),
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
                name: "Services",
                item: `${SITE_URL}/services`,
            },
        ],
    };

    return (
        <div className="pt-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(servicesSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbsSchema),
                }}
            />
            <HeroSection />
            <ServicesSection />
            <ServiceProcess />
            <ServiceCTA />
        </div>
    );
}

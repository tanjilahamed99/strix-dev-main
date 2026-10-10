import type { Metadata } from "next";
import HeroSection from "~/components/contact/HeroSection";
import ContactForm from "~/components/contact/ContactForm";
import { FAQ } from "~/components/home/FAQ";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://strixdevs.com";

export const metadata: Metadata = {
    title: "Contact Us & Book Free Consultation",
    description:
        "Contact Strix Devs or schedule a free 30-minute Google Meet consultation. Tell us about your project requirements, expected timeline, and business goals.",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contact Us & Book Free Consultation | Strix Devs",
        description:
            "Schedule a free 30-minute strategic consultation on Google Meet or get in touch with our engineering team.",
        url: `${SITE_URL}/contact`,
        images: [
            {
                url: `${SITE_URL}/images/strixdevs.jpg`,
                width: 1200,
                height: 630,
                alt: "Contact Strix Devs",
            },
        ],
    },
    keywords: [
        "hire software engineers New York",
        "book tech consultation Chicago",
        "web development agency Toronto",
        "SaaS development consultation San Francisco",
        "software agency London UK",
    ],
};

const SERVICE_AREAS = [
    { "@type": "City", name: "New York", addressRegion: "NY", addressCountry: "US" },
    { "@type": "City", name: "Chicago", addressRegion: "IL", addressCountry: "US" },
    { "@type": "City", name: "Toronto", addressRegion: "ON", addressCountry: "CA" },
    { "@type": "City", name: "San Francisco", addressRegion: "CA", addressCountry: "US" },
    { "@type": "City", name: "London", addressCountry: "GB" },
];

export default function ContactPage() {
    const contactSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Strix Devs",
        description:
            "Get in touch with Strix Devs or book a free 30-minute Google Meet consultation with our technical team.",
        url: `${SITE_URL}/contact`,
        mainEntity: {
            "@type": "Organization",
            name: "Strix Devs",
            url: SITE_URL,
            email: "info@strixdevs.com",
            telephone: "+8801518933208",
            areaServed: SERVICE_AREAS,
            contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "info@strixdevs.com",
                availableLanguage: ["English"],
            },
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
                name: "Contact",
                item: `${SITE_URL}/contact`,
            },
        ],
    };

    return (
        <div className="pt-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(contactSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbsSchema),
                }}
            />
            <HeroSection />
            <ContactForm />
            <FAQ limit={20} />
        </div>
    );
}

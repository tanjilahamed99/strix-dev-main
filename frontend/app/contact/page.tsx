import type { Metadata } from "next";
import HeroSection from "~/components/contact/HeroSection";
import ContactForm from "~/components/contact/ContactForm";
import { FAQ } from "~/components/home/FAQ";

export const metadata: Metadata = {
    title: "Contact Us & Book Free Consultation | Strix Devs",
    description:
        "Contact Strix Devs or schedule a free 30-minute Google Meet consultation. Tell us about your project requirements, expected timeline, and business goals.",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contact Us & Book Free Consultation | Strix Devs",
        description:
            "Schedule a free 30-minute strategic consultation on Google Meet or get in touch with our engineering team.",
        url: "https://strixdevs.com/contact",
        images: [
            {
                url: "https://i.ibb.co.com/Z189FpgK/strixdevs.png",
                width: 1200,
                height: 630,
                alt: "Contact Strix Devs",
            },
        ],
    },
};

export default function ContactPage() {
    const contactSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Strix Devs",
        description:
            "Get in touch with Strix Devs or book a free 30-minute Google Meet consultation with our technical team.",
        url: "https://strixdevs.com/contact",
        mainEntity: {
            "@type": "Organization",
            name: "Strix Devs",
            email: "info@strixdevs.com",
            telephone: "+8801518933208",
            contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "info@strixdevs.com",
                availableLanguage: ["English"],
            },
        },
    };

    return (
        <div className="pt-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(contactSchema),
                }}
            />
            <HeroSection />
            <ContactForm />
            <FAQ limit={20} />
        </div>
    );
}

import type { Route } from "./+types/home";
import HeroSection from "~/components/contact/HeroSection";
import ContactForm from "~/components/contact/ContactForm";
import { FAQ } from "~/components/home/FAQ";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Strix Devs | Contact Us " },
        { name: "description", content: "Contact with Strix Devs" },
    ];
}

export default function Contact() {
    return (
        <main className="pt-24">
            <HeroSection />
            <ContactForm />
            <FAQ limit={20} />
        </main>
    );
}

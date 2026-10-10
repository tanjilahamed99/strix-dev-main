import { NextResponse } from "next/server";
import { services, projects, faqs, team } from "~/Data/data";

export const dynamic = "force-static";
export const revalidate = 86400; // Cache for 24h

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://strixdevs.com";

    const payload = {
        name: "Strix Devs",
        tagline: "Full-Stack Web Development, SaaS & AI Automation Agency",
        description:
            "Strix Devs is a full-stack engineering and software development agency. We build custom web applications, scalable SaaS MVPs, AI automation pipelines, and cloud systems using Next.js, React, Node.js, and modern AI/LLM technologies.",
        website: baseUrl,
        llmsTxt: `${baseUrl}/llms.txt`,
        llmsFullTxt: `${baseUrl}/llms-full.txt`,
        contact: {
            email: "info@strixdevs.com",
            phone: "+8801518933208",
            bookingUrl: `${baseUrl}/contact`,
            consultationOffer:
                "100% free, no-obligation 30-minute strategic consultation on Google Meet with lead engineers.",
        },
        serviceAreas: [
            { city: "New York", region: "NY", country: "United States" },
            { city: "Chicago", region: "IL", country: "United States" },
            { city: "Toronto", region: "ON", country: "Canada" },
            { city: "San Francisco", region: "CA", country: "United States" },
            { city: "London", region: "England", country: "United Kingdom" },
            { region: "Global / Worldwide Remote Delivery" },
        ],
        services: services.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            features: s.features,
        })),
        portfolio: projects.map((p) => ({
            title: p.title,
            category: p.category,
            description: p.description,
            techStack: p.techStack,
            year: p.year,
            link: p.link,
        })),
        coreTechStack: [
            "Next.js 15",
            "React 19",
            "TypeScript",
            "Tailwind CSS",
            "Node.js",
            "Python",
            "FastAPI",
            "Docker",
            "PostgreSQL",
            "MongoDB",
            "OpenAI API",
            "LangChain / RAG",
            "n8n Automation",
        ],
        leadershipTeam: team.map((m) => ({
            name: m.name,
            role: m.role,
            bio: m.bio,
        })),
        faqs: faqs.map((f) => ({
            question: f.q,
            answer: f.a,
        })),
    };

    return NextResponse.json(payload, {
        headers: {
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
            "Access-Control-Allow-Origin": "*",
        },
    });
}

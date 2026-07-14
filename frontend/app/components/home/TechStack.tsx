"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Header from "../Header";

type Tech = {
    name: string;
    category: string;
    desc: string;
    icon: string;
};

const categories = [
    "All",
    "Language",
    "Frontend",
    "Backend",
    "Database",
    "Auth & Payments",
    "DevOps",
    "Testing",
    "Services"
];

const stack: Tech[] = [
    // Language
    {
        name: "JavaScript",
        category: "Language",
        icon: "JS",
        desc: "Our primary language across the entire stack.",
    },
    {
        name: "TypeScript",
        category: "Language",
        icon: "TS",
        desc: "Type-safe development for scalable, maintainable codebases.",
    },

    // Frontend
    {
        name: "React",
        category: "Frontend",
        icon: "⚛",
        desc: "Component-driven UIs with modern hooks and patterns.",
    },
    {
        name: "Next.js",
        category: "Frontend",
        icon: "▲",
        desc: "SSR, SSG, and App Router for production-grade web apps.",
    },
    {
        name: "Tailwind CSS",
        category: "Frontend",
        icon: "✦",
        desc: "Utility-first styling for fast, consistent UI builds.",
    },
    {
        name: "Framer Motion",
        category: "Frontend",
        icon: "◈",
        desc: "Production animations and micro-interactions.",
    },

    // Backend
    {
        name: "Node.js",
        category: "Backend",
        icon: "⬡",
        desc: "Scalable server-side JavaScript runtime.",
    },
    {
        name: "Express",
        category: "Backend",
        icon: "Ex",
        desc: "Minimal, flexible REST API framework.",
    },
    {
        name: "Prisma",
        category: "Backend",
        icon: "△",
        desc: "Type-safe ORM for scalable database access.",
    },
    {
        name: "REST API",
        category: "Backend",
        icon: "API",
        desc: "Robust RESTful service architecture.",
    },
    {
        name: "JWT",
        category: "Backend",
        icon: "JWT",
        desc: "Secure token-based authentication.",
    },
    {
        name: "WebSockets",
        category: "Backend",
        icon: "WS",
        desc: "Real-time communication systems.",
    },

    // Database
    {
        name: "MongoDB",
        category: "Database",
        icon: "🍃",
        desc: "Flexible NoSQL for document-driven data models.",
    },
    {
        name: "PostgreSQL",
        category: "Database",
        icon: "🐘",
        desc: "Battle-tested relational DB for complex queries.",
    },
    {
        name: "MySQL",
        category: "Database",
        icon: "My",
        desc: "Reliable SQL for structured, transactional data.",
    },
    {
        name: "Supabase",
        category: "Database",
        icon: "SB",
        desc: "Open-source Firebase alternative with Postgres.",
    },
    {
        name: "Mongoose",
        category: "Database",
        icon: "MG",
        desc: "ODM for MongoDB schema modeling.",
    },
    {
        name: "Firebase",
        category: "Database",
        icon: "🔥",
        desc: "Real-time database and cloud storage.",
    },
    {
        name: "Redis",
        category: "Database",
        icon: "◉",
        desc: "In-memory caching and session management.",
    },

    // Auth & Payments
    {
        name: "Clerk",
        category: "Auth & Payments",
        icon: "Cl",
        desc: "Drop-in auth with social logins and org management.",
    },
    {
        name: "NextAuth",
        category: "Auth & Payments",
        icon: "🔐",
        desc: "Flexible authentication for Next.js apps.",
    },
    {
        name: "Stripe",
        category: "Auth & Payments",
        icon: "💳",
        desc: "Payments, subscriptions, and billing infrastructure.",
    },
    {
        name: "PayPal",
        category: "Auth & Payments",
        icon: "P",
        desc: "Global payment gateway integration.",
    },
    {
        name: "Auth0",
        category: "Auth & Payments",
        icon: "A0",
        desc: "Enterprise authentication and authorization.",
    },
    {
        name: "Razorpay",
        category: "Auth & Payments",
        icon: "RZ",
        desc: "Payment gateway for global & Asian markets.",
    },

    // Services
    {
        name: "AWS",
        category: "Services",
        icon: "☁",
        desc: "S3, EC2, Lambda for scalable cloud infrastructure.",
    },
    {
        name: "Vercel",
        category: "Services",
        icon: "⌘",
        desc: "Zero-config deployment for frontend apps.",
    },
    {
        name: "Docker",
        category: "Services",
        icon: "🐳",
        desc: "Containerised environments for consistent deploys.",
    },
    {
        name: "DigitalOcean",
        category: "Services",
        icon: "DO",
        desc: "Simple and scalable cloud hosting.",
    },
    {
        name: "Sentry",
        category: "Services",
        icon: "SE",
        desc: "Error tracking and performance monitoring.",
    },
    {
        name: "Cloudinary",
        category: "Services",
        icon: "☁",
        desc: "Media upload, transform, and delivery CDN.",
    },
    {
        name: "SendGrid",
        category: "Services",
        icon: "✉",
        desc: "Transactional and marketing email delivery.",
    },
    {
        name: "VS Code Ext",
        category: "Services",
        icon: "⎈",
        desc: "Custom extensions for developer tooling workflows.",
    },

    {
        name: "Git",
        category: "DevOps",
        icon: "Git",
        desc: "Version control and collaboration workflows.",
    },
    {
        name: "GitHub Actions",
        category: "DevOps",
        icon: "CI",
        desc: "CI/CD automation pipelines.",
    },
    {
        name: "Nginx",
        category: "DevOps",
        icon: "NG",
        desc: "High-performance web server & reverse proxy.",
    },
    {
        name: "Linux",
        category: "DevOps",
        icon: "🐧",
        desc: "Production server environments.",
    },
    {
        name: "PM2",
        category: "DevOps",
        icon: "PM",
        desc: "Node.js process manager for uptime & scaling.",
    },

    {
        name: "Jest",
        category: "Testing",
        icon: "J",
        desc: "Unit and integration testing.",
    },
    {
        name: "Postman",
        category: "Testing",
        icon: "PM",
        desc: "API testing and documentation.",
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },

    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            delay: i * 0.04,
        },
    }),
};

export const TechStack = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    const [active, setActive] = useState("All");

    const filtered =
        active === "All" ? stack : stack.filter((t) => t.category === active);

    return (
        <section id="tech-stack" className="py-24 relative" ref={ref}>
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                                      linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
                    backgroundSize: "80px 80px",
                }}
            />

            <div className="container mx-auto px-6">
                <Header
                    tag="04"
                    label="Our Arsenal"
                    titleLine1="Tools We"
                    titleLine2="Trust"
                    desc="Every technology we use is chosen for reliability, performance, and long-term maintainability — not hype."
                />

                {/* filter pills */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex flex-wrap gap-2 mb-10"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActive(cat)}
                            className=" text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full transition-all duration-200"
                            style={{
                                background:
                                    active === cat
                                        ? "hsl(var(--foreground))"
                                        : "hsl(var(--foreground) / 0.05)",
                                color:
                                    active === cat
                                        ? "hsl(var(--background))"
                                        : "hsl(var(--foreground) / 0.5)",
                                border: `1px solid ${
                                    active === cat
                                        ? "hsl(var(--foreground))"
                                        : "hsl(var(--foreground) / 0.1)"
                                }`,
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2">
                    {filtered.map((tech, i) => (
                        <motion.div
                            key={tech.name}
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            className="group relative rounded-xl p-4 flex flex-col justify-center items-center transition-all duration-300"
                            style={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--foreground) / 0.08)",
                            }}
                            whileHover={{
                                borderColor: "hsl(var(--foreground) / 0.25)",
                                y: -4,
                            }}
                        >
                            {/* hover tooltip */}
                            <div
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-xl text-xs leading-relaxed pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
                                style={{
                                    background: "hsl(var(--foreground))",
                                    color: "hsl(var(--background))",
                                }}
                            >
                                {tech.desc}
                                <div
                                    className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
                                    style={{
                                        borderTopColor:
                                            "hsl(var(--foreground))",
                                    }}
                                />
                            </div>

                            <div
                                className="w-10 h-10 animate-pulse duration-2500 rounded-lg glow-border glow-text flex items-center justify-center text-lg font-bold mb-3 transition-all duration-300 group-hover:scale-110"
                                style={{
                                    background: "hsl(var(--foreground) / 0.06)",
                                    color: "hsl(var(--foreground))",
                                }}
                            >
                                {tech.icon}
                            </div>
                            <h3 className="text-base font-medium tracking-tight">
                                {tech.name}
                            </h3>
                            <p className=" text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground mt-0.5">
                                {tech.category}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

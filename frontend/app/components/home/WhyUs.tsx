"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Header from "../Header";

const points = [
    {
        number: "01",
        title: "Business-Driven Solutions",
        desc: "We don't just build software—we solve business challenges. Every solution is designed to improve efficiency, automate workflows, and support long-term business growth.",
        proof: "Technology aligned with business goals",
    },
    {
        number: "02",
        title: "Tailored for Your Business",
        desc: "Every project is built from the ground up to match your unique processes and objectives. No templates, no unnecessary complexity—just software that fits your business.",
        proof: "100% custom software development",
    },
    {
        number: "03",
        title: "Transparent Collaboration",
        desc: "From discovery to deployment, you'll work directly with our team. Regular updates, milestone reviews, and open communication keep every project on track.",
        proof: "Clear communication throughout the project",
    },
    {
        number: "04",
        title: "Built to Scale Securely",
        desc: "Our applications are engineered for reliability, security, and future growth, ensuring your software continues to perform as your business expands.",
        proof: "Scalable and secure architecture",
    },
    {
        number: "05",
        title: "AI & Automation Expertise",
        desc: "We help businesses eliminate repetitive work through AI-powered automation, intelligent workflows, custom chatbots, AI agents, and seamless system integrations.",
        proof: "Smarter workflows with AI",
    },
    {
        number: "06",
        title: "Beyond Launch Support",
        desc: "Launching is only the beginning. Every project includes complimentary post-launch support, and we're available for ongoing improvements, maintenance, and future enhancements.",
        proof: "30 days complimentary support included",
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

export const WhyUs = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section id="why-us" className="py-24 relative" ref={ref}>
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
                    tag="05"
                    label="Why Choose Strix Devs"
                    titleLine1="Technology That"
                    titleLine2="Moves Business Forward"
                    desc="We combine modern software engineering, AI automation, and transparent collaboration to build solutions that are secure, scalable, and designed for long-term success."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {points.map((point, i) => (
                        <motion.div
                            key={point.number}
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            className="group relative rounded-2xl p-6 transition-all duration-300"
                            style={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--foreground) / 0.08)",
                            }}
                            whileHover={{
                                borderColor: "hsl(var(--foreground) / 0.2)",
                                y: -4,
                            }}
                        >
                            {/* faded index */}
                            <h3
                                className="absolute top-4 right-5 glow-text text-5xl font-bold opacity-20 leading-none select-none pointer-events-none transition-opacity duration-300 group-hover:opacity-40"
                                style={{
                                    color: "hsl(var(--foreground))",
                                }}
                            >
                                {point.number}
                            </h3>

                            <h3 className="font-display text-lg font-semibold tracking-tight mb-3 pr-8">
                                {point.title}
                            </h3>

                            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                                {point.desc}
                            </p>

                            {/* proof line */}
                            <div
                                className="flex items-center gap-2 pt-4"
                                style={{
                                    borderTop:
                                        "1px solid hsl(var(--foreground) / 0.07)",
                                }}
                            >
                                <span
                                    className="w-4 h-4 rounded-full flex items-center justify-center text-[0.55rem] shrink-0"
                                    style={{
                                        background:
                                            "hsl(var(--foreground) / 0.08)",
                                        color: "hsl(var(--foreground) / 0.6)",
                                    }}
                                >
                                    ✓
                                </span>
                                <span className="font-mono text-[0.65rem] text-muted-foreground">
                                    {point.proof}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

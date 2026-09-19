"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { projects } from "~/Data/data";
import Link from "next/link";
import ProjectCard from "../ProjectCard";
import Header from "../Header";

const PortfolioSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section id="work" className="py-32 relative overflow-hidden bg-card">
            {/* Background */}
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="noise-overlay" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section header */}
                <Header
                    tag="02"
                    label="Selected Work"
                    titleLine1="Featured"
                    titleLine2="Projects"
                    desc="A selection of high-performance web applications, SaaS platforms, and digital solutions engineered by Strix Devs."
                />

                {/* Projects grid */}
                <div ref={ref} className="space-y-20">
                    {projects.slice(0, 3).map((project, index) => (
                        <motion.div key={project.title}>
                            <ProjectCard
                                project={project}
                                hoveredIndex={hoveredIndex}
                                index={index}
                                isInView={isInView}
                                setHoveredIndex={setHoveredIndex}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* View all button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-center my-20"
                >
                    <Link href="/work" className="btn-outline">
                        View All Case Studies & Work
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default PortfolioSection;

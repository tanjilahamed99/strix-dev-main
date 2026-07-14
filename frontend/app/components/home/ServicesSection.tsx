import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { services } from "~/Data/data";
import Header from "../Header";

const ServicesSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="services" className="py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 grid-pattern opacity-50" />
            <div className="noise-overlay" />

            {/* Large background text */}
            <motion.h1
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.1 }}
                viewport={{ once: true }}
                className="absolute -right-10 top-1/2 glow-text -translate-y-1/2 text-[16rem] leading-none select-none pointer-events-none hidden xl:block whitespace-nowrap"
                style={{ writingMode: "sideways-rl", textOrientation: "mixed" }}
            >
                SERVICES
            </motion.h1>

            <div className="container mx-auto px-6 relative z-10">
                {/* Section header */}
                <Header
                    tag="01"
                    label="What We Build"
                    titleLine1="End-to-End"
                    titleLine2="Solutions"
                    desc="From architecture decisions to final deployment — we own the full stack so you can focus on your product."
                />

                {/* Services list */}
                <div ref={ref} className="space-y-0">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                                ease: [0.4, 0, 0, 1],
                            }}
                            className="group border-t border-border py-10 cursor-hover"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                {/* Number */}
                                <div className="lg:col-span-1">
                                    <span className="text-xs font-mono text-muted-foreground">
                                        {service.number}
                                    </span>
                                </div>

                                {/* Icon */}
                                <div className="lg:col-span-1">
                                    <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-500">
                                        <service.icon className="w-5 h-5 text-foreground group-hover:text-background transition-colors duration-500" />
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="lg:col-span-4">
                                    <h3 className="text-2xl md:text-3xl font-display tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                                        {service.title}
                                    </h3>
                                </div>

                                {/* Description */}
                                <div className="lg:col-span-5">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Arrow */}
                                <div className="lg:col-span-1 flex justify-end">
                                    <motion.div
                                        initial={{ x: -10, opacity: 0 }}
                                        whileHover={{ x: 0, opacity: 1 }}
                                        className="w-8 h-8 border border-foreground/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="square"
                                                strokeLinejoin="miter"
                                                strokeWidth={1.5}
                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                            />
                                        </svg>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {/* Bottom border */}
                    <div className="border-t border-border" />
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDownRight } from "lucide-react";
import Header from "../Header";

const HeroSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section
            ref={containerRef}
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
        >
            {/* Grid pattern background */}
            <div className="absolute inset-0 grid-pattern" />

            {/* Noise overlay */}
            <div className="noise-overlay" />

            {/* Animated corner lines */}
            <div className="absolute top-14 lg:top-0 left-0 w-32 h-32">
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                        duration: 1,
                        delay: 0.5,
                        ease: [0.4, 0, 0, 1],
                    }}
                    className="absolute top-8 left-8 w-16 h-px bg-foreground/40 origin-left"
                />
                <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                        duration: 1,
                        delay: 0.6,
                        ease: [0.4, 0, 0, 1],
                    }}
                    className="absolute top-8 left-8 w-px h-16 bg-foreground/40 origin-top"
                />
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32">
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                        duration: 1,
                        delay: 0.7,
                        ease: [0.4, 0, 0, 1],
                    }}
                    className="absolute bottom-8 right-8 w-16 h-px bg-foreground/40 origin-right"
                />
                <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                        duration: 1,
                        delay: 0.8,
                        ease: [0.4, 0, 0, 1],
                    }}
                    className="absolute bottom-8 right-8 w-px h-16 bg-foreground/40 origin-bottom"
                />
            </div>

            {/* Floating number */}
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute right-10 top-1/3 text-[24rem] glow-text leading-none select-none pointer-events-none hidden lg:block"
            >
                01
            </motion.h1>

            {/* Content */}
            <motion.div
                style={{ y, opacity }}
                className="container mx-auto px-6 relative z-10 pt-20"
            >
                <div className="max-w-5xl">
                    {/* Status badge */}
                    <Header label="Available for Projects"/>

                    {/* Main headline - with text reveal effect */}
                    <div className="overflow-hidden mb-4">
                        <motion.h1
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.2,
                                ease: [0.4, 0, 0, 1],
                            }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl  leading-[0.9] tracking-tight"
                        >
                            WE BUILD
                        </motion.h1>
                    </div>
                    <div className="overflow-hidden mb-4">
                        <motion.h1
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.3,
                                ease: [0.4, 0, 0, 1],
                            }}
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl  leading-[0.9] tracking-tight text-outline-thick"
                        >
                            DIGITAL
                        </motion.h1>
                    </div>
                    <div className=" mb-8">
                        <motion.h1
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.4,
                                ease: [0.4, 0, 0, 1],
                            }}
                            className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl  leading-[0.9] tracking-tight"
                        >
                            EXPERIENCES
                        </motion.h1>
                    </div>

                    {/* Subheadline */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mt-8"
                    >
                        <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                            Smart, secure, and scalable web applications for
                            startups and small businesses. Transforming ideas
                            into powerful digital products.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.a
                                href="#contact"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document
                                        .querySelector("#contact")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary flex items-center gap-3"
                            >
                                <span>Start Project</span>
                                <ArrowDownRight className="w-4 h-4" />
                            </motion.a>
                            <motion.a
                                href="#work"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document
                                        .querySelector("#work")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-outline flex items-center justify-center gap-3"
                            >
                                View Work
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;

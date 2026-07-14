"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type HeaderProps = {
    tag?: string;
    label?: string;
    titleLine1?: string;
    titleLine2?: string;
    desc?: string; // ← new
    align?: "left" | "center";
    as?: "h1" | "h2" | "h3";
    delay?: number;
    className?: string;
};

const Header = ({
    tag,
    label,
    titleLine1,
    titleLine2,
    desc,
    align = "left",
    as: Heading = "h1",
    delay = 0,
    className = "",
}: HeaderProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const fullHeadingText = [titleLine1, titleLine2].filter(Boolean).join(" ");
    const centered = align === "center";

    const container = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.12, delayChildren: delay },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`mb-20 ${centered ? "text-center" : ""} ${className}`}
        >
            {/* ── Meta row ── */}
            {(tag || label) && (
                <motion.div
                    aria-hidden="true"
                    className={`flex items-center gap-3 mb-5 glow-text ${centered ? "justify-center" : ""}`}
                >
                    {tag && (
                        <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
                            {tag}
                        </span>
                    )}
                    {label && (
                        <>
                            <span className="w-2 h-2 bg-foreground animate-pulse glow-border" />
                            <span className="block w-16 h-px bg-foreground/20" />
                        </>
                    )}
                    {label && (
                        <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
                            {label}
                        </span>
                    )}
                </motion.div>
            )}

            {/* ── Heading ── */}
            <motion.div>
                <Heading
                    className="text-4xl md:text-5xl lg:text-7xl tracking-tight"
                    aria-label={fullHeadingText}
                >
                    {titleLine1 && (
                        <>
                            <span>{titleLine1}</span>
                            {titleLine2 && <br aria-hidden="true" />}
                        </>
                    )}
                    {titleLine2 && (
                        <span className="text-outline-thick" aria-hidden="true">
                            {titleLine2}
                        </span>
                    )}
                </Heading>
            </motion.div>

            {/* ── Description ── */}
            {desc && (
                <motion.p
                    className={`mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl ${
                        centered ? "mx-auto" : ""
                    }`}
                >
                    {desc}
                </motion.p>
            )}
        </motion.div>
    );
};

export default Header;

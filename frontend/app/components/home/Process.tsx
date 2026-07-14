"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Header from "../Header";
import { steps } from "~/Data/data";

const fadeLeft = {
    hidden: { opacity: 0, x: -32 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
    },
};

const fadeRight = {
    hidden: { opacity: 0, x: 32 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
    },
};

const scaleDot = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
    },
};

export const Process = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section id="process" className="py-24 relative" ref={ref}>
            {/* bg grid */}
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
                    tag="03"
                    label="How We Work"
                    titleLine1="Structure Meets"
                    titleLine2="Execution"
                    desc="A repeatable process that removes guesswork and keeps every project on track — from first call to final deploy."
                    align="center"
                />

                {/* ── DESKTOP zigzag timeline ── */}
                <div className="hidden md:block relative">
                    {/* centre spine */}
                    <div
                        className="absolute left-1/2 glow-border -translate-x-1/2 top-0 bottom-0 w-px"
                        style={{ background: "hsl(var(--foreground) / 0.2)" }}
                    />

                    <div className="flex flex-col gap-12">
                        {steps.map((step, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <div
                                    key={step.number}
                                    className="relative grid grid-cols-[1fr_80px_1fr] items-center gap-0"
                                >
                                    {/* ── LEFT slot ── */}
                                    <div className="pr-10">
                                        {isLeft ? (
                                            <motion.div
                                                variants={fadeLeft}
                                                initial="hidden"
                                                animate={
                                                    isInView
                                                        ? "visible"
                                                        : "hidden"
                                                }
                                                transition={{ delay: i * 0.12 }}
                                            >
                                                <StepCard step={step} />
                                            </motion.div>
                                        ) : (
                                            /* empty right-aligned label on even rows */
                                            <motion.div
                                                variants={fadeLeft}
                                                initial="hidden"
                                                animate={
                                                    isInView
                                                        ? "visible"
                                                        : "hidden"
                                                }
                                                transition={{ delay: i * 0.12 }}
                                                className="flex justify-end"
                                            >
                                                <span className="text-[1rem] uppercase tracking-[0.25em]">
                                                    {step.phase}
                                                </span>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* ── Centre dot ── */}
                                    <div className="flex justify-center ">
                                        <motion.div
                                            variants={scaleDot}
                                            initial="hidden"
                                            animate={
                                                isInView ? "visible" : "hidden"
                                            }
                                            transition={{
                                                delay: i * 0.12 + 0.2,
                                            }}
                                            className="relative z-10 flex flex-col items-center"
                                        >
                                            {/* connector lines */}
                                            {isLeft ? (
                                                /* line goes right */
                                                <div
                                                    className="absolute left-1/2 top-1/2 -translate-y-1/2 w-10 h-px"
                                                    style={{
                                                        background:
                                                            "hsl(var(--foreground) / 0.2)",
                                                    }}
                                                />
                                            ) : (
                                                /* line goes left */
                                                <div
                                                    className="absolute right-1/2 top-1/2 -translate-y-1/2 w-10 h-px"
                                                    style={{
                                                        background:
                                                            "hsl(var(--foreground) / 0.2)",
                                                    }}
                                                />
                                            )}
                                            <div
                                                className="w-11 h-11 glow-border animate-pulse glow-text rounded-full border-2 flex items-center justify-center text-[0.65rem] font-bold relative z-10"
                                                style={{
                                                    background:
                                                        "hsl(var(--background))",
                                                    color: "hsl(var(--foreground) / 0.8)",
                                                }}
                                            >
                                                {step.number}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* ── RIGHT slot ── */}
                                    <div className="pl-10">
                                        {!isLeft ? (
                                            <motion.div
                                                variants={fadeRight}
                                                initial="hidden"
                                                animate={
                                                    isInView
                                                        ? "visible"
                                                        : "hidden"
                                                }
                                                transition={{ delay: i * 0.12 }}
                                            >
                                                <StepCard step={step} />
                                            </motion.div>
                                        ) : (
                                            /* empty left-aligned label on odd rows */
                                            <motion.div
                                                variants={fadeRight}
                                                initial="hidden"
                                                animate={
                                                    isInView
                                                        ? "visible"
                                                        : "hidden"
                                                }
                                                transition={{ delay: i * 0.12 }}
                                            >
                                                <span className="text-[1rem] uppercase tracking-[0.25em]">
                                                    {step.phase}
                                                </span>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── MOBILE single column ── */}
                <div className="flex flex-col gap-0 md:hidden relative">
                    {/* left spine */}
                    <div
                        className="absolute left-[19px] top-0 bottom-0 w-px"
                        style={{ background: "hsl(var(--foreground) / 0.1)" }}
                    />

                    {steps.map((step, i) => (
                        <motion.div
                            key={step.number}
                            variants={fadeLeft}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            transition={{ delay: i * 0.1 }}
                            className="relative grid grid-cols-[40px_1fr] gap-5 pb-10 last:pb-0"
                        >
                            {/* dot */}
                            <div className="flex justify-center pt-1">
                                <div
                                    className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-[0.6rem] font-bold shrink-0 relative z-10"
                                    style={{
                                        background: "hsl(var(--background))",
                                        borderColor:
                                            "hsl(var(--foreground) / 0.2)",
                                        color: "hsl(var(--foreground) / 0.5)",
                                        boxShadow:
                                            "0 0 0 3px hsl(var(--background))",
                                    }}
                                >
                                    {step.number}
                                </div>
                            </div>

                            {/* card */}
                            <StepCard step={step} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ── Shared card component ─────────────────────────────────────── */
type Step = (typeof steps)[number];

const StepCard = ({ step }: { step: Step }) => (
    <div
        className="group rounded-2xl p-5 md:p-6 transition-all duration-300 hover:border-foreground/50 glass glow-border"
    >
        <span className="text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
            {step.phase}
        </span>
        <h3 className="text-lg md:text-xl tracking-tight mt-1 mb-3">
            {step.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {step.desc}
        </p>
        <div
            className="flex items-center gap-2 pt-3"
            style={{ borderTop: "1px solid hsl(var(--foreground) / 0.07)" }}
        >
            <span
                className="w-3 h-px shrink-0"
                style={{ background: "hsl(var(--foreground) / 0.3)" }}
            />
            <span className="text-[0.65rem] text-muted-foreground">
                {step.deliverable}
            </span>
        </div>
    </div>
);

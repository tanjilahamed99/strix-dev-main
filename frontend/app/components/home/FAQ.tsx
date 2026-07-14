"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Header from "../Header";
import { faqs } from "~/Data/data";


export const FAQ = ({limit = 6}:{limit?:number}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-24 relative" ref={ref}>
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                                      linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
                    backgroundSize: "80px 80px",
                }}
            />

            {/* Schema.org FAQ structured data — boosts Google rich results */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: faqs.map((faq) => ({
                            "@type": "Question",
                            name: faq.q,
                            acceptedAnswer: { "@type": "Answer", text: faq.a },
                        })),
                    }),
                }}
            />

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 items-start">
                    {/* sticky left column */}
                    <div className="lg:sticky lg:top-24">
                        <Header
                            tag="06"
                            label="FAQ"
                            titleLine1="Questions"
                            titleLine2="Answered"
                            desc="Everything clients usually ask before we start working together."
                            className="mb-0"
                        />

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="mt-10 p-5 rounded-2xl"
                            style={{
                                background: "hsl(var(--foreground) / 0.04)",
                                border: "1px solid hsl(var(--foreground) / 0.1)",
                            }}
                        >
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                Still have a question not covered here? We reply
                                to every message within 24 hours.
                            </p>

                            <a
                                href="#contact"
                                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
                            >
                                Ask us directly
                                <span aria-hidden="true">→</span>
                            </a>
                        </motion.div>
                    </div>

                    {/* accordion */}
                    <div
                        className="flex flex-col divide-y"
                        style={{ borderColor: "hsl(var(--foreground) / 0.08)" }}
                    >
                        {faqs.slice(0, limit).map((faq, i) => {
                            const isOpen = openIndex === i;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={
                                        isInView ? { opacity: 1, x: 0 } : {}
                                    }
                                    transition={{
                                        delay: i * 0.06,
                                        duration: 0.45,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            setOpenIndex(isOpen ? null : i)
                                        }
                                        className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                                        aria-expanded={isOpen}
                                    >
                                        <span className="font-display text-base md:text-lg tracking-tight leading-snug group-hover:opacity-70 transition-opacity">
                                            {faq.q}
                                        </span>
                                        <motion.span
                                            animate={{
                                                rotate: isOpen ? 45 : 0,
                                            }}
                                            transition={{
                                                duration: 0.25,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            className="shrink-0 mt-1 font-mono text-xl leading-none text-muted-foreground"
                                            aria-hidden="true"
                                        >
                                            +
                                        </motion.span>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                key="answer"
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    height: "auto",
                                                    opacity: 1,
                                                }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{
                                                    duration: 0.35,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <p className="pb-6 text-sm md:text-base text-muted-foreground leading-relaxed">
                                                    {faq.a}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
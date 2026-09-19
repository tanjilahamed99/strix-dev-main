"use client";

import { Video, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { openConsultationModal } from "../BookConsultationModal";

const AboutCTA = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-card/30 border-t border-border/50">
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto"
                >
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 inline-block">
                        Work With Us
                    </span>
                    <h2 className="text-3xl md:text-5xl tracking-tight mb-6">
                        Looking for a Trusted Tech Partner?
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg mb-10 leading-relaxed">
                        Whether you need a full engineering team to build your next SaaS platform or want to explore AI automation, schedule a free strategy call with our leadership.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => openConsultationModal()}
                            className="btn-primary inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3.5"
                        >
                            <Video className="w-4 h-4 text-emerald-400" />
                            <span>Book Strategy Session</span>
                        </button>
                        <Link
                            href="/contact"
                            className="btn-outline inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3.5 text-xs"
                        >
                            <span>Contact Us</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutCTA;
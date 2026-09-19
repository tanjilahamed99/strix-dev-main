"use client";

import { motion } from "framer-motion";
import { Video, ArrowRight } from "lucide-react";
import Link from "next/link";
import { openConsultationModal } from "../BookConsultationModal";

const ServiceCTA = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-card/40 border-t border-border/60">
            <div className="container mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto"
                >
                    <span className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold mb-3 inline-block">
                        Free 30-Minute Consultation
                    </span>
                    <h2 className="text-3xl md:text-5xl tracking-tight mb-6">
                        Ready to Build or Scale Your Software?
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg mb-10 leading-relaxed">
                        Book a free strategy session with our engineering team. We'll analyze your requirements, recommend the ideal architecture, and outline an actionable roadmap.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => openConsultationModal()}
                            className="btn-primary inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3.5"
                        >
                            <Video className="w-4 h-4 text-emerald-400" />
                            <span>Book Google Meet Call</span>
                        </button>
                        <Link
                            href="/contact"
                            className="btn-outline inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3.5 text-xs"
                        >
                            <span>Send Project Brief</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ServiceCTA;

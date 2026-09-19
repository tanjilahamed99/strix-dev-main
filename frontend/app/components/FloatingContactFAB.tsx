"use client";

import { useState } from "react";
import { Linkedin, Plus, Phone, Calendar, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { openConsultationModal } from "./BookConsultationModal";

const FloatingContactFAB = () => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    if (pathname?.startsWith("/admin")) {
        return null;
    }
    const encodedWhatsAppMessage = encodeURIComponent(
        "Hi Strix Devs! I would like to discuss a project with you."
    );
    const whatsappUrl = `https://wa.me/+8801518933208?text=${encodedWhatsAppMessage}`;

    const links = [
        {
            href: whatsappUrl,
            icon: Phone,
            label: "WhatsApp",
            bg: "bg-emerald-600 hover:bg-emerald-500",
            isAction: false,
        },
        {
            href: "https://www.linkedin.com/company/strixdevs",
            icon: Linkedin,
            label: "LinkedIn",
            bg: "bg-blue-700 hover:bg-blue-600",
            isAction: false,
        },
    ];

    return (
        <div className="fixed bottom-10 right-8 sm:bottom-12 sm:right-12 flex flex-col items-end gap-3 z-40">
            <AnimatePresence>
                {open && (
                    <>
                        {/* Book Consultation Button */}
                        <motion.button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                openConsultationModal();
                            }}
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2 glow-text glow-border bg-white text-black font-semibold px-4 py-2.5 rounded-full shadow-xl hover:scale-105 transition-transform text-xs uppercase tracking-wider"
                        >
                            <Video className="w-4 h-4 text-emerald-600" />
                            <span>Book Consultation</span>
                        </motion.button>

                        {links.map((link, i) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                transition={{ delay: (i + 1) * 0.05, duration: 0.2 }}
                                className={`flex items-center gap-2 glow-text glow-border ${link.bg} text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform text-xs uppercase tracking-wider`}
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </motion.a>
                        ))}
                    </>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setOpen(!open)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="glass p-3 rounded-full border border-foreground/30 text-foreground glow-text glow-border shadow-xl bg-card/80 backdrop-blur-md"
                aria-label={
                    open ? "Close contact options" : "Open consultation & contact options"
                }
            >
                <Plus className="w-6 h-6" />
            </motion.button>
        </div>
    );
};

export default FloatingContactFAB;

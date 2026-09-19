"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { openConsultationModal } from "./BookConsultationModal";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Work", href: "/work" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    if (pathname?.startsWith("/admin")) {
        return null;
    }

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0, 1] }}
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
                    isScrolled ? "glass py-4 glow-border" : "py-6"
                }`}
            >
                <div className="lg:container mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3"
                        >
                            <img
                                src="/images/icon1.png"
                                className="w-12 h-12 object-contain"
                                loading="eager"
                                alt="Strix Devs Logo"
                            />
                            <span className="text-xl tracking-tight glow-text">
                                STRIX
                                <span className="text-muted-foreground font-heading font-light ml-1">
                                    DEVS
                                </span>
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-8">
                        {navLinks.map((link, index) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.1 * index + 0.3,
                                    duration: 0.5,
                                }}
                            >
                                <Link
                                    href={link.href}
                                    className={`relative text-xs lg:text-sm font-header uppercase tracking-[0.2em] transition-all duration-300 ${
                                        isActive(link.href)
                                            ? "text-foreground glow-text font-medium"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {link.name}
                                    {isActive(link.href) && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute -bottom-1 left-0 right-0 h-px bg-foreground"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Actions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="hidden md:flex items-center gap-3"
                    >
                        <button
                            type="button"
                            onClick={() => openConsultationModal()}
                            className="btn-primary flex items-center gap-2 text-xs py-2 px-4 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-shadow"
                            aria-label="Book Free Consultation on Google Meet"
                        >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Book Consultation</span>
                        </button>
                    </motion.div>

                    {/* Mobile Menu Button */}
                    <button
                        aria-label="Toggle navigation menu"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-foreground hover:text-muted-foreground transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-background md:hidden"
                    >
                        <div className="flex flex-col items-center justify-center h-full gap-7 px-6 text-center">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: 0.05 * index }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className={`text-2xl font-header tracking-tight transition-colors ${
                                            isActive(link.href)
                                                ? "text-foreground font-semibold glow-text"
                                                : "text-muted-foreground"
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="w-full max-w-xs pt-4 space-y-3"
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        openConsultationModal();
                                    }}
                                    className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                                >
                                    <Calendar className="w-4 h-4" />
                                    <span>Book Free Consultation</span>
                                </button>
                                <Link
                                    href="/contact"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="btn-outline w-full flex items-center justify-center gap-2 py-3 text-xs"
                                >
                                    Get in Touch
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;

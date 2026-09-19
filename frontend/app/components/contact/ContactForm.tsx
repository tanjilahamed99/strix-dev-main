"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Video, Calendar, Shield, AlertCircle } from "lucide-react";
import { contactInfo } from "~/Data/data";
import { openConsultationModal } from "../BookConsultationModal";

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Auto-fill known visitor details (server-side fetched)
    useEffect(() => {
        fetch("/api/visitor/me")
            .then((r) => r.json())
            .then((data) => {
                if (data?.found) {
                    setFormData((prev) => ({
                        ...prev,
                        name: prev.name || data.name || "",
                        email: prev.email || data.email || "",
                        phone: prev.phone || data.phone || "",
                    }));
                }
            })
            .catch(() => { });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "inquiry",
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to send message.");
            }

            setIsSubmitted(true);
            setFormData({
                name: "",
                email: "",
                phone: "",
                message: "",
            });
        } catch (error) {
            console.error("Nodemailer contact error:", error);
            setErrorMessage(
                error instanceof Error ? error.message : "Failed to send message. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section className="py-20 relative" id="contact">
            <div className="container mx-auto px-6">
                {/* Fast Banner for Google Meet Consultation */}
                <div className="mb-14 p-6 rounded-xl border border-emerald-500/30 bg-emerald-950/15 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                            <Video className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
                                Prefer a direct 1-on-1 discussion?
                                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                                    30 Min Free
                                </span>
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                Book a 30-minute strategic consultation with our engineering lead on Google Meet.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => openConsultationModal()}
                        className="btn-primary flex items-center gap-2 whitespace-nowrap text-xs py-3 px-5 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] transition-shadow"
                    >
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>Book Google Meet Call</span>
                    </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-20">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="text-2xl mb-4">Send a Message</h2>
                        <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
                            Have questions or want to discuss your project scope? Drop us a line below. Our engineering team reviews each inquiry and replies with customized suggestions within 24 hours.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3"
                                    >
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-0 py-4 bg-transparent border-0 border-b border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                                        placeholder="Alex Morgan"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3"
                                    >
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-0 py-4 bg-transparent border-0 border-b border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                                        placeholder="alex@company.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3"
                                >
                                    Phone / WhatsApp (Optional)
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-0 py-4 bg-transparent border-0 border-b border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3"
                                >
                                    Project Details *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-0 py-4 bg-transparent border-0 border-b border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
                                    placeholder="Describe your project, timeline, expected tech stack, or budget..."
                                />
                            </div>

                            {errorMessage && (
                                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>
                                    {isSubmitting
                                        ? "Sending Message..."
                                        : isSubmitted
                                            ? "Message Sent!"
                                            : "Send Message"}
                                </span>
                                {!isSubmitting && !isSubmitted && (
                                    <ArrowUpRight
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                    />
                                )}
                                {isSubmitted && (
                                    <Check
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                    />
                                )}
                            </motion.button>

                            <ul
                                className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-xs text-muted-foreground"
                                aria-label="Consultation guarantees"
                            >
                                <li className="flex items-center gap-1.5 text-emerald-400">
                                    <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                                    Free Consultation
                                </li>
                                <li className="flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                    No Commitment Required
                                </li>
                                <li className="flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                    Response Within 24 Hours
                                </li>
                            </ul>

                            {isSubmitted && (
                                <div
                                    role="status"
                                    aria-live="polite"
                                    className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs mt-4"
                                >
                                    ✓ Thank you! We have received your inquiry and sent a confirmation email to your inbox. An engineer will follow up within 24 hours.
                                </div>
                            )}
                        </form>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="text-2xl mb-8">Contact Channels</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                            {contactInfo.map((info, index) => (
                                <motion.a
                                    key={info.label}
                                    href={info.href}
                                    target={
                                        info.href.startsWith("http")
                                            ? "_blank"
                                            : undefined
                                    }
                                    rel={
                                        info.href.startsWith("http")
                                            ? "noopener noreferrer"
                                            : undefined
                                    }
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-4 p-6 border border-border group hover:bg-card transition-colors cursor-hover"
                                >
                                    <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all">
                                        <info.icon className="w-4 h-4 text-foreground group-hover:text-background transition-colors" />
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                                            {info.label}
                                        </div>
                                        <div className="text-sm">
                                            {info.value}
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                        <div className="pt-10">
                            <h6 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                                Working Hours & Availability
                            </h6>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Monday - Friday: 9:00 AM - 6:00 PM EST
                                <br />
                                Google Meet Strategy Sessions available 7 days a week by appointment
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
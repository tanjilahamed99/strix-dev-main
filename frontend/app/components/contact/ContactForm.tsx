import { useState } from 'react';
import { motion } from "framer-motion";
import { ArrowUpRight, Check} from 'lucide-react';
import { contactInfo } from '~/Data/data';
import { SendEmail } from '~/lib/email';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            setIsSubmitted(true);
            await SendEmail(formData);

            setFormData({
                name: "",
                email: "",
                message: "",
            });
        } catch (error) {
            console.error("EmailJS error:", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (
        <section className="py-20 relative" id="contact">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="text-2xl mb-4">Let's Talk</h2>
                        <p className="text-muted-foreground mb-8 leading-relaxed">
                            Have questions before starting? Reach out anytime.
                            We'd love to discuss your ideas and explore how
                            Strix Devs can help your business grow.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-xs  uppercase tracking-[0.2em] text-muted-foreground mb-3"
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
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-xs  uppercase tracking-[0.2em] text-muted-foreground mb-3"
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
                                        placeholder="john@company.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-xs  uppercase tracking-[0.2em] text-muted-foreground mb-3"
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
                                    placeholder="Describe your project, business goals, expected features, timeline, and budget (optional). We'll review everything and get back to you within 24 hours."
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>
                                    {isSubmitting
                                        ? "Sending Consultation Request..."
                                        : isSubmitted
                                          ? "Consultation Request Sent!"
                                          : "Get Free Consultation"}
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
                                <li className="flex items-center gap-1.5">
                                    <Check
                                        className="w-3.5 h-3.5"
                                        aria-hidden="true"
                                    />
                                    Free Consultation
                                </li>
                                <li className="flex items-center gap-1.5">
                                    <Check
                                        className="w-3.5 h-3.5"
                                        aria-hidden="true"
                                    />
                                    No Commitment Required
                                </li>
                                <li className="flex items-center gap-1.5">
                                    <Check
                                        className="w-3.5 h-3.5"
                                        aria-hidden="true"
                                    />
                                    Response Within 24 Hours
                                </li>
                            </ul>

                            {isSubmitted && (
                                <p
                                    role="status"
                                    aria-live="polite"
                                    className="mt-4 text-sm text-muted-foreground"
                                >
                                    Thanks for reaching out. We've received your
                                    request and will be in touch within 24
                                    hours.
                                </p>
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
                        <h2 className="text-2xl  mb-8">Contact Information</h2>

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
                                        <div className="text-xs  uppercase tracking-[0.2em] text-muted-foreground mb-1">
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
                            <h4 className="text-xs  uppercase tracking-[0.2em] text-muted-foreground mb-4">
                                Business Hours
                            </h4>
                            <p className="text-muted-foreground">
                                Monday - Friday: 9:00 AM - 6:00 PM EST
                                <br />
                                Weekend availability by appointment
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
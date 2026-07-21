import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            icon: Linkedin,
            href: "https://linkedin.com/company/strixdevs",
            label: "LinkedIn",
        },
        {
            icon: Twitter,
            href: "https://x.com/strixdevs",
            label: "Twitter",
        },
        {
            icon: Github,
            href: "https://github.com/strixdevs1",
            label: "GitHub",
        },
        {
            icon: Facebook,
            href: "https://facebook.com/strixdevs.1",
            label: "Facebook",
        },
        {
            icon: Instagram,
            href: "https://instagram.com/strix.devs",
            label: "Instagram",
        },
    ];

    const footerLinks = {
        Services: [
            {
                name: "Custom Web Applications",
                href: "/services/#custom-web-applications",
            },
            {
                name: "SaaS Development",
                href: "/services/#saas-development",
            },
            {
                name: "Business Dashboards",
                href: "/services/#business-dashboards",
            },
            {
                name: "API Development",
                href: "/services/#api-development",
            },
            {
                name: "AI Automation",
                href: "/services/#ai-automation",
            },
            {
                name: "Cloud & DevOps",
                href: "/services/#cloud-devops",
            },
            {
                name: "Maintenance & Support",
                href: "/services/#maintenance-support",
            },
        ],

        Company: [
            { name: "Home", href: "/" },
            { name: "About Us", href: "/about" },
            { name: "Services", href: "/services" },
            { name: "Our Work", href: "/work" },
            { name: "Contact", href: "/contact" },
        ],
    };

    return (
        <footer className="relative pt-20 pb-10 overflow-hidden bg-background">
            {/* Top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-border" />
            <div className="noise-overlay" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand column */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            {/* Logo */}
                            <img
                                src="/images/icon1.png"
                                className="w-14"
                                loading="lazy"
                                alt="Strix Devs Logo"
                            />
                            <span className="text-xl tracking-tight">
                                STRIX
                                <span className="text-muted-foreground glow-text font-heading font-light ml-1">
                                    DEVS
                                </span>
                            </span>
                        </motion.div>
                        <p className="text-muted-foreground text-sm max-w-md mb-8 leading-relaxed">
                            Smart, secure, and scalable web applications for
                            startups and small businesses. Transform your ideas
                            into powerful digital experiences.
                        </p>

                        {/* Social links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3 }}
                                    className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-xs  uppercase tracking-[0.2em] text-muted-foreground mb-6">
                                {title}
                            </h4>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li
                                        key={link.name}
                                        className=" relative w-fit text-sm text-foreground/70 hover:text-foreground transition-colors link-underline"
                                    >
                                        <Link to={link.href}>{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-10 border-t border-border">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs  text-muted-foreground">
                            © {currentYear} Strix Devs. All rights reserved.
                        </p>
                        <div className="flex gap-8">
                            <Link
                                to="/privacy-policy"
                                className="text-xs  text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                to="/terms-of-service"
                                className="text-xs  text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

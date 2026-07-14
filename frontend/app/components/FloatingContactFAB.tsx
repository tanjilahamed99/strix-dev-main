import { useState } from "react";
import { Linkedin, Facebook, Plus, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingContactFAB = () => {
    const [open, setOpen] = useState(false);
    const encodedWhatsAppMessage = encodeURIComponent(
        "Hi! I want to connect with you.",
    );
    const whatsappUrl = `https://wa.me/+8801882862391?text=${encodedWhatsAppMessage}`;
    // const messengerUrl = `https://m.me/yourpageusername`;

    const links = [
        {
            href: whatsappUrl,
            icon: Phone,
            label: "WhatsApp",
            bg: "bg-green-500",
        },
        // {
        //     href: messengerUrl,
        //     icon: Facebook,
        //     label: "Messenger",
        //     bg: "bg-blue-500",
        // },
        {
            href: "https://www.linkedin.com/company/strixdevs",
            icon: Linkedin,
            label: "LinkedIn",
            bg: "bg-blue-700",
        },
    ];

    return (
        <div className="fixed bottom-12 right-12 flex flex-col items-end gap-3 z-50 ">
            <AnimatePresence>
                {open &&
                    links.map((link, i) => (
                        <motion.a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            transition={{ delay: i * 0.05, duration: 0.2 }}
                            className={`flex items-center gap-2 glow-text glow-border ${link.bg} text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform  text-sm uppercase tracking-wider`}
                        >
                            <link.icon className="w-5 h-5" />
                            {link.label}
                        </motion.a>
                    ))}
            </AnimatePresence>

            <motion.button
                onClick={() => setOpen(!open)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.95 }}
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="glass p-2.5 rounded-full border border-foreground/20 text-foreground glow-text glow-border"
                aria-label={
                    open ? "Close contact options" : "Open contact options"
                }
            >
                <Plus className="w-7 h-7" />
            </motion.button>
        </div>
    );
};

export default FloatingContactFAB;

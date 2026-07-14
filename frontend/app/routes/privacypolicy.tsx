import { motion } from "framer-motion";

export default function PrivacyPolicy() {
    return (
        <main className="pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-xs  uppercase tracking-[0.3em] text-muted-foreground">
                            Legal
                        </span>
                        <div className="w-16 h-px bg-foreground/30" />
                    </div>
                    <h1 className="text-4xl md:text-6xl  tracking-tight mb-12">
                        Privacy Policy
                    </h1>
                    <div className="text-sm  text-muted-foreground mb-12">
                        Last updated: January 2026
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-12"
                >
                    <section className="space-y-4">
                        <h2 className="text-xl  tracking-tight">
                            01 — Information We Collect
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            We collect information you provide directly to us,
                            such as when you fill out a contact form, request a
                            quote, or communicate with us via email. This may
                            include your name, email address, phone number,
                            company name, and any other information you choose
                            to provide.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-xl  tracking-tight">
                            02 — How We Use Your Information
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            We use the information we collect to respond to your
                            inquiries, provide our services, send you updates
                            about our services, and improve our website and user
                            experience. We do not sell, trade, or rent your
                            personal information to third parties.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-xl  tracking-tight">
                            03 — Cookies & Tracking
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            We may use cookies and similar tracking technologies
                            to track activity on our website and hold certain
                            information. Cookies are files with a small amount
                            of data which may include an anonymous unique
                            identifier. You can instruct your browser to refuse
                            all cookies or to indicate when a cookie is being
                            sent.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-xl  tracking-tight">
                            04 — Data Security
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            We implement appropriate technical and
                            organizational security measures to protect your
                            personal information against unauthorized access,
                            alteration, disclosure, or destruction. However, no
                            method of transmission over the Internet is 100%
                            secure.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-xl  tracking-tight">
                            05 — Third-Party Services
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            We may employ third-party companies and individuals
                            to facilitate our services, provide services on our
                            behalf, or assist us in analyzing how our services
                            are used. These third parties have access to your
                            personal information only to perform these tasks on
                            our behalf and are obligated not to disclose or use
                            it for any other purpose.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-xl  tracking-tight">
                            06 — Your Rights
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            You have the right to access, update, or delete your
                            personal information at any time. You may also opt
                            out of receiving promotional communications from us
                            by following the instructions in those messages. If
                            you have any questions about your rights, please
                            contact us at shamimweb78@gmail.com.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-xl  tracking-tight">
                            07 — Contact Us
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            If you have any questions about this Privacy Policy,
                            please contact us at:
                        </p>
                        <div className=" text-sm">
                            <p>Email: shamimweb78@gmail.com</p>
                            <p>Location: Toronto, Canada</p>
                        </div>
                    </section>
                </motion.div>
            </div>
        </main>
    );
};
import { motion } from "framer-motion";

export default function TermsOfService() {
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
                        Terms of Service
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
                            01 — Agreement to Terms
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using our website and services, you
                            agree to be bound by these Terms of Service. If you
                            disagree with any part of the terms, you may not
                            access our services. These terms apply to all
                            visitors, users, and clients who access or use our
                            services.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-xl  tracking-tight">
                            02 — Our Services
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            Strix Devs provides web development, design, and
                            related digital services. The specific scope,
                            deliverables, timeline, and pricing for each project
                            will be outlined in a separate agreement or
                            proposal. We reserve the right to refuse service to
                            anyone for any reason at any time.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-xl  tracking-tight">
                            03 — Intellectual Property
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            Upon full payment, you will own all rights to the
                            final deliverables created specifically for your
                            project. However, we retain the right to use
                            portions of the work for portfolio, marketing, and
                            promotional purposes unless otherwise agreed in
                            writing. Any pre-existing materials, frameworks, or
                            code libraries remain our property or the property
                            of their respective owners.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-xl  tracking-tight">
                            04 — Payment Terms
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            Payment terms will be specified in individual
                            project agreements. Generally, we require a deposit
                            before commencing work, with the balance due upon
                            project completion. Late payments may result in
                            project delays or suspension of services. All fees
                            are non-refundable unless otherwise stated.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-xl  tracking-tight">
                            05 — Client Responsibilities
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            You are responsible for providing accurate and
                            complete information, timely feedback, and necessary
                            materials required for project completion. Delays in
                            providing these may affect project timelines. You
                            also warrant that any content you provide does not
                            infringe on third-party rights.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-xl  tracking-tight">
                            06 — Limitation of Liability
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            To the maximum extent permitted by law, Strix Devs
                            shall not be liable for any indirect, incidental,
                            special, consequential, or punitive damages, or any
                            loss of profits or revenues. Our total liability for
                            any claims shall not exceed the amount paid for the
                            specific service giving rise to the claim.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-xl  tracking-tight">
                            07 — Termination
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            Either party may terminate the agreement with
                            written notice. Upon termination, you shall pay for
                            all services rendered up to the termination date. We
                            may terminate or suspend access to our services
                            immediately, without prior notice, for conduct that
                            we believe violates these terms or is harmful to
                            other users or us.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-xl  tracking-tight">
                            08 — Governing Law
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            These Terms shall be governed by and construed in
                            accordance with the laws of Ontario, Canada, without
                            regard to its conflict of law provisions. Any
                            disputes arising from these terms will be resolved
                            in the courts of Ontario, Canada.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-xl  tracking-tight">
                            09 — Contact Us
                        </h2>
                        <div className="w-full h-px bg-border mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                            If you have any questions about these Terms of
                            Service, please contact us at:
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

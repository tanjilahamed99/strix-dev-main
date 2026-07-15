import { Link } from 'react-router';
import { motion } from "framer-motion";

const HeroSection = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-50" />
            <div className="noise-overlay" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            to="/"
                            className="text-xs  uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Home
                        </Link>
                        <div className="w-8 h-px bg-foreground/30" />
                        <span className="text-xs  uppercase tracking-[0.3em] text-foreground">
                            About
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-8xl  tracking-tight mb-8">
                        About Us
                    </h1>

                    <div className="grid lg:grid-cols-2 gap-12">
                        <p className="text-muted-foreground leading-relaxed">
                            <strong className="text-lg text-foreground/70">
                                STRIX{" "}
                                <span className="font-heading glow-text">
                                    DEVS
                                </span>
                            </strong>{" "}
                            is a modern web development agency helping startups,
                            businesses, and entrepreneurs build fast, secure,
                            and scalable digital products. We specialize in
                            custom web applications, SaaS platforms, business
                            websites, dashboards, APIs, and AI-powered
                            automation solutions that drive real business
                            growth.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Our name is inspired by{" "}
                            <strong className="text-foreground/70">
                                "STRIX"
                            </strong>
                            , the owl genus, symbolizing wisdom, precision, and
                            strategic thinking. These values shape how we
                            approach every project—combining thoughtful design,
                            modern technology, and clean engineering to deliver
                            solutions that are reliable, scalable, and built for
                            long-term success.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
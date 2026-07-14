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
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            <strong className="text-foreground/70">
                                STRIX{" "}
                                <span className="font-heading glow-text">
                                    DEVS{" "}
                                </span>
                            </strong>
                            is a boutique web development agency based in
                            Toronto, Canada. We specialize in creating smart,
                            secure, and scalable digital solutions for startups
                            and growing businesses.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Our name comes from{" "}
                            <strong className="text-foreground/70">
                                "STRIX"{" "}
                            </strong>{" "}
                            – the owl genus – representing wisdom, insight, and
                            the ability to see opportunities where others see
                            challenges. Like the owl, we work with precision and
                            deliver solutions that stand the test of time.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
import { motion } from "framer-motion";
import { Link } from "react-router";

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
                            Work
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-8xl  tracking-tight mb-8">
                        Our Work
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                        A showcase of our recent projects. Each crafted with
                        precision, passion, and a commitment to excellence.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;

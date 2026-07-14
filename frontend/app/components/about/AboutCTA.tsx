import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const AboutCTA = () => {
    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl  tracking-tight mb-6">
                        Want to Join Our Team?
                    </h2>
                    <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
                        We're always looking for talented individuals who share
                        our passion for excellence.
                    </p>
                    <Link
                        to="/contact"
                        className="btn-primary inline-flex items-center gap-3"
                    >
                        <span>Get in Touch</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutCTA;
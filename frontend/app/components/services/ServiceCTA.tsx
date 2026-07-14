import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Link } from "react-router";

const ServiceCTA = () => {
    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl  tracking-tight mb-6">
                        Ready to Start?
                    </h2>
                    <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
                        Let's discuss your project and find the perfect solution
                        for your business.
                    </p>
                    <Link
                        to="/contact"
                        className="btn-primary inline-flex items-center gap-3"
                    >
                        <span>Get in Touch</span>
                        <Zap className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default ServiceCTA;

import { ExternalLink } from 'lucide-react';
import { motion } from "framer-motion";
import { Link } from 'react-router';

const WorkCTA = () => {
    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl  tracking-tight mb-6">
                        Have a Project in Mind?
                    </h2>
                    <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
                        Let's create something amazing together. We'd love to
                        hear about your ideas.
                    </p>
                    <Link
                        to="/contact"
                        className="btn-primary inline-flex items-center gap-3"
                    >
                        <span>Start a Project</span>
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default WorkCTA;
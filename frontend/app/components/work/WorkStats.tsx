import { motion } from "framer-motion";

const WorkStats = () => {
    return (
        <section className="py-20 bg-card relative">
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="noise-overlay" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: "50+", label: "Projects Completed" },
                        { value: "30+", label: "Happy Clients" },
                        { value: "5+", label: "Years Experience" },
                        { value: "98%", label: "Client Satisfaction" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-4xl md:text-5xl lg:text-6xl  mb-2">
                                {stat.value}
                            </div>
                            <div className="text-xs  uppercase tracking-[0.2em] text-muted-foreground">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WorkStats;

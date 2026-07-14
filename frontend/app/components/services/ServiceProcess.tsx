import { motion } from "framer-motion";
import { steps } from "~/Data/data";

const ServiceProcess = () => {
    return (
        <section className="py-20 bg-card relative">
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="noise-overlay" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl  tracking-tight mb-6">
                        Our Process
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        A streamlined approach that ensures quality results on
                        time and within budget.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 ">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group transition-all duration-300 border hover:border-foreground/40 p-8"
                        >
                            <div className="flex gap-3 items-center my-2 animate-pulse">
                                <span className="w-20 h-px bg-foreground/40" />
                                <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
                                    {step.phase}
                                </span>
                            </div>
                            <h3
                                className="absolute top-4 right-5 glow-text text-5xl font-bold opacity-20 leading-none select-none pointer-events-none transition-opacity duration-300 group-hover:opacity-40"
                                style={{
                                    color: "hsl(var(--foreground))",
                                }}
                            >
                                {step.number}
                            </h3>
                            <h3 className="text-xl  mb-3">{step.title}</h3>
                            <p className="text-muted-foreground text-sm">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceProcess;

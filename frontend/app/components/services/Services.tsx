import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { services } from "~/Data/data";

const ServicesSection = () => {

    const ref = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-6">
                <div ref={ref} className="grid md:grid-cols-2 gap-0">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            id={service.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                                ease: [0.4, 0, 0, 1],
                            }}
                            className="group border border-border p-8 lg:p-12 cursor-hover hover:bg-card transition-colors duration-500"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-14 h-14 border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-500">
                                    <service.icon className="w-6 h-6 text-foreground group-hover:text-background transition-colors duration-500" />
                                </div>
                                <span className="text-xs  text-muted-foreground">
                                    {service.number}
                                </span>
                            </div>

                            <h3 className="text-2xl md:text-3xl  tracking-tight mb-4 group-hover:translate-x-2 transition-transform duration-500">
                                {service.title}
                            </h3>

                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                {service.description}
                            </p>

                            <ul className="space-y-2">
                                {service.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-center gap-3 text-sm"
                                    >
                                        <div className="w-1 h-1 bg-foreground" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;

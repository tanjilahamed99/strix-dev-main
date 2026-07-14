import { motion } from "framer-motion";

const milestones = [
    { year: "2019", event: "Strix Devs founded in Toronto" },
    { year: "2020", event: "First major enterprise client" },
    { year: "2021", event: "Expanded team to 10 members" },
    { year: "2022", event: "Launched international operations" },
    { year: "2023", event: "50+ projects milestone" },
    { year: "2024", event: "Opening Vancouver office" },
];

const AboutTImeline = () => {
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
                    <h2 className="text-4xl md:text-5xl  tracking-tight">
                        Our Journey
                    </h2>
                </motion.div>

                <div className="relative">
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border" />

                    <div className="space-y-12">
                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={milestone.year}
                                initial={{
                                    opacity: 0,
                                    x: index % 2 === 0 ? -30 : 30,
                                }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={`relative flex items-center ${
                                    index % 2 === 0
                                        ? "md:flex-row"
                                        : "md:flex-row-reverse"
                                }`}
                            >
                                <div
                                    className={`flex-1 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}
                                >
                                    <span className="text-4xl  text-muted-foreground/50">
                                        {milestone.year}
                                    </span>
                                    <p className="text-lg mt-2">
                                        {milestone.event}
                                    </p>
                                </div>
                                <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-foreground -translate-x-1/2 hidden md:block" />
                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutTImeline;

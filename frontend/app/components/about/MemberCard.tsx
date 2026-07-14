import type { team } from "~/Data/data";
import { motion } from "framer-motion";

type Member = (typeof team)[number];

const MemberCard = ({
    member,
    i,
    hovered,
    setHovered,
    isInView,
}: {
    member: Member;
    i: number;
    hovered: number | null;
    setHovered: (i: number | null) => void;
    isInView: boolean;
}) => {
    const fadeUp = {
        hidden: { opacity: 0, y: 32 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                delay: i * 0.1,
            },
        },
    };

    return (
        <motion.div
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
            className="group relative"
        >
            {/* image */}
            <div className="relative overflow-hidden">
                <img
                    loading="lazy"
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                />
                <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                        background:
                            "linear-gradient(to top, hsl(var(--background) / 0.95) 0%, hsl(var(--background) / 0.2) 50%, transparent 100%)",
                        opacity: hovered === i ? 0.85 : 0.6,
                    }}
                />
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground) / 0.03) 2px, hsl(var(--foreground) / 0.03) 4px)",
                    }}
                />
                {[
                    ["top-3 left-3 border-t-2 border-l-2"],
                    ["top-3 right-3 border-t-2 border-r-2"],
                    ["bottom-3 left-3 border-b-2 border-l-2"],
                    ["bottom-3 right-3 border-b-2 border-r-2"],
                ].map(([pos], idx) => (
                    <div
                        key={idx}
                        className={`absolute ${pos} w-5 h-5 opacity-0 group-hover:opacity-60 transition-all duration-300`}
                        style={{ borderColor: "hsl(var(--foreground))" }}
                    />
                ))}
            </div>

            {/* text */}
            <div className="pt-4 px-1">
                <h4 className="font-mono text-[1rem] uppercase glow-text text-muted-foreground block mb-1">
                    {member.role}
                </h4>
                <div className="relative inline-block mb-3">
                    <h3 className="font-display text-xl md:text-2xl tracking-tight">
                        {member.name}
                    </h3>
                    <motion.div
                        className="absolute bottom-0 left-0 h-px"
                        style={{ background: "hsl(var(--foreground))" }}
                        initial={{ width: "0%" }}
                        animate={{ width: hovered === i ? "100%" : "0%" }}
                        transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1] as [
                                number,
                                number,
                                number,
                                number,
                            ],
                        }}
                    />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                </p>
            </div>
        </motion.div>
    );
};
export default MemberCard;
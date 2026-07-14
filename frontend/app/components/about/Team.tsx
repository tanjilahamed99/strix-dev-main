"use client";

import { motion, useInView } from "framer-motion";
import { useState, useRef } from "react";
import { team } from "~/Data/data";
import Header from "../Header";
import MemberCard from "./MemberCard";


const fadeUp = {
    hidden: { opacity: 0, y: 36 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            delay: i * 0.1,
        },
    }),
};

export const Team = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <section id="team" className="py-24 relative overflow-hidden" ref={ref}>
            {/* bg grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                                      linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
                    backgroundSize: "80px 80px",
                }}
            />

            {/* large faint background word */}
            <div
                className="pointer-events-none absolute -bottom-6 left-0 right-0 flex justify-center select-none overflow-hidden"
                aria-hidden="true"
            >
                <span
                    className="font-display text-[12vw] font-bold uppercase leading-none whitespace-nowrap"
                    style={{ color: "hsl(var(--foreground) / 0.03)" }}
                >
                    STRIX DEVS
                </span>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <Header
                    tag="Team"
                    label="The Studio"
                    titleLine1="Built By"
                    titleLine2="Builders"
                    desc="A tight team of engineers who care deeply about craft, clarity, and shipping things that last."
                />

                {/* ── grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
                    {team.map((member, i) => (
                        <MemberCard
                            key={member.name}
                            member={member}
                            i={i}
                            hovered={hovered}
                            setHovered={setHovered}
                            isInView={isInView}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;

import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import { projects } from "~/Data/data";
import ProjectCard from "../ProjectCard";

const Projects = () => {
        const ref = useRef(null);
        const isInView = useInView(ref, { once: true, margin: "-100px" });
        const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
        const [activeCategory, setActiveCategory] = useState("All");

        const filteredProjects =
            activeCategory === "All"
                ? projects
                : projects.filter((p) => p.category === activeCategory);
        const categories = ["All", ...new Set(projects.map((p) => p.category))];
        
    return (
        <div>
            <section className="py-8 border-y border-border">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap gap-4">
                        {categories.map((c) => (
                            <button
                                key={c}
                                onClick={() => setActiveCategory(c)}
                                className={`px-4 py-2 text-xs  uppercase tracking-wider border transition-all duration-300 ${
                                    activeCategory === c
                                        ? "bg-foreground text-black border-foreground"
                                        : "border-border hover:border-foreground"
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-20 relative">
                <div className="container mx-auto px-6">
                    <div ref={ref} className="space-y-24">
                        {filteredProjects.map((project, index) => (
                            <motion.div key={project.title}>
                                <ProjectCard
                                    project={project}
                                    index={index}
                                    isInView={isInView}
                                    hoveredIndex={hoveredIndex}
                                    setHoveredIndex={setHoveredIndex}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Projects;

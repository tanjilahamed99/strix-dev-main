import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

const ProjectCard = ({ project, index, isInView, hoveredIndex, setHoveredIndex }) => {
    return (
        <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.4, 0, 0, 1],
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`group grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                index % 2 === 1 ? "lg:grid-flow-dense" : ""
            }`}
        >
            {/* Image */}
            <div
                className={`relative overflow-hidden ${index % 2 === 1 ? "lg:col-start-2" : ""}`}
            >
                <div className="relative overflow-hidden">
                    <motion.img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        animate={{
                            scale: hoveredIndex === index ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.6 }}
                    />
                    <motion.div
                        className="absolute inset-0 bg-white/50"
                        animate={{
                            opacity: hoveredIndex === index ? 0 : 0.3,
                        }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/40" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white/40" />
            </div>

            {/* Content */}
            <div
                className={
                    index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                }
            >
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs  text-muted-foreground">
                        {project.year}
                    </span>
                    <div className="w-8 h-px bg-foreground/30" />
                    <span className="text-xs  uppercase tracking-wider text-muted-foreground">
                        {project.category}
                    </span>
                </div>

                <h3 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4 group-hover:translate-x-2 transition-transform duration-500">
                    {project.title}
                </h3>

                <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                    {project.techStack.map((tech: string) => (
                        <span
                            key={tech}
                            className="px-3 py-1 text-xs  uppercase tracking-wider border border-border"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
                <Link to={project.link} target="_blank" rel="noopener noreferrer">
                    <motion.button
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 text-sm  uppercase tracking-wider group/btn"
                        >
                        <span className="link-underline">Live Link</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </motion.button>
                </Link>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
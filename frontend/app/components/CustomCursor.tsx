import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    const springConfig = { damping: 30, stiffness: 500 };
    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleHoverStart = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a") ||
                target.classList.contains("cursor-hover")
            ) {
                setIsHovering(true);
            }
        };

        const handleHoverEnd = () => setIsHovering(false);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseenter", handleMouseEnter);
        window.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mouseover", handleHoverStart);
        document.addEventListener("mouseout", handleHoverEnd);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseenter", handleMouseEnter);
            window.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseover", handleHoverStart);
            document.removeEventListener("mouseout", handleHoverEnd);
        };
    }, [cursorX, cursorY, isVisible]);

    // Hide custom cursor on touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) {
        return null;
    }

    return (
        <>
            {/* Main cursor - crosshair style */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-9999"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isClicking ? 0.8 : isHovering ? 0.5 : 1,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{ duration: 0.15 }}
            >
                {/* Vertical line */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-px bg-white"
                    animate={{
                        height: isHovering ? 40 : 20,
                        opacity: isHovering ? 1 : 0.6,
                    }}
                    style={{ top: "50%", marginTop: isHovering ? -20 : -10 }}
                />
                {/* Horizontal line */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 h-px bg-white"
                    animate={{
                        width: isHovering ? 40 : 20,
                        opacity: isHovering ? 1 : 0.6,
                    }}
                    style={{ left: "50%", marginLeft: isHovering ? -20 : -10 }}
                />
            </motion.div>

            {/* Outer ring */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-9999"
                style={{
                    x: mousePosition.x,
                    y: mousePosition.y,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isClicking ? 0.9 : isHovering ? 2 : 1,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{
                    x: { duration: 0.08 },
                    y: { duration: 0.08 },
                    scale: { duration: 0.2 },
                }}
            >
                <motion.div
                    className="w-10 h-10 border border-foreground/30"
                    animate={{
                        borderColor: isHovering
                            ? "hsl(0 0% 98%)"
                            : "hsl(0 0% 98% / 0.3)",
                        rotate: isHovering ? 45 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>
        </>
    );
};

export default CustomCursor;

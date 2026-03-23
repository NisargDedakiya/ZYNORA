"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function FadeIn({ children, delay = 0, className = "", shimmer = false }: { children: ReactNode, delay?: number, className?: string, shimmer?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
                duration: 0.8,
                delay: delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className={`${className} ${shimmer ? "shimmer-container" : ""}`}
        >
            {children}
            {shimmer && (
                <motion.div
                    className="shimmer-sweep pointer-events-none"
                    initial={{ left: "-100%" }}
                    whileInView={{ left: "200%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: delay + 0.5, ease: "easeInOut" }}
                />
            )}
        </motion.div>
    );
}

"use client";
import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
            transition={{ ease: [0.25, 0.46, 0.45, 0.94], duration: 0.8 }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
}

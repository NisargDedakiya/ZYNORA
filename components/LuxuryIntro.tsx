"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LuxuryIntro() {
    const [showIntro, setShowIntro] = useState(false);

    useEffect(() => {
        const hasSeenIntro = sessionStorage.getItem("hasSeenLuxuryIntro");
        if (!hasSeenIntro) {
            setTimeout(() => setShowIntro(true), 0);
            sessionStorage.setItem("hasSeenLuxuryIntro", "true");
        }
    }, []);

    if (!showIntro) return null;

    return (
        <AnimatePresence>
            {showIntro && (
                <motion.div
                    key="luxury-intro"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-luxury-black overflow-hidden"
                >
                    {/* Deep radial background */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1.2 }}
                        transition={{ duration: 2.5, ease: "easeOut" }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_60%)] pointer-events-none"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="relative z-10 text-center flex flex-col items-center"
                        onAnimationComplete={() => {
                            setTimeout(() => setShowIntro(false), 500); // Hold for 0.5s before fading out
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                            className="relative drop-shadow-[0_0_40px_rgba(212,175,55,0.6)]"
                        >
                            <img src="/assets/logo.png" alt="ZYNORA LUXE" className="w-64 md:w-80 h-auto object-contain animate-pulse" />
                        </motion.div>

                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.2, ease: "easeInOut", delay: 1 }}
                            className="h-[1px] bg-gold-gradient mt-8 mx-auto w-32 shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

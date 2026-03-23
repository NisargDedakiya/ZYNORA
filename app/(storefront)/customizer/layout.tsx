"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Toaster, toast } from 'sonner';
import { useCustomizerStore } from "@/lib/customizer-store";
import dynamic from "next/dynamic";

const RingViewer = dynamic(() => import('@/components/3d/RingViewer'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50/80 animate-pulse text-gray-400">
            <div className="w-24 h-24 mb-4 rounded-full border-4 border-gray-200 border-t-emerald-accent animate-spin" />
            <p className="text-sm uppercase tracking-widest font-semibold">Loading Customizer...</p>
        </div>
    )
});

const steps = [
    { id: 1, name: "Choose Setting", path: "/customizer/step-1-setting" },
    { id: 2, name: "Choose Diamond", path: "/customizer/step-2-diamond" },
    { id: 3, name: "Choose Metal", path: "/customizer/step-3-metal" },
    { id: 4, name: "Review", path: "/customizer/step-4-review" },
];

export default function CustomizerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const currentStepIndex = steps.findIndex((s) => s.path === pathname);
    const { config } = useCustomizerStore();

    const checkCanAccess = (stepId: number) => {
        if (stepId === 1) return true;
        if (stepId === 2) return !!config.setting;
        if (stepId === 3) return !!config.setting && !!config.diamond;
        if (stepId === 4) return !!config.setting && !!config.diamond && !!config.metalType;
        return false;
    };

    const handleStepClick = (e: React.MouseEvent, stepId: number) => {
        if (!checkCanAccess(stepId)) {
            e.preventDefault();
            toast.error("Please complete the previous steps first.");
        }
    };

    return (
        <main className="min-h-screen bg-emerald-bg pb-24 pt-12 text-emerald-text font-body transition-colors duration-1000">
            <Toaster position="top-center" richColors theme="light" />
            {/* Header & Progress Bar */}
            <div className="max-w-5xl mx-auto px-5 mb-14">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading text-emerald-text mb-3 mt-4">Design Your Perfect Ring</h1>
                    <p className="text-emerald-text/60 uppercase tracking-[0.2em] text-sm">Follow the 4 steps to create your masterpiece</p>
                </div>

                {/* Progress Bar Container */}
                <div className="relative flex justify-between items-center max-w-3xl mx-auto">
                    {/* Background Line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-emerald-accent/20 -z-10" />

                    {/* Active Line */}
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-emerald-accent -z-10 transition-all duration-700 shadow-[0_0_15px_rgba(47,143,131,0.4)]"
                        style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((step, index) => {
                        const isActive = currentStepIndex === index;
                        const isCompleted = currentStepIndex > index;
                        const canAccess = checkCanAccess(step.id);
                        return (
                            <Link
                                href={step.path}
                                key={step.id}
                                onClick={(e) => handleStepClick(e, step.id)}
                                className={`flex flex-col items-center group relative px-2 transition-opacity ${!canAccess ? "opacity-30" : "hover:opacity-100"}`}
                                aria-disabled={!canAccess}
                                tabIndex={!canAccess ? -1 : 0}
                            >
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold border-[2px] transition-all duration-500 bg-emerald-bg z-10 ${isActive
                                        ? "border-emerald-accent text-emerald-accent shadow-[0_0_20px_rgba(47,143,131,0.4)] scale-110"
                                        : isCompleted
                                            ? "border-emerald-accent bg-emerald-accent text-emerald-bg"
                                            : "border-emerald-accent/20 text-emerald-text/30"
                                        }`}
                                >
                                    {isCompleted ? <Check className="w-6 h-6" strokeWidth={3} /> : step.id}
                                </div>
                                <span
                                    className={`absolute -bottom-10 whitespace-nowrap text-xs font-bold tracking-widest uppercase transition-colors duration-500 ${isActive ? "text-emerald-accent" : isCompleted ? "text-emerald-text" : "text-emerald-text/30"
                                        }`}
                                >
                                    {step.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Content Area with Stacked Layout for Viewer and Form */}
            <div className="max-w-6xl mx-auto px-5 mt-10 md:mt-16 flex flex-col gap-10 lg:gap-14">

                {/* Top: Full-Width 3D Viewer */}
                <div className="w-full h-[350px] md:h-[500px] lg:h-[600px] bg-emerald-bg/50 backdrop-blur-md rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.1)] border border-emerald-accent/20 overflow-hidden flex-shrink-0 z-10 transition-all duration-500 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,143,131,0.05)_0%,transparent_70%)] pointer-events-none" />
                    <RingViewer />
                </div>

                {/* Bottom: Steps Options Panel */}
                <div className="w-full relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="w-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </main>
    );
}

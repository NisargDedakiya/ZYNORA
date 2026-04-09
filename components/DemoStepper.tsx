"use client";

import { Check } from "lucide-react";

interface DemoStepperProps {
    currentStep: number; // 1, 2, or 3
}

const steps = [
    { id: 1, label: "Details" },
    { id: 2, label: "Payment" },
    { id: 3, label: "Confirmation" },
];

export function DemoStepper({ currentStep }: DemoStepperProps) {
    return (
        <div className="demo-stepper">
            {steps.map((step, i) => {
                const isActive = step.id === currentStep;
                const isComplete = step.id < currentStep;
                return (
                    <div key={step.id} className="demo-stepper-step">
                        {/* Connector line before step (except first) */}
                        {i > 0 && (
                            <div
                                className={`demo-stepper-line ${
                                    isComplete || isActive ? "bg-[#111]" : "bg-gray-200"
                                }`}
                            />
                        )}

                        {/* Step dot */}
                        <div className="flex flex-col items-center gap-2">
                            <div
                                className={`demo-stepper-dot ${
                                    isComplete
                                        ? "bg-[#111] text-white"
                                        : isActive
                                        ? "bg-[#111] text-white shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                                        : "bg-gray-100 text-gray-400"
                                }`}
                            >
                                {isComplete ? (
                                    <Check size={12} strokeWidth={3} />
                                ) : (
                                    <span className="text-[10px]">{step.id}</span>
                                )}
                            </div>
                            <span
                                className={`text-[10px] uppercase tracking-widest font-bold whitespace-nowrap ${
                                    isActive || isComplete ? "text-[#111]" : "text-gray-300"
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

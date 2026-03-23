"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DiamondSearchClient } from "@/app/(storefront)/diamonds/DiamondSearchClient";
import { useCustomizerStore } from "@/lib/customizer-store";

export default function Step2DiamondPage() {
    const router = useRouter();
    const selectedSetting = useCustomizerStore((state) => state.config.setting);

    useEffect(() => {
        if (!selectedSetting) {
            // Redirect back to step 1 if no setting is selected
            router.push("/customizer/step-1-setting");
        }
    }, [selectedSetting, router]);

    if (!selectedSetting) {
        return null;
    }

    return (
        <div className="animate-in fade-in duration-700">
            <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-heading text-emerald-text mb-4 tracking-wide">Choose Your Diamond</h2>
                <p className="text-emerald-text/60 text-[0.95rem] tracking-wide font-light max-w-2xl mx-auto">Select the perfect center stone for your <span className="text-emerald-accent font-medium">{selectedSetting.name}</span>.</p>
            </div>

            <div className="bg-emerald-bg rounded-none border border-emerald-accent/20 shadow-xl overflow-hidden">
                {/* We pass customizerMode=true to DiamondSearchClient so it knows to redirect to step 3 */}
                <DiamondSearchClient customizerMode={true} />
            </div>
        </div>
    );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCustomizerStore, MetalType } from "@/lib/customizer-store";
import type { Diamond } from "@prisma/client";

const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
};

const formatPriceDiff = (value: number) => {
    if (value === 0) return "Included";
    if (value > 0) return "+" + formatPrice(value);
    return formatPrice(value);
};

export default function Step3MetalPage() {
    const router = useRouter();
    const { config, setDiamond, setMetalType, getTotalPrice } = useCustomizerStore();

    useEffect(() => {
        // Sync diamond from sessionStorage if coming from Step 2
        const storedDiamond = sessionStorage.getItem('selectedDiamond');
        if (storedDiamond) {
            try {
                const parsedDiamond = JSON.parse(storedDiamond) as Diamond;
                if (!config.diamond || config.diamond.id !== parsedDiamond.id) {
                    setDiamond(parsedDiamond);
                }
            } catch (err) {
                console.error("Failed to parse stored diamond", err);
            }
        }

        // Redirect back to step 1 if no setting
        if (!config.setting) {
            router.push("/customizer/step-1-setting");
        } else if (!storedDiamond && !config.diamond) {
            router.push("/customizer/step-2-diamond");
        }
    }, [config.setting, config.diamond, router, setDiamond]);

    const metalOptions: { id: MetalType; name: string; price: number; colorHex: string }[] = [
        { id: "18K White Gold", name: "18K White Gold", price: 0, colorHex: "#E5E4E2" },
        { id: "18K Yellow Gold", name: "18K Yellow Gold", price: 0, colorHex: "#E5A01D" },
        { id: "18K Rose Gold", name: "18K Rose Gold", price: 0, colorHex: "#B76E79" },
        { id: "Platinum", name: "Platinum", price: 35000, colorHex: "#E5E4E2" },
    ];

    if (!config.setting || !config.diamond) {
        return null; // or loading
    }

    const handleSelectMetal = (metalId: MetalType, price: number) => {
        setMetalType(metalId, price);
    };

    const handleNext = () => {
        router.push("/customizer/step-4-review");
    };

    return (
        <div className="animate-in fade-in duration-700 max-w-xl mx-auto md:mr-auto md:ml-0 w-full mb-20">

            {/* Metal Options */}
            <div className="w-full">
                <h2 className="text-4xl md:text-5xl font-heading text-emerald-text mb-4 tracking-wide">Choose Metal Type</h2>
                <p className="text-emerald-text/60 text-[0.95rem] font-light mb-10 leading-relaxed tracking-wide">Select the precious metal for your ring setting. 18K gold variants are included in the base price.</p>

                <div className="space-y-5 mb-12">
                    {metalOptions.map((metal) => {
                        const isSelected = config.metalType === metal.id;
                        return (
                            <button
                                key={metal.id}
                                onClick={() => handleSelectMetal(metal.id, metal.price)}
                                className={`w-full flex items-center justify-between p-6 rounded-none border transition-all duration-500 text-left ${isSelected
                                    ? "border-emerald-accent shadow-[0_0_20px_rgba(47,143,131,0.2)] bg-emerald-bg"
                                    : "border-emerald-accent/20 bg-emerald-bg hover:border-emerald-accent/60 hover:bg-emerald-accent/5"
                                    }`}
                            >
                                <div className="flex items-center gap-5">
                                    <div
                                        className="w-10 h-10 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] border border-emerald-accent/20"
                                        style={{ backgroundColor: metal.colorHex }}
                                    />
                                    <div>
                                        <div className={`text-lg font-heading tracking-wide ${isSelected ? "text-emerald-accent" : "text-emerald-text"}`}>
                                            {metal.name}
                                        </div>
                                    </div>
                                </div>
                                <div className={`font-medium text-sm tracking-widest uppercase ${isSelected ? "text-emerald-accent" : "text-emerald-text/40"}`}>
                                    {formatPriceDiff(metal.price)}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-emerald-accent/20">
                    <button
                        onClick={() => router.push("/customizer/step-2-diamond")}
                        className="text-emerald-text/40 hover:text-emerald-accent text-xs uppercase tracking-widest font-bold transition-colors"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        className="bg-emerald-accent text-emerald-bg hover:bg-emerald-accent/80 px-8 py-4 rounded-none text-xs font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(47,143,131,0.3)] hover:-translate-y-1"
                    >
                        Review Collection
                    </button>
                </div>
            </div>

        </div>
    );
}

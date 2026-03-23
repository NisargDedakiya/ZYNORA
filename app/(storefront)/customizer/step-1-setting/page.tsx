"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Setting } from "@prisma/client";
import { useCustomizerStore } from "@/lib/customizer-store";

// currency formatter
const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
};

export default function Step1SettingPage() {
    const router = useRouter();
    const setSetting = useCustomizerStore((state) => state.setSetting);
    const selectedSetting = useCustomizerStore((state) => state.config.setting);

    const [settings, setSettings] = useState<Setting[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                setSettings(data);
            } catch (err) {
                console.error("Failed to fetch settings:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSelectSetting = (setting: Setting) => {
        setSetting(setting);
        // Move to Step 2
        router.push("/customizer/step-2-diamond");
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse bg-emerald-bg border border-white/5 p-6 rounded-none h-96 flex flex-col justify-end shadow-md">
                        <div className="h-48 bg-white/5 rounded-none mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer-effect" />
                        </div>
                        <div className="h-6 bg-white/10 rounded-sm w-3/4 mb-3" />
                        <div className="h-4 bg-white/5 rounded-sm w-1/4 mb-5" />
                        <div className="h-12 bg-white/10 rounded-sm w-full mt-auto" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700">
            <h2 className="text-3xl font-heading text-emerald-text mb-4 md:mb-8 text-center block md:hidden tracking-wide">Choose Your Setting</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {settings.map((setting) => (
                    <div
                        key={setting.id}
                        className={`group bg-emerald-bg rounded-none overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 relative flex flex-col ${selectedSetting?.id === setting.id ? 'border border-emerald-accent shadow-[0_0_20px_rgba(47,143,131,0.2)]' : 'border border-emerald-accent/20'
                            }`}
                    >
                        {/* Image Container */}
                        <div className="relative h-[280px] w-full bg-[#0B1715] overflow-hidden p-8 border-b border-emerald-accent/10">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,143,131,0.05)_0%,transparent_70%)] pointer-events-none" />
                            <div className="relative h-full w-full transform transition-transform duration-[800ms] group-hover:scale-105 drop-shadow-lg">
                                {setting.imageUrl ? (
                                    <Image
                                        src={setting.imageUrl}
                                        alt={setting.name}
                                        fill
                                        className="object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-emerald-accent/5 flex items-center justify-center text-emerald-text/30 text-sm tracking-widest uppercase">No Image</div>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10 bg-gradient-to-t from-emerald-bg to-transparent">
                            <div className="mb-3">
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-accent mb-3 block opacity-80">
                                    {setting.category}
                                </span>
                                <h3 className="text-xl font-heading text-emerald-text leading-tight tracking-wide">
                                    {setting.name}
                                </h3>
                            </div>

                            <p className="text-[0.95rem] text-emerald-text/60 mb-8 line-clamp-2 leading-relaxed font-light">
                                {setting.description}
                            </p>

                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-emerald-accent/10">
                                <span className="text-xl font-bold font-body text-emerald-text tracking-wide">
                                    {formatPrice(setting.price)}
                                </span>

                                <button
                                    onClick={() => handleSelectSetting(setting)}
                                    className={`px-6 py-2.5 text-xs uppercase tracking-widest font-bold rounded-none transition-all duration-300 ${selectedSetting?.id === setting.id
                                        ? 'bg-emerald-accent text-emerald-bg border border-emerald-accent hover:bg-emerald-accent/90'
                                        : 'bg-transparent text-emerald-text border border-emerald-accent/40 hover:border-emerald-accent hover:text-emerald-bg hover:bg-emerald-accent'
                                        }`}
                                >
                                    {selectedSetting?.id === setting.id ? 'Selected' : 'Select'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

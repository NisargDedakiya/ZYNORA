"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import Image from "next/image";
import { useCustomizerStore } from "@/lib/customizer-store";
import { useCart } from "@/components/CartProvider";

const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
};

export default function Step4ReviewPage() {
    const router = useRouter();
    const { config, getTotalPrice, resetConfig } = useCustomizerStore();
    const { addToCart } = useCart();

    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        if (!config.setting || !config.diamond) {
            router.push("/customizer/step-1-setting");
        }
    }, [config, router]);

    if (!config.setting || !config.diamond) {
        return null;
    }

    const { setting, diamond, metalType } = config;
    const totalPrice = getTotalPrice();

    const handleAddToCart = async () => {
        setIsAdded(true);
        try {
            const res = await fetch('/api/customizer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    settingId: setting.id,
                    diamondId: diamond.id,
                    metalType: metalType,
                    totalPrice: totalPrice,
                })
            });

            if (!res.ok) throw new Error("Failed to save configuration");
            const data = await res.json();

            // Construct a logical cart item representing the custom ring
            addToCart({
                id: `ring-config-${data.id}`,
                name: `Custom ${setting.name} with ${diamond.caratWeight}ct ${diamond.shape} Diamond`,
                price: totalPrice,
                image: setting.imageUrl || "/products/setting-1.jpg",
                quantity: 1,
                isCustomRing: true,
                ringConfigurationId: data.id,
                metalType: metalType
            });

            toast.success("Added to Cart successfully!");

            setTimeout(() => {
                resetConfig();
                router.push("/cart"); // Redirect to cart or keep it
            }, 1000);
        } catch (error) {
            console.error(error);
            setIsAdded(false);
            toast.error("Failed to add to cart. Please try again.");
        }
    };

    return (
        <div className="animate-in fade-in duration-700 max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-heading text-emerald-text mb-10 text-center block tracking-wide">Review Your Ring</h2>

            <div className="bg-emerald-bg rounded-none border border-emerald-accent/20 shadow-xl p-8 md:p-10">

                {/* Text Summary */}
                <div className="border-b border-emerald-accent/20 pb-10 mb-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-accent mb-3 block">
                        Your Masterpiece
                    </span>
                    <h3 className="text-3xl font-heading text-emerald-text mb-4 tracking-wide">
                        {setting.name}
                    </h3>
                    <p className="text-emerald-text/60 mb-6 text-[0.95rem] leading-relaxed font-light">
                        Crafted in <strong className="text-emerald-text font-medium">{metalType}</strong>, starring a stunning <strong className="text-emerald-text font-medium">{diamond.caratWeight} Carat {diamond.cut} cut, {diamond.color} color, {diamond.clarity} clarity {diamond.shape}</strong> diamond.
                    </p>
                    <div className="text-4xl font-bold font-heading text-emerald-accent mt-8 tracking-wide">
                        {formatPrice(totalPrice)}
                    </div>
                </div>

                {/* Breakdown */}
                <h4 className="font-heading text-xl mb-6 text-emerald-text tracking-wide">Order Details</h4>
                <div className="space-y-5 mb-12 text-[0.95rem]">
                    <div className="flex justify-between items-center py-3 border-b border-emerald-accent/10">
                        <span className="text-emerald-text/60 tracking-wide">Setting ({setting.name})</span>
                        <span className="font-medium text-emerald-text font-body">{formatPrice(setting.price)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-emerald-accent/10">
                        <span className="text-emerald-text/60 tracking-wide">Diamond ({diamond.caratWeight}ct {diamond.shape})</span>
                        <span className="font-medium text-emerald-text font-body">{formatPrice(diamond.price)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-emerald-accent/10">
                        <span className="text-emerald-text/60 tracking-wide">Metal ({metalType})</span>
                        <span className="font-medium text-emerald-text font-body">{formatPrice(config.metalPriceAdjustment)}</span>
                    </div>
                    <div className="flex justify-between items-center py-5 bg-emerald-accent/5 border border-emerald-accent/20 px-6 rounded-none mt-6">
                        <span className="font-bold text-emerald-text tracking-widest uppercase text-xs">Final Total</span>
                        <span className="font-bold text-2xl text-emerald-accent font-heading">{formatPrice(totalPrice)}</span>
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-emerald-bg border border-emerald-accent/20 p-6 rounded-none mb-12 flex gap-5 items-start">
                    <div className="text-emerald-accent mt-1 bg-emerald-accent/10 p-2 rounded-full">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </div>
                    <div>
                        <h5 className="font-bold text-emerald-text tracking-widest uppercase text-xs mb-2">Made to Order</h5>
                        <p className="text-emerald-text/60 text-sm leading-relaxed font-light">
                            Your bespoke ring will be handcrafted to perfection. Estimated delivery in <strong className="text-emerald-text font-medium">3-4 weeks</strong> from order date.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-emerald-accent/20">
                    <button
                        onClick={() => router.push("/customizer/step-3-metal")}
                        className="text-emerald-text/40 hover:text-emerald-accent text-xs font-bold uppercase tracking-widest transition-colors w-full md:w-auto text-left"
                    >
                        Back to Metal
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        className={`w-full md:w-auto px-10 py-4 rounded-none text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isAdded ? 'bg-emerald-text border border-emerald-text text-emerald-bg' : 'bg-emerald-accent text-emerald-bg hover:bg-emerald-accent/80 hover:shadow-[0_0_20px_rgba(47,143,131,0.3)] hover:-translate-y-1'
                            }`}
                    >
                        {isAdded ? (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                Added to Cart
                            </>
                        ) : (
                            'Add to Cart'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

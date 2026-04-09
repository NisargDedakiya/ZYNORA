/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoOrderStore } from "@/lib/demo-order-store";
import { DemoStepper } from "@/components/DemoStepper";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/Button";
import { ArrowLeft, Diamond, ShieldCheck, CreditCard, Lock, Truck } from "lucide-react";
import Image from "next/image";

const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function DemoCheckoutPage() {
    const router = useRouter();
    const { ring, setCustomer } = useDemoOrderStore();
    const [mounted, setMounted] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "Gujarat",
        pincode: "",
    });

    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !ring) {
            router.push("/customizer/step-1-setting");
        }
    }, [mounted, ring, router]);

    if (!mounted || !ring) {
        return (
            <div className="bg-[#FAFAF8] min-h-[80vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#111] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
    };

    const validate = () => {
        const newErrors: Record<string, boolean> = {};
        if (!form.name.trim()) newErrors.name = true;
        if (!form.email.trim() || !form.email.includes("@")) newErrors.email = true;
        if (!form.phone.trim() || form.phone.length < 10) newErrors.phone = true;
        if (!form.address.trim()) newErrors.address = true;
        if (!form.city.trim()) newErrors.city = true;
        if (!form.pincode.trim()) newErrors.pincode = true;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProceedToPayment = () => {
        if (!validate()) return;
        setCustomer(form);
        router.push("/payment");
    };

    const inputClass = (field: string) =>
        `w-full px-4 py-4 border bg-white text-[#111] text-sm transition-all duration-300 outline-none ${
            errors[field]
                ? "border-red-300 bg-red-50/20"
                : focusedField === field
                ? "border-[#111] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                : "border-gray-200 hover:border-gray-300"
        }`;

    return (
        <div className="bg-[#FAFAF8] min-h-[80vh] pt-6 pb-24 font-body">
            <div className="container-custom max-w-5xl">
                {/* Back Button */}
                <FadeIn>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#111] text-xs uppercase tracking-widest font-bold mb-6 transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Review
                    </button>
                </FadeIn>

                {/* Progress Stepper */}
                <FadeIn>
                    <DemoStepper currentStep={1} />
                </FadeIn>

                <FadeIn>
                    <h1 className="text-3xl md:text-4xl font-heading text-[#111] mb-1 tracking-wide text-center">Checkout</h1>
                    <p className="text-gray-400 text-sm tracking-wide mb-10 text-center">Complete your details to proceed</p>
                </FadeIn>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left: Customer Form */}
                    <div className="flex-[1.5]">
                        <FadeIn className="mb-8">
                            <div className="bg-white border border-gray-100 shadow-sm">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="text-sm font-heading text-[#111] uppercase tracking-wider">
                                        1. Contact Information
                                    </h3>
                                </div>
                                <div className="p-6 grid gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full Name *"
                                            value={form.name}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField("name")}
                                            onBlur={() => setFocusedField(null)}
                                            className={inputClass("name")}
                                        />
                                        {errors.name && <p className="text-red-400 text-xs mt-1.5 pl-1">Name is required</p>}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email Address *"
                                                value={form.email}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField("email")}
                                                onBlur={() => setFocusedField(null)}
                                                className={inputClass("email")}
                                            />
                                            {errors.email && <p className="text-red-400 text-xs mt-1.5 pl-1">Valid email required</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Phone Number *"
                                                value={form.phone}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField("phone")}
                                                onBlur={() => setFocusedField(null)}
                                                className={inputClass("phone")}
                                            />
                                            {errors.phone && <p className="text-red-400 text-xs mt-1.5 pl-1">Valid phone required</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.1} className="mb-8">
                            <div className="bg-white border border-gray-100 shadow-sm">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="text-sm font-heading text-[#111] uppercase tracking-wider">
                                        2. Shipping Address
                                    </h3>
                                </div>
                                <div className="p-6 grid gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="Street Address *"
                                            value={form.address}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField("address")}
                                            onBlur={() => setFocusedField(null)}
                                            className={inputClass("address")}
                                        />
                                        {errors.address && <p className="text-red-400 text-xs mt-1.5 pl-1">Address is required</p>}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                name="city"
                                                placeholder="City *"
                                                value={form.city}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField("city")}
                                                onBlur={() => setFocusedField(null)}
                                                className={inputClass("city")}
                                            />
                                            {errors.city && <p className="text-red-400 text-xs mt-1.5 pl-1">City required</p>}
                                        </div>
                                        <select
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                            className="w-full px-4 py-4 border border-gray-200 bg-white focus:outline-none focus:border-[#111] transition-colors text-sm text-gray-700"
                                        >
                                            <option value="Gujarat">Gujarat</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                            <option value="Rajasthan">Rajasthan</option>
                                        </select>
                                        <div>
                                            <input
                                                type="text"
                                                name="pincode"
                                                placeholder="PIN Code *"
                                                value={form.pincode}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField("pincode")}
                                                onBlur={() => setFocusedField(null)}
                                                className={inputClass("pincode")}
                                            />
                                            {errors.pincode && <p className="text-red-400 text-xs mt-1.5 pl-1">PIN required</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <button
                                onClick={handleProceedToPayment}
                                className="w-full bg-[#111] text-white py-5 text-sm uppercase tracking-[0.2em] font-bold hover:bg-black transition-all flex items-center justify-center gap-3 animate-pulse-glow"
                            >
                                <CreditCard size={16} />
                                Proceed to Payment
                            </button>
                        </FadeIn>

                        {/* Trust Badges */}
                        <FadeIn delay={0.25}>
                            <div className="flex items-center justify-center gap-8 mt-6 py-4">
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                    <Lock size={12} />
                                    <span>SSL Encrypted</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                    <ShieldCheck size={12} />
                                    <span>Secure Checkout</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                    <Truck size={12} />
                                    <span>Free Shipping</span>
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="flex-1">
                        <FadeIn delay={0.2} className="sticky top-28">
                            <div className="bg-white border border-gray-100 shadow-sm">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="text-sm font-heading text-[#111] uppercase tracking-wider text-center">
                                        Order Summary
                                    </h3>
                                </div>
                                <div className="p-6">
                                    {/* Ring Preview */}
                                    <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                                        <div className="w-20 h-20 relative bg-[#FAFAF8] border border-gray-100 shrink-0 flex items-center justify-center">
                                            {ring.settingImage ? (
                                                <Image
                                                    src={ring.settingImage}
                                                    alt={ring.settingName}
                                                    fill
                                                    className="object-cover p-2"
                                                />
                                            ) : (
                                                <Diamond className="text-gray-300" size={28} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">
                                                Custom Ring
                                            </p>
                                            <h4 className="text-sm font-bold text-[#111] uppercase tracking-wide truncate">
                                                {ring.settingName}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {ring.diamondCarat}ct {ring.diamondShape} · {ring.metalType}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Setting</span>
                                            <span className="font-medium">{formatPrice(ring.settingPrice)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Diamond ({ring.diamondCarat}ct)</span>
                                            <span className="font-medium">{formatPrice(ring.diamondPrice)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Metal ({ring.metalType})</span>
                                            <span className="font-medium">{formatPrice(ring.metalPriceAdjustment)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Shipping</span>
                                            <span className="text-green-600 font-medium">Complimentary</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end pt-5 border-t border-gray-200">
                                        <span className="text-sm font-bold text-[#111] uppercase tracking-wide">Total</span>
                                        <span className="text-2xl font-bold text-[#111]">{formatPrice(ring.totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Guarantee badge */}
                            <div className="mt-4 bg-white border border-gray-100 p-4 flex items-center gap-3">
                                <ShieldCheck size={18} className="text-green-600 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-[#111]">30-Day Returns</p>
                                    <p className="text-[10px] text-gray-400">Free returns & exchanges within 30 days</p>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </div>
    );
}

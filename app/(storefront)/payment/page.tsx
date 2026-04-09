/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoOrderStore } from "@/lib/demo-order-store";
import { DemoStepper } from "@/components/DemoStepper";
import { FadeIn } from "@/components/FadeIn";
import { ArrowLeft, Lock, Smartphone, CreditCard, Building2, Diamond, CheckCircle, ShieldCheck } from "lucide-react";

const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

type PaymentTab = "upi" | "card" | "netbanking";

export default function PaymentPage() {
    const router = useRouter();
    const { ring, customer, setOrderResult, setPaymentMethod } = useDemoOrderStore();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<PaymentTab>("card");
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && (!ring || !customer)) {
            router.push("/customizer/step-1-setting");
        }
    }, [mounted, ring, customer, router]);

    if (!mounted || !ring || !customer) {
        return (
            <div className="bg-[#FAFAF8] min-h-[80vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#111] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const processingSteps = [
        "Connecting to payment gateway...",
        "Verifying payment details...",
        "Processing transaction...",
        "Payment confirmed! Redirecting..."
    ];

    const handlePayNow = async () => {
        setIsProcessing(true);
        setPaymentMethod(activeTab);

        for (let i = 0; i < processingSteps.length; i++) {
            setProcessingStep(i);
            await new Promise(resolve => setTimeout(resolve, i === 2 ? 600 : 400));
        }

        try {
            const res = await fetch("/api/place-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderType: "CUSTOM_RING",
                    customer,
                    ringConfigurationId: ring.ringConfigurationId || null,
                    totalPrice: ring.totalPrice,
                    settingName: ring.settingName,
                    diamondShape: ring.diamondShape,
                    diamondCarat: ring.diamondCarat,
                    metalType: ring.metalType,
                    paymentMethod: activeTab,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setOrderResult({
                    orderId: data.orderId,
                    displayOrderId: data.displayOrderId,
                    status: "CONFIRMED",
                });
                router.push(`/order-success?orderId=${data.orderId}`);
            } else {
                setIsProcessing(false);
                alert("Demo payment failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
        }
    };

    const tabs: { key: PaymentTab; label: string; icon: React.ReactNode }[] = [
        { key: "card", label: "Card", icon: <CreditCard size={16} /> },
        { key: "upi", label: "UPI", icon: <Smartphone size={16} /> },
        { key: "netbanking", label: "Net Banking", icon: <Building2 size={16} /> },
    ];

    // Processing overlay
    if (isProcessing) {
        return (
            <div className="bg-[#FAFAF8] min-h-[80vh] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-10 bg-white border border-gray-100 shadow-lg">
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                        <div className="absolute inset-0 border-4 border-[#111] border-t-transparent rounded-full animate-spin" />
                        {processingStep === 3 && (
                            <div className="absolute inset-0 flex items-center justify-center animate-in fade-in zoom-in duration-300">
                                <CheckCircle className="text-green-500" size={32} />
                            </div>
                        )}
                    </div>
                    <h3 className="font-heading text-lg text-[#111] mb-6 uppercase tracking-wide">Processing Payment</h3>
                    <div className="space-y-3">
                        {processingSteps.map((step, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-3 text-sm transition-all duration-500 ${
                                    i < processingStep
                                        ? "text-green-600"
                                        : i === processingStep
                                        ? "text-[#111] font-medium"
                                        : "text-gray-300"
                                }`}
                            >
                                {i < processingStep ? (
                                    <CheckCircle size={16} className="text-green-500 shrink-0" />
                                ) : i === processingStep ? (
                                    <div className="w-4 h-4 border-2 border-[#111] border-t-transparent rounded-full animate-spin shrink-0" />
                                ) : (
                                    <div className="w-4 h-4 border border-gray-200 rounded-full shrink-0" />
                                )}
                                {step}
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-8 uppercase tracking-widest">
                        Demo payment simulation
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FAFAF8] min-h-[80vh] pt-6 pb-24 font-body">
            <div className="container-custom max-w-5xl">
                {/* Back */}
                <FadeIn>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#111] text-xs uppercase tracking-widest font-bold mb-6 transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Checkout
                    </button>
                </FadeIn>

                {/* Progress Stepper */}
                <FadeIn>
                    <DemoStepper currentStep={2} />
                </FadeIn>

                <FadeIn>
                    <div className="flex items-center justify-center gap-3 mb-1">
                        <Lock size={18} className="text-[#111]" />
                        <h1 className="text-3xl md:text-4xl font-heading text-[#111] tracking-wide">Secure Payment</h1>
                    </div>
                    <p className="text-gray-400 text-sm tracking-wide mb-10 text-center">Choose your preferred payment method</p>
                </FadeIn>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left: Payment Methods */}
                    <div className="flex-[1.4]">
                        <FadeIn>
                            <div className="bg-white border border-gray-100 shadow-sm">
                                {/* Tabs */}
                                <div className="flex border-b border-gray-100">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 ${
                                                activeTab === tab.key
                                                    ? "border-[#111] text-[#111] bg-gray-50/50"
                                                    : "border-transparent text-gray-400 hover:text-gray-600"
                                            }`}
                                        >
                                            {tab.icon}
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="p-6">
                                    {/* Card Tab */}
                                    {activeTab === "card" && (
                                        <div className="animate-in fade-in duration-300 space-y-5">
                                            {/* Card Preview */}
                                            <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-6 rounded-lg shadow-xl overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                                                <div className="relative z-10">
                                                    <div className="flex items-center justify-between mb-8">
                                                        <div className="w-10 h-7 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-sm" />
                                                        <span className="text-xs tracking-widest text-white/60 uppercase">Credit Card</span>
                                                    </div>
                                                    <p className="font-mono text-lg tracking-[0.25em] mb-6 text-white/90">4242 •••• •••• 4242</p>
                                                    <div className="flex justify-between text-xs">
                                                        <div>
                                                            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Card Holder</p>
                                                            <p className="text-white/80 font-medium">{customer.name.toUpperCase()}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Expires</p>
                                                            <p className="text-white/80 font-medium">12/28</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Card Number</label>
                                                    <input
                                                        type="text"
                                                        defaultValue="4242 4242 4242 4242"
                                                        className="w-full px-4 py-3.5 border border-gray-200 bg-white focus:outline-none focus:border-[#111] transition-colors font-mono text-sm"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Expiry</label>
                                                        <input
                                                            type="text"
                                                            defaultValue="12/28"
                                                            className="w-full px-4 py-3.5 border border-gray-200 bg-white focus:outline-none focus:border-[#111] transition-colors font-mono text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">CVV</label>
                                                        <input
                                                            type="text"
                                                            defaultValue="123"
                                                            className="w-full px-4 py-3.5 border border-gray-200 bg-white focus:outline-none focus:border-[#111] transition-colors font-mono text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Name on Card</label>
                                                    <input
                                                        type="text"
                                                        defaultValue={customer.name}
                                                        className="w-full px-4 py-3.5 border border-gray-200 bg-white focus:outline-none focus:border-[#111] transition-colors text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* UPI Tab */}
                                    {activeTab === "upi" && (
                                        <div className="animate-in fade-in duration-300 space-y-5">
                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 block">UPI ID</label>
                                                <input
                                                    type="text"
                                                    placeholder="yourname@upi"
                                                    defaultValue="demo@zynora"
                                                    className="w-full px-4 py-3.5 border border-gray-200 bg-white focus:outline-none focus:border-[#111] transition-colors text-sm"
                                                />
                                                <p className="text-xs text-gray-400 mt-2">Enter your UPI ID or scan QR code</p>
                                            </div>
                                            <div className="bg-gray-50 border border-gray-100 p-8 flex items-center justify-center">
                                                <div className="w-36 h-36 bg-white border border-gray-200 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <Smartphone size={28} className="text-gray-300 mx-auto mb-2" />
                                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">QR Code</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Net Banking Tab */}
                                    {activeTab === "netbanking" && (
                                        <div className="animate-in fade-in duration-300">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4 block">Select Bank</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National"].map(
                                                    (bank) => (
                                                        <label
                                                            key={bank}
                                                            className="flex items-center gap-3 p-4 border border-gray-200 bg-white cursor-pointer hover:border-[#111] transition-colors group"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="bank"
                                                                defaultChecked={bank === "HDFC Bank"}
                                                                className="accent-black w-3.5 h-3.5"
                                                            />
                                                            <span className="text-sm text-gray-600 group-hover:text-[#111] transition-colors">
                                                                {bank}
                                                            </span>
                                                        </label>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pay Now Button */}
                            <FadeIn delay={0.1}>
                                <button
                                    onClick={handlePayNow}
                                    className="w-full mt-6 bg-[#111] text-white py-5 text-sm uppercase tracking-[0.2em] font-bold hover:bg-black transition-all flex items-center justify-center gap-3 animate-pulse-glow"
                                >
                                    <Lock size={14} />
                                    Pay {formatPrice(ring.totalPrice)}
                                </button>
                                <p className="text-center text-[10px] text-gray-400 mt-3 uppercase tracking-widest">
                                    Demo payment — no real charges
                                </p>
                            </FadeIn>
                        </FadeIn>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="flex-1">
                        <FadeIn delay={0.2} className="sticky top-28">
                            <div className="bg-white border border-gray-100 shadow-sm p-6">
                                <h3 className="font-heading text-sm uppercase tracking-wider text-[#111] mb-6 text-center border-b border-gray-100 pb-3">
                                    Order Summary
                                </h3>

                                <div className="flex gap-4 mb-5 pb-5 border-b border-gray-100">
                                    <div className="w-14 h-14 bg-[#FAFAF8] border border-gray-100 flex items-center justify-center shrink-0">
                                        <Diamond className="text-gray-300" size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-[#111] tracking-wide truncate">{ring.settingName}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {ring.diamondCarat}ct {ring.diamondShape} · {ring.metalType}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2.5 text-sm mb-5">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Setting</span>
                                        <span>{formatPrice(ring.settingPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Diamond</span>
                                        <span>{formatPrice(ring.diamondPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Metal</span>
                                        <span>{formatPrice(ring.metalPriceAdjustment)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4 border-t border-gray-200">
                                    <span className="font-bold text-[#111] uppercase tracking-wide text-sm">Total</span>
                                    <span className="text-xl font-bold text-[#111]">{formatPrice(ring.totalPrice)}</span>
                                </div>

                                {/* Shipping Info */}
                                <div className="mt-5 pt-5 border-t border-gray-100">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1.5">
                                        Shipping To
                                    </p>
                                    <p className="text-sm font-bold text-[#111]">{customer.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{customer.address}, {customer.city}</p>
                                    <p className="text-xs text-gray-500">{customer.state} - {customer.pincode}</p>
                                </div>
                            </div>

                            {/* Security badges */}
                            <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
                                <ShieldCheck size={14} />
                                <span className="text-xs">256-bit SSL Encryption</span>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </div>
    );
}

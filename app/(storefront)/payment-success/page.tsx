/* eslint-disable */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDemoOrderStore } from "@/lib/demo-order-store";
import { DemoStepper } from "@/components/DemoStepper";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/Button";
import { CheckCircle, Diamond, Package, ArrowRight, Copy, Check, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";

const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const CONFETTI_COLORS = ["#111111", "#D4AF37", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"];

function ConfettiEffect() {
    const [pieces, setPieces] = useState<{ id: number; left: string; color: string; delay: string; size: number }[]>([]);

    useEffect(() => {
        const newPieces = Array.from({ length: 40 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            delay: `${Math.random() * 1.5}s`,
            size: 6 + Math.random() * 6,
        }));
        setPieces(newPieces);
    }, []);

    return (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
            {pieces.map((p) => (
                <div
                    key={p.id}
                    className="confetti-piece active"
                    style={{
                        left: p.left,
                        backgroundColor: p.color,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animationDelay: p.delay,
                        borderRadius: Math.random() > 0.5 ? "50%" : "0",
                    }}
                />
            ))}
        </div>
    );
}

export default function PaymentSuccessPage() {
    const router = useRouter();
    const { ring, customer, orderResult } = useDemoOrderStore();
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => setShowConfetti(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) {
        return (
            <div className="bg-[#FAFAF8] min-h-[80vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#111] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!ring || !customer || !orderResult) {
        return (
            <div className="bg-[#FAFAF8] min-h-[80vh] flex items-center justify-center p-6">
                <div className="text-center max-w-lg">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-heading text-[#111] mb-4">Payment Successful!</h1>
                    <p className="text-gray-500 mb-8">Your order has been placed successfully.</p>
                    <Button onClick={() => router.push("/shop")}>Continue Shopping</Button>
                </div>
            </div>
        );
    }

    const handleCopyOrderId = () => {
        navigator.clipboard.writeText(orderResult.displayOrderId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-[#FAFAF8] min-h-[80vh] pt-6 pb-24 font-body">
            {showConfetti && <ConfettiEffect />}

            <div className="container-custom max-w-3xl">
                {/* Progress Stepper */}
                <FadeIn>
                    <DemoStepper currentStep={3} />
                </FadeIn>

                {/* Success Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="inline-block"
                    >
                        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6 animate-glow-ring">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                            >
                                <CheckCircle className="w-14 h-14 text-green-500" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-heading text-[#111] mb-2 tracking-wide">
                            Payment Successful
                        </h1>
                        <p className="text-gray-400 text-sm tracking-wide flex items-center justify-center gap-2">
                            <PartyPopper size={14} />
                            Your order has been confirmed and is being processed
                        </p>
                    </motion.div>
                </div>

                {/* Order ID Card */}
                <FadeIn>
                    <div className="bg-white border border-gray-100 shadow-sm p-5 mb-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">Order ID</p>
                            <p className="text-lg font-mono font-bold text-[#111] tracking-wider">{orderResult.displayOrderId}</p>
                        </div>
                        <button
                            onClick={handleCopyOrderId}
                            className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold px-4 py-2 border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
                        >
                            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>
                </FadeIn>

                {/* Order Summary */}
                <FadeIn delay={0.1}>
                    <div className="bg-white border border-gray-100 shadow-sm mb-6">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-heading text-sm text-[#111] tracking-wider uppercase">Order Summary</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-4 mb-5 pb-5 border-b border-gray-100">
                                <div className="w-16 h-16 bg-[#FAFAF8] border border-gray-100 flex items-center justify-center shrink-0">
                                    <Diamond className="text-gray-300" size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Custom Ring</p>
                                            <h4 className="text-sm font-bold text-[#111] tracking-wide truncate">{ring.settingName}</h4>
                                        </div>
                                        <span className="text-lg font-bold text-[#111] shrink-0">{formatPrice(ring.totalPrice)}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                                        <p className="text-xs text-gray-500">{ring.diamondCarat}ct {ring.diamondShape}</p>
                                        <p className="text-xs text-gray-500">{ring.diamondCut} Cut</p>
                                        <p className="text-xs text-gray-500">{ring.metalType}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2.5 text-sm">
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
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-gray-200 mt-2">
                                    <span className="font-bold text-[#111] uppercase tracking-wide text-sm">Total Paid</span>
                                    <span className="text-xl font-bold text-[#111]">{formatPrice(ring.totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Shipping Details */}
                <FadeIn delay={0.15}>
                    <div className="bg-white border border-gray-100 shadow-sm mb-6">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-heading text-sm text-[#111] tracking-wider uppercase">Shipping Details</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Customer</p>
                                <p className="text-sm font-bold text-[#111]">{customer.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{customer.email}</p>
                                <p className="text-xs text-gray-500">{customer.phone}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Address</p>
                                <p className="text-sm text-gray-700">{customer.address}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{customer.city}, {customer.state} - {customer.pincode}</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Delivery Timeline */}
                <FadeIn delay={0.2}>
                    <div className="bg-white border border-gray-100 shadow-sm p-5 mb-8 flex items-center gap-4">
                        <div className="bg-[#111] text-white p-3 rounded-full shrink-0">
                            <Package size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[#111] tracking-wide">Estimated Delivery</p>
                            <p className="text-xs text-gray-500 mt-0.5">Your bespoke ring will be handcrafted and delivered within 3-4 weeks</p>
                        </div>
                    </div>
                </FadeIn>

                {/* Actions */}
                <FadeIn delay={0.25}>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            fullWidth
                            onClick={() => router.push("/purchase-complete")}
                            className="text-sm gap-2"
                        >
                            View Order Details
                            <ArrowRight size={16} />
                        </Button>
                        <Button
                            fullWidth
                            variant="outline"
                            onClick={() => router.push("/shop")}
                            className="text-sm"
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}

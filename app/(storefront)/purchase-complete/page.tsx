/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoOrderStore } from "@/lib/demo-order-store";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/Button";
import { CheckCircle, Diamond, Package, Truck, Clock, Shield, ArrowLeft, Printer } from "lucide-react";

const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function PurchaseCompletePage() {
    const router = useRouter();
    const { ring, customer, orderResult, resetOrder } = useDemoOrderStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h1 className="text-3xl font-heading text-[#111] mb-4">No Order Found</h1>
                    <p className="text-gray-500 mb-8">Start by customizing your dream ring.</p>
                    <Button onClick={() => router.push("/customizer/step-1-setting")}>Start Customizing</Button>
                </div>
            </div>
        );
    }

    const handleContinueShopping = () => {
        resetOrder();
        router.push("/shop");
    };

    const orderDate = new Date().toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric"
    });

    const deliveryDate = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric"
    });

    return (
        <div className="bg-[#FAFAF8] min-h-[80vh] pt-6 pb-24 font-body">
            <div className="container-custom max-w-4xl">

                {/* Back */}
                <FadeIn>
                    <button
                        onClick={() => router.push("/payment-success")}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#111] text-xs uppercase tracking-widest font-bold mb-8 transition-colors"
                    >
                        <ArrowLeft size={14} /> Back
                    </button>
                </FadeIn>

                {/* Order Confirmed Banner */}
                <FadeIn>
                    <div className="bg-white border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-green-50 p-2.5 rounded-full shrink-0">
                                <CheckCircle className="text-green-500" size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-heading text-[#111] tracking-wide mb-0.5">Order Confirmed</h1>
                                        <p className="text-gray-400 text-sm">Thank you for choosing ZYNORA LUXE</p>
                                    </div>
                                    <div className="sm:text-right shrink-0">
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Order ID</p>
                                        <p className="text-base font-mono font-bold text-[#111] tracking-wider">{orderResult.displayOrderId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Order Timeline */}
                <FadeIn delay={0.05}>
                    <div className="bg-white border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
                        <h3 className="font-heading text-sm text-[#111] tracking-wider uppercase mb-6">Order Status</h3>
                        <div className="flex items-center justify-between relative px-4">
                            <div className="absolute top-5 left-4 right-4 h-[1px] bg-gray-100" />
                            <div className="absolute top-5 left-4 w-[12%] h-[2px] bg-green-500" />

                            {[
                                { icon: CheckCircle, label: "Confirmed", complete: true },
                                { icon: Package, label: "Crafting", complete: false },
                                { icon: Truck, label: "Shipping", complete: false },
                                { icon: Shield, label: "Delivered", complete: false },
                            ].map((step, i) => (
                                <div key={i} className="flex flex-col items-center relative z-10">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                            step.complete
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-100 text-gray-400"
                                        }`}
                                    >
                                        <step.icon size={16} />
                                    </div>
                                    <p className={`text-[10px] uppercase tracking-widest font-bold mt-2.5 ${
                                        step.complete ? "text-green-600" : "text-gray-300"
                                    }`}>
                                        {step.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Ring Configuration */}
                    <FadeIn delay={0.1}>
                        <div className="bg-white border border-gray-100 shadow-sm h-full">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-heading text-sm text-[#111] tracking-wider uppercase">Ring Configuration</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex gap-4 mb-5 pb-5 border-b border-gray-100">
                                    <div className="w-16 h-16 bg-[#FAFAF8] border border-gray-100 flex items-center justify-center shrink-0">
                                        <Diamond className="text-gray-300" size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">{ring.settingCategory}</p>
                                        <h4 className="text-sm font-bold text-[#111] tracking-wide truncate">{ring.settingName}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{ring.metalType}</p>
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    {[
                                        ["Diamond Shape", ring.diamondShape],
                                        ["Carat Weight", `${ring.diamondCarat}ct`],
                                        ["Cut", ring.diamondCut],
                                        ["Color", ring.diamondColor],
                                        ["Clarity", ring.diamondClarity],
                                        ["Certification", ring.diamondCertification],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex justify-between text-sm">
                                            <span className="text-gray-500">{label}</span>
                                            <span className="font-medium text-[#111]">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Customer Information */}
                        <FadeIn delay={0.15}>
                            <div className="bg-white border border-gray-100 shadow-sm">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="font-heading text-sm text-[#111] tracking-wider uppercase">Customer Information</h3>
                                </div>
                                <div className="p-6 space-y-3">
                                    {[
                                        ["Name", customer.name],
                                        ["Email", customer.email],
                                        ["Phone", customer.phone],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex justify-between text-sm">
                                            <span className="text-gray-500">{label}</span>
                                            <span className="font-medium text-[#111]">{value}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Address</span>
                                        <span className="font-medium text-[#111] text-right max-w-[55%]">
                                            {customer.address}, {customer.city}, {customer.state} - {customer.pincode}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Price Summary */}
                        <FadeIn delay={0.2}>
                            <div className="bg-white border border-gray-100 shadow-sm">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="font-heading text-sm text-[#111] tracking-wider uppercase">Payment Summary</h3>
                                </div>
                                <div className="p-6 space-y-2.5">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Setting</span>
                                        <span>{formatPrice(ring.settingPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Diamond</span>
                                        <span>{formatPrice(ring.diamondPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Metal</span>
                                        <span>{formatPrice(ring.metalPriceAdjustment)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between pt-4 border-t border-gray-200 mt-2">
                                        <span className="font-bold text-[#111] uppercase tracking-wide text-sm">Total Paid</span>
                                        <span className="text-xl font-bold text-[#111]">{formatPrice(ring.totalPrice)}</span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>

                {/* Order Info Footer */}
                <FadeIn delay={0.25}>
                    <div className="bg-white border border-gray-100 shadow-sm p-5 mt-6 grid grid-cols-2 md:grid-cols-4 gap-5">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">Order Date</p>
                            <p className="text-sm font-medium text-[#111]">{orderDate}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">Est. Delivery</p>
                            <p className="text-sm font-medium text-[#111]">{deliveryDate}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">Payment</p>
                            <p className="text-sm font-medium text-green-600">Completed</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">Status</p>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 border border-green-100">
                                <CheckCircle size={10} />
                                Confirmed
                            </span>
                        </div>
                    </div>
                </FadeIn>

                {/* Actions */}
                <FadeIn delay={0.3}>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Button fullWidth onClick={handleContinueShopping} className="text-sm">
                            Continue Shopping
                        </Button>
                        <Button fullWidth variant="outline" onClick={() => router.push("/customizer/step-1-setting")} className="text-sm">
                            Customize Another Ring
                        </Button>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}

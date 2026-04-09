/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Button } from "@/components/Button";
import { FadeIn } from "@/components/FadeIn";
import { motion } from "framer-motion";
import {
    CheckCircle,
    Copy,
    Check,
    ShoppingBag,
    Package,
    Truck,
    Diamond,
    User,
    Mail,
    Phone,
    MapPin,
    PartyPopper,
    ArrowRight,
    ClipboardList,
} from "lucide-react";

const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);

const CONFETTI_COLORS = ["#111111", "#D4AF37", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"];

function ConfettiEffect() {
    const [pieces, setPieces] = useState<
        { id: number; left: string; color: string; delay: string; size: number }[]
    >([]);

    useEffect(() => {
        const newPieces = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            delay: `${Math.random() * 2}s`,
            size: 5 + Math.random() * 7,
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

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);

    const fetchOrder = useCallback(async () => {
        if (!orderId) {
            setLoading(false);
            setError(true);
            return;
        }
        try {
            const res = await fetch(`/api/orders/${orderId}`);
            const data = await res.json();
            if (data.success && data.order) {
                setOrder(data.order);
            } else {
                setError(true);
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrder();
        const timer = setTimeout(() => setShowConfetti(false), 4000);
        return () => clearTimeout(timer);
    }, [fetchOrder]);

    const handleCopy = () => {
        const id = order?.displayOrderId || orderId || "";
        navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-[#FAFAF8] min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-[#111] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                        Loading your order...
                    </p>
                </div>
            </div>
        );
    }

    // Error / No order state
    if (error || !order) {
        return (
            <div className="bg-[#FAFAF8] min-h-[80vh] flex items-center justify-center p-6">
                <FadeIn>
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-heading text-[#111] mb-3 tracking-wide">
                            Order Placed Successfully!
                        </h1>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                            Your order has been confirmed. You will receive updates via email.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="/shop" className="flex-1">
                                <Button fullWidth className="text-sm gap-2">
                                    <ShoppingBag size={14} />
                                    Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>
                </FadeIn>
            </div>
        );
    }

    const isCustomRing = order.orderType === "CUSTOM_RING";
    const displayId = order.displayOrderId || `ZYNORA-ORD-${order.id.slice(-6).toUpperCase()}`;
    const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const deliveryDate = new Date(
        new Date(order.createdAt).getTime() + 28 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="bg-[#FAFAF8] min-h-[80vh] pt-6 pb-24 font-body">
            {showConfetti && <ConfettiEffect />}

            <div className="container-custom max-w-4xl">
                {/* ═══════════════ Success Header ═══════════════ */}
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
                            Order Placed Successfully
                        </h1>
                        <p className="text-gray-400 text-sm tracking-wide flex items-center justify-center gap-2">
                            <PartyPopper size={14} />
                            Thank you for choosing ZYNORA LUXE
                        </p>
                    </motion.div>
                </div>

                {/* ═══════════════ Order ID Banner ═══════════════ */}
                <FadeIn>
                    <div className="bg-white border border-gray-100 shadow-sm p-5 mb-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">
                                Order ID
                            </p>
                            <p className="text-lg font-mono font-bold text-[#111] tracking-wider order-id-highlight">
                                {displayId}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span
                                className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest border ${
                                    isCustomRing
                                        ? "bg-purple-50 text-purple-700 border-purple-100"
                                        : "bg-blue-50 text-blue-700 border-blue-100"
                                }`}
                            >
                                {isCustomRing ? (
                                    <>
                                        <Diamond size={10} /> Custom Ring
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag size={10} /> Cart Order
                                    </>
                                )}
                            </span>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold px-4 py-2 border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
                            >
                                {copied ? (
                                    <Check size={14} className="text-green-500" />
                                ) : (
                                    <Copy size={14} />
                                )}
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>
                </FadeIn>

                {/* ═══════════════ Order Status Timeline ═══════════════ */}
                <FadeIn delay={0.05}>
                    <div className="bg-white border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
                        <h3 className="font-heading text-sm text-[#111] tracking-wider uppercase mb-6">
                            Order Status
                        </h3>
                        <div className="flex items-center justify-between relative px-4">
                            <div className="absolute top-5 left-4 right-4 h-[1px] bg-gray-100" />
                            <div className="absolute top-5 left-4 w-[12%] h-[2px] bg-green-500" />

                            {[
                                { icon: CheckCircle, label: "Confirmed", complete: true },
                                { icon: Package, label: "Processing", complete: false },
                                { icon: Truck, label: "Shipped", complete: false },
                                { icon: CheckCircle, label: "Delivered", complete: false },
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
                                    <p
                                        className={`text-[10px] uppercase tracking-widest font-bold mt-2.5 ${
                                            step.complete ? "text-green-600" : "text-gray-300"
                                        }`}
                                    >
                                        {step.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* ═══════════════ Order Items ═══════════════ */}
                    <FadeIn delay={0.1}>
                        <div className="bg-white border border-gray-100 shadow-sm h-full">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-heading text-sm text-[#111] tracking-wider uppercase">
                                    {isCustomRing ? "Ring Configuration" : "Order Items"}
                                </h3>
                            </div>
                            <div className="p-6">
                                {isCustomRing ? (
                                    // ── Custom Ring Details ──
                                    <div>
                                        {order.items?.map((item: any) => {
                                            const config = item.ringConfiguration;
                                            return (
                                                <div key={item.id}>
                                                    <div className="flex gap-4 mb-5 pb-5 border-b border-gray-100">
                                                        <div className="w-16 h-16 bg-[#FAFAF8] border border-gray-100 flex items-center justify-center shrink-0">
                                                            {config?.setting?.imageUrl ? (
                                                                <Image
                                                                    src={config.setting.imageUrl}
                                                                    alt={config.setting.name}
                                                                    width={64}
                                                                    height={64}
                                                                    className="object-cover p-1"
                                                                />
                                                            ) : (
                                                                <Diamond
                                                                    className="text-gray-300"
                                                                    size={24}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">
                                                                {config?.setting?.category ||
                                                                    "Custom Ring"}
                                                            </p>
                                                            <h4 className="text-sm font-bold text-[#111] tracking-wide truncate">
                                                                {config?.setting?.name ||
                                                                    "Custom Configuration"}
                                                            </h4>
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {config?.metalType || ""}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {config && (
                                                        <div className="space-y-2.5">
                                                            {[
                                                                [
                                                                    "Diamond Shape",
                                                                    config.diamond?.shape,
                                                                ],
                                                                [
                                                                    "Carat Weight",
                                                                    config.diamond?.caratWeight
                                                                        ? `${config.diamond.caratWeight}ct`
                                                                        : "-",
                                                                ],
                                                                ["Cut", config.diamond?.cut],
                                                                ["Color", config.diamond?.color],
                                                                [
                                                                    "Clarity",
                                                                    config.diamond?.clarity,
                                                                ],
                                                                [
                                                                    "Certification",
                                                                    config.diamond?.certification,
                                                                ],
                                                                ["Metal", config.metalType],
                                                            ]
                                                                .filter(([, v]) => v)
                                                                .map(([label, value]) => (
                                                                    <div
                                                                        key={label}
                                                                        className="flex justify-between text-sm"
                                                                    >
                                                                        <span className="text-gray-500">
                                                                            {label}
                                                                        </span>
                                                                        <span className="font-medium text-[#111]">
                                                                            {value}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    )}

                                                    {!config && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">
                                                                Price
                                                            </span>
                                                            <span className="font-bold text-[#111]">
                                                                {formatPrice(item.price)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    // ── Cart Items ──
                                    <div className="space-y-4">
                                        {order.items?.map((item: any) => {
                                            const product = item.product;
                                            const images = product?.images
                                                ? JSON.parse(product.images)
                                                : [];
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                                                >
                                                    <div className="w-16 h-16 bg-[#FAFAF8] border border-gray-100 flex items-center justify-center shrink-0 relative">
                                                        {images.length > 0 ? (
                                                            <Image
                                                                src={images[0]}
                                                                alt={
                                                                    product?.name || "Product"
                                                                }
                                                                fill
                                                                className="object-cover p-1"
                                                            />
                                                        ) : (
                                                            <Package
                                                                className="text-gray-300"
                                                                size={24}
                                                            />
                                                        )}
                                                        {item.quantity > 1 && (
                                                            <span className="absolute -top-1.5 -right-1.5 bg-[#111] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                                                                {item.quantity}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-[#111] tracking-wide truncate">
                                                            {product?.name || "Product"}
                                                        </h4>
                                                        {product?.metalType && (
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {product.metalType}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center justify-between mt-1.5">
                                                            <span className="text-xs text-gray-400">
                                                                Qty: {item.quantity}
                                                            </span>
                                                            <span className="text-sm font-bold text-[#111]">
                                                                {formatPrice(
                                                                    item.price * item.quantity
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </FadeIn>

                    {/* ═══════════════ Right Column ═══════════════ */}
                    <div className="space-y-6">
                        {/* Customer Information */}
                        <FadeIn delay={0.15}>
                            <div className="bg-white border border-gray-100 shadow-sm">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="font-heading text-sm text-[#111] tracking-wider uppercase">
                                        Customer Details
                                    </h3>
                                </div>
                                <div className="p-6 space-y-3.5">
                                    {order.customerName && (
                                        <div className="flex items-center gap-3">
                                            <User size={14} className="text-gray-400 shrink-0" />
                                            <div className="flex justify-between flex-1 text-sm">
                                                <span className="text-gray-500">Name</span>
                                                <span className="font-medium text-[#111]">
                                                    {order.customerName}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {order.customerEmail && (
                                        <div className="flex items-center gap-3">
                                            <Mail size={14} className="text-gray-400 shrink-0" />
                                            <div className="flex justify-between flex-1 text-sm">
                                                <span className="text-gray-500">Email</span>
                                                <span className="font-medium text-[#111]">
                                                    {order.customerEmail}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {order.customerPhone && (
                                        <div className="flex items-center gap-3">
                                            <Phone size={14} className="text-gray-400 shrink-0" />
                                            <div className="flex justify-between flex-1 text-sm">
                                                <span className="text-gray-500">Phone</span>
                                                <span className="font-medium text-[#111]">
                                                    {order.customerPhone}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {order.customerAddress && (
                                        <div className="flex items-start gap-3">
                                            <MapPin
                                                size={14}
                                                className="text-gray-400 shrink-0 mt-0.5"
                                            />
                                            <div className="flex justify-between flex-1 text-sm">
                                                <span className="text-gray-500">Address</span>
                                                <span className="font-medium text-[#111] text-right max-w-[55%]">
                                                    {order.customerAddress}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FadeIn>

                        {/* Payment Summary */}
                        <FadeIn delay={0.2}>
                            <div className="bg-white border border-gray-100 shadow-sm">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="font-heading text-sm text-[#111] tracking-wider uppercase">
                                        Payment Summary
                                    </h3>
                                </div>
                                <div className="p-6 space-y-2.5">
                                    {order.subtotal != null && order.subtotal !== order.totalAmount && (
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Subtotal</span>
                                            <span>{formatPrice(order.subtotal)}</span>
                                        </div>
                                    )}
                                    {order.gstAmount > 0 && (
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>
                                                GST {order.gstType ? `(${order.gstType})` : ""}
                                            </span>
                                            <span>{formatPrice(order.gstAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between pt-4 border-t border-gray-200 mt-2">
                                        <span className="font-bold text-[#111] uppercase tracking-wide text-sm">
                                            Total Paid
                                        </span>
                                        <span className="text-xl font-bold text-[#111]">
                                            {formatPrice(order.totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>

                {/* ═══════════════ Order Info Footer ═══════════════ */}
                <FadeIn delay={0.25}>
                    <div className="bg-white border border-gray-100 shadow-sm p-5 mt-6 grid grid-cols-2 md:grid-cols-4 gap-5">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">
                                Order Date
                            </p>
                            <p className="text-sm font-medium text-[#111]">{orderDate}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">
                                Est. Delivery
                            </p>
                            <p className="text-sm font-medium text-[#111]">{deliveryDate}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">
                                Payment
                            </p>
                            <p className="text-sm font-medium text-green-600">Confirmed</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">
                                Status
                            </p>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 border border-green-100">
                                <CheckCircle size={10} />
                                {order.status}
                            </span>
                        </div>
                    </div>
                </FadeIn>

                {/* ═══════════════ Delivery Notice ═══════════════ */}
                <FadeIn delay={0.3}>
                    <div className="bg-white border border-gray-100 shadow-sm p-5 mt-4 flex items-center gap-4">
                        <div className="bg-[#111] text-white p-3 rounded-full shrink-0">
                            <Truck size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[#111] tracking-wide">
                                Estimated Delivery
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {isCustomRing
                                    ? "Your bespoke ring will be handcrafted and delivered within 3-4 weeks"
                                    : "Your order will be carefully packaged and delivered within 5-7 business days"}
                            </p>
                        </div>
                    </div>
                </FadeIn>

                {/* ═══════════════ Action Buttons ═══════════════ */}
                <FadeIn delay={0.35}>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Link href="/shop" className="flex-1">
                            <Button fullWidth className="text-sm gap-2">
                                <ShoppingBag size={16} />
                                Continue Shopping
                            </Button>
                        </Link>
                        <Link href="/admin/orders" className="flex-1">
                            <Button fullWidth variant="outline" className="text-sm gap-2">
                                <ClipboardList size={16} />
                                View Orders
                            </Button>
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="bg-[#FAFAF8] min-h-[80vh] flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#111] border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <OrderSuccessContent />
        </Suspense>
    );
}

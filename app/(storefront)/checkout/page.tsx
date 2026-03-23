/* eslint-disable */
"use client";

import { useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/Button";
import { useCart } from "@/components/CartProvider";
import Image from "next/image";
import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
    const { items, cartCount } = useCart();

    // Checkout Form State
    const [billingState, setBillingState] = useState("State");
    const [gstNumber, setGstNumber] = useState("");
    const [formData, setFormData] = useState({
        email: "", phone: "", firstName: "", lastName: "", address: "", city: "", pincode: ""
    });

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // GST Logic Calculation
    const isInterstate = billingState && billingState !== "State" && billingState !== "Gujarat";
    const gstRate = 0.18; // 18% Total GST for Diamonds/Jewelry in India
    const gstAmount = Math.round(subtotal * gstRate);
    const total = subtotal + gstAmount;

    // Display helpers
    const gstDisplay = isInterstate ? "IGST (18%)" : "CGST (9%) + SGST (9%)";

    return (
        <div className="bg-diamond-bg min-h-[80vh] pt-10 pb-24 font-body">
            <div className="container-custom">
                <FadeIn>
                    <h1 className="text-4xl text-text-dark mb-10">Secure Checkout</h1>
                </FadeIn>

                {items.length === 0 ? (
                    <FadeIn className="text-center py-20 bg-gray-50 border border-gray-100">
                        <h2 className="text-2xl text-text-dark mb-4">Your Cart is Empty</h2>
                        <p className="text-gray-500 mb-8">Discover our exquisite collection of fine diamond jewelry.</p>
                        <Link href="/shop">
                            <Button>Continue Shopping</Button>
                        </Link>
                    </FadeIn>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Left: Forms */}
                        <div className="flex-[1.5]">
                            <FadeIn className="mb-10">
                                <h3 className="text-xl font-heading text-text-dark mb-6 border-b border-gray-100 pb-3">1. Contact Information</h3>
                                <div className="grid gap-5">
                                    <input type="email" placeholder="Email Address" className="w-full p-4 border border-gray-200 focus:outline-none focus:border-[#111111] transition-colors bg-[#F4F1E9]/20" onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    <input type="tel" placeholder="Phone Number" className="w-full p-4 border border-gray-200 focus:outline-none focus:border-[#111111] transition-colors bg-[#F4F1E9]/20" onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.1} className="mb-10">
                                <h3 className="text-xl font-heading text-text-dark mb-6 border-b border-gray-100 pb-3 font-semibold">2. Shipping Address</h3>
                                <div className="grid grid-cols-2 gap-5 mb-5">
                                    <input type="text" placeholder="First Name" className="w-full p-4 border border-gray-200 focus:outline-none focus:border-[#111111] transition-colors bg-[#F4F1E9]/20" onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                    <input type="text" placeholder="Last Name" className="w-full p-4 border border-gray-200 focus:outline-none focus:border-[#111111] transition-colors bg-[#F4F1E9]/20" onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                </div>
                                <input type="text" placeholder="Street Address" className="w-full p-4 border border-gray-200 focus:outline-none focus:border-[#111111] transition-colors mb-5 bg-[#F4F1E9]/20" onChange={e => setFormData({ ...formData, address: e.target.value })} />
                                <div className="grid grid-cols-3 gap-5 mb-5">
                                    <input type="text" placeholder="City" className="w-full p-4 border border-gray-200 focus:outline-none focus:border-[#111111] transition-colors bg-[#F4F1E9]/20" onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                    <select
                                        className="w-full p-4 border border-gray-200 focus:outline-none focus:border-[#111111] transition-colors text-gray-700 bg-[#F4F1E9]/20"
                                        value={billingState}
                                        onChange={(e) => setBillingState(e.target.value)}
                                    >
                                        <option value="State">State</option>
                                        <option value="Gujarat">Gujarat</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Karnataka">Karnataka</option>
                                    </select>
                                    <input type="text" placeholder="PIN Code" className="w-full p-4 border border-gray-200 focus:outline-none focus:border-[#111111] transition-colors bg-[#F4F1E9]/20" onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
                                </div>
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        placeholder="GST Number (Optional B2B)"
                                        className="w-full p-4 border border-gray-200 focus:outline-none focus:border-[#111111] transition-colors uppercase bg-[#F4F1E9]/20"
                                        value={gstNumber}
                                        onChange={e => setGstNumber(e.target.value.toUpperCase())}
                                    />
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.2} className="mb-10">
                                <h3 className="text-xl font-heading text-[#111111] mb-6 border-b border-gray-100 pb-3 font-semibold">3. Payment Method</h3>
                                <div className="bg-[#F4F1E9]/20 border border-gray-200 p-6 flex flex-col gap-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="radio" name="payment" defaultChecked className="accent-black w-4 h-4" />
                                        <span className="text-text-dark font-medium">Razorpay (Cards, UPI, NetBanking)</span>
                                    </label>
                                    <p className="text-sm text-gray-500 ml-7">
                                        You will be redirected to Razorpay's secure gateway after clicking "Place Order".
                                    </p>
                                </div>
                            </FadeIn>
                        </div>

                        {/* Right: Order Summary */}
                        <div className="flex-1">
                            <FadeIn delay={0.3} className="bg-gray-50 p-8 sticky top-28 border border-gray-100">
                                <h3 className="text-center font-heading text-xl uppercase tracking-wide text-text-dark mb-6">Order Summary</h3>

                                <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="w-20 h-20 relative bg-white border border-gray-200 shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover p-1" />
                                                <span className="absolute -top-2 -right-2 bg-text-dark text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h4 className="text-sm font-bold text-[#111111] line-clamp-2 uppercase tracking-wide">{item.name}</h4>
                                                <p className="text-sm text-gray-600 mt-1 font-medium">₹{item.price.toLocaleString("en-IN")}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 border-y border-gray-200 py-6 mb-6">
                                    <div className="flex justify-between text-sm text-gray-600 font-medium">
                                        <span>Subtotal ({cartCount} items)</span>
                                        <span>₹{subtotal.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 font-medium">
                                        <span>{billingState !== "State" ? gstDisplay : "Estimated GST"}</span>
                                        <span>₹{gstAmount.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 font-medium">
                                        <span>Value Added Services</span>
                                        <span>Free</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
                                    <span className="text-lg font-bold text-[#111111] uppercase tracking-wide">Total</span>
                                    <span className="text-2xl font-bold text-[#111111]">₹{total.toLocaleString("en-IN")}</span>
                                </div>

                                <CheckoutButton
                                    total={total}
                                    billingState={billingState}
                                    formData={formData}
                                    gstNumber={gstNumber}
                                    gstAmount={gstAmount}
                                    gstType={isInterstate ? "IGST" : "CGST_SGST"}
                                />

                                <div className="flex justify-center items-center gap-2 text-xs text-gray-400 mt-6">
                                    <ShieldCheck size={14} />
                                    <span>256-bit SSL Encrypted Checkout</span>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

import React, { useEffect } from "react";
import Script from "next/script";

interface CheckoutButtonProps {
    total: number;
    billingState: string;
    formData: any;
    gstNumber: string;
    gstAmount: number;
    gstType: string;
}

function CheckoutButton({ total, billingState, formData, gstNumber, gstAmount, gstType }: CheckoutButtonProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const { items, clearCart } = useCart();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleCheckout = async () => {
        if (!isClient || items.length === 0) return;
        if (billingState === "State") {
            alert("Please select a State from the dropdown to calculate accurate GST.");
            return;
        }

        setIsProcessing(true);

        try {
            const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Build the rich order payload for the backend
            const orderPayload = {
                items,
                subtotal,
                totalAmount: total,
                gstAmount,
                gstType,
                billingState,
                shippingState: billingState, // Mirroring for now
                gstNumber: gstNumber || null,
                customer: formData
            };

            const options = {
                key: "rzp_test_placeholder", // Enter the Key ID generated from the Dashboard
                amount: total * 100, // Amount is in currency subunits. Default currency is INR.
                currency: "INR",
                name: "ZYNORA LUXE",
                description: "Luxury Jewelry Purchase",
                image: "/assets/logo.png",
                handler: async function (response: any) {
                    console.log("Payment Successful", response.razorpay_payment_id);
                    try {
                        // Persist to DB using secure checkoput endpoint returning verification
                        const res = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ...orderPayload,
                                razorpayId: response.razorpay_payment_id
                            })
                        });
                        const data = await res.json();
                        if (data.success) {
                            console.log("Order saved to DB and invoice generated");
                            clearCart();
                            window.location.href = "/order-success";
                        } else {
                            alert("Payment received, but error saving order: " + data.message);
                        }
                    } catch (e) {
                        console.error("Failed to save order", e);
                    }
                },
                prefill: {
                    name: formData.firstName ? `${formData.firstName} ${formData.lastName}` : "Valued Customer",
                    email: formData.email || "customer@example.com",
                    contact: formData.phone || "9999999999"
                },
                theme: {
                    color: "#111111"
                }
            };

            // @ts-ignore
            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', function (response: any) {
                console.error("Payment Failed", response.error.description);
                alert("Payment failed: " + response.error.description);
                setIsProcessing(false);
            });
            rzp.open();
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
        }
    };

    if (!isClient) return <Button fullWidth className="mb-4 text-sm gap-2"><Lock size={16} /> Place Order Securely</Button>;

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <Button
                fullWidth
                className="mb-4 text-sm gap-2"
                onClick={handleCheckout}
                disabled={isProcessing || items.length === 0}
            >
                {isProcessing ? (
                    <span>Processing Payment...</span>
                ) : (
                    <><Lock size={16} /> Place Order Securely</>
                )}
            </Button>
        </>
    );
}

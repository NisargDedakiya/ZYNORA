/* eslint-disable */
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartProvider";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, cartCount, removeFromCart } = useCart();
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-heading text-text-dark">Your Cart ({cartCount})</h2>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="text-center text-gray-500 py-10 mt-10">
                                    <p>Your cart is currently empty.</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-4">
                                        <div className="w-20 h-20 relative bg-gray-50 shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover p-1" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm text-text-dark font-medium line-clamp-2 pr-4">{item.name}</h4>
                                            {item.isCustomRing && item.metalType && (
                                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Metal: {item.metalType}</p>
                                            )}
                                            <p className="text-sm text-gold mt-1">₹{item.price.toLocaleString("en-IN")} x {(item as any).quantity}</p>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-xs text-red-400 mt-2 hover:text-red-600 transition-colors uppercase tracking-wider"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <div className="flex justify-between mb-6 text-lg font-medium text-text-dark">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Link href="/checkout" onClick={onClose} className="w-full">
                                        <Button fullWidth className="py-4">Checkout</Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

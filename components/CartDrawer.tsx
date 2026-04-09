/* eslint-disable */
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartProvider";
import { X, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
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
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={18} className="text-[#111]" />
                                <h2 className="text-lg font-heading text-[#111] uppercase tracking-wide">
                                    Cart {cartCount > 0 && <span className="text-gray-400 text-sm ml-1">({cartCount})</span>}
                                </h2>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto">
                            {items.length === 0 ? (
                                /* Premium Empty State */
                                <div className="flex flex-col items-center justify-center h-full px-8 text-center">
                                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                                        <ShoppingBag size={32} className="text-gray-300" strokeWidth={1} />
                                    </div>
                                    <h3 className="text-lg font-heading text-[#111] mb-2">Your Cart is Empty</h3>
                                    <p className="text-sm text-gray-400 mb-8 max-w-xs leading-relaxed">
                                        Discover our exquisite collection of fine jewelry and begin your journey.
                                    </p>
                                    <Link href="/shop" onClick={onClose}>
                                        <Button className="text-sm gap-2 px-8">
                                            Explore Collection
                                            <ArrowRight size={14} />
                                        </Button>
                                    </Link>
                                    <Link 
                                        href="/customizer/step-1-setting" 
                                        onClick={onClose}
                                        className="text-xs text-gray-400 hover:text-[#111] transition-colors mt-4 uppercase tracking-widest font-medium"
                                    >
                                        or Customize a Ring
                                    </Link>
                                </div>
                            ) : (
                                <div className="p-6 space-y-0">
                                    <AnimatePresence mode="popLayout">
                                        {items.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: 50, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex gap-4 py-5 border-b border-gray-100 group"
                                            >
                                                <div className="w-20 h-20 relative bg-gray-50 shrink-0 border border-gray-100">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover p-1" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm text-[#111] font-medium line-clamp-2 pr-4 leading-snug">{item.name}</h4>
                                                    {item.isCustomRing && item.metalType && (
                                                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{item.metalType}</p>
                                                    )}
                                                    <div className="flex items-center justify-between mt-2">
                                                        <p className="text-sm font-medium text-[#111]">
                                                            ₹{item.price.toLocaleString("en-IN")}
                                                            {(item as any).quantity > 1 && (
                                                                <span className="text-gray-400 text-xs ml-1">× {(item as any).quantity}</span>
                                                            )}
                                                        </p>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                            title="Remove item"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Footer with Subtotal */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-[#FAFAF8]">
                                <div className="flex justify-between mb-2 text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-[#111] text-base">₹{subtotal.toLocaleString("en-IN")}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-5">Shipping calculated at checkout</p>
                                <div className="flex flex-col gap-3">
                                    <Link href="/checkout" onClick={onClose} className="w-full">
                                        <Button fullWidth className="py-4 text-sm gap-2">
                                            Checkout
                                            <ArrowRight size={14} />
                                        </Button>
                                    </Link>
                                    <button
                                        onClick={onClose}
                                        className="w-full py-2 text-xs uppercase tracking-widest text-gray-400 hover:text-[#111] transition-colors font-medium"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

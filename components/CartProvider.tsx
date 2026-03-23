/* eslint-disable */
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type CartItem = {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    isCustomRing?: boolean;
    ringConfigurationId?: string;
    metalType?: string;
};

type CartContextType = {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedCart = localStorage.getItem("luxury_cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) { }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("luxury_cart", JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToCart = (item: CartItem) => {
        setItems((current) => {
            const existing = current.find((i) => i.id === item.id);
            if (existing) {
                return current.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + +(item.quantity || 1) } : i
                );
            }
            return [...current, { ...item, quantity: item.quantity || 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setItems((current) => current.filter((i) => i.id !== id));
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem("luxury_cart");
    }

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import Link from "next/link";
import type { Diamond } from "@prisma/client";

// Formatter for ₹ Currency
const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
};

export default function RingSettingsPlaceholder() {
    const [selectedDiamond, setSelectedDiamond] = useState<Diamond | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem('selectedDiamond');
        if (stored) {
            setTimeout(() => setSelectedDiamond(JSON.parse(stored)), 0);
        }
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 py-24 px-6 text-center">
            <h1 className="text-4xl font-heading text-gray-900 mb-6">Choose Your Setting</h1>
            {selectedDiamond ? (
                <div className="bg-white max-w-xl mx-auto p-8 border border-gray-100 shadow-sm rounded-md mb-8">
                    <h2 className="text-sm uppercase tracking-widest text-[#111111] font-bold mb-4">Your Selected Diamond</h2>
                    <ul className="text-left space-y-2 text-gray-700 mb-6">
                        <li><strong>Shape:</strong> {selectedDiamond.shape}</li>
                        <li><strong>Carat:</strong> {selectedDiamond.caratWeight}</li>
                        <li><strong>Color/Clarity:</strong> {selectedDiamond.color} / {selectedDiamond.clarity}</li>
                        <li><strong>Price:</strong> {formatPrice(selectedDiamond.price)}</li>
                    </ul>
                    <p className="text-sm text-gray-500 mb-6 italic">
                        The ring builder flow continues from here. This is a placeholder for the next step in the customization process!
                    </p>
                    <Link href="/diamonds" passHref>
                        <Button variant="outline" className="w-full">Change Diamond</Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white max-w-xl mx-auto p-8 border border-gray-100 shadow-sm rounded-md">
                    <p className="text-gray-500 mb-6">You haven&apos;t selected a diamond yet.</p>
                    <Link href="/diamonds" passHref>
                        <Button>Start with a Diamond</Button>
                    </Link>
                </div>
            )}
        </main>
    );
}

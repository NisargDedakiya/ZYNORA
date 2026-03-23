import { DiamondSearchClient } from "./DiamondSearchClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Find Your Perfect Diamond | ZYNORA LUXE",
    description: "Search certified loose diamonds curated for brilliance. Filter by Price, Carat, Cut, Color, and Clarity.",
};

export default function DiamondsPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="bg-white py-16 text-center border-b border-gray-100">
                <h1 className="text-4xl md:text-5xl font-heading text-gray-900 mb-4">
                    Find Your Perfect Diamond
                </h1>
                <p className="text-gray-500 uppercase tracking-widest text-sm">
                    Certified diamonds curated for brilliance.
                </p>
            </div>

            <DiamondSearchClient />
        </main>
    );
}

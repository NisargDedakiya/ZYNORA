/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, SlidersHorizontal, Diamond } from "lucide-react";

export default function ShopPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [priceRange, setPriceRange] = useState(500000);
    const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
    const [selectedMetals, setSelectedMetals] = useState<string[]>([]);
    const [sort, setSort] = useState("popular");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const shapesList = ["Round", "Oval", "Princess", "Emerald"];
    const metalsList = ["18K Yellow Gold", "18K White Gold", "Rose Gold", "Platinum"];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.append('maxPrice', priceRange.toString());
                if (selectedShapes.length > 0) params.append('shape', selectedShapes.join(','));
                if (selectedMetals.length > 0) params.append('metal', selectedMetals.join(','));
                if (sort) params.append('sort', sort);

                const res = await fetch(`/api/products?${params.toString()}`);
                const data = await res.json();
                if (data.success) {
                    setProducts(data.products);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [priceRange, selectedShapes, selectedMetals, sort]);

    const handleShapeChange = (shape: string) => {
        setSelectedShapes(prev => prev.includes(shape) ? prev.filter(s => s !== shape) : [...prev, shape]);
    };

    const handleMetalChange = (metal: string) => {
        setSelectedMetals(prev => prev.includes(metal) ? prev.filter(m => m !== metal) : [...prev, metal]);
    };

    return (
        <div className="bg-diamond-bg min-h-screen pt-4 pb-32 text-diamond-text font-body transition-colors duration-1000">
            {/* Minimalist Top Bar */}
            <div className="border-b border-diamond-accent/20 bg-diamond-bg/80 backdrop-blur-md sticky top-0 z-40 mb-12">
                <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-heading text-diamond-text tracking-wide">The Bridal Collection</h1>
                        <p className="text-diamond-text/50 tracking-widest uppercase text-xs mt-2">{products.length} Designs Showcased</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            className="md:hidden flex items-center gap-2 border border-diamond-accent/30 px-4 py-2 rounded-none text-sm uppercase tracking-widest"
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                        >
                            <SlidersHorizontal size={16} /> Filters
                        </button>

                        <div className="relative flex-1 md:w-64">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="w-full py-3 pr-10 pl-4 border-b border-diamond-accent/30 text-diamond-text appearance-none bg-transparent focus:outline-none focus:border-diamond-text transition-colors cursor-pointer uppercase text-xs tracking-widest rounded-none"
                            >
                                <option value="popular">Sort: Signature Picks</option>
                                <option value="newest">Sort: Latest Arrivals</option>
                                <option value="price-asc">Sort: Price Low to High</option>
                                <option value="price-desc">Sort: Price High to Low</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-diamond-accent pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom flex flex-col lg:flex-row gap-16 relative">
                {/* Left Sidebar Filters - Structural Minimalism */}
                <aside className={`w-full lg:w-[240px] shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'} sticky top-32 self-start max-h-[calc(100vh-140px)] overflow-y-auto pr-4 scrollbar-thin`}>
                    <FadeIn delay={0.1}>
                        {/* Price Filter */}
                        <div className="mb-12">
                            <h4 className="font-heading text-lg mb-6 text-diamond-text border-b border-diamond-accent/20 pb-2">Price Ceiling</h4>
                            <input
                                type="range"
                                min="20000"
                                max="500000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full h-1 bg-diamond-accent/20 rounded-none appearance-none cursor-pointer accent-diamond-text"
                            />
                            <div className="flex justify-between mt-4 text-xs tracking-widest text-diamond-text/60 font-medium">
                                <span>₹20K</span>
                                <span className="text-diamond-text border border-diamond-accent/30 px-2 py-1">₹{priceRange.toLocaleString("en-IN")}</span>
                            </div>
                        </div>

                        {/* Shape Filter */}
                        <div className="mb-12">
                            <h4 className="font-heading text-lg mb-6 text-diamond-text border-b border-diamond-accent/20 pb-2">Diamond Cut</h4>
                            <div className="space-y-5">
                                {shapesList.map((shape) => (
                                    <label key={shape} className="flex items-center gap-4 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={selectedShapes.includes(shape)}
                                                onChange={() => handleShapeChange(shape)}
                                            />
                                            <div className="w-4 h-4 border border-diamond-text/30 rounded-none bg-transparent peer-checked:bg-diamond-text peer-checked:border-diamond-text transition-colors group-hover:border-diamond-text" />
                                            <svg className="absolute w-3 h-3 text-diamond-bg opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        <span className="text-sm tracking-wide text-diamond-text/70 group-hover:text-diamond-text transition-colors uppercase font-medium">{shape}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Metal Filter */}
                        <div className="mb-12">
                            <h4 className="font-heading text-lg mb-6 text-diamond-text border-b border-diamond-accent/20 pb-2">Setting Alloy</h4>
                            <div className="space-y-5">
                                {metalsList.map((metal) => (
                                    <label key={metal} className="flex items-center gap-4 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={selectedMetals.includes(metal)}
                                                onChange={() => handleMetalChange(metal)}
                                            />
                                            <div className="w-4 h-4 border border-diamond-text/30 rounded-none bg-transparent peer-checked:bg-diamond-text peer-checked:border-diamond-text transition-colors group-hover:border-diamond-text" />
                                            <svg className="absolute w-3 h-3 text-diamond-bg opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        <span className="text-sm tracking-wide text-diamond-text/70 group-hover:text-diamond-text transition-colors uppercase font-medium">{metal}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            className="w-full text-xs uppercase tracking-[0.2em] py-3 text-diamond-text/50 hover:text-diamond-text border border-diamond-accent/20 hover:border-diamond-text transition-all duration-300"
                            onClick={() => {
                                setPriceRange(500000);
                                setSelectedShapes([]);
                                setSelectedMetals([]);
                            }}
                        >
                            Reset Preferences
                        </button>
                    </FadeIn>
                </aside>

                {/* Right Content - Elegant Product Grid */}
                <section className="flex-1">
                    <FadeIn delay={0.2}>
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="animate-pulse bg-diamond-accent/10 h-[450px] w-full"></div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-32 flex flex-col items-center justify-center h-[50vh] border border-diamond-accent/10">
                                <Diamond className="w-12 h-12 text-diamond-accent/40 mb-6 stroke-[1]" />
                                <p className="text-diamond-text/50 tracking-widest uppercase font-medium">
                                    No signature pieces match your selection.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
                                {products.map((product, i) => {
                                    let parsedImages: string[] = [];
                                    try {
                                        if (typeof product.images === "string") {
                                            parsedImages = JSON.parse(product.images);
                                        } else if (Array.isArray(product.images)) {
                                            parsedImages = product.images;
                                        }
                                    } catch (e) { console.log("Error parsing images", e); }
                                    const image = parsedImages.length > 0 ? parsedImages[0] : "";

                                    return (
                                        <FadeIn key={product.id} delay={i * 0.1}>
                                            <Link href={`/product/${product.slug}`} className="group block text-center">
                                                <div className="relative overflow-hidden aspect-[4/5] bg-diamond-bg mb-6 transition-all duration-700">
                                                    {image ? (
                                                        <Image
                                                            src={image}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover transition-transform duration-[2000ms] group-hover:scale-[1.05]"
                                                        />
                                                    ) : (
                                                        <Image 
                                                            src="/products/ring-1.jpg" 
                                                            alt={product.name} 
                                                            fill 
                                                            className="object-cover transition-transform duration-[2000ms] group-hover:scale-[1.05]" 
                                                        />
                                                    )}

                                                    {/* Strict minimal overlay hover */}
                                                    <div className="absolute inset-0 bg-diamond-text/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                                </div>

                                                <div className="px-2 flex flex-col items-center">
                                                    <h3 className="text-base text-diamond-text mb-3 font-heading tracking-wide transform transition-transform duration-500 group-hover:-translate-y-1 line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                    <p className="font-medium text-sm text-diamond-text/70 tracking-widest">
                                                        ₹{product.price.toLocaleString("en-IN")}
                                                    </p>
                                                </div>
                                            </Link>
                                        </FadeIn>
                                    );
                                })}
                            </div>
                        )}
                    </FadeIn>
                </section>
            </div>
        </div>
    );
}

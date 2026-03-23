"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DualRangeSlider } from "@/components/DualRangeSlider";
import { Button } from "@/components/Button";
import { Skeleton } from "@/components/Skeleton";
import type { Diamond } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomizerStore } from "@/lib/customizer-store";
import { toast } from "sonner";

// Formatter for ₹ Currency
const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
};

export function DiamondSearchClient({ customizerMode = false }: { customizerMode?: boolean }) {
    const router = useRouter();
    const setDiamondStore = useCustomizerStore((state) => state.setDiamond);

    // Data States
    const [diamonds, setDiamonds] = useState<Diamond[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    // Filter States
    const [priceRange, setPriceRange] = useState<[number, number]>([10000, 2000000]);
    const [caratRange, setCaratRange] = useState<[number, number]>([0.2, 10]);

    const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
    const [selectedCuts, setSelectedCuts] = useState<string[]>([]);
    const [selectedClarities, setSelectedClarities] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedCerts, setSelectedCerts] = useState<string[]>([]);

    // Filter Options
    const shapes = ['Round', 'Oval', 'Princess', 'Emerald', 'Cushion'];
    const cuts = ['Excellent', 'Very Good', 'Good'];
    const clarities = ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
    const colors = ['D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const certs = ['IGI', 'GIA'];

    useEffect(() => {
        const fetchDiamonds = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: '20',
                    minPrice: priceRange[0].toString(),
                    maxPrice: priceRange[1].toString(),
                    minCarat: caratRange[0].toString(),
                    maxCarat: caratRange[1].toString(),
                });

                if (selectedShapes.length > 0) params.append('shapes', selectedShapes.join(','));
                if (selectedCuts.length > 0) params.append('cuts', selectedCuts.join(','));
                if (selectedClarities.length > 0) params.append('clarities', selectedClarities.join(','));
                if (selectedColors.length > 0) params.append('colors', selectedColors.join(','));
                if (selectedCerts.length > 0) params.append('certs', selectedCerts.join(','));

                const response = await fetch(`/api/diamonds?${params.toString()}`);
                if (response.ok) {
                    const data = await response.json();
                    setDiamonds(data.diamonds);
                    setTotalCount(data.totalCount);
                    setTotalPages(data.totalPages);
                }
            } catch (error) {
                console.error("Failed to fetch diamonds", error);
            } finally {
                setIsLoading(false);
            }
        };

        const handler = setTimeout(() => {
            fetchDiamonds();
        }, 300); // 300ms debounce
        return () => clearTimeout(handler);
    }, [priceRange, caratRange, selectedShapes, selectedCuts, selectedClarities, selectedColors, selectedCerts, page]);

    const handleSelectDiamond = (diamond: Diamond) => {
        sessionStorage.setItem('selectedDiamond', JSON.stringify(diamond));

        if (customizerMode) {
            setDiamondStore(diamond);
            toast.success("Diamond Selected Successfully!");
            router.push('/customizer/step-3-metal');
        } else {
            router.push('/ring-settings');
        }
    };

    const toggleFilter = (stateSetter: React.Dispatch<React.SetStateAction<string[]>>, options: string[], value: string) => {
        stateSetter(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
    };

    const resetFilters = () => {
        setPriceRange([10000, 2000000]);
        setCaratRange([0.2, 10]);
        setSelectedShapes([]);
        setSelectedCuts([]);
        setSelectedClarities([]);
        setSelectedColors([]);
        setSelectedCerts([]);
        setPage(1);
    };

    return (
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-8 bg-diamond-bg text-diamond-text font-body">

            {/* STICKY SIDEBAR */}
            <aside className="w-full lg:w-80 flex-shrink-0">
                <div className="sticky top-24 bg-white border border-gray-200 p-6 shadow-sm rounded-none space-y-8 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-heading text-[#111111] tracking-wide font-semibold">Filters</h2>
                        <button onClick={resetFilters} className="text-sm font-semibold text-gray-500 hover:text-black transition-colors uppercase tracking-widest">
                            Reset All
                        </button>
                    </div>

                    {/* Price Slider */}
                    <div>
                        <h3 className="text-sm font-bold uppercase text-gray-800 tracking-wider mb-4 border-t border-gray-100 pt-6">Price Range</h3>
                        <DualRangeSlider
                            min={10000}
                            max={2000000}
                            step={10000}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            formatValue={formatPrice}
                        />
                    </div>

                    {/* Carat Slider */}
                    <div>
                        <h3 className="text-sm font-bold uppercase text-gray-800 tracking-wider mb-4 border-t border-gray-100 pt-6">Carat</h3>
                        <DualRangeSlider
                            min={0.2}
                            max={10}
                            step={0.1}
                            value={caratRange}
                            onValueChange={setCaratRange}
                            formatValue={(v) => `${v.toFixed(2)} CT`}
                        />
                    </div>

                    {/* Shape Toggle */}
                    <div className="border-t border-gray-100 pt-6">
                        <FilterGroup title="Shape" options={shapes} selected={selectedShapes} onToggle={(val) => toggleFilter(setSelectedShapes, shapes, val)} />
                    </div>

                    {/* Cut Toggle */}
                    <div className="border-t border-gray-100 pt-6">
                        <FilterGroup title="Cut" options={cuts} selected={selectedCuts} onToggle={(val) => toggleFilter(setSelectedCuts, cuts, val)} />
                    </div>

                    {/* Clarity Toggle */}
                    <div className="border-t border-gray-100 pt-6">
                        <FilterGroup title="Clarity" options={clarities} selected={selectedClarities} onToggle={(val) => toggleFilter(setSelectedClarities, clarities, val)} />
                    </div>

                    {/* Color Toggle */}
                    <div className="border-t border-gray-100 pt-6">
                        <FilterGroup title="Color" options={colors} selected={selectedColors} onToggle={(val) => toggleFilter(setSelectedColors, colors, val)} />
                    </div>

                    {/* Certification Toggle */}
                    <div className="border-t border-gray-100 pt-6">
                        <FilterGroup title="Certification" options={certs} selected={selectedCerts} onToggle={(val) => toggleFilter(setSelectedCerts, certs, val)} />
                    </div>
                </div>
            </aside>

            {/* RESULTS SECTION */}
            <div className="flex-1">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-heading text-[#111111] font-semibold">Search Results</h2>
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-widest">{totalCount} Diamonds Found</span>
                </div>

                {/* GRID RESULTS */}
                <div className="w-full relative min-h-[400px]">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array(8).fill(0).map((_, i) => (
                                <div key={i} className="bg-white border text-center border-gray-200 rounded-none p-6 shadow-sm animate-pulse">
                                    <Skeleton className="h-40 w-full mb-6 rounded-none bg-gray-100" />
                                    <Skeleton className="h-4 w-3/4 mx-auto mb-3 bg-gray-200" />
                                    <Skeleton className="h-4 w-1/2 mx-auto mb-6 bg-gray-100" />
                                    <Skeleton className="h-10 w-full rounded-none bg-gray-200" />
                                </div>
                            ))}
                        </div>
                    ) : diamonds.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            <AnimatePresence>
                                {diamonds.map((diamond) => (
                                    <motion.div
                                        key={diamond.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        whileHover={{ y: -5 }}
                                        className="group bg-white border border-gray-200 rounded-none p-6 shadow-sm hover:shadow-xl hover:border-black/30 transition-all duration-300 flex flex-col items-center relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="relative w-32 h-32 mb-6 z-10">
                                            {/* Using diamond.imageUrl if available, otherwise fallback */}
                                            {diamond.imageUrl ? (
                                                <Image
                                                    src={diamond.imageUrl}
                                                    alt={diamond.shape}
                                                    fill
                                                    className="object-contain mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <Image
                                                    src="/products/loose-diamond.jpg"
                                                    alt={diamond.shape}
                                                    fill
                                                    className="object-contain mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-500"
                                                />
                                            )}
                                        </div>

                                        <h3 className="text-xl font-heading text-[#111111] mb-1 z-10 font-bold">{diamond.caratWeight.toFixed(2)} Carat {diamond.shape}</h3>
                                        <p className="text-base text-gray-800 mb-4 z-10 font-medium">{diamond.color} Color • {diamond.clarity} Clarity • {diamond.cut} Cut</p>

                                        <div className="flex justify-between items-center w-full mb-6 z-10">
                                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-sm tracking-widest">{diamond.certification}</span>
                                            <span className="text-lg font-bold text-[#111111]">{formatPrice(diamond.price)}</span>
                                        </div>

                                        <Button
                                            variant="outline"
                                            className="w-full z-10 hover:bg-black hover:text-white"
                                            onClick={() => handleSelectDiamond(diamond)}
                                        >
                                            Select Diamond
                                        </Button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-none border border-gray-200 border-dashed">
                            <h3 className="text-xl font-heading text-black mb-2">No Diamonds Found</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">We couldn&apos;t find any diamonds matching those exact specifications. Try broadening your filter criteria.</p>
                            <Button onClick={resetFilters} variant="filled">Reset All Filters</Button>
                        </div>
                    )}
                </div>

                {/* Pagination Placeholder if needed */}
                {!isLoading && totalPages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                        <span className="flex items-center px-4 text-sm font-medium text-gray-500 uppercase tracking-widest">Page {page} of {totalPages}</span>
                        <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Component for UI Filters
function FilterGroup({ title, options, selected, onToggle }: { title: string, options: string[], selected: string[], onToggle: (val: string) => void }) {
    return (
        <div>
            <h3 className="text-sm font-bold uppercase text-gray-800 tracking-wider mb-3">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => {
                    const isActive = selected.includes(opt);
                    return (
                        <button
                            key={opt}
                            onClick={() => onToggle(opt)}
                            className={`px-3 py-1.5 text-xs font-medium border transition-colors rounded-none tracking-widest ${isActive ? 'bg-[#111111] border-[#111111] text-white shadow-sm' : 'bg-white border-gray-300 text-gray-600 hover:border-black'}`}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

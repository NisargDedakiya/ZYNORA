/* eslint-disable */
"use client";

import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/Button";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Truck, RotateCcw } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useSession } from "next-auth/react";

export default function ProductClient({ product }: { product: any }) {
    const { addToCart } = useCart();
    const [activeTab, setActiveTab] = useState("specs");

    let parsedImages: string[] = [];
    try {
        if (typeof product.images === "string") {
            parsedImages = JSON.parse(product.images);
        } else if (Array.isArray(product.images)) {
            parsedImages = product.images;
        }
    } catch (e) {
        console.log("Error parsing images in product details", e);
    }
    const images = parsedImages.length > 0 ? parsedImages : [];

    const viewOptions = ["Image Gallery"];
    const [viewMode, setViewMode] = useState("Image Gallery");
    const [activeImage, setActiveImage] = useState(images.length > 0 ? images[0] : "");

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: images.length > 0 ? images[0] : ""
        });
    };

    return (
        <div className="bg-champagne-bg min-h-screen pb-32 font-body text-champagne-text selection:bg-champagne-accent/30">
            {/* Breadcrumb */}
            <div className="container-custom py-6 text-base text-champagne-text/70 tracking-widest uppercase font-medium">
                <span className="hover:text-champagne-text cursor-pointer transition-colors">Home</span> <span className="mx-2">/</span>
                <span className="hover:text-champagne-text cursor-pointer transition-colors">{product.category?.name || "Rings"}</span> <span className="mx-2">/</span>
                <span className="text-champagne-text">{product.name}</span>
            </div>

            <div className="container-custom flex flex-col lg:flex-row gap-16 mb-24 relative">
                {/* Left: Gallery (Sticky) */}
                <section className="flex-[1.2] lg:max-w-[55%] lg:sticky lg:top-28 lg:h-[calc(100vh-140px)] flex flex-col">
                    <div className="flex justify-center mb-6 gap-6">
                        {viewOptions.map(opt => (
                            <button
                                key={opt}
                                className={`text-xs uppercase tracking-[0.2em] font-bold pb-2 transition-all ${viewMode === opt ? "border-b-2 border-champagne-text text-champagne-text" : "text-champagne-text/40 hover:text-champagne-text"}`}
                                onClick={() => setViewMode(opt)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>

                    {viewMode === "Image Gallery" && (
                        <>
                            <FadeIn className="bg-[#E8E4D9] aspect-[4/4.5] lg:flex-1 relative overflow-hidden mb-6 group flex items-center justify-center rounded-none shadow-xl border border-champagne-accent/20 cursor-zoom-in">
                                {activeImage ? (
                                    <Image
                                        src={activeImage}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-[800ms] group-hover:scale-105 transform-origin-center"
                                    />
                                ) : (
                                    <Image
                                        src="/products/ring-1.jpg"
                                        alt="Jewelry Rendering"
                                        fill
                                        className="object-cover opacity-80 mix-blend-multiply"
                                    />
                                )}
                            </FadeIn>
                            {images.length > 0 && images[0] !== "" && (
                                <FadeIn delay={0.1} className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                    {images.map((img: string, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImage(img)}
                                            className={`w-[100px] h-[100px] shrink-0 relative rounded-none overflow-hidden transition-all duration-300 ${activeImage === img ? "border-2 border-champagne-text shadow-md opacity-100" : "border border-champagne-accent/30 opacity-60 hover:opacity-100 hover:border-champagne-text scale-95"}`}
                                        >
                                            <Image src={img} alt="thumbnail" fill className="object-cover" />
                                        </button>
                                    ))}
                                </FadeIn>
                            )}
                        </>
                    )}
                </section>

                {/* Right: Details (Scrollable Flow) */}
                <section className="flex-1 lg:max-w-[45%] pt-4 flex flex-col">
                    <FadeIn delay={0.2}>
                        <h1 className="text-4xl md:text-5xl leading-[1.2] text-champagne-text mb-6 font-heading tracking-wide">
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-6 mb-8 border-b border-champagne-accent/20 pb-8">
                            <span className="text-4xl font-bold font-body text-champagne-text">₹{product.price.toLocaleString("en-IN")}</span>
                            <span className="text-xs uppercase tracking-widest text-champagne-text/50 font-medium">Inclusive of all taxes</span>
                        </div>

                        <p className="text-[1.05rem] text-champagne-text/80 leading-relaxed mb-12 font-body font-light">
                            {product.description}
                        </p>

                        {/* Selectors */}
                        <div className="flex flex-col gap-6 mb-10">
                            <div className="w-full">
                                <label className="block text-sm uppercase tracking-widest text-champagne-text/80 mb-3 font-medium">Select Metal</label>
                                <div className="relative">
                                    <select className="w-full p-5 rounded-none border border-champagne-accent/30 bg-[#F4F1E9] text-champagne-text appearance-none focus:outline-none focus:border-champagne-text transition-colors cursor-pointer shadow-sm font-medium">
                                        <option>{product.metalType}</option>
                                        <option>18K Yellow Gold</option>
                                        <option>18K Rose Gold</option>
                                        <option>Platinum 950</option>
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-champagne-text pointer-events-none" size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="flex items-center gap-5 bg-[#F4F1E9] border-l-4 border-champagne-accent p-6 mb-12 shadow-sm relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-champagne-bg/50 to-transparent pointer-events-none" />
                            <div className="w-12 h-12 rounded-full border border-champagne-accent/30 flex items-center justify-center shrink-0 bg-champagne-bg">
                                <Truck className="text-champagne-accent" size={20} strokeWidth={1.5} />
                            </div>
                            <span className="text-[0.95rem] text-champagne-text/80 leading-snug font-light">
                                <strong className="block text-champagne-text tracking-wide font-medium mb-1 uppercase text-sm">Guaranteed Delivery</strong>
                                Delivered within 7-10 working days across India via insured shipping.
                            </span>
                        </div>

                        {/* Sticky Add to Cart Actions */}
                        <div className="flex flex-col gap-5 sticky bottom-10 z-40 bg-champagne-bg/90 backdrop-blur-md p-6 -mx-6 md:p-0 md:mx-0 md:bg-transparent rounded-none border-t border-champagne-accent/10 md:border-none shadow-[0_-10px_40px_rgba(248,245,240,0.8)] md:shadow-none">
                            <Button fullWidth onClick={handleAddToCart} className="py-5 shadow-xl text-[1rem]">
                                Add to Cart
                            </Button>
                            <Button variant="outline" fullWidth className="border-champagne-text text-champagne-text hover:bg-champagne-text hover:text-champagne-bg">
                                Book Video Consultation
                            </Button>
                        </div>
                    </FadeIn>
                </section>
            </div>

            {/* Product Specifications & Details Tabs */}
            <section className="max-w-[1100px] mx-auto pt-16 border-t border-champagne-accent/20 px-5">
                <FadeIn>
                    <div className="flex justify-center gap-12 border-b border-champagne-accent/10 mb-16">
                        <button
                            onClick={() => setActiveTab("specs")}
                            className={`pb-5 text-xl font-heading tracking-wide transition-colors relative ${activeTab === "specs" ? "text-champagne-text" : "text-champagne-text/40 hover:text-champagne-text/80"} ${activeTab === "specs" ? "after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-champagne-text" : ""}`}
                        >
                            Product Specifications
                        </button>
                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`pb-5 text-xl font-heading tracking-wide transition-colors relative ${activeTab === "reviews" ? "text-champagne-text" : "text-champagne-text/40 hover:text-champagne-text/80"} ${activeTab === "reviews" ? "after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-champagne-text" : ""}`}
                        >
                            Customer Reviews
                        </button>
                    </div>

                    <div className="animate-[fadeIn_0.5s_ease]">
                        {activeTab === "specs" && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[
                                    { label: "Diamond Shape", val: product.diamond?.shape || "Round" },
                                    { label: "Carat Weight", val: `${product.diamond?.caratWeight || "1.00"} CT` },
                                    { label: "Cut", val: product.diamond?.cut || "Excellent" },
                                    { label: "Clarity", val: product.diamond?.clarity || "VVS1" },
                                    { label: "Color", val: product.diamond?.color || "E - F" },
                                    { label: "Certification", val: product.diamond?.certification || "GIA / IGI Certified" },
                                    { label: "Gold Purity", val: product.metalType },
                                ].map((row, i) => (
                                    <div key={i} className="bg-[#F4F1E9] p-6 rounded-none border border-champagne-accent/20 flex flex-col justify-center items-center text-center hover:bg-[#E8E4D9] transition-colors duration-400">
                                        <span className="text-[10px] text-champagne-text/60 uppercase tracking-widest font-bold mb-3">{row.label}</span>
                                        <span className="text-lg text-champagne-text font-heading">{row.val}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="text-center py-10 max-w-[800px] mx-auto">
                                <h3 className="text-6xl font-heading text-champagne-text mb-4 tracking-wide">4.9</h3>
                                <div className="flex justify-center gap-2 text-champagne-accent mb-4 w-40 mx-auto opacity-80">
                                    <StarIcon /> <StarIcon /> <StarIcon /> <StarIcon /> <StarIcon />
                                </div>
                                <p className="text-champagne-text/70 text-base mb-16 uppercase tracking-widest font-medium">Based on 24 reviews</p>

                                <div className="text-left border-t border-champagne-accent/20 pt-10 pb-8">
                                    <div className="flex gap-2 text-champagne-accent mb-4 w-24 opacity-80"><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>
                                    <h4 className="text-2xl text-champagne-text mb-3 font-heading tracking-wide">Absolutely Stunning</h4>
                                    <p className="text-champagne-text/80 mb-4 leading-relaxed font-light">The ring is even more beautiful in person. The craftsmanship is flawless, and the diamond sparkles incredibly.</p>
                                    <p className="text-sm text-champagne-text/60 uppercase tracking-widest font-medium">Anjali S. — October 12, 2023</p>
                                </div>

                                <div className="mt-10">
                                    <ReviewForm productId={product.id} />
                                </div>
                            </div>
                        )}
                    </div>
                </FadeIn>
            </section>
        </div>
    );
}

function ReviewForm({ productId }: { productId: string }) {
    const { data: session } = useSession();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, rating, comment })
            });
            alert("Review submitted successfully");
            setComment("");
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!session) {
        return <div className="mt-12 py-8 border-t border-champagne-accent/20 text-champagne-text/70 tracking-widest uppercase text-base text-center font-medium">Please login to write a review.</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="mt-12 pt-10 border-t border-champagne-accent/20 text-left max-w-[600px] mx-auto">
            <h4 className="text-2xl font-heading text-champagne-text mb-8">Write a Review</h4>
            <div className="mb-6">
                <label className="block text-sm uppercase tracking-widest text-champagne-text/80 mb-3 font-medium">Rating</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full max-w-[200px] p-4 rounded-none border border-champagne-accent/30 text-champagne-text appearance-none bg-[#F4F1E9] focus:outline-none focus:border-champagne-text transition-colors cursor-pointer font-medium">
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>
            <div className="mb-8">
                <label className="block text-sm uppercase tracking-widest text-champagne-text/80 mb-3 font-medium">Review</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    className="w-full p-5 rounded-none border border-champagne-accent/30 bg-[#F4F1E9] text-champagne-text focus:outline-none focus:border-champagne-text transition-colors resize-none placeholder:text-champagne-text/30"
                    placeholder="Share your experience..."
                />
            </div>
            <Button disabled={isSubmitting} className="w-full md:w-auto">{isSubmitting ? "Submitting..." : "Submit Review"}</Button>
        </form>
    );
}

function StarIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
        </svg>
    );
}

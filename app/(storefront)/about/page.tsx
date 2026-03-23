import { FadeIn } from "@/components/FadeIn";
import { AnimatedText } from "@/components/AnimatedText";
import { Button } from "@/components/Button";
import Link from "next/link";
import { ShieldCheck, Sparkles, Gem, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | ZYNORA LUXE",
    description: "Where timeless elegance meets exceptional craftsmanship. Discover the story, values, and uncompromising quality of ZYNORA LUXE.",
};

export default function AboutPage() {
    return (
        <div className="flex flex-col w-full -mt-24 bg-champagne-bg font-body text-champagne-text selection:bg-champagne-accent/30">
            {/* SECTION 1 — ABOUT HERO */}
            <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-champagne-bg border-b border-champagne-accent/20">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/about3.jpg"
                        alt="ZYNORA LUXE High Jewelry"
                        fill
                        className="object-cover opacity-30 mix-blend-multiply"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-champagne-bg via-champagne-bg/50 to-champagne-bg/10" />
                </div>

                <div className="container-custom relative z-10 text-center px-4 max-w-4xl mt-24">
                    <FadeIn delay={0.2} className="inline-block w-full">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading md:leading-[1.1] tracking-wide mb-6">
                            <AnimatedText text="About" variant="letter" delay={0.4} /> <br className="md:hidden" /> 
                            <AnimatedText text="ZYNORA LUXE" variant="letter" delay={1.0} />
                        </h1>
                    </FadeIn>
                    <div className="inline-block max-w-2xl mx-auto text-lg md:text-2xl text-champagne-text/80 font-body font-light tracking-wide leading-relaxed">
                        <AnimatedText text="Where timeless elegance meets exceptional craftsmanship." variant="fade" delay={1.6} />
                    </div>
                </div>
            </section>

            {/* SECTION 2 — BRAND STORY */}
            <section className="py-24 md:py-32 bg-[#F4F1E9] relative border-b border-champagne-accent/10">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
                        <div className="w-full lg:w-1/2 relative order-2 lg:order-1">
                            <FadeIn delay={0.2} className="relative aspect-[4/5] w-full max-w-[550px] shadow-xl rounded-none overflow-hidden mx-auto lg:mx-0">
                                <Image
                                    src="/images/about1.jpg"
                                    alt="Brand Aesthetic"
                                    fill
                                    className="object-cover transition-transform duration-[2000ms] hover:scale-105"
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-champagne-accent/20 pointer-events-none" />
                            </FadeIn>
                        </div>

                        <div className="w-full lg:w-1/2 order-1 lg:order-2">
                            <FadeIn delay={0.3}>
                                <span className="text-champagne-accent uppercase tracking-[0.2em] text-xs font-bold mb-4 block">
                                    <AnimatedText text="Heritage" variant="slide-up" delay={0.2} />
                                </span>
                                <h2 className="text-4xl md:text-5xl font-heading tracking-wide mb-8">
                                    <AnimatedText text="Our Story" variant="word" delay={0.4} />
                                </h2>
                                <div className="space-y-6 text-champagne-text/80 font-body text-base md:text-lg leading-loose font-light">
                                    <p>
                                        Born from a profound vision of absolute excellence, ZYNORA LUXE was established to redefine the boundaries of high-end diamond jewelry. Our foundation is built upon decades of generational expertise in sourcing the rarest gems on earth.
                                    </p>
                                    <p>
                                        We are inspired by timeless royalty, carefully blending historic heritage with cutting-edge modern innovation. Every facet, every setting, and every curve is meticulously designed to reflect light with unparalleled brilliance. Our uncompromising dedication to quality has positioned ZYNORA LUXE as a beacon of enduring luxury.
                                    </p>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3 — CRAFTSMANSHIP */}
            <section className="py-24 md:py-32 bg-champagne-bg relative">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
                        <div className="w-full lg:w-1/2">
                            <FadeIn delay={0.2}>
                                <span className="text-champagne-accent uppercase tracking-[0.2em] text-xs font-bold mb-4 block">The Artistry</span>
                                <h2 className="text-4xl md:text-5xl font-heading tracking-wide mb-8">
                                    Master Craftsmanship
                                </h2>
                                <div className="space-y-6 text-champagne-text/80 font-body text-base md:text-lg leading-loose font-light">
                                    <p>
                                        True luxury is defined by the unseen details. Handcrafted by master jewelers who bring decades of experience, every piece that bears the ZYNORA LUXE name is an immaculate work of art.
                                    </p>
                                    <p>
                                        From the initial sketch to the final polish, our artisans oversee each stage of creation. Utilizing micro-pavé techniques and precision prong settings engineered under extreme magnification, we ensure maximum light performance and structural security without compromising the delicate aesthetic of the design.
                                    </p>
                                </div>
                            </FadeIn>
                        </div>

                        <div className="w-full lg:w-1/2 relative">
                            <FadeIn delay={0.3} className="relative aspect-[4/3] w-full shadow-xl rounded-none overflow-hidden mx-auto">
                                <Image
                                    src="/images/about5.jpg"
                                    alt="Master Craftsmanship"
                                    fill
                                    className="object-cover transition-transform duration-[2000ms] hover:scale-105"
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-champagne-accent/20 pointer-events-none" />
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4 — DIAMOND QUALITY */}
            <section className="py-24 md:py-32 bg-[#2a2a2a] text-[#F8F5F0] relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/about5.jpg"
                        alt="Diamond Background"
                        fill
                        className="object-cover opacity-10 mix-blend-screen"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#2a2a2a]/80 via-[#2a2a2a]/95 to-[#2a2a2a]" />
                </div>

                <div className="container-custom relative z-10">
                    <div className="text-center mb-16 max-w-3xl mx-auto flex flex-col items-center">
                        <span className="text-[#F8F5F0]/50 uppercase tracking-[0.2em] text-xs font-bold mb-4 block">
                            <AnimatedText text="The Standard" variant="fade" delay={0.2} />
                        </span>
                        <h2 className="text-4xl md:text-5xl font-heading tracking-wide">
                            <AnimatedText text="Exceptional Diamonds" variant="letter" delay={0.4} duration={0.8} />
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
                        <FadeIn delay={0.2} className="p-8 border border-[#F8F5F0]/10 bg-[#F8F5F0]/5 backdrop-blur-sm shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-shadow duration-500">
                            <Gem className="w-10 h-10 mx-auto mb-6 text-[#F8F5F0]" strokeWidth={1} />
                            <h3 className="text-xl font-heading tracking-wide mb-4">Rigorous Selection</h3>
                            <p className="text-[#F8F5F0]/60 font-light text-sm leading-relaxed">
                                We reject 99% of the world's diamonds. Only those exhibiting absolute purity, ideal proportions, and flawless symmetry are chosen for our collections.
                            </p>
                        </FadeIn>
                        <FadeIn delay={0.3} className="p-8 border border-[#F8F5F0]/10 bg-[#F8F5F0]/5 backdrop-blur-sm">
                            <Sparkles className="w-10 h-10 mx-auto mb-6 text-[#F8F5F0]" strokeWidth={1} />
                            <h3 className="text-xl font-heading tracking-wide mb-4">Unmatched Brilliance</h3>
                            <p className="text-[#F8F5F0]/60 font-light text-sm leading-relaxed">
                                Our signature cut standards far exceed industry norms, extracting maximum fire, brilliance, and scintillation from the heart of the stone.
                            </p>
                        </FadeIn>
                        <FadeIn delay={0.4} className="p-8 border border-[#F8F5F0]/10 bg-[#F8F5F0]/5 backdrop-blur-sm">
                            <ShieldCheck className="w-10 h-10 mx-auto mb-6 text-[#F8F5F0]" strokeWidth={1} />
                            <h3 className="text-xl font-heading tracking-wide mb-4">Quality Standards</h3>
                            <p className="text-[#F8F5F0]/60 font-light text-sm leading-relaxed">
                                Every center diamond is independently graded by the most respected gemological laboratories and accompanied by full certification of its pedigree.
                            </p>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* SECTION 5 — BRAND VALUES */}
            <section className="py-24 md:py-32 bg-champagne-bg relative">
                <div className="container-custom">
                    <div className="text-center mb-20 max-w-3xl mx-auto flex flex-col items-center">
                        <span className="text-champagne-accent uppercase tracking-[0.2em] text-xs font-bold mb-4 block">
                            <AnimatedText text="Our Philosophy" variant="slide-up" delay={0.1} />
                        </span>
                        <h2 className="text-4xl md:text-5xl font-heading tracking-wide">
                            <AnimatedText text="Our Values" variant="word" delay={0.3} />
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Quality", desc: "Uncompromising standards in every material we select and every piece we finish." },
                            { title: "Authenticity", desc: "Transparent sourcing and genuine artistry behind every signature design." },
                            { title: "Innovation", desc: "Pushing the boundaries of traditional techniques to create something truly modern." },
                            { title: "Timeless Elegance", desc: "Designing heirloom pieces that remain breathtaking for generations to come." }
                        ].map((value, i) => (
                            <FadeIn key={value.title} delay={i * 0.15}>
                                <div className="h-full group p-10 bg-[#F4F1E9] border border-champagne-accent/20 transition-all duration-500 hover:bg-[#E8E4D9]">
                                    <div className="w-12 h-12 mb-6 border border-champagne-text flex items-center justify-center rounded-full mx-auto">
                                        <span className="text-champagne-text font-heading text-xl">{i + 1}</span>
                                    </div>
                                    <h3 className="text-2xl font-heading tracking-wide mb-4 text-center">
                                        {value.title}
                                    </h3>
                                    <p className="text-champagne-text/70 font-body font-light leading-relaxed text-sm text-center">
                                        {value.desc}
                                    </p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 6 — CLOSING STATEMENT */}
            <section className="py-32 md:py-40 bg-[#E8E4D9] text-center relative border-y border-champagne-accent/20">
                <div className="container-custom relative z-10 flex flex-col items-center">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading mb-14 tracking-wide leading-tight italic font-light relative max-w-4xl mx-auto">
                        <AnimatedText text='"At ZYNORA LUXE, every creation tells a story of elegance and enduring beauty."' variant="fade" delay={0.3} duration={1.2} />
                    </h2>
                    <FadeIn delay={1.0}>
                        <Link href="/shop">
                            <Button className="px-10 py-5 text-sm uppercase shadow-xl rounded-none flex items-center mx-auto gap-3">
                                Explore Our Collection
                                <ArrowRight size={18} />
                            </Button>
                        </Link>
                    </FadeIn>
                </div>
            </section>
        </div>
    );
}


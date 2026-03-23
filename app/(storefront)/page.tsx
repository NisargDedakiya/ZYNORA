import { FadeIn } from "@/components/FadeIn";
import { AnimatedText } from "@/components/AnimatedText";
import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    take: 4,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col w-full bg-[#0A0A0D] min-h-screen text-white overflow-hidden font-body selection:bg-white/20">

      {/* 1. HERO SECTION */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0D]">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/about1.jpg"
            alt="Cinematic Luxury Jewelry Background"
            fill
            priority
            className="object-cover opacity-40 scale-105 animate-[pulse_10s_ease-in-out_infinite] blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0D]/60 via-transparent to-[#0A0A0D]" />
        </div>

        <div className="relative z-10 container-custom flex flex-col items-center text-center mt-16">
          <FadeIn delay={0.2}>
            <Image 
              src="/assets/logo.png" 
              alt="ZYNORA LUXE" 
              width={240} 
              height={80} 
              className="object-contain brightness-0 invert mb-8 opacity-90 mx-auto" 
            />
          </FadeIn>
          
          <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-heading tracking-tight mb-6 leading-[1.1] font-light flex items-center justify-center gap-4">
            <AnimatedText text="Crafting" variant="word" delay={0.4} duration={0.8} />
            <span className="italic text-white/50">
                <AnimatedText text="Eternity." variant="letter" delay={0.6} duration={0.8} />
            </span>
          </h1>

          <div className="text-white/70 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed mb-12 tracking-wide flex justify-center text-center">
            <AnimatedText 
                text="Enter a world where heritage craftsmanship meets contemporary architectural design. Discover unparalleled brilliance tailored exclusively for you." 
                variant="fade" 
                delay={1.0} 
                duration={0.8} 
            />
          </div>
          
          <FadeIn delay={1.4} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center">
            <Link href="/customizer">
              <Button variant="outline" className="px-10 py-5 border-white text-white hover:bg-white hover:text-black transition-all duration-700 rounded-none uppercase tracking-widest text-sm w-full sm:w-auto">
                Customize Ring
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="filled" className="px-10 py-5 bg-white text-black border-none hover:bg-white/80 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-700 rounded-none uppercase tracking-widest text-sm w-full sm:w-auto">
                Shop Collection
              </Button>
            </Link>
          </FadeIn>
        </div>
        
        {/* Scroll Indicator */}
        <FadeIn delay={1.2} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </FadeIn>
      </section>

      {/* 2. CUSTOMIZE RING SECTION */}
      <section className="py-32 md:py-48 relative bg-[#0A0A0D] border-t border-white/5">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="w-full lg:w-1/2 relative aspect-[3/4] md:aspect-square flex justify-center items-center">
              <FadeIn className="absolute inset-0 w-full h-full p-8 md:p-0">
                <div className="relative w-full h-full outline outline-1 outline-white/10 p-4">
                  <Image
                    src="/images/about2.jpg"
                    alt="Design Your Perfect Ring"
                    fill
                    className="object-cover p-4 opacity-80 mix-blend-lighten"
                  />
                  <div className="absolute inset-0 bg-transparent shadow-[inset_0_0_100px_rgba(10,10,13,1)] pointer-events-none" />
                </div>
              </FadeIn>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-start z-10">
              <FadeIn>
                <div className="w-16 h-[1px] bg-white/30 mb-10" />
              </FadeIn>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading mb-8 leading-[1.1] text-white/90">
                <AnimatedText text="Design Your" variant="slide-up" delay={0.2} />
                <br />
                <span className="italic text-white">
                  <AnimatedText text="Perfect Ring." variant="slide-up" delay={0.4} />
                </span>
              </h2>
              
              <div className="space-y-12 mb-14 mt-12 w-full">
                {[
                  { title: "Choose Setting", desc: "Select from our curated array of luxury bands and iconic architectural silhouettes." },
                  { title: "Select Diamond", desc: "Browse ethically sourced, flawless center stones by cut, color, clarity, and carat." },
                  { title: "Preview in 3D", desc: "See your creation come to life in a stunning real-time 3D interactive preview." }
                ].map((step, idx) => (
                  <FadeIn key={idx} delay={0.2 + (idx * 0.15)} className="flex gap-8 items-start group w-full">
                    <span className="text-sm font-body text-white/30 tracking-[0.2em] pt-1 transition-colors duration-500 group-hover:text-white">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xl font-heading tracking-wide mb-3 text-white/90 group-hover:text-white transition-colors duration-500">{step.title}</h4>
                      <p className="text-white/50 font-light text-base md:text-lg max-w-sm leading-relaxed group-hover:text-white/80 transition-colors duration-500">{step.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>

                <Link href="/customizer">
                  <Button variant="outline" className="px-12 py-5 border-white/30 text-white hover:bg-white hover:text-black transition-all duration-700 rounded-none uppercase tracking-widest text-sm shadow-xl font-medium">
                    Start Designing
                  </Button>
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BUY DIAMOND SECTION */}
      <section className="py-32 md:py-48 relative bg-[#111114]">
        <div className="container-custom flex flex-col items-center">
          <div className="text-center mb-16 md:mb-24 flex flex-col items-center">
            <span className="text-sm uppercase tracking-[0.4em] font-medium text-white/40 block mb-6">
              <AnimatedText text="The Core Element" variant="fade" delay={0.1} />
            </span>
            <h2 className="text-5xl md:text-7xl font-heading text-white mb-8">
              <AnimatedText text="Raw Magnificence." variant="letter" delay={0.2} duration={0.6} />
            </h2>
            <div className="text-white/60 max-w-2xl mx-auto font-light leading-relaxed text-lg flex justify-center text-center">
              <AnimatedText 
                text="Each stone in our collection is meticulously inspected and ethically sourced, delivering unparalleled brilliance and clarity. Elevate your legacy." 
                variant="fade" 
                delay={0.6} 
              />
            </div>
          </div>

          <div className="relative w-full aspect-video md:aspect-[21/9] bg-[#0A0A0D] overflow-hidden group">
            <FadeIn className="w-full h-full absolute inset-0">
              <Image
                src="/images/about3.jpg"
                alt="Premium Loose Diamonds"
                fill
                className="object-cover transition-transform duration-[5000ms] ease-out group-hover:scale-105 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent pointer-events-none" />
            </FadeIn>
            <FadeIn className="absolute bottom-12 left-0 w-full flex justify-center z-10">
              <Link href="/diamonds">
                <Button variant="filled" className="px-12 py-5 bg-white text-black border-none hover:bg-white/90 hover:-translate-y-1 transition-all duration-500 rounded-none uppercase tracking-widest text-sm">
                  Browse Diamonds
                </Button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 4. BUY JEWELRY SECTION */}
      <section className="py-32 md:py-40 relative bg-[#0A0A0D]">
        <div className="container-custom flex flex-col items-center">
          <div className="w-full text-center mb-20 flex justify-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white mb-6">
              <AnimatedText text="Explore Fine Jewelry" variant="word" delay={0.2} />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
            {[
              {
                title: "Rings",
                src: "/products/ring-1.jpg"
              },
              {
                title: "Necklaces",
                src: "/products/necklace-1.jpg"
              },
              {
                title: "Earrings",
                src: "/products/earrings-1.jpg"
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.15} className="group relative w-full aspect-[4/5] overflow-hidden shadow-2xl bg-[#111114]">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-all duration-[2000ms] group-hover:scale-105 opacity-70 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-1000" />
                <div className="absolute inset-0 flex items-end justify-center pb-12">
                  <span className="text-white text-xl font-body tracking-[0.3em] uppercase opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:-translate-y-2 transform">
                    {item.title}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-20">
            <Link href="/shop">
               <span className="text-white/60 hover:text-white transition-colors duration-500 uppercase tracking-[0.2em] font-medium text-sm flex items-center gap-4 group cursor-pointer">
                  View Full Collection
                  <div className="w-12 h-[1px] bg-white/30 group-hover:bg-white group-hover:w-16 transition-all duration-500" />
               </span>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 5. BRAND STORY */}
      <section className="py-32 md:py-48 relative bg-[#111114]">
         <div className="container-custom max-w-5xl mx-auto text-center flex flex-col items-center">
            <FadeIn>
              <div className="w-[1px] h-24 bg-white/20 mx-auto mb-16" />
            </FadeIn>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading text-white/90 mb-12 leading-tight flex flex-col gap-4">
              <AnimatedText text='"Our pieces aren&apos;t just jewelry; they are architectural monuments worn on the body. A silent testament to' variant="fade" delay={0.2} />
              <span className="italic text-white">
                <AnimatedText text='devotion and artistry."' variant="slide-up" delay={0.6} />
              </span>
            </h2>
            <div className="text-white/50 text-lg md:text-xl font-light leading-relaxed mb-16 max-w-3xl mx-auto flex justify-center text-center">
              <AnimatedText 
                text="Founded on the principles of immaculate design and ethical sourcing, the Zynora Luxe atelier represents a new era of high jewelry. Every millimeter is calculated, every facet polished by artisans with decades of mastery." 
                variant="fade" 
                delay={1.0} 
              />
            </div>
            <FadeIn delay={1.4}>
              <Link href="/about">
                <Button variant="outline" className="px-12 py-5 border-white/20 text-white/80 hover:text-white hover:border-white transition-all duration-500 rounded-none uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  Discover Our Heritage
                </Button>
              </Link>
            </FadeIn>
         </div>
      </section>

      {/* 6. FEATURED PRODUCTS */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-24 md:py-40 relative bg-[#0A0A0D]">
          <div className="container-custom">
            <div className="flex justify-between items-end mb-20 border-b border-white/10 pb-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-heading text-white">
                  <AnimatedText text="Signature Series" variant="slide-up" delay={0.2} />
                </h2>
              </div>
              <FadeIn delay={0.4}>
                <Link href="/shop" className="hidden md:block text-white/60 hover:text-white transition-colors uppercase tracking-[0.2em] text-sm font-medium">
                    Explore All
                </Link>
              </FadeIn>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-x-12 md:gap-y-16">
              {featuredProducts.map((product, i) => {
                const images = JSON.parse((product as any).images || "[]");
                // REALISTIC IMAGE FALLBACK: Ensure an image is always shown, instead of text.
                const firstImage = (images && images.length > 0) ? images[0] : "/products/ring-1.jpg";
                const isEven = i % 2 === 0;

                return (
                  <FadeIn key={product.id} delay={i * 0.15} className={`group block h-full flex flex-col ${isEven ? 'md:mt-0' : 'md:mt-24'}`}>
                    <Link href={`/product/${(product as any).slug}`} className="h-full flex flex-col">
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#111114] mb-8 transition-all duration-700">
                        {firstImage && (
                          <Image
                            src={firstImage}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-[3000ms] group-hover:scale-105 opacity-80 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal"
                          />
                        )}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </div>
                      <div className="flex flex-col flex-1 items-center text-center">
                        <h3 className="text-lg md:text-xl font-heading text-white group-hover:text-white/70 transition-colors duration-500 mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-white/40 font-body text-sm tracking-[0.1em]">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </Link>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7. TESTIMONIALS */}
      <section className="py-32 md:py-40 relative bg-[#111114]">
        <div className="container-custom flex flex-col items-center">
          <div className="text-center mb-20 flex flex-col items-center">
            <span className="text-sm uppercase tracking-[0.4em] font-medium text-white/40 block mb-6">
              <AnimatedText text="Words Speak" variant="fade" delay={0.2} />
            </span>
            <h2 className="text-4xl md:text-5xl font-heading text-white">
              <AnimatedText text="Client Stories" variant="letter" delay={0.4} duration={0.8} />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              { text: "The bespoke process was entirely flawless. They materialized exactly what was in my mind into a physical piece of breathtaking art.", author: "ELEANOR V." },
              { text: "Uncompromising quality. The diamond selection guided by their experts surpassed every boutique I visited worldwide.", author: "JAMES M." },
              { text: "Every time I wear the signature necklace, I feel the weight of its craftsmanship. True modern heritage.", author: "SOPHIE T." }
            ].map((testimony, i) => (
              <FadeIn key={i} delay={i * 0.2} className="flex flex-col items-center text-center p-8 bg-[#0A0A0D] border border-white/5 shadow-2xl relative">
                <span className="text-5xl font-heading text-white/10 absolute top-4 left-6">"</span>
                <p className="text-white/70 font-light leading-relaxed mb-8 mt-6 relative z-10 italic">
                  "{testimony.text}"
                </p>
                <div className="w-8 h-[1px] bg-white/20 mb-6" />
                <span className="text-xs font-medium tracking-[0.2em] text-white/80 uppercase">{testimony.author}</span>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

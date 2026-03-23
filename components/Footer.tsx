import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-diamond-bg py-16 mt-20 border-t border-diamond-accent/10">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-20">
                    <div className="lg:col-span-2">
                        <Link href="/" className="logo text-diamond-text text-2xl tracking-wide block mb-4">
                            <Image src="/assets/logo.png" alt="ZYNORA LUXE" width={180} height={60} className="object-contain" style={{ filter: "invert(1)" }} />
                        </Link>
                        <p className="text-diamond-text/60 text-[0.95rem] font-heading italic mt-2">
                            India’s Trusted Diamond Destination.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-diamond-text font-heading uppercase tracking-[1.5px] mb-6 text-sm font-semibold">Shop</h4>
                        <ul className="space-y-4">
                            <li><Link href="/shop" className="text-diamond-text/70 text-sm hover:text-diamond-text transition-colors">Engagement Rings</Link></li>
                            <li><Link href="/shop" className="text-diamond-text/70 text-sm hover:text-diamond-text transition-colors">Wedding Bands</Link></li>
                            <li><Link href="/shop" className="text-diamond-text/70 text-sm hover:text-diamond-text transition-colors">Fine Jewelry</Link></li>
                            <li><Link href="/shop" className="text-diamond-text/70 text-sm hover:text-diamond-text transition-colors">Collections</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-diamond-text font-heading uppercase tracking-[1.5px] mb-6 text-sm font-semibold">About Us</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-diamond-text/70 text-sm hover:text-diamond-text transition-colors">Our Story</Link></li>
                            <li><Link href="/about" className="text-diamond-text/70 text-sm hover:text-diamond-text transition-colors">Craftsmanship</Link></li>
                            <li><Link href="/about" className="text-diamond-text/70 text-sm hover:text-diamond-text transition-colors">Sustainability</Link></li>
                            <li><Link href="/about" className="text-diamond-text/70 text-sm hover:text-diamond-text transition-colors">Stores</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-diamond-text font-heading uppercase tracking-[1.5px] mb-6 text-sm font-semibold">Customer Care</h4>
                        <ul className="space-y-4">
                            <li><Link href="/contact" className="text-diamond-text/70 text-sm hover:text-diamond-text transition-colors">Contact Us</Link></li>
                            <li><Link href="/shipping" className="text-diamond-text/70 text-sm hover:text-diamond-text transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/faq" className="text-diamond-text/70 text-sm hover:text-diamond-text transition-colors">FAQ</Link></li>
                            <li><Link href="/track" className="text-diamond-text/70 text-sm hover:text-diamond-text transition-colors">Track Order</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center border-t border-diamond-accent/10 pt-8 text-diamond-text/60 text-sm pb-8">
                    <p>&copy; {new Date().getFullYear()} ZYNORA LUXE India. All rights reserved.</p>
                    <div className="flex gap-5 mt-4 md:mt-0">
                        <a href="#" aria-label="Instagram" className="text-diamond-text/70 hover:text-diamond-text hover:-translate-y-0.5 transition-all"><Instagram size={20} strokeWidth={1.5} /></a>
                        <a href="#" aria-label="Facebook" className="text-diamond-text/70 hover:text-diamond-text hover:-translate-y-0.5 transition-all"><Facebook size={20} strokeWidth={1.5} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

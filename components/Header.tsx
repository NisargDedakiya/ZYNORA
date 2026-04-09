"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, User, ShoppingCart, LogOut, LayoutDashboard, Settings, ShoppingBag, Menu, X as XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { CartDrawer } from "./CartDrawer";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { toast } from "sonner";

const NAV_ITEMS = ["Shop", "Customize", "Diamonds", "About"];

export function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const lastYRef = useRef(0);
    const { scrollY } = useScroll();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { cartCount } = useCart();
    const pathname = usePathname();
    const { data: session, status } = useSession();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isMobileMenuOpen]);

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await signOut({ redirect: true, callbackUrl: "/" });
        toast.success("Logged out successfully");
    };

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
        if (latest > lastYRef.current && latest > 150) {
            setIsHidden(true);
        } else {
            setIsHidden(false);
        }
        lastYRef.current = latest;
    });

    const isHome = pathname === "/";
    const headerBgClass = isHome && !isScrolled 
        ? "bg-transparent border-transparent" 
        : "bg-[#0A0A0D]/95 backdrop-blur-md shadow-lg border-b border-white/5";

    return (
        <>
            <motion.header 
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-100%" }
                }}
                animate={isHidden && !isMobileMenuOpen ? "hidden" : "visible"}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`fixed top-0 left-0 w-full z-40 transition-colors duration-500 py-4 ${headerBgClass}`}
            >
                <div className="container-custom flex justify-between items-center">
                    {/* Left: Desktop Navigation */}
                    <nav className="flex-1 hidden md:flex items-center">
                        <ul className="flex gap-8">
                            {NAV_ITEMS.map((item) => {
                                const targetPath = item === "Home" ? "/" : `/${item.toLowerCase()}`;
                                const isActive = item === "Customize"
                                    ? pathname.startsWith("/customizer") || pathname === "/customize"
                                    : pathname === targetPath || pathname.startsWith(targetPath + "/");

                                return (
                                    <li key={item}>
                                        <Link
                                            href={targetPath}
                                            className={`text-[0.8rem] uppercase tracking-[0.15em] relative font-medium text-white/70 hover:text-white transition-colors after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:h-[1px] after:bg-white after:transition-all after:duration-500 ${isActive ? "after:w-full text-white" : "after:w-0 hover:after:w-full"}`}
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Mobile: Hamburger */}
                    <div className="flex-1 md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white/80 hover:text-white transition-colors p-1"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <XIcon size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
                        </button>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex-1 flex justify-center items-center">
                        <Link href="/" className="logo text-white text-2xl tracking-wide flex items-center transition-transform hover:scale-105 duration-500">
                            <Image src="/assets/logo.png" alt="ZYNORA LUXE" width={160} height={50} className="object-contain drop-shadow-sm brightness-0 invert" />
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex-1 flex justify-end gap-6 items-center">
                        <button aria-label="Search" className="text-white/70 hover:text-white transition-colors duration-300 hidden sm:block">
                            <Search size={18} strokeWidth={1.5} />
                        </button>

                        {/* Session Aware Identity Module */}
                        <div className="relative" ref={dropdownRef}>
                            {status === "loading" ? (
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center animate-pulse"></div>
                            ) : session?.user ? (
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-semibold transition-colors ${isDropdownOpen ? "border-white text-black bg-white" : "border-white/20 text-white bg-transparent hover:border-white hover:bg-white/10"
                                        }`}
                                >
                                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    aria-label="Account"
                                    className={`transition-colors duration-300 ${pathname === '/login' ? 'text-white' : 'text-white/70 hover:text-white'}`}
                                >
                                    <User size={18} strokeWidth={1.5} />
                                </Link>
                            )}

                            {/* Framer Motion Dropdown */}
                            <AnimatePresence>
                                {isDropdownOpen && session && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-none shadow-xl py-2 z-50 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{session.user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                                            {session.user.role === "ADMIN" && (
                                                <span className="inline-block mt-1 text-[10px] font-bold text-white bg-[#111111] px-2 py-0.5 rounded-none tracking-widest uppercase">
                                                    Administrator
                                                </span>
                                            )}
                                        </div>

                                        <div className="py-2">
                                            <Link href="/account" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors" onClick={() => setIsDropdownOpen(false)}>
                                                <Settings size={16} /> My Account
                                            </Link>
                                            <Link href="/orders" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors" onClick={() => setIsDropdownOpen(false)}>
                                                <ShoppingBag size={16} /> My Orders
                                            </Link>

                                            {session.user.role === "ADMIN" && (
                                                <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors border-t border-gray-100 mt-1 pt-3" onClick={() => setIsDropdownOpen(false)}>
                                                    <LayoutDashboard size={16} /> Admin Dashboard
                                                </Link>
                                            )}

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 mt-1 transition-colors"
                                            >
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            aria-label="Cart"
                            className="text-white/70 hover:text-white transition-colors duration-300 relative"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingCart size={18} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45"
                            style={{ zIndex: 45 }}
                        />
                        <motion.nav
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#0A0A0D] z-50 flex flex-col shadow-2xl"
                        >
                            {/* Mobile Menu Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <Image src="/assets/logo.png" alt="ZYNORA LUXE" width={120} height={40} className="object-contain brightness-0 invert" />
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/60 hover:text-white transition-colors p-1">
                                    <XIcon size={20} />
                                </button>
                            </div>

                            {/* Mobile Nav Links */}
                            <div className="flex-1 flex flex-col py-6">
                                {NAV_ITEMS.map((item, i) => {
                                    const targetPath = item === "Home" ? "/" : `/${item.toLowerCase()}`;
                                    const isActive = item === "Customize"
                                        ? pathname.startsWith("/customizer") || pathname === "/customize"
                                        : pathname === targetPath;

                                    return (
                                        <motion.div
                                            key={item}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.05 }}
                                        >
                                            <Link
                                                href={targetPath}
                                                className={`block px-8 py-4 text-sm uppercase tracking-[0.2em] font-medium transition-colors ${
                                                    isActive
                                                        ? "text-white bg-white/5 border-l-2 border-white"
                                                        : "text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                                                }`}
                                            >
                                                {item}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Mobile Menu Footer */}
                            <div className="p-6 border-t border-white/10 space-y-3">
                                {session?.user ? (
                                    <>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-bold">
                                                {session.user.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium truncate">{session.user.name}</p>
                                                <p className="text-white/40 text-xs truncate">{session.user.email}</p>
                                            </div>
                                        </div>
                                        {session.user.role === "ADMIN" && (
                                            <Link href="/admin" className="block text-center w-full py-2.5 text-xs uppercase tracking-widest font-bold border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors">
                                                Admin Dashboard
                                            </Link>
                                        )}
                                    </>
                                ) : (
                                    <Link href="/login" className="block text-center w-full py-2.5 text-xs uppercase tracking-widest font-bold border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors">
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { LayoutDashboard, Gem, Settings2, ShoppingBag, Users, LogOut, BarChart } from "lucide-react";

const adminNav = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Diamonds", href: "/admin/diamonds", icon: Gem },
    { name: "Ring Settings", href: "/admin/ring-settings", icon: Settings2 },
    { name: "Products", href: "/admin/products", icon: Gem },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 font-body">Loading secure portal...</div>;
    }

    if (!session || session.user.role !== "ADMIN") {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500 font-body">Access Denied. Admins Only.</div>;
    }

    const currentRouteName = adminNav.find(item => item.href === pathname)?.name || "Admin Panel";

    return (
        <div className="flex h-screen bg-[#F4F1E9]/30 overflow-hidden font-body text-gray-800">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm flex-shrink-0 z-20 transition-all duration-300">
                {/* Brand Area */}
                <div className="h-20 flex flex-col justify-center items-center border-b border-gray-100">
                    <Link href="/admin" className="text-xl font-heading text-[#111111] tracking-[0.2em] flex flex-col items-center" style={{ filter: "invert(1)" }}>
                        <Image src="/assets/logo.png" alt="ZYNORA LUXE" width={100} height={30} className="object-contain" />
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-8 px-5 flex flex-col gap-2 custom-scrollbar">
                    {adminNav.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-none transition-all duration-300 ${isActive
                                    ? "bg-[#111111] text-white font-bold shadow-md"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-[#111111]"
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                                <span className="text-[0.9rem] tracking-widest uppercase">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Logout Area */}
                <div className="p-5 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-xs uppercase tracking-widest font-bold text-gray-500 rounded-none hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 transition-all"
                    >
                        <LogOut size={16} />
                        Secure Logout
                    </button>
                    <div className="text-center mt-5 mb-2">
                        <Link href="/" className="text-[10px] text-gray-400 hover:text-[#111111] transition-colors uppercase tracking-[0.2em]">➔ Back to Store</Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Background Details */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent pointer-events-none z-0" />

                {/* Top Admin Header */}
                <header className="h-20 bg-white/90 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-10 flex-shrink-0 shadow-sm z-10 sticky top-0">
                    <h1 className="text-2xl font-heading text-[#111111] font-semibold tracking-wide">{currentRouteName}</h1>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 border-r border-gray-200 pr-6">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#111111] font-bold text-sm uppercase border border-gray-200 shadow-sm">
                                {session.user.name?.[0] || 'A'}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-bold tracking-wide text-[#111111]">{session.user.name}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{session.user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-none transition-all"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Scrollable Content Pane */}
                <main className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar z-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

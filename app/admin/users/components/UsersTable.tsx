/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Search, ChevronLeft, ChevronRight, Ban, CheckCircle, ShieldCheck, Eye, X, Package } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export function UsersTable({ initialUsers }: { initialUsers: any[] }) {
    const [users, setUsers] = useState(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    // Filter and Pagination logic
    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        const q = searchQuery.toLowerCase();
        return users.filter(u =>
            (u.name && u.name.toLowerCase().includes(q)) ||
            (u.email && u.email.toLowerCase().includes(q))
        );
    }, [users, searchQuery]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const currentUsers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const toggleAccess = async (id: string, currentRole: string) => {
        const newRole = currentRole === "BANNED" ? "USER" : "BANNED";
        if (!confirm(`Are you sure you want to ${newRole === "BANNED" ? "disable" : "enable"} this user?`)) return;

        try {
            const res = await fetch(`/api/admin/users`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, role: newRole })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`User is now ${newRole}`);
                setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
            } else { toast.error(data.error || "Update failed"); }
        } catch { toast.error("Error updating user"); }
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex justify-between items-center bg-white  border border-gray-100 p-4 rounded-none shadow-sm">
                <div className="relative max-w-sm w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-12 pr-4 py-3 w-full bg-gray-50 border border-gray-200 rounded-none text-sm text-[#111111] placeholder-soft-cream/30 focus:ring-2 focus:ring-gray-200 focus:border-[#111111] outline-none transition-all shadow-none"
                    />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold px-4">
                    Total Users: <span className="text-[#111111] text-sm ml-1">{filteredUsers.length}</span>
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto bg-white  border border-gray-100 shadow-sm rounded-none pb-4">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-widest text-gray-400">
                            <th className="p-5 font-bold">User details</th>
                            <th className="p-5 font-bold">Joined Date</th>
                            <th className="p-5 font-bold">Orders</th>
                            <th className="p-5 font-bold">LTV (Lifetime Val)</th>
                            <th className="p-5 font-bold">Status</th>
                            <th className="p-5 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {currentUsers.length === 0 ? (
                            <tr><td colSpan={6} className="p-10 text-center text-gray-400 text-xs uppercase tracking-widest font-bold">No users found.</td></tr>
                        ) : currentUsers.map((user) => {
                            const paidOrders = user.orders?.filter((o: any) => o.status !== "CANCELLED") || [];
                            const ltv = paidOrders.reduce((acc: number, o: any) => acc + (o.totalAmount || 0), 0);
                            return (
                                <tr key={user.id} className="hover:bg-gray-100 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gold/10 border border-gray-300 flex items-center justify-center text-[#111111] font-body font-bold text-lg shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                                                {user.name ? user.name.charAt(0).toUpperCase() : "G"}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#111111] tracking-wide">{user.name || "Guest"}</p>
                                                <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-1">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm text-gray-700">
                                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                                    </td>
                                    <td className="p-5 text-sm text-gray-700">
                                        <span className="inline-flex items-center justify-center bg-gray-50 border border-gray-200 text-[#111111] text-xs font-bold px-3 py-1.5 rounded-none min-w-[32px]">
                                            {user.orders?.length || 0}
                                        </span>
                                    </td>
                                    <td className="p-5 font-bold font-body text-[#111111] tracking-wide text-lg">
                                        ₹{ltv.toLocaleString("en-IN")}
                                    </td>
                                    <td className="p-5">
                                        {user.role === "ADMIN" ? (
                                            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold px-3 py-1.5 rounded-full border bg-gold/10 text-[#111111] border-gray-300 uppercase tracking-[0.15em]">
                                                <ShieldCheck size={12} /> Admin
                                            </span>
                                        ) : user.role === "BANNED" ? (
                                            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold px-3 py-1.5 rounded-full border bg-gray-50 text-gray-400 border-gray-200 uppercase tracking-[0.15em]">
                                                <Ban size={12} /> Banned
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold px-3 py-1.5 rounded-full border bg-soft-cream/10 text-[#111111] border-soft-cream/20 uppercase tracking-[0.15em]">
                                                <CheckCircle size={12} /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-5 text-right space-x-3">
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="text-[#111111] bg-[#111111] hover:bg-gold/10 transition-all inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-none border border-transparent shadow-[0_0_10px_rgba(212,175,55,0.1)] hover:shadow-md"
                                        >
                                            <Eye size={14} /> View
                                        </button>

                                        {user.role !== "ADMIN" && (
                                            <button
                                                onClick={() => toggleAccess(user.id, user.role)}
                                                className={`text-[10px] uppercase tracking-widest font-bold inline-flex items-center transition-colors px-3 py-2 rounded-none border opacity-80 hover:opacity-100 ${user.role === "BANNED" ? "text-[#111111] border-gray-300 hover:bg-gold/10" : "text-gray-500 border-gray-200 hover:bg-gray-100"}`}
                                            >
                                                {user.role === "BANNED" ? "Enable" : "Disable"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            Showing <span className="text-gray-800">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-gray-800">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span> of <span className="text-gray-800">{filteredUsers.length}</span> users
                        </span>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-none border border-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 hover:text-[#111111] transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="text-xs font-bold font-body text-[#111111] px-5 py-2 bg-gray-50 border border-gray-200 rounded-none shadow-none flex items-center">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-none border border-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 hover:text-[#111111] transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ORDER HISTORY SLIDE OUT DRAWER */}
            {selectedUser && (
                <>
                    <div className="fixed inset-0 bg-gray-50/60 backdrop-blur-sm z-40 transition-opacity animate-in fade-in" onClick={() => setSelectedUser(null)} />
                    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white  shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-50 transform transition-transform duration-300 flex flex-col border-l border-gray-200 animate-in slide-in-from-right">
                        <header className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gold/10 border border-gray-300 flex items-center justify-center text-[#111111] font-body font-bold text-xl shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                                    {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : "G"}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-heading tracking-wide text-[#111111]">{selectedUser.name || "Guest User"}</h3>
                                    <p className="text-[10px] uppercase tracking-widest font-mono text-gray-400 mt-1.5">{selectedUser.email}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedUser(null)} className="p-2 text-gray-400 hover:text-[#111111] hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#111111] mb-5 border-b border-gray-100 pb-2">Order History</h4>

                            <div className="space-y-4">
                                {selectedUser.orders && selectedUser.orders.length > 0 ? (
                                    selectedUser.orders.map((order: any) => (
                                        <div key={order.id} className="bg-gray-50 border border-gray-200 rounded-none p-5 transition-all hover:border-gray-300 shadow-none group cursor-default">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">ID: {order.id.slice(-8).toUpperCase()}</p>
                                                    <p className="text-[0.95rem] font-bold font-body tracking-wide text-[#111111] group-hover:text-[#111111] transition-colors">₹{order.totalAmount?.toLocaleString("en-IN")}</p>
                                                </div>
                                                <span className={`text-[9px] font-bold px-3 py-1.5 rounded-none uppercase tracking-[0.15em] border ${order.status === "PAID" || order.status === "DELIVERED" ? "bg-soft-cream/10 text-[#111111] border-soft-cream/20" :
                                                    order.status === "CANCELLED" ? "bg-gray-50 text-gray-400 border-gray-200" :
                                                        "bg-gold/10 text-[#111111] border-gray-300"
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-[10px] uppercase font-bold tracking-widest text-gray-300 mt-3 pt-4 border-t border-gray-100">
                                                <Package size={14} className="text-[#111111]/20" />
                                                <span>Refer to Orders tab for details.</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-none border border-gray-100 border-dashed shadow-none">
                                        <Package className="mx-auto text-[#111111]/20 mb-3" size={32} />
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">No order history found for this user.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { X, Eye, FileText, Package, Truck, CheckCircle, Clock } from "lucide-react";

export function OrderTable({ initialOrders }: { initialOrders: any[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    const updateStatus = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                toast.success("Order status updated!");
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                if (selectedOrder && selectedOrder.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                }
            } else {
                toast.error("Failed to update status");
            }
        } catch {
            toast.error("Network error");
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "PAID": return "bg-gray-100 text-white border-gray-300";
            case "SHIPPED": return "bg-soft-cream/10 text-[#111111] border-soft-cream/20";
            case "DELIVERED": return "bg-[#111111] text-white border border-transparent";
            case "PENDING": return "bg-gold/10 text-[#111111] border-gray-300";
            default: return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PAID": return <CheckCircle size={16} />;
            case "SHIPPED": return <Truck size={16} />;
            case "DELIVERED": return <Package size={16} />;
            case "PENDING": return <Clock size={16} />;
            default: return null;
        }
    };

    const handlePrintInvoice = () => {
        toast.info("Invoice generation triggered.");
        window.print();
    };

    return (
        <div className="relative">
            <div className="w-full overflow-x-auto bg-white  border border-gray-100 shadow-sm rounded-none pb-4">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-widest text-gray-400">
                            <th className="p-5 font-bold">Order ID</th>
                            <th className="p-5 font-bold">Customer</th>
                            <th className="p-5 font-bold">Type</th>
                            <th className="p-5 font-bold">Date</th>
                            <th className="p-5 font-bold">Total</th>
                            <th className="p-5 font-bold">Status</th>
                            <th className="p-5 font-bold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.length === 0 ? (
                            <tr><td colSpan={7} className="p-10 text-center text-gray-400 text-xs uppercase tracking-widest font-bold">No orders found.</td></tr>
                        ) : orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-100 transition-colors">
                                <td className="p-5 font-mono text-xs text-gray-500 tracking-wider">{order.displayOrderId || order.id.slice(-8).toUpperCase()}</td>
                                <td className="p-5">
                                    <p className="font-bold text-[#111111] tracking-wide">{order.user?.name || "Guest"}</p>
                                    <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-widest">{order.user?.email}</p>
                                </td>
                                <td className="p-5">
                                    <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest border ${
                                        order.orderType === 'CUSTOM_RING'
                                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                                            : 'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>
                                        {order.orderType === 'CUSTOM_RING' ? 'Custom Ring' : 'Cart'}
                                    </span>
                                </td>
                                <td className="p-5 text-sm text-gray-700">
                                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                                </td>
                                <td className="p-5 font-bold font-body text-[#111111] tracking-wide text-lg">
                                    ₹{order.totalAmount.toLocaleString("en-IN")}
                                </td>
                                <td className="p-5">
                                    <span className={`inline-flex items-center gap-2 text-[9px] font-bold px-3 py-1.5 rounded-full tracking-[0.15em] uppercase border ${getStatusStyle(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-5 text-right">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-[#111111] bg-[#111111] border border-transparent hover:bg-gold/10 transition-all inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-none shadow-[0_0_10px_rgba(212,175,55,0.1)] hover:shadow-md"
                                    >
                                        <Eye size={14} /> Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ORDER DETAIL SIDE DRAWER */}
            {selectedOrder && (
                <>
                    <div className="fixed inset-0 bg-gray-50/60 backdrop-blur-sm z-40 transition-opacity animate-in fade-in" onClick={() => setSelectedOrder(null)} />
                    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white  shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-50 transform transition-transform duration-300 flex flex-col border-l border-gray-200 animate-in slide-in-from-right">
                        <header className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50">
                            <div>
                                <h3 className="text-2xl font-heading tracking-wide text-[#111111]">Order Details</h3>
                                <p className="text-[10px] uppercase font-mono tracking-widest text-gray-400 mt-1.5">ID: {selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-[#111111] hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                            {/* Actions Group */}
                            <div className="bg-gray-50 p-5 rounded-none border border-gray-200 shadow-none flex flex-col gap-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Status Update</span>
                                    <select
                                        disabled={updatingId === selectedOrder.id}
                                        className={`text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-2 rounded-none outline-none border transition-colors cursor-pointer w-44 bg-gray-50 ${getStatusStyle(selectedOrder.status)}`}
                                        value={selectedOrder.status}
                                        onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="PAID">Paid</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                                <div className="flex justify-between items-center border-t border-gray-100 pt-5">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Documents</span>
                                    <button onClick={handlePrintInvoice} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold px-4 py-2.5 border border-gray-200 rounded-none hover:bg-gray-100 hover:text-[#111111] transition-colors text-gray-800">
                                        <FileText size={14} className="text-gray-400" /> Print Invoice
                                    </button>
                                </div>
                            </div>

                            {/* Customer & Shipping */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#111111] mb-3 border-b border-gray-100 pb-2">Customer Info</h4>
                                    <p className="text-sm font-bold text-[#111111] tracking-wide">{selectedOrder.user?.name || "Guest User"}</p>
                                    <p className="text-xs text-gray-600 mt-1">{selectedOrder.user?.email}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#111111] mb-3 border-b border-gray-100 pb-2">Shipping Detail</h4>
                                    <p className="text-sm font-bold text-[#111111] tracking-wide">{selectedOrder.shippingState || "Not provided"}</p>
                                    <p className="text-xs text-gray-600 mt-1">Date: {format(new Date(selectedOrder.createdAt), "dd MMM yyyy")}</p>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#111111] mb-4 border-b border-gray-100 pb-2">Payment Breakdown</h4>
                                <div className="space-y-3 mt-3">
                                    <div className="flex justify-between text-sm text-gray-700">
                                        <span>Subtotal</span>
                                        <span className="font-body text-[#111111]">₹{parseFloat(selectedOrder.subtotal || selectedOrder.totalAmount).toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-700">
                                        <span>Shipping</span>
                                        <span className="font-body text-[#111111]">₹{parseFloat(selectedOrder.shippingCost || 0).toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-700">
                                        <span>Taxes {selectedOrder.gstType ? `(${selectedOrder.gstType})` : ""}</span>
                                        <span className="font-body text-[#111111]">₹{parseFloat(selectedOrder.gstAmount || 0).toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-[#111111] pt-3 border-t border-gray-200 mt-3">
                                        <span>Total Paid</span>
                                        <span>₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</span>
                                    </div>
                                    {selectedOrder.razorpayId && (
                                        <div className="mt-5 pt-4 border-t border-gray-100 border-dashed text-[10px] tracking-widest uppercase text-[#111111] font-bold flex items-center justify-center gap-2">
                                            <CheckCircle size={14} /> Payment Verified via Razorpay
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#111111] mb-4 border-b border-gray-100 pb-2">Order Items</h4>
                                <div className="space-y-4 mt-4">
                                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item: any) => (
                                            <div key={item.id} className="flex gap-5 p-4 rounded-none border border-gray-200 bg-gray-50 shadow-none">
                                                <div className="w-16 h-16 bg-white border border-gray-100 rounded-none flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    <Package className="text-[#111111]/20" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[0.95rem] font-bold text-[#111111] tracking-wide truncate">
                                                        {item.product?.name || item.ringConfiguration?.setting?.name || "Custom Ring"}
                                                    </p>
                                                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1.5">Qty: {item.quantity}</p>
                                                    <p className="text-sm font-bold font-body text-[#111111] mt-1.5">₹{item.price.toLocaleString("en-IN")}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 italic text-center py-4">Pre-migration legacy order items.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}


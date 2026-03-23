/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Search, Edit2, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export function DiamondTable({ initialDiamonds }: { initialDiamonds: any[] }) {
    const [diamonds, setDiamonds] = useState(initialDiamonds);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Modal States
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Form States
    const [editingDiamond, setEditingDiamond] = useState<any | null>(null);
    const [diamondToDelete, setDiamondToDelete] = useState<any | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [modelFile, setModelFile] = useState<File | null>(null);
    const [modelName, setModelName] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        shape: "Round",
        caratWeight: "1.0",
        cut: "Excellent",
        clarity: "VS1",
        color: "G",
        certification: "GIA",
        price: "150000",
        imageUrl: "",
        modelUrl: ""
    });

    // Computed filtering and pagination
    const filteredDiamonds = useMemo(() => {
        if (!searchQuery) return diamonds;
        const q = searchQuery.toLowerCase();
        return diamonds.filter(d =>
            d.shape.toLowerCase().includes(q) ||
            d.id.toLowerCase().includes(q) ||
            d.color.toLowerCase().includes(q) ||
            d.clarity.toLowerCase().includes(q) ||
            d.certification.toLowerCase().includes(q)
        );
    }, [diamonds, searchQuery]);

    const totalPages = Math.ceil(filteredDiamonds.length / ITEMS_PER_PAGE);
    const currentDiamonds = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredDiamonds.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredDiamonds, currentPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const openAddModal = () => {
        setEditingDiamond(null);
        setImageFile(null);
        setImagePreview(null);
        setModelFile(null);
        setModelName("");
        setFormData({
            shape: "Round", caratWeight: "1.0", cut: "Excellent", clarity: "VS1", color: "G", certification: "GIA", price: "150000", imageUrl: "", modelUrl: ""
        });
        setIsAddEditModalOpen(true);
    };

    const openEditModal = (diamond: any) => {
        setEditingDiamond(diamond);
        setImageFile(null);
        setImagePreview(diamond.imageUrl || null);
        setModelFile(null);
        setModelName(diamond.modelUrl ? diamond.modelUrl.split('/').pop() : "");
        setFormData({
            shape: diamond.shape,
            caratWeight: diamond.caratWeight.toString(),
            cut: diamond.cut,
            clarity: diamond.clarity,
            color: diamond.color,
            certification: diamond.certification,
            price: diamond.price.toString(),
            imageUrl: diamond.imageUrl || "",
            modelUrl: diamond.modelUrl || ""
        });
        setIsAddEditModalOpen(true);
    };

    const openDeleteModal = (diamond: any) => {
        setDiamondToDelete(diamond);
        setIsDeleteModalOpen(true);
    };

    const toggleStock = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "AVAILABLE" ? "SOLD" : "AVAILABLE";
        try {
            const res = await fetch(`/api/admin/diamonds/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stockStatus: newStatus })
            });
            if (res.ok) {
                toast.success(`Marked as ${newStatus}`);
                setDiamonds(diamonds.map(d => d.id === id ? { ...d, stockStatus: newStatus } : d));
            } else {
                toast.error("Failed to update stock");
            }
        } catch {
            toast.error("Network error");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate image type & size
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                toast.error("Invalid file type. Only JPG, PNG, and WebP are allowed.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size exceeds 5MB limit.");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData(prev => ({ ...prev, imageUrl: "" }));
    }

    const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const isAllowedModeType = file.name.toLowerCase().endsWith('.glb') || file.name.toLowerCase().endsWith('.gltf') || file.name.toLowerCase().endsWith('.obj');
        if (!isAllowedModeType) {
            toast.error("Invalid model type. Only .glb, .gltf, and .obj files are allowed.");
            return;
        }
        if (file.size > 30 * 1024 * 1024) {
            toast.error("Model size exceeds 30MB limit.");
            return;
        }
        setModelFile(file);
        setModelName(file.name);
    };

    const removeModel = () => {
        setModelFile(null);
        setModelName("");
        setFormData(prev => ({ ...prev, modelUrl: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsUploading(true);
            let uploadedImageUrl = formData.imageUrl;
            let uploadedModelUrl = formData.modelUrl;

            if (modelFile) {
                const modelUploadFormData = new FormData();
                modelUploadFormData.append("file", modelFile);
                modelUploadFormData.append("type", "diamonds");
                modelUploadFormData.append("kind", "model");

                const modelUploadRes = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: modelUploadFormData
                });

                const modelUploadData = await modelUploadRes.json();

                if (!modelUploadRes.ok) {
                    toast.error(modelUploadData.error || "Model upload failed");
                    setIsUploading(false);
                    return;
                }

                uploadedModelUrl = modelUploadData.url;
            }

            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", imageFile);
                uploadFormData.append("type", "diamonds");

                const uploadRes = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: uploadFormData
                });

                const uploadData = await uploadRes.json();

                if (!uploadRes.ok) {
                    toast.error(uploadData.error || "Image upload failed");
                    setIsUploading(false);
                    return;
                }

                uploadedImageUrl = uploadData.url;
            }

            const isEditing = !!editingDiamond;
            const url = isEditing ? `/api/admin/diamonds/${editingDiamond.id}` : `/api/admin/diamonds`;
            const method = isEditing ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    imageUrl: uploadedImageUrl,
                    modelUrl: uploadedModelUrl,
                    price: parseFloat(formData.price),
                    caratWeight: parseFloat(formData.caratWeight)
                })
            });
            const data = await res.json();

            if (res.ok) {
                toast.success(isEditing ? "Diamond updated" : "Diamond added successfully");
                if (isEditing) {
                    setDiamonds(diamonds.map(d => d.id === editingDiamond.id ? data.diamond || { ...d, ...formData, imageUrl: uploadedImageUrl, price: parseFloat(formData.price), caratWeight: parseFloat(formData.caratWeight) } : d));
                } else {
                    setDiamonds([data.diamond, ...diamonds]);
                }
                setIsAddEditModalOpen(false);
            } else {
                toast.error(data.error || "Operation failed");
            }
        } catch {
            toast.error("Network error");
        } finally {
            setIsUploading(false);
        }
    };

    const executeDelete = async () => {
        if (!diamondToDelete) {
            console.error("executeDelete called but diamondToDelete is null");
            return;
        }
        console.log("Delete diamond clicked, id:", diamondToDelete.id);
        try {
            const url = `/api/admin/diamonds/${diamondToDelete.id}`;
            console.log("Sending DELETE to:", url);
            const res = await fetch(url, { method: "DELETE" });
            console.log("Delete response status:", res.status);
            
            let data;
            try {
                data = await res.json();
            } catch (jsonErr) {
                console.error("Failed to parse response JSON:", jsonErr);
                const text = await res.text().catch(() => "(empty)");
                console.error("Raw response:", text);
                toast.error("Server returned invalid response");
                return;
            }
            
            console.log("Delete response data:", data);
            if (res.ok) {
                toast.success("Diamond deleted");
                setDiamonds(prev => prev.filter(d => d.id !== diamondToDelete.id));
                setIsDeleteModalOpen(false);
                setDiamondToDelete(null);
            } else {
                toast.error(data.error || "Failed to delete");
            }
        } catch (err) {
            console.error("Delete diamond error:", err);
            toast.error("Network error");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search shape, color, clarity, ID..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-11 pr-4 py-3 w-full bg-white text-[#111111] border border-gray-200 rounded-none text-[0.95rem] focus:ring-2 focus:ring-gray-200 focus:border-[#111111] outline-none transition-all placeholder-soft-cream/30 shadow-sm "
                    />
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-[#111111] text-white border border-transparent hover:bg-gold/10 px-6 py-3 rounded-none font-bold uppercase tracking-widest text-xs transition-all shadow-md hover:shadow-lg hover:-translate-y-1 whitespace-nowrap"
                >
                    + Add Diamond
                </button>
            </div>

            {/* TABLE */}
            <div className="w-full overflow-x-auto bg-white  border border-gray-100 shadow-sm rounded-none pb-4">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-widest text-gray-400">
                            <th className="p-5 font-bold">Image</th>
                            <th className="p-5 font-bold">Specs</th>
                            <th className="p-5 font-bold">Grading</th>
                            <th className="p-5 font-bold">Price</th>
                            <th className="p-5 font-bold">Status</th>
                            <th className="p-5 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {currentDiamonds.length === 0 ? (
                            <tr><td colSpan={6} className="p-10 text-center text-gray-400 text-xs uppercase tracking-widest font-bold">No diamonds match your search criteria.</td></tr>
                        ) : currentDiamonds.map((diamond) => (
                            <tr key={diamond.id} className="hover:bg-gray-100 transition-colors">
                                <td className="p-5">
                                    <div className="w-14 h-14 bg-gray-50 rounded-none overflow-hidden flex items-center justify-center border border-gray-200 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                                        {diamond.imageUrl ? (
                                            <Image src={diamond.imageUrl} alt={diamond.shape} width={56} height={56} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-300 text-[10px] uppercase font-bold tracking-widest">No Img</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-5">
                                    <p className="font-bold text-[#111111] tracking-wide">{parseFloat(diamond.caratWeight).toFixed(2)}ct {diamond.shape}</p>
                                    <p className="text-[11px] text-gray-400 font-mono mt-1">ID: {diamond.id.slice(-6).toUpperCase()}</p>
                                </td>
                                <td className="p-5 text-[0.95rem] text-gray-700">
                                    <span className="inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-soft-cream/50"></span>{diamond.color} Color</span>
                                    <span className="mx-2 text-white/10">|</span>
                                    {diamond.clarity} <span className="mx-2 text-white/10">|</span> {diamond.cut}
                                    <br />
                                    <span className="text-[10px] font-bold text-gray-800 mt-2 inline-block bg-gray-50 border border-gray-200 px-2 py-1 rounded-md">{diamond.certification}</span>
                                </td>
                                <td className="p-5 font-bold font-body text-[#111111] tracking-wide text-lg">
                                    ₹{parseFloat(diamond.price).toLocaleString("en-IN")}
                                </td>
                                <td className="p-5">
                                    <button
                                        onClick={() => toggleStock(diamond.id, diamond.stockStatus)}
                                        className={`text-[9px] font-bold px-3 py-1.5 rounded-full tracking-[0.15em] uppercase transition-colors border ${diamond.stockStatus === "AVAILABLE" ? "bg-soft-cream/10 text-[#111111] border-soft-cream/20 hover:bg-soft-cream/20" : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-200"
                                            }`}
                                    >
                                        {diamond.stockStatus}
                                    </button>
                                </td>
                                <td className="p-5 text-right space-x-3">
                                    <button onClick={() => openEditModal(diamond)} className="p-2 text-gray-400 hover:text-[#111111] transition-colors inline-block bg-gray-50 hover:bg-gray-200 rounded-none" title="Edit">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => openDeleteModal(diamond)} className="p-2 text-gray-400 hover:text-white transition-colors inline-block bg-gray-50 hover:bg-gray-200 rounded-none" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-5 border-t border-gray-100">
                        <span className="text-xs tracking-widest uppercase font-bold text-gray-400">
                            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredDiamonds.length)} of {filteredDiamonds.length} items
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-none border border-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 hover:text-[#111111] transition-all"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                                    // Make pagination adaptive
                                    let pageNum = idx + 1;
                                    if (totalPages > 5 && currentPage > 3) {
                                        pageNum = currentPage - 2 + idx;
                                    }
                                    if (pageNum > totalPages) return null;

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-9 h-9 flex items-center justify-center rounded-none text-sm font-bold transition-all ${currentPage === pageNum ? 'bg-[#111111] border border-[#111111] text-[#111111] shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'text-gray-600 hover:bg-gray-100 hover:text-[#111111] border border-transparent hover:border-gray-300'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-none border border-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 hover:text-[#111111] transition-all"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ADD/EDIT MODAL OVERLAY */}
            {isAddEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/80 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="bg-white  border border-gray-200 rounded-none shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                            <h3 className="text-2xl font-heading tracking-wide text-[#111111]">
                                {editingDiamond ? "Edit Diamond" : "Register New Diamond"}
                            </h3>
                            <button onClick={() => setIsAddEditModalOpen(false)} className="text-gray-400 hover:text-[#111111] hover:bg-gray-100 p-2 rounded-full transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Shape</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111]" value={formData.shape} onChange={e => setFormData({ ...formData, shape: e.target.value })}>
                                        <option>Round</option><option>Oval</option><option>Princess</option><option>Emerald</option><option>Cushion</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Carat Weight</label>
                                    <input type="number" step="0.01" required className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111]" value={formData.caratWeight} onChange={e => setFormData({ ...formData, caratWeight: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Price (₹)</label>
                                    <input type="number" required className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111]" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Color</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111]" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })}>
                                        <option>D</option><option>E</option><option>F</option><option>G</option><option>H</option><option>I</option><option>J</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Clarity</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111]" value={formData.clarity} onChange={e => setFormData({ ...formData, clarity: e.target.value })}>
                                        <option>FL</option><option>IF</option><option>VVS1</option><option>VVS2</option><option>VS1</option><option>VS2</option><option>SI1</option><option>SI2</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Cut</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111]" value={formData.cut} onChange={e => setFormData({ ...formData, cut: e.target.value })}>
                                        <option>Excellent</option><option>Very Good</option><option>Good</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Certification</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111]" value={formData.certification} onChange={e => setFormData({ ...formData, certification: e.target.value })}>
                                        <option>GIA</option><option>IGI</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Diamond Image</label>
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 border rounded-none bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border-gray-200 shadow-none">
                                            {imagePreview ? (
                                                <Image src={imagePreview} alt="Preview" width={64} height={64} className="w-full h-full object-cover" unoptimized />
                                            ) : (
                                                <span className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em] px-2 text-center">No Img</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/png, image/jpeg, image/webp"
                                                onChange={handleImageChange}
                                                className="w-full text-xs text-gray-600 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-bold file:bg-gray-100 file:text-[#111111] hover:file:bg-white/20 transition-colors cursor-pointer"
                                            />
                                            {imagePreview && (
                                                <button type="button" onClick={removeImage} className="text-red-400 text-[10px] uppercase tracking-widest mt-3 font-bold hover:text-red-300 transition-colors">
                                                    Remove Image
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">3D Model (.glb)</label>
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 border rounded-none bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border-gray-200 shadow-none">
                                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] px-2 text-center">GLB</span>
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept=".glb,.gltf,.obj,model/gltf-binary,model/obj"
                                                onChange={handleModelChange}
                                                className="w-full text-xs text-gray-600 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-bold file:bg-gray-100 file:text-[#111111] hover:file:bg-white/20 transition-colors cursor-pointer"
                                            />
                                            {modelName ? (
                                                <div className="mt-2 flex items-center gap-4">
                                                    <span className="text-[11px] text-gray-600">{modelName}</span>
                                                    <button type="button" onClick={removeModel} className="text-red-400 text-[10px] uppercase tracking-widest font-bold hover:text-red-300 transition-colors">
                                                        Remove Model
                                                    </button>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                                <button type="button" onClick={() => setIsAddEditModalOpen(false)} className="px-6 py-3 rounded-none font-bold uppercase tracking-widest text-xs text-gray-600 hover:bg-gray-100 hover:text-[#111111] transition-colors" disabled={isUploading}>
                                    Cancel
                                </button>
                                <button type="submit" className="bg-[#111111] text-white border border-transparent px-8 py-3 rounded-none font-bold uppercase tracking-widest text-xs shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5" disabled={isUploading}>
                                    {isUploading ? "Uploading..." : (editingDiamond ? "Save Changes" : "Save Diamond")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white  border border-gray-200 rounded-none shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] w-full max-w-sm overflow-hidden p-8 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 border border-gray-200">
                            <Trash2 size={28} />
                        </div>
                        <h3 className="text-xl font-heading tracking-wide text-[#111111] mb-3">Delete Diamond?</h3>
                        <p className="text-[0.95rem] font-light text-gray-600 mb-8 leading-relaxed">
                            Are you sure you want to permanently delete this diamond records? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-3 rounded-none font-bold uppercase tracking-widest text-xs text-gray-600 bg-gray-50 hover:bg-gray-200 transition-colors border border-transparent">
                                Cancel
                            </button>
                            <button onClick={executeDelete} className="flex-1 bg-red-500 text-white border border-red-500 px-4 py-3 rounded-none font-bold uppercase tracking-widest text-xs hover:bg-red-600 transition-all">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

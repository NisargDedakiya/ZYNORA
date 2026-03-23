/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { X } from "lucide-react";

export function ProductTable({ initialProducts, categories }: { initialProducts: any[], categories: any[] }) {
    const [products, setProducts] = useState(initialProducts);
    const [isAdding, setIsAdding] = useState(false);

    // Multiple Image Upload State
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        categoryId: categories[0]?.name || "Rings",
        metalType: "18K Gold",
        stockCount: "1",
    });

    const handleDelete = async (id: string) => {
        if (!confirm("Delete product permanently?")) return;
        try {
            const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Product deleted");
                setProducts(products.filter(p => p.id !== id));
            } else { toast.error("Failed to delete"); }
        } catch { toast.error("Error"); }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const validFiles: File[] = [];
            const newPreviews: string[] = [];

            for (const file of files) {
                if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                    toast.error(`Invalid file type for ${file.name}.`);
                    continue;
                }
                if (file.size > 5 * 1024 * 1024) {
                    toast.error(`File ${file.name} exceeds 5MB limit.`);
                    continue;
                }
                validFiles.push(file);
                newPreviews.push(URL.createObjectURL(file));
            }

            // Append rather than replace (optional, here we replace to ensure UI freshness)
            setImageFiles(prev => [...prev, ...validFiles]);
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        const newFiles = [...imageFiles];
        const newPreviews = [...imagePreviews];
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        setImageFiles(newFiles);
        setImagePreviews(newPreviews);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsUploading(true);
            const uploadedImageUrls: string[] = [];

            // 1. Upload Images
            for (const file of imageFiles) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", file);
                uploadFormData.append("type", "products");

                const uploadRes = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: uploadFormData
                });

                const uploadData = await uploadRes.json();

                if (!uploadRes.ok) {
                    toast.error(`Failed to upload ${file.name}`);
                    setIsUploading(false);
                    return;
                }

                uploadedImageUrls.push(uploadData.url);
            }

            // 2. Save Product
            const payload = {
                ...formData,
                images: JSON.stringify(uploadedImageUrls)
            };

            const res = await fetch(`/api/admin/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Product created!");
                setProducts([data.product, ...products]);
                setIsAdding(false);
                setFormData({
                    name: "", description: "", price: "", categoryId: categories[0]?.name || "Rings", metalType: "18K Gold", stockCount: "1"
                });
                setImageFiles([]);
                setImagePreviews([]);
            } else {
                toast.error(data.error || "Creation failed");
            }
        } catch {
            toast.error("Error");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button onClick={() => {
                    setIsAdding(!isAdding);
                    setImageFiles([]);
                    setImagePreviews([]);
                }} className="bg-[#111111] text-white border border-transparent px-6 py-3 rounded-none font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg hover:-translate-y-1 hover:bg-gold/10">
                    {isAdding ? "Cancel" : "+ Add Product"}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleCreate} className="bg-white p-8 border border-gray-200 rounded-none shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6  animate-in fade-in slide-in-from-top-4 duration-500">
                    <h3 className="md:col-span-3 text-xl font-heading text-[#111111] border-b border-gray-200 pb-4 tracking-wide">Create New Custom Product</h3>

                    <div className="md:col-span-2"><label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Product Name</label>
                        <input required className="w-full bg-gray-50 border rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111] border-gray-200 transition-colors" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div><label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Price (₹)</label>
                        <input type="number" required className="w-full bg-gray-50 border rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111] border-gray-200 transition-colors" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                    </div>

                    <div><label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Category</label>
                        <input required className="w-full bg-gray-50 border rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111] border-gray-200 transition-colors" value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} list="cat-list" />
                        <datalist id="cat-list">
                            {categories.map(c => <option key={c.id} value={c.name} />)}
                        </datalist>
                    </div>
                    <div><label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Metal/Material</label>
                        <input required className="w-full bg-gray-50 border rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111] border-gray-200 transition-colors" value={formData.metalType} onChange={e => setFormData({ ...formData, metalType: e.target.value })} />
                    </div>
                    <div><label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Stock Count</label>
                        <input type="number" required min="0" className="w-full bg-gray-50 border rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111] border-gray-200 transition-colors" value={formData.stockCount} onChange={e => setFormData({ ...formData, stockCount: e.target.value })} />
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">Product Images</label>
                        <div className="space-y-4">
                            <input
                                type="file"
                                multiple
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleImageChange}
                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-xs file:uppercase file:tracking-widest file:font-bold file:bg-gray-100 file:text-[#111111] hover:file:bg-white/20 transition-colors cursor-pointer"
                            />

                            {imagePreviews.length > 0 && (
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative w-28 h-28 border border-gray-300 rounded-none overflow-hidden bg-gray-50 group shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                                            <Image src={preview} alt={`Preview ${index}`} width={112} height={112} className="w-full h-full object-cover" unoptimized />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-gray-50/80 rounded-full p-1.5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-3"><label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Description</label>
                        <textarea required className="w-full bg-gray-50 border rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111] border-gray-200 transition-colors" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>

                    <div className="md:col-span-3 flex justify-end">
                        <button type="submit" disabled={isUploading} className="bg-[#111111] text-white border border-transparent px-8 py-3 rounded-none font-bold uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all hover:bg-gold/10">
                            {isUploading ? "Uploading..." : "Save Product"}
                        </button>
                    </div>
                </form>
            )}

            <div className="w-full overflow-x-auto bg-white  border border-gray-100 rounded-none shadow-sm custom-scrollbar pb-4 mt-8">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-widest text-gray-400">
                            <th className="p-5 font-bold">Product</th>
                            <th className="p-5 font-bold">Category</th>
                            <th className="p-5 font-bold">Price</th>
                            <th className="p-5 font-bold">Stock</th>
                            <th className="p-5 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[0.95rem]">
                        {products.length === 0 ? (
                            <tr><td colSpan={5} className="p-10 text-center text-gray-400 text-xs uppercase tracking-widest font-bold">No products found.</td></tr>
                        ) : products.map((product) => {
                            let parsedImages = [];
                            try {
                                parsedImages = JSON.parse(product.images);
                            } catch { }

                            return (
                                <tr key={product.id} className="hover:bg-gray-100 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-gray-50 rounded-none overflow-hidden flex items-center justify-center border border-gray-200 shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                                                {parsedImages.length > 0 ? (
                                                    <Image src={parsedImages[0]} alt={product.name} width={56} height={56} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-gray-300 text-[10px] uppercase font-bold tracking-widest">No Img</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#111111] tracking-wide">{product.name}</p>
                                                <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-1">{product.metalType}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-xs font-bold uppercase tracking-widest bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md text-gray-700">{product.category.name}</span>
                                    </td>
                                    <td className="p-5 font-bold font-body text-[#111111] tracking-wide">₹{product.price.toLocaleString("en-IN")}</td>
                                    <td className="p-5 text-sm">{product.stockCount > 0 ? <span className="text-[#111111] font-bold uppercase tracking-widest text-[10px] bg-soft-cream/5 border border-soft-cream/10 px-3 py-1.5 rounded-full">{product.stockCount} In Stock</span> : <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">Out of Stock</span>}</td>
                                    <td className="p-5 text-right">
                                        <button onClick={() => handleDelete(product.id)} className="text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-white transition-colors bg-gray-50 hover:bg-gray-200 px-4 py-2 rounded-md border border-gray-200">Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

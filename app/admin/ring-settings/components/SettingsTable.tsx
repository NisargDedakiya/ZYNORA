/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Edit2, Trash2, X } from "lucide-react";

export function SettingsTable({ initialSettings }: { initialSettings: any[] }) {
    const [settings, setSettings] = useState(initialSettings);

    // Modal & Form States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingSetting, setEditingSetting] = useState<any | null>(null);
    const [settingToDelete, setSettingToDelete] = useState<any | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [modelFile, setModelFile] = useState<File | null>(null);
    const [modelName, setModelName] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Solitaire",
        imageUrl: "",
        modelUrl: ""
    });

    const openCreateModal = () => {
        setEditingSetting(null);
        setImageFile(null);
        setImagePreview(null);
        setModelFile(null);
        setModelName("");
        setFormData({ name: "", description: "", price: "", category: "Solitaire", imageUrl: "", modelUrl: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (setting: any) => {
        setEditingSetting(setting);
        setImageFile(null);
        setImagePreview(setting.imageUrl || null);
        setModelFile(null);
        setModelName(setting.modelUrl ? setting.modelUrl.split('/').pop() : "");
        setFormData({
            name: setting.name,
            description: setting.description,
            price: setting.price.toString(),
            category: setting.category,
            imageUrl: setting.imageUrl || "",
            modelUrl: setting.modelUrl || ""
        });
        setIsModalOpen(true);
    };

    const openDeleteModal = (setting: any) => {
        setSettingToDelete(setting);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!settingToDelete) {
            console.error("executeDelete called but settingToDelete is null");
            return;
        }
        console.log("Delete setting clicked, id:", settingToDelete.id);
        try {
            const url = `/api/admin/settings/${settingToDelete.id}`;
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
                toast.success("Setting deleted");
                setSettings(prev => prev.filter(s => s.id !== settingToDelete.id));
                setIsDeleteModalOpen(false);
                setSettingToDelete(null);
            } else {
                toast.error(data.error || "Failed to delete (may be in use)");
            }
        } catch (err) {
            console.error("Delete setting error:", err);
            toast.error("Network error");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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
                modelUploadFormData.append("type", "settings");
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
                uploadFormData.append("type", "settings");

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

            const isEditing = !!editingSetting;
            const url = isEditing ? `/api/admin/settings/${editingSetting.id}` : `/api/admin/settings`;
            const method = isEditing ? "PATCH" : "POST";

            const payload = {
                ...formData,
                imageUrl: uploadedImageUrl,
                modelUrl: uploadedModelUrl,
                price: parseFloat(formData.price)
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok) {
                toast.success(isEditing ? "Setting updated" : "Setting added");
                if (isEditing) {
                    setSettings(settings.map(s => s.id === editingSetting.id ? data.setting || { ...s, ...payload, id: editingSetting.id } : s));
                } else {
                    setSettings([data.setting, ...settings]);
                }
                setIsModalOpen(false);
            } else {
                toast.error("Operation failed");
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
                <button onClick={openCreateModal} className="bg-[#111111] text-white border border-transparent px-6 py-3 rounded-none font-bold uppercase tracking-widest text-xs transition-all shadow-md hover:shadow-lg hover:-translate-y-1 hover:bg-gold/10">
                    + Add Setting
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/80 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="bg-white  border border-gray-200 rounded-none shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                            <h3 className="text-2xl font-heading tracking-wide text-[#111111]">
                                {editingSetting ? "Edit Ring Setting" : "New Ring Setting Design"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-[#111111] hover:bg-gray-100 p-2 rounded-full transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Name</label>
                                    <input required className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111] transition-colors" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Base Price (₹)</label>
                                    <input type="number" required className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111] transition-colors" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                                <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Category</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111] transition-colors" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        <option>Solitaire</option><option>Halo</option><option>Vintage</option><option>Three-Stone</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2"><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Description</label>
                                    <textarea required rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 text-sm text-[#111111] outline-none focus:border-[#111111] transition-colors" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Setting Image</label>
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

                                <div className="md:col-span-2">
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
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-none font-bold uppercase tracking-widest text-xs text-gray-600 hover:bg-gray-100 hover:text-[#111111] transition-colors" disabled={isUploading}>Cancel</button>
                                <button type="submit" className="bg-[#111111] text-white border border-transparent px-8 py-3 rounded-none font-bold uppercase tracking-widest text-xs shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:bg-gold/10" disabled={isUploading}>
                                    {isUploading ? "Uploading..." : (editingSetting ? "Save Changes" : "Save Setting")}
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
                        <h3 className="text-xl font-heading tracking-wide text-[#111111] mb-3">Delete Setting?</h3>
                        <p className="text-[0.95rem] font-light text-gray-600 mb-8 leading-relaxed">
                            Are you sure you want to permanently delete <strong>{settingToDelete?.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => { setIsDeleteModalOpen(false); setSettingToDelete(null); }} className="flex-1 px-4 py-3 rounded-none font-bold uppercase tracking-widest text-xs text-gray-600 bg-gray-50 hover:bg-gray-200 transition-colors border border-transparent">
                                Cancel
                            </button>
                            <button onClick={executeDelete} className="flex-1 bg-red-500 text-white border border-red-500 px-4 py-3 rounded-none font-bold uppercase tracking-widest text-xs hover:bg-red-600 transition-all">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {settings.map((setting) => (
                    <div key={setting.id} className="bg-white  border border-gray-100 shadow-sm rounded-none p-5 flex gap-5 group hover:border-gray-300 transition-all duration-300">
                        <div className="w-24 h-24 bg-gray-50 rounded-none relative overflow-hidden flex-shrink-0 shadow-none border border-gray-200 group-hover:border-gray-300 transition-colors">
                            {setting.imageUrl ? (
                                <Image src={setting.imageUrl} alt={setting.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-gray-300">No Img</div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                                <h4 className="font-heading font-medium tracking-wide text-[#111111] truncate text-lg">{setting.name}</h4>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">{setting.category}</p>
                            </div>
                            <div className="flex justify-between items-end mt-4">
                                <span className="text-[1rem] font-bold font-body text-[#111111] tracking-wide">₹{(setting.price || 0).toLocaleString("en-IN")}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditModal(setting)} className="p-2 text-gray-400 hover:text-[#111111] transition-colors block bg-gray-50 hover:bg-gray-200 rounded-none" title="Edit">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => openDeleteModal(setting)} className="p-2 text-gray-400 hover:text-red-400 transition-colors block bg-gray-50 hover:bg-red-500/10 rounded-none" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


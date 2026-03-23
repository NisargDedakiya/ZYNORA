import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const uploadType = formData.get("type") as string; // images: diamonds/settings/products, models: diamonds/settings

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const allowedTypes = ['diamonds', 'settings', 'products'];
        if (!uploadType || !allowedTypes.includes(uploadType)) {
            return NextResponse.json({ error: "Invalid upload type." }, { status: 400 });
        }

        const kind = (formData.get("kind") as string) || "image";
        if (!["image", "model"].includes(kind)) {
            return NextResponse.json({ error: "Invalid upload kind." }, { status: 400 });
        }

        // Validate File Type
        const validImageMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const imageExtRegex = /\.(jpg|jpeg|png|webp)$/i;
        const modelExtRegex = /\.(glb|gltf|obj)$/i;
        const safeName = file.name.toLowerCase();

        if (kind === "image") {
            const isImageMime = validImageMimeTypes.includes(file.type);
            const isImageExt = imageExtRegex.test(safeName);
            if (!isImageMime && !isImageExt) {
                return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WebP are allowed." }, { status: 400 });
            }
        }

        if (kind === "model") {
            if (!['diamonds', 'settings'].includes(uploadType)) {
                return NextResponse.json({ error: "Model uploads are only allowed for settings and diamonds." }, { status: 400 });
            }
            if (!modelExtRegex.test(safeName)) {
                return NextResponse.json({ error: "Invalid model type. Only .glb, .gltf, and .obj files are allowed." }, { status: 400 });
            }
        }

        // Validate File Size
        const MAX_SIZE = kind === "model" ? 30 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: kind === "model" ? "File size exceeds 30MB limit." : "File size exceeds 5MB limit." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Sanitize filename & create unique name
        const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(originalName);
        const name = path.basename(originalName, ext);
        const filename = `${name}-${uniqueSuffix}${ext}`;

        // Ensure directory exists
        const uploadDir = kind === "model"
            ? path.join(process.cwd(), "public", "models", uploadType)
            : path.join(process.cwd(), "public", "uploads", uploadType);

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Directory might already exist
        }

        const filePath = path.join(uploadDir, filename);
        if (!filePath.startsWith(uploadDir)) {
            return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
        }

        // Save file locally
        await writeFile(filePath, buffer);

        // Path to store in DB
        const publicUrl = kind === "model"
            ? `/models/${uploadType}/${filename}`
            : `/uploads/${uploadType}/${filename}`;

        return NextResponse.json({
            message: "Success",
            url: publicUrl
        }, { status: 201 });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
    }
}

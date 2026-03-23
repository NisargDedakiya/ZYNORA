import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

function normalizeSettingModelUrl(input?: string): string {
    if (!input) return "";
    const value = input.trim().replace(/\\/g, "/");
    if (value.startsWith("/models/settings/")) return value;
    if (value.startsWith("models/settings/")) return `/${value}`;
    const publicIdx = value.indexOf("/public/models/settings/");
    if (publicIdx !== -1) return value.slice(publicIdx + "/public".length);
    const modelsIdx = value.indexOf("/models/settings/");
    if (modelsIdx !== -1) return value.slice(modelsIdx);
    return "";
}

// GET all settings (handled primarily by server components, but good to have)
export async function GET() {
    try {
        const settings = await prisma.setting.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ settings });
    } catch {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

// POST a new setting
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();

        const setting = await prisma.setting.create({
            data: {
                name: body.name,
                description: body.description,
                category: body.category,
                price: parseFloat(body.price),
                imageUrl: body.imageUrl || "",
                modelUrl: normalizeSettingModelUrl(body.modelUrl),
            }
        });

        return NextResponse.json({ success: true, setting });
    } catch (e) {
        console.error("Failed to create setting:", e);
        return NextResponse.json({ error: "Failed to create setting", details: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
}

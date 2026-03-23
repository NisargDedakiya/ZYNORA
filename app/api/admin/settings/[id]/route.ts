/* eslint-disable @typescript-eslint/no-explicit-any */
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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();

        const updateData: any = {};
        if (body.name) updateData.name = body.name;
        if (body.description) updateData.description = body.description;
        if (body.category) updateData.category = body.category;
        if (body.price !== undefined) updateData.price = parseFloat(body.price);
        if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
        if (body.modelUrl !== undefined) updateData.modelUrl = normalizeSettingModelUrl(body.modelUrl);

        const setting = await prisma.setting.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ success: true, setting });
    } catch (e) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        console.log("[API] DELETE /api/admin/settings/[id] called with id:", id);
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            console.log("[API] DELETE setting unauthorized");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // First delete related OrderItems that reference RingConfigurations using this setting
        const configs = await prisma.ringConfiguration.findMany({
            where: { settingId: id },
            select: { id: true }
        });
        
        if (configs.length > 0) {
            const configIds = configs.map(c => c.id);
            // Delete order items linked to these configurations
            await prisma.orderItem.deleteMany({
                where: { ringConfigurationId: { in: configIds } }
            });
            // Delete the configurations themselves
            await prisma.ringConfiguration.deleteMany({
                where: { settingId: id }
            });
        }

        // Now delete the setting
        await prisma.setting.delete({
            where: { id }
        });

        console.log("[API] Setting deleted successfully:", id);
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("[API] DELETE setting error:", e);
        return NextResponse.json({ error: "Failed to delete setting." }, { status: 500 });
    }
}

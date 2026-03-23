import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Toggle existing Diamond Stock Status
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();

        const updateData: any = {};
        if (body.stockStatus !== undefined) updateData.stockStatus = body.stockStatus;
        if (body.shape !== undefined) updateData.shape = body.shape;
        if (body.caratWeight !== undefined) updateData.caratWeight = parseFloat(body.caratWeight);
        if (body.cut !== undefined) updateData.cut = body.cut;
        if (body.clarity !== undefined) updateData.clarity = body.clarity;
        if (body.color !== undefined) updateData.color = body.color;
        if (body.certification !== undefined) updateData.certification = body.certification;
        if (body.price !== undefined) updateData.price = parseFloat(body.price);
        if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
        if (body.modelUrl !== undefined) updateData.modelUrl = body.modelUrl;

        const diamond = await prisma.diamond.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ success: true, diamond });
    } catch (e) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        console.log("[API] DELETE /api/admin/diamonds/[id] called with id:", id);
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            console.log("[API] DELETE diamond unauthorized");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // First delete related OrderItems that reference RingConfigurations using this diamond
        const configs = await prisma.ringConfiguration.findMany({
            where: { diamondId: id },
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
                where: { diamondId: id }
            });
        }

        // Now delete the diamond
        await prisma.diamond.delete({ where: { id } });
        console.log("[API] Diamond deleted successfully:", id);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("[API] DELETE diamond error:", e);
        return NextResponse.json({ error: "Failed to delete diamond: " + (e.message || "Internal Error") }, { status: 500 });
    }
}

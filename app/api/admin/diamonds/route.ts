/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Create new Diamond
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        // body should contain shape, carat, cut, color, clarity, cert, price, imageUrl
        const newDiamond = await prisma.diamond.create({
            data: {
                shape: body.shape,
                caratWeight: parseFloat(body.caratWeight),
                cut: body.cut,
                clarity: body.clarity,
                color: body.color,
                certification: body.certification,
                price: parseFloat(body.price),
                imageUrl: body.imageUrl || null,
                modelUrl: body.modelUrl || null,
                stockStatus: "AVAILABLE"
            }
        });

        return NextResponse.json({ success: true, diamond: newDiamond });

    } catch (e) {
        console.error("Failed to add diamond", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// Delete Diamond
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: "ID req" }, { status: 400 });

        await prisma.diamond.delete({ where: { id } });
        return NextResponse.json({ success: true });

    } catch (e: any) {
        if (e.code === 'P2003') {
            return NextResponse.json({ error: "Cannot delete diamond because it is tied to an active order or configuration." }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

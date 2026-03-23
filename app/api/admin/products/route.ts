/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();

        // Need to find category by name/slug handling since Prisma requires ID
        let category = await prisma.category.findUnique({ where: { name: body.categoryId } });
        if (!category) {
            // Lazy create category if it doesn't exist
            category = await prisma.category.create({
                data: {
                    name: body.categoryId,
                    slug: body.categoryId.toLowerCase().replace(/\s+/g, '-')
                }
            });
        }

        const newProduct = await prisma.product.create({
            data: {
                name: body.name,
                slug: body.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4), // basic unique slug
                description: body.description,
                price: parseFloat(body.price),
                categoryId: category.id,
                metalType: body.metalType,
                stockCount: parseInt(body.stockCount) || 1,
                images: body.images || "[]"
            },
            include: { category: true }
        });

        return NextResponse.json({ success: true, product: newProduct });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: "Internal Error", details: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "ID req" }, { status: 400 });

        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

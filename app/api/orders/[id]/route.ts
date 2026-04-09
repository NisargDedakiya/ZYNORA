/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Try by displayOrderId first, then by cuid
        let order = await prisma.order.findFirst({
            where: { displayOrderId: id },
            include: {
                user: { select: { name: true, email: true } },
                items: {
                    include: {
                        product: true,
                        ringConfiguration: {
                            include: { diamond: true, setting: true },
                        },
                    },
                },
            },
        });

        if (!order) {
            order = await prisma.order.findUnique({
                where: { id },
                include: {
                    user: { select: { name: true, email: true } },
                    items: {
                        include: {
                            product: true,
                            ringConfiguration: {
                                include: { diamond: true, setting: true },
                            },
                        },
                    },
                },
            });
        }

        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Fetch Order Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch order" },
            { status: 500 }
        );
    }
}

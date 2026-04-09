/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            customer,
            ringConfigurationId,
            totalPrice,
            settingName,
            diamondShape,
            diamondCarat,
            metalType,
            paymentMethod,
        } = body;

        // Find or create user by email
        let user = await prisma.user.findFirst({
            where: { email: customer.email },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: customer.email || "demo@zynora.com",
                    name: customer.name || "Demo Customer",
                },
            });
        }

        // Build order items
        const orderItems: any[] = [];

        if (ringConfigurationId) {
            orderItems.push({
                ringConfigurationId,
                quantity: 1,
                price: totalPrice,
            });
        } else {
            orderItems.push({
                quantity: 1,
                price: totalPrice,
            });
        }

        // Create order
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                subtotal: totalPrice,
                gstAmount: 0,
                gstType: null,
                shippingCost: 0,
                totalAmount: totalPrice,
                billingState: customer.state || null,
                shippingState: customer.state || null,
                razorpayId: `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                status: "PAID",
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: true,
                user: true,
            },
        });

        // Generate a human-readable display order ID
        const displayOrderId = `ZYN-${order.id.slice(-8).toUpperCase()}`;

        return NextResponse.json({
            success: true,
            orderId: order.id,
            displayOrderId,
        });
    } catch (error) {
        console.error("Demo Payment Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to process demo order" },
            { status: 500 }
        );
    }
}

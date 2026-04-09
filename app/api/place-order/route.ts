/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateDisplayOrderId(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return `ZYNORA-ORD-${code}`;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            orderType, // "CART" | "CUSTOM_RING"
            customer,
            // Cart-specific
            items,
            subtotal,
            totalAmount,
            gstAmount,
            gstType,
            billingState,
            shippingState,
            gstNumber,
            razorpayId,
            // Custom ring-specific
            ringConfigurationId,
            totalPrice,
            settingName,
            diamondShape,
            diamondCarat,
            metalType,
            paymentMethod,
        } = body;

        if (!customer || !customer.email) {
            return NextResponse.json(
                { success: false, message: "Customer details required" },
                { status: 400 }
            );
        }

        // Find or create user
        let user = await prisma.user.findFirst({
            where: { email: customer.email },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: customer.email,
                    name:
                        customer.name ||
                        `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
                        "Guest User",
                },
            });
        }

        const displayOrderId = generateDisplayOrderId();

        // Build customer address string
        const addressParts = [
            customer.address,
            customer.city,
            customer.state,
            customer.pincode,
        ].filter(Boolean);
        const fullAddress = addressParts.join(", ");

        const customerName =
            customer.name ||
            `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
            user.name ||
            "Guest";

        if (orderType === "CUSTOM_RING") {
            // ── Custom Ring Order ──
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

            const order = await prisma.order.create({
                data: {
                    displayOrderId,
                    orderType: "CUSTOM_RING",
                    userId: user.id,
                    subtotal: totalPrice,
                    gstAmount: 0,
                    gstType: null,
                    shippingCost: 0,
                    totalAmount: totalPrice,
                    billingState: customer.state || null,
                    shippingState: customer.state || null,
                    customerName,
                    customerEmail: customer.email,
                    customerPhone: customer.phone || null,
                    customerAddress: fullAddress || null,
                    razorpayId:
                        razorpayId ||
                        `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                    status: "CONFIRMED",
                    items: { create: orderItems },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                            ringConfiguration: {
                                include: { diamond: true, setting: true },
                            },
                        },
                    },
                    user: true,
                },
            });

            return NextResponse.json({
                success: true,
                orderId: order.id,
                displayOrderId: order.displayOrderId,
                order,
            });
        } else {
            // ── Cart Item Order ──
            if (!items || items.length === 0) {
                return NextResponse.json(
                    { success: false, message: "No items provided" },
                    { status: 400 }
                );
            }

            const orderItems = items.map((item: any) => ({
                productId: item.isCustomRing ? null : item.id,
                ringConfigurationId: item.isCustomRing
                    ? item.ringConfigurationId
                    : null,
                quantity: item.quantity || 1,
                price: item.price,
            }));

            const computedSubtotal =
                subtotal ||
                items.reduce(
                    (sum: number, item: any) =>
                        sum + item.price * (item.quantity || 1),
                    0
                );
            const computedTotal = totalAmount || computedSubtotal;

            const order = await prisma.order.create({
                data: {
                    displayOrderId,
                    orderType: "CART",
                    userId: user.id,
                    subtotal: computedSubtotal,
                    gstAmount: gstAmount || 0,
                    gstType: gstType || null,
                    shippingCost: 0,
                    totalAmount: computedTotal,
                    billingState: billingState || customer.state || null,
                    shippingState: shippingState || customer.state || null,
                    gstNumber: gstNumber || null,
                    customerName,
                    customerEmail: customer.email,
                    customerPhone: customer.phone || null,
                    customerAddress: fullAddress || null,
                    razorpayId:
                        razorpayId ||
                        `cart_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                    status: "CONFIRMED",
                    items: { create: orderItems },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                            ringConfiguration: {
                                include: { diamond: true, setting: true },
                            },
                        },
                    },
                    user: true,
                },
            });

            return NextResponse.json({
                success: true,
                orderId: order.id,
                displayOrderId: order.displayOrderId,
                order,
            });
        }
    } catch (error) {
        console.error("Place Order Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to place order" },
            { status: 500 }
        );
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendInvoiceEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            items,
            subtotal,
            totalAmount,
            gstAmount,
            gstType,
            billingState,
            shippingState,
            gstNumber,
            customer,
            razorpayId
        } = body;

        // In a real application, we would verify the Razorpay signature here using crypto
        // e.g., const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(orderId + "|" + paymentId).digest('hex');

        // Ensure there is a user associated or create a guest user
        let user = await prisma.user.findFirst({
            where: { email: customer.email }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: customer.email || "guest@example.com",
                    name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Guest User'
                }
            });
        }

        // Create the Order with all GST fields
        const orderDataPayload: any = {
            userId: user.id,
            subtotal: subtotal,
            gstAmount: gstAmount,
            gstType: gstType,
            shippingCost: 0,
            totalAmount: totalAmount,
            billingState: billingState,
            shippingState: shippingState,
            gstNumber: gstNumber || null,
            razorpayId: razorpayId,
            status: "PAID",
            items: {
                create: items.map((item: any) => ({
                    productId: item.isCustomRing ? null : item.id,
                    ringConfigurationId: item.isCustomRing ? item.ringConfigurationId : null,
                    quantity: item.quantity,
                    price: item.price
                }))
            }
        };

        const order = await prisma.order.create({
            data: orderDataPayload,
            include: {
                items: true,
                user: true
            }
        }) as any;

        // Trigger Invoice Generation and Email Dispatch
        console.log(`[GST INVOICE] Generating and emailing for Order: ${order.id}`);
        await sendInvoiceEmail({
            id: order.id,
            createdAt: order.createdAt,
            totalAmount: order.totalAmount,
            subtotal: order.subtotal,
            gstAmount: order.gstAmount,
            gstType: order.gstType,
            billingState: order.billingState,
            gstNumber: order.gstNumber,
            customer: {
                name: user.name,
                email: user.email,
                phone: customer.phone,
                address: customer.address,
                city: customer.city,
                pincode: customer.pincode
            },
            items: items
        });

        return NextResponse.json({ success: true, orderId: order.id });

    } catch (error) {
        console.error("Order Creation Error:", error);
        return NextResponse.json({ success: false, message: "Failed to process order" }, { status: 500 });
    }
}

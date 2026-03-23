/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { OrderTable } from "./components/OrderTable";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    let orders: any[] = [];
    try {
        orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                items: {
                    include: {
                        product: true,
                        ringConfiguration: {
                            include: {
                                diamond: true,
                                setting: true
                            }
                        }
                    }
                }
            }
        });
    } catch (e) {
        console.error("Failed to load orders", e);
    }

    return (
        <div>
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-heading text-[#111111] mb-3 tracking-wide">Order Management</h1>
                    <p className="text-gray-500 text-[0.95rem] tracking-wide font-light">Track, update, and manage all incoming orders.</p>
                </div>
            </header>

            <OrderTable initialOrders={orders} />
        </div>
    );
}


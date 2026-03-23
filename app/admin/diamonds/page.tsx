/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { DiamondTable } from "./components/DiamondTable";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminDiamondsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    let diamonds: any[] = [];
    try {
        const rawDiamonds = await prisma.diamond.findMany({
            orderBy: { createdAt: 'desc' },
            where: { product: null }
        });
        diamonds = JSON.parse(JSON.stringify(rawDiamonds));
    } catch (e) {
        console.error("Failed to load diamonds", e);
    }

    return (
        <div>
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-heading text-[#111111] mb-3 tracking-wide">Diamond Inventory</h1>
                    <p className="text-gray-500 text-[0.95rem] tracking-wide font-light">Manage loose diamonds available for the Ring Customizer.</p>
                </div>
            </header>

            <DiamondTable initialDiamonds={diamonds} />
        </div>
    );
}

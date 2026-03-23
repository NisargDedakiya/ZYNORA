/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { SettingsTable } from "./components/SettingsTable";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    let settings: any[] = [];
    try {
        const rawSettings = await prisma.setting.findMany({
            orderBy: { createdAt: 'desc' },
        });
        settings = JSON.parse(JSON.stringify(rawSettings));
    } catch (e) {
        console.error("Failed to load settings", e);
    }

    return (
        <div>
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-heading text-[#111111] mb-3 tracking-wide">Ring Settings</h1>
                    <p className="text-gray-500 text-[0.95rem] tracking-wide font-light">Manage base mountings available in the Customizer.</p>
                </div>
            </header>

            <SettingsTable initialSettings={settings} />
        </div>
    );
}

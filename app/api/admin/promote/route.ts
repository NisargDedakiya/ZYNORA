import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Backdoor script to easily turn any account into an ADMIN
export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body.email) {
            return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });
        }

        // Extremely basic secret validation so not just anyone can hit this in prod accidentally
        if (body.secretPhase !== "make-me-admin-2026") {
            return NextResponse.json({ success: false, message: "Unauthorized Phase" }, { status: 401 });
        }

        const user = await prisma.user.update({
            where: { email: body.email },
            data: { role: "ADMIN" }
        });

        return NextResponse.json({ success: true, user: { email: user.email, role: user.role } });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, message: "Error promoting user" }, { status: 500 });
    }
}

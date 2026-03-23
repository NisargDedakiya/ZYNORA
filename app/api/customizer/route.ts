import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { settingId, diamondId, metalType, totalPrice } = body;

        if (!settingId || !diamondId || !metalType || !totalPrice) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newConfiguration = await prisma.ringConfiguration.create({
            data: {
                settingId,
                diamondId,
                metalType,
                totalPrice,
            },
            include: {
                setting: true,
                diamond: true
            }
        });

        return NextResponse.json(newConfiguration);
    } catch (error) {
        console.error("Failed to save ring configuration:", error);
        return NextResponse.json(
            { error: "Failed to save configuration" },
            { status: 500 }
        );
    }
}

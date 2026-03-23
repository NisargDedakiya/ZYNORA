import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { productId, rating, comment } = body;

        if (!productId || !rating) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const review = await prisma.review.create({
            data: {
                userId: user.id,
                productId,
                rating: Number(rating),
                comment
            }
        });

        return NextResponse.json({ success: true, review });

    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json({ success: false, error: "Failed to create review" }, { status: 500 });
    }
}

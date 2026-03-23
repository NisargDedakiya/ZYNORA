/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Parsing pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const skip = (page - 1) * limit;

        // Parsing filter criteria
        const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
        const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;

        const minCarat = searchParams.get('minCarat') ? parseFloat(searchParams.get('minCarat')!) : undefined;
        const maxCarat = searchParams.get('maxCarat') ? parseFloat(searchParams.get('maxCarat')!) : undefined;

        const shapeStr = searchParams.get('shapes'); // e.g., "Round,Oval"
        const shape = shapeStr ? shapeStr.split(',') : undefined;

        const cutStr = searchParams.get('cuts');
        const cut = cutStr ? cutStr.split(',') : undefined;

        const clarityStr = searchParams.get('clarities');
        const clarity = clarityStr ? clarityStr.split(',') : undefined;

        const colorStr = searchParams.get('colors');
        const color = colorStr ? colorStr.split(',') : undefined;

        const certificationStr = searchParams.get('certs');
        const certification = certificationStr ? certificationStr.split(',') : undefined;

        // Base where clause ensures we only get loose diamonds (product is null) or at least available ones
        // In our seed, loose diamonds don't have a product explicitly defining them yet (unless product is assigned to it)
        const where: any = {
            stockStatus: 'AVAILABLE',
            product: null, // this ensures we only pull the 60 loose diamonds we seeded, not the rings
        };

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) where.price.gte = minPrice;
            if (maxPrice !== undefined) where.price.lte = maxPrice;
        }

        if (minCarat !== undefined || maxCarat !== undefined) {
            where.caratWeight = {};
            if (minCarat !== undefined) where.caratWeight.gte = minCarat;
            if (maxCarat !== undefined) where.caratWeight.lte = maxCarat;
        }

        if (shape) where.shape = { in: shape };
        if (cut) where.cut = { in: cut };
        if (clarity) where.clarity = { in: clarity };
        if (color) where.color = { in: color };
        if (certification) where.certification = { in: certification };

        // Transaction for executing fetch and count concurrently
        const [diamonds, totalCount] = await prisma.$transaction([
            prisma.diamond.findMany({
                where,
                skip,
                take: limit,
                orderBy: { price: 'asc' },
            }),
            prisma.diamond.count({ where }),
        ]);

        return NextResponse.json({
            diamonds,
            totalCount,
            page,
            totalPages: Math.ceil(totalCount / limit)
        });

    } catch (error) {
        console.error('Error fetching diamonds:', error);
        return NextResponse.json(
            { error: 'Failed to fetch diamonds' },
            { status: 500 }
        );
    }
}

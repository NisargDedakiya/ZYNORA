/* eslint-disable */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    // Parse filters
    const categorySlug = searchParams.get('category');
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const diamondShape = searchParams.get('shape'); // e.g. "Round,Oval"
    const metalType = searchParams.get('metal'); // e.g. "18K White Gold"
    const sort = searchParams.get('sort'); // "price-asc" | "price-desc" | "newest" | "popular"

    try {
        const whereClause: any = {};

        // Category filter
        if (categorySlug) {
            whereClause.category = {
                slug: categorySlug
            };
        }

        // Price range filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            whereClause.price = {};
            if (minPrice !== undefined) whereClause.price.gte = minPrice;
            if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
        }

        // Diamond shape filter (supports comma separated)
        if (diamondShape) {
            const shapes = diamondShape.split(',').map(s => s.trim());
            whereClause.diamond = {
                shape: {
                    in: shapes
                }
            };
        }

        // Metal type filter
        if (metalType) {
            const metals = metalType.split(',').map(m => m.trim());
            whereClause.metalType = {
                in: metals
            };
        }

        // Setup Sorting
        let orderBy: any = { createdAt: 'desc' }; // Default Newest
        if (sort === 'price-asc') orderBy = { price: 'asc' };
        if (sort === 'price-desc') orderBy = { price: 'desc' };
        if (sort === 'popular') orderBy = { orders: { _count: 'desc' } };

        const products = await prisma.product.findMany({
            where: whereClause,
            include: {
                category: true,
                diamond: true,
                _count: {
                    select: { reviews: true }
                }
            },
            orderBy
        });

        // Format to handle image JSON parsing if needed
        const formattedProducts = products.map(p => ({
            ...p,
            images: JSON.parse(p.images)
        }));

        return NextResponse.json({ success: true, products: formattedProducts });

    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
    }
}

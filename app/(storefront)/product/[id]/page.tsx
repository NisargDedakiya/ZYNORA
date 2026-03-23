import { PrismaClient } from "@prisma/client";
import dynamic from "next/dynamic";
import { Metadata } from "next";

const ProductClient = dynamic(() => import("./ProductClient"), {
    loading: () => <div className="py-32 flex justify-center text-[#111111]">Loading Details...</div>
});

const prisma = new PrismaClient();

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { slug: id }
    });

    if (!product) return { title: "Product Not Found | ZYNORA LUXE" };

    return {
        title: `${product.name} | ZYNORA LUXE`,
        description: product.description.substring(0, 160),
        openGraph: {
            title: product.name,
            description: product.description.substring(0, 160),
            images: product.images ? [JSON.parse(product.images)[0]] : []
        }
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Treat params.id as slug according to link structure
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { slug: id },
        include: { diamond: true, category: true }
    });

    if (!product) {
        return <div className="py-32 text-center text-2xl text-text-dark font-heading">Product Not Found</div>;
    }

    return <ProductClient product={product} />;
}

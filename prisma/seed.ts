/* eslint-disable */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Premium Jewelry Local Images specifically curated for ZYNORA LUXE
const IMAGES = {
    ring1: '/products/ring-1.jpg',
    ring2: '/products/ring-2.jpg',
    ring3: '/products/ring-3.jpg',
    ring4: '/products/ring-4.jpg',
    necklace1: '/products/necklace-1.jpg',
    necklace2: '/products/necklace-2.jpg',
    earrings1: '/products/earrings-1.jpg',
    looseDiamond: '/products/loose-diamond.jpg', 
    setting1: '/products/setting-1.jpg',
    setting2: '/products/setting-2.jpg'
};

async function main() {
    console.log('Clearing existing placeholder demo data...');
    // We clear bottom-up to avoid foreign key failures
    await prisma.review.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.ringConfiguration.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.setting.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.diamond.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('Seeding Realistic Categories...');
    const categories = [
        { name: 'Engagement Rings', slug: 'engagement-rings', description: 'Timeless symbols of your eternal love.', imageUrl: IMAGES.ring1 },
        { name: 'Wedding Bands', slug: 'wedding-bands', description: 'Classic bands to celebrate your union.', imageUrl: IMAGES.ring3 },
        { name: 'Necklaces', slug: 'necklaces', description: 'Elegant pendants and diamond necklaces.', imageUrl: IMAGES.necklace1 },
        { name: 'Earrings', slug: 'earrings', description: 'Brilliant studs and drop earrings.', imageUrl: IMAGES.earrings1 },
    ];

    const createdCategories = [];
    for (const cat of categories) {
        const c = await prisma.category.create({ data: cat });
        createdCategories.push(c);
    }

    const engagementCategory = createdCategories.find(c => c.slug === 'engagement-rings')!;
    const necklaceCategory = createdCategories.find(c => c.slug === 'necklaces')!;
    const earringsCategory = createdCategories.find(c => c.slug === 'earrings')!;

    console.log('Seeding Realistic Products...');
    const productsData = [
        {
            name: 'The Sovereign Round Brilliant',
            slug: 'sovereign-round-brilliant',
            description: 'A masterpiece of classic design, featuring a flawless round brilliant diamond hoisted upon a platinum knife-edge band.',
            price: 185000,
            images: JSON.stringify([IMAGES.ring1, IMAGES.ring3]),
            categoryId: engagementCategory.id,
            metalType: 'Platinum',
            stockCount: 3,
            isFeatured: true,
            diamond: {
                create: {
                    shape: 'Round',
                    caratWeight: 1.50,
                    cut: 'Excellent',
                    clarity: 'VVS1',
                    color: 'D',
                    certification: 'GIA',
                    price: 125000,
                    stockStatus: 'AVAILABLE'
                }
            }
        },
        {
            name: 'Imperial Oval Halo Presentation',
            slug: 'imperial-oval-halo',
            description: 'A striking oval cut diamond enveloped in a micro-pavé halo, set upon an 18K White Gold band for a luminous glow.',
            price: 210000,
            images: JSON.stringify([IMAGES.ring2]),
            categoryId: engagementCategory.id,
            metalType: '18K White Gold',
            stockCount: 2,
            isFeatured: true,
            diamond: {
                create: {
                    shape: 'Oval',
                    caratWeight: 2.05,
                    cut: 'Excellent',
                    clarity: 'VS1',
                    color: 'E',
                    certification: 'IGI',
                    price: 140000,
                    stockStatus: 'AVAILABLE'
                }
            }
        },
        {
            name: 'ZYNORA Signature Emerald Cut',
            slug: 'signature-emerald-cut',
            description: 'Architectural and pristine, this step-cut emerald diamond reflects light with profound clarity on an 18K Yellow Gold band.',
            price: 315000,
            images: JSON.stringify([IMAGES.ring4]),
            categoryId: engagementCategory.id,
            metalType: '18K Yellow Gold',
            stockCount: 1,
            isFeatured: true,
            diamond: {
                create: {
                    shape: 'Emerald',
                    caratWeight: 2.75,
                    cut: 'Excellent',
                    clarity: 'IF',
                    color: 'D',
                    certification: 'GIA',
                    price: 260000,
                    stockStatus: 'AVAILABLE'
                }
            }
        },
        {
            name: 'Luminous Pear Drop Necklace',
            slug: 'luminous-pear-necklace',
            description: 'A spectacular pear-shaped diamond suspended from a delicate platinum chain, capturing the essence of modern luxury.',
            price: 85000,
            images: JSON.stringify([IMAGES.necklace1, IMAGES.necklace2]),
            categoryId: necklaceCategory.id,
            metalType: 'Platinum',
            stockCount: 4,
            isFeatured: false,
        },
        {
            name: 'Rivière Diamond Tennis Necklace',
            slug: 'riviere-tennis-necklace',
            description: 'A breathtaking cascade of graduated round brilliant diamonds, seamlessly set in 18K White Gold.',
            price: 450000,
            images: JSON.stringify([IMAGES.necklace2]),
            categoryId: necklaceCategory.id,
            metalType: '18K White Gold',
            stockCount: 1,
            isFeatured: true,
        },
        {
            name: 'Cascade Diamond Drop Earrings',
            slug: 'cascade-drop-earrings',
            description: 'Exquisite chandelier earrings dripping with marquise and round cut diamonds, engineered for pure brilliance.',
            price: 135000,
            images: JSON.stringify([IMAGES.earrings1]),
            categoryId: earringsCategory.id,
            metalType: '18K White Gold',
            stockCount: 2,
            isFeatured: true,
        }
    ];

    for (const prod of productsData) {
        const { diamond, ...productData } = prod as any;
        let createdDiamondId = null;

        if (diamond && diamond.create) {
            const createdDiamond = await prisma.diamond.create({
                data: diamond.create
            });
            createdDiamondId = createdDiamond.id;
        }

        await prisma.product.create({
            data: {
                ...productData,
                diamondId: createdDiamondId
            }
        });
    }

    console.log('Seeding Realistic Loose Diamonds for Customizer...');
    const shapes = ['Round', 'Oval', 'Princess', 'Emerald', 'Cushion', 'Pear', 'Radiant'];
    const cuts = ['Excellent', 'Very Good'];
    const clarities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2'];
    const colors = ['D', 'E', 'F', 'G', 'H'];
    const certs = ['GIA', 'IGI'];

    // Map diamond shapes to their 3D model GLBs
    const diamondModelMap: Record<string, string> = {
        'Round': '/models/diamonds/round.glb',
        'Oval': '/models/diamonds/oval.glb',
        'Princess': '/models/diamonds/princess.glb',
        'Emerald': '/models/diamonds/round.glb',  // fallback to round
        'Cushion': '/models/diamonds/round.glb',
        'Pear': '/models/diamonds/oval.glb',
        'Radiant': '/models/diamonds/princess.glb',
    };

    const looseDiamonds = [];
    for (let i = 0; i < 60; i++) {
        const carat = parseFloat((Math.random() * (4.5 - 0.5) + 0.5).toFixed(2));
        const price = Math.round((carat * 120000) * (Math.random() * 0.4 + 0.8)); 
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        looseDiamonds.push({
            shape,
            caratWeight: carat,
            cut: cuts[Math.floor(Math.random() * cuts.length)],
            clarity: clarities[Math.floor(Math.random() * clarities.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            certification: certs[Math.floor(Math.random() * certs.length)],
            price: price,
            stockStatus: Math.random() > 0.15 ? 'AVAILABLE' : 'SOLD',
            imageUrl: IMAGES.looseDiamond,
            modelUrl: diamondModelMap[shape] ?? '/models/diamonds/round.glb',
        });
    }

    await prisma.diamond.createMany({
        data: looseDiamonds
    });

    console.log('Seeding Realistic Ring Settings for Customizer...');
    const ringSettings = [
        {
            name: 'The Crown Solitaire',
            description: 'A majestic 6-prong solitaire setting designed to elevate and maximize the brilliance of your center diamond.',
            price: 45000,
            imageUrl: IMAGES.setting1,
            modelUrl: '/models/settings/solitaire.glb',
            category: 'Solitaire'
        },
        {
            name: 'Eternity Hidden Halo',
            description: 'Features an invisible halo of diamonds beneath the center stone, enhancing its presence from every angle.',
            price: 85000,
            imageUrl: IMAGES.setting2,
            modelUrl: '/models/settings/halo.glb',
            category: 'Halo'
        },
        {
            name: 'Heritage Milgrain',
            description: 'Intricate milgrain detailing and vintage engravings hand-crafted into a romantic, timeless 18K gold band.',
            price: 95000,
            imageUrl: IMAGES.ring4,
            modelUrl: '/models/settings/pave.glb',
            category: 'Vintage'
        },
        {
            name: 'The Trinity Setting',
            description: 'Two perfectly matched brilliant side stones complement your center diamond, symbolizing past, present, and future.',
            price: 120000,
            imageUrl: IMAGES.ring1,
            modelUrl: '/models/settings/solitaire.glb',
            category: 'Three-Stone'
        },
        {
            name: 'Cathedral Pavé Sweep',
            description: 'Elegant cathedral shoulders sweep up to the center stone, flanked by a dazzling channel of pavé diamonds.',
            price: 110000,
            imageUrl: IMAGES.ring2,
            modelUrl: '/models/settings/pave.glb',
            category: 'Side-Stones'
        }
    ];

    for (const setting of ringSettings) {
        await prisma.setting.create({ data: setting });
    }

    console.log('Seeding complete! Database is now populated with authentic ZYNORA LUXE realistic assets.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

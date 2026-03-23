import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'nisargp631@gmail.com';
    const plainTextPassword = '123456789';

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

    // Upsert ensures we create it if it doesn't exist, or update the password/role if it does
    const adminUser = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
        },
        create: {
            email,
            name: 'Krishna Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log(`✅ Admin user configured securely: ${adminUser.email}`);
    console.log(`Role: ${adminUser.role}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

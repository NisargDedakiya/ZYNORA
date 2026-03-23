import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";

const prisma = new PrismaClient();

async function main() {
    const settings = await prisma.setting.findMany({ select: { id: true, name: true, modelUrl: true } });
    const diamonds = await prisma.diamond.findMany({ select: { id: true, shape: true, modelUrl: true }, take: 5 });
    let out = "=== SETTINGS ===\n";
    for (const s of settings) {
        out += `  name: ${s.name}, modelUrl: ${s.modelUrl}\n`;
    }
    out += "\n=== DIAMONDS (first 5) ===\n";
    for (const d of diamonds) {
        out += `  shape: ${d.shape}, modelUrl: ${d.modelUrl}\n`;
    }
    writeFileSync("models_out.txt", out, "utf8");
}

main().catch(console.error).finally(() => prisma.$disconnect());

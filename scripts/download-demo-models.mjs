import fs from 'fs';
import path from 'path';

const PUBLIC_MODELS_DIR = path.join(process.cwd(), 'public', 'models');

// We use Box and Lantern from Khronos group for open-source demonstration placeholders
const KHRONOS_BOX = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb';
const KHRONOS_LANTERN = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb';
const KHRONOS_WATERBOTTLE = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb';

const demoModels = [
    { url: KHRONOS_BOX, dest: path.join(PUBLIC_MODELS_DIR, 'settings', 'solitaire.glb') },
    { url: KHRONOS_BOX, dest: path.join(PUBLIC_MODELS_DIR, 'settings', 'halo.glb') },
    { url: KHRONOS_BOX, dest: path.join(PUBLIC_MODELS_DIR, 'settings', 'pave.glb') },
    { url: KHRONOS_LANTERN, dest: path.join(PUBLIC_MODELS_DIR, 'diamonds', 'round.glb') },
    { url: KHRONOS_LANTERN, dest: path.join(PUBLIC_MODELS_DIR, 'diamonds', 'oval.glb') },
    { url: KHRONOS_LANTERN, dest: path.join(PUBLIC_MODELS_DIR, 'diamonds', 'princess.glb') },
    { url: KHRONOS_WATERBOTTLE, dest: path.join(PUBLIC_MODELS_DIR, 'jewelry', 'necklace.glb') },
    { url: KHRONOS_WATERBOTTLE, dest: path.join(PUBLIC_MODELS_DIR, 'jewelry', 'earrings.glb') },
];

async function downloadFile(url, dest) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
}

async function run() {
    for (const d of demoModels) {
        fs.mkdirSync(path.dirname(d.dest), { recursive: true });
        console.log(`Downloading ${d.dest}...`);
        await downloadFile(d.url, d.dest);
    }
    console.log('All demo models populated!');
}

run();

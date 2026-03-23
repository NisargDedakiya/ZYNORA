import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_PRODUCTS_DIR = path.join(__dirname, 'public', 'products');
const PUBLIC_IMAGES_DIR = path.join(__dirname, 'public', 'images');

const downloads = [
    { url: 'https://images.unsplash.com/photo-1605100804763-247f66126e04?auto=format&fit=crop&q=80&w=1200', dest: path.join(PUBLIC_PRODUCTS_DIR, 'ring-1.jpg') },
    { url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=1200', dest: path.join(PUBLIC_PRODUCTS_DIR, 'ring-2.jpg') },
    { url: 'https://images.unsplash.com/photo-1515562141207-7a8efd3facc6?auto=format&fit=crop&q=80&w=1200', dest: path.join(PUBLIC_PRODUCTS_DIR, 'ring-3.jpg') },
    { url: 'https://images.unsplash.com/photo-1599440613865-ecd3683aef19?auto=format&fit=crop&q=80&w=1200', dest: path.join(PUBLIC_PRODUCTS_DIR, 'ring-4.jpg') },
    { url: 'https://images.unsplash.com/photo-1599643478514-46b5d911a337?auto=format&fit=crop&q=80&w=1200', dest: path.join(PUBLIC_PRODUCTS_DIR, 'necklace-1.jpg') },
    { url: 'https://images.unsplash.com/photo-1611566026373-86d34bbf37c9?auto=format&fit=crop&q=80&w=1200', dest: path.join(PUBLIC_PRODUCTS_DIR, 'necklace-2.jpg') },
    { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200', dest: path.join(PUBLIC_PRODUCTS_DIR, 'earrings-1.jpg') },
    { url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800', dest: path.join(PUBLIC_PRODUCTS_DIR, 'loose-diamond.jpg') },
    { url: 'https://images.unsplash.com/photo-1605100804763-247f66126e04?auto=format&fit=crop&q=80&w=800', dest: path.join(PUBLIC_PRODUCTS_DIR, 'setting-1.jpg') },
    { url: 'https://images.unsplash.com/photo-1515562141207-7a8efd3facc6?auto=format&fit=crop&q=80&w=800', dest: path.join(PUBLIC_PRODUCTS_DIR, 'setting-2.jpg') },
    // Additional images for public/images
    { url: 'https://images.unsplash.com/photo-1599643478514-4fb9820f1889?auto=format&fit=crop&q=80&w=2000', dest: path.join(PUBLIC_IMAGES_DIR, 'hero.jpg') },
    { url: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&q=80&w=1200', dest: path.join(PUBLIC_IMAGES_DIR, 'about1.jpg') },
    { url: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=2000', dest: path.join(PUBLIC_IMAGES_DIR, 'about2.jpg') },
    { url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1920', dest: path.join(PUBLIC_IMAGES_DIR, 'about3.jpg') },
    { url: 'https://images.unsplash.com/photo-1579782509172-1320efab567c?auto=format&fit=crop&q=80&w=1000', dest: path.join(PUBLIC_IMAGES_DIR, 'about4.jpg') },
    { url: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=1920', dest: path.join(PUBLIC_IMAGES_DIR, 'about5.jpg') },
    { url: 'https://images.unsplash.com/photo-1629807579040-cfc6df9f0293?q=80&w=200&auto=format&fit=crop', dest: path.join(PUBLIC_IMAGES_DIR, 'diamond-fallback.jpg') },
    { url: 'https://images.unsplash.com/photo-1611566026373-86d34bbf37c9?auto=format&fit=crop&q=80&w=600', dest: path.join(PUBLIC_IMAGES_DIR, 'product-fallback.jpg') },
];

async function downloadFile(url, dest) {
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,*/*'
        }
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
}

async function run() {
    console.log(`Starting downloads for images...`);
    for (const d of downloads) {
        try {
            await downloadFile(d.url, d.dest);
            console.log(`[SUCCESS] Downloaded to ${path.basename(d.dest)}`);
        } catch(e) {
            console.error(`[ERROR] Processing ${d.url}: ${e.message}`);
        }
    }
    console.log('All image downloads completed.');
}

run();

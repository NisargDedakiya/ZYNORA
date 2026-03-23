import PDFDocument from 'pdfkit';
import { Writable } from 'stream';

// Define the shape of our order for the invoice
interface InvoiceData {
    id: string;
    createdAt: Date;
    customer: {
        name: string;
        email: string;
        phone?: string;
        address?: string;
        city?: string;
        pincode?: string;
    };
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
    subtotal: number;
    gstAmount: number;
    gstType: string;
    totalAmount: number;
    billingState: string;
    gstNumber?: string | null;
}

export async function generateInvoicePDF(order: InvoiceData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const chunks: Buffer[] = [];

            // Collect buffers
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', (err) => reject(err));

            // --- HEADER ---
            doc.fontSize(24).font('Helvetica-Bold').fillColor('#C6A14A').text('ZYNORA LUXE', { align: 'center' });
            doc.fontSize(10).fillColor('#333333').text('India\'s Trusted Diamond Destination', { align: 'center' });
            doc.moveDown(2);

            // --- COMPANY & INVOICE DETAILS ---
            const topY = doc.y;

            // Left Side: Company Details
            doc.fontSize(10).font('Helvetica-Bold').text('ZYNORA LUXE HQ', 50, topY);
            doc.font('Helvetica').text('Diamond Park, Surat');
            doc.text('Gujarat, India - 395004');
            doc.text('GSTIN: 24AAACK1234D1Z5');

            // Right Side: Invoice Details
            doc.font('Helvetica-Bold').text('TAX INVOICE', 400, topY, { align: 'right' });
            doc.font('Helvetica').text(`Invoice #: INV-${order.id.substring(0, 8).toUpperCase()}`, { align: 'right' });
            doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, { align: 'right' });

            doc.moveDown(3);

            // --- BILL TO ---
            doc.font('Helvetica-Bold').text('BILL TO:', 50, doc.y);
            doc.font('Helvetica').text(order.customer.name);
            doc.text(order.customer.email);
            if (order.customer.phone) doc.text(`Phone: ${order.customer.phone}`);
            if (order.customer.address) doc.text(order.customer.address);
            if (order.customer.city) doc.text(`${order.customer.city}, ${order.billingState} - ${order.customer.pincode}`);
            if (order.gstNumber) doc.font('Helvetica-Bold').text(`Customer GSTIN: ${order.gstNumber}`);

            doc.moveDown(2);

            // --- ITEMS TABLE ---
            const tableTop = doc.y;
            const col1 = 50;  // Item
            const col2 = 350; // Qty
            const col3 = 400; // Price
            const col4 = 480; // Total

            // Table Header
            doc.font('Helvetica-Bold').fillColor('#C6A14A');
            doc.text('Item Description', col1, tableTop);
            doc.text('Qty', col2, tableTop, { align: 'center', width: 50 });
            doc.text('Price (INR)', col3, tableTop, { align: 'right', width: 70 });
            doc.text('Total (INR)', col4, tableTop, { align: 'right' });

            // Render line
            doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).strokeColor('#ede8de').stroke();
            doc.moveDown(1);

            let currentY = doc.y;

            // Table Rows
            doc.font('Helvetica').fillColor('#333333');
            order.items.forEach(item => {
                doc.text(item.name, col1, currentY, { width: 280 });
                doc.text(item.quantity.toString(), col2, currentY, { align: 'center', width: 50 });
                doc.text(item.price.toLocaleString('en-IN'), col3, currentY, { align: 'right', width: 70 });
                doc.text((item.price * item.quantity).toLocaleString('en-IN'), col4, currentY, { align: 'right' });

                // Advance Y and draw subtle separating line
                currentY = doc.y + 10;
                doc.moveTo(50, currentY - 5).lineTo(550, currentY - 5).strokeColor('#f9f9f9').stroke();
            });

            // --- TOTALS ---
            doc.moveDown(2);
            currentY = doc.y;

            doc.font('Helvetica-Bold');
            doc.text('Subtotal:', 350, currentY, { align: 'right', width: 100 });
            doc.font('Helvetica').text(order.subtotal.toLocaleString('en-IN'), col4, currentY, { align: 'right' });

            currentY += 20;

            // Render precise GST breakdown
            if (order.gstType === 'IGST') {
                doc.font('Helvetica-Bold').text('IGST (18%):', 350, currentY, { align: 'right', width: 100 });
                doc.font('Helvetica').text(order.gstAmount.toLocaleString('en-IN'), col4, currentY, { align: 'right' });
                currentY += 20;
            } else {
                // CGST + SGST (9% Each)
                const halfGst = order.gstAmount / 2;
                doc.font('Helvetica-Bold').text('CGST (9%):', 350, currentY, { align: 'right', width: 100 });
                doc.font('Helvetica').text(halfGst.toLocaleString('en-IN'), col4, currentY, { align: 'right' });
                currentY += 20;
                doc.font('Helvetica-Bold').text('SGST (9%):', 350, currentY, { align: 'right', width: 100 });
                doc.font('Helvetica').text(halfGst.toLocaleString('en-IN'), col4, currentY, { align: 'right' });
                currentY += 20;
            }

            // Grand Total
            doc.moveTo(350, currentY - 5).lineTo(550, currentY - 5).strokeColor('#C6A14A').stroke();
            doc.font('Helvetica-Bold').fillColor('#C6A14A').fontSize(14);
            doc.text('GRAND TOTAL:', 300, currentY + 5, { align: 'right', width: 150 });
            doc.text(`Rs. ${order.totalAmount.toLocaleString('en-IN')}`, col4 - 20, currentY + 5, { align: 'right', width: 90 });

            // --- FOOTER ---
            doc.fontSize(10).fillColor('#999999').font('Helvetica');
            doc.text('Thank you for choosing ZYNORA LUXE.', 50, doc.page.height - 100, { align: 'center' });
            doc.text('This is a computer-generated invoice and does not require a signature.', 50, doc.page.height - 85, { align: 'center' });

            // Finalize PDF
            doc.end();

        } catch (error) {
            reject(error);
        }
    });
}

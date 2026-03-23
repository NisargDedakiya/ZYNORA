/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import { generateInvoicePDF } from './invoice-generator';

// A realistic mock email sender for environment without SMTP configuration
// In production, configure with exact Host/Port securely
export async function sendInvoiceEmail(orderData: any): Promise<boolean> {
    try {
        // Generate the PDF Buffer using our accurate GST invoice generator
        const pdfBuffer = await generateInvoicePDF(orderData);

        // Console log for demo/verification without real credentials
        console.log(`\n=============================================`);
        console.log(`[EMAIL SENDING SIMULATION]`);
        console.log(`To: ${orderData.customer.email}`);
        console.log(`Subject: Your ZYNORA LUXE Tax Invoice (Order #${orderData.id})`);
        console.log(`Attachment: Invoice_INV-${orderData.id.substring(0, 8).toUpperCase()}.pdf (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);
        console.log(`=============================================\n`);

        // If real SMTP variables are provided in .env, send the actual email
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: `"ZYNORA LUXE" <${process.env.SMTP_FROM || 'sales@zynoraluxe.com'}>`,
                to: orderData.customer.email,
                subject: `Your ZYNORA LUXE Tax Invoice (Order #${orderData.id})`,
                html: `
                    <div style="font-family: sans-serif; color: #333;">
                        <h2 style="color: #C6A14A;">Thank you for your purchase!</h2>
                        <p>Dear ${orderData.customer.name},</p>
                        <p>We have successfully received your payment. Please find your detailed GST Tax Invoice attached to this email.</p>
                        <br/>
                        <p>Total Paid: <strong>Rs. ${orderData.totalAmount.toLocaleString('en-IN')}</strong></p>
                        <p>If you have any questions regarding your order, please do not hesitate to contact our support team.</p>
                        <br/>
                        <p>Warm regards,</p>
                        <p><strong>ZYNORA LUXE Team</strong></p>
                    </div>
                `,
                attachments: [
                    {
                        filename: `Invoice_INV-${orderData.id.substring(0, 8).toUpperCase()}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
            });
            console.log("Real SMTP email successfully sent.");
        }

        return true;
    } catch (error) {
        console.error("Error generating/sending invoice email:", error);
        return false;
    }
}

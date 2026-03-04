import nodemailer from 'nodemailer';
import Invoice from '../models/Invoice.js';

// @desc    Send invoice via email to client
// @route   POST /api/invoices/:id/send-email
// @access  Private
const sendInvoiceEmail = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Check ownership
        if (invoice.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (!invoice.clientEmail) {
            return res.status(400).json({ message: 'Client email not found on this invoice' });
        }

        // Build items HTML rows
        const itemRows = invoice.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.description || '-'}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${Number(item.price).toFixed(2)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
        `).join('');

        // Tax rows
        let taxRows = '';
        if (invoice.taxType === 'CGST_SGST') {
            const halfTax = (invoice.taxAmount / 2).toFixed(2);
            taxRows = `
                <tr>
                    <td colspan="3" style="padding: 8px; text-align: right;">CGST (${invoice.taxRate / 2}%)</td>
                    <td style="padding: 8px; text-align: right;">₹${halfTax}</td>
                </tr>
                <tr>
                    <td colspan="3" style="padding: 8px; text-align: right;">SGST (${invoice.taxRate / 2}%)</td>
                    <td style="padding: 8px; text-align: right;">₹${halfTax}</td>
                </tr>
            `;
        } else {
            taxRows = `
                <tr>
                    <td colspan="3" style="padding: 8px; text-align: right;">IGST (${invoice.taxRate}%)</td>
                    <td style="padding: 8px; text-align: right;">₹${invoice.taxAmount?.toFixed(2) || '0.00'}</td>
                </tr>
            `;
        }

        const emailHTML = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">INVOICE</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">From Invoice Pro</p>
            </div>
            
            <div style="padding: 30px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
                    <div>
                        <h3 style="margin: 0 0 5px; color: #333;">Bill To:</h3>
                        <p style="margin: 0; color: #555;">${invoice.clientName}</p>
                        <p style="margin: 0; color: #888;">${invoice.clientEmail}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="margin: 0; color: #555;"><strong>Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}</p>
                        ${invoice.dueDate ? `<p style="margin: 0; color: #555;"><strong>Due:</strong> ${new Date(invoice.dueDate).toLocaleDateString('en-IN')}</p>` : ''}
                        <p style="margin: 5px 0 0;"><span style="padding: 3px 10px; border-radius: 12px; font-size: 12px; background: ${invoice.status === 'Paid' ? '#d4edda' : invoice.status === 'Overdue' ? '#f8d7da' : '#fff3cd'}; color: ${invoice.status === 'Paid' ? '#155724' : invoice.status === 'Overdue' ? '#721c24' : '#856404'};">${invoice.status}</span></p>
                    </div>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Description</th>
                            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
                            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
                            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemRows}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="padding: 8px; text-align: right; font-weight: 500;">Subtotal</td>
                            <td style="padding: 8px; text-align: right;">₹${invoice.subtotal?.toFixed(2) || '0.00'}</td>
                        </tr>
                        ${taxRows}
                        <tr style="background: #f8f9fa;">
                            <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; font-size: 16px; border-top: 2px solid #333;">Grand Total</td>
                            <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 18px; color: #667eea; border-top: 2px solid #333;">₹${invoice.total?.toFixed(2) || '0.00'}</td>
                        </tr>
                    </tfoot>
                </table>
                
                ${invoice.notes ? `<div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 15px;"><strong>Notes:</strong><br/><span style="color: #666;">${invoice.notes}</span></div>` : ''}
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                <p style="margin: 0; color: #888; font-size: 13px;">This invoice was generated by <strong>Invoice Pro</strong></p>
            </div>
        </div>
        `;

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send email
        await transporter.sendMail({
            from: `"Invoice Pro" <${process.env.EMAIL_USER}>`,
            to: invoice.clientEmail,
            subject: `Invoice from Invoice Pro - ₹${invoice.total?.toFixed(2) || '0.00'}`,
            html: emailHTML,
        });

        res.json({ message: `Invoice emailed successfully to ${invoice.clientEmail}` });
    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).json({ message: 'Failed to send email. Check server email configuration.', error: error.message });
    }
};

export { sendInvoiceEmail };

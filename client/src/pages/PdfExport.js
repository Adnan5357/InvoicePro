import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PdfExport = () => {
    const invoiceRef = useRef(null);

    // Mock data for preview
    const mockInvoice = {
        id: 'INV-2023-001',
        client: 'Acme Corp',
        date: '2023-10-25',
        amount: 5000,
        items: [
            { description: 'Web Development', quantity: 1, price: 3000 },
            { description: 'Hosting (1 Year)', quantity: 1, price: 2000 }
        ]
    };

    const handleDownload = async () => {
        if (!invoiceRef.current) return;

        try {
            const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
            const data = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProperties = pdf.getImageProperties(data);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

            pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice_${mockInvoice.id}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF");
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Invoice ${mockInvoice.id}`,
                    text: `Invoice for ${mockInvoice.client} - Total: ₹${mockInvoice.amount}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            alert('Web Share API is not supported in this browser. You can manually copy the URL.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <h2 className="mb-4">Export & Share Invoice</h2>

                <div className="row">
                    <div className="col-md-8">
                        {/* Invoice Preview Area - This is what gets printed */}
                        <div className="card shadow-sm p-5 mb-4" ref={invoiceRef}>
                            <div className="d-flex justify-content-between mb-4">
                                <div>
                                    <h3 className="fw-bold text-primary">INVOICE</h3>
                                    <p className="text-muted">#{mockInvoice.id}</p>
                                </div>
                                <div className="text-end">
                                    <h5 className="mb-0">Invoice Pro</h5>
                                    <p className="small text-muted">123 Business Rd<br />Tech City, India</p>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-6">
                                    <h6 className="fw-bold">Bill To:</h6>
                                    <p className="mb-0">{mockInvoice.client}</p>
                                </div>
                                <div className="col-6 text-end">
                                    <p className="mb-0"><span className="fw-bold">Date:</span> {mockInvoice.date}</p>
                                </div>
                            </div>

                            <table className="table table-bordered">
                                <thead className="table-light">
                                    <tr>
                                        <th>Description</th>
                                        <th className="text-center">Qty</th>
                                        <th className="text-end">Price</th>
                                        <th className="text-end">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockInvoice.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.description}</td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-end">₹{item.price.toFixed(2)}</td>
                                            <td className="text-end">₹{(item.quantity * item.price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="3" className="text-end fw-bold">Grand Total</td>
                                        <td className="text-end fw-bold fs-5">₹{mockInvoice.amount.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>

                            <div className="mt-4 text-center text-muted small">
                                <p>Thank you for your business!</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                            <h4 className="mb-3">Actions</h4>
                            <p className="text-muted small mb-4">Choose how you want to export this invoice.</p>

                            <div className="d-grid gap-3">
                                <button className="btn btn-primary" onClick={handleDownload}>
                                    <i className="bi bi-file-earmark-pdf me-2"></i> Download PDF
                                </button>
                                <button className="btn btn-outline-primary" onClick={handleShare}>
                                    <i className="bi bi-share me-2"></i> Share Invoice
                                </button>
                                <button className="btn btn-outline-secondary" onClick={() => alert('Email functionality would verify backend integration.')}>
                                    <i className="bi bi-envelope me-2"></i> Email to Client
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PdfExport;

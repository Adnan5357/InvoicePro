import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PdfExport = () => {
    const [searchParams] = useSearchParams();
    const invoiceRef = useRef(null);

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);

    // Fetch all invoices on mount
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await api.get('/invoices');
                setInvoices(response.data);

                // If an invoice ID was passed via query param, auto-select it
                const invoiceId = searchParams.get('id');
                if (invoiceId) {
                    const found = response.data.find(inv => inv._id === invoiceId);
                    if (found) setSelectedInvoice(found);
                }
            } catch (error) {
                console.error('Error fetching invoices:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [searchParams]);

    // Filter invoices based on search
    const filteredInvoices = invoices.filter(inv => {
        const term = searchTerm.toLowerCase();
        return (
            inv.clientName?.toLowerCase().includes(term) ||
            inv._id.toLowerCase().includes(term) ||
            inv.clientEmail?.toLowerCase().includes(term)
        );
    });

    // Calculate totals for a given invoice
    const getInvoiceTotals = (inv) => {
        const subtotal = inv.subtotal || inv.items?.reduce((acc, item) => acc + (item.quantity * item.price), 0) || 0;
        const taxAmount = inv.taxAmount || (subtotal * (inv.taxRate || 18)) / 100;
        const total = inv.total || subtotal + taxAmount;
        return { subtotal, taxAmount, total };
    };

    // Download as PDF
    const handleDownload = async () => {
        if (!invoiceRef.current || !selectedInvoice) return;
        setDownloading(true);

        try {
            const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
            const data = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProperties = pdf.getImageProperties(data);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

            pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice_${selectedInvoice.clientName || 'invoice'}_${selectedInvoice._id.substring(0, 8)}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF");
        } finally {
            setDownloading(false);
        }
    };

    // Share invoice via Web Share API (shares the PDF as a file if supported)
    const handleShare = async () => {
        if (!selectedInvoice) return;

        // Try to share as a PDF file first
        if (invoiceRef.current && navigator.canShare) {
            try {
                const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
                const data = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProperties = pdf.getImageProperties(data);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
                pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);

                const pdfBlob = pdf.output('blob');
                const fileName = `invoice_${selectedInvoice.clientName || 'invoice'}_${selectedInvoice._id.substring(0, 8)}.pdf`;
                const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: `Invoice - ${selectedInvoice.clientName}`,
                        text: `Invoice for ${selectedInvoice.clientName} - Total: ₹${getInvoiceTotals(selectedInvoice).total.toFixed(2)}`,
                        files: [file],
                    });
                    return;
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log('File share failed, falling back to text share:', error);
                } else {
                    return; // User cancelled
                }
            }
        }

        // Fallback: share text only
        if (navigator.share) {
            try {
                const { total } = getInvoiceTotals(selectedInvoice);
                await navigator.share({
                    title: `Invoice - ${selectedInvoice.clientName}`,
                    text: `Invoice for ${selectedInvoice.clientName}\nTotal: ₹${total.toFixed(2)}\nDate: ${new Date(selectedInvoice.invoiceDate).toLocaleDateString('en-IN')}`,
                    url: window.location.href,
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log('Error sharing:', error);
                }
            }
        } else {
            alert('Web Share API is not supported in this browser. Please use the Download PDF option instead.');
        }
    };

    // Send email
    const handleSendEmail = async () => {
        if (!selectedInvoice) return;
        setSendingEmail(true);
        try {
            const response = await api.post(`/invoices/${selectedInvoice._id}/send-email`);
            alert(response.data.message || 'Email sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            alert(error.response?.data?.message || 'Failed to send email.');
        } finally {
            setSendingEmail(false);
        }
    };

    // Get user name for the invoice header
    const getUserName = () => {
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            return user?.name || 'My Business';
        } catch {
            return 'My Business';
        }
    };

    // Render the invoice preview
    const renderInvoicePreview = (inv) => {
        if (!inv) return null;
        const { subtotal, taxAmount, total } = getInvoiceTotals(inv);

        return (
            <div ref={invoiceRef} style={{ padding: '40px', background: '#fff', fontFamily: 'Arial, sans-serif' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h3 className="fw-bold text-primary mb-0">INVOICE</h3>
                        <p className="text-muted small">#{inv._id.substring(0, 12)}</p>
                    </div>
                    <div className="text-end">
                        <h5 className="mb-0">Invoice Pro</h5>
                        <p className="small text-muted mb-0">{getUserName()}</p>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-6">
                        <h6 className="fw-bold">Bill To:</h6>
                        <p className="mb-0">{inv.clientName}</p>
                        <p className="mb-0 text-muted">{inv.clientEmail}</p>
                    </div>
                    <div className="col-6 text-end">
                        <p className="mb-1"><span className="fw-bold">Date:</span> {new Date(inv.invoiceDate).toLocaleDateString('en-IN')}</p>
                        {inv.dueDate && <p className="mb-1"><span className="fw-bold">Due Date:</span> {new Date(inv.dueDate).toLocaleDateString('en-IN')}</p>}
                        <p className="mb-0">
                            <span className={`badge ${inv.status === 'Paid' ? 'bg-success' : inv.status === 'Overdue' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                {inv.status}
                            </span>
                        </p>
                    </div>
                </div>

                <table className="table table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>Description</th>
                            <th className="text-center">Qty</th>
                            <th className="text-end">Price</th>
                            <th className="text-end">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inv.items?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.description || '-'}</td>
                                <td className="text-center">{item.quantity}</td>
                                <td className="text-end">₹{Number(item.price).toFixed(2)}</td>
                                <td className="text-end">₹{(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3" className="text-end">Subtotal</td>
                            <td className="text-end">₹{subtotal.toFixed(2)}</td>
                        </tr>
                        {inv.taxType === 'CGST_SGST' ? (
                            <>
                                <tr>
                                    <td colSpan="3" className="text-end">CGST ({(inv.taxRate || 18) / 2}%)</td>
                                    <td className="text-end">₹{(taxAmount / 2).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="text-end">SGST ({(inv.taxRate || 18) / 2}%)</td>
                                    <td className="text-end">₹{(taxAmount / 2).toFixed(2)}</td>
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-end">IGST ({inv.taxRate || 18}%)</td>
                                <td className="text-end">₹{taxAmount.toFixed(2)}</td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="3" className="text-end fw-bold border-top-2">Grand Total</td>
                            <td className="text-end fw-bold fs-5 border-top-2">₹{total.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                {inv.notes && (
                    <div className="mt-3">
                        <h6 className="fw-bold">Notes:</h6>
                        <p className="small text-muted">{inv.notes}</p>
                    </div>
                )}

                <div className="mt-4 text-center text-muted small">
                    <p>Thank you for your business!</p>
                </div>
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <h2 className="mb-4">Export & Share Invoice</h2>

                <div className="row">
                    {/* Left: Invoice Preview */}
                    <div className="col-md-8">
                        {selectedInvoice ? (
                            <div className="card shadow-sm mb-4">
                                {renderInvoicePreview(selectedInvoice)}
                            </div>
                        ) : (
                            <div className="card shadow-sm p-5 mb-4 text-center">
                                <div className="py-5">
                                    <i className="bi bi-file-earmark-pdf" style={{ fontSize: '4rem', color: '#dee2e6' }}></i>
                                    <h4 className="mt-3 text-muted">No Invoice Selected</h4>
                                    <p className="text-muted">Select an invoice from the list on the right to preview and export it as a PDF.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Invoice Selector + Actions */}
                    <div className="col-md-4">
                        {/* Actions Card */}
                        <div className="card shadow-sm p-4 mb-4">
                            <h5 className="mb-3">
                                <i className="bi bi-lightning me-2"></i>Actions
                            </h5>
                            {selectedInvoice ? (
                                <>
                                    <p className="text-muted small mb-2">
                                        Selected: <strong>{selectedInvoice.clientName}</strong>
                                        <br />
                                        <span className="text-muted">₹{getInvoiceTotals(selectedInvoice).total.toFixed(2)}</span>
                                    </p>
                                    <div className="d-grid gap-2">
                                        <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}>
                                            <i className={`bi ${downloading ? 'bi-hourglass-split' : 'bi-file-earmark-pdf'} me-2`}></i>
                                            {downloading ? 'Generating...' : 'Download PDF'}
                                        </button>
                                        <button className="btn btn-outline-primary" onClick={handleShare}>
                                            <i className="bi bi-share me-2"></i> Share Invoice
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={handleSendEmail}
                                            disabled={sendingEmail}
                                        >
                                            <i className={`bi ${sendingEmail ? 'bi-hourglass-split' : 'bi-envelope'} me-2`}></i>
                                            {sendingEmail ? 'Sending...' : 'Email to Client'}
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm mt-2"
                                            onClick={() => setSelectedInvoice(null)}
                                        >
                                            <i className="bi bi-x-circle me-1"></i> Clear Selection
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p className="text-muted small mb-0">
                                    Select an invoice below to enable export actions.
                                </p>
                            )}
                        </div>

                        {/* Invoice List Card */}
                        <div className="card shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                            <h5 className="mb-3">
                                <i className="bi bi-list-ul me-2"></i>Your Invoices
                            </h5>
                            <input
                                type="text"
                                className="form-control form-control-sm mb-3"
                                placeholder="Search by client, ID, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            {loading ? (
                                <div className="text-center py-3">
                                    <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                    <p className="small text-muted mt-2 mb-0">Loading invoices...</p>
                                </div>
                            ) : filteredInvoices.length > 0 ? (
                                <div className="list-group" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {filteredInvoices.map((inv) => {
                                        const { total } = getInvoiceTotals(inv);
                                        const isSelected = selectedInvoice?._id === inv._id;
                                        return (
                                            <button
                                                key={inv._id}
                                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-start ${isSelected ? 'active' : ''}`}
                                                onClick={() => setSelectedInvoice(inv)}
                                            >
                                                <div className="ms-0 me-auto">
                                                    <div className="fw-bold small">{inv.clientName}</div>
                                                    <small className={isSelected ? 'text-white-50' : 'text-muted'}>
                                                        {new Date(inv.invoiceDate).toLocaleDateString('en-IN')}
                                                    </small>
                                                </div>
                                                <div className="text-end">
                                                    <span className="fw-bold small">₹{total.toFixed(2)}</span>
                                                    <br />
                                                    <span className={`badge ${inv.status === 'Paid' ? 'bg-success' : inv.status === 'Overdue' ? 'bg-danger' : 'bg-warning text-dark'}`} style={{ fontSize: '0.65rem' }}>
                                                        {inv.status}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-3">
                                    <i className="bi bi-inbox text-muted" style={{ fontSize: '2rem' }}></i>
                                    <p className="small text-muted mt-2 mb-0">
                                        {invoices.length === 0 ? 'No invoices yet. Create one first!' : 'No matching invoices found.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PdfExport;

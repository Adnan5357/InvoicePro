import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const InvoiceHistory = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sendingEmailId, setSendingEmailId] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);
    const [viewInvoice, setViewInvoice] = useState(null);
    const invoicePreviewRef = useRef(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await api.get('/invoices');
                setInvoices(response.data);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    const filteredInvoices = invoices.filter(inv => {
        const matchesFilter = filter === 'All' || inv.status === filter;
        const matchesSearch = inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv._id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Paid': return <span className="badge bg-success">Paid</span>;
            case 'Pending': return <span className="badge bg-warning text-dark">Pending</span>;
            case 'Overdue': return <span className="badge bg-danger">Overdue</span>;
            default: return <span className="badge bg-secondary">{status}</span>;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
            try {
                await api.delete(`/invoices/${id}`);
                setInvoices(invoices.filter(inv => inv._id !== id));
                alert('Invoice deleted successfully');
            } catch (error) {
                console.error('Error deleting invoice:', error);
                alert('Failed to delete invoice');
            }
        }
    };

    const handleSendEmail = async (id) => {
        setSendingEmailId(id);
        try {
            const response = await api.post(`/invoices/${id}/send-email`);
            alert(response.data.message || 'Email sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            alert(error.response?.data?.message || 'Failed to send email.');
        } finally {
            setSendingEmailId(null);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        setUpdatingStatusId(id);
        try {
            const response = await api.put(`/invoices/${id}/status`, { status: newStatus });
            setInvoices(invoices.map(inv => inv._id === id ? { ...inv, status: response.data.status } : inv));
        } catch (error) {
            console.error('Error updating status:', error);
            alert(error.response?.data?.message || 'Failed to update status.');
        } finally {
            setUpdatingStatusId(null);
        }
    };

    // View invoice details
    const handleView = async (id) => {
        try {
            const response = await api.get(`/invoices/${id}`);
            setViewInvoice(response.data);
        } catch (error) {
            console.error('Error fetching invoice:', error);
            alert('Failed to load invoice details.');
        }
    };

    // Download invoice as PDF
    const handleDownload = async (inv) => {
        setDownloadingId(inv._id);
        // Set the invoice to view so it renders in the hidden preview
        setViewInvoice(inv);
        // Wait for render
        setTimeout(async () => {
            try {
                const element = invoicePreviewRef.current;
                if (!element) {
                    alert('Could not generate PDF. Please try again.');
                    setDownloadingId(null);
                    return;
                }
                const canvas = await html2canvas(element, { scale: 2, useCORS: true });
                const data = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProperties = pdf.getImageProperties(data);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
                pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`invoice_${inv.clientName || 'invoice'}_${inv._id.substring(0, 8)}.pdf`);
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Failed to download PDF.');
            } finally {
                setDownloadingId(null);
                setViewInvoice(null);
            }
        }, 300);
    };

    // Render invoice preview (used by both modal and PDF generation)
    const renderInvoicePreview = (inv) => {
        if (!inv) return null;

        const subtotal = inv.subtotal || inv.items?.reduce((acc, item) => acc + (item.quantity * item.price), 0) || 0;
        const taxAmount = inv.taxAmount || (subtotal * (inv.taxRate || 18)) / 100;
        const total = inv.total || subtotal + taxAmount;

        return (
            <div ref={invoicePreviewRef} style={{ padding: '30px', background: '#fff', fontFamily: 'Arial, sans-serif' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h3 className="fw-bold text-primary mb-0">INVOICE</h3>
                        <p className="text-muted small">#{inv._id.substring(0, 12)}</p>
                    </div>
                    <div className="text-end">
                        <h5 className="mb-0">Invoice Pro</h5>
                        <p className="small text-muted mb-0">{(() => { try { const u = JSON.parse(sessionStorage.getItem('user')); return u?.name || 'My Business'; } catch { return 'My Business'; } })()}<br />New Delhi, India</p>
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
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <h2 className="mb-4">Invoice History</h2>

                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by Client or Invoice ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 text-end">
                                <div className="btn-group">
                                    {['All', 'Paid', 'Pending', 'Overdue'].map(status => (
                                        <button
                                            key={status}
                                            className={`btn ${filter === status ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setFilter(status)}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Invoice ID</th>
                                        <th>Client</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">Loading invoices...</td>
                                        </tr>
                                    ) : filteredInvoices.length > 0 ? (
                                        filteredInvoices.map((inv) => (
                                            <tr key={inv._id}>
                                                <td className="fw-bold text-truncate" style={{ maxWidth: '100px' }} title={inv._id}>
                                                    {inv._id.substring(0, 8)}...
                                                </td>
                                                <td>{inv.clientName}</td>
                                                <td>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                                                <td>₹{inv.total?.toFixed(2) || '0.00'}</td>
                                                <td>
                                                    <div className="dropdown">
                                                        <button
                                                            className={`btn btn-sm dropdown-toggle ${inv.status === 'Paid' ? 'btn-success' : inv.status === 'Overdue' ? 'btn-danger' : 'btn-warning text-dark'}`}
                                                            type="button"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                            disabled={updatingStatusId === inv._id}
                                                            style={{ minWidth: '100px' }}
                                                        >
                                                            {updatingStatusId === inv._id ? (
                                                                <><span className="spinner-border spinner-border-sm me-1"></span>Updating...</>
                                                            ) : inv.status}
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                <button
                                                                    className={`dropdown-item ${inv.status === 'Paid' ? 'active' : ''}`}
                                                                    onClick={() => handleStatusChange(inv._id, 'Paid')}
                                                                >
                                                                    <span className="badge bg-success me-2">●</span> Paid
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    className={`dropdown-item ${inv.status === 'Pending' ? 'active' : ''}`}
                                                                    onClick={() => handleStatusChange(inv._id, 'Pending')}
                                                                >
                                                                    <span className="badge bg-warning me-2">●</span> Pending
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    className={`dropdown-item ${inv.status === 'Overdue' ? 'active' : ''}`}
                                                                    onClick={() => handleStatusChange(inv._id, 'Overdue')}
                                                                >
                                                                    <span className="badge bg-danger me-2">●</span> Overdue
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-light me-1"
                                                        title="View Invoice"
                                                        onClick={() => handleView(inv._id)}
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-light me-1"
                                                        title="Download PDF"
                                                        onClick={() => handleDownload(inv)}
                                                        disabled={downloadingId === inv._id}
                                                    >
                                                        <i className={`bi ${downloadingId === inv._id ? 'bi-hourglass-split' : 'bi-download'}`}></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-light me-1"
                                                        title="Send Email"
                                                        onClick={() => handleSendEmail(inv._id)}
                                                        disabled={sendingEmailId === inv._id}
                                                    >
                                                        <i className={`bi ${sendingEmailId === inv._id ? 'bi-hourglass-split' : 'bi-envelope'}`}></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Delete"
                                                        onClick={() => handleDelete(inv._id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-muted">
                                                No invoices found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden invoice preview for PDF generation */}
            {downloadingId && viewInvoice && (
                <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '800px' }}>
                    {renderInvoicePreview(viewInvoice)}
                </div>
            )}

            {/* View Invoice Modal */}
            {viewInvoice && !downloadingId && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="bi bi-file-earmark-text me-2"></i>
                                    Invoice #{viewInvoice._id.substring(0, 8)}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setViewInvoice(null)}></button>
                            </div>
                            <div className="modal-body">
                                {renderInvoicePreview(viewInvoice)}
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        const inv = viewInvoice;
                                        setViewInvoice(null);
                                        setTimeout(() => handleDownload(inv), 100);
                                    }}
                                >
                                    <i className="bi bi-download me-2"></i>Download PDF
                                </button>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => {
                                        handleSendEmail(viewInvoice._id);
                                    }}
                                    disabled={sendingEmailId === viewInvoice._id}
                                >
                                    <i className="bi bi-envelope me-2"></i>
                                    {sendingEmailId === viewInvoice._id ? 'Sending...' : 'Send Email'}
                                </button>
                                <button className="btn btn-secondary" onClick={() => setViewInvoice(null)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InvoiceHistory;

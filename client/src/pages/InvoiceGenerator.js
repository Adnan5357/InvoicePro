import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../services/api';

const InvoiceGenerator = () => {
    const [invoice, setInvoice] = useState({
        clientName: '',
        clientEmail: '',
        invoiceDate: new Date().toISOString().slice(0, 10),
        dueDate: '',
        items: [{ description: '', quantity: 1, price: 0 }],
        taxRate: 18,
        taxType: 'IGST', // or 'CGST_SGST'
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [clients, setClients] = useState([]);
    const invoiceRef = useRef(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get('/clients');
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };
        fetchClients();
    }, []);

    const handleClientSelect = (e) => {
        const clientId = e.target.value;
        if (clientId === '') {
            return;
        }
        const selectedClient = clients.find(c => c._id === clientId);
        if (selectedClient) {
            setInvoice({
                ...invoice,
                clientName: selectedClient.name,
                clientEmail: selectedClient.email
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInvoice({ ...invoice, [name]: value });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const items = [...invoice.items];
        items[index][name] = value;
        setInvoice({ ...invoice, items });
    };

    const addItem = () => {
        setInvoice({ ...invoice, items: [...invoice.items, { description: '', quantity: 1, price: 0 }] });
    };

    const removeItem = (index) => {
        const items = [...invoice.items];
        items.splice(index, 1);
        setInvoice({ ...invoice, items });
    };

    const calculateTotals = () => {
        const subtotal = invoice.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.price)), 0);
        const taxAmount = (subtotal * Number(invoice.taxRate)) / 100;
        const total = subtotal + taxAmount;

        return {
            subtotal: subtotal.toFixed(2),
            taxAmount: taxAmount.toFixed(2),
            total: total.toFixed(2)
        };
    };

    const totals = calculateTotals();

    const handleDownloadPDF = async () => {
        const element = invoiceRef.current;
        const canvas = await html2canvas(element, { scale: 2 });
        const data = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice_${invoice.clientName || 'draft'}.pdf`);
    };

    const handleSaveInvoice = async () => {
        setLoading(true);
        try {
            // Ensure numeric values are sent as numbers
            const invoiceData = {
                ...invoice,
                items: invoice.items.map(item => ({
                    ...item,
                    quantity: Number(item.quantity),
                    price: Number(item.price)
                })),
                taxRate: Number(invoice.taxRate),
                subtotal: Number(totals.subtotal),
                taxAmount: Number(totals.taxAmount),
                total: Number(totals.total),
                user: undefined // Ensure we don't send user field, let backend handle it
            };

            await api.post('/invoices', invoiceData);
            alert('Invoice Saved Successfully!');
            // Reset form
            setInvoice({
                clientName: '',
                clientEmail: '',
                invoiceDate: new Date().toISOString().slice(0, 10),
                dueDate: '',
                items: [{ description: '', quantity: 1, price: 0 }],
                taxRate: 18,
                taxType: 'IGST',
                notes: ''
            });
        } catch (error) {
            console.error('Error saving invoice:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save invoice. Please ensure you are logged in.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <h2 className="mb-4">Invoice Generator</h2>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card p-4 mb-4">
                            <h4>Invoice Details</h4>
                            {clients.length > 0 && (
                                <div className="mb-3">
                                    <label className="form-label">Select Saved Client</label>
                                    <select
                                        className="form-select"
                                        onChange={handleClientSelect}
                                        defaultValue=""
                                    >
                                        <option value="">-- Choose a client or enter manually --</option>
                                        {clients.map(c => (
                                            <option key={c._id} value={c._id}>
                                                {c.name} {c.company ? `(${c.company})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="mb-3">
                                <label className="form-label">Client Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="clientName"
                                    value={invoice.clientName}
                                    onChange={handleInputChange}
                                    placeholder="Enter client name"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Client Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="clientEmail"
                                    value={invoice.clientEmail}
                                    onChange={handleInputChange}
                                    placeholder="Enter client email"
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Invoice Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="invoiceDate"
                                        value={invoice.invoiceDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Due Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="dueDate"
                                        value={invoice.dueDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <hr />
                            <h5>Tax Configuration (GST)</h5>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">GST Type</label>
                                    <select
                                        className="form-select"
                                        name="taxType"
                                        value={invoice.taxType}
                                        onChange={handleInputChange}
                                    >
                                        <option value="IGST">IGST (Inter-state)</option>
                                        <option value="CGST_SGST">CGST + SGST (Intra-state)</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">GST Rate</label>
                                    <select
                                        className="form-select"
                                        name="taxRate"
                                        value={invoice.taxRate}
                                        onChange={handleInputChange}
                                    >
                                        <option value="0">0% (Exempt)</option>
                                        <option value="5">5%</option>
                                        <option value="12">12%</option>
                                        <option value="18">18%</option>
                                        <option value="28">28%</option>
                                    </select>
                                </div>
                            </div>
                            <hr />

                            <h4 className="mt-4">Items</h4>
                            {invoice.items.map((item, index) => (
                                <div key={index} className="row g-2 mb-2 align-items-end">
                                    <div className="col-6">
                                        <label className="form-label small">Description</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            name="description"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(index, e)}
                                        />
                                    </div>
                                    <div className="col-2">
                                        <label className="form-label small">Qty</label>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            name="quantity"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, e)}
                                        />
                                    </div>
                                    <div className="col-3">
                                        <label className="form-label small">Price (₹)</label>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            name="price"
                                            value={item.price}
                                            onChange={(e) => handleItemChange(index, e)}
                                        />
                                    </div>
                                    <div className="col-1">
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(index)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button className="btn btn-sm btn-secondary mt-2" onClick={addItem}>
                                <i className="bi bi-plus"></i> Add Item
                            </button>

                            <div className="mb-3 mt-4">
                                <label className="form-label">Notes</label>
                                <textarea
                                    className="form-control"
                                    name="notes"
                                    value={invoice.notes}
                                    onChange={handleInputChange}
                                    rows="3"
                                ></textarea>
                            </div>

                            <div className="d-grid gap-2 mt-4">
                                <button className="btn btn-primary btn-lg" onClick={handleSaveInvoice} disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Invoice'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card p-4 shadow-sm bg-light" ref={invoiceRef}>
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div>
                                    <h3 className="fw-bold text-primary">INVOICE</h3>
                                    <p className="text-muted small">#{Math.floor(Math.random() * 10000)}</p>
                                </div>
                                <div className="text-end">
                                    <h5 className="mb-0">Invoice Pro</h5>
                                    <p className="small text-muted mb-0">123 Business St.<br />New Delhi, India</p>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-6">
                                    <h6 className="fw-bold">Bill To:</h6>
                                    <p className="mb-0">{invoice.clientName || 'Client Name'}</p>
                                    <p className="mb-0 text-muted">{invoice.clientEmail || 'client@email.com'}</p>
                                </div>
                                <div className="col-6 text-end">
                                    <p className="mb-1"><span className="fw-bold">Date:</span> {invoice.invoiceDate}</p>
                                    <p className="mb-1"><span className="fw-bold">Due Date:</span> {invoice.dueDate || '-'}</p>
                                </div>
                            </div>

                            <table className="table table-bordered bg-white">
                                <thead className="table-light">
                                    <tr>
                                        <th>Description</th>
                                        <th className="text-center">Qty</th>
                                        <th className="text-end">Price</th>
                                        <th className="text-end">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.items.map((item, index) => (
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
                                        <td className="text-end">₹{totals.subtotal}</td>
                                    </tr>
                                    {invoice.taxType === 'IGST' ? (
                                        <tr>
                                            <td colSpan="3" className="text-end">IGST ({invoice.taxRate}%)</td>
                                            <td className="text-end">₹{totals.taxAmount}</td>
                                        </tr>
                                    ) : (
                                        <>
                                            <tr>
                                                <td colSpan="3" className="text-end">CGST ({invoice.taxRate / 2}%)</td>
                                                <td className="text-end">₹{(totals.taxAmount / 2).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3" className="text-end">SGST ({invoice.taxRate / 2}%)</td>
                                                <td className="text-end">₹{(totals.taxAmount / 2).toFixed(2)}</td>
                                            </tr>
                                        </>
                                    )}
                                    <tr>
                                        <td colSpan="3" className="text-end fw-bold border-top-2">Grand Total</td>
                                        <td className="text-end fw-bold fs-5 border-top-2">₹{totals.total}</td>
                                    </tr>
                                </tfoot>
                            </table>

                            {invoice.notes && (
                                <div className="mt-4">
                                    <h6 className="fw-bold">Notes:</h6>
                                    <p className="small text-muted">{invoice.notes}</p>
                                </div>
                            )}

                        </div>
                        <div className="mt-4 text-center">
                            <button className="btn btn-primary me-2" onClick={handleDownloadPDF}>
                                <i className="bi bi-download me-2"></i> Download PDF
                            </button>
                            <button
                                className="btn btn-outline-primary"
                                onClick={async () => {
                                    if (!invoice.clientEmail) {
                                        alert('Please enter client email before sending.');
                                        return;
                                    }
                                    // Save first, then send email
                                    setSendingEmail(true);
                                    try {
                                        const invoiceData = {
                                            ...invoice,
                                            items: invoice.items.map(item => ({
                                                ...item,
                                                quantity: Number(item.quantity),
                                                price: Number(item.price)
                                            })),
                                            taxRate: Number(invoice.taxRate),
                                            subtotal: Number(totals.subtotal),
                                            taxAmount: Number(totals.taxAmount),
                                            total: Number(totals.total),
                                            user: undefined
                                        };
                                        const saveRes = await api.post('/invoices', invoiceData);
                                        await api.post(`/invoices/${saveRes.data._id}/send-email`);
                                        alert('Invoice saved and emailed to ' + invoice.clientEmail + ' successfully!');
                                    } catch (error) {
                                        console.error('Error sending email:', error);
                                        alert(error.response?.data?.message || 'Failed to send email. Please check server email configuration.');
                                    } finally {
                                        setSendingEmail(false);
                                    }
                                }}
                                disabled={sendingEmail}
                            >
                                <i className="bi bi-envelope me-2"></i>
                                {sendingEmail ? 'Sending...' : 'Save & Send Email'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InvoiceGenerator;



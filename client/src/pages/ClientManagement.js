import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const ClientManagement = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', address: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddClient = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingClient) {
                const response = await api.put(`/clients/${editingClient._id}`, formData);
                setClients(clients.map(c => c._id === editingClient._id ? response.data : c));
                alert('Client updated successfully!');
            } else {
                const response = await api.post('/clients', formData);
                setClients([response.data, ...clients]);
                alert('Client added successfully!');
            }
            resetForm();
        } catch (error) {
            console.error('Error saving client:', error);
            alert(error.response?.data?.message || 'Failed to save client. Please ensure you are logged in.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setFormData({
            name: client.name,
            company: client.company || '',
            email: client.email,
            phone: client.phone || '',
            address: client.address || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await api.delete(`/clients/${id}`);
                setClients(clients.filter(c => c._id !== id));
                alert('Client deleted successfully!');
            } catch (error) {
                console.error('Error deleting client:', error);
                alert('Failed to delete client.');
            }
        }
    };

    const resetForm = () => {
        setFormData({ name: '', company: '', email: '', phone: '', address: '' });
        setEditingClient(null);
        setShowForm(false);
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Client Management</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}
                    >
                        <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
                        {showForm ? 'Cancel' : 'Add New Client'}
                    </button>
                </div>

                {showForm && (
                    <div className="card mb-4 p-4 shadow-sm border-primary">
                        <h4>{editingClient ? 'Edit Client' : 'Add New Client'}</h4>
                        <form onSubmit={handleAddClient}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Company</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Address</label>
                                    <textarea
                                        className="form-control"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="2"
                                    ></textarea>
                                </div>
                                <div className="col-12 text-end">
                                    {editingClient && (
                                        <button type="button" className="btn btn-secondary me-2" onClick={resetForm}>
                                            Cancel
                                        </button>
                                    )}
                                    <button type="submit" className="btn btn-success" disabled={saving}>
                                        {saving ? 'Saving...' : (editingClient ? 'Update Client' : 'Save Client')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 text-muted">Loading clients...</p>
                    </div>
                ) : clients.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-people" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-2">No clients yet. Add your first client to get started!</p>
                    </div>
                ) : (
                    <div className="row">
                        {clients.map(client => (
                            <div key={client._id} className="col-md-4 mb-3">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{client.company || 'No Company'}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{client.name}</h6>
                                        <p className="card-text">
                                            <i className="bi bi-envelope me-2"></i>{client.email}<br />
                                            {client.phone && (<><i className="bi bi-telephone me-2"></i>{client.phone}<br /></>)}
                                            {client.address && (<><i className="bi bi-geo-alt me-2"></i>{client.address}</>)}
                                        </p>
                                        <div className="d-flex justify-content-end">
                                            <button
                                                className="btn btn-sm btn-outline-secondary me-2"
                                                onClick={() => handleEdit(client)}
                                            >
                                                <i className="bi bi-pencil me-1"></i>Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(client._id)}
                                            >
                                                <i className="bi bi-trash me-1"></i>Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ClientManagement;

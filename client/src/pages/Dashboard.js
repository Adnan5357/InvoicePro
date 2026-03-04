import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container mt-5 text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading dashboard...</p>
                </div>
            </>
        );
    }

    if (!stats) {
        return (
            <>
                <Navbar />
                <div className="container mt-5 text-center py-5">
                    <p className="text-muted">Unable to load dashboard data. Please ensure you are logged in.</p>
                </div>
            </>
        );
    }

    const { summary, statusBreakdown, monthlyRevenue, topClients } = stats;

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <h2 className="mb-4">Dashboard</h2>

                {/* Summary Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #667eea' }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="text-muted small mb-1">Total Revenue</p>
                                        <h3 className="mb-0 fw-bold" style={{ color: '#667eea' }}>₹{summary.totalRevenue.toLocaleString('en-IN')}</h3>
                                    </div>
                                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: 'rgba(102, 126, 234, 0.1)' }}>
                                        <i className="bi bi-currency-rupee fs-4" style={{ color: '#667eea' }}></i>
                                    </div>
                                </div>
                                <small className="text-muted">{summary.paidCount} paid invoices</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #ffc107' }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="text-muted small mb-1">Pending Amount</p>
                                        <h3 className="mb-0 fw-bold text-warning">₹{summary.pendingAmount.toLocaleString('en-IN')}</h3>
                                    </div>
                                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: 'rgba(255, 193, 7, 0.1)' }}>
                                        <i className="bi bi-hourglass-split fs-4 text-warning"></i>
                                    </div>
                                </div>
                                <small className="text-muted">{summary.pendingCount} pending</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #dc3545' }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="text-muted small mb-1">Overdue Amount</p>
                                        <h3 className="mb-0 fw-bold text-danger">₹{summary.overdueAmount.toLocaleString('en-IN')}</h3>
                                    </div>
                                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: 'rgba(220, 53, 69, 0.1)' }}>
                                        <i className="bi bi-exclamation-triangle fs-4 text-danger"></i>
                                    </div>
                                </div>
                                <small className="text-muted">{summary.overdueCount} overdue</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #28a745' }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="text-muted small mb-1">Total Invoices</p>
                                        <h3 className="mb-0 fw-bold text-success">{summary.totalInvoices}</h3>
                                    </div>
                                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: 'rgba(40, 167, 69, 0.1)' }}>
                                        <i className="bi bi-file-earmark-text fs-4 text-success"></i>
                                    </div>
                                </div>
                                <small className="text-muted">All time</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="row g-4 mb-4">
                    {/* Bar Chart - Monthly Revenue */}
                    <div className="col-lg-8">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="card-title mb-3">
                                    <i className="bi bi-bar-chart me-2"></i>Monthly Revenue (Last 6 Months)
                                </h5>
                                {monthlyRevenue.some(m => m.revenue > 0 || m.total > 0) ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={monthlyRevenue} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                                            <Tooltip
                                                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']}
                                                contentStyle={{ borderRadius: '8px', border: '1px solid #e0e0e0' }}
                                            />
                                            <Bar dataKey="revenue" name="Paid Revenue" fill="#667eea" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="total" name="Total Billed" fill="#b8c6fc" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        <i className="bi bi-bar-chart" style={{ fontSize: '3rem' }}></i>
                                        <p className="mt-2">No invoice data available yet. Create some invoices to see charts!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pie Chart - Status Breakdown */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="card-title mb-3">
                                    <i className="bi bi-pie-chart me-2"></i>Invoice Status
                                </h5>
                                {statusBreakdown.some(s => s.value > 0) ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={statusBreakdown.filter(s => s.value > 0)}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({ name, value }) => `${name}: ${value}`}
                                            >
                                                {statusBreakdown.filter(s => s.value > 0).map((entry, index) => (
                                                    <Cell key={index} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        <i className="bi bi-pie-chart" style={{ fontSize: '3rem' }}></i>
                                        <p className="mt-2">No data yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Clients Table */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title mb-3">
                                    <i className="bi bi-people me-2"></i>Top Clients by Revenue
                                </h5>
                                {topClients.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Client Name</th>
                                                    <th className="text-center">Invoices</th>
                                                    <th className="text-end">Total Revenue</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {topClients.map((client, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <span className={`badge rounded-pill ${index === 0 ? 'bg-warning text-dark' : index === 1 ? 'bg-secondary' : 'bg-light text-dark'}`}>
                                                                {index + 1}
                                                            </span>
                                                        </td>
                                                        <td className="fw-semibold">{client.name}</td>
                                                        <td className="text-center">{client.invoiceCount}</td>
                                                        <td className="text-end fw-bold" style={{ color: '#667eea' }}>₹{client.totalRevenue.toLocaleString('en-IN')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-muted">
                                        <p>No client data available yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;

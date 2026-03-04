import express from 'express';
import Invoice from '../models/Invoice.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET api/dashboard/stats
// @desc    Get dashboard statistics for authenticated user
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all invoices for this user
        const invoices = await Invoice.find({ user: userId });

        // Basic counts
        const totalInvoices = invoices.length;
        const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
        const pendingInvoices = invoices.filter(inv => inv.status === 'Pending');
        const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue');

        // Revenue totals
        const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
        const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
        const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

        // Status breakdown for pie chart
        const statusBreakdown = [
            { name: 'Paid', value: paidInvoices.length, color: '#28a745' },
            { name: 'Pending', value: pendingInvoices.length, color: '#ffc107' },
            { name: 'Overdue', value: overdueInvoices.length, color: '#dc3545' }
        ];

        // Monthly revenue for bar chart (last 6 months)
        const monthlyRevenue = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
            const monthName = monthStart.toLocaleString('default', { month: 'short', year: '2-digit' });

            const monthInvoices = invoices.filter(inv => {
                const invDate = new Date(inv.createdAt);
                return invDate >= monthStart && invDate <= monthEnd;
            });

            const revenue = monthInvoices
                .filter(inv => inv.status === 'Paid')
                .reduce((sum, inv) => sum + (inv.total || 0), 0);

            const total = monthInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

            monthlyRevenue.push({
                month: monthName,
                revenue: Math.round(revenue * 100) / 100,
                total: Math.round(total * 100) / 100,
                count: monthInvoices.length
            });
        }

        // Top clients by revenue
        const clientMap = {};
        invoices.forEach(inv => {
            const name = inv.clientName || 'Unknown';
            if (!clientMap[name]) {
                clientMap[name] = { name, totalRevenue: 0, invoiceCount: 0 };
            }
            clientMap[name].totalRevenue += (inv.total || 0);
            clientMap[name].invoiceCount += 1;
        });
        const topClients = Object.values(clientMap)
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, 5)
            .map(c => ({
                ...c,
                totalRevenue: Math.round(c.totalRevenue * 100) / 100
            }));

        res.json({
            summary: {
                totalInvoices,
                totalRevenue: Math.round(totalRevenue * 100) / 100,
                pendingAmount: Math.round(pendingAmount * 100) / 100,
                pendingCount: pendingInvoices.length,
                overdueAmount: Math.round(overdueAmount * 100) / 100,
                overdueCount: overdueInvoices.length,
                paidCount: paidInvoices.length
            },
            statusBreakdown,
            monthlyRevenue,
            topClients
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

export default router;

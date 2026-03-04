import express from 'express';
import Invoice from '../models/Invoice.js';
import { protect } from '../middleware/authMiddleware.js';
import { sendInvoiceEmail } from '../controllers/emailController.js';

const router = express.Router();

// @route   POST api/invoices
// @desc    Create a new invoice
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const newInvoice = new Invoice({
            user: req.user.id,
            ...req.body
        });

        const invoice = await newInvoice.save();
        res.json(invoice);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/invoices
// @desc    Get all invoices for a user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(invoices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/invoices/:id
// @desc    Get invoice by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ msg: 'Invoice not found' });
        }

        // Check user
        if (invoice.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        res.json(invoice);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Invoice not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/invoices/:id
// @desc    Delete invoice
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ msg: 'Invoice not found' });
        }

        // Check user
        if (invoice.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await invoice.deleteOne();

        res.json({ msg: 'Invoice removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Invoice not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/invoices/:id/status
// @desc    Update invoice status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Paid', 'Pending', 'Overdue'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be Paid, Pending, or Overdue.' });
        }

        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        if (invoice.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        invoice.status = status;
        await invoice.save();

        res.json(invoice);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST api/invoices/:id/send-email
// @desc    Send invoice via email to client
// @access  Private
router.post('/:id/send-email', protect, sendInvoiceEmail);

export default router;

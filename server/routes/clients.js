import express from 'express';
import Client from '../models/Client.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET api/clients
// @desc    Get all clients for authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const clients = await Client.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(clients);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST api/clients
// @desc    Create a new client
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { name, company, email, phone, address } = req.body;

        const newClient = new Client({
            user: req.user.id,
            name,
            company,
            email,
            phone,
            address
        });

        const client = await newClient.save();
        res.status(201).json(client);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT api/clients/:id
// @desc    Update a client
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Check user ownership
        if (client.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        client = await Client.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(client);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE api/clients/:id
// @desc    Delete a client
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Check user ownership
        if (client.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await client.deleteOne();
        res.json({ message: 'Client removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;

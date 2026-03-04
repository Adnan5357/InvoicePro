import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    clientEmail: {
        type: String,
        required: true
    },
    invoiceDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date
    },
    items: [{
        description: String,
        quantity: Number,
        price: Number
    }],
    taxRate: {
        type: Number,
        default: 18
    },
    taxType: {
        type: String,
        enum: ['IGST', 'CGST_SGST'],
        default: 'IGST'
    },
    subtotal: Number,
    taxAmount: Number,
    total: Number,
    notes: String,
    status: {
        type: String,
        enum: ['Paid', 'Pending', 'Overdue'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;

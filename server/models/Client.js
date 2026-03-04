import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Client = mongoose.model('Client', clientSchema);
export default Client;

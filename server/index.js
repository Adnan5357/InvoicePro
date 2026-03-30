import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Invoice Pro API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
import invoiceRoutes from './routes/invoices.js';
app.use('/api/invoices', invoiceRoutes);
import clientRoutes from './routes/clients.js';
app.use('/api/clients', clientRoutes);
import dashboardRoutes from './routes/dashboardRoutes.js';
app.use('/api/dashboard', dashboardRoutes);
import profileRoutes from './routes/profileRoutes.js';
app.use('/api/user', profileRoutes);

// Placeholder routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Invoice Pro API - Backend placeholder',
    version: '1.0.0'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
});

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import InvoiceGenerator from './pages/InvoiceGenerator';
import TaxCalculator from './pages/TaxCalculator';
import PdfExport from './pages/PdfExport';
import ClientManagement from './pages/ClientManagement';
import InvoiceHistory from './pages/InvoiceHistory';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const isAuthenticated = () => !!sessionStorage.getItem('token');

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/invoice-generator" element={<PrivateRoute><InvoiceGenerator /></PrivateRoute>} />
          <Route path="/tax-calculator" element={<PrivateRoute><TaxCalculator /></PrivateRoute>} />
          <Route path="/pdf-export" element={<PrivateRoute><PdfExport /></PrivateRoute>} />
          <Route path="/client-management" element={<PrivateRoute><ClientManagement /></PrivateRoute>} />
          <Route path="/invoice-history" element={<PrivateRoute><InvoiceHistory /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import InvoiceGenerator from './pages/InvoiceGenerator';
import TaxCalculator from './pages/TaxCalculator';
import PdfExport from './pages/PdfExport';
import ClientManagement from './pages/ClientManagement';
import InvoiceHistory from './pages/InvoiceHistory';
import Security from './pages/Security';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoice-generator" element={<InvoiceGenerator />} />
          <Route path="/tax-calculator" element={<TaxCalculator />} />
          <Route path="/pdf-export" element={<PdfExport />} />
          <Route path="/client-management" element={<ClientManagement />} />
          <Route path="/invoice-history" element={<InvoiceHistory />} />
          <Route path="/security" element={<Security />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

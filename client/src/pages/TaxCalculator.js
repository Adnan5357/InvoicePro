import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const TaxCalculator = () => {
    const [amount, setAmount] = useState('');
    const [taxRate, setTaxRate] = useState(18); // Default 18% GST
    const [result, setResult] = useState(null);

    const calculateTax = () => {
        const principal = parseFloat(amount);
        const rate = parseFloat(taxRate);

        if (isNaN(principal) || isNaN(rate)) {
            setResult(null);
            return;
        }

        const taxAmount = (principal * rate) / 100;
        const totalAmount = principal + taxAmount;

        setResult({
            taxAmount: taxAmount.toFixed(2),
            totalAmount: totalAmount.toFixed(2)
        });
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-sm p-4">
                            <h2 className="text-center mb-4">GST & Tax Calculator</h2>

                            <div className="mb-3">
                                <label className="form-label">Amount (₹)</label>
                                <input
                                    type="number"
                                    className="form-control form-control-lg"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Tax Rate (%)</label>
                                <select
                                    className="form-select"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(Number(e.target.value))}
                                >
                                    <option value="5">5% (Essentials)</option>
                                    <option value="12">12% (Standard)</option>
                                    <option value="18">18% (Services)</option>
                                    <option value="28">28% (Luxury)</option>
                                    <option value="0">0% (Exempt)</option>
                                </select>
                            </div>

                            <button
                                className="btn btn-primary w-100 btn-lg mt-3"
                                onClick={calculateTax}
                            >
                                Calculate
                            </button>

                            {result && (
                                <div className="mt-4 p-3 bg-light rounded text-center">
                                    <div className="row">
                                        <div className="col-6 mb-2">
                                            <small className="text-muted">Tax Amount</small>
                                            <h4 className="text-danger">₹{result.taxAmount}</h4>
                                        </div>
                                        <div className="col-6 mb-2">
                                            <small className="text-muted">Total (Inc. Tax)</small>
                                            <h4 className="text-success">₹{result.totalAmount}</h4>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 text-center">
                                <p className="text-muted small">
                                    Use this tool to quickly calculate Good & Services Tax (GST) for your invoices.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TaxCalculator;

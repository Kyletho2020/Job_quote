import React, { useState } from 'react';

const ForkliftQuoteForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    forkliftType: '',
    capacity: '',
    duration: '',
    notes: ''
  });

  const [quote, setQuote] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple quote calculation
    const basePrice = 2000;
    const capacityMultiplier = {
      '2000': 1.0,
      '3000': 1.1,
      '5000': 1.3,
      '8000': 1.6,
      '10000': 1.8
    };
    
    const multiplier = capacityMultiplier[formData.capacity] || 1.0;
    const monthlyRate = basePrice * multiplier;
    
    setQuote({
      ...formData,
      monthlyRate: monthlyRate,
      generatedAt: new Date().toLocaleString()
    });
  };

  const handleReset = () => {
    setFormData({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      forkliftType: '',
      capacity: '',
      duration: '',
      notes: ''
    });
    setQuote(null);
  };

  if (quote) {
    return (
      <div>
        <h1>Forklift Quote Generated</h1>
        <pre>{JSON.stringify(quote, null, 2)}</pre>
        <button onClick={handleReset}>Generate New Quote</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Forklift Quote Request</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Company Name:
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contact Name:
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Forklift Type:
          <select
            name="forkliftType"
            value={formData.forkliftType}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="counterbalance">Counterbalance</option>
            <option value="warehouse">Warehouse</option>
            <option value="reach">Reach Truck</option>
            <option value="pallet">Pallet Jack</option>
          </select>
        </label>

        <label>
          Capacity (lbs):
          <select
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
          >
            <option value="">Select Capacity</option>
            <option value="2000">2,000 lbs</option>
            <option value="3000">3,000 lbs</option>
            <option value="5000">5,000 lbs</option>
            <option value="8000">8,000 lbs</option>
            <option value="10000">10,000 lbs</option>
          </select>
        </label>

        <label>
          Rental Duration:
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          >
            <option value="">Select Duration</option>
            <option value="1-week">1 Week</option>
            <option value="1-month">1 Month</option>
            <option value="3-months">3 Months</option>
            <option value="6-months">6 Months</option>
            <option value="1-year">1 Year</option>
          </select>
        </label>

        <label>
          Additional Notes:
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Any special requirements or additional information..."
          />
        </label>

        <button type="submit">Get Quote</button>
        <button type="button" onClick={handleReset} style={{ marginLeft: '1rem', backgroundColor: '#6b7280' }}>
          Reset
        </button>
      </form>
    </div>
  );
};

export default ForkliftQuoteForm;
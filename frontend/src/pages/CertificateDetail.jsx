import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function CertificateDetail() {
  const { state } = useLocation();

  // Always call hooks at the top level
  const [form, setForm] = useState({
    type: state?.type || '',
    certNumber: state?.certNumber || '',
    address: state?.address || '',
    date: state?.date || new Date().toISOString().slice(0, 10)
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle missing state AFTER hooks
  if (!state) {
    return <p style={{ padding: '40px' }}>No certificate data available.</p>;
  }

  return (
    <div style={{ padding: '40px', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ color: '#004080' }}>{form.type}</h2>

      <label style={{ display: 'block', marginTop: '20px' }}>
        Certificate Number:
        <input
          name="certNumber"
          value={form.certNumber}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <label style={{ display: 'block', marginTop: '20px' }}>
        Installation Address:
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <label style={{ display: 'block', marginTop: '20px' }}>
        Date:
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <p style={{ marginTop: '40px', fontStyle: 'italic', color: '#555' }}>
        More certificate fields will be added in the next step.
      </p>
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '8px',
  fontSize: '16px',
  marginTop: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px'
};

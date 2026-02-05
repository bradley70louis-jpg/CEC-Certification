import React, { useState } from 'react';

export default function ObservationsSection({ onChange }) {
  const [noObservations, setNoObservations] = useState(false);
  const [observations, setObservations] = useState([
    { id: 1, text: '', code: '' }
  ]);

  const [totals, setTotals] = useState({
    c1: 'N/A',
    c2: 'N/A',
    c3: 'N/A',
    fi: 'N/A',
  });

  const handleToggleNoObs = (checked) => {
    setNoObservations(checked);
    const updatedList = checked ? [] : [{ id: 1, text: '', code: '' }];
    setObservations(updatedList);
    updateTotals(updatedList);
    if (onChange) onChange({ noObservations: checked, observations: updatedList, totals });
  };

  const handleChange = (id, field, value) => {
    const updated = observations.map(obs =>
      obs.id === id ? { ...obs, [field]: value } : obs
    );
    setObservations(updated);
    updateTotals(updated);
    if (onChange) onChange({ noObservations, observations: updated, totals });
  };

  const addObservation = () => {
    const newId = observations.length > 0 ? observations[observations.length - 1].id + 1 : 1;
    const updated = [...observations, { id: newId, text: '', code: '' }];
    setObservations(updated);
    if (onChange) onChange({ noObservations, observations: updated, totals });
  };

  const removeObservation = (id) => {
    const updated = observations.filter(obs => obs.id !== id);
    setObservations(updated);
    updateTotals(updated);
    if (onChange) onChange({ noObservations, observations: updated, totals });
  };

  const updateTotals = (list) => {
    const counts = { c1: [], c2: [], c3: [], fi: [] };
    list.forEach(obs => {
      if (obs.code === 'C1') counts.c1.push(obs.id);
      if (obs.code === 'C2') counts.c2.push(obs.id);
      if (obs.code === 'C3') counts.c3.push(obs.id);
      if (obs.code === 'FI') counts.fi.push(obs.id);
    });

    const newTotals = {
      c1: counts.c1.length ? counts.c1.join(', ') : 'N/A',
      c2: counts.c2.length ? counts.c2.join(', ') : 'N/A',
      c3: counts.c3.length ? counts.c3.join(', ') : 'N/A',
      fi: counts.fi.length ? counts.fi.join(', ') : 'N/A',
    };

    setTotals(newTotals);
    if (onChange) onChange({ noObservations, observations, totals: newTotals });
  };

  return (
    <div>
      {/* Top checkbox area */}
      <fieldset style={sectionStyle}>
        <label>
          <input
            type="checkbox"
            checked={noObservations}
            onChange={e => handleToggleNoObs(e.target.checked)}
          />
          &nbsp; There are no items adversely affecting electrical safety
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={!noObservations}
            onChange={e => handleToggleNoObs(!e.target.checked)}
          />
          &nbsp; The following observations and recommendations are made
        </label>
      </fieldset>

      {/* Observations table */}
      {!noObservations && (
        <fieldset style={sectionStyle}>
          <legend style={legendStyle}>Observations Table</legend>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Item No</th>
                <th>Observations</th>
                <th style={{ width: '180px' }}>Classification Code</th>
                <th style={{ width: '80px' }}></th>
              </tr>
            </thead>
            <tbody>
              {observations.map(obs => (
                <tr key={obs.id}>
                  <td style={cellStyle}>{obs.id}</td>
                  <td style={cellStyle}>
                    <textarea
                      value={obs.text}
                      onChange={e => handleChange(obs.id, 'text', e.target.value)}
                      style={textareaStyle}
                      placeholder="Enter observation..."
                    />
                  </td>
                  <td style={cellStyle}>
                    <select
                      value={obs.code}
                      onChange={e => handleChange(obs.id, 'code', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="">— Select —</option>
                      <option value="C1">C1 — Danger Present</option>
                      <option value="C2">C2 — Potentially Dangerous</option>
                      <option value="C3">C3 — Improvement Recommended</option>
                      <option value="FI">FI — Further Investigation Required</option>
                    </select>
                  </td>
                  <td style={cellStyle}>
                    <button
                      type="button"
                      onClick={() => removeObservation(obs.id)}
                      style={deleteBtn}
                      disabled={observations.length === 1}
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            onClick={addObservation}
            style={addBtn}
          >
            ➕ Add Observation
          </button>
        </fieldset>
      )}

      {/* Totals */}
      <fieldset style={sectionStyle}>
        <legend style={legendStyle}>Summary of Required Action</legend>
        <div style={grid2}>
          <div>
            <label style={labelStyle}>Immediate remedial action required (C1):</label>
            <input type="text" value={totals.c1} readOnly style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Urgent remedial action required (C2):</label>
            <input type="text" value={totals.c2} readOnly style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Improvement recommended (C3):</label>
            <input type="text" value={totals.c3} readOnly style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Further investigation required (FI):</label>
            <input type="text" value={totals.fi} readOnly style={inputStyle} />
          </div>
        </div>
      </fieldset>
    </div>
  );
}

// ============================
// Styles
// ============================
const sectionStyle = { border: '1px solid #ccc', padding: '20px', marginBottom: '25px', borderRadius: '8px' };
const legendStyle = { padding: '0 10px', color: '#003366', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' };
const labelStyle = { fontWeight: 'bold', display: 'block', marginBottom: '5px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginBottom: '10px' };
const cellStyle = { border: '1px solid #ccc', padding: '5px', verticalAlign: 'top' };
const textareaStyle = { width: '100%', minHeight: '60px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' };
const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const addBtn = { backgroundColor: '#008000', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const deleteBtn = { backgroundColor: '#cc0000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' };

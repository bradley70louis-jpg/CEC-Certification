// 📄 src/pages/Certificates.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Certificates() {
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [propertyAddress, setPropertyAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");

  const certificateTypes = [
    { label: "Electrical Installation Condition Report (EICR)", value: "EICR" },
    { label: "Minor Works Certificate", value: "MWC" },
    { label: "Electrical Installation Certificate", value: "EIC" },
  ];

  const token = localStorage.getItem("token");

  const handleCreate = () => {
    if (!selectedType) return alert("Please select a certificate type");
    setShowModal(true);
  };

  // Basic postcode lookup helper (NOT a true address picker)
  const handleLookup = async () => {
    const pc = (postcode || "").trim();
    if (!pc) return alert("Please enter a postcode first");

    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`);
      const data = await res.json();

      if (data.status === 200 && data.result) {
        const town =
          data.result.admin_district ||
          data.result.parish ||
          data.result.region ||
          data.result.country ||
          "";
        if (town && !propertyAddress.trim()) setPropertyAddress(town);
      } else {
        alert("Postcode found, but no address info returned. Please type address manually.");
      }
    } catch (err) {
      console.error(err);
      alert("Postcode lookup failed");
    }
  };

  const handleSaveAndOpen = async () => {
    const certId = (certificateNumber || "").trim();
    if (!certId) return alert("Please enter a Certificate Number");
    if (!propertyAddress.trim()) return alert("Please enter a Property Address");

    if (!token) return alert("You are not logged in. Please log in again.");

    try {
      const res = await fetch(`${API_BASE}/api/certificates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: certId, // ✅ certificate number becomes the ID
          type: selectedType,
          address: propertyAddress.trim(),
          postcode: (postcode || "").trim().toUpperCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data?.message || "Failed to create certificate");
      }

      setShowModal(false);
      navigate(`/certificate/${encodeURIComponent(certId)}?type=${selectedType}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create certificate (server not reachable?)");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1 style={{ textAlign: "center", marginBottom: 16, color: "#0e3a5b" }}>
        Certificates
      </h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{
            flex: 1,
            minWidth: 320,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #cbd5e1",
          }}
        >
          <option value="">Select Certificate Type</option>
          {certificateTypes.map((ct) => (
            <option key={ct.value} value={ct.value}>
              {ct.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleCreate}
          style={{
            backgroundColor: "#0e3a5b",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 800,
            border: "none",
          }}
        >
          Create
        </button>
      </div>

      <div style={{ textAlign: "center", color: "#64748b" }}>
        (Your certificates list will appear here once we add “My certificates” API.)
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 12,
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 22,
              borderRadius: 12,
              maxWidth: 520,
              width: "100%",
              border: "1px solid #cbd5e1",
            }}
          >
            <h2 style={{ margin: 0, marginBottom: 14, color: "#0e3a5b" }}>
              Create {selectedType}
            </h2>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontWeight: 700, fontSize: 13 }}>Postcode</label>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <input
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
                />
                <button
                  type="button"
                  onClick={handleLookup}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #0e3a5b",
                    background: "#0e3a5b",
                    color: "#fff",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Lookup
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontWeight: 700, fontSize: 13 }}>Property Address</label>
              <textarea
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                rows={2}
                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", marginTop: 6 }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 700, fontSize: 13 }}>
                Certificate Number (becomes Certificate ID)
              </label>
              <input
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", marginTop: 6 }}
                placeholder="e.g. 12345678"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f8fafc", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAndOpen}
                style={{
                  backgroundColor: "#0e3a5b",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "none",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Save & Open
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

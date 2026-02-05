// 📄 src/pages/EICRForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import EICRPage1 from "../components/EICR/EICRPage1";
import EICRPage2 from "../components/EICR/EICRPage2";
import EICRPage3 from "../components/EICR/EICRPage3";
import EICRPage4 from "../components/EICR/EICRPage4";
import EICRPageCU from "../components/EICR/EICRPageCU";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function EICRForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ certificateId
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "EICR";
  const token = localStorage.getItem("token");

  const certificateId = id;

  const [activePage, setActivePage] = useState(1);

  const [page1Data, setPage1Data] = useState({});
  const [page2Data, setPage2Data] = useState({ mode: "HAS_OBS", observations: [] });
  const [page3Data, setPage3Data] = useState({});
  const [page4Data, setPage4Data] = useState({});
  const [pageCUData, setPageCUData] = useState({ boards: [] });

  // ✅ Load existing certificate from backend (if it exists)
  useEffect(() => {
    const load = async () => {
      if (!certificateId) return;
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE}/api/certificates/${encodeURIComponent(certificateId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return; // ok if new / empty
        const data = await res.json();

        const payload = data?.payload || {};
        setPage1Data(payload.page1 || {});
        setPage2Data(payload.page2 || { mode: "HAS_OBS", observations: [] });
        setPage3Data(payload.page3 || {});
        setPage4Data(payload.page4 || {});
        setPageCUData(payload.cuSchedule || { boards: [] });
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [certificateId, token]);

  // Your auto-observations from page 4 into page 2
  useEffect(() => {
    const newObservations = [];

    Object.entries(page4Data || {}).forEach(([itemNo, data]) => {
      if (!data || !data.outcome) return;
      const outcome = data.outcome;
      const text = data.text || `Inspection Schedule Item ${itemNo}`;

      if (["C1", "C2", "C3", "FI"].includes(outcome)) {
        newObservations.push({
          itemNo,
          text: `Inspection Schedule Item ${itemNo}: ${text}`,
          code: outcome,
          auto: true,
        });
      }
    });

    setPage2Data((prev) => {
      const manual = (prev.observations || []).filter((o) => !o.auto);
      const merged = [
        ...manual,
        ...newObservations.map((o, idx) => ({
          ...o,
          itemNo: manual.length + idx + 1,
        })),
      ];
      return { ...prev, observations: merged };
    });
  }, [page4Data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("You are not logged in. Please log in again.");

    const payload = {
      certificateId,
      type,
      page1: page1Data,
      page2: page2Data,
      page3: page3Data,
      page4: page4Data,
      cuSchedule: pageCUData,
    };

    try {
      const res = await fetch(`${API_BASE}/api/certificates/${encodeURIComponent(certificateId)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ payload }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data?.message || "Failed to save certificate");

      alert(`EICR saved!\nCertificate ID: ${certificateId}`);
      navigate("/certificates");
    } catch (err) {
      console.error(err);
      alert("Save failed (server not reachable?)");
    }
  };

  const pages = [
    { id: 1, label: "Page 1" },
    { id: 2, label: "Page 2" },
    { id: 3, label: "Page 3" },
    { id: 4, label: "Page 4" },
    { id: 5, label: "CU Schedule" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 20px" }}>
      <header style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ marginBottom: 6, color: "#0e3a5b" }}>
          Electrical Installation Condition Report
        </h1>
        <div style={{ fontSize: 14 }}>
          Certificate ID: <span style={{ fontWeight: 600 }}>{certificateId}</span>
        </div>
      </header>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {pages.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActivePage(p.id)}
            style={{
              padding: "8px 18px",
              borderRadius: 6,
              border: activePage === p.id ? "2px solid #0e3a5b" : "1px solid #d1d5db",
              backgroundColor: activePage === p.id ? "#0e3a5b" : "#f3f4f6",
              color: activePage === p.id ? "#fff" : "#111827",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {activePage === 1 && <EICRPage1 data={page1Data} setData={setPage1Data} certificateId={certificateId} />}
        {activePage === 2 && <EICRPage2 data={page2Data} setData={setPage2Data} />}
        {activePage === 3 && <EICRPage3 data={page3Data} setData={setPage3Data} />}
        {activePage === 4 && <EICRPage4 data={page4Data} setData={setPage4Data} />}
        {activePage === 5 && <EICRPageCU data={pageCUData} setData={setPageCUData} />}

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#0e3a5b",
              color: "#fff",
              padding: "10px 26px",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
            }}
          >
            Save EICR
          </button>
        </div>
      </form>
    </div>
  );
}

// src/components/EICR/EICRPageCU.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

/* ---- Theme (blue/grey) ---- */
const T = {
  band: "#0e3a5b",
  bandText: "#ffffff",
  groupBg: "#d3d9e2",
  headBg: "#e4e9f1",
  headBorder: "#c0c8d6",
  cellBorder: "#d4dde8",
  zebra: "#f9fafc",
  text: "#1f2933",
};

/* ---- Max Zs approx @230V, 0.4s for 60898/61009 B/C/D ---- */
const MAX_ZS = {
  B: { 6: 7.67, 10: 4.6, 16: 2.87, 20: 2.3, 25: 1.84, 32: 1.44, 40: 1.15, 50: 0.92, 63: 0.73 },
  C: { 6: 3.83, 10: 2.3, 16: 1.44, 20: 1.15, 25: 0.92, 32: 0.72, 40: 0.58, 50: 0.46, 63: 0.37 },
  D: { 6: 1.92, 10: 1.15, 16: 0.72, 20: 0.58, 25: 0.46, 32: 0.36, 40: 0.29, 50: 0.23, 63: 0.18 },
};

/* ---- BS 7671 A3:2024 reference methods ---- */
const REF_METHOD_OPTIONS = [
  { code: "A", desc: "Enclosed in conduit in thermally insulating wall" },
  { code: "B", desc: "Enclosed in conduit, trunking on wall" },
  { code: "C", desc: "Clipped direct (incl. single-core/multicore direct in masonry)" },
  { code: "D", desc: "Cables laid direct in ground or in ducting in ground" },
  { code: "E", desc: "Free air / perforated cable tray (multi-core)" },
  { code: "F", desc: "Free air / perforated cable tray (single-core)" },
  { code: "G", desc: "Free air, flat spaced by 1 cable diameter" },
  { code: "100", desc: "T&E above plasterboard ceiling with ≤100 mm insulation" },
  { code: "101", desc: "T&E above plasterboard ceiling with >100 mm insulation" },
  { code: "102", desc: "T&E in stud wall with insulation touching inner wall surface" },
  { code: "103", desc: "T&E in stud wall with insulation not touching inner wall surface" },
  { code: "N/A", desc: "Not applicable" },
];

const DESCRIPTIONS_DEFAULT = [
  "Ground Floor Lights",
  "First Floor Lights",
  "Kitchen Ring Final",
  "Cooker",
  "Heating Spur",
  "Water Heater (NO LOAD)",
  "Smoke / Fire Detection",
  "Garage / Outbuilding",
  "RCD Protected Sockets",
  "Spare",
];

/* ---- Column & group layout ---- */
const COLS = [
  { key: "num", label: "Circuit number", rotate: true, min: 50, width: 60 },
  { key: "desc", label: "Circuit description", rotate: false, min: 220, width: 280 },

  { key: "wiring", label: "Type of wiring", rotate: true, min: 80, width: 90 },
  { key: "refMethod", label: "Reference method", rotate: true, min: 90, width: 95 },
  { key: "live", label: "Live (mm²)", rotate: true, min: 80, width: 80 },
  { key: "neutral", label: "Neutral (mm²)", rotate: true, min: 80, width: 80 },
  { key: "cpc", label: "cpc (mm²)", rotate: true, min: 80, width: 80 },
  { key: "maxDisc", label: "Max disconnection time (s)", rotate: true, min: 110, width: 120 },

  { key: "bsen", label: "BS (EN)", rotate: true, min: 80, width: 80 },
  { key: "curve", label: "Type", rotate: true, min: 60, width: 60 },
  { key: "rating", label: "Rating (A)", rotate: true, min: 80, width: 80 },
  { key: "maxZsAuto", label: "Max Zs (Ω)", rotate: true, min: 80, width: 80 },

  { key: "rcdBs", label: "BS (EN)", rotate: true, min: 80, width: 80 },
  { key: "rcdType", label: "Type", rotate: true, min: 60, width: 60 },
  { key: "rcdMa", label: "Rating (mA)", rotate: true, min: 80, width: 90 },

  { key: "r1", label: "r1 (inner l)", rotate: true, min: 80, width: 80 },
  { key: "rn", label: "rn (outer n)", rotate: true, min: 80, width: 80 },
  { key: "r2", label: "r2 (cpc)", rotate: true, min: 80, width: 80 },
  { key: "r1r2", label: "R1+R2", rotate: true, min: 80, width: 80 },
  { key: "r2only", label: "R2", rotate: true, min: 60, width: 60 },

  { key: "irLn", label: "Line - Neutral (MΩ)", rotate: true, min: 120, width: 130 },
  { key: "irLe", label: "Line - c- Earth (MΩ)", rotate: true, min: 130, width: 130 },
  { key: "irNe", label: "Live - c - Earth (MΩ)", rotate: true, min: 130, width: 130 },

  { key: "zs", label: "Zs", rotate: true, min: 60, width: 60 },
  { key: "rcdTripX1", label: "RCD Trip time x1 (ms)", rotate: true, min: 130, width: 130 },
  { key: "rcdPass", label: "RCD", rotate: true, min: 60, width: 60 },
  { key: "afdd", label: "AFDD", rotate: true, min: 60, width: 60 },
];

const GROUPS = [
  { label: "", span: 2 },
  { label: "Conductor details", span: 6 },
  { label: "Overcurrent protective device", span: 4 },
  { label: "RCD", span: 3 },
  { label: "Continuity (Ω)", span: 5 },
  { label: "Insulation resistance", span: 3 },
  { label: "TEST RESULT DETAILS", span: 4 },
];

/* ---- Helpers ---- */
const computeMaxZs = (bsen, curve, rating) => {
  const c = String(curve || "").toUpperCase();
  const r = Number(rating);
  if (!["60898", "61009"].includes(String(bsen)) || !MAX_ZS[c] || !r) return "";
  const v = MAX_ZS[c][r];
  return typeof v === "number" ? v.toFixed(2) : "";
};

const computeZs = (zdb, r1r2, r2only) => {
  const base = parseFloat(zdb);
  const add =
    r1r2 !== "" && r1r2 != null
      ? parseFloat(r1r2)
      : r2only !== "" && r2only != null
      ? parseFloat(r2only)
      : NaN;

  if (Number.isFinite(base) && Number.isFinite(add)) return (base + add).toFixed(2);
  if (Number.isFinite(base)) return base.toFixed(2);
  return "";
};

const makeRow = (i) => ({
  num: i + 1,
  desc: "",
  wiring: "",
  refMethod: "",
  live: "",
  neutral: "",
  cpc: "",
  maxDisc: "",
  bsen: "",
  curve: "",
  rating: "",
  maxZsAuto: "",
  rcdBs: "",
  rcdType: "",
  rcdMa: "",
  r1: "",
  rn: "",
  r2: "",
  r1r2: "",
  r2only: "",
  irLn: "",
  irLe: "",
  irNe: "",
  zs: "",
  rcdTripX1: "",
  rcdPass: false,
  afdd: "",
});

/* ---- Layout constants ---- */
const PAGE_MAX_WIDTH = 1850;
const SUB_HEAD_H = 168;
const ROW_H = 34;
const FONT_BASE = 12;

/* ---- Shared styles ---- */
const wrapStyle = {
  fontFamily: "Arial, sans-serif",
  color: T.text,
};

const titleBandStyle = {
  background: T.band,
  color: T.bandText,
  fontWeight: 800,
  letterSpacing: 0.3,
  padding: "8px 12px",
  borderRadius: 4,
  maxWidth: PAGE_MAX_WIDTH,
  margin: "10px auto 12px",
};

const tableShellStyle = {
  maxWidth: PAGE_MAX_WIDTH,
  margin: "0 auto 20px",
  border: `1px solid ${T.headBorder}`,
  borderRadius: 6,
  overflow: "hidden",
  background: "#fff",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
};

const groupCellStyle = {
  borderRight: `1px solid ${T.headBorder}`,
  borderBottom: `1px solid ${T.headBorder}`,
  background: T.groupBg,
  height: 36,
  padding: 0,
  position: "relative",
  textAlign: "center",
  verticalAlign: "middle",
};

const groupInnerStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 6px",
  fontSize: FONT_BASE,
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const headCellStyle = {
  borderRight: `1px solid ${T.headBorder}`,
  borderBottom: `1px solid ${T.headBorder}`,
  background: T.headBg,
  padding: 0,
  height: SUB_HEAD_H,
  position: "relative",
  verticalAlign: "bottom",
};

const headInnerStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 4px",
};

const headLabelStyle = (vertical) =>
  vertical
    ? {
        writingMode: "vertical-rl",
        transform: "rotate(180deg)",
        whiteSpace: "nowrap",
        fontWeight: 700,
        fontSize: FONT_BASE,
        lineHeight: 1,
        textAlign: "center",
      }
    : {
        whiteSpace: "nowrap",
        fontWeight: 700,
        fontSize: FONT_BASE,
        lineHeight: 1.1,
        textAlign: "center",
      };

const resizerStyle = {
  position: "absolute",
  top: 0,
  right: -3,
  width: 10,
  height: "100%",
  cursor: "col-resize",
  zIndex: 2,
};

const tdBase = {
  borderRight: `1px solid ${T.cellBorder}`,
  borderBottom: `1px solid ${T.cellBorder}`,
  padding: 0,
  background: "#fff",
  height: ROW_H,
  verticalAlign: "middle",
};

const tdCenter = { ...tdBase, textAlign: "center" };
const tdLeft = { ...tdBase, textAlign: "left" };
const rowBg = (i) => ({ background: i % 2 ? T.zebra : "#fff" });

const cellInputStyle = {
  width: "100%",
  height: ROW_H,
  boxSizing: "border-box",
  border: "none",
  padding: "4px 6px",
  fontSize: FONT_BASE,
  outline: "none",
  background: "transparent",
};

const btnPrimary = {
  background: T.band,
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 14,
};

const btnSoft = {
  background: "#e4e9f5",
  color: "#1f2933",
  border: "1px solid #c0c8d6",
  padding: "8px 12px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13,
  marginLeft: 8,
};

/* =============================
   MAIN COMPONENT
   ============================= */
export default function EICRPageCU({ data, setData }) {
  const [board, setBoard] = useState(() => {
    if (data?.boards?.[0]) return data.boards[0];
    return {
      dbRef: "",
      location: "",
      suppliedFrom: "",
      distribBS: "",
      boardType: "",
      ratingSetting: "",
      phases: "1",
      spdT1: false,
      spdT2: false,
      spdT3: false,
      polarityConfirmed: true,
      phaseSequenceConfirmed: false,
      zsAtDB: "",
      ipfAtDB: "",
      circuits: Array.from({ length: 8 }, (_, i) => makeRow(i)),
    };
  });

  // column widths
  const [widths, setWidths] = useState(() => COLS.map((c) => c.width));
  const dragRef = useRef(null);

  // context menu for autofill
  const [menu, setMenu] = useState(null);

  // ref-method popup
  const [openRefFor, setOpenRefFor] = useState(null);

  // predictive descriptions
  const [descMem, setDescMem] = useState(() => {
    try {
      const raw = localStorage.getItem("cec_descs");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const descOptions = useMemo(() => {
    const set = new Set([...DESCRIPTIONS_DEFAULT, ...descMem]);
    return Array.from(set);
  }, [descMem]);

  // push up to parent
  useEffect(() => {
    if (setData) {
      setData((prev) => ({ ...prev, boards: [board] }));
    }
  }, [board, setData]);

  /* ---------- Column resizing + auto-fit ---------- */
  const startResize = (e, colIndex) => {
    e.preventDefault();
    dragRef.current = {
      colIndex,
      startX: e.clientX,
      startWidth: widths[colIndex],
    };
    window.addEventListener("mousemove", onResizing);
    window.addEventListener("mouseup", endResize);
  };

  const onResizing = (e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const delta = e.clientX - drag.startX;
    setWidths((prev) => {
      const arr = [...prev];
      const meta = COLS[drag.colIndex];
      const next = Math.max(meta.min, drag.startWidth + delta);
      arr[drag.colIndex] = next;
      return arr;
    });
  };

  const endResize = () => {
    dragRef.current = null;
    window.removeEventListener("mousemove", onResizing);
    window.removeEventListener("mouseup", endResize);
  };

  // Auto-fit single column based on header text + cell content lengths
  const autoFitColumn = (idx) => {
    const col = COLS[idx];
    const key = col.key;
    const texts = [
      col.label,
      ...board.circuits.map((r) => String(r[key] ?? "")),
    ];
    const maxLen = texts.reduce((m, t) => Math.max(m, t.length), 0);
    // rough px-per-char; a bit wider for non-rotated columns (description)
    const factor = col.rotate ? 7 : 8;
    const padding = col.rotate ? 30 : 40;
    const width = Math.max(col.min, Math.min(260, padding + maxLen * factor));

    setWidths((prev) => {
      const arr = [...prev];
      arr[idx] = width;
      return arr;
    });
  };

  // Auto-fit all columns in one go
  const autoFitAll = () => {
    const newWidths = COLS.map((c, idx) => {
      const key = c.key;
      const texts = [
        c.label,
        ...board.circuits.map((r) => String(r[key] ?? "")),
      ];
      const maxLen = texts.reduce((m, t) => Math.max(m, t.length), 0);
      const factor = c.rotate ? 7 : 8;
      const padding = c.rotate ? 30 : 40;
      return Math.max(c.min, Math.min(260, padding + maxLen * factor));
    });
    setWidths(newWidths);
  };

  /* ---------- Board level fields ---------- */
  const setBoardField = (key, value) => {
    setBoard((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "zsAtDB") {
        next.circuits = prev.circuits.map((r) => ({
          ...r,
          zs: computeZs(value, r.r1r2, r.r2only),
        }));
      }
      return next;
    });
  };

  /* ---------- Row patch ---------- */
  const patchRow = (rowIdx, patch) => {
    setBoard((prev) => {
      const rows = prev.circuits.map((r, i) => (i === rowIdx ? { ...r, ...patch } : r));
      const row = rows[rowIdx];

      if ("bsen" in patch || "curve" in patch || "rating" in patch) {
        row.maxZsAuto = computeMaxZs(row.bsen, row.curve, row.rating);
      }

      if ("r1r2" in patch || "r2only" in patch) {
        row.zs = computeZs(prev.zsAtDB, row.r1r2, row.r2only);
      }

      rows[rowIdx] = row;
      return { ...prev, circuits: rows };
    });
  };

  /* ---------- Row add/delete ---------- */
  const addRow = () => {
    setBoard((prev) => {
      const next = [...prev.circuits, makeRow(prev.circuits.length)];
      return { ...prev, circuits: next };
    });
  };

  const deleteRow = (rowIdx) => {
    setBoard((prev) => {
      const filtered = prev.circuits.filter((_, i) => i !== rowIdx);
      const renumbered = filtered.map((r, i) => ({ ...r, num: i + 1 }));
      return { ...prev, circuits: renumbered };
    });
  };

  /* ---------- Description memory ---------- */
  const handleDescBlur = (value) => {
    const v = String(value || "").trim();
    if (!v) return;
    setDescMem((prev) => {
      if (prev.includes(v)) return prev;
      const arr = [v, ...prev].slice(0, 30);
      try {
        localStorage.setItem("cec_descs", JSON.stringify(arr));
      } catch {
        /* ignore */
      }
      return arr;
    });
  };

  /* ---------- Context menu for autofill down ---------- */
  const handleCellContext = (e, rowIdx, key) => {
    e.preventDefault();
    setMenu({
      x: e.clientX,
      y: e.clientY,
      rowIdx,
      key,
    });
  };

  const autofillDown = () => {
    if (!menu) return;
    const { rowIdx, key } = menu;
    const value = board.circuits[rowIdx][key];

    setBoard((prev) => {
      const rows = prev.circuits.map((r, i) => {
        if (i < rowIdx) return r;
        const updated = { ...r, [key]: value };

        if (["bsen", "curve", "rating"].includes(key)) {
          updated.maxZsAuto = computeMaxZs(updated.bsen, updated.curve, updated.rating);
        }
        if (["r1r2", "r2only"].includes(key)) {
          updated.zs = computeZs(prev.zsAtDB, updated.r1r2, updated.r2only);
        }

        return updated;
      });

      return { ...prev, circuits: rows };
    });

    setMenu(null);
  };

  useEffect(() => {
    const onClick = () => setMenu(null);
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  /* ---------- Ref method helpers ---------- */
  const refDisplay = (code) => code || "";

  const refPicker = (rowIdx) =>
    openRefFor === rowIdx && (
      <div
        style={{
          position: "absolute",
          top: ROW_H,
          left: 0,
          zIndex: 10,
          background: "#fff",
          border: "1px solid #aaa",
          borderRadius: 4,
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          maxHeight: 260,
          overflowY: "auto",
          minWidth: 260,
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        {REF_METHOD_OPTIONS.map((opt) => (
          <div
            key={opt.code}
            onClick={() => {
              patchRow(rowIdx, { refMethod: opt.code });
              setOpenRefFor(null);
            }}
            style={{
              padding: "4px 8px",
              fontSize: FONT_BASE,
              cursor: "pointer",
              display: "flex",
              gap: 6,
            }}
          >
            <span style={{ fontWeight: 700, minWidth: 45 }}>{opt.code}</span>
            <span>{opt.desc}</span>
          </div>
        ))}
      </div>
    );

  const allDescOptions = descOptions;

  return (
    <div style={wrapStyle}>
      {/* Title band */}
      <div style={titleBandStyle}>SCHEDULE OF CIRCUIT DETAILS AND TEST RESULTS</div>

      {/* DISTRIBUTION BOARD DETAILS (top section) */}
      <fieldset
        style={{
          maxWidth: PAGE_MAX_WIDTH,
          margin: "0 auto 14px",
          border: `1px solid ${T.headBorder}`,
          background: "#bfc5cc",
        }}
      >
        <legend style={{ padding: "0 8px", fontWeight: 700, color: T.band }}>
          DISTRIBUTION BOARD DETAILS
        </legend>

        {/* Row 1 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            padding: "8px 10px",
          }}
        >
          <LabeledInput
            label="DB reference:"
            value={board.dbRef}
            onChange={(v) => setBoardField("dbRef", v)}
          />
          <LabeledInput
            label="Location:"
            value={board.location}
            onChange={(v) => setBoardField("location", v)}
            placeholder="Under stairs"
          />
          <LabeledInput
            label="Supplied from:"
            value={board.suppliedFrom}
            onChange={(v) => setBoardField("suppliedFrom", v)}
            placeholder="Origin"
          />
        </div>

        {/* Row 2 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.2fr 0.7fr 0.6fr",
            gap: 12,
            padding: "0 10px 8px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 70px auto 70px auto 70px",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: FONT_BASE }}>Distribution circuit OCPD:&nbsp;BS (EN):</span>
            <SmallBox
              value={board.distribBS}
              onChange={(v) => setBoardField("distribBS", v)}
              placeholder="LIM"
            />
            <span style={{ fontSize: FONT_BASE, justifySelf: "end" }}>Type:</span>
            <SmallBox
              value={board.boardType}
              onChange={(v) => setBoardField("boardType", v)}
              placeholder="LIM"
            />
            <span style={{ fontSize: FONT_BASE, justifySelf: "end" }}>Rating/Setting:</span>
            <SmallBox
              value={board.ratingSetting}
              onChange={(v) => setBoardField("ratingSetting", v)}
              placeholder="A"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 60px",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: FONT_BASE }}>No of phases:</span>
            <SmallBox
              value={board.phases}
              onChange={(v) => setBoardField("phases", v)}
              placeholder="1"
            />
          </div>

          <div />
        </div>

        {/* Row 3 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.2fr 1.4fr 1.5fr 0.7fr 0.7fr",
            gap: 12,
            padding: "0 10px 10px",
            alignItems: "center",
          }}
        >
          {/* SPD */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto auto auto auto auto auto",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: FONT_BASE }}>SPD Details:&nbsp;Types:</span>
            <SpanToggle
              label="T1"
              active={board.spdT1}
              onClick={() => setBoardField("spdT1", !board.spdT1)}
            />
            <SpanToggle
              label="T2"
              active={board.spdT2}
              onClick={() => setBoardField("spdT2", !board.spdT2)}
            />
            <SpanToggle
              label="T3"
              active={board.spdT3}
              onClick={() => setBoardField("spdT3", !board.spdT3)}
            />
          </div>

          {/* Confirmations */}
          <div>
            <ToggleRow
              text="Confirmation of supply polarity"
              active={board.polarityConfirmed}
              onClick={() => setBoardField("polarityConfirmed", !board.polarityConfirmed)}
            />
            <ToggleRow
              text="Confirmation of phase sequence"
              active={board.phaseSequenceConfirmed}
              onClick={() =>
                setBoardField("phaseSequenceConfirmed", !board.phaseSequenceConfirmed)
              }
              fallback="N/A"
            />
          </div>

          {/* spacer */}
          <div />

          {/* Zs at DB */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 70px auto",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: FONT_BASE }}>Zs at DB:</span>
            <SmallBox
              value={board.zsAtDB}
              onChange={(v) => setBoardField("zsAtDB", v)}
              placeholder="0.30"
            />
            <span style={{ fontSize: FONT_BASE }}>Ω</span>
          </div>

          {/* Ipf at DB */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 70px auto",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: FONT_BASE }}>Ipf at DB:</span>
            <SmallBox
              value={board.ipfAtDB}
              onChange={(v) => setBoardField("ipfAtDB", v)}
              placeholder="0.89"
            />
            <span style={{ fontSize: FONT_BASE }}>kA</span>
          </div>
        </div>
      </fieldset>

      {/* CIRCUIT SCHEDULE TABLE */}
      <div style={tableShellStyle}>
        <div
          style={{
            padding: "6px 10px 4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <button type="button" style={btnPrimary} onClick={addRow}>
              + Add row
            </button>
          </div>
          <div>
            <button type="button" style={btnSoft} onClick={autoFitAll}>
              Auto fit columns
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <colgroup>
              {COLS.map((c, idx) => (
                <col key={c.key} style={{ width: widths[idx] }} />
              ))}
            </colgroup>

            <thead>
              {/* group row */}
              <tr>
                {GROUPS.map((g, i) => (
                  <th key={i} style={groupCellStyle} colSpan={g.span}>
                    <div style={groupInnerStyle}>{g.label}</div>
                  </th>
                ))}
              </tr>

              {/* sub-header row */}
              <tr>
                {COLS.map((c, idx) => (
                  <th
                    key={c.key}
                    style={headCellStyle}
                    onDoubleClick={() => autoFitColumn(idx)}
                    title="Double-click to auto fit this column"
                  >
                    <div style={headInnerStyle}>
                      <div style={headLabelStyle(c.rotate)}>{c.label}</div>
                    </div>
                    <div
                      onMouseDown={(e) => startResize(e, idx)}
                      style={resizerStyle}
                    />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {board.circuits.map((row, rIdx) => (
                <tr key={rIdx} style={rowBg(rIdx)}>
                  {/* Circuit number */}
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "num")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.num}
                      onChange={(e) => patchRow(rIdx, { num: e.target.value })}
                    />
                  </td>

                  {/* Circuit description */}
                  <td
                    style={tdLeft}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "desc")}
                  >
                    <input
                      list="cec-descs"
                      style={cellInputStyle}
                      value={row.desc}
                      onChange={(e) => patchRow(rIdx, { desc: e.target.value })}
                      onBlur={(e) => handleDescBlur(e.target.value)}
                      placeholder="e.g., Kitchen Ring Final"
                    />
                  </td>

                  {/* Type of wiring */}
                  <td
                    style={tdLeft}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "wiring")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.wiring}
                      onChange={(e) => patchRow(rIdx, { wiring: e.target.value })}
                    />
                  </td>

                  {/* Reference method (code only, popup with detail) */}
                  <td
                    style={{ ...tdCenter, position: "relative" }}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "refMethod")}
                  >
                    <input
                      style={cellInputStyle}
                      readOnly
                      value={refDisplay(row.refMethod)}
                      placeholder="Ref"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenRefFor(openRefFor === rIdx ? null : rIdx);
                      }}
                    />
                    {refPicker(rIdx)}
                  </td>

                  {/* Live, Neutral, CPC, Max disc time */}
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "live")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.live}
                      onChange={(e) => patchRow(rIdx, { live: e.target.value })}
                    />
                  </td>
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "neutral")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.neutral}
                      onChange={(e) => patchRow(rIdx, { neutral: e.target.value })}
                    />
                  </td>
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "cpc")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.cpc}
                      onChange={(e) => patchRow(rIdx, { cpc: e.target.value })}
                    />
                  </td>
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "maxDisc")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.maxDisc}
                      onChange={(e) => patchRow(rIdx, { maxDisc: e.target.value })}
                    />
                  </td>

                  {/* OCPD */}
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "bsen")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.bsen}
                      onChange={(e) => patchRow(rIdx, { bsen: e.target.value })}
                    />
                  </td>
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "curve")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.curve}
                      onChange={(e) => patchRow(rIdx, { curve: e.target.value })}
                    />
                  </td>
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "rating")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.rating}
                      onChange={(e) => patchRow(rIdx, { rating: e.target.value })}
                    />
                  </td>
                  <td style={tdCenter}>
                    <input style={cellInputStyle} value={row.maxZsAuto} readOnly />
                  </td>

                  {/* RCD */}
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "rcdBs")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.rcdBs}
                      onChange={(e) => patchRow(rIdx, { rcdBs: e.target.value })}
                    />
                  </td>
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "rcdType")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.rcdType}
                      onChange={(e) => patchRow(rIdx, { rcdType: e.target.value })}
                    />
                  </td>
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "rcdMa")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.rcdMa}
                      onChange={(e) => patchRow(rIdx, { rcdMa: e.target.value })}
                    />
                  </td>

                  {/* Continuity */}
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "r1")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.r1}
                      onChange={(e) => patchRow(rIdx, { r1: e.target.value })}
                    />
                  </td>
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "rn")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.rn}
                      onChange={(e) => patchRow(rIdx, { rn: e.target.value })}
                    />
                  </td>
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "r2")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.r2}
                      onChange={(e) => patchRow(rIdx, { r2: e.target.value })}
                    />
                  </td>
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "r1r2")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.r1r2}
                      onChange={(e) => patchRow(rIdx, { r1r2: e.target.value })}
                    />
                  </td>
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "r2only")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.r2only}
                      onChange={(e) => patchRow(rIdx, { r2only: e.target.value })}
                    />
                  </td>

                  {/* Insulation resistance */}
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "irLn")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.irLn}
                      onChange={(e) => patchRow(rIdx, { irLn: e.target.value })}
                    />
                  </td>
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "irLe")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.irLe}
                      onChange={(e) => patchRow(rIdx, { irLe: e.target.value })}
                    />
                  </td>
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "irNe")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.irNe}
                      onChange={(e) => patchRow(rIdx, { irNe: e.target.value })}
                    />
                  </td>

                  {/* Zs / RCD / AFDD */}
                  <td style={tdCenter}>
                    <input style={cellInputStyle} value={row.zs} readOnly />
                  </td>
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "rcdTripX1")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.rcdTripX1}
                      onChange={(e) => patchRow(rIdx, { rcdTripX1: e.target.value })}
                    />
                  </td>
                  <td style={tdCenter}>
                    <input
                      type="checkbox"
                      checked={row.rcdPass}
                      onChange={(e) => patchRow(rIdx, { rcdPass: e.target.checked })}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td
                    style={tdCenter}
                    onContextMenu={(e) => handleCellContext(e, rIdx, "afdd")}
                  >
                    <input
                      style={cellInputStyle}
                      value={row.afdd}
                      onChange={(e) => patchRow(rIdx, { afdd: e.target.value })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* datalist for description predictive text */}
      <datalist id="cec-descs">
        {allDescOptions.map((d) => (
          <option key={d} value={d} />
        ))}
      </datalist>

      {/* context menu */}
      {menu && (
        <div
          style={{
            position: "fixed",
            left: menu.x,
            top: menu.y,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: 6,
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            style={{
              ...btnPrimary,
              padding: "6px 10px",
              fontSize: 12,
            }}
            onClick={autofillDown}
          >
            Autofill down “{menu.key}”
          </button>
        </div>
      )}
    </div>
  );
}

/* ---- Helper components for header block ---- */
function LabeledInput({ label, value, onChange, placeholder }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 8,
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: FONT_BASE }}>{label}</span>
      <div
        style={{
          background: "#fff",
          border: "1px solid #999",
          borderRadius: 2,
          height: 24,
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={{
            border: "none",
            padding: "0 6px",
            fontSize: FONT_BASE,
            width: "100%",
            outline: "none",
            background: "transparent",
          }}
        />
      </div>
    </div>
  );
}

function SmallBox({ value, onChange, placeholder }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #999",
        borderRadius: 2,
        height: 24,
        display: "flex",
        alignItems: "center",
      }}
    >
      <input
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "none",
          padding: "0 6px",
          fontSize: FONT_BASE,
          width: "100%",
          outline: "none",
          background: "transparent",
          textAlign: "center",
        }}
      />
    </div>
  );
}

function SpanToggle({ label, active, onClick }) {
  return (
    <>
      <span style={{ fontSize: FONT_BASE }}>{label}</span>
      <button
        type="button"
        onClick={onClick}
        style={{
          minWidth: 42,
          height: 24,
          background: "#fff",
          border: "1px solid #999",
          borderRadius: 2,
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        {active ? "✓" : "N/A"}
      </button>
    </>
  );
}

function ToggleRow({ text, active, onClick, fallback = "" }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 46px",
        gap: 8,
        alignItems: "center",
        marginBottom: 4,
      }}
    >
      <span style={{ fontSize: FONT_BASE }}>{text}</span>
      <button
        type="button"
        onClick={onClick}
        style={{
          minWidth: 46,
          height: 24,
          background: "#fff",
          border: "1px solid #999",
          borderRadius: 2,
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        {active ? "✓" : fallback}
      </button>
    </div>
  );
}

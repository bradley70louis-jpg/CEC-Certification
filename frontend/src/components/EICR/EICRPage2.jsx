// 📄 src/pages/EICRPage2.jsx
import React, { useEffect, useMemo, useState } from "react";

const T = {
  band: "#0e3a5b",
  bandText: "#ffffff",
  greyBg: "#f3f4f6",
  border: "#d1d5db",
  text: "#111827",
};

/** Single blank observation row */
const makeObservation = (index) => ({
  itemNo: index + 1,
  text: "",
  code: "N/A", // C1, C2, C3, FI, N/A
});

export default function EICRPage2({ data, setData }) {
  // “mode” = radio buttons at the top
  const [mode, setMode] = useState(data?.mode || "HAS_OBS"); // "NONE" | "HAS_OBS"

  const [observations, setObservations] = useState(() => {
    if (Array.isArray(data?.observations) && data.observations.length) {
      return data.observations;
    }
    return [makeObservation(0)];
  });

  // sync up to parent
  useEffect(() => {
    setData?.((prev) => ({
      ...prev,
      mode,
      observations,
    }));
  }, [mode, observations, setData]);

  const addRow = () => {
    setObservations((prev) => [...prev, makeObservation(prev.length)]);
  };

  const updateRow = (index, patch) => {
    setObservations((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              ...patch,
              itemNo: i + 1,
            }
          : { ...row, itemNo: i + 1 }
      )
    );
  };

  const removeRow = (index) => {
    setObservations((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (!next.length) return [makeObservation(0)];
      return next.map((row, i) => ({ ...row, itemNo: i + 1 }));
    });
  };

  // --- Auto summary for C1 / C2 / C3 / FI (item numbers) ---
  const summary = useMemo(() => {
    const c1 = [];
    const c2 = [];
    const c3 = [];
    const fi = [];

    observations.forEach((row, idx) => {
      const num = row.itemNo || idx + 1;
      switch (row.code) {
        case "C1":
          c1.push(num);
          break;
        case "C2":
          c2.push(num);
          break;
        case "C3":
          c3.push(num);
          break;
        case "FI":
          fi.push(num);
          break;
        default:
          break;
      }
    });

    const format = (arr) =>
      arr.length === 0 ? "N/A" : arr.join(", "); // you said just “number is fine”, but this matches the BS form (1,2,3)

    return {
      C1: format(c1),
      C2: format(c2),
      C3: format(c3),
      FI: format(fi),
    };
  }, [observations]);

  const disabled = mode === "NONE";

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: T.text }}>
      {/* Title band */}
      <div
        style={{
          background: T.band,
          color: T.bandText,
          fontWeight: 700,
          textAlign: "center",
          padding: "8px 10px",
          margin: "10px 0 14px",
        }}
      >
        7. OBSERVATIONS AND RECOMMENDATIONS FOR ACTIONS TO BE TAKEN
      </div>

      {/* Scope text + radio buttons */}
      <div
        style={{
          border: `1px solid ${T.border}`,
          background: T.greyBg,
          padding: "10px 14px",
          fontSize: 13,
          marginBottom: 10,
        }}
      >
        <div style={{ marginBottom: 8 }}>
          Referring to the attached schedules of inspection and test results,
          and subject to the limitations specified on page 1 of this report
          under &quot;Extent of the installation and limitations of inspection
          and testing&quot;:
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="radio"
              name="obsMode"
              checked={mode === "NONE"}
              onChange={() => setMode("NONE")}
            />
            <span>There are no items adversely affecting electrical safety</span>
          </label>

          <span style={{ fontSize: 12, fontWeight: 600 }}>or</span>

          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="radio"
              name="obsMode"
              checked={mode === "HAS_OBS"}
              onChange={() => setMode("HAS_OBS")}
            />
            <span>The following observations and recommendations are made</span>
          </label>
        </div>
      </div>

      {/* Add row button */}
      <div style={{ marginBottom: 8 }}>
        <button
          type="button"
          onClick={addRow}
          disabled={disabled}
          style={{
            background: disabled ? "#9ca3af" : T.band,
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "6px 14px",
            fontSize: 13,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          + Add observation
        </button>
      </div>

      {/* Observations table */}
      <div
        style={{
          border: `1px solid ${T.border}`,
          borderRadius: 2,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
          }}
        >
          <thead>
            <tr style={{ background: "#e5e7eb" }}>
              <th
                style={{
                  borderRight: `1px solid ${T.border}`,
                  padding: "6px 8px",
                  width: 70,
                  textAlign: "center",
                }}
              >
                Item No
              </th>
              <th
                style={{
                  borderRight: `1px solid ${T.border}`,
                  padding: "6px 8px",
                  textAlign: "left",
                }}
              >
                Observations
              </th>
              <th
                style={{
                  padding: "6px 8px",
                  width: 150,
                  textAlign: "center",
                }}
              >
                Classification Code
              </th>
            </tr>
          </thead>
          <tbody>
            {observations.map((row, index) => (
              <tr
                key={index}
                style={{
                  background: index % 2 ? "#f9fafb" : "#ffffff",
                }}
              >
                {/* Item No (read-only) */}
                <td
                  style={{
                    borderTop: `1px solid ${T.border}`,
                    borderRight: `1px solid ${T.border}`,
                    textAlign: "center",
                    padding: "4px 6px",
                  }}
                >
                  {index + 1}
                </td>

                {/* Observation text */}
                <td
                  style={{
                    borderTop: `1px solid ${T.border}`,
                    borderRight: `1px solid ${T.border}`,
                    padding: 0,
                  }}
                >
                  <textarea
                    value={row.text}
                    disabled={disabled}
                    onChange={(e) =>
                      updateRow(index, { text: e.target.value })
                    }
                    rows={2}
                    style={{
                      width: "100%",
                      minHeight: 44,
                      border: "none",
                      resize: "vertical",
                      padding: "6px 8px",
                      fontSize: 13,
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                    placeholder="e.g. Inspection Schedule Item 4.4: Condition of enclosure(s) in terms of fire rating..."
                  />
                </td>

                {/* Classification code */}
                <td
                  style={{
                    borderTop: `1px solid ${T.border}`,
                    padding: "4px 6px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  <select
                    disabled={disabled}
                    value={row.code}
                    onChange={(e) =>
                      updateRow(index, { code: e.target.value })
                    }
                    style={{
                      minWidth: 110,
                      padding: "4px 6px",
                      fontSize: 13,
                    }}
                  >
                    <option value="N/A">N/A</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                    <option value="C3">C3</option>
                    <option value="FI">FI</option>
                  </select>

                  {/* Remove row button (optional) */}
                  {observations.length > 1 && !disabled && (
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      style={{
                        marginLeft: 8,
                        background: "transparent",
                        border: "none",
                        color: "#b91c1c",
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                      title="Delete row"
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend for codes */}
      <div
        style={{
          border: `1px solid ${T.border}`,
          padding: "10px 12px",
          fontSize: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ marginBottom: 8 }}>
          One of the following codes, as appropriate, has been allocated to each
          of the observations made above to indicate to the person(s)
          responsible for the installation the degree of urgency for remedial
          action.
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          <CodeBox
            title="C1 - Danger Present"
            text="Risk of injury. Immediate remedial action required"
          />
          <CodeBox
            title="C2 - Potentially dangerous"
            text="Urgent remedial action required"
          />
          <CodeBox
            title="C3 - Improvement recommended"
            text="Improvement recommended"
          />
          <CodeBox
            title="FI - Further investigation required without delay"
            text="Further investigation required"
          />
        </div>
      </div>

      {/* AUTO-POPULATED SUMMARY LINES */}
      <SummaryLine
        label="Immediate remedial action required for items:"
        value={summary.C1}
      />
      <SummaryLine
        label="Urgent remedial action required for items:"
        value={summary.C2}
      />
      <SummaryLine
        label="Improvement recommended for items:"
        value={summary.C3}
      />
      <SummaryLine
        label="Further investigation required for items:"
        value={summary.FI}
      />
    </div>
  );
}

function CodeBox({ title, text }) {
  return (
    <div
      style={{
        border: `1px solid ${T.border}`,
        padding: "6px 8px",
        background: "#f9fafb",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{title}</div>
      <div>{text}</div>
    </div>
  );
}

function SummaryLine({ label, value }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.8fr) minmax(0, 0.6fr)",
        alignItems: "center",
        gap: 10,
        border: `1px solid ${T.border}`,
        borderTop: "none",
        fontSize: 13,
        padding: "6px 10px",
      }}
    >
      <div>{label}</div>
      <div
        style={{
          border: `1px solid ${T.border}`,
          padding: "4px 8px",
          background: "#fff",
          minHeight: 28,
        }}
      >
        {value}
      </div>
    </div>
  );
}

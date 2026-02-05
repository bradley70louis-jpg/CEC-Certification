// 📄 src/components/EICR/EICRPage1.jsx
import React, { useState } from "react";

const NEXT_TEST_OPTIONS = [
  "1 Week",
  "10 Years",
  "10 Years or change of tenant/owner",
  "12 Months",
  "18 Months",
  "2 Months",
  "2 Weeks",
  "2 Years",
  "3 Months",
  "3 Years",
  "3 Years or change of tenant/owner",
  "4 Weeks",
  "4 Years",
  "5 Years",
  "5 Years or change of tenant/owner",
  "6 Months",
  "6 Weeks",
  "Change of Owner/Occupancy/Use",
];

const bandStyle = {
  background: "#0e3a5b",
  color: "#fff",
  fontWeight: 700,
  padding: "6px 10px",
  fontSize: 13,
  letterSpacing: 0.2,
};

const sectionBox = {
  border: "1px solid #cbd5e1",
  borderTop: "none",
  padding: "10px 12px 12px",
  background: "#f8fafc",
};

const labelStyle = {
  fontSize: 13,
  marginBottom: 4,
};

const textInputStyle = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 4,
  border: "1px solid #cbd5e1",
  fontSize: 13,
  boxSizing: "border-box",
};

const textareaStyle = {
  ...textInputStyle,
  minHeight: 60,
  resize: "vertical",
};

const selectStyle = {
  ...textInputStyle,
};

export default function EICRPage1({ data, setData, certificateId }) {
  const [clientLookupPostcode, setClientLookupPostcode] = useState(
    data?.clientPostcode || ""
  );
  const [instLookupPostcode, setInstLookupPostcode] = useState(
    data?.installationPostcode || ""
  );

  const update = (patch) =>
    setData((prev) => ({
      ...prev,
      ...patch,
    }));

  // 🔍 Postcode lookup helpers
  const lookupAddress = async (postcode, targetPrefix) => {
    const trimmed = (postcode || "").trim();
    if (!trimmed) {
      alert("Please enter a postcode first");
      return;
    }

    try {
      const res = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(trimmed)}`
      );
      const json = await res.json();
      if (json.status !== 200 || !json.result) {
        alert("Address not found for that postcode");
        return;
      }

      const { line_1, line_2, line_3, post_town } = json.result;
      const addr1 = line_1 || "";
      const addr2 = [line_2, post_town].filter(Boolean).join(", ");
      const addr3 = line_3 || "";

      update({
        [`${targetPrefix}Address1`]: addr1,
        [`${targetPrefix}Address2`]: addr2,
        [`${targetPrefix}Address3`]: addr3,
        [`${targetPrefix}Postcode`]: trimmed.toUpperCase(),
      });

      if (targetPrefix === "client") setClientLookupPostcode(trimmed.toUpperCase());
      if (targetPrefix === "installation")
        setInstLookupPostcode(trimmed.toUpperCase());
    } catch (err) {
      console.error("Postcode lookup failed", err);
      alert("Postcode lookup failed – please type the address manually.");
    }
  };

  const overallAssessment = data.overallAssessment || "";

  return (
    <div style={{ background: "#e5edf6", padding: 12, borderRadius: 6 }}>
      {/* Certificate number strip */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0e3a5b" }}>
          Electrical Installation Condition Report
        </div>
        <div style={{ fontSize: 12 }}>
          <strong>Certificate ID:&nbsp;</strong>
          <span>{certificateId}</span>
        </div>
      </div>

      {/* 1. DETAILS OF THE PERSON ORDERING THE REPORT */}
      <div style={{ marginBottom: 14 }}>
        <div style={bandStyle}>1. DETAILS OF THE PERSON ORDERING THE REPORT</div>
        <div style={sectionBox}>
          {/* Client name + postcode lookup */}
          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>Client</label>
            <input
              style={textInputStyle}
              value={data.clientName || ""}
              onChange={(e) => update({ clientName: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>Client address</label>
            <input
              style={{ ...textInputStyle, marginBottom: 4 }}
              placeholder="Address line 1"
              value={data.clientAddress1 || ""}
              onChange={(e) => update({ clientAddress1: e.target.value })}
            />
            <input
              style={{ ...textInputStyle, marginBottom: 4 }}
              placeholder="Address line 2"
              value={data.clientAddress2 || ""}
              onChange={(e) => update({ clientAddress2: e.target.value })}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={{ ...textInputStyle, flex: 1 }}
                placeholder="Address line 3"
                value={data.clientAddress3 || ""}
                onChange={(e) => update({ clientAddress3: e.target.value })}
              />
              <div style={{ flex: "0 0 140px" }}>
                <label style={{ ...labelStyle, display: "block" }}>
                  Postcode
                </label>
                <div style={{ display: "flex", gap: 4 }}>
                  <input
                    style={{ ...textInputStyle, flex: 1 }}
                    value={clientLookupPostcode}
                    onChange={(e) => setClientLookupPostcode(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      lookupAddress(clientLookupPostcode, "client")
                    }
                    style={{
                      padding: "6px 8px",
                      borderRadius: 4,
                      border: "1px solid #0e3a5b",
                      background: "#0e3a5b",
                      color: "#fff",
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                  >
                    Lookup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. REASON FOR PRODUCING THIS REPORT */}
      <div style={{ marginBottom: 14 }}>
        <div style={bandStyle}>2. REASON FOR PRODUCING THIS REPORT</div>
        <div style={sectionBox}>
          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>Reason for producing this report</label>
            <textarea
              style={textareaStyle}
              value={data.reasonForReport || ""}
              onChange={(e) => update({ reasonForReport: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13 }}>
              Date(s) on which inspection and testing was carried out:
            </span>
            <input
              type="date"
              style={{ ...textInputStyle, maxWidth: 180 }}
              value={data.inspectionDate || ""}
              onChange={(e) => update({ inspectionDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 3. DETAILS OF THE INSTALLATION */}
      <div style={{ marginBottom: 14 }}>
        <div style={bandStyle}>
          3. DETAILS OF THE INSTALLATION WHICH IS THE SUBJECT OF THIS REPORT
        </div>
        <div style={sectionBox}>
          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>Installation address / name</label>
            <input
              style={textInputStyle}
              value={data.installationName || ""}
              onChange={(e) => update({ installationName: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>Installation address</label>
            <input
              style={{ ...textInputStyle, marginBottom: 4 }}
              placeholder="Address line 1"
              value={data.installationAddress1 || ""}
              onChange={(e) =>
                update({ installationAddress1: e.target.value })
              }
            />
            <input
              style={{ ...textInputStyle, marginBottom: 4 }}
              placeholder="Address line 2"
              value={data.installationAddress2 || ""}
              onChange={(e) =>
                update({ installationAddress2: e.target.value })
              }
            />
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={{ ...textInputStyle, flex: 1 }}
                placeholder="Address line 3"
                value={data.installationAddress3 || ""}
                onChange={(e) =>
                  update({ installationAddress3: e.target.value })
                }
              />
              <div style={{ flex: "0 0 140px" }}>
                <label style={{ ...labelStyle, display: "block" }}>
                  Postcode
                </label>
                <div style={{ display: "flex", gap: 4 }}>
                  <input
                    style={{ ...textInputStyle, flex: 1 }}
                    value={instLookupPostcode}
                    onChange={(e) => setInstLookupPostcode(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      lookupAddress(instLookupPostcode, "installation")
                    }
                    style={{
                      padding: "6px 8px",
                      borderRadius: 4,
                      border: "1px solid #0e3a5b",
                      background: "#0e3a5b",
                      color: "#fff",
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                  >
                    Lookup
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Age of wiring / additions / records */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1.4fr) minmax(0,1.2fr) minmax(0,1.2fr)",
              gap: 8,
              alignItems: "center",
              marginTop: 6,
            }}
          >
            <div>
              <label style={labelStyle}>
                Estimated age of wiring system (years)
              </label>
              <input
                type="number"
                min="0"
                style={textInputStyle}
                value={data.wiringAgeYears || ""}
                onChange={(e) => update({ wiringAgeYears: e.target.value })}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Evidence of additions / alterations
              </label>
              <select
                style={selectStyle}
                value={data.additionsAlterations || ""}
                onChange={(e) =>
                  update({ additionsAlterations: e.target.value })
                }
              >
                <option value="">Select…</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>If yes, estimated age (years)</label>
              <input
                type="number"
                min="0"
                style={textInputStyle}
                value={data.additionsAgeYears || ""}
                onChange={(e) =>
                  update({ additionsAgeYears: e.target.value })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>
                Installation records available? (Reg. 651.1)
              </label>
              <select
                style={selectStyle}
                value={data.recordsAvailable || ""}
                onChange={(e) => update({ recordsAvailable: e.target.value })}
              >
                <option value="">Select…</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
          </div>

          <div
            style={{
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 13 }}>Date of last inspection:</span>
            <input
              type="date"
              style={{ ...textInputStyle, maxWidth: 180 }}
              value={data.lastInspectionDate || ""}
              onChange={(e) =>
                update({ lastInspectionDate: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* 4. EXTENT AND LIMITATIONS OF INSPECTION AND TESTING */}
      <div style={{ marginBottom: 14 }}>
        <div style={bandStyle}>
          4. EXTENT AND LIMITATIONS OF INSPECTION AND TESTING
        </div>
        <div style={sectionBox}>
          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>
              Extent of the electrical installation covered by this report
            </label>
            <textarea
              style={textareaStyle}
              value={data.extent || ""}
              onChange={(e) => update({ extent: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>
              Agreed limitations including the reasons (see Regulation 653.2)
            </label>
            <textarea
              style={textareaStyle}
              value={data.agreedLimitations || ""}
              onChange={(e) => update({ agreedLimitations: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>Agreed with</label>
            <input
              style={textInputStyle}
              value={data.agreedWith || ""}
              onChange={(e) => update({ agreedWith: e.target.value })}
            />
          </div>

          <div>
            <label style={labelStyle}>
              Operational limitations including the reasons
            </label>
            <textarea
              style={textareaStyle}
              value={data.operationalLimitations || ""}
              onChange={(e) =>
                update({ operationalLimitations: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* 5. SUMMARY OF THE CONDITION OF THE INSTALLATION */}
      <div style={{ marginBottom: 14 }}>
        <div style={bandStyle}>
          5. SUMMARY OF THE CONDITION OF THE INSTALLATION
        </div>
        <div style={sectionBox}>
          <p style={{ fontSize: 12, marginTop: 0 }}>
            See section 8 for a summary of the general condition of the
            installation in terms of electrical safety.
          </p>

          <div style={{ marginBottom: 6 }}>
            <label style={labelStyle}>
              Overall assessment of the installation in terms of its suitability
              for continued use*
            </label>
            <select
              style={{ ...selectStyle, maxWidth: 260 }}
              value={overallAssessment}
              onChange={(e) => update({ overallAssessment: e.target.value })}
            >
              <option value="">Select…</option>
              <option value="Satisfactory">Satisfactory</option>
              <option value="Unsatisfactory">Unsatisfactory</option>
            </select>
          </div>

          <p style={{ fontSize: 12, marginBottom: 0 }}>
            * An unsatisfactory assessment indicates that dangerous (Code C1)
            and/or potentially dangerous (Code C2) conditions have been
            identified.
          </p>
        </div>
      </div>

      {/* 6. RECOMMENDATIONS – includes Next Test dropdown + free text */}
      <div>
        <div style={bandStyle}>6. RECOMMENDATIONS</div>
        <div style={sectionBox}>
          <p style={{ fontSize: 12, marginTop: 0 }}>
            Where the overall assessment of the suitability of the installation
            for continued use on page 1 is stated as{" "}
            <strong>'UNSATISFACTORY'</strong>, I/We recommend that any
            observations classified as 'Code 1 - Danger Present' or 'Code 2 -
            Potentially dangerous' are acted upon as a matter of urgency.
            Investigation without delay is recommended for observations
            identified as 'FI - Further Investigation Required'. Observations
            classified as 'Code 3 - Improvement recommended' should be given due
            consideration.
          </p>

          {/* Next inspection interval */}
          <div
            style={{
              borderTop: "1px solid #cbd5e1",
              marginTop: 8,
              paddingTop: 8,
            }}
          >
            <div style={{ ...labelStyle, marginBottom: 4 }}>
              Subject to the necessary remedial action being taken, I/We
              recommend that the installation is further inspected and tested
              by:
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                maxWidth: 600,
              }}
            >
              <select
                style={{ ...selectStyle, flex: "0 0 260px" }}
                value={data.nextInspectionPreset || ""}
                onChange={(e) => {
                  const preset = e.target.value;
                  update({
                    nextInspectionPreset: preset,
                    nextInspectionText:
                      preset || data.nextInspectionText || "",
                  });
                }}
              >
                <option value="">Select interval…</option>
                {NEXT_TEST_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <input
                type="text"
                style={{ ...textInputStyle, flex: 1 }}
                placeholder="or type your own interval (e.g. 9 Months)"
                value={data.nextInspectionText || ""}
                onChange={(e) =>
                  update({ nextInspectionText: e.target.value })
                }
              />
            </div>
          </div>

          <p style={{ fontSize: 11, marginTop: 8, color: "#4b5563" }}>
            Note: The proposed date for the next inspection should take into
            consideration the frequency and quality of maintenance that the
            installation can reasonably be expected to receive during its
            intended life. The period should be agreed between relevant parties.
          </p>
        </div>
      </div>
    </div>
  );
}

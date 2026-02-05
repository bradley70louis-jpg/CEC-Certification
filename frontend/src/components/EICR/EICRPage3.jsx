import React from "react";

export default function EICRPage3({ data = {}, setData }) {
  const d = data;
  const set = (patch) => setData((prev) => ({ ...prev, ...patch }));
  const handleText = (e) => {
    const { name, value } = e.target;
    set({ [name]: value });
  };
  const handleCheck = (name) => set({ [name]: !d[name] });

  return (
    <>
      {/* ========================== 8. GENERAL CONDITION ========================== */}
      <fieldset style={section}>
        <h3 style={legend}>8. GENERAL CONDITION OF THE INSTALLATION</h3>
        <label style={label}>
          General condition of the installation (in terms of electrical safety):
        </label>
        <textarea
          name="generalCondition"
          value={d.generalCondition || ""}
          onChange={handleText}
          rows={4}
          style={textarea}
        />
      </fieldset>

      {/* ========================== 9. DECLARATION ========================== */}
      <fieldset style={section}>
        <h3 style={legend}>9. DECLARATION</h3>
        <p style={declarationText}>
          I/We, being the person(s) responsible for the inspection and testing of the electrical
          installation (as indicated by my/our signatures below), particulars of which are described
          above, having exercised reasonable skill and care when carrying out the inspection and
          testing, hereby declare that the information in this report, including the observations
          and the attached schedules, provides an accurate assessment of the condition of the
          electrical installation taking into account the stated extent and limitations in Section 4
          of this report.
        </p>

        <div style={grid2}>
          <div>
            <label style={labelSmall}>Trading Title:</label>
            <input
              type="text"
              name="tradingTitle"
              value={d.tradingTitle || ""}
              onChange={handleText}
              style={input}
            />
            <label style={labelSmall}>Address:</label>
            <textarea
              name="declarationAddress"
              value={d.declarationAddress || ""}
              onChange={handleText}
              rows={3}
              style={textareaSmall}
            />
            <div style={row}>
              <label style={labelSmall}>Postcode:</label>
              <input
                type="text"
                name="declarationPostcode"
                value={d.declarationPostcode || ""}
                onChange={handleText}
                style={inputShort}
              />
            </div>
          </div>

          <div>
            <div style={row}>
              <label style={labelSmall}>Registration Number (if applicable):</label>
              <input
                type="text"
                name="registrationNumber"
                value={d.registrationNumber || ""}
                onChange={handleText}
                style={inputShort}
              />
            </div>
            <div style={row}>
              <label style={labelSmall}>Telephone Number:</label>
              <input
                type="text"
                name="telephoneNumber"
                value={d.telephoneNumber || ""}
                onChange={handleText}
                style={inputShort}
              />
            </div>
          </div>
        </div>

        <hr style={divider} />

        <div style={grid2}>
          <div>
            <label style={labelSmall}>For the INSPECTION, TESTING AND ASSESSMENT of the report:</label>
            <div style={row}>
              <input
                type="text"
                name="inspectorName"
                placeholder="Name"
                value={d.inspectorName || ""}
                onChange={handleText}
                style={input}
              />
              <input
                type="text"
                name="inspectorPosition"
                placeholder="Position"
                value={d.inspectorPosition || ""}
                onChange={handleText}
                style={input}
              />
            </div>
            <div style={row}>
              <input
                type="text"
                name="inspectorSignature"
                placeholder="Signature"
                value={d.inspectorSignature || ""}
                onChange={handleText}
                style={inputShort}
              />
              <input
                type="date"
                name="inspectorDate"
                value={d.inspectorDate || ""}
                onChange={handleText}
                style={inputShort}
              />
            </div>
          </div>

          <div>
            <label style={labelSmall}>Report reviewed and authorised for issue by:</label>
            <div style={row}>
              <input
                type="text"
                name="reviewerName"
                placeholder="Name"
                value={d.reviewerName || ""}
                onChange={handleText}
                style={input}
              />
              <input
                type="text"
                name="reviewerPosition"
                placeholder="Position"
                value={d.reviewerPosition || ""}
                onChange={handleText}
                style={input}
              />
            </div>
            <div style={row}>
              <input
                type="text"
                name="reviewerSignature"
                placeholder="Signature"
                value={d.reviewerSignature || ""}
                onChange={handleText}
                style={inputShort}
              />
              <input
                type="date"
                name="reviewerDate"
                value={d.reviewerDate || ""}
                onChange={handleText}
                style={inputShort}
              />
            </div>
          </div>
        </div>
      </fieldset>

      {/* ========================== 10. SUPPLY CHARACTERISTICS ========================== */}
      <fieldset style={section}>
        <h3 style={legend}>10. SUPPLY CHARACTERISTICS AND EARTHING ARRANGEMENTS</h3>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Earthing Arrangements</th>
              <th style={th}>Number and Type of Live Conductors</th>
              <th style={th}>Nature of Supply Parameters</th>
              <th style={th}>Supply Protective Device</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>
                {["TN-S", "TN-C-S", "TT", "Other"].map((t) => (
                  <div key={t}>
                    <input
                      type="checkbox"
                      checked={d[`earthing_${t}`] || false}
                      onChange={() => handleCheck(`earthing_${t}`)}
                    />{" "}
                    {t}
                  </div>
                ))}
              </td>
              <td style={td}>
                <div><label><input type="checkbox" checked={d.phase1 || false} onChange={() => handleCheck("phase1")} /> 1-phase (2-wire)</label></div>
                <div><label><input type="checkbox" checked={d.phase2 || false} onChange={() => handleCheck("phase2")} /> 2-phase (3-wire)</label></div>
                <div><label><input type="checkbox" checked={d.phase3 || false} onChange={() => handleCheck("phase3")} /> 3-phase (4-wire)</label></div>
              </td>
              <td style={td}>
                <div style={rowMini}><label>Nominal voltage, U/U₀:</label><input type="text" name="nominalVoltage" value={d.nominalVoltage || ""} onChange={handleText} style={inputShort}/> V</div>
                <div style={rowMini}><label>Nominal frequency:</label><input type="text" name="nominalFrequency" value={d.nominalFrequency || ""} onChange={handleText} style={inputShort}/> Hz</div>
                <div style={rowMini}><label>Prospective fault current, Ipf:</label><input type="text" name="ipf" value={d.ipf || ""} onChange={handleText} style={inputShort}/> kA</div>
                <div style={rowMini}><label>External earth fault loop impedance, Ze:</label><input type="text" name="ze" value={d.ze || ""} onChange={handleText} style={inputShort}/> Ω</div>
              </td>
              <td style={td}>
                <div><label>BS(EN):</label><input type="text" name="supplyBS" value={d.supplyBS || ""} onChange={handleText} style={inputShort}/></div>
                <div><label>Type:</label><input type="text" name="supplyType" value={d.supplyType || ""} onChange={handleText} style={inputShort}/></div>
                <div><label>Rated current:</label><input type="text" name="supplyRatedCurrent" value={d.supplyRatedCurrent || ""} onChange={handleText} style={inputShort}/> A</div>
              </td>
            </tr>
          </tbody>
        </table>
      </fieldset>

      {/* ========================== 11. PARTICULARS OF INSTALLATION ========================== */}
      <fieldset style={section}>
        <h3 style={legend}>11. PARTICULARS OF INSTALLATION REFERRED TO IN THE REPORT</h3>

        {/* Means of Earthing */}
        <div style={row}>
          <label style={labelSmall}>Means of Earthing:</label>
          <label><input type="checkbox" checked={d.earthingDistributor || false} onChange={() => handleCheck("earthingDistributor")} /> Distributor’s</label>
          <label><input type="checkbox" checked={d.earthingElectrode || false} onChange={() => handleCheck("earthingElectrode")} /> Installation earth electrode</label>
        </div>

        <div style={grid3}>
          <div>
            <label style={labelSmall}>Location:</label>
            <input type="text" name="earthLocation" value={d.earthLocation || ""} onChange={handleText} style={input}/>
          </div>
          <div>
            <label style={labelSmall}>Resistance to Earth (Ω):</label>
            <input type="text" name="earthResistance" value={d.earthResistance || ""} onChange={handleText} style={inputShort}/>
          </div>
          <div>
            <label style={labelSmall}>Method of measurement:</label>
            <input type="text" name="earthMethod" value={d.earthMethod || ""} onChange={handleText} style={input}/>
          </div>
        </div>

        <hr style={divider} />

        {/* Main Switch */}
        <div style={grid4}>
          <div>
            <label style={labelSmall}>Main Switch / Switch-Fuse / Circuit-Breaker / RCD</label>
          </div>
          <div>
            <label style={labelSmall}>BS (EN):</label>
            <input type="text" name="mainSwitchBS" value={d.mainSwitchBS || ""} onChange={handleText} style={inputShort}/>
          </div>
          <div>
            <label style={labelSmall}>Number of poles:</label>
            <input type="text" name="mainSwitchPoles" value={d.mainSwitchPoles || ""} onChange={handleText} style={inputShort}/>
          </div>
          <div>
            <label style={labelSmall}>Current rating:</label>
            <input type="text" name="mainSwitchCurrent" value={d.mainSwitchCurrent || ""} onChange={handleText} style={inputShort}/>
          </div>
        </div>

        <div style={grid4}>
          <div>
            <label style={labelSmall}>Fuse/device rating or setting:</label>
            <input type="text" name="mainSwitchFuseRating" value={d.mainSwitchFuseRating || ""} onChange={handleText} style={inputShort}/>
          </div>
          <div>
            <label style={labelSmall}>Voltage rating:</label>
            <input type="text" name="mainSwitchVoltage" value={d.mainSwitchVoltage || ""} onChange={handleText} style={inputShort}/>
          </div>
          <div>
            <label style={labelSmall}>RCD Type:</label>
            <input type="text" name="mainSwitchRCDType" value={d.mainSwitchRCDType || ""} onChange={handleText} style={inputShort}/>
          </div>
          <div>
            <label style={labelSmall}>Rated residual operating current IΔn (mA):</label>
            <input type="text" name="mainSwitchRCDmA" value={d.mainSwitchRCDmA || ""} onChange={handleText} style={inputShort}/>
          </div>
        </div>

        <div style={grid3}>
          <div>
            <label style={labelSmall}>Rated time delay:</label>
            <input type="text" name="mainSwitchDelay" value={d.mainSwitchDelay || ""} onChange={handleText} style={inputShort}/>
          </div>
          <div>
            <label style={labelSmall}>Measured operating time:</label>
            <input type="text" name="mainSwitchTrip" value={d.mainSwitchTrip || ""} onChange={handleText} style={inputShort}/>
          </div>
        </div>

        <hr style={divider} />

        {/* Earthing and Bonding */}
        <h4 style={{ marginBottom: 8 }}>Earthing and Protective Bonding Conductors</h4>
        <div style={grid2}>
          <div>
            <label style={labelSmall}>Earthing conductor csa (mm²):</label>
            <input type="text" name="earthingCSA" value={d.earthingCSA || ""} onChange={handleText} style={inputShort}/>
          </div>
          <div>
            <label style={labelSmall}>Connection/continuity verified:</label>
            <input type="checkbox" checked={d.earthingVerified || false} onChange={() => handleCheck("earthingVerified")}/>
          </div>
        </div>

        <div style={grid2}>
          <div>
            <label style={labelSmall}>Main protective bonding conductors csa (mm²):</label>
            <input type="text" name="bondingCSA" value={d.bondingCSA || ""} onChange={handleText} style={inputShort}/>
          </div>
          <div>
            <label style={labelSmall}>Connection/continuity verified:</label>
            <input type="checkbox" checked={d.bondingVerified || false} onChange={() => handleCheck("bondingVerified")}/>
          </div>
        </div>

        <hr style={divider} />

        {/* Bonding of extraneous parts */}
        <h4 style={{ marginBottom: 8 }}>Bonding of extraneous-conductive parts</h4>
        <div style={grid3}>
          <label><input type="checkbox" checked={d.bondWater || false} onChange={() => handleCheck("bondWater")} /> To water installation pipes</label>
          <label><input type="checkbox" checked={d.bondGas || false} onChange={() => handleCheck("bondGas")} /> To gas installation pipes</label>
          <label><input type="checkbox" checked={d.bondStructural || false} onChange={() => handleCheck("bondStructural")} /> To structural steel</label>
        </div>
        <div style={grid3}>
          <label><input type="checkbox" checked={d.bondLighting || false} onChange={() => handleCheck("bondLighting")} /> To lighting protection</label>
          <label><input type="checkbox" checked={d.bondOther || false} onChange={() => handleCheck("bondOther")} /> To other services</label>
        </div>
      </fieldset>
    </>
  );
}

/* ========================== STYLES ========================== */
const section = { border: "1px solid #ccc", padding: 16, borderRadius: 8, marginBottom: 20 };
const legend = { color: "#003366", marginBottom: 10 };
const label = { display: "block", fontWeight: 600, marginBottom: 6 };
const labelSmall = { fontSize: "0.85rem", marginBottom: 4 };
const input = { width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #ccc" };
const inputShort = { ...input, maxWidth: 120 };
const textarea = { ...input, minHeight: 80, resize: "vertical" };
const textareaSmall = { ...input, minHeight: 50, resize: "vertical" };
const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 };
const grid3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 };
const grid4 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 };
const row = { display: "flex", gap: 8, alignItems: "center", marginTop: 6 };
const rowMini = { display: "flex", gap: 6, alignItems: "center", marginTop: 4 };
const divider = { margin: "12px 0", borderTop: "1px solid #ccc" };

const table = { width: "100%", borderCollapse: "collapse", marginTop: 10 };
const th = { border: "1px solid #ccc", background: "#f0f0f0", padding: 8, textAlign: "left" };
const td = { border: "1px solid #ccc", padding: 8, verticalAlign: "top" };

const declarationText = {
  fontSize: "0.85rem",
  lineHeight: 1.4,
  color: "#333",
  marginBottom: 12,
};
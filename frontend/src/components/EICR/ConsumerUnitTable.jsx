import React, { useCallback, useState } from "react";
import TypeaheadSelect from "./TypeaheadSelect";
import RightClickFill from "./RightClickFill";
import { getMaxZs } from "./eicrLookups";

const ROWS = 12;
const WIRING_CODES = ["A","B","C","D","E","F","G","H","O"];
const REF_METHODS = ["A","B","C","D","E"];
const BSEN = ["60898","61009","3871","3036","60947-2","BS88-2"];
const OCPD_TYPE = ["B","C","D","RCBO","MCCB"];
const RCD_TYPES = ["A","AC","S","Type A","Type AC","Type S"];
const RCD_MA = ["10","30","100","300","500"];
const AFDD = ["", "✓", "N/A"];

const th = "text-center text-xs font-semibold border border-gray-300 bg-gray-100 py-2 px-2";
const thDark = "text-center text-xs font-semibold border border-gray-300 bg-emerald-900 text-white py-2 px-2";
const td = "border border-gray-300";

function NumberInput({ value, onChange, placeholder="" }) {
  return (
    <input
      type="text"
      value={value ?? ""}
      inputMode="decimal"
      onChange={(e)=>onChange(e.target.value.replace(/[^\d.]/g,""))}
      placeholder={placeholder}
      className="w-full h-9 px-2 text-sm border border-gray-300 rounded-sm outline-none"
    />
  );
}

export default function ConsumerUnitTable() {
  const [rows, setRows] = useState(() => Array.from({length: ROWS}, (_, i) => ({
    number: i+1, description:"", wiring:"", refMethod:"",
    line:"", neutral:"", cpc:"", maxDiscTime:"",
    bsen:"", ocpdType:"", ratingA:"", maxZsAuto:"",
    rcdType:"", rcdmA:"", rcdbs:"",
    r1_milliohm:"", rn_milliohm:"", r2_milliohm:"", r1plusr2:"",
    irLN:"", irLE:"", irNE:"",
    zsAtDB:"", rcdTripX1:"", afdd:"",
  })));

  const setField = useCallback((idx, key, val) => {
    setRows(prev => {
      const next = [...prev];
      const r = { ...next[idx], [key]: val };
      if (["bsen","ocpdType","ratingA"].includes(key)) {
        r.maxZsAuto = getMaxZs(r.bsen, r.ocpdType, r.ratingA);
      }
      next[idx] = r;
      return next;
    });
  }, []);

  const fillDown = useCallback((idx, key) => {
    setRows(prev => {
      const val = prev[idx][key];
      const next = [...prev];
      for (let i = idx + 1; i < next.length; i++) {
        const row = { ...next[i], [key]: val };
        if (["bsen","ocpdType","ratingA"].includes(key)) {
          row.maxZsAuto = getMaxZs(
            key==="bsen" ? val : row.bsen,
            key==="ocpdType" ? val : row.ocpdType,
            key==="ratingA" ? val : row.ratingA
          );
        }
        next[i] = row;
      }
      return next;
    });
  }, []);

  return (
    <div className="p-4">
      <div className="w-full rounded-sm mb-3 px-3 py-2 text-white font-semibold text-sm bg-emerald-900">
        SCHEDULE OF CIRCUIT DETAILS AND TEST RESULTS
      </div>

      <div className="overflow-x-auto border border-gray-300">
        <table className="min-w-[1100px] w-full border-collapse">
          <thead>
            <tr>
              <th className={thDark}>Circuit number</th>
              <th className={thDark}>Circuit description</th>
              <th className={th} colSpan={6}>Conductor details</th>
              <th className={th} colSpan={4}>Overcurrent protective device</th>
              <th className={th} colSpan={3}>RCD</th>
              <th className={th} colSpan={4}>Continuity (Ω)</th>
              <th className={th} colSpan={3}>Insulation resistance</th>
              <th className={th} colSpan={2}>Zs / RCD</th>
              <th className={thDark}>AFDD</th>
            </tr>
            <tr>
              <th className={th}>#</th>
              <th className={th}>Description</th>
              <th className={th}>Type of wiring</th>
              <th className={th}>Reference method</th>
              <th className={th}>Line (mm²)</th>
              <th className={th}>Neutral (mm²)</th>
              <th className={th}>cpc (mm²)</th>
              <th className={th}>Max disconnection time (s)</th>
              <th className={th}>BS (EN)</th>
              <th className={th}>Type</th>
              <th className={th}>Rating (A)</th>
              <th className={th}>Max Zs (Ω) (auto)</th>
              <th className={th}>RCD Type</th>
              <th className={th}>RCD Rating (mA)</th>
              <th className={th}>RCD BS (EN)</th>
              <th className={th}>R1 (mΩ)</th>
              <th className={th}>rn (mΩ)</th>
              <th className={th}>r2 (mΩ)</th>
              <th className={th}>R1+R2 or R2 (Ω)</th>
              <th className={th}>IR L-N (MΩ)</th>
              <th className={th}>IR L-E (MΩ)</th>
              <th className={th}>IR N-E (MΩ)</th>
              <th className={th}>Zs at DB (Ω)</th>
              <th className={th}>RCD x1 trip (ms)</th>
              <th className={th}>AFDD</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50">
                <td className={`${td} text-center text-sm w-10`}>{r.number}</td>
                <td className={`${td} w-64`}>
                  <TypeaheadSelect
                    value={r.description}
                    onChange={(v)=>setField(i, "description", v)}
                    options={["Ring final sockets","Kitchen ring final","Cooker / oven","Lights (GF)","Lights (FF)","Boiler / heating","Shower","Smoke alarms","Garage / outbuilding"]}
                    placeholder="Describe circuit…"
                  />
                </td>

                <td className={td}>
                  <RightClickFill onFill={()=>fillDown(i,"wiring")}>
                    <TypeaheadSelect value={r.wiring} onChange={(v)=>setField(i, "wiring", v)} options={WIRING_CODES} placeholder="A…H/O" />
                  </RightClickFill>
                </td>

                <td className={td}>
                  <RightClickFill onFill={()=>fillDown(i,"refMethod")}>
                    <TypeaheadSelect value={r.refMethod} onChange={(v)=>setField(i, "refMethod", v)} options={REF_METHODS} placeholder="A…E" />
                  </RightClickFill>
                </td>

                <td className={td}><NumberInput value={r.line} onChange={(v)=>setField(i,"line",v)} /></td>
                <td className={td}><NumberInput value={r.neutral} onChange={(v)=>setField(i,"neutral",v)} /></td>
                <td className={td}><NumberInput value={r.cpc} onChange={(v)=>setField(i,"cpc",v)} /></td>
                <td className={td}><NumberInput value={r.maxDiscTime} onChange={(v)=>setField(i,"maxDiscTime",v)} /></td>

                <td className={td}>
                  <RightClickFill onFill={()=>fillDown(i,"bsen")}>
                    <TypeaheadSelect value={r.bsen} onChange={(v)=>setField(i,"bsen",v)} options={BSEN} placeholder="e.g. 60898" />
                  </RightClickFill>
                </td>
                <td className={td}>
                  <RightClickFill onFill={()=>fillDown(i,"ocpdType")}>
                    <TypeaheadSelect value={r.ocpdType} onChange={(v)=>setField(i,"ocpdType",v)} options={OCPD_TYPE} placeholder="B/C/D…" />
                  </RightClickFill>
                </td>
                <td className={td}>
                  <RightClickFill onFill={()=>fillDown(i,"ratingA")}>
                    <NumberInput value={r.ratingA} onChange={(v)=>setField(i,"ratingA",v)} />
                  </RightClickFill>
                </td>
                <td className={`${td} text-center text-sm`}>{r.maxZsAuto !== "" ? r.maxZsAuto : ""}</td>

                <td className={td}>
                  <RightClickFill onFill={()=>fillDown(i,"rcdType")}>
                    <TypeaheadSelect value={r.rcdType} onChange={(v)=>setField(i,"rcdType",v)} options={RCD_TYPES} placeholder="Type A/AC/S…" />
                  </RightClickFill>
                </td>
                <td className={td}>
                  <RightClickFill onFill={()=>fillDown(i,"rcdmA")}>
                    <TypeaheadSelect value={r.rcdmA} onChange={(v)=>setField(i,"rcdmA",v)} options={RCD_MA} placeholder="30" />
                  </RightClickFill>
                </td>
                <td className={td}>
                  <TypeaheadSelect value={r.rcdbs} onChange={(v)=>setField(i,"rcdbs",v)} options={BSEN} placeholder="BS EN…" />
                </td>

                <td className={td}><NumberInput value={r.r1_milliohm} onChange={(v)=>setField(i,"r1_milliohm",v)} /></td>
                <td className={td}><NumberInput value={r.rn_milliohm} onChange={(v)=>setField(i,"rn_milliohm",v)} /></td>
                <td className={td}><NumberInput value={r.r2_milliohm} onChange={(v)=>setField(i,"r2_milliohm",v)} /></td>
                <td className={td}><NumberInput value={r.r1plusr2} onChange={(v)=>setField(i,"r1plusr2",v)} /></td>

                <td className={td}><NumberInput value={r.irLN} onChange={(v)=>setField(i,"irLN",v)} /></td>
                <td className={td}><NumberInput value={r.irLE} onChange={(v)=>setField(i,"irLE",v)} /></td>
                <td className={td}><NumberInput value={r.irNE} onChange={(v)=>setField(i,"irNE",v)} /></td>

                <td className={td}><NumberInput value={r.zsAtDB} onChange={(v)=>setField(i,"zsAtDB",v)} /></td>
                <td className={td}><NumberInput value={r.rcdTripX1} onChange={(v)=>setField(i,"rcdTripX1",v)} /></td>

                <td className={td}>
                  <TypeaheadSelect value={r.afdd} onChange={(v)=>setField(i,"afdd",v)} options={AFDD} placeholder="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs mt-3 p-2 border border-gray-300">
        <strong>Codes for type of wiring:</strong>&nbsp;
        A Thermoplastic T&amp;E | B Thermoplastic in metallic conduit | C Thermoplastic in nonmetallic conduit | D Thermoplastic in metallic trunking | E Thermoplastic in nonmetallic trunking | F Thermoplastic/SWA | G Thermosetting/SWA | H Mineral insulated | O Other
      </div>
    </div>
  );
}

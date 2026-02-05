import React from 'react';

const OUTCOMES = ['PASS', 'C1', 'C2', 'C3', 'FI', 'LIM', 'N/V', 'N/A', 'X'];

// =====================
// 📜 Full Inspection Schedule
// =====================
const inspectionSections = [
  {
    title: '1.0 INTAKE EQUIPMENT (VISUAL INSPECTION ONLY)',
    note: 'An outcome against an item in this section, other than access to live parts, should not be used to determine the overall outcome.',
    items: [
      { no: '1.1.1', text: 'Service cable' },
      { no: '1.1.2', text: 'Service head' },
      { no: '1.1.3', text: 'Earthing arrangement' },
      { no: '1.1.4', text: 'Meter tails' },
      { no: '1.1.5', text: 'Metering equipment' },
      { no: '1.1.6', text: 'Isolator (where present)' },
      { no: '1.2', text: "Consumer's isolator (where present)" },
      { no: '1.3', text: "Consumer's meter tails" },
    ]
  },
  {
    title: '2.0 PRESENCE OF ADEQUATE ARRANGEMENTS FOR OTHER SOURCES SUCH AS MICROGENERATORS',
    items: [{ no: '2.0', text: 'Adequate arrangements (551.6; 551.7)' }]
  },
  {
    title: '3.0 EARTHING / BONDING ARRANGEMENTS (411.3; Chap 54)',
    items: [
      { no: '3.1', text: "Presence and condition of distributor's earthing arrangement (542.1.2.1; 542.1.2.2)" },
      { no: '3.2', text: 'Presence and condition of earth electrode connection where applicable (542.1.2.3)' },
      { no: '3.3', text: 'Provision of earthing/bonding labels at all appropriate locations (514.13.1)' },
      { no: '3.4', text: 'Confirmation of earthing conductor size (542.3; 543.1.1)' },
      { no: '3.5', text: 'Accessibility and condition of earthing conductor at MET (543.3.2)' },
      { no: '3.6', text: 'Confirmation of main protective bonding conductor sizes (544.1)' },
      { no: '3.7', text: 'Condition and accessibility of main protective bonding conductor connections (543.3.2; 544.1.2)' },
      { no: '3.8', text: 'Accessibility and condition of other protective bonding connections (543.3.1; 543.3.2)' },
    ]
  },
  {
    title: '4.0 CONSUMER UNIT(S) / DISTRIBUTION BOARD(S)',
    items: [
      { no: '4.1', text: 'Adequacy of working space/accessibility to consumer unit/distribution board (132.12; 513.1)' },
      { no: '4.2', text: 'Security of fixing (134.1.1)' },
      { no: '4.3', text: 'Condition of enclosure(s) in terms of IP rating etc (416.2)' },
      { no: '4.4', text: 'Condition of enclosure(s) in terms of fire rating etc (421.1.201; 526.5)' },
      { no: '4.5', text: 'Enclosure not damaged/deteriorated so as to impair safety (651.2)' },
      { no: '4.6', text: 'Presence of main linked switch (462.1.201)' },
      { no: '4.7', text: 'Operation of main switch (functional check) (643.10)' },
      { no: '4.8', text: 'Manual operation of circuit-breakers and RCDs to prove disconnection (643.10)' },
      { no: '4.9', text: 'Correct identification of circuit details and protective devices (514.8.1; 514.9.1)' },
      { no: '4.10', text: 'Presence of RCD six-monthly test notice (514.12.2)' },
      { no: '4.11', text: 'Presence of alternative supply warning notice (514.15)' },
      { no: '4.12', text: 'Presence of other required labelling (Section 514)' },
      { no: '4.13', text: 'Compatibility of protective devices and components (411.3.2; 411.4; 411.5; 411.6)' },
      { no: '4.14', text: 'Single-pole switching or protective devices in line conductor only (132.14.1; 530.3.3)' },
      { no: '4.15', text: 'Protection against mechanical damage at entry (132.14.1; 522.8.1; 522.8.5; 522.8.11)' },
      { no: '4.16', text: 'Protection against electromagnetic effects (521.5.1)' },
      { no: '4.17', text: 'RCD(s) provided for fault protection - includes RCBOs (411.4.204; 411.5.2; 531.2)' },
      { no: '4.18', text: 'RCD(s) provided for additional protection - includes RCBOs (411.3.3; 415.1)' },
      { no: '4.19', text: 'Confirmation of indication that SPD is functional (651.4)' },
      { no: '4.20', text: 'Confirmation that ALL conductor connections are tight and secure (526.1)' },
      { no: '4.21', text: 'Adequate arrangements where a generating set operates as a switched alternative (551.6)' },
      { no: '4.22', text: 'Adequate arrangements where a generating set operates in parallel (551.7)' },
    ]
  },
  {
    title: '5.0 FINAL CIRCUITS',
    items: [
      { no: '5.1', text: 'Identification of conductors (514.3.1)' },
      { no: '5.2', text: 'Cables correctly supported throughout their run (521.10.202; 522.8.5)' },
      { no: '5.3', text: 'Condition of insulation of live parts (416.1)' },
      { no: '5.4', text: 'Non-sheathed cables protected by enclosure (521.10.1)' },
      { no: '5.4.1', text: 'Integrity of conduit and trunking systems' },
      { no: '5.5', text: 'Adequacy of cables for current-carrying capacity (Section 523)' },
      { no: '5.6', text: 'Coordination between conductors and overload protective devices (433.1; 533.2.1)' },
      { no: '5.7', text: 'Adequacy of protective devices for fault protection (411.3)' },
      { no: '5.8', text: 'Presence and adequacy of circuit protective conductors (411.3.1; Section 543)' },
      { no: '5.9', text: 'Wiring system(s) appropriate for the type and nature of the installation (Section 522)' },
      { no: '5.10', text: 'Concealed cables installed in prescribed zones (522.6.202)' },
      { no: '5.11', text: 'Cables concealed under floors, above ceilings or in walls adequately protected (522.6.204)' },
      { no: '5.12.1', text: 'RCD protection for socket-outlets 32A or less (411.3.3)' },
      { no: '5.12.2', text: 'RCD protection for mobile equipment outdoors (411.3.3)' },
      { no: '5.12.3', text: 'RCD protection for concealed cables <50mm (522.6.202; 522.6.203)' },
      { no: '5.12.4', text: 'RCD protection for cables in metal partitions (522.6.203)' },
      { no: '5.12.5', text: 'RCD protection for luminaires in domestic premises (411.3.4)' },
      { no: '5.13', text: 'Provision of fire barriers, sealing, protection against thermal effects (Section 527)' },
      { no: '5.14', text: 'Band II cables segregated from Band I cables (528.1)' },
      { no: '5.15', text: 'Cables segregated from communications cabling (528.2)' },
      { no: '5.16', text: 'Cables segregated from non-electrical services (528.3)' },
      { no: '5.17.1', text: 'Connections soundly made and under no undue strain (526.6)' },
      { no: '5.17.2', text: 'No basic insulation visible outside enclosure (526.8)' },
      { no: '5.17.3', text: 'Connections of live conductors adequately enclosed (526.5)' },
      { no: '5.17.4', text: 'Adequately connected at entry (glands, bushes etc.) (522.8.5)' },
      { no: '5.18', text: 'Condition of accessories including socket-outlets, switches and joint boxes (651.2(v))' },
      { no: '5.19', text: 'Suitability of accessories for external influences (512.2)' },
      { no: '5.20', text: 'Adequacy of working space/accessibility (132.12; 513.1)' },
      { no: '5.21', text: 'Single-pole switching or protective devices in line conductors only (132.14.1, 530.3.3)' },
    ]
  },
  {
    title: '6.0 LOCATION(S) CONTAINING A BATH OR SHOWER',
    items: [
      { no: '6.1', text: 'Additional protection for all LV circuits by RCD not exceeding 30mA (701.411.3.3)' },
      { no: '6.2', text: 'Requirements for SELV or PELV met (701.414.4.5)' },
      { no: '6.3', text: 'Shaver supply units comply with BS EN 61558-2-5 (701.512.3)' },
      { no: '6.4', text: 'Presence of supplementary bonding conductors (701.415.2)' },
      { no: '6.5', text: 'Socket-outlets at least 2.5m from zone 1 (701.512.3)' },
      { no: '6.6', text: 'Suitability of equipment for external influences (701.512.2)' },
      { no: '6.7', text: 'Suitability of accessories and controlgear (701.512.3)' },
      { no: '6.8', text: 'Suitability of current-using equipment for position (701.55)' },
    ]
  },
  {
  title: '7.0 OTHER PART 7 SPECIAL INSTALLATIONS OR LOCATIONS',
  note: 'List all other special installation or locations present, if any. (Record separately the results of particular inspections)',
  items: [
    { no: '7.1', text: '' },
    { no: '7.2', text: '' },
  ]
},
{
  title: "8.0 PROSUMER'S LOW VOLTAGE ELECTRICAL INSTALLATION(S)",
  note: 'Where the installation includes additional requirements relating to Chapter 82, additional inspection items should be added.',
  items: [
    { no: '8.1', text: '' },
    { no: '8.2', text: '' },
  ]
}

];

export default function EICRPage4({ data, setData }) {

  const handleChange = (itemNo, text, outcome) => {
    setData(prev => ({
      ...prev,
      [itemNo]: { outcome, text }
    }));
  };

  return (
    <div style={{ padding: '10px 0' }}>
      {inspectionSections.map((section, idx) => (
        <div key={idx} style={sectionBox}>
          <h3 style={sectionTitle}>{section.title}</h3>
          {section.note && <p style={sectionNote}>{section.note}</p>}

          <div style={scrollBox}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thItemNo}>Item No</th>
                  <th style={thDesc}>Description</th>
                  <th style={thOutcome}>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {section.items.map(item => (
                  <tr key={item.no}>
                    <td style={tdItemNo}>{item.no}</td>
                    <td style={tdText}>{item.text}</td>
                    <td style={tdSelect}>
                      <select
                        value={data[item.no]?.outcome || ''}
                        onChange={e => handleChange(item.no, item.text, e.target.value)}
                        style={selectStyle}
                      >
                        <option value="">—</option>
                        {OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

/* === Styles === */
const sectionBox = { marginBottom: 25 };
const sectionTitle = { background: '#003366', color: '#fff', padding: '6px 10px', fontSize: '1rem', borderRadius: '4px 4px 0 0' };
const sectionNote = { fontSize: '0.85rem', color: '#333', padding: '6px 0 10px 0' };

const scrollBox = {
  maxHeight: '300px',
  overflowY: 'auto',
  border: '1px solid #ccc',
  borderTop: 'none'
};

const tableStyle = { width: '100%', borderCollapse: 'collapse' };

const thBase = {
  background: '#f0f4f8',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  padding: '6px',
  borderBottom: '2px solid #003366',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  textAlign: 'left'
};
const thItemNo = { ...thBase, width: '90px', textAlign: 'center' };
const thDesc = { ...thBase };
const thOutcome = { ...thBase, width: '120px', textAlign: 'center' };

const tdItemNo = { width: '90px', border: '1px solid #ccc', padding: '6px', textAlign: 'center', background: '#f8f9fa', fontWeight: 'bold' };
const tdText = { border: '1px solid #ccc', padding: '6px', fontSize: '0.9rem' };
const tdSelect = { width: '120px', border: '1px solid #ccc', textAlign: 'center' };

const selectStyle = { width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #ccc' };
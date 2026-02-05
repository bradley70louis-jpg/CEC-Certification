import React, { useEffect, useMemo, useRef, useState } from "react";

export default function TypeaheadSelect({
  value,
  onChange,
  options = [],
  placeholder = "",
  className = "",
  allowFreeText = true,
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(value ?? "");
  const [hi, setHi] = useState(0);
  const boxRef = useRef(null);

  useEffect(() => setQ(value ?? ""), [value]);

  const filtered = useMemo(() => {
    const needle = (q ?? "").toString().toLowerCase();
    if (!needle) return options.slice(0, 8);
    return options.filter(o => o.toString().toLowerCase().includes(needle)).slice(0, 8);
  }, [q, options]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const commit = (val) => {
    onChange?.(val);
    setQ(val ?? "");
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={boxRef}>
      <input
        value={q}
        placeholder={placeholder}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setHi(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "Enter")) setOpen(true);
          if (e.key === "ArrowDown") { e.preventDefault(); setHi(i=>Math.min(i+1, filtered.length-1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setHi(i=>Math.max(i-1, 0)); }
          if (e.key === "Enter") {
            e.preventDefault();
            if (filtered[hi]) commit(filtered[hi]);
            else if (allowFreeText) commit(q);
          }
          if (e.key === "Escape") setOpen(false);
        }}
        className="w-full h-9 px-2 border border-gray-300 rounded-sm text-sm outline-none"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1 w-full max-h-44 overflow-auto border border-gray-300 bg-white rounded-sm shadow">
          {filtered.map((opt, idx) => (
            <div
              key={opt + idx}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => commit(opt)}
              className={`px-2 py-1 text-sm cursor-pointer ${idx===hi ? "bg-emerald-100" : "hover:bg-gray-100"}`}
              onMouseEnter={() => setHi(idx)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

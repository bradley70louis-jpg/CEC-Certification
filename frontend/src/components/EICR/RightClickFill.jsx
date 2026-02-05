import React from "react";

export default function RightClickFill({ children, onFill }) {
  const onContext = (e) => {
    e.preventDefault();
    const el = document.createElement("div");
    el.className = "fixed z-50 bg-white border border-gray-300 rounded shadow text-sm";
    el.style.top = `${e.clientY}px`;
    el.style.left = `${e.clientX}px`;
    el.innerHTML = `<button class="px-3 py-2 hover:bg-gray-100 w-full text-left">Fill down from here</button>`;
    const kill = () => { document.body.removeChild(el); document.removeEventListener("mousedown", kill); };
    el.querySelector("button").addEventListener("click", () => { onFill?.(); kill(); });
    document.body.appendChild(el);
    setTimeout(() => document.addEventListener("mousedown", kill), 0);
  };
  return <div onContextMenu={onContext}>{children}</div>;
}

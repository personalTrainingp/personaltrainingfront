// TopControls.jsx
import React, { useEffect, useState } from "react";

export function RealTimeClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hhmm = now.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Lima",
  });
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        border: "2px solid rgba(0,0,0,0.2)",
        borderRadius: "8px",
        padding: "6px 14px",
        background: "rgba(255,255,255,0.6)",
        fontWeight: 800,
        fontSize: "1.5rem",
        color: "black",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      }}
    >
      <span role="img" aria-label="clock">🕒</span>
      <span>{hhmm}</span>
    </div>
  );
}

export function TopControls({
  selectedMonth,
  setSelectedMonth,
  initDay,
  setInitDay,
  cutDay,
  setCutDay,
  year = new Date().getFullYear(),
  onUseLastDay, // <-- NUEVO
}) {
  const MESES = [
    "ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
    "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE",
  ];
  const daysInMonth = (y, m1to12) => new Date(y, m1to12, 0).getDate();

  const handleMonthChange = (newMonth) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear  = today.getFullYear();
    const lastDayTarget = daysInMonth(year, newMonth);

    let nextCut =
      newMonth === currentMonth && year === currentYear
        ? Math.min(today.getDate(), lastDayTarget)
        : Math.min(cutDay, lastDayTarget);

    const nextInit = Math.min(initDay, nextCut);
    setSelectedMonth(newMonth);
    setCutDay(nextCut);
    setInitDay(nextInit);
  };

  // Fallback local (solo si no te pasan el callback oficial desde App)
  const fallbackUseLastDay = () => {
    const today = new Date();
    const isCurrentMonth =
      year === today.getFullYear() && selectedMonth === today.getMonth() + 1;
    const lastDay = daysInMonth(year, selectedMonth);
    const nextCut = isCurrentMonth ? Math.min(lastDay, today.getDate()) : lastDay;
    setCutDay(nextCut);
    if (initDay > nextCut) setInitDay(nextCut);
  };

  const handleClickUseLastDay = () => {
    if (typeof onUseLastDay === "function") {
      onUseLastDay();          // <<-- llama la MISMA lógica de App
    } else {
      fallbackUseLastDay();    // <<-- por si no te pasan el callback
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        margin: "8px 0 24px",
        width: "100%",
        fontWeight: 800,
        color: "black",
      }}
    >
      {/* MES */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "1.5rem" }}>
        <label>Mes:</label>
        <select
          value={selectedMonth}
          onChange={(e) => {
            const newMonth = parseInt(e.target.value, 10);
            const currentMonth = new Date().getMonth() + 1;
            if (newMonth > currentMonth) return;
            handleMonthChange(newMonth);
          }}
          style={{ fontSize: "1.5rem", fontWeight: 800 }}
        >
          {MESES.map((mes, idx) => {
            const currentMonth = new Date().getMonth() + 1;
            return (
              <option key={idx + 1} value={idx + 1} disabled={idx + 1 > currentMonth}>
                {mes}
              </option>
            );
          })}
        </select>
      </div>

      {/* DÍA INICIO */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "1.5rem" }}>
        <label>FECHA de inicio:</label>
        <select
          value={initDay}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (v <= cutDay) setInitDay(v);
          }}
          style={{ fontSize: "1.5rem", fontWeight: 700 }}
        >
          {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* DÍA CORTE */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "1.5rem" }}>
        <label>FECHA de corte:</label>
        <select
          value={cutDay}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            const today = new Date();
            const currentMonth = today.getMonth() + 1;
            const currentDay = today.getDate();
            const lastDayTarget = daysInMonth(year, selectedMonth);
            let next = Math.min(val, lastDayTarget);
            if (selectedMonth === currentMonth) next = Math.min(next, currentDay);
            setCutDay(next);
            if (initDay > next) setInitDay(next);
          }}
          style={{ fontSize: "1.5rem", fontWeight: 700 }}
        >
          {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* RELOJ + BOTÓN (alineado a la derecha) */}
      <div style={{ display: "flex", alignItems: "center", gap: 12}}>
        <RealTimeClock />
        <button onClick={handleClickUseLastDay} className="btn btn-outline-primary">
          Usar último día del mes
        </button>
      </div>
    </div>
  );
}

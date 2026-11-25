
import React, { useEffect, useState } from "react";
import { useHeaderResultados } from "./useHeaderResultados";

// --- Sub-componente simple para el reloj ---
function RealTimeClock() {
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
    <div style={boxStyleBase}>
      <span role="img" aria-label="clock">
        🕒
      </span>
      <span>{hhmm}</span>
    </div>
  );
}

// --- Styles ---
const boxStyleBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  border: "2px solid rgba(0,0,0,0.2)",
  borderRadius: 8,
  padding: "6px 14px",
  background: "rgba(255,255,255,0.6)",
  fontWeight: 800,
  fontSize: "1.5rem",
  color: "black",
  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  lineHeight: 1.2,
  minWidth: 120,
  height: 48,
};

const selectBase = {
  ...boxStyleBase,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  backgroundClip: "padding-box",
  cursor: "pointer",
  paddingRight: 24,
  minWidth: 120,
};

const wrapperStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const topRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "nowrap",
  overflowX: "auto",
  padding: "8px 0",
  width: "100%",
  whiteSpace: "nowrap",
  justifyContent: "center",
};

const dividerStyle = {
  width: "100%",
  height: 0,
  borderTop: "2px solid rgba(0,0,0,0.12)",
  margin: "6px 0 2px",
};

const labelStyle = { textTransform: "uppercase", marginRight: 6 };
const selectMonthStyle = { ...selectBase, minWidth: 180, padding: "6px 12px" };
const selectDayStyle = { ...selectBase, minWidth: 80, padding: "6px 10px" };
const selectYearStyle = { ...selectBase, minWidth: 120, padding: "6px 12px" };

const fieldGroupStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: "1.5rem",
  fontWeight: 800,
  color: "black",
};

export function HeaderResultados({
  selectedMonth,
  setSelectedMonth,
  initDay,
  setInitDay,
  cutDay,
  setCutDay,

  year = new Date().getFullYear(),
  setYear,

  onUseLastDay,
}) {
  const {
    MESES,
    YEARS,
    CURRENT_YEAR,
    handleClickUseLastDay,
    handleMonthChange,
    handleYearChange,
  } = useHeaderResultados({
    selectedMonth,
    setSelectedMonth,
    initDay,
    setInitDay,
    cutDay,
    setCutDay,
    year,
    setYear,
    onUseLastDay,
  });

  const currentMonth = new Date().getMonth() + 1;

  return (
    <div style={wrapperStyle}>
      {/* FILA SUPERIOR CENTRADA */}
      <div style={topRowStyle}>
        {/* ✅ AÑO */}
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Año:</label>
          <select
            value={year}
            onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
            style={selectYearStyle}
            title="Filtrar por año"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* MES */}
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Mes:</label>
          <select
            value={selectedMonth}
            onChange={(e) => {
              const newMonth = parseInt(e.target.value, 10);
              handleMonthChange(newMonth);
            }}
            style={selectMonthStyle}
          >
            {MESES.map((mes, idx) => (
              <option
                key={idx + 1}
                value={idx + 1}
                disabled={year === CURRENT_YEAR && idx + 1 > currentMonth}
              >
                {mes}
              </option>
            ))}
          </select>
        </div>

        {/* FECHA INICIO */}
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Fecha de inicio:</label>
          <select
            value={initDay}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (v <= cutDay) setInitDay(v);
            }}
            style={selectDayStyle}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* FECHA CORTE */}
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Fecha de corte:</label>
          <select
            value={cutDay}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setCutDay(val);
            }}
            style={selectDayStyle}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Reloj */}
        <RealTimeClock />

        <button
          onClick={handleClickUseLastDay}
          className="btn btn-outline-warning"
          style={{
            fontWeight: 700,
            borderWidth: 2,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Cierre
        </button>
      </div>

      <div style={dividerStyle} />
    </div>
  );
}

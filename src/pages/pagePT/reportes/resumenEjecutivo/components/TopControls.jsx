
import React, { useEffect, useState } from "react";
import { ModalMultiplesContratos } from "./ModalMultiplesContratos";
import { useTopControls, findProgAvatar } from "../hooks/useTopControls";

// --- Sub-componente simple para el reloj ---
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

const bottomRowStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  width: "100%",
  marginTop: 10,
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

const miniBox = {
  ...boxStyleBase,
  minWidth: 140,
  padding: "6px 10px",
  justifyContent: "space-between",
};

const rateBoxStyle = {
  ...boxStyleBase,
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  height: "auto",
  minWidth: 150,
  padding: "6px 10px",
  gap: 4,
};

const miniTextStyle = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "rgba(0,0,0,0.6)",
  lineHeight: 1.2,
};

export function TopControls({
  selectedMonth,
  setSelectedMonth,
  initDay,
  setInitDay,
  cutDay,
  setCutDay,

  year = new Date().getFullYear(),
  setYear,

  onUseLastDay,
  vigentesCount = 0,
  vigentesBreakdown = [],
  avataresDeProgramas = [],
  useAvatars = true,
  onChangeTasaCambio,
}) {
  const {
    MESES,
    YEARS,
    CURRENT_YEAR,
    handleClickUseLastDay,
    handleMonthChange,
    handleYearChange,
    formattedRate,
    usingFallback,
    updatedLabel,
    FALLBACK_USD_PEN_RATE,
    showMultiContratosModal,
    setShowMultiContratosModal,
  } = useTopControls({
    selectedMonth,
    setSelectedMonth,
    initDay,
    setInitDay,
    cutDay,
    setCutDay,
    year,
    setYear,
    onUseLastDay,
    onChangeTasaCambio,
  });

  const currentMonth = new Date().getMonth() + 1;

  const AvatarMiniBox = ({ item }) => {
    const av = useAvatars
      ? findProgAvatar(item?.label, avataresDeProgramas)
      : null;

    const scale = Number(av?.scale ?? 1);

    return (
      <div style={miniBox} title={item?.label ?? ""}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {av ? (
            <div
              style={{
                width: 90,
                height: 44,
                borderRadius: 8,
                overflow: "hidden",
                display: "grid",
                placeItems: "center",
              }}
            >
              <img
                src={av.urlImage}
                alt={av.name_image}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transform: `scale(${scale})`,
                }}
                loading="lazy"
              />
            </div>
          ) : (
            <span>{(item?.label ?? "").toUpperCase()}</span>
          )}
        </div>

        <span style={{ fontVariantNumeric: "tabular-nums" }}>
          {item?.count ?? 0}
        </span>
      </div>
    );
  };

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

        {/* Reloj + TC */}
        <RealTimeClock />

        <div style={rateBoxStyle} title="Tipo de cambio USD a PEN">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "50%",
              gap: 12,
            }}
          >
            <span style={{ fontSize: "1.35rem", fontWeight: 600 }}>TC</span>
            <span
              style={{
                fontVariantNumeric: "tabular-nums",
                fontSize: "1.35rem",
                fontWeight: 500,
              }}
            >
              {formattedRate}
            </span>
          </div>

          {usingFallback ? (
            <span style={miniTextStyle}>
              Valor de referencia manual{" "}
              {`S/ ${FALLBACK_USD_PEN_RATE.toFixed(3)}`}
            </span>
          ) : (
            <span style={miniTextStyle}>
              {updatedLabel ? `Actualizado: ${updatedLabel}` : ""}
            </span>
          )}
        </div>

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

      {/* FILA INFERIOR */}
      <div style={bottomRowStyle}>
        {(vigentesBreakdown || []).map((it, idx) => (
          <AvatarMiniBox key={idx} item={it} />
        ))}

        {/* SOCIOS TOTAL */}
        <div
          style={{
            ...boxStyleBase,
            minWidth: 160,
            padding: "6px 12px",
            gap: 8,
          }}
          title="Membresías vigentes"
        >
          <span>SOCIOS TOTAL:&nbsp;</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {vigentesCount}
          </span>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={() => setShowMultiContratosModal(true)}
          style={{
            fontWeight: 700,
            borderWidth: 2,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            height: 48,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          title="Ver socios con múltiples contratos"
        >
          <i className="pi pi-users" />
          Multi-Contratos
        </button>

        <ModalMultiplesContratos
          show={showMultiContratosModal}
          onHide={() => setShowMultiContratosModal(false)}
        />
      </div>
    </div>
  );
}

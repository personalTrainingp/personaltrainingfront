// resources/js/components/TopControls.jsx
import React, { useEffect, useState } from "react";

const FALLBACK_USD_PEN_RATE = 3.37;

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

const norm = (s) =>
  String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

function findProgAvatar(label, avataresDeProgramas = []) {
  const key = norm(label);
  return (avataresDeProgramas || []).find((p) => norm(p?.name_image) === key);
}

function formatLimaDate(value) {
  if (!value) return null;
  try {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toLocaleString("es-PE", {
      timeZone: "America/Lima",
      hour12: false,
    });
  } catch (error) {
    console.error("No se pudo formatear la fecha de actualización", error);
    return null;
  }
}

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

export function TopControls({
  selectedMonth,
  setSelectedMonth,
  initDay,
  setInitDay,
  cutDay,
  setCutDay,
  year = new Date().getFullYear(),
  onUseLastDay,
  vigentesCount = 0,
  vigentesBreakdown = [],
  avataresDeProgramas = [],
  useAvatars = true,
  onChangeTasaCambio, // <<< callback para avisar al padre
}) {
  const MESES = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];
  const daysInMonth = (y, m1to12) => new Date(y, m1to12, 0).getDate();

  const [usdPenRate, setUsdPenRate] = useState({
    value: null,
    updatedAt: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let ignore = false;

    const fetchUsdPen = async () => {
      try {
        if (!ignore) {
          setUsdPenRate((prev) => ({ ...prev, loading: true, error: null }));
        }
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!response.ok) {
          throw new Error(`Estado ${response.status}`);
        }
        const payload = await response.json();
        const value =
          typeof payload?.rates?.PEN === "number" ? payload.rates.PEN : null;
        const updatedAt =
          payload?.time_last_update_utc ?? payload?.time_last_update ?? null;

        if (!ignore) {
          setUsdPenRate({
            value,
            updatedAt,
            loading: false,
            error: value == null ? "Sin datos" : null,
          });
        }
      } catch (error) {
        if (!ignore) {
          setUsdPenRate((prev) => ({
            ...prev,
            loading: false,
            error: error?.message || "No se pudo obtener el tipo de cambio",
          }));
        }
      }
    };

    fetchUsdPen();
    const intervalId = setInterval(fetchUsdPen, 1000 * 60 * 10); // cada 10 minutos

    return () => {
      ignore = true;
      clearInterval(intervalId);
    };
  }, []);

  const displayRate =
    typeof usdPenRate.value === "number" && Number.isFinite(usdPenRate.value)
      ? usdPenRate.value
      : FALLBACK_USD_PEN_RATE;
  const formattedRate = `S/ ${displayRate.toFixed(3)}`;
  const usingFallback = usdPenRate.value == null;
  const updatedLabel = formatLimaDate(usdPenRate.updatedAt);

  useEffect(() => {
    if (typeof onChangeTasaCambio === "function") {
      onChangeTasaCambio(displayRate);
    }
  }, [displayRate, onChangeTasaCambio]);

  const handleMonthChange = (newMonth) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
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

  const fallbackUseLastDay = () => {
    const today = new Date();
    const isCurrentMonth =
      year === today.getFullYear() && selectedMonth === today.getMonth() + 1;
    const lastDay = daysInMonth(year, selectedMonth);
    const nextCut = isCurrentMonth
      ? Math.min(lastDay, today.getDate())
      : lastDay;
    setCutDay(nextCut);
    if (initDay > nextCut) setInitDay(nextCut);
  };
  const handleClickUseLastDay = () =>
    typeof onUseLastDay === "function" ? onUseLastDay() : fallbackUseLastDay();

  // ======= LAYOUT CENTRADO =======
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
    minWidth: 200,
    padding: "8px 12px",
    gap: 4,
  };

  const miniTextStyle = {
    fontSize: "0.75rem",
    fontWeight: 500,
    color: "rgba(0,0,0,0.6)",
    lineHeight: 1.2,
  };

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
        {/* MES */}
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Mes:</label>
          <select
            value={selectedMonth}
            onChange={(e) => {
              const newMonth = parseInt(e.target.value, 10);
              const currentMonth = new Date().getMonth() + 1;
              if (newMonth > currentMonth) return;
              handleMonthChange(newMonth);
            }}
            style={selectMonthStyle}
          >
            {MESES.map((mes, idx) => {
              const currentMonth = new Date().getMonth() + 1;
              return (
                <option
                  key={idx + 1}
                  value={idx + 1}
                  disabled={idx + 1 > currentMonth}
                >
                  {mes}
                </option>
              );
            })}
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
              const today = new Date();
              const currentMonth = today.getMonth() + 1;
              const currentDay = today.getDate();
              const lastDayTarget = daysInMonth(year, selectedMonth);
              let next = Math.min(val, lastDayTarget);
              if (selectedMonth === currentMonth)
                next = Math.min(next, currentDay);
              setCutDay(next);
              if (initDay > next) setInitDay(next);
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

        {/* Reloj + Cierre */}
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

        {/* TIPO DE CAMBIO */}
        <div style={rateBoxStyle} title="Tipo de cambio USD a PEN">
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              width: "100%",
              gap: 12,
            }}
          >
            <span style={{ fontSize: "1rem", fontWeight: 700 }}>USD</span>
            <span
              style={{
                fontVariantNumeric: "tabular-nums",
                fontSize: "1.35rem",
                fontWeight: 800,
              }}
            >
              {formattedRate}
            </span>
          </div>
          <span style={miniTextStyle}>
            {usdPenRate.loading && !usdPenRate.error
              ? "Actualizando tipo de cambio…"
              : usdPenRate.error
              ? `Sin conexión, usando referencia S/ ${FALLBACK_USD_PEN_RATE.toFixed(
                  3
                )}`
              : updatedLabel
              ? ` ${updatedLabel}`
              : "Dato obtenido"}
          </span>
          {usingFallback ? (
            <span style={miniTextStyle}>
              Valor de referencia manual {`S/ ${FALLBACK_USD_PEN_RATE.toFixed(3)}`}
            </span>
          ) : (
            <span style={miniTextStyle}></span>
          )}
        </div>
      </div>
    </div>
  );
}

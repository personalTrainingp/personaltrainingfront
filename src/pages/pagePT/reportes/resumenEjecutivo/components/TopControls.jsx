import React from "react";

export const TopControls = ({
  selectedMonth,
  setSelectedMonth,
  initDay,
  setInitDay,
  cutDay,
  setCutDay,
  year,
  handleSetUltimoDiaMes
}) => {
  const meses = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];

  const handleMonthChange = (newMonth) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const daysInMonth = (y, m1to12) => new Date(y, m1to12, 0).getDate();

    const lastDayTarget = daysInMonth(year, newMonth);
    let nextCutDay;

    if (newMonth === currentMonth && year === currentYear) {
      nextCutDay = Math.min(today.getDate(), lastDayTarget);
    } else {
      nextCutDay = Math.min(cutDay, lastDayTarget);
    }

    const nextInitDay = Math.min(initDay, nextCutDay);

    setSelectedMonth(newMonth);
    setCutDay(nextCutDay);
    setInitDay(nextInitDay);
  };

  return (
    <div
      style={{
        backgroundColor: "#f5f8fc",
        padding: "20px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "40px",
      }}
    >
      {/* MES */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label style={{ fontWeight: 800, fontSize: "1.6em" }}>MES:</label>
        <select
          value={selectedMonth}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            const currentMonth = new Date().getMonth() + 1;
            if (val > currentMonth) return;
            handleMonthChange(val);
          }}
          style={{
            fontSize: "1.6em",
            fontWeight: "bold",
            padding: "4px 6px",
          }}
        >
          {meses.map((mes, idx) => {
            const currentMonth = new Date().getMonth() + 1;
            const disabled = idx + 1 > currentMonth;
            return (
              <option key={idx + 1} value={idx + 1} disabled={disabled}>
                {mes}
              </option>
            );
          })}
        </select>
      </div>

      {/* DÍA DE INICIO */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label style={{ fontWeight: 800, fontSize: "1.6em" }}>DÍA DE INICIO:</label>
        <select
          value={initDay}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val <= cutDay) setInitDay(val);
          }}
          style={{
            fontSize: "1.6em",
            padding: "4px 6px",
          }}
        >
          {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* DÍA DE CORTE */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label style={{ fontWeight: 800, fontSize: "1.6em" }}>DÍA DE CORTE:</label>
        <select
          value={cutDay}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            const today = new Date();
            const currentMonth = today.getMonth() + 1;
            const currentDay = today.getDate();
            const daysInMonth = (y, m1to12) => new Date(y, m1to12, 0).getDate();
            const lastDayTarget = daysInMonth(year, selectedMonth);

            let next = Math.min(val, lastDayTarget);
            if (selectedMonth === currentMonth) {
              next = Math.min(next, currentDay);
            }

            setCutDay(next);
            if (initDay > next) {
              setInitDay(next);
            }
          }}
          style={{
            fontSize: "1.6em",
            padding: "4px 6px",
          }}
        >
          {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        {/* Botón al mismo nivel */}
        
      </div>

      {/* HORA */}
      <div style={{ fontWeight: 800, fontSize: "1.6em" }}>
        HORA: {new Date().toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </div>
      <button
          onClick={handleSetUltimoDiaMes}
          className="btn btn-outline-danger"
          style={{
            fontWeight: 700,
            fontSize: "1em",
            marginLeft: "10px",
            height: "48px",
          }}
        >
          USAR ÚLTIMO DÍA DEL MES
        </button>
    </div>
  );
};

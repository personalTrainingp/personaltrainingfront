import React, { useState, useMemo } from "react";
import {
  buildExecutiveTableData,
  fmtMoney,
  fmtNum,
  labelFromKey,
  aliasMes, // lo exportas en tu archivo de lógica
} from "../adapters/executibleLogic"; // ajusta la ruta si es necesario

// CONFIGURACIÓN VISUAL
const MESES_DISPLAY = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// Normalizador (septiembre -> setiembre)
const normMes = (m) => {
  const s = String(m || "").toLowerCase().trim();
  return s === "septiembre" ? "setiembre" : s;
};

// Generador de Keys
const keyFromYM = (anio, mes) => `${anio}-${normMes(mes)}`;

export default function ExecutiveTable(props) {
  const {
    ventas = [],
    fechas = [],
    dataMktByMonth = {},
    initialDay = 1,
    cutDay = 21,
    reservasMF = [],
    originMap = {},
    selectedMonth = new Date().getMonth() + 1, // 0 = TOTAL (sin resalte), 1-12 mes seleccionado
    year: propYear,
    tasaCambio = 3.37,
  } = props;

  const baseYear = propYear ?? new Date().getFullYear();

  // 1. GENERAMOS TODAS LAS OPCIONES POSIBLES (12 meses atrás desde la fecha actual/seleccionada)
  const allMonthOptions = useMemo(() => {
    const out = [];
    let y = baseYear;
    let mIdx = selectedMonth > 0 ? selectedMonth - 1 : new Date().getMonth(); // si selectedMonth=0, usamos el mes actual

    for (let i = 0; i < 12; i++) {
      const mesDisplay = MESES_DISPLAY[mIdx];
      const mesLogic = normMes(mesDisplay);

      out.push({
        key: keyFromYM(y, mesLogic),
        label: `${mesDisplay.toUpperCase()} ${y}`,
        anio: String(y),
        mes: mesLogic,
      });

      mIdx--;
      if (mIdx < 0) {
        mIdx = 11;
        y -= 1;
      }
    }
    return out;
  }, [baseYear, selectedMonth]);

  // 2. ESTADO SIMPLE PARA EL SELECTOR (MES BASE)
  const [overrideKey, setOverrideKey] = useState(null);

  // 3. CONSTRUCCIÓN DE LAS FECHAS FINALES (Lógica de "Sustitución" del mes base)
  const processedProps = useMemo(() => {
    let computedFechas = [...(fechas || [])];

    if (overrideKey && computedFechas.length > 0) {
      const selectedOption = allMonthOptions.find((o) => o.key === overrideKey);

      if (selectedOption) {
        computedFechas[0] = {
          anio: selectedOption.anio,
          mes: selectedOption.mes, // Ya va como "setiembre"
          label: selectedOption.label,
          key: selectedOption.key,
        };
      }
    }

    return {
      ventas,
      fechas: computedFechas,
      dataMktByMonth,
      initialDay,
      cutDay,
      reservasMF,
      originMap,
      selectedMonth,
      tasaCambio,
    };
  }, [
    ventas,
    fechas,
    dataMktByMonth,
    initialDay,
    cutDay,
    reservasMF,
    originMap,
    selectedMonth,
    tasaCambio,
    overrideKey,
    allMonthOptions,
  ]);

  // 4. LLAMADA AL ADAPTADOR
  const {
    monthOrderForOrigin,
    rowsPerOrigin,
    orderedOrigins,
  } = buildExecutiveTableData(processedProps);

  const { cutDay: cutDayFromProps = cutDay } = props;


  const highlightMonthAlias = useMemo(() => {
    if (!selectedMonth || selectedMonth < 1 || selectedMonth > 12) return null;
    const uiName = MESES_DISPLAY[selectedMonth - 1]; // "septiembre"
    return aliasMes(uiName); // "setiembre"
  }, [selectedMonth]);

  // === ESTILOS (tus estilos rojos) ===
  const cBlack = "#000000";
  const cWhite = "#ffffff";
  const cRed = "#c00000";
  const border = "1px solid #333";

  const sWrap = { fontFamily: "Inter, sans-serif", color: cBlack };
  const sHeader = {
    background: cRed,
    color: cWhite,
    textAlign: "center",
    padding: "16px 12px",
    fontWeight: 700,
    fontSize: 40,
  };
  const sTable = {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  };
  const sThMes = {
    color: cWhite,
    textAlign: "center",
    fontWeight: 700,
    fontSize: 23,
    padding: "10px",
    verticalAlign: "middle",
  };
  const sThLeft = { ...sThMes, textAlign: "center", width: 260 };
  const sSelect = {
    background: "rgba(255,255,255,0.2)",
    color: cWhite,
    border: "1px solid rgba(255,255,255,0.5)",
    borderRadius: 4,
    padding: "4px 8px",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    maxWidth: "100%",
    outline: "none",
  };
  const sCell = {
    border,
    padding: "8px 10px",
    background: cWhite,
    fontSize: 28,
    textAlign: "center",
  };
  const sCellBold = { ...sCell, fontWeight: 700 };
  const sHeaderWrap = { textAlign: "center", margin: "8px 0" };
  const sHeaderChip = {
    display: "inline-block",
    background: cRed,
    color: cWhite,
    padding: "10px 24px",
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: 0.2,
    lineHeight: 1.1,
    borderRadius: 6,
  };
  const TitleChip = ({ children, style }) => (
    <div style={sHeaderWrap}>
      <span style={{ ...sHeaderChip, ...style }}>{children}</span>
    </div>
  );

  // === HELPERS DE VISTA ===

  // Para no permitir en el select meses que ya están en otras columnas (evitar duplicados)
  const otherColumnsKeys = useMemo(() => {
    const list = processedProps.fechas || [];
    return new Set(list.slice(1).map((f) => keyFromYM(f.anio, f.mes)));
  }, [processedProps.fechas]);

   // usamos TODOS los meses que están en la tabla (incluyendo el base)
  const usedKeys = useMemo(() => {
    const list = processedProps.fechas || [];
    return new Set(list.map((f) => keyFromYM(f.anio, f.mes)));
  }, [processedProps.fechas]);

  const MonthSelector = ({ currentVal }) => {
    // el valor actual del mes base
    const baseKey = currentVal;

    // opciones: todos los meses que NO están en la tabla
    const availableOptions = allMonthOptions.filter(
      (opt) => !usedKeys.has(opt.key)
    );

    return (
      <select
        style={sSelect}
        value={overrideKey || baseKey}
        onChange={(e) => setOverrideKey(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      >
        {/* mostramos el mes base actual como opción deshabilitada */}
        <option value={baseKey} disabled>
          {allMonthOptions.find((o) => o.key === baseKey)?.label || "MES BASE"}
        </option>

        {availableOptions.map((opt) => (
          <option key={opt.key} value={opt.key} style={{ color: "#000" }}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  };


  // Helper para ordenar columnas (poniendo el Mes Base en la primera columna)
   const getOrderedMonthsForOrigin = (okey) => {
    return monthOrderForOrigin(okey) || [];
  };

  const TableHeadFor = ({ okey }) => {
    const months = getOrderedMonthsForOrigin(okey);
    return (
      <thead>
        <tr>
          <th style={{ ...sThLeft, background: cRed }} />
          {months.map((m, idx) => {
            const thisKey = keyFromYM(m.anio, m.mes);

            return (
              <th key={`${okey}-h-${idx}`} style={{ ...sThMes, background: cRed }}>
                {idx === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 14, opacity: 0.8 }}>MES BASE</span>
                    <MonthSelector currentVal={thisKey} />
                  </div>
                ) : (
                  <div>{m.label}</div>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
    );
  };

  const renderRowsFor = (okey, rowsToRender) => {
    const months = getOrderedMonthsForOrigin(okey);

    return rowsToRender.map((r) => (
      <tr key={r.key + r.label}>
        <td
          style={{
            ...sCellBold,
            background: "#c00000",
            color: "#fff",
            fontWeight: 800,
          }}
        >
          {r.label}
        </td>
        {months.map((m, idx) => {
          let val = 0;
          let isPct = false;

          if (okey === "monkeyfit") {
            val = m.metrics?.[r.key] ?? 0;
          } else if (!isNaN(Number(okey))) {
            const [, pgmId, campo] = r.key.split(":");
            const mf = m.metrics?.mfByProg?.[pgmId] || {};
            if (campo === "venta") val = mf.venta ?? 0;
            else if (campo === "cant") val = mf.cant ?? 0;
            else if (campo === "ticket")
              val = mf.cant ? mf.venta / mf.cant : 0;
            else if (campo === "ventaF") val = mf.ventaFull ?? 0;
            else if (campo === "cantF") val = mf.cantFull ?? 0;
            else if (campo === "ticketF")
              val = mf.cantFull ? mf.ventaFull / mf.cantFull : 0;
          } else if (r.key.startsWith("o:")) {
            const [, _ok, campo] = r.key.split(":");
            const o = m.metrics?.byOrigin?.[_ok];
            if (campo === "total") val = o?.total ?? 0;
            else if (campo === "cant") val = o?.cant ?? 0;
            else if (campo === "ticket")
              val = o?.cant ? o.total / o.cant : 0;
            else if (campo === "pct") {
              const base = m.metrics?.totalServ || 0;
              val = base > 0 ? ((o?.total ?? 0) / base) * 100 : 0;
              isPct = true;
            }
          } else {
            val = m.metrics?.[r.key] ?? 0;
          }

          const txt = isPct
            ? `${fmtNum(val, 2)} %`
            : r.type === "money"
            ? fmtMoney(val)
            : r.type === "float2"
            ? fmtNum(val, 2)
            : fmtNum(val, 0);

          // 🔴 Aquí definimos si esta columna es el MES SELECCIONADO
          const isHighlightCol =
            !!highlightMonthAlias &&
            aliasMes(m.mes) === highlightMonthAlias;

          return (
            <td
              key={`${okey}-c-${r.key}-${idx}`}
              style={{
                ...sCell,
                ...(isHighlightCol
                  ? {
                      background: "#c00000",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 28,
                    }
                  : {}),
              }}
            >
              {txt}
            </td>
          );
        })}
      </tr>
    ));
  };

  return (
    <div style={sWrap}>
      {orderedOrigins.length === 0 ? (
        <div style={{ ...sHeader, background: "#444" }}>
          NO HAY ORÍGENES CON DATOS PARA AL {cutDayFromProps} DE CADA MES
        </div>
      ) : (
        orderedOrigins.map((okey) => {
          const title = ` ${labelFromKey(okey)} `;
          const rows = rowsPerOrigin(okey);
          return (
            <div key={okey} style={{ marginBottom: 24 }}>
              <TitleChip>{title}</TitleChip>
              <table style={sTable}>
                <TableHeadFor okey={okey} />
                <tbody>{renderRowsFor(okey, rows)}</tbody>
              </table>
            </div>
          );
        })
      )}
    </div>
  );
}

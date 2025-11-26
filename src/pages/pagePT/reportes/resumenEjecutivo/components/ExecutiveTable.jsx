import React, { useState, useMemo } from "react";
import {
  buildExecutiveTableData,
  fmtMoney,
  fmtNum,
  labelFromKey,
  getAvailableMonthsFromVentas,
} from "../adapters/executibleLogic";

// Para poder ordenar cronológicamente si lo necesitas
const MESES = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","setiembre","octubre","noviembre","diciembre",
];
const normMes = (m) =>
  String(m || "").toLowerCase().replace("septiembre", "setiembre");

const getMesIndex = (mes) => {
  const idx = MESES.indexOf(normMes(mes));
  return idx === -1 ? 99 : idx;
};

const sameMonthYear = (aAnio, aMes, bAnio, bMes) =>
  Number(aAnio) === Number(bAnio) &&
  getMesIndex(aMes) === getMesIndex(bMes);


export default function ExecutiveTable(props) {
  const allMonthOptions = useMemo(
    () => getAvailableMonthsFromVentas(props.ventas || []),
    [props.ventas]
  );

  const [selectedCompareKey, setSelectedCompareKey] = useState(null);

  const processedProps = useMemo(() => {
    const fixedFechas = props.fechas || [];

    let currentCompareKey = selectedCompareKey;

    // Si no hay nada seleccionado aún, proponemos uno que no esté en las fechas fijas
    if (!currentCompareKey && allMonthOptions.length > 0) {
      const fixedKeys = new Set(
        fixedFechas.map((f) => `${f.anio}-${f.mes}`)
      );
      const available = allMonthOptions.find(
        (opt) => !fixedKeys.has(opt.key)
      );
      if (available) {
        currentCompareKey = available.key;
      }
    }

    const compareOption = allMonthOptions.find(
      (opt) => opt.key === currentCompareKey
    );

    let mergedFechas = [...fixedFechas];

    const exists =
  compareOption &&
  fixedFechas.some((f) =>
    sameMonthYear(f.anio, f.mes, compareOption.anio, compareOption.mes)
  );


    if (compareOption && !exists) {
      mergedFechas.push({
        anio: compareOption.anio,
        mes: compareOption.mes,
        label: compareOption.label,
        key: compareOption.key,
      });
    }

    return {
      ...props,
      fechas: mergedFechas,
      compareMonthKey: currentCompareKey || null,
    };
  }, [props.fechas, props.ventas, selectedCompareKey, allMonthOptions]);

  const {
    selectedMonthName,
    monthOrderForOrigin,
    rowsPerOrigin,
    orderedOrigins,
  } = buildExecutiveTableData(processedProps);

  const { cutDay } = props;

  // === ESTILOS ===
  const cBlack = "#000000";
  const cWhite = "#ffffff";
  const cRed = "#c00000";
  const border = "1px solid #333";

  const sWrap = {
    fontFamily: "Inter, sans-serif",
    color: cBlack,
  };
  const sHeader = {
    background: cRed,
    color: cWhite,
    textAlign: "center",
    padding: "16px 12px",
    fontWeight: 700,
    letterSpacing: 0.2,
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
    fontSize: 18,
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

  // === HELPERS PARA MESES ===

  const normMes = (m) =>
    String(m || "").toLowerCase().replace("septiembre", "setiembre");

  const getMesIndex = (mes) => {
    const idx = MESES.indexOf(normMes(mes));
    return idx === -1 ? 99 : idx;
  };

  // Dado un origen, devuelve la lista de meses SIN duplicar el mes comparativo
  const getOrderedMonthsForOrigin = (okey) => {
    const raw = monthOrderForOrigin(okey) || [];
    if (!raw.length) return [];

    if (!selectedCompareKey) {
      return raw;
    }

    const [selYearStr, ...rest] = selectedCompareKey.split("-");
    const selYear = selYearStr;
    const selMes = rest.join("-"); // ej: "setiembre"

    // buscamos el "mes comparativo" dentro de la lista
    const selectedMonthObj = raw.find(
      (m) =>
        String(m.anio) === selYear &&
        normMes(m.mes) === normMes(selMes)
    );

    if (!selectedMonthObj) {
      return raw;
    }

    // filtramos duplicados de ese mismo mes: dejamos solo el selectedMonthObj
    const filtered = [];
    let alreadyKeptSelected = false;

    for (const m of raw) {
      const isSameMonth =
        normMes(m.mes) === normMes(selMes) &&
        String(m.anio) === selYear;

      if (isSameMonth) {
        if (!alreadyKeptSelected) {
          filtered.push(selectedMonthObj);
          alreadyKeptSelected = true;
        }
        // saltamos cualquier otra ocurrencia de ese mismo mes
        continue;
      }

      filtered.push(m);
    }
    return filtered;
  };

  // === SELECTOR DE MESES ===
  const MonthSelector = ({ currentVal }) => {
    const fixedKeys = new Set(
      (props.fechas || []).map((f) => `${f.anio}-${f.mes}`)
    );

    const availableOptions = allMonthOptions.filter(
      (opt) => !fixedKeys.has(opt.key) || opt.key === currentVal
    );

    return (
      <select
        style={sSelect}
        value={currentVal || ""}
        onChange={(e) => setSelectedCompareKey(e.target.value)}
      >
        <option value="" disabled>
          Seleccionar mes
        </option>
        {availableOptions.map((opt) => (
          <option key={opt.key} value={opt.key} style={{ color: "#000" }}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  };

  const TableHeadFor = ({ okey }) => {
    const months = getOrderedMonthsForOrigin(okey);

    return (
      <thead>
        <tr>
          <th style={{ ...sThLeft, background: cRed }} />
          {months.map((m, idx) => {
            const currentKey = `${m.anio}-${m.mes}`;
            const isFixed = (props.fechas || []).some(
              (f) => `${f.anio}-${f.mes}` === currentKey
            );
            const isEditable = !isFixed; // si no es fijo, es la columna comparativa

            return (
              <th
                key={`${okey}-h-${idx}`}
                style={{ ...sThMes, background: cRed }}
              >
                {isEditable ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 14, opacity: 0.8 }}>
                      COMPARAR CON:
                    </span>
                    <MonthSelector currentVal={currentKey} />
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
              val =
                base > 0 ? ((o?.total ?? 0) / base) * 100 : 0;
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

          const isSelectedCol = m.label === selectedMonthName;

          const currentKey = `${m.anio}-${m.mes}`;
          const isEditable = !(props.fechas || []).some(
            (f) => `${f.anio}-${f.mes}` === currentKey
          );

          return (
            <td
              key={`${okey}-c-${r.key}-${idx}`}
              style={{
                ...sCell,
                ...(isSelectedCol
                  ? {
                      background: "#c00000",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 28,
                    }
                  : {}),
                ...(isEditable && !isSelectedCol
                  ? { background: "#fff5f5" }
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
          NO HAY ORÍGENES CON DATOS PARA AL {cutDay} DE CADA MES
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

import React, { useMemo, useState, useEffect } from "react";
import {
  buildExecutiveTableData,
  fmtMoney,
  fmtNum,
  labelFromKey,
  aliasMes,
  getAvailableMonthsFromVentas,
} from "../adapters/executibleLogic";

// Meses sólo para la UI
const MESES_DISPLAY = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export default function ExecutiveTable(props) {
  const {
    ventas = [],
    dataMktByMonth = {},
    initialDay = 1,
    cutDay = 21,
    reservasMF = [],
    originMap = {},
    selectedMonth = new Date().getMonth() + 1,
    year: propYear,
    tasaCambio = 3.37,
  } = props;

  const baseYear = propYear ?? new Date().getFullYear();

  // ==== UNIVERSE DE MESES (todos los meses donde hay ventas) ====
  const monthsUniverse = useMemo(
    () => getAvailableMonthsFromVentas(ventas || []),
    [ventas]
  );

  // ==== MES BASE (key "YYYY-mes") ====
  const [baseKey, setBaseKey] = useState(() => {
    if (monthsUniverse.length) {
      const wantedAlias = aliasMes(MESES_DISPLAY[selectedMonth - 1]);
      const found =
        monthsUniverse.find((m) => aliasMes(m.mes) === wantedAlias) ||
        monthsUniverse[0];
      return found.key;
    }
    const mesLogic = aliasMes(MESES_DISPLAY[selectedMonth - 1]);
    return `${baseYear}-${mesLogic}`;
  });

  // Si cambia el universo o el mes seleccionado y aún no teníamos baseKey, lo fijamos
  useEffect(() => {
    if (!monthsUniverse.length) return;
    const wantedAlias = aliasMes(MESES_DISPLAY[selectedMonth - 1]);
    const found =
      monthsUniverse.find((m) => aliasMes(m.mes) === wantedAlias) ||
      monthsUniverse[0];

    setBaseKey((prev) => prev || found.key);
  }, [monthsUniverse, selectedMonth]);

  // ==== Cálculo de métricas (ahora le pasamos baseKey) ====
  const { monthOrderForOrigin, rowsPerOrigin, orderedOrigins } = useMemo(
    () =>
      buildExecutiveTableData({
        ventas,
        dataMktByMonth,
        initialDay,
        cutDay,
        reservasMF,
        originMap,
        selectedMonth,
        tasaCambio,
        baseKey,
      }),
    [
      ventas,
      dataMktByMonth,
      initialDay,
      cutDay,
      reservasMF,
      originMap,
      selectedMonth,
      tasaCambio,
      baseKey,
    ]
  );

  // Para resaltar la columna del mes base
  const highlightMonthAlias = useMemo(() => {
    if (!baseKey) return null;
    const [, mesStr] = String(baseKey).split("-");
    return aliasMes(mesStr);
  }, [baseKey]);

  // === ESTILOS ===
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

  // === SELECTOR DE MES BASE ===
  const MonthSelector = () => {
    if (!monthsUniverse.length) {
      return (
        <span style={{ fontSize: 14, opacity: 0.7 }}>SIN DATOS</span>
      );
    }
    return (
      <select
        style={sSelect}
        value={baseKey}
        onChange={(e) => setBaseKey(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      >
        {monthsUniverse.map((opt) => (
          <option
            key={opt.key}
            value={opt.key}
            style={{ color: "#000" }}
          >
            {opt.label}
          </option>
        ))}
      </select>
    );
  };

  const getOrderedMonthsForOrigin = (okey) =>
    monthOrderForOrigin(okey) || [];

  const ymKey = (m) => `${m.anio}-${m.mes}`;

  const getMontoOrigen = (m, okey) => {
    const byOrigin = m?.metrics?.byOrigin;
    if (!byOrigin) return 0;
    const o = byOrigin[okey];
    if (!o) return 0;
    return Number(o.total ?? 0);
  };

  // =========================================================
  // MODIFICACIÓN: Lógica de ordenamiento para fijar Mes Base al final
  // =========================================================
  const sortMonthsForOrigin = (months, okey) => {
    if (!Array.isArray(months)) return [];
    
    // Si no es un origen de marketing (ej. monkeyfit), devolvemos tal cual
    if (okey === "monkeyfit" || !isNaN(Number(okey))) {
      return months;
    }

    // 1. Crear copia para no mutar original
    const copy = [...months];

    // 2. Extraer el Mes Base de la lista si existe
    let baseMonthItem = null;
    const baseIndex = copy.findIndex(m => ymKey(m) === baseKey);
    
    if (baseIndex !== -1) {
        baseMonthItem = copy[baseIndex];
        copy.splice(baseIndex, 1); // Lo quitamos temporalmente
    }

    // 3. Ordenar el RESTO de meses por monto (Ascendente según tu lógica original a - b)
    copy.sort(
      (a, b) => getMontoOrigen(a, okey) - getMontoOrigen(b, okey)
    );

    // 4. Insertar el Mes Base AL FINAL (última columna)
    if (baseMonthItem) {
        copy.push(baseMonthItem);
    }

    return copy;
  };

  const TableHeadFor = ({ okey }) => {
    const monthsRaw = getOrderedMonthsForOrigin(okey);
    const months = sortMonthsForOrigin(monthsRaw, okey);

    return (
      <thead>
        <tr>
          <th style={{ ...sThLeft, background: cRed }} />
          {months.map((m, idx) => {
            const thisKey = ymKey(m);
            const isBase = baseKey && thisKey === baseKey;

            return (
              <th
                key={`${okey}-h-${idx}`}
                style={{ ...sThMes, background: cRed }}
              >
                {isBase ? (
                  // 👉 Esta es la columna del MES BASE (en el índice que le toque por ventas)
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 14, opacity: 0.8 }}>
                      MES BASE
                    </span>
                    <MonthSelector />
                  </div>
                ) : (
                  // 👉 Columnas normales
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
    const monthsRaw = getOrderedMonthsForOrigin(okey);
    const months = sortMonthsForOrigin(monthsRaw, okey);

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
            // MONKEYFIT por programa (id numérico)
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
            // Orígenes (Instagram, TikTok, etc.)
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
          NO HAY ORÍGENES CON DATOS PARA EL PERÍODO
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
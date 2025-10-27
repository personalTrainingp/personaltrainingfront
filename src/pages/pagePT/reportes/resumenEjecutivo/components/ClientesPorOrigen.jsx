import React, { useState } from "react";

/**
 * ClientsByOriginTable 
 * --------------------------------------------------------------
 * Tabla: "CLIENTES POR ORIGEN DEL 1 HASTA <cutDay>".
 * Agrupa por id_origen (mapeado con originMap). Cuenta clientes únicos por mes y origen.
 *
 * Props:
 *  - ventas: Array<{ fecha_venta: ISOString, id_cli: number|string, id_origen: number|string }>
 *  - fechas: Array<{ label: string; anio: string|number; mes: string }>
 *  - initialDay?: number  // default 1
 *  - cutDay?: number      // default 21
 *  - originMap?: Record<string|number, string>
 *  - uniqueByClient?: boolean // default true (si false, cuenta ventas)
 */
export const ClientesPorOrigen=({
  ventas = [],
  fechas = [],
  initialDay = 1,
  cutDay = 21,
  originMap = {
    1454: "WALK-IN",
    1455: "DIGITAL",
    1456: "REFERIDO",
    1457: "CARTERA",
  },
  uniqueByClient = true,
}) => {
  // --------------------------- Helpers ---------------------------
  const MESES = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "setiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const aliasMes = (m) => (m === "septiembre" ? "setiembre" : String(m || "").toLowerCase());
  const monthIdx = (mes) => MESES.indexOf(aliasMes(mes));

  const toLimaDate = (iso) => {
    if (!iso) return null;
    try {
      const d = new Date(iso);
      const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
      return new Date(utcMs - 5 * 60 * 60000);
    } catch (_) {
      return null;
    }
  };

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const labelOfOrigin = (id) => {
    const k = String(id ?? "0");
    return String(originMap?.[k] || originMap?.[Number(k)] || k).toUpperCase();
  };

  const monthKeys = fechas.map((f) => ({
    key: `${f.anio}-${aliasMes(f.mes)}`,
    anio: Number(f.anio),
    mes: aliasMes(f.mes),
    label: String(f.label || "").toUpperCase(),
    idx: monthIdx(f.mes),
  }));

 const base = new Map();
    monthKeys.forEach((m) => base.set(m.key, new Map()));

    for (const v of ventas) {
      const d = toLimaDate(v?.fecha_venta);
      if (!d) continue;

      const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      const from = clamp(Number(initialDay || 1), 1, last);
      const to = clamp(Number(cutDay || last), from, last);
      const dia = d.getDate();
      if (dia < from || dia > to) continue;

      const mes = MESES[d.getMonth()];
      const keyMes = `${d.getFullYear()}-${mes}`;
      if (!base.has(keyMes)) continue;

const originId = v?.id_origen;
if (!originId || originId === 0) continue; 

const origin = labelOfOrigin(originId);
const bucket = base.get(keyMes);
if (!bucket.has(origin)) bucket.set(origin, uniqueByClient ? new Set() : 0);

      if (uniqueByClient) {
        const set = bucket.get(origin);
        const idCli = v?.id_cli ?? `venta-${v?.id ?? Math.random()}`;
        set.add(String(idCli));
      } else {
        bucket.set(origin, Number(bucket.get(origin) || 0) + 1);
      }

  }

   const allOrigins = new Set();
    for (const m of base.values()) for (const o of m.keys()) allOrigins.add(o);
    Object.values(originMap || {}).forEach((name) => allOrigins.add(String(name).toUpperCase()));

    const orderedOrigins = Array.from(allOrigins);
    const prefer = Object.values(originMap || {}).map((n) => String(n).toUpperCase());
    orderedOrigins.sort((a, b) => {
      const ia = prefer.indexOf(a), ib = prefer.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });

  const getCount = (keyMes, origin) => {
    const m = base.get(keyMes);
    if (!m) return 0;
    const v = m.get(origin);
    if (!v) return 0;
    return uniqueByClient ? v.size : Number(v);
  };
      const [highlightMax, setHighlightMax] = useState(false);
    const toggleHighlight = () => setHighlightMax(!highlightMax);

  const C = {
    black: "#000000",
    red: "#c00000",
    white: "#ffffff",
    border: "1px solid #333",
    headRow: "#e9eef6",
  };
  

  const sTitle = {
    background: C.black,
    color: C.white,
    textAlign: "center",
    padding: "25px 12px",
    fontWeight: 700,
    letterSpacing: 0.2,
    fontSize: 25
  };

  const sTable = { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" };
  const sHeadLeft = { background: C.red, color: C.white, padding: "10px", border: C.border, textAlign: "left", width: 260 };
  const sHead = { background: C.red, color: C.white, padding: "10px", border: C.border, textAlign: "center",fontSize:20 };
  const sCell = { background: C.white, color: "#000", padding: "10px", border: C.border, fontSize: 19, textAlign: "center" };
  const sCellLeft = { ...sCell, textAlign: "left", fontWeight: 700, fontSize: 17 };

  const lastMonthKey = monthKeys[monthKeys.length - 1]?.key;
    const maxValueLastCol = Math.max(...orderedOrigins.map(o => getCount(lastMonthKey, o)));


    const sortedOrigins = [...orderedOrigins].sort((a, b) => {
      const va = getCount(lastMonthKey, a);
      const vb = getCount(lastMonthKey, b);
      if (vb !== va) return vb - va;
      const sumA = monthKeys.reduce((acc, m) => acc + getCount(m.key, a), 0);
      const sumB = monthKeys.reduce((acc, m) => acc + getCount(m.key, b), 0);
      return sumB - sumA;
    });

    const highlightOrigin = highlightMax ? sortedOrigins[0] : null;

 return (
  <div style={{ fontFamily: "Inter, system-ui, Segoe UI, Roboto, sans-serif" }}>
    <div style={sTitle}>CLIENTES POR ORIGEN AL {cutDay}</div>

    <table style={sTable}>
      <thead>
        <tr>
          <th style={sHeadLeft} onClick={toggleHighlight}></th>
          {monthKeys.map((m, idx) => {
            const isLastCol = idx === monthKeys.length - 1;
            return (
              <th
                key={m.key}
                style={{
                  ...sHead,
                  background: isLastCol ? "#c00000" : sHead.background,
                  fontSize: isLastCol ? 22 : sHead.fontSize,
                }}
                onClick={toggleHighlight}
              >
                {m.label}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {sortedOrigins.map((origin) => (
          <tr key={origin}>
<td
  style={{
    ...sCellLeft,
    background: "#c00000",
    color: "#fff",
    fontWeight: 800,
  }}
>
  {origin}
</td>

            {monthKeys.map((m, idx) => {
              const value = getCount(m.key, origin);
              const isLastCol = idx === monthKeys.length - 1;
              const isMax =
                highlightMax && m.key === lastMonthKey && origin === highlightOrigin;

              return (
                <td
                  key={`${m.key}-${origin}`}
                  style={{
                    ...sCell,
                    backgroundColor: isLastCol
                      ? "#c00000"
                      : isMax
                      ? "#ffff99"
                      : sCell.background,
                    color: isLastCol ? "#fff" : isMax ? "#c00000" : sCell.color,
                    fontWeight: 700,
                    fontSize: isLastCol ? 25 : sCell.fontSize,
                  }}
                >
                  {value}
                </td>
              );
            })}
          </tr>
        ))}

        <tr>
          <td
            style={{
              ...sCellLeft,
              background: "#c00000",
              color: "#fff",
              fontSize: 25,
              fontWeight: 800,
            }}
          >
            TOTAL
          </td>

          {monthKeys.map((m, idx) => {
            const totalMes = sortedOrigins.reduce(
              (acc, origin) => acc + getCount(m.key, origin),
              0
            );
            const isLastCol = idx === monthKeys.length - 1;
            return (
              <td
                key={`total-${m.key}`}
                style={{
                  ...sCell,
                  background: "#c00000",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: isLastCol ? 25 : 24,
                  textAlign: "center",
                }}
              >
                {totalMes}
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  </div>
);
}
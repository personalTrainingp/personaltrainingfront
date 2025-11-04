import React, { useMemo, useState } from "react";

const MESES = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","setiembre","octubre","noviembre","diciembre",
];


const aliasMes = (m) => (m === "septiembre" ? "setiembre" : String(m || "").toLowerCase());
const monthIdx = (mes) => MESES.indexOf(aliasMes(mes));

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const toLimaDate = (iso) => {
  if (!iso) return null;
  try {
    const d = new Date(String(iso).replace(" ", "T"));
    if (isNaN(d)) return null;
    const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
    return new Date(utcMs - 5 * 60 * 60000);
  } catch {
    return null;
  }
};

const labelOfOrigin = (id, originMap) => {
  const k = String(id ?? "0");
  return String(originMap?.[k] || originMap?.[Number(k)] || k).toUpperCase();
};

/* === acceso tolerante === */
const getOriginId = (v) =>
  v?.id_origen ??
  v?.tb_ventum?.id_origen ??
  v?.origen ??
  v?.source ??
  v?.parametro_origen?.id_param ??
  v?.id_origen_param ??
  null;

const getClientId = (v) =>
  v?.id_cli ??
  v?.tb_cliente?.id_cli ??
  v?.tb_ventum?.id_cli ??
  v?.cliente?.id_cli ??
  v?.id_cliente ??
  null;

const getMembershipItems = (v) => {
  const items =
    v?.detalle_ventaMembresia ??
    v?.detalle_ventaMembresium ??
    v?.detalle_ventamembresia ??
    v?.detalle_venta_membresia ??
    [];
  return Array.isArray(items) ? items : [];
};

const hasPaidMembership = (v) =>
  getMembershipItems(v).some(
    (it) => Number(it?.tarifa_monto ?? it?.monto ?? it?.precio ?? it?.tarifa ?? it?.precio_total) > 0
  );

export const ClientesPorOrigen = ({
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
  const monthKeys = useMemo(
    () =>
      (fechas || []).map((f) => ({
        key: `${f.anio}-${aliasMes(f.mes)}`,
        anio: Number(f.anio),
        mes: aliasMes(f.mes),
        label: String(f.label || "").toUpperCase(),
        idx: monthIdx(f.mes),
      })),
    [fechas]
  );

  const base = useMemo(() => {
    const m = new Map();
    monthKeys.forEach((k) => m.set(k.key, new Map())); 
    return m;
  }, [monthKeys]);

  const uniqueTriples = useMemo(() => {
    const seen = new Set();           
    const out = [];
    for (const v of ventas || []) {
      const d = toLimaDate(v?.fecha_venta || v?.fecha || v?.createdAt);
      if (!d) continue;

      const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      const from = clamp(Number(initialDay || 1), 1, last);
      const to = clamp(Number(cutDay || last), from, last);
      const dia = d.getDate();
      if (dia < from || dia > to) continue;

      const mes = MESES[d.getMonth()];
      const keyMes = `${d.getFullYear()}-${mes}`;
      if (!base.has(keyMes)) continue;

      if (!hasPaidMembership(v)) continue;

      const originId = getOriginId(v);
      const clientId = getClientId(v);
      if (originId == null || clientId == null || clientId === "") continue;

      const tuple = `${keyMes}|${originId}|${clientId}`;
      if (seen.has(tuple)) continue;   
      seen.add(tuple);

      out.push({ keyMes, originId: String(originId), clientId: String(clientId) });
    }
    return out;
  }, [ventas, initialDay, cutDay, base]);

  const matrix = useMemo(() => {
    const m = new Map(); 
    for (const mk of base.keys()) m.set(mk, new Map());

    for (const r of uniqueTriples) {
      const label = labelOfOrigin(r.originId, originMap);
      const byOrigin = m.get(r.keyMes);
      if (!byOrigin.has(label)) byOrigin.set(label, new Set());
      byOrigin.get(label).add(r.clientId);
    }
    return m;
  }, [base, uniqueTriples, originMap]);

  const orderedOrigins = useMemo(() => {
    const all = new Set();
    for (const m of matrix.values()) for (const o of m.keys()) all.add(o);
    Object.values(originMap || {}).forEach((name) => all.add(String(name).toUpperCase()));
    const arr = Array.from(all);
    const prefer = Object.values(originMap || {}).map((n) => String(n).toUpperCase());
    arr.sort((a, b) => {
      const ia = prefer.indexOf(a), ib = prefer.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });
    return arr;
  }, [matrix, originMap]);

  const getCount = (keyMes, originLabel) => {
    const byOrigin = matrix.get(keyMes);
    if (!byOrigin) return 0;
    const set = byOrigin.get(originLabel);
    return set ? set.size : 0;
  };

  const lastMonthKey = monthKeys[monthKeys.length - 1]?.key;
  const sortedOrigins = useMemo(() => {
    const meta = orderedOrigins.map((label) => {
      const last = lastMonthKey ? getCount(lastMonthKey, label) : 0;
      const total = monthKeys.reduce((acc, m) => acc + getCount(m.key, label), 0);
      return { label, last, total };
    });
    meta.sort((a, b) => {
      if (b.last !== a.last) return b.last - a.last;
      if (b.total !== a.total) return b.total - a.total;
      return a.label.localeCompare(b.label);
    });
    return meta.map((x) => x.label);
  }, [orderedOrigins, monthKeys, lastMonthKey]);

  /* === Estilos (igual a tu ra/fv) === */
  const C = { black: "#000", red: "#c00000", white: "#fff", border: "1px solid #333" };
  const sTitle = { background: C.black, color: C.white, textAlign: "center", padding: "25px 12px", fontWeight: 700, fontSize: 25 };
  const sTable = { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" };
  const sHeadLeft = { background: C.red, color: C.white, padding: "10px", border: C.border, textAlign: "left", width: 260 };
  const sHead = { background: C.red, color: C.white, padding: "10px", border: C.border, textAlign: "center", fontSize: 27 };
  const sCell = { background: C.white, color: "#000", padding: "10px", border: C.border, fontSize: 28, textAlign: "center" };
  const sCellLeft = { ...sCell, textAlign: "left", fontWeight: 700, fontSize: 27 };

  const [highlightMax, setHighlightMax] = useState(false);
  const toggleHighlight = () => setHighlightMax((s) => !s);

  const maxValueLastCol = Math.max(...sortedOrigins.map((o) => getCount(lastMonthKey, o)));
  const highlightOrigin = highlightMax && sortedOrigins.length ? sortedOrigins[0] : null;

  /* === Render === */
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
                  style={{ ...sHead, background: isLastCol ? C.red : sHead.background, fontSize: isLastCol ? 27 : sHead.fontSize }}
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
              <td style={{ ...sCellLeft, background: C.red, color: C.white, fontWeight: 800 }}>{origin}</td>

              {monthKeys.map((m, idx) => {
                const value = getCount(m.key, origin);
                const isLastCol = idx === monthKeys.length - 1;
                const isMax = highlightMax && m.key === lastMonthKey && origin === highlightOrigin;

                return (
                  <td
                    key={`${m.key}-${origin}`}
                    style={{
                      ...sCell,
                      backgroundColor: isLastCol ? C.red : isMax ? "#ffff99" : sCell.background,
                      color: isLastCol ? "#fff" : isMax ? C.red : sCell.color,
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

          {/* === TOTAL === */}
          <tr>
            <td style={{ ...sCellLeft, background: C.red, color: C.white, fontSize: 25, fontWeight: 800 }}>
              TOTAL
            </td>
            {monthKeys.map((m, idx) => {
              const totalMes = sortedOrigins.reduce((acc, origin) => acc + getCount(m.key, origin), 0);
              const isLastCol = idx === monthKeys.length - 1;
              return (
                <td
                  key={`total-${m.key}`}
                  style={{
                    ...sCell,
                    background: C.red,
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

          {/* === FILA DE MESES === */}
          <tr>
            <td style={{ ...sCellLeft, background : C.red, color: "#fff", fontSize: 25, fontWeight: 800 }}>
              MESES
            </td>
            {monthKeys.map((m) => (
              <td
                key={`mes-${m.key}`}
                style={{
                  background: C.red,
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 25,
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                {m.label}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

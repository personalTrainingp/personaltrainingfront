import React from "react";
import { Card } from "react-bootstrap";
/**
 * ComparativoVsActual
 * --------------------------------------------------------------
 * Cuadro: "COMPARATIVO MENSUAL VS MES ACTUAL"
 *
 * Props:
 *  - ventas: Array<Venta>
 *  - fechas: Array<{ label: string; anio: string|number; mes: string }>
 *  - initialDay?: number
 *  - cutDay?: number
 *  - refMonthKey?: string
 */
export const ComparativoVsActual = ({
  ventas = [],
  fechas = [],
  initialDay = 1,
  cutDay = 21,
  refMonthKey,
}) => {
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
  const aliasMes = (m) => (m === "septiembre" ? "setiembre" : m);
  const keyOf = (anio, mes) => `${anio}-${aliasMes(String(mes).toLowerCase())}`;

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

  const fmtMoney = (n) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(Number(n || 0));
  const fmtPct = (n) =>
    new Intl.NumberFormat("es-PE", {
      maximumFractionDigits: 0,
    }).format(Number(n || 0)) + "%";

  // ---------------------- Helpers ----------------------
  const getDetalleServicios = (v) => v?.detalle_ventaMembresia || [];
  const getDetalleProductos = (v) =>
    v?.detalle_ventaProductos || v?.detalle_ventaproductos || v?.detalle_venta_productos || [];

  const sumByMonth = () => {
    const map = new Map();

    for (const v of ventas) {
      const d = toLimaDate(v?.fecha_venta);
      if (!d) continue;
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      const from = clamp(Number(initialDay || 1), 1, lastDay);
      const to = clamp(Number(cutDay || lastDay), from, lastDay);
      const dia = d.getDate();
      if (dia < from || dia > to) continue;

      const mAlias = MESES[d.getMonth()];
      const key = keyOf(d.getFullYear(), mAlias);

      if (!map.has(key)) map.set(key, { serv: 0, prod: 0, total: 0 });
      const bucket = map.get(key);

      for (const s of getDetalleServicios(v)) {
        bucket.serv += Number(s?.tarifa_monto || 0);
      }
      for (const p of getDetalleProductos(v)) {
        bucket.prod += Number(p?.tarifa_monto || p?.precio_unitario || 0);
      }
      bucket.total = bucket.serv + bucket.prod;
    }
    return map;
  };

  const dataByMonth = sumByMonth();

  // Mes de referencia
const refKeyFromFechas= fechas.length ? keyOf(fechas[fechas.length - 1].anio, fechas[fechas.length - 1].mes) : null;

  const refKey = refMonthKey || refKeyFromFechas;
  const refVals = (refKey && dataByMonth.get(refKey)) || { serv: 0, prod: 0, total: 0 };

  // ---------------------- Columnas ----------------------
  const columns = fechas.map((f) => {
    const key = keyOf(f.anio, f.mes);
    const vals = dataByMonth.get(key) || { serv: 0, prod: 0, total: 0 };

    let delta, pct;
    if (key === refKey) {
      // 👉 Si es el mes de referencia, usar sus propios valores
      delta = { serv: vals.serv, prod: vals.prod, total: vals.total };
      pct = { serv: 100, prod: 100, total: 100 };
    } else {
      delta = {
        serv: refVals.serv - vals.serv,
        prod: refVals.prod - vals.prod,
        total: refVals.total - vals.total,
      };
      pct = {
        serv: refVals.serv ? (delta.serv / refVals.serv) * 100 : 0,
        prod: refVals.prod ? (delta.prod / refVals.prod) * 100 : 0,
        total: refVals.total ? (delta.total / refVals.total) * 100 : 0,
      };
    }

    return {
      key,
      label: String(f.label || "").toUpperCase(),
      isRef: key === refKey,
      vals,
      delta,
      pct,
    };
  });

  // ---------------------- Styles ----------------------
  const C = {
    black: "#000000",
    white: "#ffffff",
    red: "#c00000",
    green: "#2e7d32",
    greyRow: "#e9eef6",
    cellBorder: "1px solid #333",
  };

  const sTitle = {
    background: C.black,
    color: C.white,
    textAlign: "center",
    padding: "25px 12px",
    fontWeight: 700,
    letterSpacing: 0.2,
    fontSize: 25,
  };

  const sTable = { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" };
  const sHeadLeft = { background: C.red, color: C.white, padding: "10px", border: C.cellBorder, textAlign: "left", fontSize: 20 };
  const sHead = { background: C.red, color: C.white, padding: "10px", border: C.cellBorder, textAlign: "center", fontSize: 20 };
  const sCell = { background: C.white, color: "#000", padding: "8px 10px", border: C.cellBorder, fontSize: 13 };
  const sCellBold = { ...sCell, fontWeight: 700, fontSize: 19 };
  const sRowShade = { background: C.greyRow };

  const MoneyCell = ({ value }) => {
    const v = Number(value || 0);
    const neg = v < 0;
    const absValue = Math.abs(v);
    return (
      <td style={{ ...sCellBold, color: neg ? C.red : C.green }}>
        {neg ? "-" : "+"}
        {fmtMoney(absValue)}
      </td>
    );
  };

  const PctCell = ({ value }) => {
    const v = Number(value || 0);
    const isNeg = v < 0;
    const sign = v > 0 ? "+" : "";
    return (
      <td style={{ ...sCellBold, color: isNeg ? C.red : C.green }}>
        {sign}
        {fmtPct(v)}
      </td>
    );
  };

  const MonthHead = ({ col }) => (
    <th style={sHead}>
      <div>{col.label}</div>
      {col.isRef && <div style={{ fontSize: 12 }}></div>}
    </th>
  );

  // ---------------------- Render ----------------------
 // ---------------------- Render ----------------------
  return (
    <Card className="shadow-sm rounded-3 overflow-hidden">
      <Card.Body style={{ padding: "0" }}>
        <div style={{ fontFamily: "Inter, system-ui, Segoe UI, Roboto, sans-serif" }}>
          <div style={sTitle}>COMPARATIVO MENSUAL VS MES ACTUAL</div>

          {/* SERVICIOS */}
          <table style={sTable}>
            <thead>
              <tr>
                <th style={sHeadLeft}>SERVICIOS</th>
                {columns.map((c) => (
                  <MonthHead key={c.key} col={c} />
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...sCellBold, textAlign: "left" }}>VENTAS</td>
                {columns.map((c) => (
                  <MoneyCell key={c.key} value={c.delta.serv} />
                ))}
              </tr>
              <tr style={sRowShade}>
                <td style={{ ...sCellBold, textAlign: "left" }}>%</td>
                {columns.map((c) => (
                  <PctCell key={c.key} value={c.pct.serv} />
                ))}
              </tr>
            </tbody>
          </table>

          {/* PRODUCTOS */}
          <table style={{ ...sTable, marginTop: 12 }}>
            <thead>
              <tr>
                <th style={sHeadLeft}>PRODUCTOS</th>
                {columns.map((c) => (
                  <MonthHead key={c.key} col={c} />
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...sCellBold, textAlign: "left" }}>VENTAS</td>
                {columns.map((c) => (
                  <MoneyCell key={c.key} value={c.delta.prod} />
                ))}
              </tr>
              <tr style={sRowShade}>
                <td style={{ ...sCellBold, textAlign: "left" }}>%</td>
                {columns.map((c) => (
                  <PctCell key={c.key} value={c.pct.prod} />
                ))}
              </tr>
            </tbody>
          </table>

          {/* TOTAL */}
          <table style={{ ...sTable, marginTop: 12 }}>
            <thead>
              <tr>
                <th style={sHeadLeft}>TOTAL</th>
                {columns.map((c) => (
                  <MonthHead key={c.key} col={c} />
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...sCellBold, textAlign: "left" }}>VENTAS</td>
                {columns.map((c) => (
                  <MoneyCell key={c.key} value={c.delta.total} />
                ))}
              </tr>
              <tr style={sRowShade}>
                <td style={{ ...sCellBold, textAlign: "left" }}>%</td>
                {columns.map((c) => (
                  <PctCell key={c.key} value={c.pct.total} />
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  );
};
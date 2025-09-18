import React from "react";

/**
 * MonthlyVsCurrentComparativo
 * --------------------------------------------------------------
 * Cuadro: "COMPARATIVO MENSUAL VS MES ACTUAL".
 * Respeta paleta (negro / rojo / blanco) como la imagen enviada.
 *
 * Props:
 *  - ventas: Array<Venta>
 *      Cada venta debe traer fecha_venta (ISO) y detalles de servicios/productos.
 *      Acepta llaves: detalle_ventaservicios, detalle_ventaProductos, detalle_ventaproductos
 *  - fechas: Array<{ label: string; anio: string|number; mes: string }>
 *      Lista de columnas en orden. "mes" en español minúsculas (enero..diciembre; admite "septiembre"/"setiembre").
 *  - initialDay?: number    // default 1
 *  - cutDay?: number        // default 21
 *  - refMonthKey?: string   // clave del mes de referencia `${anio}-${mes}`; default: último de `fechas`
 */
export const ComparativoVsActual=({
  ventas = [],
  fechas = [],
  initialDay = 1,
  cutDay = 21,
  refMonthKey,
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
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(Number(n || 0));
  const fmtPct = (n) =>
    new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 }).format(Number(n || 0)) + "%";

  const fmtDeltaMoney = (n) => {
    const v = Number(n || 0);
    if (v < 0) return `(${fmtMoney(Math.abs(v))})`;
    return `${fmtMoney(v)}`;
  };

  // Aceptar nombres alternos de detalle
  const getDetalleServicios = (v) => v?.detalle_ventaMembresia || v?.detalle_ventaMembresia || [];
  const getDetalleProductos = (v) =>
    v?.detalle_ventaProductos || v?.detalle_ventaproductos || v?.detalle_venta_productos || [];

  // Aggregate por mes dentro del rango [initialDay..cutDay]
  const sumByMonth = () => {
    const map = new Map(); // key -> {serv, prod, total}

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
        const cantidad = Number(s?.cantidad || 1);
        bucket.serv += Number(s?.tarifa_monto || 0) * cantidad;
      }
      for (const p of getDetalleProductos(v)) {
        const cantidad = Number(p?.cantidad || 1);
        const linea = Number(p?.tarifa_monto || p?.precio_unitario || 0) * cantidad;
        bucket.prod += linea;
      }
      bucket.total = bucket.serv + bucket.prod;
    }
    return map;
  };

  const dataByMonth = sumByMonth();
  const computeRefKeyFromVentas = () => {
    let latest = null;
    for (const v of ventas) {
      const d = toLimaDate(v?.fecha_venta);
      if (!d) continue;
      if (!latest || d > latest) latest = d;
    }
    if (!latest) {
      return fechas.length ? keyOf(fechas[fechas.length - 1].anio, fechas[fechas.length - 1].mes) : null;
    }
    const mAlias = MESES[latest.getMonth()];
    return keyOf(latest.getFullYear(), mAlias);
  };
  const refKey = refMonthKey || computeRefKeyFromVentas();
  const refVals = (refKey && dataByMonth.get(refKey)) || { serv: 0, prod: 0, total: 0 };

  // Calcular deltas vs REF
  const columns = fechas.map((f) => {
    const key = keyOf(f.anio, f.mes);
    const vals = dataByMonth.get(key) || { serv: 0, prod: 0, total: 0 };

    const dServ = vals.serv - refVals.serv;
    const dProd = vals.prod - refVals.prod;
    const dTot = vals.total - refVals.total;

    const pct = (val, ref) => {
      if (!ref) return 0;
      return ((val - ref) / ref) * 100;
    };

    return {
      key,
      label: String(f.label || "").toUpperCase(),
      isRef: key === refKey,
      vals,
      delta: { serv: dServ, prod: dProd, total: dTot },
      pct: {
        serv: pct(vals.serv, refVals.serv),
        prod: pct(vals.prod, refVals.prod),
        total: pct(vals.total, refVals.total),
      },
    };
  });

  // --------------------------- Styles ---------------------------
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
    fontSize: 25
  };

  const sTable = { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" };
  const sHeadLeft = { background: C.red, color: C.white, padding: "10px", border: C.cellBorder, textAlign: "left", fontSize: 20 };
  const sHead = { background: C.red, color: C.white, padding: "10px", border: C.cellBorder, textAlign: "center", fontSize: 20 };
  const sCell = { background: C.white, color: "#000", padding: "8px 10px", border: C.cellBorder, fontSize: 13 };
  const sCellBold = { ...sCell, fontWeight: 700, fontSize: 17 };
  const sRowShade = { background: C.greyRow };

  const MoneyCell = ({ value }) => {
    const v = Number(value || 0);
    const neg = v < 0;
    return (
      <td style={{ ...sCellBold, color: neg ? C.green : C.red }}>
        {fmtDeltaMoney(v)}
      </td>
    );
  };

  const PctCell = ({ value }) => {
    const v = Number(value || 0);
    const neg = v < 0;
    return <td style={{ ...sCellBold, color: neg ? C.green : C.red }}>{fmtPct(v)}</td>;
  };

  const MonthHead = ({ col }) => (
    <th style={sHead}>
      <div>{col.label}</div>
      {col.isRef && <div style={{ fontSize: 12 }}></div>}
    </th>
  );

  // --------------------------- Render ---------------------------
  return (
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
  );
}

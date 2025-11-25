import React from "react";
import { Card } from "react-bootstrap";

export const ComparativoVsActual = ({
  ventas = [],
  reservasMF = [],
  fechas = [],
  initialDay = 1,
  cutDay = 21,
  refMonthKey,
}) => {
  const MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre",
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

  const fmtPct = (n) => {
    const num = Number(n || 0);
    const sign = num > 0 ? "+" : num < 0 ? "−" : "";
    return (
      sign +
      new Intl.NumberFormat("es-PE", {
        maximumFractionDigits: 0,
      }).format(Math.abs(num)) +
      "%"
    );
  };

  const getDetalleOtrosServicios = (v) =>
    v?.detalle_ventaservicios || v?.detalle_ventaServicios || v?.detalle_servicios || [];

  const getDetalleServicios = (v) => v?.detalle_ventaMembresia || [];
  
  const getDetalleProductos = (v) =>
    v?.detalle_ventaProductos || v?.detalle_ventaproductos || v?.detalle_venta_productos || [];

  const sumByMonth = () => {
    const map = new Map();

    // 1. SUMAR VENTAS (Membresias, Productos, Otros)
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

      if (!map.has(key)) map.set(key, { serv: 0, prod: 0, otros: 0, mf: 0, total: 0 });
      const bucket = map.get(key);

      for (const s of getDetalleServicios(v)) {
        bucket.serv += Number(s?.tarifa_monto || 0);
      }
      for (const p of getDetalleProductos(v)) {
        bucket.prod += Number(p?.tarifa_monto || p?.precio_unitario || 0);
      }
      for (const o of getDetalleOtrosServicios(v)){
        bucket.otros += Number(o?.tarifa_monto || o?.precio_unitario || 0);
      }
    }

    // 2. SUMAR MONKEYFIT (RESERVAS)
    for (const r of reservasMF) {
        if (!r?.flag) continue; 
        const estado = String(r?.estado?.label_param || "").toLowerCase();
        const ok = ["completada", "confirmada", "pagada", "no pagada", "reprogramada"].some(e => estado.includes(e));
        if (!ok) continue;

        const d = toLimaDate(r?.fecha || r?.createdAt);
        if (!d) continue;

        const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        const from = clamp(Number(initialDay || 1), 1, lastDay);
        const to = clamp(Number(cutDay || lastDay), from, lastDay);
        const dia = d.getDate();
        if (dia < from || dia > to) continue;

        const mAlias = MESES[d.getMonth()];
        const key = keyOf(d.getFullYear(), mAlias);

        if (!map.has(key)) map.set(key, { serv: 0, prod: 0, otros: 0, mf: 0, total: 0 });
        const bucket = map.get(key);

        bucket.mf += Number(r?.monto_total || 0);
    }

    // 3. CALCULAR TOTALES FINALES
    map.forEach(bucket => {
        bucket.total = bucket.serv + bucket.prod + bucket.otros + bucket.mf;
    });

    return map;
  };

  const dataByMonth = sumByMonth();

  const refKeyFromFechas = fechas.length
    ? keyOf(fechas[fechas.length - 1].anio, fechas[fechas.length - 1].mes)
    : null;

  const refKey = refMonthKey || refKeyFromFechas;
  const refVals = (refKey && dataByMonth.get(refKey)) || { serv: 0, prod: 0, mf:0, total: 0 };

  const columns = fechas.map((f) => {
    const key = keyOf(f.anio, f.mes);
    const vals = dataByMonth.get(key) || { serv: 0, prod: 0, mf:0, total: 0 };

    let delta, pct;
    if (key === refKey) {
      delta = { serv: vals.serv, prod: vals.prod, mf:vals.mf, total: vals.total };
      pct = { serv: 100, prod: 100, mf:100, total: 100 };
    } else {
      delta = {
        serv: refVals.serv - vals.serv,
        prod: refVals.prod - vals.prod,
        mf: refVals.mf - vals.mf,
        total: refVals.total - vals.total,
      };

      // 🔥 CORRECCIÓN AQUÍ: Función auxiliar para calcular porcentaje
      // Si el valor de referencia es 0, pero el delta es negativo (hubo caída), retornamos -100%
      const calcPct = (ref, d) => {
        if (ref !== 0) return (d / ref) * 100;
        return d < 0 ? -100 : 0; 
      };

      pct = {
        serv: calcPct(refVals.serv, delta.serv),
        prod: calcPct(refVals.prod, delta.prod),
        mf: calcPct(refVals.mf, delta.mf),
        total: calcPct(refVals.total, delta.total),
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

  const C = {
    black: "#000000",
    white: "#ffffff",
    red: "#c00000",
    green: "#2e7d32",
    greyRow: "#e9eef6",
    cellBorder: "1px solid #333",
  };
  const sTitle = { background: C.black, color: C.white, textAlign: "center", padding: "25px 12px", fontWeight: 700, letterSpacing: 0.2, fontSize: 27 };
  const sTable = { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" };
  const sHeadLeft = { background: C.red, color: C.white, padding: "10px", border: C.cellBorder, textAlign: "left", fontSize: 27 };
  const sHead = { background: C.red, color: C.white, padding: "10px", border: C.cellBorder, textAlign: "center", fontSize: 27 };
  const sCell = { background: C.white, color: "#000", padding: "8px 10px", border: C.cellBorder, fontSize: 18, textAlign: "center" };
  const sCellBold = { ...sCell, fontWeight: 700, fontSize: 28 };
  const sRowShade = { background: C.greyRow };

  const MoneyCell = ({ value, isLast }) => {
    const v = Number(value || 0);
    const neg = v < 0;
    const absValue = Math.abs(v);
    return (
      <td style={{ ...sCellBold, background: isLast ? C.red : sCell.background, color: isLast ? "#fff" : neg ? C.red : C.green, fontSize: isLast ? 28 : sCellBold.fontSize }}>
        {neg ? "-" : "+"} {fmtMoney(absValue)}
      </td>
    );
  };

  const PctCell = ({ value, isLast }) => {
    if (isLast) return <td style={{ ...sCellBold, background: C.red, color: "#fff", fontSize: 28 }}>100%</td>;
    const v = Number(value || 0);
    const isNeg = v < 0;
    return <td style={{ ...sCellBold, background: sCell.background, color: isNeg ? C.red : C.green, fontSize: sCellBold.fontSize }}>{fmtPct(v)}</td>;
  };

  const MonthHead = ({ col, isLast }) => (
    <th style={{ ...sHead, background: isLast ? C.red : sHead.background, color: "#fff", fontSize: isLast ? 28 : sHead.fontSize }}>
      <div>{col.label}</div>
    </th>
  );

  return (
    <Card className="shadow-sm rounded-3 overflow-hidden">
      <Card.Body style={{ padding: "0" }}>
        <div style={{ fontFamily: "Inter, system-ui, Segoe UI, Roboto, sans-serif" }}>
          <div style={sTitle}>COMPARATIVO MENSUAL VS MES ACTUAL</div>
          {["MEMBRESÍAS", "PRODUCTOS","MONKEY FIT", "TOTAL"].map((tipo) => (
            <table key={tipo} style={{ ...sTable, marginTop: 12 }}>
              <thead>
                <tr>
                  <th style={{ ...sHeadLeft, background: "white", color: C.red }}>{tipo}</th>
                  {columns.map((c, idx) => (
                    <MonthHead key={c.key} col={c} isLast={idx === columns.length - 1} />
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-white" style={{ ...sCellBold, textAlign: "left", background: C.red }}>VENTAS</td>
                  {columns.map((c, idx) => (
                    <MoneyCell
                      key={c.key}
                      value={
                        tipo === "MEMBRESÍAS" ? c.delta.serv
                        : tipo === "PRODUCTOS" ? c.delta.prod
                        : tipo === "MONKEY FIT" ? c.delta.mf
                        : c.delta.total 
                      }
                      isLast={idx === columns.length - 1}
                    />
                  ))}
                </tr>
                <tr style={sRowShade}>
                  <td className="text-white" style={{ ...sCellBold, textAlign: "left", background: C.red }}>%</td>
                  {columns.map((c, idx) => (
                    <PctCell
                      key={c.key}
                      value={
                        tipo === "MEMBRESÍAS" ? c.pct.serv
                        : tipo === "PRODUCTOS" ? c.pct.prod
                        : tipo === "MONKEY FIT"? c.pct.mf
                        : c.pct.total
                      }
                      isLast={idx === columns.length - 1}
                    />
                  ))}
                </tr>
              </tbody>
            </table>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};
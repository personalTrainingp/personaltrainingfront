import React from "react";

/**
 * ExecutiveSummaryTable
 * --------------------------------------------------------------
 * Tabla de "RESUMEN EJECUTIVO HASTA EL <cutDay> DE CADA MES".
 *
 * Props esperadas:
 *  - ventas: Array<Venta>
 *      {
 *        fecha_venta: ISOString,
 *        detalle_ventaservicios?: Array<{ cantidad?: number, tarifa_monto?: number }>,
 *        detalle_ventaProductos?: Array<{ cantidad?: number, tarifa_monto?: number }>,
 *        // también se aceptan llaves en snake/variantes: detalle_ventaproductos
 *      }
 *  - fechas: Array<{ label: string; anio: string | number; mes: string }>
 *      // ej.: [{ label: 'MAYO', anio: '2025', mes: 'mayo' }, ...]
 *      // "mes" debe ir en español en minúsculas (enero..diciembre). Se aceptan
 *      // variantes "septiembre"/"setiembre".
 *  - dataMktByMonth: Record<string, { inversiones_redes?: number; leads?: number; cpl?: number; cac?: number }>
 *      // clave recomendada: `${anio}-${mes}` (mes en minúsculas), por ejemplo: "2025-agosto".
 *      // Si cpl o cac no vienen, se dejan en 0. (No se derivan automáticamente).
 *  - initialDay?: number  // día inicial a considerar (incl.) -> default 1
 *  - cutDay?: number      // día final a considerar (incl.)   -> default 21
 *
 *  Ejemplo de uso rápido:
 *  <ExecutiveSummaryTable
 *     ventas={misVentas}
 *     fechas={[{label:'MAYO', anio: '2025', mes: 'mayo'}, {label:'JUNIO', anio:'2025', mes:'junio'}]}
 *     dataMktByMonth={{ '2025-mayo': {inversiones_redes: 4895, leads: 408, cpl: 12, cac: 0} }}
 *     initialDay={1}
 *     cutDay={21}
 *  />
 */
export default function ExecutiveTable({
  ventas = [],
  fechas = [],
  dataMktByMonth = {},
  initialDay = 1,
  cutDay = 21,
}) {
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

  const toLimaDate = (iso) => {
    if (!iso) return null;
    try {
      const d = new Date(iso);
      // convert UTC -> Lima (-05:00)
      const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
      return new Date(utcMs - 5 * 60 * 60000);
    } catch (_) {
      return null;
    }
  };

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const fmtMoney = (n) =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
      Number(n || 0)
    );

  const fmtNum = (n, d = 0) =>
    new Intl.NumberFormat("es-PE", { minimumFractionDigits: d, maximumFractionDigits: d }).format(
      Number(n || 0)
    );

  // Aceptar varias llaves de detalle para robustez
  const getDetalleServicios = (v) => v?.detalle_ventaMembresia || v?.detalle_ventaMembresia || [];
  const getDetalleProductos = (v) =>
    v?.detalle_ventaProductos || v?.detalle_ventaproductos || v?.detalle_venta_productos || [];

  // Filtrar ventas por mes/año + rango de días [initialDay, cutDay]
  const computeMetricsForMonth = (anio, mesNombre) => {
    const mesAlias = aliasMes(String(mesNombre).toLowerCase());
    const monthIdx = MESES.indexOf(mesAlias); // 0..11
    if (monthIdx < 0) return null;

    let totalServ = 0;
    let cantServ = 0;
    let totalProd = 0;
    let cantProd = 0;

    for (const v of ventas) {
      const d = toLimaDate(v?.fecha_venta);
      if (!d) continue;
      if (d.getFullYear() !== Number(anio)) continue;
      if (d.getMonth() !== monthIdx) continue;

      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      const from = clamp(Number(initialDay || 1), 1, lastDay);
      const to = clamp(Number(cutDay || lastDay), from, lastDay);
      const dia = d.getDate();
      if (dia < from || dia > to) continue;

      // Servicios
      for (const s of getDetalleServicios(v)) {
        const cantidad = Number(s?.cantidad || 1);
        const linea = Number(s?.tarifa_monto || 0) * cantidad;
        totalServ += linea;
        cantServ += cantidad;
      }
      // Productos
      for (const p of getDetalleProductos(v)) {
        const cantidad = Number(p?.cantidad || 1);
        const linea = Number(p?.tarifa_monto || p?.precio_unitario || 0) * cantidad;
        totalProd += linea;
        cantProd += cantidad;
      }
    }

    const ticketServ = cantServ ? totalServ / cantServ : 0;
    const ticketProd = cantProd ? totalProd / cantProd : 0;

    const key = `${anio}-${mesAlias}`;
    const mk = dataMktByMonth?.[key] || {};

    return {
      mkInv: Number(mk?.inversiones_redes || 0),
      mkLeads: Number(mk?.leads || 0),
      mkCpl: Number(mk?.cpl || 0),
      mkCac: Number(mk?.cac || 0),
      totalServ,
      cantServ,
      ticketServ,
      totalProd,
      cantProd,
      ticketProd,
      totalMes: totalServ + totalProd,
    };
  };

  const rows = [
    { key: "mkInv", label: "INVERSIÓN REDES", type: "money" },
    { key: "mkLeads", label: "LEADS", type: "int" },
    { key: "mkCpl", label: "CPL", type: "float2" },
    { key: "totalServ", label: "VENTA SERVICIOS", type: "money" },
    { key: "ticketServ", label: "TICKET PROMEDIO SERV.", type: "money" },
    { key: "totalProd", label: "VENTA PRODUCTOS", type: "money" },
    { key: "cantProd", label: "CANTIDAD PRODUCTOS", type: "int" },
    { key: "cantServ", label: "CANTIDAD SERVICIOS", type: "int" },
    { key: "ticketProd", label: "TICKET PROMEDIO PROD.", type: "money" },
  ];

  // Precalcular métricas por columna (mes)
  const perMonth = fechas.map((f) => ({
    label: String(f?.label || "").toUpperCase(),
    anio: f?.anio,
    mes: String(f?.mes || "").toLowerCase(),
    metrics: computeMetricsForMonth(f?.anio, f?.mes),
  }));

  // --------------------------- Styles ---------------------------
  // Respetando el esquema de colores del ejemplo (negro/rojo/blanco)
  const cBlack = "#000000";
  const cWhite = "#ffffff";
  const cRed = "#c00000"; // rojo intenso para las bandas inferiores
  const border = "1px solid #333";

  const sWrap = {
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
    color: cBlack,
  };

  const sHeader = {
    background: cBlack,
    color: cWhite,
    textAlign: "center",
    padding: "25px 12px",
    fontWeight: 700,
    letterSpacing: 0.2,
    fontSize: 25
  };

  const sTable = {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  };

  const sThMes = {
    // background: "#231f20",
    color: cWhite,
    border,
    // padding: "8px 10px",
    textAlign: "center",
    fontWeight: 700,
    fontSize: 20,
    padding: "10px"
  };

  const sThLeft = { ...sThMes, textAlign: "left", width: 260, fontSize: 20};
  const sCell = { border, padding: "8px 10px", fontSize: 13, background: cWhite, fontSize: 20 };
  const sCellBold = { ...sCell, fontWeight: 700, fontSize: 17 };

  const sRowBlack = { background: cBlack, color: cWhite, fontWeight: 700 };
  const sRowRed = { background: cRed, color: cWhite, fontWeight: 800 };

  // --------------------------- Render ---------------------------
  return (
    <div style={sWrap}>
      <div style={sHeader}>
        RESUMEN EJECUTIVO HASTA EL {cutDay} DE CADA MES
      </div>

      <table style={sTable}>
        <thead>
          <tr  className="bg-primary">
            <th style={sThLeft}>MES</th>
            {perMonth.map((m, idx) => (
              <th key={idx} style={sThMes}>
                <div>
                  {m.label}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <td style={sCellBold}>{r.label}</td>
              {perMonth.map((m, idx) => {
                const val = m.metrics?.[r.key] ?? 0;
                let txt = "";
                if (r.type === "money") txt = fmtMoney(val);
                else if (r.type === "float2") txt = fmtNum(val, 2);
                else txt = fmtNum(val, 0);
                return (
                  <td key={idx} style={sCell}>
                    {txt}
                  </td>
                );
              })}
            </tr>
          ))}

          {/* Fila negra: TOTAL MES */}
          <tr style={sRowBlack}>
            <td style={{ ...sCellBold, background: "transparent", color: cWhite }}>TOTAL MES</td>
            {perMonth.map((m, idx) => (
              <td key={idx} style={{ ...sCellBold, background: "transparent", color: cWhite }}>
                {fmtMoney(m.metrics?.totalMes || 0)}
              </td>
            ))}
          </tr>

          {/* CAC */}
          <tr>
            <td style={sCellBold}>CAC (S/)</td>
            {perMonth.map((m, idx) => (
              <td key={idx} style={sCell}>
                {fmtNum(m.metrics?.mkCac || 0, 2)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* Bandas Rojas Inferiores */}
      <table style={{ ...sTable,}}>
        <thead>
          <tr style={sRowRed}>
            <th style={{ ...sThLeft, background: "transparent", color: cWhite }}>VENTA TOTAL</th>
            {perMonth.map((m, idx) => (
              <th key={idx} style={{ ...sThMes, background: "transparent", color: cWhite }}>
                {fmtMoney(m.metrics?.totalMes || 0)}
              </th>
            ))}
          </tr>
          <tr style={sRowRed}>
            <th style={{ ...sThLeft, background: "transparent", color: cWhite }}>ACUMULADA POR MES</th>
            {perMonth.map((m, idx) => (
              <th key={idx} style={{ ...sThMes, background: "transparent", color: cWhite }}>
                {/* En el ejemplo visual es el mismo valor del mes; si se requiere acumulado YTD,
                    cambiar aquí por una suma progresiva. */}
                {fmtMoney(m.metrics?.totalMes || 0)}
              </th>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );
}

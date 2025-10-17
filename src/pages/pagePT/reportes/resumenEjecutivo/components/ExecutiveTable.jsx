import React from "react";

/**
 * ExecutiveSummaryTable
 * --------------------------------------------------------------
 * Tabla de "RESUMEN EJECUTIVO HASTA EL <cutDay> DE CADA MES".
 */
export default function ExecutiveTable({
  ventas = [],
  fechas = [],
  dataMktByMonth = {},
  initialDay = 1,
  cutDay = 21,
}) {
  const MESES = [
    "enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","setiembre","octubre","noviembre","diciembre",
  ];
  const aliasMes = (m) => (m === "septiembre" ? "setiembre" : m);

  const toLimaDate = (iso) => {
    if (!iso) return null;
    try {
      const d = new Date(iso);
      const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
      return new Date(utcMs - 5 * 60 * 60000);
    } catch (_) { return null; }
  };

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const fmtMoney = (n) =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(Number(n || 0));
  const fmtNum = (n, d = 0) =>
    new Intl.NumberFormat("es-PE", { minimumFractionDigits: d, maximumFractionDigits: d }).format(Number(n || 0));

  const getDetalleServicios = (v) => v?.detalle_ventaMembresia || v?.detalle_ventaMembresia || [];
  const getDetalleProductos = (v) =>
    v?.detalle_ventaProductos || v?.detalle_ventaproductos || v?.detalle_venta_productos || [];

  const computeMetricsForMonth = (anio, mesNombre) => {
    const mesAlias = aliasMes(String(mesNombre).toLowerCase());
    const monthIdx = MESES.indexOf(mesAlias);
    if (monthIdx < 0) return null;

    let totalServ = 0, cantServ = 0, totalProd = 0, cantProd = 0;
    let totalServFull = 0, cantServFull = 0, totalProdFull = 0, cantProdFull = 0;

    const from = clamp(Number(initialDay || 1), 1, 31);

    for (const v of ventas) {
      const d = toLimaDate(v?.fecha_venta);
      if (!d) continue;
      if (d.getFullYear() !== Number(anio)) continue;
      if (d.getMonth() !== monthIdx) continue;

      // MES COMPLETO (1–31)
      for (const s of getDetalleServicios(v)) {
        const cantidad = Number(s?.cantidad || 1);
        const linea = Number(s?.tarifa_monto || 0);
        totalServFull += linea;
        cantServFull += cantidad;
      }
      for (const p of getDetalleProductos(v)) {
        const cantidad = Number(p?.cantidad || 1);
        const linea = Number(p?.tarifa_monto || p?.precio_unitario || 0);
        totalProdFull += linea;
        cantProdFull += cantidad;
      }

      // HASTA cutDay
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      const to = clamp(Number(cutDay || lastDay), from, lastDay);
      const dia = d.getDate();
      if (dia < from || dia > to) continue;

      for (const s of getDetalleServicios(v)) {
        const cantidad = Number(s?.cantidad || 1);
        const linea = Number(s?.tarifa_monto || 0);
        totalServ += linea;
        cantServ += cantidad;
      }
      for (const p of getDetalleProductos(v)) {
        const cantidad = Number(p?.cantidad || 1);
        const linea = Number(p?.tarifa_monto || p?.precio_unitario || 0);
        totalProd += linea;
        cantProd += cantidad;
      }
    }

    const ticketServ = cantServ ? totalServ / cantServ : 0;
    const ticketProd = cantProd ? totalProd / cantProd : 0;

    const key = `${anio}-${aliasMes(String(mesNombre).toLowerCase())}`;
    const mk = dataMktByMonth?.[key] ?? {};
    const FACTOR = 3.7;

    const invTotal = Number(mk?.inversiones_redes ?? mk?.inversion_redes ?? mk?.inv ?? 0);
    const mkInvAdjusted = invTotal * FACTOR;

    const leads = Number(mk?.leads ?? 0);
const mkCpl = leads > 0 ? (mkInvAdjusted / leads) : 0;

    const clientesDigitales = Number(mk?.clientes_digitales ?? 0);
    const mkCac = clientesDigitales > 0 ? mkInvAdjusted / clientesDigitales : 0;

    // ---- por canal (admite ids o nombres) ----
    const porRedRaw = mk?.por_red ?? mk?.inv_por_canal ?? {};
    const por_red = Object.fromEntries(
      Object.entries(porRedRaw).map(([k, v]) => [String(k).toLowerCase(), Number(v ?? 0) * FACTOR])
    );

    // Nuevas métricas por fila: TikTok (1514) y Meta (1515)
    const mkInvTikTok = Number(
      por_red["1514"] ?? por_red["tiktok"] ?? por_red["tik tok"] ?? 0
    );
    const mkInvMeta = Number(
      por_red["1515"] ?? por_red["meta"] ?? 0
    );

    const leads_por_red = mk?.leads_por_red ?? {};
    const cpl_por_red   = mk?.cpl_por_red ?? {};

    return {
      mkInv: mkInvAdjusted,
      mkInvTikTok,      
      mkInvMeta,       
      mkCpl,
      mkLeads: leads,
      mkCac,

      por_red,
      leads_por_red,
      cpl_por_red,

      // HASTA cutDay
      totalServ,
      cantServ,
      ticketServ,
      totalProd,
      cantProd,
      ticketProd,
      totalMes: totalServ + totalProd,

      // MES COMPLETO (1–31)
      totalServFull,
      cantServFull,
      ticketServFull: cantServFull ? totalServFull / cantServFull : 0,
      totalProdFull,
      cantProdFull,
      ticketProdFull: cantProdFull ? totalProdFull / cantProdFull : 0,
      totalMesFull: totalServFull + totalProdFull,
    };
  };

  const rows = [
    { key: "mkInv", label: "INVERSIÓN REDES", type: "money" },
    { key: "mkInvTikTok", label: "— TikTok", type: "money" },
    { key: "mkInvMeta",   label: "— Meta",   type: "money" }, 
    { key: "mkLeads", label: "LEADS", type: "int" },
    { key: "mkCpl", label: "COSTO POR LEADS", type: "float2" },
    { key: "totalServ", label: "VENTA MEMBRESIA", type: "money" },
    { key: "cantServ", label: "CANTIDAD MEMBRESIA", type: "int" },
    { key: "ticketServ", label: "TICKET MEDIO MEMBRESIA", type: "money" },
    { key: "totalProd", label: "VENTA PRODUCTOS", type: "money" },
    { key: "cantProd", label: "CANTIDAD PRODUCTOS", type: "int" },
    { key: "ticketProd", label: "TICKET MEDIO PRODUCTOS", type: "money" },
  ];

  const perMonth = fechas.map((f) => ({
    label: String(f?.label || "").toUpperCase(),
    anio: f?.anio,
    mes: String(f?.mes || "").toLowerCase(),
    metrics: computeMetricsForMonth(f?.anio, f?.mes),
  }));

  const cBlack = "#000000";
  const cWhite = "#ffffff";
  const cRed = "red";
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
  const sTable = { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" };
  const sThMes = { color: cWhite, border, textAlign: "center", fontWeight: 700, fontSize: 20, padding: "10px" };
  const sThLeft = { ...sThMes, textAlign: "left", width: 260 };
  const sCell = { border, padding: "8px 10px", background: cWhite, fontSize: 19 };
  const sCellBold = { ...sCell, fontWeight: 700, fontSize: 17 };
  const sRowBlack = { background: cBlack, color: cWhite, fontWeight: 700 };
  const sRowRed = { background: cRed, color: cWhite, fontWeight: 800 };
const tbfinal ={fontSize:27,color:'red'}
  const metasPorMes = {
    enero: 50000, febrero: 50000, marzo: 50000, abril: 50000, mayo: 50000, junio: 50000,
    julio: 60000, agosto: 70000, setiembre: 75000, septiembre: 75000,
    octubre: 85000, noviembre: 85000, diciembre: 85000,
  };

return (
  <div style={sWrap}>
    <div style={sHeader}>INFORME GERENCIAL AL {cutDay} DE CADA MES</div>

    <table style={sTable}>
      <thead>
        <tr>
          <th className="bg-black" style={sThLeft}>MES</th>
          {perMonth.map((m, idx) => {
            const isLast = idx === perMonth.length - 1;
            return (
              <th
                key={idx}
                style={{
                  ...sThMes,
                  background: isLast ? "red" : cBlack,
                  fontSize: isLast ? 23 : sThMes.fontSize,
                }}
              >
                <div>{m.label}</div>
              </th>
            );
          })}
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

              const isLast = idx === perMonth.length - 1;
              return (
                <td
                  key={idx}
                  style={{
                    ...sCell,
                    background: isLast ? "red" : sCell.background,
                    color: isLast ? "#fff" : sCell.color,
                    fontWeight: isLast ? 700 : "normal",
                    fontSize: isLast ? 23 : sCell.fontSize,
                  }}
                >
                  {txt}
                </td>
              );
            })}
          </tr>
        ))}

        {/* VENTA TOTAL AL cutDay */}
        <tr style={sRowBlack}>
          <td style={{ ...sCellBold, background: "transparent", color: cWhite, fontSize: "18px" }}>
            VENTA TOTAL AL {cutDay}
          </td>
          {perMonth.map((m, idx) => {
            const isLast = idx === perMonth.length - 1;
            return (
              <td
                key={idx}
                style={{
                  ...sCellBold,
                  background: isLast ? "red" : "transparent",
                  color: "#fff",
                  fontSize: isLast ? 23 : "21px",
                }}
              >
                {fmtMoney(m.metrics?.totalMes || 0)}
              </td>
            );
          })}
        </tr>

        {/* META DEL MES */}
        <tr>
          <td style={sCellBold}>META DEL MES</td>
          {perMonth.map((m, idx) => {
            const isLast = idx === perMonth.length - 1;
            const meta = metasPorMes[m.mes] || 0;
            return (
              <td
                key={idx}
                style={{
                  ...sCell,
                  fontWeight: 700,
                  background: isLast ? "red" : sCell.background,
                  color: isLast ? "#fff" : sCell.color,
                  fontSize: isLast ? 23 : sCell.fontSize,
                }}
              >
                {fmtMoney(meta)}
              </td>
            );
          })}
        </tr>

        {/* % RESTANTE PARA META */}
        <tr>
          <td style={sCellBold}>% RESTANTE PARA META</td>
          {perMonth.map((m, idx) => {
            const isLast = idx === perMonth.length - 1;
            const meta = metasPorMes[m.mes] || 0;
            const total = m.metrics?.totalMes || 0;
            const porcentaje = meta > 0 ? (100 - (total / meta) * 100) : 0;
            const restante = porcentaje < 0 ? 0 : porcentaje;
            const color = total >= meta ? "#007b00" : "#c00000";
            return (
              <td
                key={idx}
                style={{
                  ...sCell,
                  fontWeight: 700,
                  color: isLast ? "#fff" : color,
                  background: isLast ? "red" : sCell.background,
                  fontSize: isLast ? 23 : sCell.fontSize,
                }}
              >
                {fmtNum(restante, 2)} %
              </td>
            );
          })}
        </tr>

        {/* % META ALCANZADA */}
        <tr>
          <td style={sCellBold}>% META ALCANZADA</td>
          {perMonth.map((m, idx) => {
            const isLast = idx === perMonth.length - 1;
            const meta = metasPorMes[m.mes] || 0;
            const total = m.metrics?.totalMes || 0;
            const porcentaje = meta > 0 ? (total / meta) * 100 : 0;
            const color = porcentaje >= 100 ? "#007b00" : "#c00000";
            return (
              <td
                key={idx}
                style={{
                  ...sCell,
                  fontWeight: 700,
                  color: isLast ? "#fff" : color,
                  background: isLast ? "red" : sCell.background,
                  fontSize: isLast ? 20 : sCell.fontSize,
                }}
              >
                {fmtNum(porcentaje, 2)} %
              </td>
            );
          })}
        </tr>

        {/* CAC */}
        <tr>
          <td style={sCellBold}>Calculo Adquisición Cliente Digital</td>
          {perMonth.map((m, idx) => {
            const isLast = idx === perMonth.length - 1;
            return (
              <td
                key={idx}
                style={{
                  ...sCell,
                  background: isLast ? "red" : sCell.background,
                  color: isLast ? "#fff" : sCell.color,
                  fontSize: isLast ? 23 : sCell.fontSize,
                }}
              >
                {fmtNum(m.metrics?.mkCac || 0, 2)}
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>

    {/* Banda Roja Inferior */}
    <table style={sTable}>
      <thead>
        <tr style={sRowRed}>
          <th style={{ ...sThLeft, background: "transparent", color: cWhite }}>
            VENTA TOTAL <br /> ACUMULADA POR MES
          </th>
          {perMonth.map((m, idx) => {
            const isLast = idx === perMonth.length - 1;
            return (
              <th
                key={idx}
                style={{
                  ...sThMes,
                  background: isLast ? "red" : "transparent",
                  color: "#fff",
                  fontSize: isLast ? 23 : sThMes.fontSize,
                }}
              >
                {fmtMoney(m.metrics?.totalMesFull || 0)}
              </th>
            );
          })}
        </tr>
      </thead>
    </table>
  </div>
);

}
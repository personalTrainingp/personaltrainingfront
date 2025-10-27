import React from "react";

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
    } catch {
      return null;
    }
  };

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const fmtMoney = (n) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(Number(n || 0));
  const fmtNum = (n, d = 0) =>
    new Intl.NumberFormat("es-PE", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }).format(Number(n || 0));

  const getDetalleServicios = (v) =>
    v?.detalle_ventaMembresia ||
    v?.detalle_ventaMembresia ||
    [];
  const getDetalleProductos = (v) =>
    v?.detalle_ventaProductos ||
    v?.detalle_ventaproductos ||
    v?.detalle_venta_productos ||
    [];

  const computeMetricsForMonth = (anio, mesNombre) => {
    const mesAlias = aliasMes(String(mesNombre).toLowerCase());
    const monthIdx = MESES.indexOf(mesAlias);
    if (monthIdx < 0) return null;

    let totalServ = 0,
      cantServ = 0,
      totalProd = 0,
      cantProd = 0;
    let totalServFull = 0,
      cantServFull = 0,
      totalProdFull = 0,
      cantProdFull = 0;

    const from = clamp(Number(initialDay || 1), 1, 31);

    for (const v of ventas) {
      const d = toLimaDate(v?.fecha_venta);
      if (!d) continue;
      if (d.getFullYear() !== Number(anio)) continue;
      if (d.getMonth() !== monthIdx) continue;

      // MES COMPLETO
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
      const lastDay = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0
      ).getDate();
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

    // MARKETING
    const key = `${anio}-${mesAlias}`;
    const mk = dataMktByMonth?.[key] ?? {};

    const invTotalRaw = Number(
      mk?.inversiones_redes ?? mk?.inversion_redes ?? mk?.inv ?? 0
    );
    const clientesDigitales = Number(mk?.clientes_digitales ?? 0);

    const por_red = mk?.por_red ?? {};
    const val = (obj, k) => Number(obj?.[k] ?? 0);

    const rawMeta =
      val(por_red, "1515") +
      val(por_red, "meta") +
      val(por_red, "facebook") +
      val(por_red, "instagram");

    const rawTikTok =
      val(por_red, "1514") +
      val(por_red, "tiktok") +
      val(por_red, "tik tok");

    let mkInv = 0,
      mkInvMeta = 0,
      mkInvTikTok = 0;
    const sumRaw = rawMeta + rawTikTok;
    if (invTotalRaw > 0 && sumRaw > 0) {
      const shareMeta = rawMeta / sumRaw;
      const shareTikTok = rawTikTok / sumRaw;
      mkInv = invTotalRaw;
      mkInvMeta = mkInv * shareMeta;
      mkInvTikTok = mkInv - mkInvMeta;
    } else if (sumRaw > 0) {
      mkInv = sumRaw;
      mkInvMeta = rawMeta;
      mkInvTikTok = rawTikTok;
    } else {
      mkInv = invTotalRaw;
      mkInvMeta = 0;
      mkInvTikTok = 0;
    }

    const leads_por_red = mk?.leads_por_red ?? {};
    const clientes_por_red = mk?.clientes_por_red ?? {};

    const sumFrom = (obj, keys) =>
      keys.reduce((a, k) => a + Number(obj?.[k] ?? 0), 0);

    const mkLeadsMeta = sumFrom(leads_por_red, [
      "1515",
      "meta",
      "facebook",
      "instagram",
    ]);
    const mkLeadsTikTok = sumFrom(leads_por_red, [
      "1514",
      "tiktok",
      "tik tok",
    ]);

    const mkLeads = mkLeadsMeta + mkLeadsTikTok;

    const clientesMeta =
      sumFrom(clientes_por_red, [
        "1515",
        "meta",
        "facebook",
        "instagram",
      ]) || mkLeadsMeta;
    const clientesTikTok =
      sumFrom(clientes_por_red, ["1514", "tiktok", "tik tok"]) ||
      mkLeadsTikTok;

    const safeDiv0 = (n, d) =>
      Number(d) > 0 ? Number(n) / Number(d) : 0;

    const mkCpl = safeDiv0(mkInv, mkLeads);
    const mkCplMeta = safeDiv0(mkInvMeta, mkLeadsMeta);
    const mkCplTikTok = safeDiv0(mkInvTikTok, mkLeadsTikTok);

    const mkCac = safeDiv0(mkInv, clientesDigitales);
    const mkCacMetaExact = safeDiv0(mkInvMeta, clientesMeta);
    const mkCacTikTokExact = safeDiv0(mkInvTikTok, clientesTikTok);

    return {
      // marketing
      mkInv,
      mkInvMeta,
      mkInvTikTok,
      mkLeads,
      mkLeadsMeta,
      mkLeadsTikTok,
      mkCpl,
      mkCplMeta,
      mkCplTikTok,
      mkCac,
      mkCacMeta: mkCacMetaExact,
      mkCacTikTok: mkCacTikTokExact,

      // ventas
      totalServ,
      cantServ,
      ticketServ,
      totalProd,
      cantProd,
      ticketProd,
      totalMes: totalServ + totalProd,
      totalServFull,
      cantServFull,
      ticketServFull: cantServFull
        ? totalServFull / cantServFull
        : 0,
      totalProdFull,
      cantProdFull,
      ticketProdFull: cantProdFull
        ? totalProdFull / cantProdFull
        : 0,
      totalMesFull: totalServFull + totalProdFull,
    };
  };

  const allRows = [
    // --- tabla MARKETING ---
    { key: "mkInv", label: "INVERSIÓN TOTAL REDES", type: "money" },
    {
      key: "mkLeads",
      label: "TOTAL LEADS DE META + TIKTOK",
      type: "int",
    },
    {
      key: "mkCpl",
      label: "COSTO TOTAL POR LEAD DE META + TIKTOK",
      type: "float2",
    },
    {
      key: "mkCac",
      label: "COSTO ADQUISICION DE CLIENTES",
      type: "float2",
    },
    {
      key: "mkInvMeta",
      label: "Inversion Meta",
      type: "money",
    },
    {
      key: "mkLeadsMeta",
      label: "CANTIDAD LEADS  META",
      type: "int",
    },
    {
      key: "mkCplMeta",
      label: "COSTO POR LEAD META",
      type: "float2",
    },
    {
      key: "mkCacMeta",
      label: "COSTO ADQUISCION DE CLIENTES META",
      type: "float2",
    },
    {
      key: "mkInvTikTok",
      label: " Inversion TikTok",
      type: "money",
    },
    {
      key: "mkLeadsTikTok",
      label: "CANTIDAD LEADS  TIKTOK",
      type: "int",
    },
    {
      key: "mkCplTikTok",
      label: "COSTO POR LEAD TIKTOK",
      type: "float2",
    },
    {
      key: "mkCacTikTok",
      label: "COSTO ADQUISICION CLIENTES TIKTOK",
      type: "float2",
    },

    // --- tabla VENTAS DETALLADAS ---
    {
      key: "totalServ",
      label: "VENTA MEMBRESIAS",
      type: "money",
    },
    {
      key: "cantServ",
      label: "CANTIDAD MEMBRESIAS",
      type: "int",
    },
    {
      key: "ticketServ",
      label: "TICKET MEDIO MEMBRESIAS",
      type: "money",
    },
    {
      key: "",
      label: "VENTA MEMBRESIAS MONKEY FIT",
      type: "money",
    },
    {
      key: "/",
      label: "CANTIDAD DE RESERVAS MONKEYFIT",
      type: "int",
    },
    {
      key: "-",
      label: "TICKET MEDIO MONKEY FIT",
      type: "money",
    },
    {
      key: "totalProd",
      label: "VENTA PRODUCTOS",
      type: "money",
    },
    {
      key: "cantProd",
      label: "CANTIDAD PRODUCTOS",
      type: "int",
    },
    {
      key: "ticketProd",
      label: "TICKET MEDIO PRODUCTOS",
      type: "money",
    },
  ];

  const splitIdx =
    allRows.findIndex(
      (r) =>
        r.key === "totalServ" ||
        /VENTA\s+SERVICIOS|VENTA\s+MEMBRESIAS/i.test(r.label)
    ) >= 0
      ? allRows.findIndex(
          (r) =>
            r.key === "totalServ" ||
            /VENTA\s+SERVICIOS|VENTA\s+MEMBRESIAS/i.test(r.label)
        )
      : allRows.length;

  const rowsTop = allRows.slice(0, splitIdx); 
  const rowsBottom = allRows.slice(splitIdx); 
  const perMonth = fechas.map((f) => ({
    label: String(f?.label || "").toUpperCase(),
    anio: f?.anio,
    mes: String(f?.mes || "").toLowerCase(),
    metrics: computeMetricsForMonth(f?.anio, f?.mes),
  }));

  // estilos reusados
  const cBlack = "#000000";
  const cWhite = "#ffffff";
  const cRed = "#c00000";
  const border = "1px solid #333";

  const sWrap = {
    fontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
    color: cBlack,
  };
  const sHeader = {
    background: cBlack,
    color: cWhite,
    textAlign: "center",
    padding: "25px 12px",
    fontWeight: 700,
    letterSpacing: 0.2,
    fontSize: 25,
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
  };
  const sThLeft = { ...sThMes, textAlign: "center", width: 260 };
  const sCell = {
    border,
    padding: "8px 10px",
    background: cWhite,
    fontSize: 22,
    textAlign: "center",
  };
  const sCellBold = {
    border,
    padding: "8px 10px",
    background: cWhite,
    fontWeight: 700,
    fontSize: 17,
  };
  const sRowBlack = {
    background: cBlack,
    color: cWhite,
    fontWeight: 700,
  };
  const sRowRed = {
    background: cRed,
    color: cWhite,
    fontWeight: 800,
  };

  // metas de cuota por mes
  const metasPorMes = {
    enero: 50000,
    febrero: 50000,
    marzo: 50000,
    abril: 55000,
    mayo: 55000,
    junio: 60000,
    julio: 60000,
    agosto: 70000,
    setiembre: 75000,
    septiembre: 75000,
    octubre: 85000,
    noviembre: 85000,
    diciembre: 85000,
  };

  // ================
  // HELPERS DE RENDER
  // ================

  const TableHead = () => (
    <thead>
      <tr>
        <th
          className="bg-black"
          style={{ ...sThLeft, background: cBlack }}
        ></th>
        {perMonth.map((m, idx) => {
          const isLast = idx === perMonth.length - 1;
          return (
            <th
              key={idx}
              style={{
                ...sThMes,
                background: isLast ? "#000" : cBlack,
                fontSize: isLast ? 23 : sThMes.fontSize,
              }}
            >
              <div>{m.label}</div>
            </th>
          );
        })}
      </tr>
    </thead>
  );

  const renderRows = (rowsToRender, makeLastBold = true) =>
    rowsToRender.map((r) => (
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
                ...(makeLastBold && isLast
                  ? {
                      background: "#c00000",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 23,
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

  // tabla resumen cuota vs ventas
  const ResumenCuotaTable = () => (
    <table style={sTable}>
      <thead>
        <tr>
          <th
            style={{
              ...sThLeft,
              background: cBlack,
              color: "#fff",
              fontSize: 20,
              textTransform: "uppercase",
            }}
          >
            {/* celda vacía título izquierda */}
          </th>
          {perMonth.map((m, idx) => (
            <th
              key={idx}
              style={{
                ...sThMes,
                background: cBlack,
                color: "#fff",
                fontSize: 24,
              }}
            >
              {m.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {/* Fila: VENTA TOTAL AL corte (fila negra completa) */}
        <tr style={sRowBlack}>
          <td
            style={{
              ...sCellBold,
              background: "transparent",
              color: "#fff",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            {`VENTA TOTAL AL ${cutDay}`}
          </td>
          {perMonth.map((m, idx) => (
            <td
              key={idx}
              style={{
                ...sCellBold,
                background: "transparent",
                color: "#fff",
                fontSize: 21,
              }}
            >
              {fmtMoney(m.metrics?.totalMes || 0)}
            </td>
          ))}
        </tr>

        {/* CUOTA DEL MES (fondo blanco en las cifras, etiqueta roja a la izquierda) */}
        <tr>
          <td
            style={{
              ...sCellBold,
              background: cRed,
              color: "#fff",
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            CUOTA DEL MES
          </td>
          {perMonth.map((m, idx) => {
            const meta = metasPorMes[m.mes] || 0;
            return (
              <td
                key={idx}
                style={{
                  ...sCell,
                  fontWeight: 700,
                  color: "#000",
                  fontSize: 22,
                }}
              >
                {fmtMoney(meta)}
              </td>
            );
          })}
        </tr>

        {/* % ALCANCE DE CUOTA */}
        <tr>
          <td
            style={{
              ...sCellBold,
              background: cRed,
              color: "#fff",
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            % ALCANCE DE CUOTA
          </td>
          {perMonth.map((m, idx) => {
            const meta = metasPorMes[m.mes] || 0;
            const total = m.metrics?.totalMes || 0;
            const alcancePct =
              meta > 0 ? (total / meta) * 100 : 0;
            const supera = alcancePct >= 100;
            const color = supera ? "#007b00" : cRed; // verde si cumple
            return (
              <td
                key={idx}
                style={{
                  ...sCell,
                  fontWeight: 700,
                  color,
                  fontsize: 22,
                }}
              >
                {fmtNum(alcancePct, 2)} %
              </td>
            );
          })}
        </tr>

        {/* % RESTANTE PARA CUOTA */}
        <tr>
          <td
            style={{
              ...sCellBold,
              background: cRed,
              color: "#fff",
              fontWeight: 800,
              fontSize: 19,
            }}
          >
            % RESTANTE PARA CUOTA
          </td>
          {perMonth.map((m, idx) => {
            const meta = metasPorMes[m.mes] || 0;
            const total = m.metrics?.totalMes || 0;
            const restantePct =
              meta > 0
                ? Math.max(0, 100 - (total / meta) * 100)
                : 0;
            const cumple = total >= meta;
            const color = cumple ? "#007b00" : cRed;
            return (
              <td
                key={idx}
                style={{
                  ...sCell,
                  fontWeight: 700,
                  color,
                  fontsize: 22,
                }}
              >
                {fmtNum(restantePct, 2)} %
              </td>
            );
          })}
        </tr>

        {/* VENTA TOTAL MES (banda roja completa con blanco) */}
        <tr style={sRowRed}>
          <td
            style={{
              ...sCellBold,
              background: "transparent",
              color: "#fff",
              fontWeight: 800,
              fontSize: 18,
              textTransform: "uppercase",
            }}
          >
            VENTA TOTAL MES
          </td>
          {perMonth.map((m, idx) => (
            <td
              key={idx}
              style={{
                ...sCellBold,
                background: "transparent",
                color: "#fff",
                fontWeight: 800,
                fontSize: 22,
              }}
            >
              {fmtMoney(m.metrics?.totalMesFull || 0)}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );

  // ===============
  // RENDER FINAL
  // ===============
  return (
    <div style={sWrap}>
      {/* === TABLA DETALLE DE VENTAS POR TIPO === */}
      <div style={sHeader}>
        DETALLE DE VENTAS POR TIPO AL {cutDay} DE CADA MES
      </div>

      <table style={sTable}>
        <TableHead />
        <tbody>
          {renderRows(rowsBottom)}

          {/* VENTA TOTAL AL cutDay */}
         
        </tbody>
      </table>

      <table style={sTable}>
        <thead>
          <tr style={sRowRed}>
            <th
              style={{
                ...sThLeft,
                background: "transparent",
                color: cWhite,
                fontSize: 20,
              }}
            >
              VENTA TOTAL <br /> MES
            </th>
            {perMonth.map((m, idx) => (
              <th
                key={idx}
                style={{
                  ...sThMes,
                  background:
                    idx === perMonth.length - 1
                      ? "#c00000"
                      : "transparent",
                  color: "#fff",
                  fontSize: 24,
                }}
              >
                {fmtMoney(m.metrics?.totalMesFull || 0)}
              </th>
            ))}
          </tr>
          <tr>
            <td
              style={{
                ...sCellBold,
                background: "#000",
                color: "#fff",
                textAlign: "center",
                fontWeight: 800,
                fontSize: 18,
              }}
            />
            {perMonth.map((m, idx) => (
              <td
                key={`footer-month-${idx}`}
                style={{
                  ...sCellBold,
                  background: "#000",
                  color: "#fff",
                  fontSize: 25,
                  textAlign: "center",
                }}
              >
                {m.label}
              </td>
            ))}
          </tr>
        </thead>
      </table>

      <div style={{ height: 32 }} />

      {/* === NUEVA TABLA 3: RESUMEN CUOTA VS VENTAS === */}
      <div
        style={{
          ...sHeader,
          fontSize: 24,
          padding: "12px 16px",
          background: "#000",
          textAlign: "center",
        }}
      >
        RESUMEN DE CUOTA VS VENTAS
      </div>

      <ResumenCuotaTable />

      <div style={{ height: 32 }} />

      {/* === TABLA 4: MARKETING === */}
      <div
        style={{
          ...sHeader,
          fontSize: 22,
          padding: "12px 16px",
          background: "#c00000",
          textAlign: "center",
        }}
      >
        DETALLE DE INVERSIÓN EN REDES VS RESULTADOS EN LEADS
      </div>

      <table style={sTable}>
        <TableHead />
        <tbody>{renderRows(rowsTop)}</tbody>
      </table>
    </div>
  );
}

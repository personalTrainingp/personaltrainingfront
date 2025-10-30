import React from "react";

export default function ExecutiveTable({
  ventas = [],
  fechas = [],
  dataMktByMonth = {},
  initialDay = 1,
  cutDay = 21, 
  reservasMF = [],
  originMap = {},
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
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" })
      .format(Number(n || 0));
  const fmtNum = (n, d = 0) =>
    new Intl.NumberFormat("es-PE", { minimumFractionDigits: d, maximumFractionDigits: d })
      .format(Number(n || 0));

  // === DETALLES ===
  const getDetalleProductos = (v) =>
    v?.detalle_ventaProductos ||
    v?.detalle_ventaproductos ||
    v?.detalle_venta_productos ||
    [];

  const getDetalleMembresias = (v) =>
    v?.detalle_ventaMembresia ||
    v?.detalle_venta_membresia ||
    v?.detalle_ventamembresia ||
    [];

  const getDetalleOtrosServicios = (v) =>
    v?.detalle_ventaservicios ||
    v?.detalle_ventaServicios ||
    v?.detalle_servicios ||
    v?.detalle_venta_servicios ||
    [];

  const ORIGIN_SYNONYMS = {
    tiktok:    new Set(["1514","695","tiktok","tik tok","tik-tok"]),
    facebook:  new Set(["694","facebook","fb"]),
    instagram: new Set(["693","instagram","ig"]),
    meta:      new Set(["1515","meta"]),
  };

  const canonicalKeyFromRaw = (originMap, raw) => {
    const rawStr = String(raw ?? "").trim();
    const mapped = originMap?.[rawStr] ?? originMap?.[Number(rawStr)] ?? rawStr;
    const low = String(mapped).trim().toLowerCase();
    for (const [key, set] of Object.entries(ORIGIN_SYNONYMS)) {
      if (set.has(low) || set.has(rawStr.toLowerCase()) || set.has(String(raw).toLowerCase())) {
        return key;
      }
    }
    return low.replace(/\s+/g, "_");
  };

  const labelFromKey = (key) => {
    if (key === "tiktok") return "TIKTOK";
    if (key === "facebook") return "FACEBOOK";
    if (key === "instagram") return "INSTAGRAM";
    if (key === "meta") return "META (FB+IG)";
    return String(key || "OTROS").replace(/_/g, " ").toUpperCase();
  };

  // ===================== CORE METRICS =====================
  const computeMetricsForMonth = (anio, mesNombre) => {
    const mesAlias  = aliasMes(String(mesNombre).toLowerCase());
    const monthIdx  = MESES.indexOf(mesAlias);
    if (monthIdx < 0) return null;

    // — al corte —
    let totalServ = 0, cantServ = 0;
    let totalProd = 0, cantProd = 0;
    let totalOtros = 0, cantOtros = 0;

    // — mes completo —
    let totalServFull = 0, cantServFull = 0;
    let totalProdFull = 0, cantProdFull = 0;
    let totalOtrosFull = 0, cantOtrosFull = 0;

    const byOrigin = {};
    const byOriginFull = {};
    const byGroup     = { meta:{label:"META",total:0,cant:0}, tiktok:{label:"TIKTOK",total:0,cant:0}, otros:{label:"OTROS",total:0,cant:0} };
    const byGroupFull = { meta:{label:"META",total:0,cant:0}, tiktok:{label:"TIKTOK",total:0,cant:0}, otros:{label:"OTROS",total:0,cant:0} };

    let metaServTotalCut = 0,  metaServCantCut  = 0;
    let metaServTotalFull = 0, metaServCantFull = 0;

    const addTo = (bucket, key, label, linea, cantidad) => {
      if (!bucket[key]) bucket[key] = { label, total: 0, cant: 0 };
      bucket[key].total += Number(linea || 0);
      bucket[key].cant  += Number(cantidad || 0);
    };

    const from = clamp(Number(initialDay || 1), 1, 31);
    const lastDayMonth = new Date(Number(anio), monthIdx + 1, 0).getDate();
    const to = clamp(Number(cutDay || lastDayMonth), from, lastDayMonth);

    for (const v of ventas) {
      const d = toLimaDate(v?.fecha_venta || v?.fecha || v?.createdAt);
      if (!d) continue;
      if (d.getFullYear() !== Number(anio) || d.getMonth() !== monthIdx) continue;

      const rawOrigin =
        v?.id_origen ??
        v?.parametro_origen?.id_param ??
        v?.origen ?? v?.source ?? v?.canal ??
        v?.parametro_origen?.label_param;

      const oKey   = canonicalKeyFromRaw(originMap, rawOrigin);
      const oLabel = labelFromKey(oKey);
      const group  = (oKey === "tiktok")
        ? "tiktok"
        : (oKey === "facebook" || oKey === "instagram" || oKey === "meta")
          ? "meta"
          : "otros";

      // === MES COMPLETO ===
      for (const s of getDetalleMembresias(v)) {
        const cantidad = Number(s?.cantidad || 1);
         const linea    = Number(s?.tarifa_monto || 0);
        totalServFull += linea;  cantServFull += cantidad;

        if (oKey !== "meta") {
          addTo(byOriginFull, oKey, oLabel, linea, cantidad);
        } else {
          metaServTotalFull += linea;
          metaServCantFull  += cantidad;
        }
        addTo(byGroupFull, group, group.toUpperCase(), linea, cantidad);
      }
      for (const p of getDetalleProductos(v)) {
        const cantidad = Number(p?.cantidad || 1);
        const linea    = Number(p?.tarifa_monto || p?.precio_unitario || 0);
        totalProdFull += linea;  cantProdFull += cantidad;
      }
      for (const o of getDetalleOtrosServicios(v)) {
        const cantidad = Number(o?.cantidad || 1);
        const linea    = Number(o?.tarifa_monto || o?.precio_unitario || 0);
        totalOtrosFull += linea; cantOtrosFull += cantidad;
      }

      // === AL DÍA DE CORTE ===
      const dia = d.getDate();
      if (dia >= from && dia <= to) {
        for (const s of getDetalleMembresias(v)) {
          const cantidad = Number(s?.cantidad || 1);
          const linea    = Number(s?.tarifa_monto || 0);
          totalServ += linea;  cantServ += cantidad;

          if (oKey !== "meta") {
            addTo(byOrigin, oKey, oLabel, linea, cantidad);
          } else {
            metaServTotalCut += linea;
            metaServCantCut  += cantidad;
          }
          addTo(byGroup, group, group.toUpperCase(), linea, cantidad);
        }
        for (const p of getDetalleProductos(v)) {
          const cantidad = Number(p?.cantidad || 1);
          const linea    = Number(p?.tarifa_monto || p?.precio_unitario || 0);
          totalProd += linea;  cantProd += cantidad;
        }
        for (const o of getDetalleOtrosServicios(v)) {
          const cantidad = Number(o?.cantidad || 1);
          const linea    = Number(o?.tarifa_monto || o?.precio_unitario || 0);
          totalOtros += linea; cantOtros += cantidad;
        }
      }
    }

    const ticketServ = cantServ ? totalServ / cantServ : 0;
    const ticketProd = cantProd ? totalProd / cantProd : 0;
    const ticketOtros = cantOtros ? totalOtros / cantOtros : 0;

    const key = `${anio}-${mesAlias}`;
    const mk = dataMktByMonth?.[key] ?? {};
    const por_red = mk?.por_red ?? {};
    const val = (obj, k) => Number(obj?.[k] ?? 0);

    const rawFB = val(por_red, "facebook");
    const rawIG = val(por_red, "instagram");

    let fbShare = 0.5, igShare = 0.5;
    if ((rawFB + rawIG) > 0) {
      fbShare = rawFB / (rawFB + rawIG);
      igShare = 1 - fbShare;
    }

    if (metaServTotalCut > 0) {
      addTo(byOrigin, "facebook",  "FACEBOOK",  metaServTotalCut * fbShare,  metaServCantCut * fbShare);
      addTo(byOrigin, "instagram", "INSTAGRAM", metaServTotalCut * igShare,  metaServCantCut * igShare);
    }
    if (metaServTotalFull > 0) {
      addTo(byOriginFull, "facebook",  "FACEBOOK",  metaServTotalFull * fbShare,  metaServCantFull * fbShare);
      addTo(byOriginFull, "instagram", "INSTAGRAM", metaServTotalFull * igShare,  metaServCantFull * igShare);
    }

    const rawMeta   = val(por_red, "1515") + val(por_red, "meta") + rawFB + rawIG;
    const rawTikTok = val(por_red, "1514") + val(por_red, "tiktok") + val(por_red, "tik tok");

    const invTotalRaw = Number(mk?.inversiones_redes ?? mk?.inversion_redes ?? mk?.inv ?? 0);
    let mkInvUSD = 0, mkInvMetaUSD = 0, mkInvTikTokUSD = 0;
    const sumRaw = rawMeta + rawTikTok;

    if (invTotalRaw > 0 && sumRaw > 0) {
      const shareMeta   = rawMeta / sumRaw;
      const shareTikTok = rawTikTok / sumRaw;
      mkInvUSD       = invTotalRaw;
      mkInvMetaUSD   = mkInvUSD * shareMeta;
      mkInvTikTokUSD = mkInvUSD - mkInvMetaUSD;
    } else if (sumRaw > 0) {
      mkInvUSD       = sumRaw;
      mkInvMetaUSD   = rawMeta;
      mkInvTikTokUSD = rawTikTok;
    } else {
      mkInvUSD       = invTotalRaw;
      mkInvMetaUSD   = 0;
      mkInvTikTokUSD = 0;
    }

    const FX = 3.39;
    const mkInv       = mkInvUSD * FX;
    const mkInvMeta   = mkInvMetaUSD * FX;
    const mkInvTikTok = mkInvTikTokUSD * FX;

    const leads_por_red = mk?.leads_por_red ?? {};
    const clientes_por_red = mk?.clientes_por_red ?? {};
    const sumFrom = (obj, keys) => keys.reduce((a, k) => a + Number(obj?.[k] ?? 0), 0);

    const mkLeadsMeta   = sumFrom(leads_por_red, ["1515","meta","facebook","instagram"]);
    const mkLeadsTikTok = sumFrom(leads_por_red, ["1514","tiktok","tik tok"]);
    const mkLeads       = mkLeadsMeta + mkLeadsTikTok;

    const clientesMeta   = sumFrom(clientes_por_red, ["1515","meta","facebook","instagram"]) || mkLeadsMeta;
    const clientesTikTok = sumFrom(clientes_por_red, ["1514","tiktok","tik tok"]) || mkLeadsTikTok;

    const safeDiv0 = (n, d) => (Number(d) > 0 ? Number(n) / Number(d) : 0);
    const mkCpl        = safeDiv0(mkInv, mkLeads);
    const mkCplMeta    = safeDiv0(mkInvMeta, mkLeadsMeta);
    const mkCplTikTok  = safeDiv0(mkInvTikTok, mkLeadsTikTok);
    const clientesDigitales = Number(mk?.clientes_digitales ?? 0);
    const mkCac            = safeDiv0(mkInv, clientesDigitales);
    const mkCacMetaExact   = safeDiv0(mkInvMeta, clientesMeta);
    const mkCacTikTokExact = safeDiv0(mkInvTikTok, clientesTikTok);

    let ventaMF = 0, cantMF = 0;
    let ventaMFFull = 0, cantMFFull = 0;

    for (const r of reservasMF) {
      if (!r?.flag) continue;
      const d = toLimaDate(r?.fecha || r?.createdAt);
      if (!d) continue;
      if (d.getFullYear() !== Number(anio) || d.getMonth() !== monthIdx) continue;

      const estado = String(r?.estado?.label_param || "").toLowerCase();
      const ok = ["completada","confirmada","pagada","no pagada","reprogramada"]
        .some(e => estado.includes(e));
      if (!ok) continue;

      ventaMFFull += Number(r?.monto_total || 0);
      cantMFFull++;

      const dia = d.getDate();
      if (dia >= from && dia <= to) {
        ventaMF += Number(r?.monto_total || 0);
        cantMF++;
      }
    }

    const ticketMF     = cantMF ? ventaMF / cantMF : 0;
    const ticketMFFull = cantMFFull ? ventaMFFull / cantMFFull : 0;

    const ticketMeta   = byGroup.meta.cant   ? byGroup.meta.total   / byGroup.meta.cant   : 0;
    const ticketTikTok = byGroup.tiktok.cant ? byGroup.tiktok.total / byGroup.tiktok.cant : 0;
    const sharePct = (x) => (totalServ > 0 ? (x / totalServ) * 100 : 0);

    return {
      mkInv, mkInvMeta, mkInvTikTok,
      mkLeads, mkLeadsMeta, mkLeadsTikTok,
      mkCpl, mkCplMeta, mkCplTikTok,
      mkCac, mkCacMeta: mkCacMetaExact, mkCacTikTok: mkCacTikTokExact,

      totalServ, cantServ, ticketServ,
      totalProd, cantProd, ticketProd,
      totalOtros, cantOtros, ticketOtros,
      totalMes: totalServ + totalProd + totalOtros + ventaMF,

      totalServMeta:   byGroup.meta.total,
      cantServMeta:    byGroup.meta.cant,
      ticketServMeta:  ticketMeta,
      pctServMeta:     sharePct(byGroup.meta.total),

      totalServTikTok:  byGroup.tiktok.total,
      cantServTikTok:   byGroup.tiktok.cant,
      ticketServTikTok: ticketTikTok,
      pctServTikTok:    sharePct(byGroup.tiktok.total),

      totalServFull,
      cantServFull,
      ticketServFull: cantServFull ? totalServFull / cantServFull : 0,
      totalProdFull,
      cantProdFull,
      ticketProdFull: cantProdFull ? totalProdFull / cantProdFull : 0,
      totalOtrosFull,
      cantOtrosFull,
      ticketOtrosFull: cantOtrosFull ? totalOtrosFull / cantOtrosFull : 0,
      totalMesFull: totalServFull + totalProdFull + totalOtrosFull + ventaMFFull,

      venta_monkeyfit: ventaMF,
      cantidad_reservas_monkeyfit: cantMF,
      ticket_medio_monkeyfit: ticketMF,
      venta_monkeyfit_full: ventaMFFull,
      cantidad_reservas_monkeyfit_full: cantMFFull,
      ticket_medio_monkeyfit_full: ticketMFFull,

      byOrigin,
      byOriginFull,
    };
  };

  const perMonth = fechas.map((f) => ({
    label: String(f?.label || "").toUpperCase(),
    anio: f?.anio,
    mes: String(f?.mes || "").toLowerCase(),
    metrics: computeMetricsForMonth(f?.anio, f?.mes),
  }));

// % participación para un origen en un mes dado
const participationForMonth = (m, okey) => {
  const totalServ = Number(m.metrics?.totalServ || 0);
  const oTotal    = Number(m.metrics?.byOrigin?.[okey]?.total || 0);
  return totalServ > 0 ? (oTotal / totalServ) : 0;
};

// Score de orden para un origen: usa último mes; si no hay, usa acumulado
const scoreOrigin = (okey) => {
  const last = perMonth[perMonth.length - 1];
  const lastScore = last ? participationForMonth(last, okey) : 0;

  if (lastScore > 0) return lastScore;

  // Fallback: participación acumulada
  const sumOrigin = perMonth.reduce(
    (acc, m) => acc + Number(m.metrics?.byOrigin?.[okey]?.total || 0), 0
  );
  const sumBase = perMonth.reduce(
    (acc, m) => acc + Number(m.metrics?.totalServ || 0), 0
  );
  return sumBase > 0 ? (sumOrigin / sumBase) : 0;
};


  const originKeysAll = Array.from(
    new Set(perMonth.flatMap(m => Object.keys(m.metrics?.byOrigin || {})))
  )
    .filter(k => k !== "meta") 
    .sort();

  const rowsPerOrigin = (okey) => ([
    { key: `o:${okey}:total`,  label: `VENTA MEMBRESÍAS `, type: "money" },
    { key: `o:${okey}:cant`,   label: `CANTIDAD MEMBRESÍAS`, type: "int" },
    { key: `o:${okey}:ticket`, label: `TICKET MEDIO `, type: "money" },
    { key: `o:${okey}:pct`,    label: `% PARTICIPACIÓN `, type: "float2" },
  ]);

  // ======= estilos =======
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
    padding: "16px 12px",
    fontWeight: 700,
    letterSpacing: 0.2,
    fontSize: 27, // TITULO 27px
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
  const sRowRed = {
    background: cRed,
    color: cWhite,
    fontWeight: 800,
  };

  const metasPorMes = {
    enero: 50000, febrero: 50000, marzo: 50000, abril: 55000, mayo: 55000, junio: 60000,
    julio: 60000, agosto: 70000, setiembre: 75000, septiembre: 75000,
    octubre: 85000, noviembre: 85000, diciembre: 85000,
  };

  const TableHead = () => (
    <thead>
      <tr>
        <th className="bg-black" style={{ ...sThLeft, background: cBlack }} />
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
    rowsToRender.map(r => (
      <tr key={r.key + r.label}>
        <td style={{ ...sCellBold, background:"#c00000", color:"#fff", fontWeight:800 }}>
          {r.label}
        </td>

        {perMonth.map((m, idx) => {
          let val = 0;
          let isPctCell = false;

          if (r.key.startsWith("o:")) {
            const [, okey, campo] = r.key.split(":");
            const o = m.metrics?.byOrigin?.[okey];
            if (campo === "total")       val = o?.total ?? 0;
            else if (campo === "cant")   val = o?.cant ?? 0;
            else if (campo === "ticket") val = o?.cant ? o.total/o.cant : 0;
            else if (campo === "pct") {
              const base = m.metrics?.totalServ || 0;
              val = base > 0 ? ((o?.total ?? 0) / base) * 100 : 0;
              isPctCell = true;
            }
          } else {
            val = m.metrics?.[r.key] ?? 0;
          }

          let txt;
          if (isPctCell) {
            txt = `${fmtNum(val, 2)} %`;
          } else {
            txt = r.type === "money" ? fmtMoney(val)
                : r.type === "float2" ? fmtNum(val, 2)
                : fmtNum(val, 0);
          }

          const isLast = idx === perMonth.length - 1;
          return (
            <td
              key={idx}
              style={{
                ...sCell,
                ...(makeLastBold && isLast
                  ? { background: "#c00000", color: "#fff", fontWeight: 700, fontSize: 23 }
                  : {}),
              }}
            >
              {txt}
            </td>
          );
        })}
      </tr>
    ));

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
          />
          {perMonth.map((m, idx) => (
            <th key={idx} style={{ ...sThMes, background: cBlack, color: "#fff", fontSize: 24 }}>
              {m.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {/* VENTA TOTAL al corte */}
        <tr style={{ background: "#000", color: "#fff", fontWeight: 700 }}>
          <td style={{ ...sCellBold, background: "transparent", color: "#fff", fontWeight: 800, fontSize: 18 }}>
            {`VENTA TOTAL AL ${cutDay}`}
          </td>
          {perMonth.map((m, idx) => (
            <td key={idx} style={{ ...sCellBold, background: "transparent", color: "#fff", fontSize: 21 }}>
              {fmtMoney(m.metrics?.totalMes || 0)}
            </td>
          ))}
        </tr>

        {/* CUOTA DEL MES */}
        <tr>
          <td style={{ ...sCellBold, background: cRed, color: "#fff", fontWeight: 800, fontSize: 20 }}>
            CUOTA DEL MES
          </td>
          {perMonth.map((m, idx) => {
            const meta = metasPorMes[m.mes] || 0;
            return (
              <td key={idx} style={{ ...sCell, fontWeight: 700, color: "#000", fontSize: 22 }}>
                {fmtMoney(meta)}
              </td>
            );
          })}
        </tr>

        {/* % ALCANCE DE CUOTA */}
        <tr>
          <td style={{ ...sCellBold, background: cRed, color: "#fff", fontWeight: 800, fontSize: 20 }}>
            % ALCANCE DE CUOTA
          </td>
          {perMonth.map((m, idx) => {
            const meta = metasPorMes[m.mes] || 0;
            const total = m.metrics?.totalMes || 0;
            const alcancePct = meta > 0 ? (total / meta) * 100 : 0;
            const supera = alcancePct >= 100;
            const color = supera ? "#007b00" : cRed;
            return (
              <td key={idx} style={{ ...sCell, fontWeight: 700, color, fontsize: 22 }}>
                {fmtNum(alcancePct, 2)} %
              </td>
            );
          })}
        </tr>

        {/* % RESTANTE PARA CUOTA */}
        <tr>
          <td style={{ ...sCellBold, background: cRed, color: "#fff", fontWeight: 800, fontSize: 19 }}>
            % RESTANTE PARA CUOTA
          </td>
          {perMonth.map((m, idx) => {
            const meta = metasPorMes[m.mes] || 0;
            const total = m.metrics?.totalMes || 0;
            const restantePct = meta > 0 ? Math.max(0, 100 - (total / meta) * 100) : 0;
            const cumple = total >= meta;
            const color = cumple ? "#007b00" : cRed;
            return (
              <td key={idx} style={{ ...sCell, fontWeight: 700, color, fontsize: 22 }}>
                {fmtNum(restantePct, 2)} %
              </td>
            );
          })}
        </tr>

        {/* VENTA TOTAL MES (FULL) */}
        <tr style={sRowRed}>
          <td style={{ ...sCellBold, background: "transparent", color: "#fff", fontWeight: 800, fontSize: 18, textTransform: "uppercase" }}>
            VENTA TOTAL MES
          </td>
          {perMonth.map((m, idx) => (
            <td key={idx} style={{ ...sCellBold, background: "transparent", color: "#fff", fontWeight: 800, fontSize: 22 }}>
              {fmtMoney(m.metrics?.totalMesFull || 0)}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );

const orderedOrigins = [...originKeysAll].sort((a, b) => {
  const diff = scoreOrigin(b) - scoreOrigin(a);
  return Math.abs(diff) > 1e-9 ? diff : a.localeCompare(b);
});


  return (
    <div style={sWrap}>
      {/* === UNA TABLA POR CADA ORIGEN === */}
      {orderedOrigins.length === 0 ? (
        <div style={{ ...sHeader, background: "#444" }}>
          NO HAY ORÍGENES CON DATOS PARA AL {cutDay} DE CADA MES
        </div>
      ) : (
        orderedOrigins.map((okey) => {
          const title = `DETALLE DE VENTAS POR ORIGEN – ${labelFromKey(okey)} AL ${cutDay} DE CADA MES`;
          const LABEL = labelFromKey(okey);
          const rows = rowsPerOrigin(okey, LABEL);

          return (
            <div key={okey} style={{ marginBottom: 24 }}>
              <div style={sHeader}>{title}</div>
              <table style={sTable}>
                <TableHead />
                <tbody>{renderRows(rows)}</tbody>
              </table>
            </div>
          );
        })
      )}

      {/* Cinta VENTA TOTAL MES (full) */}
      <table style={sTable}>
        <thead>
          <tr style={sRowRed}>
            <th style={{ ...sThLeft, background: "transparent", color: cWhite, fontSize: 20 }}>
              VENTA TOTAL <br /> MES
            </th>
            {perMonth.map((m, idx) => (
              <th
                key={idx}
                style={{
                  ...sThMes,
                  background: idx === perMonth.length - 1 ? "#c00000" : "transparent",
                  color: "#fff",
                  fontSize: 24,
                }}
              >
                {fmtMoney(m.metrics?.totalMesFull || 0)}
              </th>
            ))}
          </tr>
          <tr>
            <td style={{ ...sCellBold, background: "#000", color: "#fff", textAlign: "center", fontWeight: 800, fontSize: 18 }} />
            {perMonth.map((m, idx) => (
              <td key={`footer-month-${idx}`} style={{ ...sCellBold, background: "#000", color: "#fff", fontSize: 25, textAlign: "center" }}>
                {m.label}
              </td>
            ))}
          </tr>
        </thead>
      </table>

      <div style={{ height: 32 }} />
      {/* === RESUMEN CUOTA VS VENTAS (INTACTO) === */}
      <div style={{ ...sHeader, fontSize: 24, padding: "12px 16px", background: "#000", textAlign: "center" }}>
        RESUMEN DE CUOTA VS VENTAS
      </div>
      <ResumenCuotaTable />

      <div style={{ height: 32 }} />
      {/* === MARKETING (INTACTO) === */}
      <div style={{ ...sHeader, fontSize: 22, padding: "12px 16px", background: "#c00000", textAlign: "center" }}>
        DETALLE DE INVERSIÓN EN REDES VS RESULTADOS EN LEADS
      </div>
      <table style={sTable}>
        <TableHead />
        <tbody>
          {[
            { key: "mkInv", label: "INVERSIÓN TOTAL REDES", type: "money" },
            { key: "mkLeads", label: "TOTAL LEADS DE META + TIKTOK", type: "int" },
            { key: "mkCpl", label: "COSTO TOTAL POR LEAD DE META + TIKTOK", type: "float2" },
            { key: "mkCac", label: "COSTO ADQUISICION DE CLIENTES", type: "float2" },
            { key: "mkInvMeta", label: "Inversion Meta", type: "money" },
            { key: "mkLeadsMeta", label: "CANTIDAD LEADS  META", type: "int" },
            { key: "mkCplMeta", label: "COSTO POR LEAD META", type: "float2" },
            { key: "mkCacMeta", label: "COSTO ADQUISCION DE CLIENTES META", type: "float2" },
            { key: "mkInvTikTok", label: " Inversion TikTok", type: "money" },
            { key: "mkLeadsTikTok", label: "CANTIDAD LEADS  TIKTOK", type: "int" },
            { key: "mkCplTikTok", label: "COSTO POR LEAD TIKTOK", type: "float2" },
            { key: "mkCacTikTok", label: "COSTO ADQUISICION CLIENTES TIKTOK", type: "float2" },
          ].map(r => (
            <tr key={r.key + r.label}>
              <td style={{ ...sCellBold, background:"#c00000", color:"#fff", fontWeight:800 }}>
                {r.label}
              </td>
              {perMonth.map((m, idx) => {
                const val = m.metrics?.[r.key] ?? 0;
                const txt = r.type === "money" ? fmtMoney(val)
                          : r.type === "float2" ? fmtNum(val, 2)
                          : fmtNum(val, 0);
                const isLast = idx === perMonth.length - 1;
                return (
                  <td key={idx} style={{
                    ...sCell,
                    ...(isLast ? { background: "#c00000", color: "#fff", fontWeight: 700, fontSize: 23 } : {})
                  }}>
                    {txt}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

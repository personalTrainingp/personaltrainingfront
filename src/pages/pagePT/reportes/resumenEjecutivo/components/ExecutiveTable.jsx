import React from "react";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre",
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
  tiktok: new Set(["1514", "695", "tiktok", "tik tok", "tik-tok"]),
  facebook: new Set(["694", "facebook", "fb"]),
  instagram: new Set(["693", "instagram", "ig"]),
  meta: new Set(["1515", "meta"]),
};
const canonicalKeyFromRaw = (originMap, raw) => {
  const rawStr = String(raw ?? "").trim();
  const mapped = originMap?.[rawStr] ??
    originMap?.[Number(rawStr)] ?? rawStr;
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

// =================================================================
// FIN: Funciones de ayuda (Helpers)
// =================================================================


export default function ExecutiveTable({
  ventas = [],
  fechas = [],
  dataMktByMonth = {},
  initialDay = 1,
  cutDay = 21,
  reservasMF = [],
  originMap = {},
}) {

  // ===================== CORE METRICS =====================
  const computeMetricsForMonth = (anio, mesNombre) => {
    const mesAlias = aliasMes(String(mesNombre).toLowerCase());
    const monthIdx = MESES.indexOf(mesAlias);
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
    const byGroup = { meta: { label: "META", total: 0, cant: 0 }, tiktok: { label: "TIKTOK", total: 0, cant: 0 }, otros: { label: "OTROS", total: 0, cant: 0 } };
    const byGroupFull = { meta: { label: "META", total: 0, cant: 0 }, tiktok: { label: "TIKTOK", total: 0, cant: 0 }, otros: { label: "OTROS", total: 0, cant: 0 } };
    let metaServTotalCut = 0, metaServCantCut = 0;
    let metaServTotalFull = 0, metaServCantFull = 0;
    const addTo = (bucket, key, label, linea, cantidad) => {
      if (!bucket[key]) bucket[key] = { label, total: 0, cant: 0 };
      bucket[key].total += Number(linea || 0);
      bucket[key].cant += Number(cantidad || 0);
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

      const oKey = canonicalKeyFromRaw(originMap, rawOrigin);
      const oLabel = labelFromKey(oKey);
      const group = (oKey === "tiktok")
        ?
        "tiktok"
        : (oKey === "facebook" || oKey === "instagram" || oKey === "meta")
          ?
          "meta"
          : "otros";
      // === MES COMPLETO ===
      for (const s of getDetalleMembresias(v)) {
        const cantidad = Number(s?.cantidad || 1);
        const linea = Number(s?.tarifa_monto || 0);
        totalServFull += linea; cantServFull += cantidad;
        if (oKey !== "meta") {
          addTo(byOriginFull, oKey, oLabel, linea, cantidad);
        } else {
          metaServTotalFull += linea;
          metaServCantFull += cantidad;
        }
        addTo(byGroupFull, group, group.toUpperCase(), linea, cantidad);
      }
      for (const p of getDetalleProductos(v)) {
        const cantidad = Number(p?.cantidad || 1);
        const linea = Number(p?.tarifa_monto || p?.precio_unitario || 0);
        totalProdFull += linea; cantProdFull += cantidad;
      }
      for (const o of getDetalleOtrosServicios(v)) {
        const cantidad = Number(o?.cantidad || 1);
        const linea = Number(o?.tarifa_monto || o?.precio_unitario || 0);
        totalOtrosFull += linea; cantOtrosFull += cantidad;
      }

      // === AL DÍA DE CORTE ===
      const dia = d.getDate();
      if (dia >= from && dia <= to) {
        for (const s of getDetalleMembresias(v)) {
          const cantidad = Number(s?.cantidad || 1);
          const linea = Number(s?.tarifa_monto || 0);
          totalServ += linea; cantServ += cantidad;
          if (oKey !== "meta") {
            addTo(byOrigin, oKey, oLabel, linea, cantidad);
          } else {
            metaServTotalCut += linea;
            metaServCantCut += cantidad;
          }
          addTo(byGroup, group, group.toUpperCase(), linea, cantidad);
        }
        for (const p of getDetalleProductos(v)) {
          const cantidad = Number(p?.cantidad || 1);
          const linea = Number(p?.tarifa_monto || p?.precio_unitario || 0);
          totalProd += linea; cantProd += cantidad;
        }
        for (const o of getDetalleOtrosServicios(v)) {
          const cantidad = Number(o?.cantidad || 1);
          const linea = Number(o?.tarifa_monto || o?.precio_unitario || 0);
          totalOtros += linea; cantOtros += cantidad;
        }
      }
    }

    const ticketServ = cantServ ?
      totalServ / cantServ : 0;
    const ticketProd = cantProd ? totalProd / cantProd : 0;
    const ticketOtros = cantOtros ?
      totalOtros / cantOtros : 0;

    const key = `${anio}-${mesAlias}`;
    const mk = dataMktByMonth?.[key] ?? {};
    const por_red = mk?.por_red ??
    {};
    const val = (obj, k) => Number(obj?.[k] ?? 0);

    const rawFB = val(por_red, "facebook");
    const rawIG = val(por_red, "instagram");
    let fbShare = 0.5, igShare = 0.5;
    if ((rawFB + rawIG) > 0) {
      fbShare = rawFB / (rawFB + rawIG);
      igShare = 1 - fbShare;
    }

    if (metaServTotalCut > 0) {
      addTo(byOrigin, "facebook", "FACEBOOK", metaServTotalCut * fbShare, metaServCantCut * fbShare);
      addTo(byOrigin, "instagram", "INSTAGRAM", metaServTotalCut * igShare, metaServCantCut * igShare);
    }
    if (metaServTotalFull > 0) {
      addTo(byOriginFull, "facebook", "FACEBOOK", metaServTotalFull * fbShare, metaServCantFull * fbShare);
      addTo(byOriginFull, "instagram", "INSTAGRAM", metaServTotalFull * igShare, metaServCantFull * igShare);
    }

    const rawMeta = val(por_red, "1515") + val(por_red, "meta") + rawFB + rawIG;
    const rawTikTok = val(por_red, "1514") + val(por_red, "tiktok") + val(por_red, "tik tok");
    const invTotalRaw = Number(mk?.inversiones_redes ?? mk?.inversion_redes ?? mk?.inv ?? 0);
    let mkInvUSD = 0, mkInvMetaUSD = 0, mkInvTikTokUSD = 0;
    const sumRaw = rawMeta + rawTikTok;

    if (invTotalRaw > 0 && sumRaw > 0) {
      const shareMeta = rawMeta / sumRaw;
      const shareTikTok = rawTikTok / sumRaw;
      mkInvUSD = invTotalRaw;
      mkInvMetaUSD = mkInvUSD * shareMeta;
      mkInvTikTokUSD = mkInvUSD - mkInvMetaUSD;
    } else if (sumRaw > 0) {
      mkInvUSD = sumRaw;
      mkInvMetaUSD = rawMeta;
      mkInvTikTokUSD = rawTikTok;
    } else {
      mkInvUSD = invTotalRaw;
      mkInvMetaUSD = 0;
      mkInvTikTokUSD = 0;
    }

    const FX = 3.39;
    const mkInv = mkInvUSD * FX;
    const mkInvMeta = mkInvMetaUSD * FX;
    const mkInvTikTok = mkInvTikTokUSD * FX;

    const leads_por_red = mk?.leads_por_red ?? {};
    const clientes_por_red = mk?.clientes_por_red ?? {};
    const sumFrom = (obj, keys) => keys.reduce((a, k) => a + Number(obj?.[k] ?? 0), 0);
    const mkLeadsMeta = sumFrom(leads_por_red, ["1515", "meta", "facebook", "instagram"]);
    const mkLeadsTikTok = sumFrom(leads_por_red, ["1514", "tiktok", "tik tok"]);
    const mkLeads = mkLeadsMeta + mkLeadsTikTok;

    const clientesMeta = sumFrom(clientes_por_red, ["1515", "meta", "facebook", "instagram"]) || mkLeadsMeta;
    const clientesTikTok = sumFrom(clientes_por_red, ["1514", "tiktok", "tik tok"]) || mkLeadsTikTok;
    const safeDiv0 = (n, d) => (Number(d) > 0 ? Number(n) / Number(d) : 0);
    const mkCpl = safeDiv0(mkInv, mkLeads);
    const mkCplMeta = safeDiv0(mkInvMeta, mkLeadsMeta);
    const mkCplTikTok = safeDiv0(mkInvTikTok, mkLeadsTikTok);
    const clientesDigitales = Number(mk?.clientes_digitales ?? 0);
    const mkCac = safeDiv0(mkInv, clientesDigitales);
    const mkCacMetaExact = safeDiv0(mkInvMeta, clientesMeta);
    const mkCacTikTokExact = safeDiv0(mkInvTikTok, clientesTikTok);
    // === MONKEYFIT (TOTAL y POR PROGRAMA) ===
    let ventaMF = 0, cantMF = 0;
    let ventaMFFull = 0, cantMFFull = 0;
    const mfByProg = {};
    for (const r of reservasMF) {
      if (!r?.flag) continue;

      const d = toLimaDate(r?.fecha || r?.createdAt);
      if (!d) continue;
      if (d.getFullYear() !== Number(anio) || d.getMonth() !== monthIdx) continue;

      const estado = String(r?.estado?.label_param || "").toLowerCase();
      const ok = ["completada", "confirmada", "pagada", "no pagada", "reprogramada"]
        .some(e => estado.includes(e));
      if (!ok) continue;

      const monto = Number(r?.monto_total || 0);
      const pgmId = String(r?.id_pgm || "SIN_PGM");
      if (!mfByProg[pgmId]) {
        mfByProg[pgmId] = { venta: 0, cant: 0, ventaFull: 0, cantFull: 0 };
      }

      // MES COMPLETO
      ventaMFFull += monto;
      cantMFFull++;
      mfByProg[pgmId].ventaFull += monto;
      mfByProg[pgmId].cantFull++;

      // AL CORTE
      const dia = d.getDate();
      if (dia >= from && dia <= to) {
        ventaMF += monto;
        cantMF++;
        mfByProg[pgmId].venta += monto;
        mfByProg[pgmId].cant++;
      }
    }

    const ticketMF = cantMF ?
      ventaMF / cantMF : 0;
    const ticketMFFull = cantMFFull ? ventaMFFull / cantMFFull : 0;

    const ticketMeta = byGroup.meta.cant ?
      byGroup.meta.total / byGroup.meta.cant : 0;
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

      totalServMeta: byGroup.meta.total,
      cantServMeta: byGroup.meta.cant,
      ticketServMeta: ticketMeta,
      pctServMeta:
        sharePct(byGroup.meta.total),

      totalServTikTok: byGroup.tiktok.total,
      cantServTikTok: byGroup.tiktok.cant,
      ticketServTikTok: ticketTikTok,
      pctServTikTok: sharePct(byGroup.tiktok.total),

      totalServFull,
      cantServFull,
      ticketServFull: cantServFull ?
        totalServFull / cantServFull : 0,
      totalProdFull,
      cantProdFull,
      ticketProdFull: cantProdFull ?
        totalProdFull / cantProdFull : 0,
      totalOtrosFull,
      cantOtrosFull,
      ticketOtrosFull: cantOtrosFull ?
        totalOtrosFull / cantOtrosFull : 0,
      totalMesFull: totalServFull + totalProdFull + totalOtrosFull + ventaMFFull,

      // Monkeyfit (total)
      venta_monkeyfit: ventaMF,
      cantidad_reservas_monkeyfit: cantMF,
      ticket_medio_monkeyfit: ticketMF,
      venta_monkeyfit_full: ventaMFFull,
      cantidad_reservas_monkeyfit_full: cantMFFull,
      ticket_medio_monkeyfit_full: ticketMFFull,

      byOrigin,
      byOriginFull,

      // Monkeyfit por programa
      mfByProg,
    };
  };

  // === Config de orden ===
  const usePerOriginMonthOrder = true;
  // const rankMetric = "cant"; // Ya no se usa

  const perMonth = fechas.map((f) => ({
    label: String(f?.label || "").toUpperCase(),
    anio: f?.anio,
    mes: String(f?.mes || "").toLowerCase(),
    metrics: computeMetricsForMonth(f?.anio, f?.mes),
  }));

  const valueForOriginMonth = (okey, m) => {
    // 1. Si la clave es "monkeyfit" (TOTAL), busca en métricas principales
    if (okey === "monkeyfit") {
      // Usa 'cant' como métrica principal para ordenar columnas
      const val = m?.metrics?.cantidad_reservas_monkeyfit; 
      return Number(val || 0);
    }

    // 2. Si la clave es un número (es un pgmId), busca en mfByProg
    if (!isNaN(Number(okey))) {
      const mf = m.metrics?.mfByProg?.[okey];
      if (!mf) return -1;
      const val = mf.cant; // Usa 'cant'
      return Number(val || 0);
    }
    
    // 3. Si no, es un origen normal (ej. "tiktok")
    const o = m?.metrics?.byOrigin?.[okey];
    if (!o) return -1;  
    return Number(o.cant || 0); // Usa 'cant'
  };
  
  const monthOrderForOrigin = (okey) => {
    if (!usePerOriginMonthOrder) return perMonth;

    // 1. Separar el mes actual (el último) de los meses anteriores.
    if (perMonth.length === 0) return [];
    const lastMonth = perMonth[perMonth.length - 1];
    const otherMonths = perMonth.slice(0, perMonth.length - 1);

    // 2. Crear la lista de meses anteriores con su valor para ordenar
    const list = otherMonths.map((m, idx) => ({ m, idx, val: valueForOriginMonth(okey, m) }));
    
    // 3. Comprobar si hay datos para ordenar
    const hasSignal = list.some(x => x.val > 0) || valueForOriginMonth(okey, lastMonth) > 0;
    if (!hasSignal) return perMonth; // Si no hay datos, devolver el orden original

    // 4. Ordenar los meses anteriores de MENOR A MAYOR (a.val - b.val)
    list.sort((a, b) => (a.val - b.val) || (a.idx - b.idx));

    // 5. Devolver los meses anteriores ordenados + el mes actual al final
    return [...list.map(x => x.m), lastMonth];
  };

  // Esta función ya no se usa, la lógica está en .sort()
  // const scoreOrigin = (okey) => { ... };

  const originKeysAll = Array.from(
    new Set(perMonth.flatMap(m => Object.keys(m.metrics?.byOrigin || {})))
  )
    .filter(k => k !== "meta")
    .sort();
  const rowsPerOrigin = (okey) => ([
    { key: `o:${okey}:total`, label: `VENTA MEMBRESÍAS `, type: "money" },
    { key: `o:${okey}:cant`, label: `CANTIDAD MEMBRESÍAS`, type: "int" },
    { key: `o:${okey}:ticket`, label: `TICKET MEDIO `, type: "money" },
    { key: `o:${okey}:pct`, label: `% PARTICIPACIÓN `, type: "float2" },
  ]);
  // === MONKEYFIT POR PROGRAMA ===
  const PGM_LABEL = {
    2: "CHANGE 45",
    3: "FS 45",
    4: "FISIO MUSCLE",
    5: "VERTIKAL CHANGE",
  };
  const labelPgm = (id) => PGM_LABEL[id] || `PGM ${id}`;

  const mfProgramKeys = Array.from(
    new Set(perMonth.flatMap(m => Object.keys(m.metrics?.mfByProg || {})))
  ).sort();
  const rowsMFByProg = (pgmId) => ([
    { key: `mf:${pgmId}:venta`, label: "VENTA ", type: "money" },
    { key: `mf:${pgmId}:cant`, label: " RESERVAS", type: "int" },
    { key: `mf:${pgmId}:ticket`, label: "TICKET MEDIO", type: "money" },
    { key: `mf:${pgmId}:ventaF`, label: "VENTA  MES COMPLETO", type: "money" },
    { key: `mf:${pgmId}:cantF`, label: " RESERVAS MES COMPLETO", type: "int" },
    { key: `mf:${pgmId}:ticketF`, label: "TICKET MEDIO MES COMPLETO", type: "money" },
  ]);
  // === estilos ===
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
    background: cRed,
    color: cWhite,
    textAlign: "center",
    padding: "16px 12px",
    fontWeight: 700,
    letterSpacing: 0.2,
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
  };
  const sThLeft = { ...sThMes, textAlign: "center", width: 260 };
  const sCell = {
    border,
    padding: "8px 10px",
    background: cWhite,
    fontSize: 28,
    textAlign: "center",
  };
  const sCellBold = {
    border,
    padding: "8px 10px",
    background: cWhite,
    fontWeight: 700,
    fontSize: 28,
    textAlign: "center",
  };
  const sRowRed = {
    background: cRed,
    color: cWhite,
    fontWeight: 800,
  };
  const metasPorMes = {
    enero: 50000, febrero: 50000, marzo: 50000, abril: 55000, mayo: 55000, junio: 60000,
    julio: 60000, agosto: 70000, setiembre: 75000, septiembre: 75000,
    octubre: 85000, noviembre: 90000, diciembre: 85000,
  };
  const TableHeadFor = ({ okey }) => {
    const months = monthOrderForOrigin(okey);
    return (
      <thead>
        <tr>
          <th style={{ ...sThLeft, background: cBlack }} />
          {months.map((m, idx) => (
            <th key={`${okey}-h-${idx}`} style={{ ...sThMes, background: cBlack }}>
              <div>{m.label}</div>
            </th>
          ))}
  
        </tr>
      </thead>
    );
  };
  const renderRowsFor = (okey, rowsToRender) => {
    const months = monthOrderForOrigin(okey);
    return rowsToRender.map(r => (
      <tr key={r.key + r.label}>
        <td style={{ ...sCellBold, background: "#c00000", color: "#fff", fontWeight: 800 }}>
          {r.label}
        </td>
        {months.map((m, idx) => {
          let val = 0, isPct = false;

          if (okey === "monkeyfit") {
            
            val = m.metrics?.[r.key] ?? 0;

          } else if (!isNaN(Number(okey))) {
            const [, pgmId, campo] = r.key.split(":"); 
            const mf = m.metrics?.mfByProg?.[pgmId] || {};
            if (campo === "venta") val = mf.venta ?? 0;
            else if (campo === "cant") val = mf.cant ?? 0;
      
            else if (campo === "ticket") val = mf.cant ? mf.venta / mf.cant : 0;
            else if (campo === "ventaF") val = mf.ventaFull ?? 0;
            else if (campo === "cantF") val = mf.cantFull ?? 0;
            else if (campo === "ticketF") val = mf.cantFull ? mf.ventaFull / mf.cantFull : 0;

          } else {
  
            // 3. Clave es Origen (ej.
            // "tiktok")
            if (r.key.startsWith("o:")) {
              const [, _ok, campo] = r.key.split(":");
              const o = m.metrics?.byOrigin?.[_ok];
              if (campo === "total") val = o?.total ?? 0;
              else if (campo === "cant") val = o?.cant ?? 0;
              else if (campo === "ticket") val = o?.cant ?
                o.total / o.cant : 0;
              else if (campo === "pct") {
                const base = m.metrics?.totalServ ||
                  0;
                val = base > 0 ? ((o?.total ?? 0) / base) * 100 : 0;
                isPct = true;
              }
            } else {
              val = m.metrics?.[r.key] ??
                0;
            }
          }
          // FIN DE LA MODIFICACIÓN

          const txt = isPct
            ?
            `${fmtNum(val, 2)} %`
            : r.type === "money" ?
              fmtMoney(val)
              : r.type === "float2" ?
                fmtNum(val, 2)
                : fmtNum(val, 0);
          const isBest = idx === months.length - 1; // El último mes ahora es el "seleccionado"
          return (
            <td
              key={`${okey}-c-${r.key}-${idx}`}
              style={{
                ...sCell,
                // Aplica estilo rojo a la última columna (mes seleccionado)
                ...(isBest ? { background: "#c00000", color: "#fff", fontWeight: 700, fontSize: 28 } : {})
      
              }}
            >
              {txt}
            </td>
          );
        })}
      </tr>
    ));
  };
  // Esta función (renderRows) la usa la tabla de Marketing
  // La extendemos para que también entienda "mf:"
  const renderRows = (rowsToRender, makeLastBold = true) =>
    rowsToRender.map(r => (
      <tr key={r.key + r.label}>
        <td style={{ ...sCellBold, background: "#c00000", color: "#fff", fontWeight: 800 }}>
          {r.label}
        </td>

        {perMonth.map((m, idx) => {
          let val 
            = 0;
          let isPctCell = false;

          if (r.key.startsWith("o:")) {
            const [, okey, campo] = r.key.split(":");
            const o = m.metrics?.byOrigin?.[okey];
            if (campo === "total") val = o?.total ?? 0;
            else if (campo === "cant") val = o?.cant ?? 0;
 
            else if (campo === "ticket") val = o?.cant ? o.total / o.cant : 0;
            else if (campo === "pct") {
              const base = m.metrics?.totalServ || 0;
              val = base > 0 ? ((o?.total ?? 0) / base) * 100 : 0;
            
              isPctCell = true;
            }
          } else if (r.key.startsWith("mf:")) { // <-- AÑADIDO
            const [, pgmId, campo] = r.key.split(":");
            const mf = m.metrics?.mfByProg?.[pgmId] || {};
            if (campo === "venta") val = mf.venta ?? 0;
            else if (campo === "cant") val = mf.cant ?? 0;
            else if (campo === "ticket") val = mf.cant ?
              mf.venta / mf.cant : 0;
            else if (campo === "ventaF") val = mf.ventaFull ?? 0;
            else if (campo === "cantF") val = mf.cantFull ?? 0;
            else if (campo === "ticketF") val = mf.cantFull ?
              mf.ventaFull / mf.cantFull : 0;
          } else {
            val = m.metrics?.[r.key] ??
              0;
          }

          const txt = isPctCell
            ?
            `${fmtNum(val, 2)} %`
            : r.type === "money" ?
              fmtMoney(val)
              : r.type === "float2" ?
                fmtNum(val, 2)
                : fmtNum(val, 0);
          const isLast = idx === perMonth.length - 1;
          return (
            <td
              key={idx}
              style={{
                ...sCell,
                ...(makeLastBold && isLast
                 
                  ? { background: "#c00000", color: "#fff", fontWeight: 700, fontSize: 28 }
                  : {}),
              }}
            >
              {txt}
            </td>
          );
        })}
      </tr>
    ));
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
                background: isLast ? "#000" : cBlack, // Mantenemos el fondo negro para el header
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
  {/* === 3. CUOTA DEL MES === */}
  <tr>
    <td style={{ ...sCellBold, background: cRed, color: "#fff", fontWeight: 800, fontSize: 20 }}>
      CUOTA DEL MES
    </td>
    {perMonth.map((m, idx) => {
      const meta = metasPorMes[m.mes] || 0;
      return (
        <td key={idx} style={{ ...sCell, fontWeight: 700, color: "#000" }}>
          {fmtMoney(meta)}
        </td>
      );
    })}
  </tr>
<tr>
    <td style={{ ...sCellBold, background: cRed, color: "#fff", fontWeight: 800, fontSize: 20 }}>
      MONTO RESTANTE DE CUOTA
    </td>
    {perMonth.map((m, idx) => {
      const meta = metasPorMes[m.mes] || 0;
      const total = m.metrics?.totalMes || 0;
      const restante = meta - total; // positivo = déficit, negativo = superávit
      const esSurplus = restante < 0;
      const color = esSurplus ? "#007b00" : "#c00000";
      const prefix = esSurplus ? "+" : "-";
      const moneyStr = fmtNum(Math.abs(restante), 2);
      return (
        <td key={idx} style={{ ...sCellBold, fontWeight: 700, color }}>
          {prefix} S/ {moneyStr}
        </td>
      );
    })}
  </tr>
 <tr>
    <td style={{ ...sCellBold, background: cRed, color: "#fff", fontWeight: 800, fontSize: 20 }}>
      % RESTANTE PARA CUOTA
    </td>
    {perMonth.map((m, idx) => {
      const meta = metasPorMes[m.mes] || 0;
      const total = m.metrics?.totalMes || 0;
      const alcancePct = meta > 0 ? (total / meta) * 100 : 0;
      const restantePct = 100 - alcancePct;
      const cumple = restantePct <= 0; // 0 o negativo = cumplido
      const color = cumple ? "#007b00" : "#c00000";
      const prefix = cumple ? "+" : "-";
      const valAbs = Math.abs(restantePct);
      return (
        <td key={idx} style={{ ...sCell, fontWeight: 700, color }}>
          {prefix} {fmtNum(valAbs, 2)} %
        </td>
      );
    })}
  </tr>
  {/* === 4. MONTO DE AVANCE DE CUOTA === */}
  <tr>
    <td style={{ ...sCellBold, background: cRed, color: "#fff", fontWeight: 800, fontSize: 20 }}>
      MONTO DE AVANCE DE CUOTA
    </td>
    {perMonth.map((m, idx) => {
      const meta = metasPorMes[m.mes] || 0;
      const total = m.metrics?.totalMes || 0;
      const avanceSoles = Math.min(meta, total);
      return (
        <td key={idx} style={{ ...sCellBold, fontWeight: 700 }}>
           {fmtMoney(avanceSoles)}
        </td>
      );
    })}
  </tr>
  
<tr>
    <td style={{ ...sCellBold, background: cRed, color: "#fff", fontWeight: 800, fontSize: 20 }}>
      % ALCANCE DE CUOTA
    </td>
    {perMonth.map((m, idx) => {
      const meta = metasPorMes[m.mes] || 0;
      const total = m.metrics?.totalMes || 0;
      const alcancePct = meta > 0 ? (total / meta) * 100 : 0;
      const supera = alcancePct >= 100;
      const color = supera ? "#007b00" : "#c00000";
      const prefix = supera ? "+" : "-";
      return (
        <td key={idx} style={{ ...sCell, fontWeight: 700, color }}>
          {prefix} {fmtNum(Math.abs(alcancePct), 2)} %
        </td>
      );
    })}
  </tr>

  {/* === 7. % RESTANTE PARA CUOTA === */}
 
<tr style={{ background: "#000", color: "#fff", fontWeight: 700 }}>
    <td style={{ ...sCellBold, background: "transparent", color: "#fff", fontWeight: 800 }}>
      {`VENTA TOTAL AL ${cutDay}`}
    </td>
    {perMonth.map((m, idx) => (
      <td key={idx} style={{ ...sCellBold, background: "transparent", color: "#fff" }}>
        {fmtMoney(m.metrics?.totalMes || 0)}
      </td>
    ))}
  </tr>
   {/* === 2. VENTA TOTAL MES (FULL) === */}
  <tr style={sRowRed}>
    <td style={{ ...sCellBold, background: "transparent", color: "#fff", fontWeight: 800 }}>
      VENTA TOTAL MES
    </td>
    {perMonth.map((m, idx) => (
      <td key={idx} style={{ ...sCellBold, background: "transparent", color: "#fff", fontWeight: 800 }}>
        {fmtMoney(m.metrics?.totalMesFull || 0)}
      </td>
    ))}
  </tr>
</tbody>

    </table>
  );
  
  const otherMonths = perMonth.slice(0, perMonth.length - 1);
  const lastMonth = perMonth.length > 0 ? perMonth[perMonth.length - 1] : null;

  const orderedOrigins = [...originKeysAll].sort((a, b) => {
    const lastA = Number(lastMonth?.metrics?.byOrigin?.[a]?.cant || 0);
    const lastB = Number(lastMonth?.metrics?.byOrigin?.[b]?.cant || 0);

    if (lastA > lastB) return -1;
    if (lastA < lastB) return 1;

    const fallbackA = otherMonths.reduce((acc, m) => acc + Number(m.metrics?.byOrigin?.[a]?.cant || 0), 0);
    const fallbackB = otherMonths.reduce((acc, m) => acc + Number(m.metrics?.byOrigin?.[b]?.cant || 0), 0);
    
    if (fallbackA > fallbackB) return -1;
    if (fallbackA < fallbackB) return 1;

    // 4. Desempate final: alfabético
    return a.localeCompare(b);
  });
  
  const orderedMFPrograms = [...mfProgramKeys].sort((a, b) => {
    // 1. Obtener puntaje del último mes (Cantidad)
    const lastValA = lastMonth?.metrics?.mfByProg?.[a];
    const lastValB = lastMonth?.metrics?.mfByProg?.[b];
    const lastA = Number(lastValA?.cant || 0);
    const lastB = Number(lastValB?.cant || 0);

    // 2. Criterio principal: Ordenar por puntaje del último mes (descendente)
    if (lastA > lastB) return -1;
    if (lastA < lastB) return 1;

    // 3. Criterio de desempate: Usar suma de meses anteriores (descendente)
    const fallbackA = otherMonths.reduce((acc, m) => acc + Number(m.metrics?.mfByProg?.[a]?.cant || 0), 0);
    const fallbackB = otherMonths.reduce((acc, m) => acc + Number(m.metrics?.mfByProg?.[b]?.cant || 0), 0);

    if (fallbackA > fallbackB) return -1;
    if (fallbackA < fallbackB) return 1;
    
    // 4. Desempate final: alfabético
    return a.localeCompare(b);
  });
  // === FIN DEL CAMBIO ===


  return (
    <div style={sWrap}>
      {/* === UNA TABLA POR CADA ORIGEN === */}
      {orderedOrigins.length === 0 ? (
        <div style={{ ...sHeader, background: "#444" }}>
          NO HAY ORÍGENES CON DATOS PARA AL {cutDay} DE CADA MES
        </div>
      ) : (
        orderedOrigins.map((okey) => {
          const 
            title = ` ${labelFromKey(okey)} `;
          const rows = rowsPerOrigin(okey);
          return (
            <div key={okey} style={{ marginBottom: 24 }}>
              <div style={sHeader}>{title}</div>
              <table style={sTable}>
                <TableHeadFor okey={okey} />
       
                <tbody>{renderRowsFor(okey, rows)}</tbody>
              </table>
            </div>
          );
        })
      )}

      {/* === MONKEYFIT POR PROGRAMA === */}
      <div className="bg-black" style={{ ...sHeader }}>MONKEYFIT POR PROGRAMA</div>
      {orderedMFPrograms.length === 0 ? (
       
        <div style={{ ...sHeader, background: "#444" }}>
          SIN RESERVAS MONKEYFIT EN EL PERIODO
        </div>
      ) : (
        orderedMFPrograms.map((pgmId) => (
          <div key={`mf-${pgmId}`} style={{ marginBottom: 24 }}>
            <div style={sHeader}>{` ${labelPgm(pgmId)}`}</div>
            <table style={sTable}>

          
              <TableHeadFor okey={pgmId} />
              <tbody>{renderRowsFor(pgmId, rowsMFByProg(pgmId))}</tbody>
            </table>
          </div>
        ))
      )}

      <div style={{ ...sHeader }}>MONKEYFIT (TOTAL)</div>
      <table style={sTable}>
        <TableHeadFor okey="monkeyfit" />
        <tbody>
        
          {renderRowsFor("monkeyfit", [
            { key: "venta_monkeyfit", label: "VENTA  AL CORTE", type: "money" },
            { key: "cantidad_reservas_monkeyfit", label: "CANTIDAD RESERVAS  AL CORTE", type: "int" },
            { key: "ticket_medio_monkeyfit", label: "TICKET MEDIO  AL CORTE", type: "money" },
            { key: "venta_monkeyfit_full", label: "VENTA  MES COMPLETO", type: "money" },       
            { key: "cantidad_reservas_monkeyfit_full", label: "CANTIDAD RESERVAS  MES COMPLETO", type: "int" },
            { key: "ticket_medio_monkeyfit_full", label: "TICKET MEDIO  MES COMPLETO", type: "money" },
          ])}
        </tbody>
      </table>

      <div style={{ height: 32 }} />

      <div
        style={{
          ...sHeader,
          fontSize: 28,
          padding: "12px 16px",
          background: cRed,
          textAlign: "center",
        }}
      >
        RESUMEN DE CUOTA VS VENTAS
      </div>
      <ResumenCuotaTable />

      <div style={{ height: 32 }} />

      {/* === MARKETING === */}
      <div
        style={{
          ...sHeader,
          fontSize: 28,
          padding: "12px 16px",
          textAlign: "center",
        }}
      >
        DETALLE DE INVERSIÓN EN REDES VS RESULTADOS EN LEADS
      </div>

   
      <table style={sTable}>
        <TableHead />
        <tbody>
          {[
            { key: "mkInv", label: "INVERSIÓN TOTAL REDES", type: "money" },
            { key: "mkLeads", label: "TOTAL LEADS DE META + TIKTOK", type: "int" },
            { key: "mkCpl", label: "COSTO TOTAL POR LEAD DE META + TIKTOK", 
              type: "float2" },
            { key: "mkCac", label: "COSTO ADQUISICION DE CLIENTES", type: "float2" },
            { key: "mkInvMeta", label: "Inversion Meta", type: "money" },
            { key: "mkLeadsMeta", label: "CANTIDAD LEADS  META", type: "int" },
            { key: "mkCplMeta", label: "COSTO POR LEAD META", type: "float2" },
            
            { key: "mkCacMeta", label: "COSTO ADQUISICION DE CLIENTES META", type: "float2" },
            { key: "mkInvTikTok", label: "Inversion TikTok", type: "money" },
            { key: "mkLeadsTikTok", label: "CANTIDAD LEADS  TIKTOK", type: "int" },
            { key: "mkCplTikTok", label: "COSTO POR LEAD TIKTOK", type: "float2" },
            { key: "mkCacTikTok", label: "COSTO ADQUISICION CLIENTES TIKTOK", type: "float2" },
   
          ].map((r, i) => (
            <tr
              key={r.key + r.label}
              style={{
                borderBottom:
                  (i + 1) % 4 === 0 ?
                    "8px solid #000" : "1px solid #000",
              }}
            >
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
                const txt =
                  r.type === "money"
                    ? fmtMoney(val)
      
                    : r.type === "float2"
                      ? fmtNum(val, 2)
                      : fmtNum(val, 0);
                const isLast = idx === perMonth.length - 1;

            
                return (
                  <td
                    key={idx}
                    style={{
                      ...sCell,
               
                      ...(isLast
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
          ))}

          {/* === FILA TOTAL MES === */}
          <tr style={sRowRed}>
            <th
              style={{
                ...sThLeft,
         
                background: "transparent",
                color: cWhite,
              }}
            >
              VENTA TOTAL <br /> MES
            </th>
            {perMonth.map((m, idx) => (
    
              <th
                key={idx}
                style={{
                  ...sThMes,
                  background: idx === perMonth.length - 1 ? "#c00000" : "transparent",
             
                  color: "#fff",
                  fontSize: 28,
                }}
              >
                {fmtMoney(m.metrics?.totalMesFull || 0)}
              </th>
            ))}
 
          </tr>

          {/* === FILA DE MESES === */}
          <tr>
            <td
              style={{
                ...sCellBold,
                background: "#c00000",
      
                color: "#fff",
                fontWeight: 800,
                fontSize: 24,
              }}
            >
              MESES
            </td>

   
            {perMonth.map((m, idx) => (
              <td
                key={`mes-${m.label}`}
                style={{
                  background: "#c00000",
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
}
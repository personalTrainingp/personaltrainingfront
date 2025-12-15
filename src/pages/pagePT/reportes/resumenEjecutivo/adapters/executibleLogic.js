const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre",
];

export const aliasMes = (m) => {
  const mes = String(m || "").toLowerCase().trim();
  return mes === "septiembre" ? "setiembre" : mes;
};

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

export const getMonthIndex = (m) => MESES.indexOf(aliasMes(m));

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export const fmtMoney = (n) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" })
    .format(Number(n || 0));

export const fmtNum = (n, d = 0) =>
  new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(Number(n || 0));

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
  const mapped =
    originMap?.[rawStr] ??
    originMap?.[Number(rawStr)] ??
    rawStr;

  const low = String(mapped).trim().toLowerCase();
  for (const [key, set] of Object.entries(ORIGIN_SYNONYMS)) {
    if (
      set.has(low) ||
      set.has(rawStr.toLowerCase()) ||
      set.has(String(raw).toLowerCase())
    ) {
      return key;
    }
  }
  return low.replace(/\s+/g, "_");
};

export const labelFromKey = (key) => {
  if (key === "tiktok") return "TIKTOK";
  if (key === "facebook") return "FACEBOOK";
  if (key === "instagram") return "INSTAGRAM";
  if (key === "meta") return "META (FB+IG)";
  return String(key || "OTROS").replace(/_/g, " ").toUpperCase();
};

export function computeMetricsForMonth({
  ventas,
  reservasMF,
  dataMktByMonth,
  originMap,
  initialDay,
  cutDay,
  tasaCambio,
  anio,
  mesNombre,
}) {
  // Normalizamos siempre el nombre del mes
  const mesAlias = aliasMes(mesNombre);
  const monthIdx = MESES.indexOf(mesAlias);
  if (monthIdx < 0) return null;

  let totalServ = 0, cantServ = 0;
  let totalProd = 0, cantProd = 0;
  let totalOtros = 0, cantOtros = 0;

  let totalServFull = 0, cantServFull = 0;
  let totalProdFull = 0, cantProdFull = 0;
  let totalOtrosFull = 0, cantOtrosFull = 0;

  const byOrigin = {};
  const byOriginFull = {};

  const byGroup = {
    meta: { label: "META", total: 0, cant: 0 },
    tiktok: { label: "TIKTOK", total: 0, cant: 0 },
    otros: { label: "OTROS", total: 0, cant: 0 },
  };
  const byGroupFull = {
    meta: { label: "META", total: 0, cant: 0 },
    tiktok: { label: "TIKTOK", total: 0, cant: 0 },
    otros: { label: "OTROS", total: 0, cant: 0 },
  };

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

  // ================== RECORRER VENTAS ==================
  for (const v of ventas) {
    const d = toLimaDate(v?.fecha_venta || v?.fecha || v?.createdAt);
    if (!d) continue;
    if (d.getFullYear() !== Number(anio) || d.getMonth() !== monthIdx) continue;

    const rawOrigin =
      v?.id_origen ??
      v?.parametro_origen?.id_param ??
      v?.origen ??
      v?.source ??
      v?.canal ??
      v?.parametro_origen?.label_param;

    const oKey = canonicalKeyFromRaw(originMap, rawOrigin);
    const oLabel = labelFromKey(oKey);

    const group =
      oKey === "tiktok"
        ? "tiktok"
        : (oKey === "facebook" || oKey === "instagram" || oKey === "meta")
          ? "meta"
          : "otros";

    // ---- MES COMPLETO ----
    for (const s of getDetalleMembresias(v)) {
      const cantidad = Number(s?.cantidad || 1);
      const linea = Number(s?.tarifa_monto || 0);
      totalServFull += linea;
      cantServFull += cantidad;

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
      totalProdFull += linea;
      cantProdFull += cantidad;
    }

    for (const o of getDetalleOtrosServicios(v)) {
      const cantidad = Number(o?.cantidad || 1);
      const linea = Number(o?.tarifa_monto || o?.precio_unitario || 0);
      totalOtrosFull += linea;
      cantOtrosFull += cantidad;
    }

    // ---- AL CORTE ----
    const dia = d.getDate();
    if (dia >= from && dia <= to) {
      for (const s of getDetalleMembresias(v)) {
        const cantidad = Number(s?.cantidad || 1);
        const linea = Number(s?.tarifa_monto || 0);
        totalServ += linea;
        cantServ += cantidad;

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
        totalProd += linea;
        cantProd += cantidad;
      }

      for (const o of getDetalleOtrosServicios(v)) {
        const cantidad = Number(o?.cantidad || 1);
        const linea = Number(o?.tarifa_monto || o?.precio_unitario || 0);
        totalOtros += linea;
        cantOtros += cantidad;
      }
    }
  }

  const ticketServ = cantServ ? totalServ / cantServ : 0;
  const ticketProd = cantProd ? totalProd / cantProd : 0;
  const ticketOtros = cantOtros ? totalOtros / cantOtros : 0;

  // ================== MARKETING (dataMktByMonth) ==================
  const keyBase = `${anio}-${mesAlias}`;              // 2025-setiembre
  const keyAlt = mesAlias === "setiembre"
    ? `${anio}-septiembre`                            // por si tu JSON viene así
    : keyBase;

  const mk = dataMktByMonth?.[keyBase] ?? dataMktByMonth?.[keyAlt] ?? {};
  const por_red = mk?.por_red ?? {};
  const val = (obj, k) => Number(obj?.[k] ?? 0);

  const rawFB = val(por_red, "facebook");
  const rawIG = val(por_red, "instagram");

  let fbShare = 0.5, igShare = 0.5;
  if (rawFB + rawIG > 0) {
    fbShare = rawFB / (rawFB + rawIG);
    igShare = 1 - fbShare;
  }

  // Reparto META -> FB/IG (corte)
  if (metaServTotalCut > 0) {
    const linea = metaServTotalCut;
    const cant = metaServCantCut;
    const fbVal = linea * fbShare;
    const igVal = linea * igShare;
    const fbCant = cant * fbShare;
    const igCant = cant * igShare;

    if (!byOrigin["facebook"])
      byOrigin["facebook"] = { label: "FACEBOOK", total: 0, cant: 0 };
    if (!byOrigin["instagram"])
      byOrigin["instagram"] = { label: "INSTAGRAM", total: 0, cant: 0 };

    byOrigin["facebook"].total += fbVal;
    byOrigin["facebook"].cant += fbCant;
    byOrigin["instagram"].total += igVal;
    byOrigin["instagram"].cant += igCant;
  }

  // Reparto META -> FB/IG (mes completo)
  if (metaServTotalFull > 0) {
    const linea = metaServTotalFull;
    const cant = metaServCantFull;
    const fbVal = linea * fbShare;
    const igVal = linea * igShare;
    const fbCant = cant * fbShare;
    const igCant = cant * igShare;

    if (!byOriginFull["facebook"])
      byOriginFull["facebook"] = { label: "FACEBOOK", total: 0, cant: 0 };
    if (!byOriginFull["instagram"])
      byOriginFull["instagram"] = { label: "INSTAGRAM", total: 0, cant: 0 };

    byOriginFull["facebook"].total += fbVal;
    byOriginFull["facebook"].cant += fbCant;
    byOriginFull["instagram"].total += igVal;
    byOriginFull["instagram"].cant += igCant;
  }

  const rawMeta =
    val(por_red, "1515") +
    val(por_red, "meta") +
    rawFB +
    rawIG;

  const rawTikTok =
    val(por_red, "1514") +
    val(por_red, "tiktok") +
    val(por_red, "tik tok") +
    val(por_red, "tik-tok") +
    val(por_red, "695");

  const invTotalRaw = Number(
    mk?.inversiones_redes ?? mk?.inversion_redes ?? mk?.inv ?? 0
  );

  let mkInvUSD = 0, mkInvMetaUSD = 0, mkInvTikTokUSD = 0;
  const sumRaw = rawMeta + rawTikTok;

  if (sumRaw > 0) {
    const shareMeta = rawMeta / sumRaw;
    const shareTikTok = rawTikTok / sumRaw;
    mkInvUSD = sumRaw;
    mkInvMetaUSD = mkInvUSD * shareMeta;
    mkInvTikTokUSD = mkInvUSD * shareTikTok;
  } else if (invTotalRaw > 0) {
    mkInvUSD = invTotalRaw;
    mkInvMetaUSD = rawMeta;
    mkInvTikTokUSD = rawTikTok;
  } else {
    mkInvUSD = invTotalRaw;
    mkInvMetaUSD = 0;
    mkInvTikTokUSD = 0;
  }

  const mkInvMeta = mkInvMetaUSD;
  const mkInvTikTok = mkInvTikTokUSD;
  const mkInv = (mkInvMeta * Number(tasaCambio || 3.37));

  const leads_por_red = mk?.leads_por_red ?? {};
  const clientes_por_red = mk?.clientes_por_red ?? {};

  const sumFrom = (obj, keys) =>
    keys.reduce((a, k) => a + Number(obj?.[k] ?? 0), 0);

  const mkLeadsMeta = sumFrom(leads_por_red, ["1515", "meta", "facebook", "instagram"]);
  const mkLeadsTikTok = sumFrom(leads_por_red, ["1514", "tiktok", "tik tok"]);
  const mkLeads = mkLeadsMeta + mkLeadsTikTok;

  const clientesMeta =
    sumFrom(clientes_por_red, ["1515", "meta", "facebook", "instagram"]) || mkLeadsMeta;
  const clientesTikTok =
    sumFrom(clientes_por_red, ["1514", "tiktok", "tik tok"]) || mkLeadsTikTok;

  const safeDiv0 = (n, d) => (Number(d) > 0 ? Number(n) / Number(d) : 0);

  const mkCpl = safeDiv0(mkInv, mkLeads);
  const mkCplMeta = safeDiv0(mkInvMeta, mkLeadsMeta);
  const mkCplTikTok = safeDiv0(mkInvTikTok, mkLeadsTikTok);

  const clientesDigitales = Number(mk?.clientes_digitales ?? 0);
  const mkCac = safeDiv0(mkInv, clientesDigitales);
  const mkCacMetaExact = safeDiv0(mkInvMeta, clientesMeta);
  const mkCacTikTokExact = safeDiv0(mkInvTikTok, clientesTikTok);

  // ============ MONKEYFIT ============
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

  const ticketMF = cantMF ? ventaMF / cantMF : 0;
  const ticketMFFull = cantMFFull ? ventaMFFull / cantMFFull : 0;

  const ticketMeta = byGroup.meta.cant
    ? byGroup.meta.total / byGroup.meta.cant
    : 0;
  const ticketTikTok = byGroup.tiktok.cant
    ? byGroup.tiktok.total / byGroup.tiktok.cant
    : 0;

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
    pctServMeta: sharePct(byGroup.meta.total),

    totalServTikTok: byGroup.tiktok.total,
    cantServTikTok: byGroup.tiktok.cant,
    ticketServTikTok: ticketTikTok,
    pctServTikTok: sharePct(byGroup.tiktok.total),

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
    mfByProg,
  };
}

const ORIGINS_EXCLUIR = new Set([
  "1470",
  "689",
  "687",
  "688",
  "697",
  "698",
  "corporativos_bbva",
  "corporativos bbva",
  "wsp organico",
]);

export function getAvailableMonthsFromVentas(ventas) {
  const map = new Map();

  ventas.forEach((v) => {
    const d = toLimaDate(v?.fecha_venta || v?.fecha);
    if (!d) return;
    const anio = d.getFullYear();
    const mesIdx = d.getMonth(); // 0-11
    const mesNombre = MESES[mesIdx]; // minúsculas
    const mesNorm = aliasMes(mesNombre); // por si acaso

    const label = `${mesNorm.toUpperCase()} ${anio}`; // Ej: SETIEMBRE 2025
    const key = `${anio}-${mesNorm}`; // Identificador único

    if (!map.has(key)) {
      map.set(key, {
        key,
        label,
        anio,
        mes: mesNorm,
        dateObj: d,
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => b.dateObj - a.dateObj);
}

// === FUNCIÓN PRINCIPAL PARA LA VISTA ===
export function buildExecutiveTableData({
  ventas = [],
  fechas = [],
  dataMktByMonth = {},
  initialDay = 1,
  cutDay = 21,
  reservasMF = [],
  originMap = {},
  selectedMonth, // Entero 1-12 (modo viejo)
  tasaCambio = 3.37,
  baseKey = null, // "2025-setiembre" cuando queremos modo TOP por origen
}) {
  let selectedMonthKey = null; // "setiembre"
  let selectedMonthName = "";
  let selectedYear = null;

  if (baseKey) {
    const [yStr, mesStr] = String(baseKey).split("-");
    selectedYear = yStr ? Number(yStr) : null;
    const mesNorm = aliasMes(mesStr);
    selectedMonthKey = mesNorm;
    selectedMonthName = [mesNorm.toUpperCase(), yStr].filter(Boolean).join(" ");
  } else if (
    typeof selectedMonth === "number" &&
    selectedMonth >= 1 &&
    selectedMonth <= 12
  ) {
    const uiName = MESES[selectedMonth - 1];
    selectedMonthKey = aliasMes(uiName);
    selectedMonthName = uiName.toUpperCase();
  }

  let monthDescriptors;
  if (baseKey) {
    monthDescriptors = getAvailableMonthsFromVentas(ventas);
  } else if (Array.isArray(fechas) && fechas.length > 0) {
    monthDescriptors = fechas.map((f) => ({
      key: `${f.anio}-${aliasMes(f.mes)}`,
      label: String(f.label || "").toUpperCase(),
      anio: f.anio,
      mes: aliasMes(f.mes),
      dateObj: new Date(
        Number(f.anio),
        MESES.indexOf(aliasMes(f.mes)),
        1
      ),
    }));
  } else {
    monthDescriptors = getAvailableMonthsFromVentas(ventas);
  }

  const perMonth = monthDescriptors.map((f) => {
    const mesNorm = aliasMes(f.mes);
    return {
      label: String(f.label || `${mesNorm.toUpperCase()} ${f.anio}`),
      anio: f.anio,
      mes: mesNorm,
      metrics: computeMetricsForMonth({
        ventas,
        reservasMF,
        dataMktByMonth,
        originMap,
        initialDay,
        cutDay,
        tasaCambio,
        anio: f.anio,
        mesNombre: mesNorm,
      }),
    };
  });

  const monthKey = (m) => `${m.anio}-${m.mes}`;

  let baseMonth = null;
  if (baseKey) {
    baseMonth = perMonth.find((m) => monthKey(m) === baseKey) || null;
  }
  if (!baseMonth && selectedMonthKey) {
    baseMonth =
      perMonth.find((m) => aliasMes(m.mes) === selectedMonthKey) || null;
  }

  const originKeysAll = Array.from(
    new Set(perMonth.flatMap((m) => Object.keys(m.metrics?.byOrigin || {})))
  )
    .filter((k) => k !== "meta")
    .filter(
      (k) => !ORIGINS_EXCLUIR.has(String(k).toLowerCase().trim())
    )
    .sort();

  const rowsPerOrigin = (okey) => [
    { key: `o:${okey}:total`, label: `VENTA MEMBRESÍAS`, type: "money" },
    { key: `o:${okey}:cant`, label: `CANTIDAD MEMBRESÍAS`, type: "int" },
    { key: `o:${okey}:ticket`, label: `TICKET MEDIO`, type: "money" },
    { key: `o:${okey}:pct`, label: `% PARTICIPACIÓN`, type: "float2" },
  ];

  const mfProgramKeys = Array.from(
    new Set(perMonth.flatMap((m) => Object.keys(m.metrics?.mfByProg || {})))
  ).sort();

  const valueForOriginMonth = (okey, m) => {
    if (!m || !m.metrics) return -1;

    if (okey === "monkeyfit") {
      return Number(m.metrics.venta_monkeyfit ?? 0);
    }

    if (!Number.isNaN(Number(okey))) {
      const mf = m.metrics.mfByProg?.[okey];
      if (!mf) return -1;
      return Number(mf.venta ?? 0);
    }

    const o = m.metrics.byOrigin?.[okey];
    if (!o) return -1;

    return Number(o.total || 0);
  };

  const monthOrderForOrigin = (okey) => {
    if (perMonth.length === 0) return [];

    if (baseKey && baseMonth) {
      const baseK = monthKey(baseMonth);

      const scored = perMonth
        .filter((m) => monthKey(m) !== baseK)
        .map((m) => ({ m, val: valueForOriginMonth(okey, m) }))
      const top3Items = scored
        .sort((a, b) => Number(b.val) - Number(a.val))
        .slice(0, 4);
      top3Items.sort((a, b) => Number(a.val) - Number(b.val));
      const result = [baseMonth];
      top3Items.forEach((x) => result.push(x.m));
      return result;
    }
    const isMonkeyFit = String(okey) === "monkeyfit" || !Number.isNaN(Number(okey));

    const list = perMonth.map((m, idx) => ({
      m,
      idx,
      val: valueForOriginMonth(okey, m),
    }));

    if (isMonkeyFit) {
      list.sort((a, b) => {
        const diff = Number(b.val) - Number(a.val);
        if (diff !== 0) return diff;
        return b.idx - a.idx;
      });
      return list.slice(0, 3).map(x => x.m);
    }

    return list
      .filter((x) => x.val > 0)
      .sort((a, b) => {
        const diff = Number(b.val) - Number(a.val);
        if (diff !== 0) return diff;
        return a.idx - b.idx;
      })
      .map((x) => x.m);
  };
  const orderedOrigins = [...originKeysAll].sort((a, b) => {
    const mObj = baseMonth;
    const valA = Number(mObj?.metrics?.byOrigin?.[a]?.total || 0);
    const valB = Number(mObj?.metrics?.byOrigin?.[b]?.total || 0);
    if (valA !== valB) {
      return valB - valA;
    }
    const totalA = perMonth.reduce(
      (acc, m) => acc + Number(m.metrics?.byOrigin?.[a]?.total || 0),
      0
    );
    const totalB = perMonth.reduce(
      (acc, m) => acc + Number(m.metrics?.byOrigin?.[b]?.total || 0),
      0
    );
    if (totalA !== totalB) {
      return totalB - totalA;
    }
    return String(a).localeCompare(String(b));
  });
  const orderedMFPrograms = [...mfProgramKeys].sort((a, b) => {
    const mObj = baseMonth;
    const valA = Number(mObj?.metrics?.mfByProg?.[a]?.cant || 0);
    const valB = Number(mObj?.metrics?.mfByProg?.[b]?.cant || 0);
    if (valA !== valB) return valA - valB;
    const totalA = perMonth.reduce(
      (acc, m) => acc + Number(m.metrics?.mfByProg?.[a]?.cant || 0),
      0
    );
    const totalB = perMonth.reduce(
      (acc, m) => acc + Number(m.metrics?.mfByProg?.[b]?.cant || 0),
      0
    );

    if (totalA !== totalB) return totalA - totalB;
    return String(a).localeCompare(String(b));
  });

  return {
    selectedMonthName,
    perMonth,
    monthOrderForOrigin,
    rowsPerOrigin,
    orderedOrigins,
    orderedMFPrograms,
  };
}

// ================== LOGICA DE METAS ==================
const METAS_2025 = {
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
  noviembre: 90000,
  diciembre: 100000,
};

export const getMetaPorMes = (mes, anio) => {
  if (Number(anio) === 2026) return 100000;
  // Default (2025 u otros)
  const norm = aliasMes(mes);
  return METAS_2025[norm] || 100000;
};

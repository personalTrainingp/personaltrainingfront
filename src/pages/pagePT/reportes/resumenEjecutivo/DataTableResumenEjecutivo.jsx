import React, { useMemo, useState, useEffect } from "react";

/**
 * Executive summary table for CIRCUS — con selector de día y datos desde ventas (JSON).
 * - Usa TailwindCSS para estilos.
 * - `ExecutiveSummaryFromVentas` recibe el array `ventas` (tus `dataVentas`) y opcionalmente
 *   un objeto `marketing` con { inversion_redes, leads, cpl, cac } por mes.
 * - El selector de fecha filtra SOLO las filas de ventas (servicios/productos/tickets/total) a ese día.
 * - La fila "VENTA TOTAL ACUMULADA POR MES" siempre muestra el acumulado del mes completo (sin filtro).
 * - Queda espacio para mostrar KPIs de marketing (inversión, leads, CPL, CAC).
 */

/*****************************  Helpers  *****************************/
const SPANISH_MONTHS = [
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

// Convierte ISO a fecha YYYY-MM-DD en la zona horaria de Lima (-05:00)
function toLimaDateStr(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
  const limaMs = utcMs - 5 * 60 * 60000; // -05:00
  const tzd = new Date(limaMs);
  const y = tzd.getFullYear();
  const m = String(tzd.getMonth() + 1).padStart(2, "0");
  const day = String(tzd.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getMonthKey(iso) {
  const d = new Date(iso);
  const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
  const lima = new Date(utcMs - 5 * 60 * 60000);
  return SPANISH_MONTHS[lima.getMonth()]; // "marzo", "agosto", etc.
}

const fmtCurrency = (n) => {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "";
  try {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(Number(n));
  } catch {
    return `S/ ${Number(n).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;
  }
};
const fmtNumber = (n) => (n === null || n === undefined ? "" : new Intl.NumberFormat("es-PE").format(Number(n)));

// Suma segura para servicios/productos
function montoLineaServicio(det) {
  const cantidad = Number(det?.cantidad ?? 1) || 1;
  const tarifa = Number(
    det?.tarifa_monto ?? det?.precio_unitario ?? det?.circus_servicio?.precio ?? 0
  );
  return cantidad * tarifa;
}
function montoLineaProducto(det) {
  const cantidad = Number(det?.cantidad ?? 1) || 1;
  const tarifa = Number(
    det?.tarifa_monto ?? det?.precio_unitario ?? det?.tb_producto?.prec_venta ?? 0
  );
  return cantidad * tarifa;
}

/*************************  Tabla presentacional  *************************/
function CellValue({ type, value }) {
  if (type === "currency") return <span>{fmtCurrency(value)}</span>;
  return <span>{fmtNumber(value)}</span>;
}

function HeaderBlock({ titleLeft, titleRight }) {
  return (
    <div className="w-full bg-black text-white rounded-t-2xl">
      <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 gap-2 md:grid-cols-3 items-center">
        <div className="md:col-span-1 text-4xl font-extrabold text-yellow-400 tracking-wide">{titleLeft}</div>
        <div className="md:col-span-2 text-center md:text-right text-lg font-semibold leading-snug">
          {titleRight}
        </div>
      </div>
    </div>
  );
}

function MonthHeader({ columns }) {
  return (
    <thead>
      <tr>
        <th className="w-64 align-middle text-center bg-yellow-400 text-black font-extrabold uppercase border border-black">
          <div className="leading-4">
            <div>MES</div>
            <div>KPI</div>
          </div>
        </th>
        {columns.map((c) => (
          <th key={c.key} className="min-w-[140px] bg-yellow-400 text-black border border-black uppercase">
            <div className="flex flex-col items-center justify-center py-2">
              <span className="font-extrabold text-lg tracking-wide">{c.label}</span>
              <span className="font-extrabold">S/.</span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}

function BodyRows({ rows, columns }) {
  return (
    <tbody>
      {rows.map((r, idx) => {
        const isDark = r.emphasis === "dark";
        const isLight = r.emphasis === "light";
        const baseRow = isDark
          ? "bg-black text-white"
          : isLight
          ? "bg-neutral-100"
          : idx % 2 === 1
          ? "bg-neutral-50"
          : "bg-white";
        return (
          <tr key={r.key} className={`${baseRow}`}>
            <td className={`border border-black font-semibold ${isDark ? "text-white" : "text-black"} px-3 py-2`}>{r.label}</td>
            {columns.map((c) => (
              <td key={c.key} className={`border border-black px-3 py-2 text-right ${isDark ? "text-white" : "text-black"}`}>
                <CellValue type={r.type} value={r.values[c.key]} />
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
}

function FooterRow({ footer, columns }) {
  return (
    <tfoot>
      <tr>
        <td className="bg-yellow-400 text-black border border-black px-3 py-4">
          <div className="text-2xl font-extrabold uppercase leading-tight">VENTA TOTAL</div>
          <div className="text-sm font-bold uppercase -mt-1">ACUMULADA POR MES</div>
        </td>
        {columns.map((c) => (
          <td key={c.key} className="bg-yellow-400 text-black border border-black px-3 py-4 text-right font-extrabold">
            <CellValue type={footer.type} value={footer.values[c.key]} />
          </td>
        ))}
      </tr>
    </tfoot>
  );
}

function CircusExecutiveSummary({ data }) {
  const { titleLeft, titleRight, columns, rows, footer } = data;
  return (
    <div className="w-full py-4">
      <div className="mx-auto max-w-6xl shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/10">
        <HeaderBlock titleLeft={titleLeft} titleRight={titleRight} />
        <div className="overflow-x-auto bg-white">
          <table className="w-full table-fixed border-collapse">
            <MonthHeader columns={columns} />
            <BodyRows rows={rows} columns={columns} />
            <FooterRow footer={footer} columns={columns} />
          </table>
        </div>
      </div>
    </div>
  );
}

/********************  Builder: ventas -> estructura de tabla  ********************/
function buildExecutiveDataCut({ ventas = [], cutDay = 21, marketing = {}, titleRight, columns }) {
  const colKeys = columns.map((c) => c.key);

  // Agregado por mes hasta día de corte (incluido)
  const monthAggCut = {};
  const monthAggAll = {};
  colKeys.forEach((k) => {
    monthAggCut[k] = { servMonto: 0, servCant: 0, prodMonto: 0, prodCant: 0 };
    monthAggAll[k] = { servMonto: 0, servCant: 0, prodMonto: 0, prodCant: 0 };
  });

  ventas.forEach((v) => {
    const mk = monthKey(v?.fecha_venta);
    if (!mk || !(mk in monthAggCut)) return;
    const d = new Date(v?.fecha_venta);
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const lima = new Date(utc - 5 * 60 * 60000);
    const day = lima.getDate();

    const serv = Array.isArray(v?.detalle_ventaMembresia) ? v.detalle_ventaMembresia : [];
    const prod = Array.isArray(v?.detalle_ventaproductos) ? v.detalle_ventaproductos : [];

    // Siempre acumulamos ALL (mes completo)
    serv.forEach((det) => {
      const m = montoServicio(det);
      monthAggAll[mk].servMonto += m;
      monthAggAll[mk].servCant += Number(det?.cantidad ?? 1) || 1;
    });
    prod.forEach((det) => {
      const m = montoProducto(det);
      monthAggAll[mk].prodMonto += m;
      monthAggAll[mk].prodCant += Number(det?.cantidad ?? 1) || 1;
    });

    // Si cae antes o en el día de corte, suma al CUT
    if (day <= Number(cutDay)) {
      serv.forEach((det) => {
        const m = montoServicio(det);
        monthAggCut[mk].servMonto += m;
        monthAggCut[mk].servCant += Number(det?.cantidad ?? 1) || 1;
      });
      prod.forEach((det) => {
        const m = montoProducto(det);
        monthAggCut[mk].prodMonto += m;
        monthAggCut[mk].prodCant += Number(det?.cantidad ?? 1) || 1;
      });
    }
  });

  const valuesOf = (selector) => {
    return colKeys.reduce((acc, k) => {
      const src = monthAggCut[k];
      if (!src) { acc[k] = 0; return acc; }
      if (selector === "servMonto") acc[k] = src.servMonto;
      if (selector === "prodMonto") acc[k] = src.prodMonto;
      if (selector === "servTicket") acc[k] = src.servCant ? src.servMonto / src.servCant : 0;
      if (selector === "prodTicket") acc[k] = src.prodCant ? src.prodMonto / src.prodCant : 0;
      if (selector === "total") acc[k] = src.servMonto + src.prodMonto;
      return acc;
    }, {});
  };

  // Marketing por mes (si envías data), no filtramos por día a menos que lo quieras
  const mkRow = (label, key, type = "number") => ({
    label,
    key,
    type,
    values: colKeys.reduce((a, k) => {
      a[k] = marketing?.[key]?.[k] ?? 0;
      return a;
    }, {}),
  });

  const rows = [
    mkRow("INVERSIÓN REDES", "inversion_redes", "currency"),
    mkRow("LEADS", "leads", "number"),
    mkRow("CPL", "cpl", "number"),

    { label: "VENTA SERVICIOS", key: "venta_servicios", type: "currency", values: valuesOf("servMonto") },
    { label: "TICKET PROMEDIO SERV.", key: "ticket_prom_serv", type: "currency", values: valuesOf("servTicket") },
    { label: "VENTA PRODUCTOS", key: "venta_productos", type: "currency", values: valuesOf("prodMonto") },
    { label: "TICKET PROMEDIO PROD.", key: "ticket_prom_prod", type: "currency", values: valuesOf("prodTicket") },
    { label: "VENTA TOTAL SERV. + PROD.", key: "venta_total", type: "currency", values: valuesOf("total"), emphasis: "dark" },

    mkRow("CAC (S/)", "cac", "number"),
  ];

  const footer = {
    label: "VENTA TOTAL ACUMULADA POR MES",
    type: "currency",
    values: colKeys.reduce((acc, k) => {
      const s = monthAggAll[k] || { servMonto: 0, prodMonto: 0 };
      acc[k] = s.servMonto + s.prodMonto; // SIEMPRE el mes completo
      return acc;
    }, {}),
  };

  return {
    titleLeft: "CIRCUS",
    titleRight: titleRight || "RESUMEN EJECUTIVO",
    columns,
    rows,
    footer,
  };
}
  // Fallback si no hay ventas
  const columns = (monthOrder.length ? monthOrder : ["marzo", "abril", "mayo", "junio", "julio", "agosto"]).map((mk) => ({
    key: mk,
    label: mk.toUpperCase(),
  }));

  const zeroValues = columns.reduce((acc, c) => ((acc[c.key] = 0), acc), {});
  const blankValues = columns.reduce((acc, c) => ((acc[c.key] = ""), acc), {});

  // Agregados por mes (Mes COMPLETO) -> para el FOOTER y para cuando se quiera ver todo
  const monthAggAll = {};
  columns.forEach((c) => (monthAggAll[c.key] = { servMonto: 0, servCant: 0, prodMonto: 0, prodCant: 0 }));

  ventas.forEach((v) => {
    const mk = getMonthKey(v?.fecha_venta);
    if (!mk || !monthAggAll[mk]) return;
    const serv = Array.isArray(v?.detalle_ventaMembresia) ? v.detalle_ventaMembresia : [];
    const prod = Array.isArray(v?.detalle_ventaproductos) ? v.detalle_ventaproductos : [];

    serv.forEach((d) => {
      monthAggAll[mk].servMonto += montoLineaServicio(d);
      monthAggAll[mk].servCant += Number(d?.cantidad ?? 1) || 1;
    });

    prod.forEach((d) => {
      monthAggAll[mk].prodMonto += montoLineaProducto(d);
      monthAggAll[mk].prodCant += Number(d?.cantidad ?? 1) || 1;
    });
  });

  // Agregados por mes SOLO del DÍA SELECCIONADO -> para las filas de ventas
  const monthAggDay = {};
  columns.forEach((c) => (monthAggDay[c.key] = { servMonto: 0, servCant: 0, prodMonto: 0, prodCant: 0 }));

  const selectedStr = selectedDate ? String(selectedDate) : null; // formato YYYY-MM-DD

  ventas.forEach((v) => {
    if (!selectedStr) return; // si no hay día, no llenamos (veremos todo más abajo)
    const vDateStr = toLimaDateStr(v?.fecha_venta);
    if (vDateStr !== selectedStr) return;
    const mk = getMonthKey(v?.fecha_venta);
    if (!mk || !monthAggDay[mk]) return;

    const serv = Array.isArray(v?.detalle_ventaMembresia) ? v.detalle_ventaMembresia : [];
    const prod = Array.isArray(v?.detalle_ventaproductos) ? v.detalle_ventaproductos : [];

    serv.forEach((d) => {
      monthAggDay[mk].servMonto += montoLineaServicio(d);
      monthAggDay[mk].servCant += Number(d?.cantidad ?? 1) || 1;
    });

    prod.forEach((d) => {
      monthAggDay[mk].prodMonto += montoLineaProducto(d);
      monthAggDay[mk].prodCant += Number(d?.cantidad ?? 1) || 1;
    });
  });

  // Decidir de dónde salen los valores de las filas de ventas
  const useDay = Boolean(selectedStr);
  const getValues = (selector) => {
    const values = columns.reduce((acc, c) => ((acc[c.key] = 0), acc), {});
    columns.forEach((c) => {
      const src = useDay ? monthAggDay[c.key] : monthAggAll[c.key];
      if (!src) return;
      if (selector === "servMonto") values[c.key] = src.servMonto;
      if (selector === "prodMonto") values[c.key] = src.prodMonto;
      if (selector === "servTicket") values[c.key] = src.servCant ? src.servMonto / src.servCant : "";
      if (selector === "prodTicket") values[c.key] = src.prodCant ? src.prodMonto / src.prodCant : "";
      if (selector === "total") values[c.key] = src.servMonto + src.prodMonto;
    });
    return values;
  };

  // Marketing (si lo mandas) SIEMPRE es por mes completo
  const mkt = marketing || {};
  const marketingRow = (label, key, type) => ({
    label,
    key,
    type,
    values: columns.reduce((acc, c) => {
      const byMonth = mkt[key] || {}; // { marzo: 738, ... }
      acc[c.key] = byMonth[c.key] ?? (type === "currency" || type === "number" ? "" : "");
      return acc;
    }, {}),
  });

  const rows = [
    marketingRow("INVERSIÓN REDES", "inversion_redes", "currency"),
    marketingRow("LEADS", "leads", "number"),
    marketingRow("CPL", "cpl", "number"),

    { label: "VENTA SERVICIOS", key: "venta_servicios", type: "currency", values: getValues("servMonto") },
    { label: "TICKET PROMEDIO SERV.", key: "ticket_prom_serv", type: "currency", values: getValues("servTicket") },
    { label: "VENTA PRODUCTOS", key: "venta_productos", type: "currency", values: getValues("prodMonto") },
    { label: "TICKET PROMEDIO PROD.", key: "ticket_prom_prod", type: "currency", values: getValues("prodTicket") },
    {
      label: "VENTA TOTAL SERV. + PROD.",
      key: "venta_total",
      type: "currency",
      values: getValues("total"),
      emphasis: "dark",
    },
    marketingRow("CAC (S/)", "cac", "number"),
  ];

  // Footer: Venta total acumulada por mes (mes completo SIEMPRE)
  const footer = {
    label: "VENTA TOTAL ACUMULADA POR MES",
    type: "currency",
    values: columns.reduce((acc, c) => {
      const src = monthAggAll[c.key];
      acc[c.key] = src ? src.servMonto + src.prodMonto : 0;
      return acc;
    }, {}),
  };

  return {
    titleLeft: "CIRCUS",
    titleRight: titleRight || "RESUMEN EJECUTIVO",
    columns,
    rows,
    footer,
  };


/*************************  Contenedor con selector de fecha  *************************/
export default function ExecutiveSummaryFromVentas({ ventas = [], marketing = {}, titulo = "RESUMEN EJECUTIVO", defaultCutDay = 21 }) {
  // Selector: día de corte (1..31)
  const [cutDay, setCutDay] = useState(Number(defaultCutDay) || 21);

  // Columnas fijas estilo tu primer cuadro (marzo..agosto)
  const columns = useMemo(() => (
    ["marzo","abril","mayo","junio","julio","agosto"].map(mk => ({ key: mk, label: mk.toUpperCase() }))
  ), []);

  // Builder con día de corte
  const data = useMemo(() => buildExecutiveDataCut({ ventas, cutDay, marketing, titleRight: titulo, columns }), [ventas, cutDay, marketing, titulo, columns]);

  return (
    <div className="w-full">
      {/* Selector día de corte 1..31 */}
      <div className="mx-auto max-w-6xl mb-3 flex flex-col md:flex-row gap-2 md:items-end md:justify-between px-1">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold">Día de corte (aplica a cada mes):</label>
          <select
            className="border rounded-lg px-3 py-2 shadow-sm"
            value={cutDay}
            onChange={(e) => setCutDay(parseInt(e.target.value, 10))}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <span className="text-xs text-neutral-500">Comparas cada mes hasta ese día (incluido).</span>
        </div>
      </div>

      <CircusExecutiveSummary data={data} />
    </div>
  );
}
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);


// adapters/ventasToExecutiveData.js
const MONTHS = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","setiembre","octubre","noviembre","diciembre"
];



const monthKey = (iso) => {
  const d = new Date(iso);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const lima = new Date(utc - 5 * 60 * 60000); // -05:00
  return MONTHS[lima.getMonth()];
};
const dayOfMonth = (iso) => {
  const d = new Date(iso);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const lima = new Date(utc - 5 * 60 * 60000);
  return lima.getDate();
};

const montoServicio = (det) => {
  const cant = Number(det?.cantidad ?? 1) || 1;
  const tarifa = Number(det?.tarifa_monto ?? 0);
  return tarifa;
};
const montoProducto = (det) => {
  const cant = Number(det?.cantidad ?? 1) || 1;
  const tarifa = Number(det?.tarifa_monto ?? 0);
  return tarifa;
};

/**
 * Transforma `ventas` al shape del ExecutiveTable.
 * @param {Object} params
 * @param {Array}  params.ventas        - dataVentas del store
 * @param {Array}  params.columns       - columnas [{key,label,currency}], ej. MARZO..AGOSTO
 * @param {String} params.titleLeft     - p.ej. "CIRCUS"
 * @param {String} params.titleRight    - p.ej. "RESUMEN EJECUTIVO ..."
 * @param {Object} params.marketing     - { inversion_redes:{marzo:..}, leads:{..}, cpl:{..}, cac:{..} }
 * @param {Number} params.cutDay        - (opcional) día de corte 1..31 (incluido). Si no se pasa, usa mes completo en filas.
 * @param {Boolean} params.footerFullMonth - si true, el footer es siempre el mes completo (recomendado).
 */
export function ventasToExecutiveData({
  ventas = [],
  columns = [],
  titleLeft = "CIRCUS",
  titleRight = "RESUMEN EJECUTIVO",
  marketing = {},
  cutDay = null,
  footerFullMonth = true,
}) {
  const keys = columns.map((c) => c.key);

  const monthAggAll = {};
  const monthAggCut = {};
  keys.forEach((k) => {
    monthAggAll[k] = { servMonto: 0, servCant: 0, prodMonto: 0, prodCant: 0 };
    monthAggCut[k] = { servMonto: 0, servCant: 0, prodMonto: 0, prodCant: 0 };
  });

  ventas.forEach((v) => {
    const mk = monthKey(v?.fecha_venta);
    if (!monthAggAll[mk]) return;

    const serv = Array.isArray(v?.detalle_ventaMembresia) ? v.detalle_ventaMembresia : [];
    const prod = Array.isArray(v?.detalle_ventaProductos
) ? v.detalle_ventaProductos
 : [];
    console.log({mk, serv, prod, fv: v?.fecha_venta, sertarifa: serv[0]?.tarifa_monto});
    
    // Mes completo (para footer y/o filas si no hay cutDay)
    serv.forEach((d) => {
      monthAggAll[mk].servMonto += montoServicio(d);
      monthAggAll[mk].servCant += Number(d?.cantidad ?? 1) || 1;
    });
    prod.forEach((d) => {
      monthAggAll[mk].prodMonto += montoProducto(d);
      monthAggAll[mk].prodCant += Number(d?.cantidad ?? 1) || 1;
    });
    // Día de corte (si aplica)
    if (cutDay && dayOfMonth(v?.fecha_venta) <= cutDay) {
      serv.forEach((d) => {
        monthAggCut[mk].servMonto += montoServicio(d);
        monthAggCut[mk].servCant += Number(d?.cantidad ?? 1) || 1;
      });
      prod.forEach((d) => {
        monthAggCut[mk].prodMonto += montoProducto(d);
        monthAggCut[mk].prodCant += Number(d?.cantidad ?? 1) || 1;
      });
    }
  });

  const srcForRows = cutDay ? monthAggCut : monthAggAll;

  const valuesOf = (selector) =>
    keys.reduce((acc, k) => {
      const src = srcForRows[k] || { servMonto: 0, servCant: 0, prodMonto: 0, prodCant: 0 };
      if (selector === "servMonto") acc[k] = src.servMonto;
      if (selector === "prodMonto") acc[k] = src.prodMonto;
      if (selector === "servTicket")
        acc[k] = src.servCant ? src.servMonto / src.servCant : 0;
      if (selector === "prodTicket")
        acc[k] = src.prodCant ? src.prodMonto / src.prodCant : 0;
      if (selector === "total") acc[k] = src.servMonto + src.prodMonto;
      if(selector==='prodCant') acc[k] = src.prodCant;
      if(selector==='servCant') acc[k] = src.servCant;
      return acc;
    }, {});

  const mkRow = (label, key, type = "number") => ({
    label,
    key,
    type,
    values: keys.reduce((a, k) => {
      a[k] = marketing?.[key]?.[k] ?? 0;
      return a;
    }, {}),
  });

  const rows = [
    mkRow("INVERSIÓN REDES", "inversion_redes", "currency"),
    mkRow("LEADS", "leads", "number"),
    mkRow("CPL", "cpl", "number"),

    { label: "VENTA SERVICIOS",       key: "venta_servicios",  type: "currency", values: valuesOf("servMonto") },
    { label: "TICKET PROMEDIO SERV.", key: "ticket_prom_serv", type: "currency", values: valuesOf("servTicket") },
    { label: "VENTA PRODUCTOS",       key: "venta_productos",  type: "currency", values: valuesOf("prodMonto") },
    { label: "CANTIDAD PRODUCTOS", key: "cantidad_productos", values: valuesOf("prodCant") },
    { label: "CANTIDAD SERVICIOS", key: "cantidad_servicios", values: valuesOf("servCant") },
    { label: "TICKET PROMEDIO PROD.", key: "ticket_prom_prod", type: "currency", values: valuesOf("prodTicket") },
    { label: "VENTA TOTAL SERV. + PROD.", key: "venta_total",  type: "currency", values: valuesOf("total"), emphasis: "dark" },

    mkRow("CAC (S/)", "cac", "number"),
  ];

  const footerSource = footerFullMonth ? monthAggAll : srcForRows;
  const footer = {
    label: "VENTA TOTAL ACUMULADA POR MES",
    type: "currency",
    values: keys.reduce((a, k) => {
      const s = footerSource[k] || { servMonto: 0, prodMonto: 0 };
      a[k] = s.servMonto + s.prodMonto;
      return a;
    }, {}),
  };

  return { titleLeft, titleRight, columns, rows, footer };
}

// adapters/ventasToExecutiveData.js
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Lima'); // todo se interpreta en Lima (-05:00)

const MONTHS = [
  'enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','setiembre','octubre','noviembre','diciembre'
];

// Helpers de fecha en Lima
const monthKey = (iso) => MONTHS[ dayjs(iso).tz().month() ];   // 0..11
const dayOfMonth = (iso) => dayjs(iso).tz().date();            // 1..31
const inWindowByDay = (iso, initDay, cutDay) => {
  const d = dayOfMonth(iso);
  if (initDay == null && cutDay == null) return true;          // mes completo
  if (initDay == null) return d <= cutDay;                     // <= cut
  if (cutDay == null) return d >= initDay;                     // >= init
  if (initDay <= cutDay) return d >= initDay && d <= cutDay;   // ventana normal
  // ventana cruzando fin de mes (p.ej. 25..5): >=init OR <=cut
  return d >= initDay || d <= cutDay;
};

// Monto = cantidad * tarifa (defensivo)
const montoServicio = (det) => {
  const cant = Number(det?.cantidad ?? 1) || 1;
  const tarifa = Number(det?.tarifa_monto ?? 0) || 0;
  return cant * tarifa;
};
const montoProducto = (det) => {
  const cant = Number(det?.cantidad ?? 1) || 1;
  const tarifa = Number(det?.tarifa_monto ?? 0) || 0;
  return cant * tarifa;
};

export function ventasToExecutiveData({
  ventas = [],
  columns = [],
  titleLeft = 'CIRCUS',
  titleRight = 'RESUMEN EJECUTIVO',
  marketing = {},
  cutDay = null,      // día de corte (incl.)
  initDay = null,     // día inicial (incl.)
  footerFullMonth = true,
}) {
  const keys = columns.map((c) => c.key);

  // Acumuladores por mes (para mes completo y para ventana init..cut)
  const baseAgg = { servMonto: 0, servCant: 0, prodMonto: 0, prodCant: 0 };
  const monthAggAll = Object.fromEntries(keys.map(k => [k, { ...baseAgg }]));
  const monthAggWin = Object.fromEntries(keys.map(k => [k, { ...baseAgg }]));

  ventas.forEach((v) => {
    const mk = monthKey(v?.fecha_venta);
    if (!monthAggAll[mk]) return; // si ese mes no está en columns, se ignora

    // Soporta nombres alternativos para servicios
    const serv = Array.isArray(v?.detalle_ventaMembresia)
      ? v.detalle_ventaMembresia
      : (Array.isArray(v?.detalle_ventaservicios) ? v.detalle_ventaservicios : []);
    const prod = Array.isArray(v?.detalle_ventaProductos) ? v.detalle_ventaProductos : [];

    // Mes completo
    for (const d of serv) {
      monthAggAll[mk].servMonto += montoServicio(d);
      monthAggAll[mk].servCant  += Number(d?.cantidad ?? 1) || 1;
    }
    for (const d of prod) {
      monthAggAll[mk].prodMonto += montoProducto(d);
      monthAggAll[mk].prodCant  += Number(d?.cantidad ?? 1) || 1;
    }

    // Ventana (initDay..cutDay) si aplica
    if (inWindowByDay(v?.fecha_venta, initDay, cutDay)) {
      for (const d of serv) {
        monthAggWin[mk].servMonto += montoServicio(d);
        monthAggWin[mk].servCant  += Number(d?.cantidad ?? 1) || 1;
      }
      for (const d of prod) {
        monthAggWin[mk].prodMonto += montoProducto(d);
        monthAggWin[mk].prodCant  += Number(d?.cantidad ?? 1) || 1;
      }
    }
  });

  const srcForRows = (initDay != null || cutDay != null) ? monthAggWin : monthAggAll;

  const valuesOf = (selector) =>
    keys.reduce((acc, k) => {
      const src = srcForRows[k] || baseAgg;
      if (selector === 'servMonto')   acc[k] = src.servMonto;
      if (selector === 'prodMonto')   acc[k] = src.prodMonto;
      if (selector === 'servTicket')  acc[k] = src.servCant ? src.servMonto / src.servCant : 0;
      if (selector === 'prodTicket')  acc[k] = src.prodCant ? src.prodMonto / src.prodCant : 0;
      if (selector === 'total')       acc[k] = src.servMonto + src.prodMonto;
      if (selector === 'prodCant')    acc[k] = src.prodCant;
      if (selector === 'servCant')    acc[k] = src.servCant;
      return acc;
    }, {});

  const mkRow = (label, key, type = 'number') => ({
    label,
    key,
    type,
    values: keys.reduce((a, k) => {
      a[k] = Number(marketing?.[key]?.[k] ?? 0);
      return a;
    }, {}),
  });

  const rows = [
    mkRow('INVERSIÓN REDES', 'inversion_redes', 'currency'),
    mkRow('LEADS', 'leads', 'number'),
    mkRow('CPL', 'cpl', 'number'),

    { label: 'VENTA SERVICIOS',         key: 'venta_servicios',   type: 'currency', values: valuesOf('servMonto') },
    { label: 'TICKET PROMEDIO SERV.',   key: 'ticket_prom_serv',  type: 'currency', values: valuesOf('servTicket') },
    { label: 'VENTA PRODUCTOS',         key: 'venta_productos',   type: 'currency', values: valuesOf('prodMonto') },
    { label: 'CANTIDAD PRODUCTOS',      key: 'cantidad_productos',                    values: valuesOf('prodCant') },
    { label: 'CANTIDAD SERVICIOS',      key: 'cantidad_servicios',                    values: valuesOf('servCant') },
    { label: 'TICKET PROMEDIO PROD.',   key: 'ticket_prom_prod', type: 'currency',   values: valuesOf('prodTicket') },
    { label: 'VENTA TOTAL SERV. + PROD.', key: 'venta_total',     type: 'currency',  values: valuesOf('total'), emphasis: 'dark' },

    mkRow('CAC (S/)', 'cac', 'number'),
  ];

  const footerSource = footerFullMonth ? monthAggAll : srcForRows;
  const footer = {
    label: 'VENTA TOTAL ACUMULADA POR MES',
    type: 'currency',
    values: keys.reduce((a, k) => {
      const s = footerSource[k] || baseAgg;
      a[k] = s.servMonto + s.prodMonto;
      return a;
    }, {}),
  };

  return { titleLeft, titleRight, columns, rows, footer };
}

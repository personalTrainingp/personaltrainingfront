import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import React, { useMemo } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Lima");

/********************** Presentacional: ComparativeTable ************************/
/**
 * data = {
 *   title: string,
 *   columns: [{ key:'marzo', label:'MARZO', currency:'S/.' }, ...],
 *   sections: [{ name, rows: [{ label, type, values: { marzo: number, ... } }] }],
 *   refKey?: 'agosto' // opcional, para marcar mes de referencia
 * }
 */

const fmtCurrencyParens = (n) => {
  const val = Number(n || 0);
  const abs = Math.abs(val);
  const formatted = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(abs);
  return val < 0 ? `(${formatted})` : formatted;
};

const cellClassByValue = (val) => {
  const v = Number(val || 0);
  if (v > 0) return "text-green-700 font-semibold";
  if (v < 0) return "text-red-600 font-semibold";
  return "text-neutral-500";
};

const fmtPercent = (p) => {
  const v = Number(p || 0);
  const s = Math.round(v * 100);
  return `${s}%`;
};

function SectionHeader({ name, columns, refKey }) {
  return (
    <tr>
      <th className="bg-primary text-black border border-black px-3 text-left uppercase font-extrabold fs-3">
        {name}
      </th>
      {columns.map((c) => (
        <th
          key={c.key}
          className="bg-primary text-black border border-black px-3 text-left uppercase font-extrabold fs-3"
          title={c.key === refKey ? "Mes de referencia" : undefined}
        >
          <div>
            <div className="font-extrabold text-center">
              {c.label}
              {c.key === refKey ? " • REF" : ""}
            </div>
          </div>
        </th>
      ))}
    </tr>
  );
}

export function ComparativeTable({ data }) {
  const { title, columns, sections, refKey } = data;
  return (
    <div>
      {/* Encabezado negro */}
      <div className="w-full bg-black text-white rounded-t-2xl">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xl md:text-2xl font-extrabold">
          {title}
        </div>
      </div>

      <div className="overflow-x-auto shadow-2xl rounded-b-2xl ring-1 ring-black/10">
        <table className="w-full table-fixed border-collapse">
          <tbody>
            {sections.map((sec) => (
              <React.Fragment key={sec.name}>
                <SectionHeader name={sec.name} columns={columns} refKey={refKey} />
                {sec.rows.map((r, idx) => (
                  <tr
                    key={`${sec.name}-${r.label}-${idx}`}
                    className={idx % 2 ? "bg-neutral-50" : "bg-white"}
                  >
                    <td className="fs-3 border border-black font-semibold">
                      <div className="text-black">{r.label}</div>
                    </td>
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={`border border-black fs-3 pl-4 text-right ${cellClassByValue(
                          r.values[c.key]
                        )}`}
                      >
                        {r.type === "currency-diff" && fmtCurrencyParens(r.values[c.key])}
                        {r.type === "percent" && fmtPercent(r.values[c.key])}
                        {r.type !== "currency-diff" &&
                          r.type !== "percent" &&
                          String(r.values[c.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/********************** Adapter: ventas -> ComparativeTable **********************/
const MONTHS = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","setiembre","octubre","noviembre","diciembre"
];

const monthKey = (iso) => MONTHS[ dayjs(iso).tz().month() ];
const dayOfMonth = (iso) => dayjs(iso).tz().date();

const inWindowByDay = (iso, initDay, cutDay) => {
  const d = dayOfMonth(iso);
  if (initDay == null && cutDay == null) return true;         // mes completo
  if (initDay == null) return d <= cutDay;                    // <= cut
  if (cutDay == null) return d >= initDay;                    // >= init
  if (initDay <= cutDay) return d >= initDay && d <= cutDay;  // ventana normal
  return d >= initDay || d <= cutDay;                         // ventana cruzando fin de mes
};

const montoServ = (det) => {
  const cant = Number(det?.cantidad ?? 1) || 1;
  const tarifa =
    Number(
      det?.tarifa_monto ??
      det?.precio_unitario ??
      det?.circus_servicio?.precio ??
      0
    ) || 0;
  return cant * tarifa;
};

const montoProd = (det) => {
  const cant = Number(det?.cantidad ?? 1) || 1;
  const tarifa =
    Number(
      det?.tarifa_monto ??
      det?.precio_unitario ??
      det?.tb_producto?.prec_venta ??
      0
    ) || 0;
  return cant * tarifa;
};

/**
 * Calcula dif y % vs mes de referencia para SERVICIOS, PRODUCTOS y TOTAL.
 * @param ventas Array de ventas
 * @param params { columns, initDay, cutDay, referenceMonth }
 */
export function buildComparativoFromVentas(
  ventas = [],
  { columns = [], initDay = null, cutDay = null, referenceMonth = null } = {}
) {
  const keys = columns.map((c) => c.key);
  const acc = Object.fromEntries(keys.map((k) => [k, { serv: 0, prod: 0 }]));

  for (const v of ventas) {
    const mk = monthKey(v?.fecha_venta);
    if (!acc[mk]) continue;
    if (!inWindowByDay(v?.fecha_venta, initDay, cutDay)) continue;

    const srv = Array.isArray(v?.detalle_ventaMembresia)
      ? v.detalle_ventaMembresia
      : (Array.isArray(v?.detalle_ventaservicios) ? v.detalle_ventaservicios : []);
    const prd = Array.isArray(v?.detalle_ventaProductos) ? v.detalle_ventaProductos : [];

    for (const d of srv) acc[mk].serv += montoServ(d);
    for (const d of prd) acc[mk].prod += montoProd(d);
  }

  // Mes de referencia
  let refKey = referenceMonth && keys.includes(referenceMonth)
    ? referenceMonth
    : null;

  if (!refKey) {
    const withVal = keys.filter((k) => (acc[k]?.serv || acc[k]?.prod));
    refKey = withVal.length ? withVal[withVal.length - 1] : keys[keys.length - 1];
  }

  const refServ = acc[refKey]?.serv || 0;
  const refProd = acc[refKey]?.prod || 0;
  const refTot = refServ + refProd;

  const diff = (v, r) => v - r;
  const ratio = (v, r) => (r ? (v - r) / r : 0);

  const secServicios = {
    name: "SERVICIOS",
    rows: [
      {
        label: "VENTAS",
        type: "currency-diff",
        values: keys.reduce((a, k) => ((a[k] = diff(acc[k].serv, refServ)), a), {}),
      },
      {
        label: "%",
        type: "percent",
        values: keys.reduce((a, k) => ((a[k] = ratio(acc[k].serv, refServ)), a), {}),
      },
    ],
  };

  const secProductos = {
    name: "PRODUCTOS",
    rows: [
      {
        label: "VENTAS",
        type: "currency-diff",
        values: keys.reduce((a, k) => ((a[k] = diff(acc[k].prod, refProd)), a), {}),
      },
      {
        label: "%",
        type: "percent",
        values: keys.reduce((a, k) => ((a[k] = ratio(acc[k].prod, refProd)), a), {}),
      },
    ],
  };

  const secTotal = {
    name: "TOTAL",
    rows: [
      {
        label: "VENTAS",
        type: "currency-diff",
        values: keys.reduce(
          (a, k) => ((a[k] = diff(acc[k].serv + acc[k].prod, refTot)), a),
          {}
        ),
      },
      {
        label: "%",
        type: "percent",
        values: keys.reduce(
          (a, k) => ((a[k] = ratio(acc[k].serv + acc[k].prod, refTot)), a),
          {}
        ),
      },
    ],
  };

  return { sections: [secServicios, secProductos, secTotal], refKey };
}

/********************** Contenedor listo para usar *****************************/
export default function ComparativoVsActual({
  ventas = [],
  columns,
  title = "COMPARATIVO MENSUAL VS MES ACTUAL",
  cutDay = null,
  initDay = null,
  referenceMonth = null,
}) {
  const cols = useMemo(
    () =>
      columns && columns.length
        ? columns
        : [
            { key: "marzo", label: "MARZO", currency: "S/." },
            { key: "abril", label: "ABRIL", currency: "S/." },
            { key: "mayo", label: "MAYO", currency: "S/." },
            { key: "junio", label: "JUNIO", currency: "S/." },
            { key: "julio", label: "JULIO", currency: "S/." },
            { key: "agosto", label: "AGOSTO", currency: "S/." },
          ],
    [columns]
  );

  const calc = useMemo(
    () => buildComparativoFromVentas(ventas, { columns: cols, initDay, cutDay, referenceMonth }),
    [ventas, cols, initDay, cutDay, referenceMonth]
  );

  const data = useMemo(
    () => ({ title, columns: cols, sections: calc.sections, refKey: calc.refKey }),
    [title, cols, calc.sections, calc.refKey]
  );

  return <ComparativeTable data={data} />;
}

import dayjs from "dayjs";
import React, { useMemo } from "react";

/********************** Presentacional: ComparativeTable ************************/
/**
 * Reutilizable para cuadros de comparación mensual vs mes de referencia.
 * props.data = {
 *   title: string,
 *   columns: [{ key:'marzo', label:'MARZO', currency:'S/.' }, ...],
 *   sections: [
 *     {
 *       name: 'SERVICIOS' | 'PRODUCTOS' | 'TOTAL',
 *       rows: [
 *         { label: 'VENTAS', type: 'currency-diff', values: { marzo: 0, ... } },
 *         { label: '%',      type: 'percent',      values: { marzo: 0.12, ... } },
 *       ]
 *     }, ...
 *   ]
 * }
 */

const fmtCurrencyParens = (n) => {
  const val = Number(n || 0);
  const abs = Math.abs(val);
  const formatted = new Intl.NumberFormat("es-PE", { style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2, }).format(abs);
  if (val < 0) return `-${formatted}`;
  return formatted;
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

function SectionHeader({ name, columns }) {
  return (
    <tr>
      <th className="bg-primary text-black border border-black px-3 text-left uppercase font-extrabold fs-3">{name}   </th>
      {columns.map((c) => (
        <th key={c.key} className="bg-primary text-black border border-black px-3 text-left uppercase font-extrabold fs-3">
          <div>
            <div className="font-extrabold text-center">{c.label}</div>
          </div>
        </th>
      ))}
    </tr>
  );
}

export function ComparativeTable({ data }) {
  const { title, columns, sections } = data;
  return (
    <div >
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
                <SectionHeader name={sec.name} columns={columns} />
                {sec.rows.map((r, idx) => (
                  <tr key={`${sec.name}-${r.label}-${idx}`} className={idx % 2 ? "bg-neutral-50" : "bg-white"}>
                    <td className="fs-3 border border-black font-semibold">
                      <div className="text-black bg-primary">
                        {r.label}
                      </div>
                    </td>
                    {columns.map((c) => (
                      <td key={c.key} className={`border border-black fs-3 pl-4 text-right ${cellClassByValue(r.type === 'percent' ? r.values[c.key] : r.values[c.key])}`}>
                        {r.type === "currency-diff" && fmtCurrencyParens(r.values[c.key])}
                        {r.type === "percent" && fmtPercent(r.values[c.key])}
                        {r.type !== "currency-diff" && r.type !== "percent" && String(r.values[c.key] ?? "")}
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
  "enero","febrero","marzo","abril","mayo","junio","julio","agosto","setiembre","octubre","noviembre","diciembre"
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

const montoServ = (det) => {
  const cant = Number(det?.cantidad ?? 1) || 1;
  const tarifa = Number(det?.tarifa_monto ?? det?.precio_unitario ?? det?.circus_servicio?.precio ?? 0);
  return tarifa;
};
const montoProd = (det) => {
  const cant = Number(det?.cantidad ?? 1) || 1;
  const tarifa = Number(det?.tarifa_monto ?? det?.precio_unitario ?? det?.tb_producto?.prec_venta ?? 0);
  return tarifa;
};

/**
 * buildComparativoFromVentas
 * Calcula diferencia y % vs mes de referencia, para SERVICIOS, PRODUCTOS y TOTAL
 * @param ventas Array con objetos de venta
 * @param params { columns, cutDay, referenceMonth }  
 *  - columns: meses a mostrar, ej [{key:'marzo',label:'MARZO',currency:'S/.'}, ...]
 *  - cutDay: día de corte (1..31) incluido. Si no se define, usa mes completo.
 *  - referenceMonth: key del mes de referencia (ej. 'agosto'). Si no se define, usa el último mes presente en ventas.
 */
export function buildComparativoFromVentas(ventas = [], { columns = [], cutDay = null, referenceMonth = null } = {}) {
  const keys = columns.map((c) => c.key);
  const acc = {}; // { mes: { serv:0, prod:0 } }
  keys.forEach((k) => (acc[k] = { serv: 0, prod: 0 }));

  ventas.forEach((v) => {
    const mk = monthKey(v?.fecha_venta);
    if (!acc[mk]) return;
    if (cutDay && dayOfMonth(v?.fecha_venta) > cutDay) return;

    const srv = Array.isArray(v?.detalle_ventaMembresia) ? v.detalle_ventaMembresia : [];
    const prd = Array.isArray(v?.detalle_ventaProductos) ? v.detalle_ventaProductos : [];

    srv.forEach((d) => (acc[mk].serv += montoServ(d)));
    prd.forEach((d) => (acc[mk].prod += montoProd(d)));
  });

  // Mes de referencia
  let ref = referenceMonth;
  if (!ref) {
    // último mes presente con algún valor
    const withVal = keys.filter((k) => (acc[k]?.serv || acc[k]?.prod));
    ref = withVal.length ? withVal[withVal.length - 1] : keys[keys.length - 1];
  }
  const refServ = acc[ref]?.serv || 0;
  const refProd = acc[ref]?.prod || 0;
  const refTot = refServ + refProd;

  const diff = (v, r) => v - r;
  const ratio = (v, r) => (r ? (v - r) / r : 0);

  const secServicios = {
    name: "SERVICIOS",
    rows: [
      { label: "VENTAS", type: "currency-diff", values: keys.reduce((a, k) => (a[k] = diff(acc[k].serv, refServ), a), {}) },
      { label: "%",      type: "percent",       values: keys.reduce((a, k) => (a[k] = ratio(acc[k].serv, refServ), a), {}) },
    ],
  };
  const secProductos = {
    name: "PRODUCTOS",
    rows: [
      { label: "VENTAS", type: "currency-diff", values: keys.reduce((a, k) => (a[k] = diff(acc[k].prod, refProd), a), {}) },
      { label: "%",      type: "percent",       values: keys.reduce((a, k) => (a[k] = ratio(acc[k].prod, refProd), a), {}) },
    ],
  };
  const secTotal = {
    name: "TOTAL",
    rows: [
      { label: "VENTAS", type: "currency-diff", values: keys.reduce((a, k) => (a[k] = diff(acc[k].serv + acc[k].prod, refTot), a), {}) },
      { label: "%",      type: "percent",       values: keys.reduce((a, k) => (a[k] = ratio(acc[k].serv + acc[k].prod, refTot), a), {}) },
    ],
  };

  return {
    sections: [secServicios, secProductos, secTotal],
  };
}

/********************** Contenedor listo para usar *****************************/
export default function ComparativoVsActual({ ventas = [], columns, title = "COMPARATIVO MENSUAL VS MES ACTUAL", cutDay = null, referenceMonth = null }) {
  const cols = useMemo(() => columns && columns.length ? columns : [
    { key: "marzo", label: "MARZO", currency: "S/." },
    { key: "abril", label: "ABRIL", currency: "S/." },
    { key: "mayo", label: "MAYO", currency: "S/." },
    { key: "junio", label: "JUNIO", currency: "S/." },
    { key: "julio", label: "JULIO", currency: "S/." },
  ], []);

  const calc = useMemo(() => buildComparativoFromVentas(ventas, { columns: cols, cutDay, referenceMonth }), [ventas, cols, cutDay, referenceMonth]);

  const data = useMemo(() => ({ title, columns: cols, sections: calc.sections }), [title, cols, calc.sections]);

  return <ComparativeTable data={data} />;
}

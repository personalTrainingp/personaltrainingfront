import { useTerminoStore } from "@/hooks/hookApi/useTerminoStore";
import { arrayOrigenDeCliente } from "@/types/type";
import React, { useEffect, useMemo } from "react";

/********************** Utils ************************/ 
const MONTHS = [
  "enero","febrero","marzo","abril","mayo","junio","julio","agosto","setiembre","octubre","noviembre","diciembre"
];
const monthKey = (iso) => {
  const d = new Date(iso);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const lima = new Date(utc - 5 * 60 * 60000); // -05:00 Lima
  return MONTHS[lima.getMonth()];
};
const dayOfMonth = (iso) => {
  const d = new Date(iso);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const lima = new Date(utc - 5 * 60 * 60000);
  return lima.getDate();
};
const fmt2 = (n) => Number(n ?? 0);

/**************** Presentacional (estilo imagen) ****************/
/**
 * props.data = {
 *   title: 'CLIENTES POR ORIGEN',
 *   columns: [{ key:'marzo', label:'MARZO' }, ...],
 *   rows: [ { label:'WALK-IN', values:{ marzo:0, ... } }, ... ],
 *   totals: { marzo:0, ... } // totales por mes
 * }
 */
export function ClientesOrigenTable({ data }) {
  const { title, columns, rows, totals } = data;
  const { obtenerParametroPorEntidadyGrupo:obtenerOrigen, DataGeneral:dataorigen } = useTerminoStore()
  useEffect(() => {
    obtenerOrigen('nueva-venta-circus', 'origen')
  }, [])
  
  return (
    <div className="w-full py-4">
      {/* Header negro */}
      <div className="w-full bg-black text-white rounded-t-xl">
        <div className="mx-auto max-w-6xl px-4 py-3 text-center text-lg md:text-2xl font-extrabold">
          {title}
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-2xl rounded-b-xl ring-1 ring-black/10">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <th className="w-64 fs-3 bg-yellow-400 text-black font-extrabold uppercase border border-black text-left px-3 py-2">MES</th>
              {columns.map((c) => (
                <th key={c.key} className="fs-3 min-w-[120px] bg-yellow-400 text-black border border-black uppercase text-center px-3 py-2">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* {JSON.stringify(dataorigen)} */}
            {rows.map((r, idx) => (
              <tr key={r.label} className={idx % 2 ? "bg-neutral-50" : "bg-white"}>
                <td className="fs-3 border border-black px-3 py-2 text-left font-semibold uppercase">
                  {/* {typeof r.label} */}
                    {arrayOrigenDeCliente.find(origen=>origen.value=== Number(r.label))?.label}
                  </td>
                {columns.map((c) => (
                  <td key={c.key} className="fs-3 border border-black px-3 py-2 text-right font-semibold text-neutral-800">
                    {fmt2(r.values[c.key] ?? 0)}
                  </td>
                ))}
              </tr>
            ))}
            {/* Total clientes por origen (fila negra) */}
            <tr>
              <td className="bg-black text-white border border-black px-3 py-2 font-extrabold uppercase">TOTAL CLIENTES POR ORIGEN</td>
              {columns.map((c) => (
                <td key={c.key} className="fs-3 bg-black text-white border border-black px-3 py-2 text-right font-extrabold">
                  {fmt2(totals[c.key] ?? 0)}
                </td>
              ))}
            </tr>
          </tbody>

          {/* Footer tipo Excel amarillo */}
          <tfoot>
            <tr>
              <td className="bg-yellow-400 text-black border border-black px-3 py-4 fs-3">
                <div className="text-2xl font-extrabold uppercase leading-tight">CLIENTES TOTAL</div>
                <div className="text-sm font-bold uppercase -mt-1">ACUMULADO POR MES</div>
              </td>
              {columns.map((c) => (
                <td key={c.key} className="fs-1 bg-yellow-400 text-black border border-black px-3 py-4 text-right font-extrabold">
                  {fmt2(totals[c.key] ?? 0)}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

/**************** Adapter: ventas -> matriz por id_origen ****************/
/**
 * Cuenta ventas por id_origen y mes (o clientes únicos si uniqueByClient=true).
 * Aplica día de corte (cutDay) por mes.
 */
export function buildOrigenMatrixFromVentas(ventas = [], { columns = [], originMap = {}, originsOrder = [], cutDay = null, uniqueByClient = false } = {}) {
  const keys = columns.map((c) => c.key);

  // preparar estructura
  const totals = keys.reduce((a, k) => (a[k] = 0, a), {});
  const byOrigin = new Map(); // label -> { mes: count }
  const seen = new Set(); // para clientes únicos

  const ensureRow = (label) => {
    if (!byOrigin.has(label)) byOrigin.set(label, keys.reduce((a, k) => (a[k] = 0, a), {}));
    return byOrigin.get(label);
  };

  ventas.forEach((v) => {
    const mk = monthKey(v?.fecha_venta);
    if (!keys.includes(mk)) return;
    if (cutDay && dayOfMonth(v?.fecha_venta) > cutDay) return;

    const label = (originMap?.[v?.id_origen] ?? String(v?.id_origen ?? "Desconocido")).toUpperCase();

    if (uniqueByClient) {
      const idc = v?.id_cli ?? `venta:${v?.id}`;
      const key = `${mk}|${label}|${idc}`;
      if (seen.has(key)) return;
      seen.add(key);
      const row = ensureRow(label);
      row[mk] += 1;
      totals[mk] += 1;
    } else {
      const row = ensureRow(label);
      row[mk] += 1;        // cuenta ventas
      totals[mk] += 1;
    }
  });

  // ordenar filas: originsOrder (por label) si viene; si no, alfabético
  let rows = Array.from(byOrigin.entries()).map(([label, values]) => ({ label, values }));
  if (originsOrder?.length) {
    const orderMap = new Map(originsOrder.map((l, i) => [l.toUpperCase(), i]));
    rows.sort((a, b) => (orderMap.get(a.label) ?? 999) - (orderMap.get(b.label) ?? 999) || a.label.localeCompare(b.label));
  } else {
    rows.sort((a, b) => a.label.localeCompare(b.label));
  }

  return { rows, totals };
}

/**************** Contenedor listo para usar ****************/
export default function ClientesPorOrigen({ ventas = [], columns, title = "CLIENTES POR ORIGEN", originMap = {}, originsOrder = [], cutDay = null, uniqueByClient = false }) {
  const cols = useMemo(() => (columns && columns.length ? columns : [
    { key: "marzo",  label: "MARZO" },
    { key: "abril",  label: "ABRIL" },
    { key: "mayo",   label: "MAYO" },
    { key: "junio",  label: "JUNIO" },
    { key: "julio",  label: "JULIO" },
    { key: "agosto", label: "AGOSTO" },
  ]), [columns]);

  const { rows, totals } = useMemo(() => buildOrigenMatrixFromVentas(ventas, { columns: cols, originMap, originsOrder, cutDay, uniqueByClient }), [ventas, cols, originMap, originsOrder, cutDay, uniqueByClient]);

  const data = useMemo(() => ({ title, columns: cols, rows, totals }), [title, cols, rows, totals]);

  return <ClientesOrigenTable data={data} />;
}

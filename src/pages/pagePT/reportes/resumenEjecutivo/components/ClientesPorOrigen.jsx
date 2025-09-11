import { useTerminoStore } from "@/hooks/hookApi/useTerminoStore";
import { arrayOrigenDeCliente } from "@/types/type";
import React, { useEffect, useMemo } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Lima");

/********************** Utils ************************/
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

const fmt2 = (n) => Number(n ?? 0);

/**************** Presentacional (estilo imagen) ****************/
/**
 * props.data = {
 *   title: 'CLIENTES POR ORIGEN',
 *   columns: [{ key:'marzo', label:'MARZO' }, ...],
 *   rows: [ { label: <id_origen:number>, values:{ marzo:0, ... } }, ... ],
 *   totals: { marzo:0, ... }
 * }
 */
export function ClientesOrigenTable({ data, initDay, cutDay }) {
  const { title, columns, rows, totals } = data;
  const { obtenerParametroPorEntidadyGrupo: obtenerOrigen, DataGeneral: dataorigen } = useTerminoStore();

  useEffect(() => {
    obtenerOrigen("nueva-venta-circus", "origen");
  }, []);

  const labelForOrigen = (id) => {
    const num = Number(id);
    // 1) Prioriza tabla estática si existe
    const fromStatic = arrayOrigenDeCliente.find((o) => o.value === num)?.label;
    if (fromStatic) return fromStatic;
    // 2) Fallback a parámetros cargados (si expone label_param/value)
    const fromStore = Array.isArray(dataorigen)
      ? dataorigen.find((o) => Number(o?.value) === num)?.label_param
      : undefined;
    if (fromStore) return fromStore;
    // 3) Fallback final
    return String(id);
  };

  return (
    <div className="w-full py-4">
      {/* Header negro */}
      <div className="w-full bg-black text-white rounded-t-xl">
        <div className="mx-auto max-w-6xl px-4 py-3 text-center text-lg md:text-2xl font-extrabold">
          {title} del {initDay} hasta {cutDay}
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-2xl rounded-b-xl ring-1 ring-black/10">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <th className="w-64 fs-3 bg-primary text-black font-extrabold uppercase border border-black text-left px-3 py-2">
                MES
              </th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="fs-3 min-w-[120px] bg-primary text-black border border-black uppercase text-center px-3 py-2"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.label} className={idx % 2 ? "bg-neutral-50" : "bg-white"}>
                <td className="fs-3 border border-black px-3 py-2 text-left font-semibold uppercase">
                  {labelForOrigen(r.label)}
                </td>
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className="fs-3 border border-black px-3 py-2 text-right font-semibold text-neutral-800"
                  >
                    {fmt2(r.values[c.key] ?? 0)}
                  </td>
                ))}
              </tr>
            ))}
            {/* Total clientes por origen (fila negra) */}
            <tr>
              <td className="bg-black text-white border border-black px-3 py-2 font-extrabold uppercase">
                TOTAL CLIENTES POR ORIGEN
              </td>
              {columns.map((c) => (
                <td
                  key={c.key}
                  className="fs-3 bg-black text-white border border-black px-3 py-2 text-right font-extrabold"
                >
                  {fmt2(totals[c.key] ?? 0)}
                </td>
              ))}
            </tr>
          </tbody>

          {/* Footer tipo Excel amarillo */}
          <tfoot>
            <tr>
              <td className="bg-primary text-black border border-black px-3 py-4 fs-3">
                <div className="text-2xl font-extrabold uppercase leading-tight">
                  CLIENTES TOTAL
                </div>
                <div className="text-sm font-bold uppercase -mt-1">
                  ACUMULADO POR MES
                </div>
              </td>
              {columns.map((c) => (
                <td
                  key={c.key}
                  className="fs-1 bg-primary text-black border border-black px-3 py-4 text-right font-extrabold"
                >
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
 * Aplica ventana de días [initDay..cutDay] por mes.
 *
 * - originsOrder: array de ids de origen para ordenar (p.ej. [691,692,1458,...])
 */
export function buildOrigenMatrixFromVentas(
  ventas = [],
  {
    columns = [],
    originMap = {},      // opcional (no necesario para render si usas arrayOrigenDeCliente)
    originsOrder = [],   // array de ids (números)
    initDay = 0,
    cutDay = 0,
    uniqueByClient = false,
  } = {}
) {
  const keys = columns.map((c) => c.key);

  const totals = keys.reduce((a, k) => ((a[k] = 0), a), {});
  const byOrigin = new Map(); // id_origen:number -> { mesKey: count }
  const seen = new Set();     // para unicidad

  const ensureRow = (idOrigen) => {
    if (!byOrigin.has(idOrigen)) {
      byOrigin.set(
        idOrigen,
        keys.reduce((a, k) => ((a[k] = 0), a), {})
      );
    }
    return byOrigin.get(idOrigen);
  };

  for (const v of ventas) {
    const mk = monthKey(v?.fecha_venta);
    if (!keys.includes(mk)) continue;
    if (!inWindowByDay(v?.fecha_venta, initDay, cutDay)) continue;

    const idOrigen = Number(v?.id_origen ?? -1); // -1 => desconocido
    const row = ensureRow(idOrigen);

    if (uniqueByClient) {
      const idc = v?.id_cli ?? `venta:${v?.id}`;
      const key = `${mk}|${idOrigen}|${idc}`; // único por mes+origen+cliente
      if (seen.has(key)) continue;
      seen.add(key);
      row[mk] += 1;
      totals[mk] += 1;
    } else {
      row[mk] += 1; // cuenta ventas
      totals[mk] += 1;
    }
  }

  // Construir filas [{label: id_origen, values:{...}}]
  let rows = Array.from(byOrigin.entries()).map(([idOrigen, values]) => ({
    label: idOrigen,
    values,
  }));

  // Orden: por originsOrder (ids). Si no, numérico asc.
  if (originsOrder?.length) {
    const orderMap = new Map(originsOrder.map((id, i) => [Number(id), i]));
    rows.sort(
      (a, b) =>
        (orderMap.get(a.label) ?? 9999) - (orderMap.get(b.label) ?? 9999) ||
        Number(a.label) - Number(b.label)
    );
  } else {
    rows.sort((a, b) => Number(a.label) - Number(b.label));
  }

  return { rows, totals };
}

/**************** Contenedor listo para usar ****************/
export default function ClientesPorOrigen({
  ventas = [],
  columns,
  title = `CLIENTES POR ORIGEN`,
  originMap = {},
  originsOrder = [],
  cutDay = null,
  initDay = null,
  uniqueByClient = false,
}) {
  const cols = useMemo(
    () =>
      columns && columns.length
        ? columns
        : [
            { key: "marzo", label: "MARZO" },
            { key: "abril", label: "ABRIL" },
            { key: "mayo", label: "MAYO" },
            { key: "junio", label: "JUNIO" },
            { key: "julio", label: "JULIO" },
            { key: "agosto", label: "AGOSTO" },
          ],
    [columns]
  );

  const { rows, totals } = useMemo(
    () =>
      buildOrigenMatrixFromVentas(ventas, {
        columns: cols,
        originMap,
        originsOrder,
        initDay,
        cutDay,
        uniqueByClient,
      }),
    [ventas, cols, originMap, originsOrder, initDay, cutDay, uniqueByClient]
  );

  const data = useMemo(
    () => ({ title, columns: cols, rows, totals }),
    [title, cols, rows, totals]
  );

  return <ClientesOrigenTable data={data} cutDay={cutDay} initDay={initDay}/>;
}

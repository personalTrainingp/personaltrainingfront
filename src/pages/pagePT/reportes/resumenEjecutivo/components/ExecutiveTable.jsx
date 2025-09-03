// components/ExecutiveTable.jsx
import React from "react";

// data.shape:
// {
//   titleLeft, titleRight,
//   columns: [{ key:'marzo', label:'MARZO', currency:'S/.' }, ...],
//   rows: [{ label, key, type:'currency'|'number', values:{ marzo: 0, ... }, emphasis? }, ...],
//   footer: { label, type:'currency'|'number', values:{ marzo: 0, ... } }
// }

const fmtCurrency = (n) => {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "";
  try {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(Number(n));
  } catch {
    return `${Number(n)}`;
  }
};
const fmtNumber = (n) =>
  n === null || n === undefined ? "" : new Intl.NumberFormat("es-PE").format(Number(n));

const Cell = ({ type, value }) => (type === "currency" ? fmtCurrency(value) : fmtNumber(value));

export default function ExecutiveTable({ data, cutDay }) {
  const { titleLeft, titleRight, columns, rows, footer } = data;

  return (
    <div>
      {/* Header negro */}
      <div className="w-full bg-black text-white rounded-t-2xl">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xl md:text-2xl font-extrabold">
        {titleRight}
        </div>
        </div>
      <div className="overflow-x-auto bg-white shadow-2xl rounded-b-2xl ring-1 ring-black/10">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <th className="bg-primary text-black border border-black px-3 text-left uppercase font-extrabold fs-3">
                <div className="">
                  MES
                </div>
              </th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="bg-primary text-black border border-black px-3 text-left uppercase font-extrabold fs-3"
                >
                  <div className="">
                    <div className="font-extrabold text-center">{c.label}</div>
                    {/* <div className="font-extrabold">{c.currency ?? "S/."}</div> */}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

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
                <tr key={r.key} className={baseRow}>
                  <td
                    className={`fs-3 border border-black font-semibold ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    <div className="text-black bg-primary" style={{width: '350px'}}>
                      {r.label}
                    </div>
                  </td>
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={`pl-4 border border-black text-right ${
                        isDark ? "text-white" : "text-black"
                      }`}
                      style={{fontSize: '20px'}}
                    >
                      <Cell type={r.type} value={r.values[c.key]} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr>
              <td className="bg-primary text-black border border-black py-2 fs-3">
                <div className="font-extrabold uppercase leading-tight">VENTA TOTAL</div>
                <div className="font-bold uppercase -mt-1">ACUMULADA POR MES</div>
              </td>
              {columns.map((c) => (
                <td
                  key={c.key}
                  className="fs-2 bg-primary text-black border border-black pl-4 text-right font-extrabold"
                >
                  <Cell type={footer.type} value={footer.values[c.key]} />
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

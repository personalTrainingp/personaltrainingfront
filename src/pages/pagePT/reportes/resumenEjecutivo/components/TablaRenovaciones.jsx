import React from "react";

const formatMonthYear = (date) =>
  date.toLocaleDateString("es-ES", { month: "short", year: "numeric" });

const getMonthKeys = (baseDate, months) => {
  const keys = [];
  const base = new Date(baseDate);
  base.setDate(1); // primer día del mes base
  for (let i = 0; i < months; i++) {
    const monthDate = new Date(base);
    monthDate.setMonth(base.getMonth() - i);
    keys.push(monthDate); 
  }
  return keys.reverse();
};
const toLimaDate = (iso) => {
  if (!iso) return null;
  try {
    const d = new Date(String(iso).replace(" ", "T"));
    if (isNaN(d)) return null;
    const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
    return new Date(utcMs - 5 * 60 * 60000);
  } catch {
    return null;
  }
};

const getMembershipItems = (v) => {
  const items =
    v?.detalle_ventaMembresia ??
    v?.detalle_ventaMembresium ??
    v?.detalle_ventamembresia ??
    v?.detalle_venta_membresia ??
    [];
  return Array.isArray(items) ? items : [];
};

const hasPaidMembership = (v) =>
  getMembershipItems(v).some(
    (it) => Number(it?.tarifa_monto ?? it?.monto ?? it?.precio ?? it?.tarifa ?? it?.precio_total) > 0
  );

const getOriginId = (v) => {
  const tipoFactura = v?.id_tipoFactura ?? v?.tb_ventum?.id_tipoFactura;
  if (tipoFactura === 703) return 703; // Canje
  if (tipoFactura === 701) return 701; // Traspaso
  if (!hasPaidMembership(v)) {
    return 703; // Forzar a Canje si es gratis
  }
  return v?.id_origen ??
    v?.tb_ventum?.id_origen ??
    null; // Solo nos importa el id_origen
};
const C = {
  black: "#000",
  red: "#c00000",
  white: "#fff",
  border: "1px solid #333",
};
const sTitle = {
  background: C.black,
  color: C.white,
  textAlign: "center",
  padding: "25px 12px",
  fontWeight: 700,
  fontSize: 25,
};
const sTable = {
  width: "100%",
  borderCollapse: "collapse",
  tableLayout: "fixed",
};
const sHeadLeft = {
  background: C.red,
  color: C.white,
  padding: "10px",
  border: C.border,
  textAlign: "left",
  width: 260,
  fontSize: 20, // Ajustado para "Métrica"
};
const sHead = {
  background: C.red,
  color: C.white,
  padding: "10px",
  border: C.border,
  textAlign: "center",
  fontSize: 20, // Ajustado para meses
};
const sCell = {
  background: C.white,
  color: "#000",
  padding: "10px",
  border: C.border,
  fontSize: 22,
  textAlign: "center",
  fontWeight: 500,
};
const sCellLeft = {
  ...sCell,
  textAlign: "left",
  fontWeight: 700,
  fontSize: 19, 
};

export default function TablaRenovaciones({
items={items},
  base = new Date(),
  months = 8,
  title = "Renovaciones y Vencimientos",
  
}) {
  const monthKeys = getMonthKeys(base, months);
  const DEFAULT_TARGET = 0.3;

  const statsByMonth = React.useMemo(() => {
    const stats = new Map();
    monthKeys.forEach((m) => {
      const key = formatMonthYear(m);
      stats.set(key, { vencimientos: 0, renovaciones: 0 });
    });

    for (const venta of items) {
      const d = toLimaDate(venta?.fecha_venta);
      if (!d) continue;

      const key = formatMonthYear(d);
      if (!stats.has(key)) continue; 

      const monthStats = stats.get(key);
      const originId = getOriginId(venta); 

      
         if (originId !== 691 && originId !== 701 && originId !== 703) {
         monthStats.vencimientos += 1;
         } 
      else if (originId === 691) {
        monthStats.renovaciones += 1;
      }
    }

     return stats;
}, [items, monthKeys]);


  const getTableRows = () => {
    const rows = {
      renovaciones: { label: " Renovaciones del Mes", values: [] },
      porcentaje: { label: "Renovaciones %", values: [] },
      vencimientos: { label: " Vencimientos por Mes", values: [] },
      pendientes: { label: " Pendiente de Renovaciones", values: [] },
      recuperacion: {label:"Recuperación Cartera",values:[]},
    };

    const headers = monthKeys.map(formatMonthYear);
    const vencsRaws=headers.map((h) =>statsByMonth.get(h)?.vencimientos ?? 0);
   const vencs = headers.map((h) => statsByMonth.get(h)?.vencimientos ?? 0);
    const renos = headers.map((h) => statsByMonth.get(h)?.renovaciones ?? 0);
    const pendientes = vencs.map((v, i) => Math.max(v - renos[i], 0));
const firstIdx = pendientes.findIndex((v)=> v >0);
let acumulada=0;

    for (let i = 0; i < headers.length; i++) {
      const porcentaje = vencs[i] > 0 ? (renos[i] / vencs[i]) * 100 : 0;

      rows.renovaciones.values.push(renos[i]);
      rows.porcentaje.values.push(`${porcentaje.toFixed(1)}%`);
      rows.vencimientos.values.push(vencs[i]);
      rows.pendientes.values.push(pendientes[i]);

      if(firstIdx ===-1 || i < firstIdx){
        rows.recuperacion.values.push(0);
      }else{
        if(i ===firstIdx){
          acumulada=pendientes[i]
        }else{
          acumulada+=pendientes[i]
        }
rows.recuperacion.values.push(acumulada)
      }
    
}
            return Object.values(rows);

  };

  const tableRows = getTableRows();
const tableHeaders = monthKeys.map(formatMonthYear);

  const currentYear = base.getFullYear();
  const currentYearStr = String(currentYear);

  const formatHeaderForDisplay = (fullHeaderKey) => {

    const parts = fullHeaderKey
        .replace(".", "")      
        .split(" ")           
        .filter(Boolean);     

    const month = parts[0] || "";
    const year = parts[1] || "";

 if (year === currentYearStr) {
      return month.toUpperCase();
    }
    return fullHeaderKey.replace(".", "").toUpperCase();
  };
  
  return (
    <div style={{ fontFamily: "Inter, system-ui, Segoe UI, Roboto, sans-serif" }}>
      <h2 style={sTitle}>{title}</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={sTable}>
          <thead>
            <tr>
              <th style={sHeadLeft}>
                Métrica
              </th>
              {tableHeaders.map((headerKey) => (
                <th
                  key={headerKey}
                  style={sHead}
                >
{formatHeaderForDisplay(headerKey)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.label}>
                <td style={sCellLeft}>
                  {row.label}
                </td>
                {row.values.map((value, index) => (
                  <td
                    key={index}
                    style={sCell}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import React from "react";

const getSortableKey = (date) => {
  const m = date.getMonth() + 1;
  return `${date.getFullYear()}-${String(m).padStart(2, '0')}`;
};

const getMonthKeys = (baseDate, months) => {
  const keys = [];
  const base = new Date(baseDate);
  base.setDate(1);
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
    (it) => Number(it?.tarifa_monto ?? it?.monto ?? it?.precio ?? it?.tarifa ?? it?.precio_total)
  );

const getOriginId = (v) => {
  const tipoFactura = v?.id_tipoFactura ?? v?.tb_ventum?.id_tipoFactura;

  if (tipoFactura === 703) return 703;
  if (tipoFactura === 701) return 701;
  if (!hasPaidMembership(v)) return 703;
  return v?.id_origen ?? v?.tb_ventum?.id_origen ?? null;
};

// Estilos
const C = { black: "#000", red: "#c00000", white: "#fff", border: "1px solid #333" };
const sTitle = { background: C.black, color: C.white, textAlign: "center", padding: "25px 12px", fontWeight: 700, fontSize: 25 };
const sTable = { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" };
const sHeadLeft = { background: C.red, color: C.white, padding: "10px", border: C.border, textAlign: "left", width: 260, fontSize: 20 };
const sHead = { background: C.red, color: C.white, padding: "10px", border: C.border, textAlign: "center", fontSize: 20 };
const sCell = { background: C.white, color: "#000", padding: "10px", border: C.border, fontSize: 22, textAlign: "center", fontWeight: 500 };
const sCellLeft = { ...sCell, textAlign: "left", fontWeight: 700, fontSize: 19 };

export default function TablaRenovaciones({
  items = [],
  base = new Date(),
  months = 8,
  title = "Renovaciones y Vencimientos",
  carteraHistoricaInicial = 0,
  datosVencimientos = {},
  vencimientosFiltrados = null,
}) {
  const visibleMonthDates = getMonthKeys(base, months);

  const fullHistoryStats = React.useMemo(() => {
    const statsMap = new Map();

    const mapSeguro = {};

    if (Array.isArray(datosVencimientos)) {
      datosVencimientos.forEach(row => {
        if (row.Mes) {
          mapSeguro[row.Mes] = {
            vencimientos: row["Vencimientos (Fec Fin)"] || row.vencimientos || 0,
            renovaciones: row["Renovaciones (Pagadas)"] || row["RENOVACIONES DEL MES"] || row.renovaciones || 0,
            pendiente: row["Pendiente Real"] || row["PENDIENTE DE RENOVACIONES"] || row.pendiente || 0,
            acumulado: row["ACUMULADO CARTERA"] || row.acumulado || 0
          };
        }
      });
    } else if (typeof datosVencimientos === 'object' && datosVencimientos !== null) {
      Object.keys(datosVencimientos).forEach(key => {
        const val = datosVencimientos[key];
        if (typeof val === 'object') {
          mapSeguro[key] = {
            vencimientos: val["Vencimientos (Fec Fin)"] || val.vencimientos || 0,
            renovaciones: val["Renovaciones (Pagadas)"] || val["RENOVACIONES DEL MES"] || val.renovaciones || 0,
            pendiente: val["Pendiente Real"] || val["PENDIENTE DE RENOVACIONES"] || val.pendiente || 0,
            acumulado: val["ACUMULADO CARTERA"] || val.acumulado || 0
          };
        } else {
          mapSeguro[key] = { vencimientos: val, renovaciones: 0, pendiente: 0, acumulado: 0 };
        }
      });
    }

    // Bypass local calculation from items as per user request to show backend data "as is"
    /* for (const venta of items) { ... } */

    // 3. Fill 'vencimientos' from mapSeguro OR override with 'vencimientosFiltrados'
    const currentMonthKey = getSortableKey(base);

    Object.keys(mapSeguro).forEach((key) => {
      if (!statsMap.has(key)) {
        statsMap.set(key, { vencimientos: 0, renovaciones: 0, pendiente: 0, acumulado: 0 });
      }
      const data = mapSeguro[key];
      const target = statsMap.get(key);

      target.vencimientos = Number(data.vencimientos || 0);
      target.renovaciones = Number(data.renovaciones || 0);
      target.pendiente = Number(data.pendiente || 0);
      target.acumulado = Number(data.acumulado || 0);

      if (key === currentMonthKey && vencimientosFiltrados !== null) {
        target.vencimientos = Number(vencimientosFiltrados);

      }
    });

    visibleMonthDates.forEach(d => {
      const key = getSortableKey(d);
      if (!statsMap.has(key)) {
        statsMap.set(key, { vencimientos: 0, renovaciones: 0, pendiente: 0, acumulado: 0 });
      }
    });

    return statsMap;
  }, [items, carteraHistoricaInicial, visibleMonthDates, datosVencimientos, vencimientosFiltrados]);

  const getTableRows = () => {
    const rows = {
      renovaciones: { label: " Renovaciones del Mes", values: [] },
      porcentaje: { label: "Renovaciones %", values: [] },
      vencimientos: { label: " Vencimientos por Mes", values: [] },
      pendientes: { label: " Pendiente de Renovaciones", values: [] },
      recuperacion: { label: "Acumulado Cartera", values: [] },
    };

    visibleMonthDates.forEach(dateObj => {
      const key = getSortableKey(dateObj);
      const stat = fullHistoryStats.get(key) || { vencimientos: 0, renovaciones: 0, pendiente: 0, acumulado: 0 };

      const porcentaje = stat.vencimientos > 0
        ? (stat.renovaciones / stat.vencimientos) * 100
        : 0;

      rows.renovaciones.values.push(stat.renovaciones);
      rows.porcentaje.values.push(`${porcentaje.toFixed(1)}%`);
      rows.vencimientos.values.push(stat.vencimientos);
      rows.pendientes.values.push(stat.pendiente);
      rows.recuperacion.values.push(stat.acumulado);
    });

    return Object.values(rows);
  };

  const tableRows = getTableRows();
  const currentYear = base.getFullYear();
  const currentYearStr = String(currentYear);

  const formatHeaderForDisplay = (dateObj) => {
    const mShort = dateObj.toLocaleDateString("es-ES", { month: "short" }).toUpperCase();
    const y = dateObj.getFullYear();
    if (String(y) === currentYearStr) return mShort;
    return `${mShort} ${y}`;
  };

  return (
    <div style={{ fontFamily: "Inter, system-ui, Segoe UI, Roboto, sans-serif" }}>
      <h2 style={sTitle}>{title}</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={sTable}>
          <thead>
            <tr>
              <th style={sHeadLeft}>Métrica</th>
              {visibleMonthDates.map((d, idx) => (
                <th key={idx} style={sHead}>
                  {formatHeaderForDisplay(d)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.label}>
                <td style={sCellLeft}>{row.label}</td>
                {row.values.map((value, index) => (
                  <td key={index} style={sCell}>
                    {row.label === "Renovaciones %" ? value : Number(value).toLocaleString("es-ES")}
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
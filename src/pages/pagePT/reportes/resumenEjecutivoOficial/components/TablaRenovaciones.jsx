import React from "react";

// Formato visual para la cabecera (ej: "DIC 2024")
const formatMonthYear = (date) =>
  date.toLocaleDateString("es-ES", { month: "short", year: "numeric" });

// Formato interno ordenable para lógica (ej: "2024-12")
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
    (it) => Number(it?.tarifa_monto ?? it?.monto ?? it?.precio ?? it?.tarifa ?? it?.precio_total) > 0
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
          mapSeguro[row.Mes] = row["Vencimientos (Fec Fin)"] || row.cantidad || 0;
        }
      });
    } else if (typeof datosVencimientos === 'object' && datosVencimientos !== null) {
      Object.keys(datosVencimientos).forEach(key => {
        const val = datosVencimientos[key];
        const num = (typeof val === 'object')
          ? (val["Vencimientos (Fec Fin)"] || val.vencimientos || 0)
          : val;
        mapSeguro[key] = num;
      });
    }

    for (const venta of items) {
      const d = toLimaDate(venta?.fecha_venta);
      if (!d) continue;

      const key = getSortableKey(d);

      if (!statsMap.has(key)) {
        statsMap.set(key, { vencimientos: 0, renovaciones: 0, pendiente: 0, acumulado: 0 });
      }

      const monthStats = statsMap.get(key);
      const originId = getOriginId(venta);

      if (originId === 691) {
        monthStats.renovaciones += 1;
      }
    }

    // 3. Fill 'vencimientos' from mapSeguro OR override with 'vencimientosFiltrados'
    const currentMonthKey = getSortableKey(base);

    Object.keys(mapSeguro).forEach((key) => {
      if (!statsMap.has(key)) {
        statsMap.set(key, { vencimientos: 0, renovaciones: 0, pendiente: 0, acumulado: 0 });
      }

      // Override for current month if we have a filtered value
      if (key === currentMonthKey && vencimientosFiltrados !== null) {
        statsMap.get(key).vencimientos = Number(vencimientosFiltrados);
      } else {
        statsMap.get(key).vencimientos = Number(mapSeguro[key] || 0);
      }
    });

    const sortedKeys = Array.from(statsMap.keys()).sort();
    visibleMonthDates.forEach(d => {
      const key = getSortableKey(d);
      if (!statsMap.has(key)) sortedKeys.push(key);
    });

    const uniqueSortedKeys = [...new Set(sortedKeys)].sort();

    let runningTotal = carteraHistoricaInicial;

    uniqueSortedKeys.forEach(key => {
      if (!statsMap.has(key)) {
        statsMap.set(key, { vencimientos: 0, renovaciones: 0, pendiente: 0, acumulado: 0 });
      }
      const data = statsMap.get(key);

      const diff = data.vencimientos - data.renovaciones;
      data.pendiente = Math.max(diff, 0);

      runningTotal += data.pendiente;
      data.acumulado = runningTotal;
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
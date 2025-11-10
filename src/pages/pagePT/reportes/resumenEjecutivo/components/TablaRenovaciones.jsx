import React from "react";

const formatMonthYear = (date) =>
  date.toLocaleDateString("es-ES", { month: "short", year: "numeric" });

/** Genera fechas (primer día) para los últimos 'months' meses, desde base hacia atrás */
const getMonthKeys = (baseDate, months) => {
  const keys = [];
  const base = new Date(baseDate);
  base.setDate(1); // primer día del mes base
  for (let i = 0; i < months; i++) {
    const monthDate = new Date(base);
    monthDate.setMonth(base.getMonth() - i);
    keys.push(monthDate); // OJO: orden = más reciente -> más antiguo
  }
  return keys.reverse();
};

// --- Constantes de estilo (del archivo ClientesPorOrigen) ---
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
  fontSize: 22, // Ajustado
  textAlign: "center",
  fontWeight: 500,
};
const sCellLeft = {
  ...sCell,
  textAlign: "left",
  fontWeight: 700,
  fontSize: 19, // Ajustado
};
// --- Fin de constantes de estilo ---

export default function TablaRenovaciones({
  items = [],
  base = new Date(),
  months = 8,
  title = "Renovaciones y Vencimientos",
}) {
  const monthKeys = getMonthKeys(base, months);
  const DEFAULT_TARGET = 0.3; // 30% si no hay histórico

  const statsByMonth = React.useMemo(() => {
    const stats = new Map();
    monthKeys.forEach((m) => {
      const key = formatMonthYear(m);
      stats.set(key, { vencimientos: 0, renovaciones: 0 });
    });

    // Llenar stats
    for (const item of items) {
      if (!item.fechaFin) continue;
      // Forzamos mediodía UTC para evitar desfaces horarios
      const finDate = new Date(item.fechaFin + "T12:00:00Z");
      const key = formatMonthYear(finDate);
      if (!stats.has(key)) continue;

      const monthStats = stats.get(key);
      monthStats.vencimientos += 1;
      if (item.fechaRenovacion) monthStats.renovaciones += 1;
    }

    return stats;
  }, [items, monthKeys]);

  const getTableRows = () => {
    const rows = {
      renovaciones: { label: " Renovaciones del Mes", values: [] },
      porcentaje: { label: "Renovaciones %", values: [] },
      vencimientos: { label: " Vencimientos por Mes", values: [] },
      pendientes: { label: " Pendiente de Renovaciones", values: [] },
      recuperacion: { label: " Recuperación sugerida", values: [] },
    };

    // Construimos arrays alineados a las columnas (mismo orden que monthKeys)
    const headers = monthKeys.map(formatMonthYear);
    const vencs = headers.map((h) => statsByMonth.get(h)?.vencimientos ?? 0);
    const renos = headers.map((h) => statsByMonth.get(h)?.renovaciones ?? 0);
    const pendientes = vencs.map((v, i) => Math.max(v - renos[i], 0));
    const tasaMes = vencs.map((v, i) => (v > 0 ? renos[i] / v : null));

    // Promedio móvil de los "3 meses anteriores" (en este arreglo, los anteriores están a la derecha: i+1..i+3)
    const recSugerida = vencs.map((_, i) => {
      const prev = [];
      for (let j = i + 1; j <= i + 3 && j < tasaMes.length; j++) {
        if (tasaMes[j] != null) prev.push(tasaMes[j]);
      }
      const avg = prev.length
        ? prev.reduce((a, b) => a + b, 0) / prev.length
        : DEFAULT_TARGET;
      // Redondear la recuperación sugerida
      return Math.round(pendientes[i] * avg);
    });

    // Llenamos filas
    for (let i = 0; i < headers.length; i++) {
      const porcentaje = vencs[i] > 0 ? (renos[i] / vencs[i]) * 100 : 0;

      rows.renovaciones.values.push(renos[i]);
      rows.porcentaje.values.push(`${porcentaje.toFixed(1)}%`);
      rows.vencimientos.values.push(vencs[i]);
      rows.pendientes.values.push(pendientes[i]);
      rows.recuperacion.values.push(recSugerida[i]);
    }

    return Object.values(rows);
  };

  const tableRows = getTableRows();
  const tableHeaders = monthKeys.map(formatMonthYear);

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
              {tableHeaders.map((header) => (
                <th
                  key={header}
                  style={sHead}
                >
                  {header}
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

      <p style={{ marginTop: '1rem', padding: '0 0.5rem', fontSize: '0.75rem', color: '#333', fontStyle: 'italic' }}>
        * Recuperación sugerida = Pendientes × promedio de tasa de renovación de los
        3 meses anteriores (si no hay histórico, se usa 30%).
      </p>
    </div>
  );
}
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
  return keys.reverse(); // Orden cronológico visual
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
}) {
  // 1. Definimos las columnas VISIBLES que quiere el usuario
  const visibleMonthDates = getMonthKeys(base, months);
  const visibleKeysSet = new Set(visibleMonthDates.map(d => getSortableKey(d)));

  // 2. Procesamos TODOS los datos (incluso los anteriores a la tabla visible)
  const fullHistoryStats = React.useMemo(() => {
    const statsMap = new Map();

    // Barrido de todos los items para llenar el mapa por mes (YYYY-MM)
    for (const venta of items) {
      const d = toLimaDate(venta?.fecha_venta);
      if (!d) continue;

      const key = getSortableKey(d); // "2024-09", "2024-10", etc.
      
      if (!statsMap.has(key)) {
        statsMap.set(key, { vencimientos: 0, renovaciones: 0, pendiente: 0, acumulado: 0 });
      }

      const monthStats = statsMap.get(key);
      const originId = getOriginId(venta);

      if (originId !== 691 && originId !== 701 && originId !== 703) {
        monthStats.vencimientos += 1;
      } else if (originId === 691) {
        monthStats.renovaciones += 1;
      }
    }

    // 3. Ordenamos TODA la historia cronológicamente
    // Esto asegura que si hay datos en Sept, Oct, Nov, se procesen antes de Dic
    const sortedKeys = Array.from(statsMap.keys()).sort();
    
    // Si queremos asegurarnos de incluir los meses visibles aunque no tengan datos
    visibleMonthDates.forEach(d => {
       const key = getSortableKey(d);
       if(!statsMap.has(key)) sortedKeys.push(key);
    });
    // Re-ordenar con los meses vacíos incluidos si es necesario
    const uniqueSortedKeys = [...new Set(sortedKeys)].sort();

    // 4. Calculamos la suma acumulada corrida
    let runningTotal = carteraHistoricaInicial;

    uniqueSortedKeys.forEach(key => {
        if (!statsMap.has(key)) {
            statsMap.set(key, { vencimientos: 0, renovaciones: 0, pendiente: 0, acumulado: 0 });
        }
        const data = statsMap.get(key);
        
        // Calculamos pendiente del mes
        data.pendiente = Math.max(data.vencimientos - data.renovaciones, 0);
        
        // Sumamos al acumulado histórico
        runningTotal += data.pendiente;
        data.acumulado = runningTotal;
    });

    return statsMap;
  }, [items, carteraHistoricaInicial, visibleMonthDates]); // Dependencias limpias

  // 5. Construimos solo las filas VISIBLES consultando el mapa histórico
  const getTableRows = () => {
    const rows = {
      renovaciones: { label: " Renovaciones del Mes", values: [] },
      porcentaje: { label: "Renovaciones %", values: [] },
      vencimientos: { label: " Vencimientos por Mes", values: [] },
      pendientes: { label: " Pendiente de Renovaciones", values: [] },
      recuperacion: { label: "Acumulado Cartera", values: [] },
    };

    // Iteramos solo por las columnas que se van a pintar
    visibleMonthDates.forEach(dateObj => {
        const key = getSortableKey(dateObj);
        // Recuperamos el dato ya calculado (que trae la carga histórica)
        // Si no existe datos para ese mes (futuro?), defaults a 0
        const stat = fullHistoryStats.get(key) || { vencimientos: 0, renovaciones: 0, pendiente: 0, acumulado: 0 };

        const porcentaje = stat.vencimientos > 0 
            ? (stat.renovaciones / stat.vencimientos) * 100 
            : 0;

        rows.renovaciones.values.push(stat.renovaciones);
        rows.porcentaje.values.push(`${porcentaje.toFixed(1)}%`);
        rows.vencimientos.values.push(stat.vencimientos);
        rows.pendientes.values.push(stat.pendiente);
        
        // Aquí está la magia: 'stat.acumulado' ya incluye la suma de Sept+Oct+Nov...
        // aunque esos meses no se estén pintando en este loop.
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
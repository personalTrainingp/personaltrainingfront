import React, { useState, useMemo } from "react";
import {
  buildExecutiveTableData,
  fmtMoney,
  fmtNum,
  labelFromKey,
  getAvailableMonthsFromVentas, // <--- IMPORTAR EL NUEVO HELPER
} from "../adapters/executibleLogic";

export default function ExecutiveTable(props) {
  // 1. Extraemos todas las opciones posibles de las ventas
  const allMonthOptions = useMemo(
    () => getAvailableMonthsFromVentas(props.ventas || []),
    [props.ventas]
  );

  // 2. Estado para el mes "comparativo" seleccionado.
  // Por defecto, tomamos el primero disponible que no esté en las fechas fijas, o null.
  const [selectedCompareKey, setSelectedCompareKey] = useState(null);

  // 3. Combinar las fechas fijas (props.fechas) con la fecha seleccionada
  const processedProps = useMemo(() => {
    const fixedFechas = props.fechas || [];
    
    // Si no hay nada seleccionado aún, intentamos seleccionar uno por defecto que no esté ya en fixedFechas
    let currentCompareKey = selectedCompareKey;
    
    if (!currentCompareKey && allMonthOptions.length > 0) {
        const fixedKeys = new Set(fixedFechas.map(f => `${f.anio}-${f.mes}`));
        const available = allMonthOptions.find(opt => !fixedKeys.has(opt.key));
        if (available) {
            // No llamamos a set state aquí para evitar loops, solo lo usamos localmente
            currentCompareKey = available.key; 
        }
    }

    // Buscamos el objeto completo de la opción seleccionada
    const compareOption = allMonthOptions.find(opt => opt.key === currentCompareKey);

    // Creamos la nueva lista de fechas para la tabla
    // NOTA: Si compareOption existe y no está ya en fixedFechas, lo agregamos.
    let mergedFechas = [...fixedFechas];
    
    // Verificamos si ya existe para no duplicar visualmente si el usuario selecciona uno que ya está
    const exists = compareOption && fixedFechas.some(f => `${f.anio}-${f.mes}` === compareOption.key);
    
    if (compareOption && !exists) {
      mergedFechas.push({
        anio: compareOption.anio,
        mes: compareOption.mes,
        label: compareOption.label,
        isEditable: true, // <--- FLAG PARA SABER DÓNDE RENDERIZAR EL SELECT
        key: compareOption.key
      });
    }

    // Retornamos las props modificadas con la nueva lista de fechas
    return {
      ...props,
      fechas: mergedFechas,
    };
  }, [props.fechas, props.ventas, selectedCompareKey, allMonthOptions]);

  // 4. Ejecutamos la lógica con las props procesadas
  const {
    selectedMonthName,
    monthOrderForOrigin,
    rowsPerOrigin,
    orderedOrigins,
  } = buildExecutiveTableData(processedProps);

  const { cutDay } = props;

  // === ESTILOS (Tus estilos originales + estilo para el select) ===
  const cBlack = "#000000";
  const cWhite = "#ffffff";
  const cRed = "#c00000";
  const border = "1px solid #333";

  const sWrap = {
    fontFamily: "Inter, sans-serif",
    color: cBlack,
  };
  const sHeader = {
    background: cRed,
    color: cWhite,
    textAlign: "center",
    padding: "16px 12px",
    fontWeight: 700,
    letterSpacing: 0.2,
    fontSize: 40,
  };
  const sTable = {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  };
  const sThMes = {
    color: cWhite,
    textAlign: "center",
    fontWeight: 700,
    fontSize: 23,
    padding: "10px",
    verticalAlign: "middle",
  };
  const sThLeft = { ...sThMes, textAlign: "center", width: 260 };
  
  // Estilo del Select para que se vea bien sobre el fondo rojo
  const sSelect = {
    background: "rgba(255,255,255,0.2)",
    color: cWhite,
    border: "1px solid rgba(255,255,255,0.5)",
    borderRadius: 4,
    padding: "4px 8px",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    maxWidth: "100%",
    outline: "none",
  };
  
  const sCell = {
    border,
    padding: "8px 10px",
    background: cWhite,
    fontSize: 28,
    textAlign: "center",
  };
  const sCellBold = { ...sCell, fontWeight: 700 };

  const sHeaderWrap = { textAlign: "center", margin: "8px 0" };
  const sHeaderChip = {
    display: "inline-block",
    background: cRed,
    color: cWhite,
    padding: "10px 24px",
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: 0.2,
    lineHeight: 1.1,
    borderRadius: 6,
  };

  const TitleChip = ({ children, style }) => (
    <div style={sHeaderWrap}>
      <span style={{ ...sHeaderChip, ...style }}>{children}</span>
    </div>
  );

  // === COMPONENTE INTERNO: SELECTOR DE MESES ===
  const MonthSelector = ({ currentVal }) => {
    // Filtramos para que en el select NO aparezcan las fechas fijas (los 4 meses base)
    // excepto si es el valor actual seleccionado.
    const fixedKeys = new Set((props.fechas || []).map(f => `${f.anio}-${f.mes}`));
    
    const availableOptions = allMonthOptions.filter(opt => 
        !fixedKeys.has(opt.key) || opt.key === currentVal
    );

    return (
        <select 
            style={sSelect}
            value={currentVal || ""}
            onChange={(e) => setSelectedCompareKey(e.target.value)}
        >
            <option value="" disabled>Seleccionar mes</option>
            {availableOptions.map(opt => (
                <option key={opt.key} value={opt.key} style={{ color: '#000' }}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
  };

  const TableHeadFor = ({ okey }) => {
    const months = monthOrderForOrigin(okey);
    return (
      <thead>
        <tr>
          <th style={{ ...sThLeft, background: cRed }} />
          {months.map((m, idx) => {
            // Identificamos si esta columna corresponde al mes editable
            // La lógica de "m.anio" y "m.mes" viene de buildExecutiveTableData -> perMonth
            const currentKey = `${m.anio}-${m.mes}`;
            
            // Verificamos si este mes proviene de nuestra inyección editable.
            // Como `buildExecutiveTableData` reconstruye los objetos, 
            // verificamos contra nuestro estado o una bandera si pudiéramos pasarla,
            // pero la forma más segura es comparar claves contra las fechas fijas originales.
            const isFixed = (props.fechas || []).some(f => `${f.anio}-${f.mes}` === currentKey);
            const isEditable = !isFixed; 

            return (
                <th key={`${okey}-h-${idx}`} style={{ ...sThMes, background: cRed }}>
                  {isEditable ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 14, opacity: 0.8 }}>COMPARAR CON:</span>
                        <MonthSelector currentVal={currentKey} />
                      </div>
                  ) : (
                      <div>{m.label}</div>
                  )}
                </th>
            );
          })}
        </tr>
      </thead>
    );
  };

  const renderRowsFor = (okey, rowsToRender) => {
    const months = monthOrderForOrigin(okey);

    return rowsToRender.map((r) => (
      <tr key={r.key + r.label}>
        <td style={{ ...sCellBold, background: "#c00000", color: "#fff", fontWeight: 800 }}>
          {r.label}
        </td>

        {months.map((m, idx) => {
          let val = 0;
          let isPct = false;

          // ... (Tu lógica original de extracción de valor se mantiene IDÉNTICA)
          if (okey === "monkeyfit") {
            val = m.metrics?.[r.key] ?? 0;
          } else if (!isNaN(Number(okey))) {
            const [, pgmId, campo] = r.key.split(":");
            const mf = m.metrics?.mfByProg?.[pgmId] || {};
            if (campo === "venta") val = mf.venta ?? 0;
            else if (campo === "cant") val = mf.cant ?? 0;
            else if (campo === "ticket") val = mf.cant ? mf.venta / mf.cant : 0;
            else if (campo === "ventaF") val = mf.ventaFull ?? 0;
            else if (campo === "cantF") val = mf.cantFull ?? 0;
            else if (campo === "ticketF") val = mf.cantFull ? mf.ventaFull / mf.cantFull : 0;
          } else if (r.key.startsWith("o:")) {
            const [, _ok, campo] = r.key.split(":");
            const o = m.metrics?.byOrigin?.[_ok];
            if (campo === "total") val = o?.total ?? 0;
            else if (campo === "cant") val = o?.cant ?? 0;
            else if (campo === "ticket") val = o?.cant ? o.total / o.cant : 0;
            else if (campo === "pct") {
              const base = m.metrics?.totalServ || 0;
              val = base > 0 ? ((o?.total ?? 0) / base) * 100 : 0;
              isPct = true;
            }
          } else {
            val = m.metrics?.[r.key] ?? 0;
          }
          // ... (Fin lógica original)

          const txt = isPct
            ? `${fmtNum(val, 2)} %`
            : r.type === "money"
            ? fmtMoney(val)
            : r.type === "float2"
            ? fmtNum(val, 2)
            : fmtNum(val, 0);

          const isSelectedCol = m.label === selectedMonthName;
          // Verificamos si es la columna editable para darle un borde o estilo sutil diferente si deseas
          const currentKey = `${m.anio}-${m.mes}`;
          const isEditable = !(props.fechas || []).some(f => `${f.anio}-${f.mes}` === currentKey);

          return (
            <td
              key={`${okey}-c-${r.key}-${idx}`}
              style={{
                ...sCell,
                ...(isSelectedCol ? { background: "#c00000", color: "#fff", fontWeight: 700, fontSize: 28 } : {}),
                // Opcional: Resaltar la columna de comparación
                ...(isEditable && !isSelectedCol ? { background: "#fff5f5" } : {}) 
              }}
            >
              {txt}
            </td>
          );
        })}
      </tr>
    ));
  };

  return (
    <div style={sWrap}>
      {orderedOrigins.length === 0 ? (
        <div style={{ ...sHeader, background: "#444" }}>
          NO HAY ORÍGENES CON DATOS PARA AL {cutDay} DE CADA MES
        </div>
      ) : (
        orderedOrigins.map((okey) => {
          const title = ` ${labelFromKey(okey)} `;
          const rows = rowsPerOrigin(okey);
          return (
            <div key={okey} style={{ marginBottom: 24 }}>
              <TitleChip>{title}</TitleChip>
              <table style={sTable}>
                <TableHeadFor okey={okey} />
                <tbody>{renderRowsFor(okey, rows)}</tbody>
              </table>
            </div>
          );
        })
      )}
    </div>
  );
}
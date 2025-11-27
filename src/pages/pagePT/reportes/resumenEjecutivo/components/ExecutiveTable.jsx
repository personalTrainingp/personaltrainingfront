import React, { useState, useMemo } from "react";
import {
  buildExecutiveTableData,
  fmtMoney,
  fmtNum,
  labelFromKey,
} from "../adapters/executibleLogic"; // Asegúrate que esta ruta es correcta

// === CONFIGURACIÓN ===
const MESES_DISPLAY = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// Normalizamos siempre a "setiembre" (sin P) para la lógica
const normMes = (m) => {
  const s = String(m || "").toLowerCase().trim();
  return s === "septiembre" ? "setiembre" : s;
};

// Generador de Keys únicas
const keyFromYM = (anio, mes) => `${anio}-${normMes(mes)}`;

export default function ExecutiveTable(props) {
  const {
    ventas = [],
    fechas = [],
    dataMktByMonth = {},
    initialDay = 1,
    cutDay = 21,
    reservasMF = [],
    originMap = {},
    selectedMonth = new Date().getMonth() + 1, // 1 - 12
    year: propYear,
    tasaCambio = 3.37,
  } = props;

  const baseYear = propYear ?? new Date().getFullYear();

  // 1. GENERAR LISTA DE MESES DISPONIBLES (Historial)
  // Generamos 12 meses hacia atrás desde la fecha base
  const allMonthOptions = useMemo(() => {
    const out = [];
    let y = baseYear;
    let mIdx = selectedMonth - 1; 

    for (let i = 0; i < 12; i++) {
      const mesDisplay = MESES_DISPLAY[mIdx]; 
      const mesLogic = normMes(mesDisplay);   

      out.push({
        key: keyFromYM(y, mesLogic),
        label: `${mesDisplay.toUpperCase()} ${y}`,
        anio: String(y),
        mes: mesLogic, 
      });

      mIdx--;
      if (mIdx < 0) {
        mIdx = 11;
        y -= 1;
      }
    }
    return out;
  }, [baseYear, selectedMonth]);

  // 2. ESTADO DEL SELECTOR (Override)
  // Si es null, usa el mes por defecto (el primero de la lista generada)
  const [overrideKey, setOverrideKey] = useState(null);

  // 3. CONSTRUCCIÓN DE COLUMNAS (Lógica "Tabla Amarilla")
  // La columna 0 es dinámica (Select/Base), las demás son fijas.
  const processedProps = useMemo(() => {
    let finalFechas = [];
    
    // Si viene prop fechas, la usamos de base, sino usamos la generada
    const sourceFechas = (fechas && fechas.length) ? fechas : allMonthOptions;
    finalFechas = [...sourceFechas];

    // LÓGICA DE REEMPLAZO DE LA PRIMERA COLUMNA
    // Si hay un override, forzamos que finalFechas[0] sea ese mes.
    if (overrideKey) {
        const selectedOpt = allMonthOptions.find(o => o.key === overrideKey);
        if (selectedOpt && finalFechas.length > 0) {
            finalFechas[0] = {
                anio: selectedOpt.anio,
                mes: selectedOpt.mes,
                label: selectedOpt.label,
                key: selectedOpt.key
            };
        }
    }

    return {
      ventas,
      fechas: finalFechas,
      dataMktByMonth,
      initialDay,
      cutDay,
      reservasMF,
      originMap,
      selectedMonth,
      tasaCambio,
    };
  }, [ventas, fechas, allMonthOptions, overrideKey, dataMktByMonth, initialDay, cutDay, reservasMF, originMap, selectedMonth, tasaCambio]);

  // 4. CALCULAR DATA CON EL ADAPTADOR
  const { perMonth, rowsPerOrigin } = buildExecutiveTableData(processedProps);
  const { cutDay: cutDayFromProps = cutDay } = props;

  // === LÓGICA DE ORDENAMIENTO (Requirement: Descendente según mes seleccionado) ===
  
  // Obtenemos todos los orígenes disponibles
  const originKeysAll = Array.from(
    new Set(perMonth.flatMap((m) => Object.keys(m.metrics?.byOrigin || {})))
  ).filter((k) => k !== "meta"); // Excluir Meta si se maneja aparte o mantener si se requiere

  // Función para obtener valor de ordenamiento
  const getSortValue = (okey) => {
    // Si selectedMonth es 0, sumamos todas las filas
    if (selectedMonth === 0) {
        return perMonth.reduce((acc, m) => acc + Number(m.metrics?.byOrigin?.[okey]?.total || 0), 0);
    }
    // Si no, usamos el valor de la PRIMERA COLUMNA (que es la seleccionada/roja)
    const baseMonth = perMonth[0]; 
    return Number(baseMonth?.metrics?.byOrigin?.[okey]?.total || 0);
  };

  const orderedOrigins = [...originKeysAll].sort((a, b) => {
    const valA = getSortValue(a);
    const valB = getSortValue(b);
    return valB - valA; // Descendente
  });
  
  // Lo mismo para MonkeyFit Programas si los usas
  const mfProgramKeys = Array.from(
    new Set(perMonth.flatMap((m) => Object.keys(m.metrics?.mfByProg || {})))
  );
  
  const orderedMFPrograms = [...mfProgramKeys].sort((a, b) => {
      // Misma lógica: si selectedMonth=0 suma todo, si no, usa col 0
      const getMFVal = (k) => {
          if (selectedMonth === 0) return perMonth.reduce((acc, m) => acc + Number(m.metrics?.mfByProg?.[k]?.cant || 0), 0);
          return Number(perMonth[0]?.metrics?.mfByProg?.[k]?.cant || 0);
      }
      return getMFVal(b) - getMFVal(a);
  });


  // === ESTILOS ===
  const cRed = "#c00000";
  const cWhite = "#ffffff";
  const cBlack = "#000000";
  const border = "1px solid #333";

  const sWrap = { fontFamily: "Inter, sans-serif", color: cBlack };
  const sTable = { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" };
  
  // Estilo Base Celda
  const sCell = { border, padding: "8px 10px", background: cWhite, fontSize: 28, textAlign: "center" };
  const sCellBold = { ...sCell, fontWeight: 700 };

  // Estilo Celda Roja (Seleccionada)
  const sCellRed = { ...sCell, background: cRed, color: cWhite, fontWeight: 700 };

  // Estilo Header
  const sThMes = { color: cWhite, textAlign: "center", fontWeight: 700, fontSize: 23, padding: "10px", verticalAlign: "middle" };
  const sThLeft = { ...sThMes, textAlign: "center", width: 260 };

  // Estilo Selector
  const sSelect = { 
    background: "rgba(255,255,255,0.2)", color: cWhite, border: "1px solid rgba(255,255,255,0.5)", 
    borderRadius: 4, padding: "4px 8px", fontSize: 16, fontWeight: 700, cursor: "pointer", maxWidth: "100%", outline: "none" 
  };
  const sHeaderWrap = { textAlign: "center", margin: "8px 0" };
  const sHeaderChip = { display: "inline-block", background: cRed, color: cWhite, padding: "10px 24px", fontWeight: 800, fontSize: 40, letterSpacing: 0.2, lineHeight: 1.1, borderRadius: 6 };
  const TitleChip = ({ children }) => (<div style={sHeaderWrap}><span style={sHeaderChip}>{children}</span></div>);


  // === COMPONENTES DE RENDERIZADO ===

  const MonthSelector = ({ currentKey }) => {
    // Evitamos mostrar en el dropdown meses que ya están en las columnas fijas (indices 1..N)
    const usedKeys = new Set(perMonth.slice(1).map(m => keyFromYM(m.anio, m.mes)));
    const options = allMonthOptions.filter(o => !usedKeys.has(o.key));

    return (
      <select 
        style={sSelect} 
        value={overrideKey || currentKey} 
        onChange={(e) => setOverrideKey(e.target.value)}
        onClick={e => e.stopPropagation()}
      >
        {options.map(opt => (
            <option key={opt.key} value={opt.key} style={{color: "#000"}}>{opt.label}</option>
        ))}
      </select>
    );
  };

  const TableHeadFor = () => (
    <thead>
      <tr>
        <th style={{ ...sThLeft, background: cRed }} />
        {perMonth.map((m, idx) => {
            const isSelectedColumn = idx === 0; // La columna 0 siempre es la seleccionada
            const thisKey = keyFromYM(m.anio, m.mes);

            return (
                <th key={idx} style={{ ...sThMes, background: cRed }}>
                    {isSelectedColumn ? (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:4}}>
                            <span style={{fontSize:14, opacity:0.8}}>MES BASE</span>
                            <MonthSelector currentKey={thisKey} />
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

  const renderRowsFor = (okey, rowsToRender) => {
    return rowsToRender.map((r) => (
      <tr key={r.key + r.label}>
        <td style={{ ...sCellBold, background: cRed, color: cWhite, fontWeight: 800 }}>{r.label}</td>
        
        {perMonth.map((m, idx) => {
          let val = 0; let isPct = false;
          
          // Logica de extracción de valores (Idéntica a tu original)
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
          } else { val = m.metrics?.[r.key] ?? 0; }

          const txt = isPct ? `${fmtNum(val, 2)} %` : r.type === "money" ? fmtMoney(val) : r.type === "float2" ? fmtNum(val, 2) : fmtNum(val, 0);

          // Si es la columna 0, aplicamos estilo rojo
          const cellStyle = idx === 0 ? sCellRed : sCell;

          return (
            <td key={`${okey}-${idx}-${r.key}`} style={cellStyle}>
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
            <div style={{ ...sThMes, background: "#444", fontSize: 20 }}>NO HAY DATOS AL {cutDayFromProps}</div>
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
        
        {/* Renderizado opcional de MonkeyFit Programas si es necesario */}
        {orderedMFPrograms.length > 0 && (
             <div style={{marginTop: 40}}>
                 <TitleChip> MONKEYFIT POR PROGRAMAS </TitleChip>
                 {orderedMFPrograms.map(pgmId => {
                     // Construye filas ficticias para MF Programas usando tu helper rowsPerOrigin o manual
                     const rows = [
                         { key: `${pgmId}:venta`, label: "VENTA", type: "money" },
                         { key: `${pgmId}:cant`, label: "CANTIDAD", type: "int" },
                     ]; 
                     return (
                         <div key={pgmId} style={{marginBottom: 20}}>
                             <div style={{fontWeight:'bold', marginBottom:5}}>{pgmId}</div>
                             <table style={sTable}>
                                <TableHeadFor />
                                <tbody>{renderRowsFor(pgmId, rows)}</tbody>
                             </table>
                         </div>
                     )
                 })}
             </div>
        )}
    </div>
  );
}
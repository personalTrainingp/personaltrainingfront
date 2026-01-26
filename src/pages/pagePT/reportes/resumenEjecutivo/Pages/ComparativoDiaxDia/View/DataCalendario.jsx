import { NumberFormatMoney } from "@/components/CurrencyMask";
import React, { useMemo, useState } from "react";
import { agruparPorEmpleado } from "../helpers/agruparDiasEnMes";

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

function daysInMonth(anio, mes) {
  return new Date(anio, mes, 0).getDate(); // mes 1..12
}

function firstDayOfMonthMonStart(anio, mes) {
  // JS: 0=Dom..6=Sab -> queremos 0=Lun..6=Dom
  const d = new Date(anio, mes - 1, 1).getDay();
  return (d + 6) % 7;
}

function keyDate(anio, mes, dia) {
  return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

export const DataCalendario = ({  data = [],
  initialYear = 2026,
  initialMonth = 1,
  onDayClick}) => {
  const [{ anio, mes }, setYM] = useState({ anio: initialYear, mes: initialMonth });

  // Agrupar data por día (YYYY-MM-DD) -> [items...]
  const mapByDay = useMemo(() => {
    const m = new Map();
    for (const item of data) {
      const k = keyDate(item.anio, item.mes, item.dia);
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(item);
    }
    return m;
  }, [data]);

  const totalDias = daysInMonth(anio, mes);
  const offset = firstDayOfMonthMonStart(anio, mes);

  const goPrev = () => {
    setYM(prev => (prev.mes === 1 ? { anio: prev.anio - 1, mes: 12 } : { anio: prev.anio, mes: prev.mes - 1 }));
  };

  const goNext = () => {
    setYM(prev => (prev.mes === 12 ? { anio: prev.anio + 1, mes: 1 } : { anio: prev.anio, mes: prev.mes + 1 }));
  };

  // 42 celdas (6 semanas) para que siempre cuadre
  const cells = useMemo(() => {
    return Array.from({ length: 42 }, (_, idx) => {
      const dayNum = idx - offset + 1;
      if (dayNum < 1 || dayNum > totalDias) return null;

      const k = keyDate(anio, mes, dayNum);
      const items = mapByDay.get(k) || []; // si no hay data => vacío

      return { dia: dayNum, key: k, items };
    });
  }, [anio, mes, totalDias, offset, mapByDay]);

  // Detectar si el mes entero no tiene nada (solo para que lo sepas o muestres un mensaje opcional)
  const monthHasData = useMemo(() => {
    for (let d = 1; d <= totalDias; d++) {
      const k = keyDate(anio, mes, d);
      if ((mapByDay.get(k) || []).length) return true;
    }
    return false;
  }, [anio, mes, totalDias, mapByDay]);

  return (
    <div style={{ width: "100%" }}>
      {/* Header navegación */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
        <button onClick={goPrev}>◀</button>
        <div style={{ fontWeight: 800 }}>
          {MESES[mes - 1]} {anio}
        </div>
        <button onClick={goNext}>▶</button>

        {!monthHasData && (
          <div style={{ marginLeft: 10, fontSize: 12, color: "#777" }}>
            (mes sin data)
          </div>
        )}
      </div>

      {/* Tabla */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 560 }}>
          <thead>
            <tr>
              {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map(d => (
                <th key={d} style={{ border: "1px solid #ddd", padding: 8, background: "#f5f5f5" }}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 6 }).map((_, row) => (
              <tr key={row}>
                {Array.from({ length: 7 }).map((_, col) => {
                  const cell = cells[row * 7 + col];

                  // celdas fuera del mes
                  if (!cell) {
                    return <td key={col} style={{ border: "1px solid #eee", height: 78, background: "#fafafa" }} />;
                  }

                  const count = cell.items.length;

                  return (
                    <td
                      key={col}
                      onClick={() => onDayClick?.(cell.items, { dia: cell.dia, mes, anio })}
                      style={{
                        border: "1px solid #ddd",
                        height: 78,
                        verticalAlign: "top",
                        padding: 8,
                        cursor: "pointer",
                        background: count ? "#e8f5ff" : "#fff"
                      }}
                      title={count ? `${count} registros` : "Sin data"}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {/* <span style={{ fontWeight: 800 }}>{cell.dia}</span> */}
                        <span
                            style={{
                              fontSize: 20,
                              padding: "2px 8px",
                              borderRadius: 999,
                              background: "#111",
                              color: "#fff"
                            }}
                          >
                            {cell.dia}
                          </span>
                        {/* Badge cantidad (solo si hay data) */}
                        {/* {count > 0 && (
                          <span
                            style={{
                              fontSize: 12,
                              padding: "2px 8px",
                              borderRadius: 999,
                              background: "#111",
                              color: "#fff"
                            }}
                          >
                            {count}s
                          </span>
                        )} */}
                      </div>

                      {/* Si quieres mostrar algo del primer item */}
                      {count > 0 && (
                        <div style={{ marginTop: 6, fontSize: 12, color: "#333" }}>
                          {/* ejemplo: mostrar campo "titulo" si existe */}
                          {cell.items[0]?.titulo ? (
                            <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {cell.items[0].titulo}
                              
                            </div>
                          ) : (
                            <div style={{ color: "#666" }}>
                                CANTIDAD: {cell.items[0].items.length}
                                <br/>
                                TOTAL: <NumberFormatMoney amount={cell.items[0].items.reduce((total, item) => total + (item?.montoTotal || 0), 0)}/> 
                                    <br/>
                                    {
                                        agruparPorEmpleado(cell.items[0].items).map(emp=>{
                                            return (
                                                <>
                                                <br/>
                                                ASESOR: {emp.nombre_empl.split(' ')[0]}
                                                <br/>
                                                VENTAS: <NumberFormatMoney amount={emp.items.reduce((total, item) => total + (item?.montoTotal || 0), 0)}/>
                                                <br/>
                                                CANTIDAD: {emp.items.length}
                                                <br/>
                                                </>
                                            )
                                        })
                                    }
                            </div>
                          )}
                        </div>
                      )}

                      {/* Si NO hay data, queda vacío (no mostramos nada) */}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

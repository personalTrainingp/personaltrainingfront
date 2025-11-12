import React, { useMemo } from "react";

/** Utils */
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const pad = (n) => String(n).padStart(2, "0");
const toHHMM = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
const addSlot = (hhmm, step) => toHHMM(toMinutes(hhmm) + step);

/** Convierte slots (labels "HH:MM") a rangos continuos [{start,end}] */
function mergeSlotsToRanges(slots = [], step = 30) {
  if (!slots.length) return [];
  const uniq = Array.from(new Set(slots)).sort((a, b) => toMinutes(a) - toMinutes(b));
  const ranges = [];
  let start = uniq[0];
  let prev = uniq[0];
  for (let i = 1; i < uniq.length; i++) {
    const expected = addSlot(prev, step);
    if (uniq[i] !== expected) {
      ranges.push({ start, end: addSlot(prev, step) });
      start = uniq[i];
    }
    prev = uniq[i];
  }
  ranges.push({ start, end: addSlot(prev, step) });
  return ranges;
}

/** Extrae todos los slots usados globalmente (para comprimir la línea de tiempo) */
function getGlobalUsedSlots(dataRaw = [], step = 30) {
  const set = new Set();
  dataRaw.forEach((row) => {
    row.diasLaborables?.forEach((d) => {
      d.horarios?.forEach((h) => set.add(h.label));
    });
  });
  return Array.from(set).sort((a, b) => toMinutes(a) - toMinutes(b));
}

export default function DiagramaGantHorario({
  dataRaw,
  slotMinutes = 30,
  gapSize = 6,             // px: ancho del separador entre bloques sin uso
  slotWidth = 28,          // px: ancho por slot “comprimido”
  colorOn = "#16a34a",     // verde-600
  colorOffBg = "#f8fafc",  // slate-50 (fondo)
  textColor = "#ffffff",
  labelWidth = 280         // px: ancho total de labels (cargo/colaborador/día)
}) {
  /** 1) Slots usados globalmente (eje X comprimido) */
  const globalSlots = useMemo(() => getGlobalUsedSlots(dataRaw, slotMinutes), [dataRaw, slotMinutes]);

  /** Mapa de slot -> índice comprimido */
  const slotIndex = useMemo(() => {
    const map = new Map();
    globalSlots.forEach((s, i) => map.set(s, i));
    return map;
  }, [globalSlots]);

  /** 2) Para cada día, convertir sus slots a rangos continuos */
  const rows = useMemo(() => {
    // Estructura: [{ cargo, colaborador, dias: [{ label, ranges: [{start, end}] }] }]
    return dataRaw.map((row) => {
      const dias = (row.diasLaborables || []).map((d) => {
        const slots = (d.horarios || []).map((h) => h.label);
        const ranges = mergeSlotsToRanges(slots, slotMinutes);
        return { label: d.label, ranges };
      });
      return { cargo: row.cargo, colaborador: row.colaborador, dias };
    });
  }, [dataRaw, slotMinutes]);

  /** 3) Helpers para pintar barras con eje comprimido */
  const widthForRange = (start, end) => {
    // ancho = (# de slots del rango) * slotWidth
    const sIdx = slotIndex.get(start);
    // end es exclusivo, su índice es el del último slot + 1
    // Para obtener el idx del "end", restamos un step y sumamos 1
    const lastSlot = toHHMM(toMinutes(end) - slotMinutes);
    const eIdx = (slotIndex.get(lastSlot) ?? sIdx) + 1;
    const slotsCount = Math.max(0, eIdx - sIdx);
    return slotsCount * slotWidth;
  };

  const needsSeparator = (prevEnd, nextStart) => {
    if (!prevEnd) return false;
    // Si el fin de un rango y el inicio del siguiente no son contiguos en slots usados globalmente,
    // ponemos un separador finito (gap).
    const lastSlotPrev = toHHMM(toMinutes(prevEnd) - slotMinutes);
    const prevIdx = slotIndex.get(lastSlotPrev);
    const nextIdx = slotIndex.get(nextStart);
    if (prevIdx === undefined || nextIdx === undefined) return true;
    return nextIdx > prevIdx + 1; // hay hueco comprimido
  };

  return (
    <div
      className="gantt-wrapper"
      style={{
        "--slotW": `${slotWidth}px`,
        "--gap": `${gapSize}px`,
        "--labelW": `${labelWidth}px`,
        background: colorOffBg
      }}
    >
      {/* Encabezado comprimido (solo slots usados) */}
      <div className="gantt-head">
        <div className="gantt-label-head">Cargo / Colaborador / Día</div>
        <div className="gantt-scale">
          {globalSlots.map((s) => (
            <div key={s} className="gantt-tick">
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cuerpo */}
      <div className="gantt-body">
        {rows.map((row, ri) => (
          <div className="gantt-employee" key={`${row.cargo}-${row.colaborador}-${ri}`}>
            <div className="gantt-label-col">
              <div className="gantt-cargo">{row.cargo}</div>
              <div className="gantt-colab">{row.colaborador}</div>
            </div>
            <div className="gantt-days">
              {row.dias.map((dia, di) => {
                let prevEnd = null;
                return (
                  <div className="gantt-day-row" key={`${ri}-${di}-${dia.label}`}>
                    <div className="gantt-day-label">{dia.label}</div>
                    <div className="gantt-day-track">
                      {dia.ranges.length === 0 ? (
                        <div className="gantt-empty">—</div>
                      ) : (
                        dia.ranges.map((r, i) => {
                          const bars = [];

                          // separador si hay hueco comprimido entre r.prev y r
                          if (needsSeparator(prevEnd, r.start)) {
                            bars.push(<div key={`sep-${i}`} className="gantt-gap" style={{ width: `var(--gap)` }} />);
                          }

                          const w = widthForRange(r.start, r.end);
                          bars.push(
                            <div
                              key={`bar-${i}`}
                              className="gantt-bar"
                              style={{ width: `${w}px`, background: colorOn, color: textColor }}
                              title={`${r.start} – ${r.end}`}
                            >
                              <span className="gantt-bar-text">
                                {r.start} – {r.end}
                              </span>
                            </div>
                          );
                          prevEnd = r.end;
                          return bars;
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Estilos inline para simplicidad (puedes moverlos a tu .css) */}
      <style>{`
        .gantt-wrapper {
          --rowH: 28px;
          --dayGap: 8px;
          --barRadius: 10px;
          width: 100%;
          overflow-x: auto;
          padding: 12px;
          box-sizing: border-box;
        }
        .gantt-head {
          display: grid;
          grid-template-columns: var(--labelW) 1fr;
          align-items: end;
          margin-bottom: 8px;
        }
        .gantt-label-head {
          font-weight: 600;
          padding: 4px 8px;
        }
        .gantt-scale {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: var(--slotW);
          gap: 0;
        }
        .gantt-tick {
          border-left: 1px solid #e5e7eb; /* tailwind slate-200 */
          height: 20px;
          display: flex;
          align-items: end;
          justify-content: center;
          font-size: 10px;
          color: #64748b; /* slate-500 */
        }

        .gantt-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .gantt-employee {
          display: grid;
          grid-template-columns: var(--labelW) 1fr;
          gap: 0;
        }

        .gantt-label-col {
          padding: 6px 8px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-right: none;
          border-radius: 8px 0 0 8px;
        }
        .gantt-cargo { font-weight: 600; }
        .gantt-colab { color: #334155; font-size: 12px; }

        .gantt-days {
          border: 1px solid #e5e7eb;
          border-left: none;
          border-radius: 0 8px 8px 0;
          background: #fff;
          padding: 8px;
        }

        .gantt-day-row {
          display: grid;
          grid-template-columns: 80px 1fr;
          align-items: center;
          gap: 8px;
          margin-bottom: var(--dayGap);
        }
        .gantt-day-label {
          font-size: 12px;
          color: #475569; /* slate-600 */
          text-align: right;
          padding-right: 4px;
        }

        .gantt-day-track {
          display: flex;
          align-items: center;
          min-height: var(--rowH);
          overflow: hidden;
          position: relative;
        }

        .gantt-gap {
          height: 8px;
          background: #eef2f7;
          border-radius: 999px;
          margin: 0 3px;
          flex: 0 0 auto;
        }

        .gantt-bar {
          height: var(--rowH);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--barRadius);
          padding: 0 8px;
          font-size: 12px;
          white-space: nowrap;
          box-shadow: 0 1px 2px rgba(0,0,0,.08);
          flex: 0 0 auto;
        }
        .gantt-bar-text {
          pointer-events: none;
          user-select: none;
        }
        .gantt-empty {
          color: #94a3b8; /* slate-400 */
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}

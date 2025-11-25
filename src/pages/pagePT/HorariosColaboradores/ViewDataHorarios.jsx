import dayjs from "dayjs";
import React, { useRef, useEffect } from "react";
import { agruparPorHorarioYMinutos, resumirConsecutivos } from "./middleware/resumirConsecutivos";

/**
 * ScheduleTimeline.jsx — versión simplificada y 100% visible con demoData.
 *
 * - Eje X: 3:00am → 11:59pm (casi 21h)
 * - 2 columnas estáticas (sticky) a la izquierda: Colaborador, Cargo
 * - En el timeline se ven barras según hora de inicio (horario) y duración (minutos)
 */

// Escala base: 1 minuto = 1px
const PX_PER_MIN = 2.2;

// Nuevo ancho total (de 03:00 → 23:59)
const START_MIN = 5 * 60; // 180
const END_MIN = 23 * 60 + 59; // 1439
const TOTAL_MIN = END_MIN - START_MIN; // 1259
const TIMELINE_WIDTH = TOTAL_MIN * PX_PER_MIN; // ≈ 6295px
function minutesToTimeStr(totalMin) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}:${mm}:00`;
}
function timeStrToMinutes(hms = "00:00:00") {
  // Acepta "HH:mm:ss" y "HH:mm:ss.SSSSSSS"
  const [hh, mm = "0"] = String(hms).split(":");
  const h = parseInt(hh, 10) || 0;
  const m = parseInt(mm, 10) || 0;
  return h * 60 + m; // ignoramos segundos
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(n, max));
}

function RowBar({ startStr, minutes, color = "#2563eb" }) {
  const absStart = timeStrToMinutes(startStr);
  const absEnd = absStart + (minutes || 0);

  const clampedStart = clamp(absStart, START_MIN, END_MIN);
  const clampedEnd = clamp(absEnd, START_MIN, END_MIN);

  const left = (clampedStart - START_MIN) * PX_PER_MIN;
  const width = Math.max(0, (clampedEnd - clampedStart) * PX_PER_MIN);

  if (width <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 4,
        height: 28,
        left,
        width,
        height: '100%',
        background: color,
        color: "#fff",
        fontSize: 13,
        borderRadius: 4,
        lineHeight: "28px",
        textAlign: "center",
        whiteSpace: "nowrap",
        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
        display: 'flex',
        flexDirection: 'column'
      }}
      title={`${startStr} · ${minutes} min`}
    >
      <span>
        {dayjs.utc(startStr, "HH:mm:ss").format("h:mm")}
      </span>
      <span>
        {dayjs.utc(startStr, "HH:mm:ss").add(minutes, "minutes").format("h:mm")}
      </span>
    </div>
  );
}
function buildNonOverlappingSegments(rawSegments = []) {
  // 1) Convertimos a intervalos [startMin, endMin] + color + prioridad
  const intervals = rawSegments
    .map((seg, index) => {
      const start = clamp(timeStrToMinutes(seg.horario), START_MIN, END_MIN);
      const end = clamp(start + (seg.minutos || 0), START_MIN, END_MIN);
      return {
        start,
        end,
        color: seg.hex || "#2563eb",
        priority: index, // el último declarado "tapa" al anterior
      };
    })
    .filter((s) => s.end > s.start);

  if (!intervals.length) return [];

  // 2) Sacamos todos los cortes (bordes de intervalos)
  const boundaries = Array.from(
    new Set(intervals.flatMap((i) => [i.start, i.end]))
  ).sort((a, b) => a - b);

  const result = [];

  // 3) Recorremos cada tramo atómico [b[i], b[i+1])
  for (let i = 0; i < boundaries.length - 1; i++) {
    const a = boundaries[i];
    const b = boundaries[i + 1];
    if (a === b) continue;

    // Intervalos que cubren completamente este tramo
    const covering = intervals.filter((it) => it.start <= a && it.end >= b);
    if (!covering.length) continue;

    // 4) Escogemos el que "se ve arriba": el de mayor prioridad
    const top = covering.reduce((acc, it) =>
      it.priority > acc.priority ? it : acc
    );

    // 5) Juntamos tramos contiguos con el mismo color
    const last = result[result.length - 1];
    if (last && last.color === top.color && last.end === a) {
      last.end = b;
    } else {
      result.push({ start: a, end: b, color: top.color });
    }
  }

  return result;
}
function HoursHeader({ dataDias }) {
  const labels = [];
  for (let h = 5; h <= 23; h++) {
    const h1 = h < 10 ? `0${h}` : `${h}`;
    labels.push(`${h1}`);
  }
  const dataHorasVistas = dataDias.map((dia) => dia.horario);

  function obtenerHoraMenor(hora) {
    const isTimeView = dataHorasVistas.find((e) => e === hora);
    if (isTimeView) {
      return true;
    }
    return false;
  }

  return (
    <div style={{ position: "relative", width: TIMELINE_WIDTH, height: 32 }}>
      {/* líneas verticales */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(0,0,0,0.1) 0, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 300px)", // 1h = 300px
          pointerEvents: "none",
        }}
      />
      {/* etiquetas */}
      <div style={{ position: "relative", display: "flex" }}>
        {labels.map((txt, i) => (
          <div
            key={i}
            style={{
              width: 300, // 60min × 5px
              // textAlign: "center",
              fontSize: 13,
              fontWeight: 500,
              // color: `${obtenerHoraMenor(txt) ? "#000" : "#ffffff"}`,
            }}
          >
            {dayjs.utc(txt, 'HH').format('hh A')}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * TimelineCell ahora recibe un array de segmentos (barras) y las pinta
 * en la misma fila, una debajo de la otra.
 */
function TimelineCell({ segments }) {
  // segments = [{horario, minutos, hex, ...}, ...] con mismo label
  const computedSegments = buildNonOverlappingSegments(segments);

  return (
    <div
      style={{
        position: "relative",
        width: TIMELINE_WIDTH,
        height: 36,
        backgroundImage:
          "repeating-linear-gradient(to right, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 300px)",
        backgroundPosition: "left center",
        backgroundRepeat: "repeat-x",
        boxSizing: "border-box",
      }}
    >
      {computedSegments.map((seg, idx) => {
        const startStr = minutesToTimeStr(seg.start);
        const minutes = seg.end - seg.start;
        return (
          <RowBar
            key={idx}
            startStr={startStr}
            minutes={minutes}
            color={seg.color}
          />
        );
      })}
    </div>
  );
}

function TableHeader({ syncRef, dataDias }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr" }}>
        <div
          style={{
            position: "sticky",
            left: 0,
            zIndex: 6,
            background: "#fff",
            borderRight: "1px solid #e5e7eb",
            padding: "8px 12px",
            fontSize: 12,
            fontWeight: 600,
            color: "#374151",
          }}
        >
          Dia
        </div>
        <div ref={syncRef}>
          <HoursHeader dataDias={dataDias} />
        </div>
      </div>
    </div>
  );
}

/**
 * Row ahora recibe todos los segmentos (barras) de ese label.
 */
function Row({ colaborador, cargo, sublabel, segments }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        borderBottom: "1px solid #f3f4f6",
        height: 96,
      }}
    >
      <div
        style={{
          position: "sticky",
          left: 0,
          zIndex: 4,
          // height: '250px',
          background: "#fff",
          borderRight: "1px solid #f3f4f6",
          padding: "0 12px",
          display: "flex",
          alignItems: "center",
          fontSize: 12,
          color: "#374151",
        }}
        title={cargo}
      >
        {sublabel && (
          <span
            className="fs-4 fw-bold"
          >
            {sublabel}
          </span>
        )}
      </div>
      <div>
        <TimelineCell segments={segments} />
      </div>
    </div>
  );
}

/**
 * Agrupa los diasLaborables por label para que:
 * - Si hay 2 elementos con label "lunes a viernes", se muestre UNA fila
 *   con DOS barras en esa fila.
 */
function agruparPorLabel(diasLaborables = []) {
  const map = diasLaborables.reduce((acc, dia) => {
    const key = dia.label || "__sin_label";
    if (!acc[key]) {
      acc[key] = { label: dia.label, segmentos: [] };
    }
    acc[key].segmentos.push(dia);
    return acc;
  }, {});
  return Object.values(map); // [{label, segmentos:[...]}]
}

function ScheduleTable({ data }) {
  const headScrollRef = useRef(null);
  const bodyScrollRefs = useRef([]);

  useEffect(() => {
    const head = headScrollRef.current;
    if (!head) return;
    const onScroll = () => {
      bodyScrollRefs.current.forEach((el) => {
        if (el && el.scrollLeft !== head.scrollLeft) el.scrollLeft = head.scrollLeft;
      });
    };
    head.addEventListener("scroll", onScroll, { passive: true });
    return () => head.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      <div>
        {data.map((person, idxPerson) => {
          const filasPorLabel = agruparPorLabel(person.diasLaborables);

          return (
            <div key={idxPerson}>
              <div className="bg-change text-white text-center p-2 fs-3 fw-bold">
                {person.colaborador.split(" ")[0]}
              </div>

              <TableHeader
                syncRef={headScrollRef}
                dataDias={person.diasLaborables}
              />

              {filasPorLabel.map((fila, idxFila) => (
                <div
                  key={idxFila}
                  ref={(el) =>
                    (bodyScrollRefs.current[`${idxPerson}-${idxFila}`] = el)
                  }
                  style={{ overflowX: "hidden" }}
                >
                  <Row
                    colaborador={person.colaborador}
                    cargo={person.cargo}
                    sublabel={fila.label}
                    segments={fila.segmentos}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}


export default function ViewDataHorarios({ dataRaw }) {
  const dataTest = [
    {
      colaborador: "VERONICA",
      cargo: "ESTILISTA",
      diasLaborables: [
        {
          id_tipo_horario: 0,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "05:00:00.0000000",
          minutos: 405,
          hex: "#0000ff",
        },
        
        {
          id_tipo_horario: 0,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "13:00:00.0000000",
          minutos: 45,
          hex: "#0000ff",
        },
        {
          id_tipo_horario: 2,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "05:45:00.0000000",
          minutos: 15,
          hex: "#FF0000",
        },
        {
          id_tipo_horario: 2,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "06:45:00.0000000",
          minutos: 15,
          hex: "#FF0000",
        },
        {
          id_tipo_horario: 2,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "07:45:00.0000000",
          minutos: 15,
          hex: "#FF0000",
        },
        {
          id_tipo_horario: 2,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "08:45:00.0000000",
          minutos: 15,
          hex: "#FF0000",
        },
        {
          id_tipo_horario: 2,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "09:45:00.0000000",
          minutos: 15,
          hex: "#FF0000",
        },
        {
          id_tipo_horario: 2,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "10:45:00.0000000",
          minutos: 15,
          hex: "#FF0000",
        },
        {
          id_tipo_horario: 0,
          label: "un sabado si, un sabado no",
          horarios: [],
          items: [],
          horario: "07:00:00.0000000",
          minutos: 225,
          hex: "#0000ff",
        },
        {
          id_tipo_horario: 2,
          label: "un sabado si, un sabado no",
          horarios: [],
          items: [],
          horario: "07:45:00.0000000",
          minutos: 15,
          hex: "#FF0000",
        },
        {
          id_tipo_horario: 2,
          label: "un sabado si, un sabado no",
          horarios: [],
          items: [],
          horario: "08:45:00.0000000",
          minutos: 15,
          hex: "#FF0000",
        },
        {
          id_tipo_horario: 2,
          label: "un sabado si, un sabado no",
          horarios: [],
          items: [],
          horario: "09:45:00.0000000",
          minutos: 15,
          hex: "#FF0000",
        },
      ],
    },
    {
      colaborador: 'DEISY',
      cargo: 'entrenadora',
      diasLaborables: [
        {
          id_tipo_horario: 0,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "17:00:00.0000000",
          minutos: 285,
          hex: "#0000ff",
        },
        {
          id_tipo_horario: 2,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "17:45:00.0000000",
          minutos: 15,
          hex: "#FF0000",
        },
        {
          id_tipo_horario: 2,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "18:45:00.0000000",
          minutos: 15,
          hex: "#FF0000",
        },
        {
          id_tipo_horario: 2,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "18:45:00.0000000",
          minutos: 15,
          hex: "#FF0000",
        },
        {
          id_tipo_horario: 2,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "19:45:00.0000000",
          minutos: 15,
          hex: "#FF0000",
        },
        {
          id_tipo_horario: 2,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "20:45:00.0000000",
          minutos: 15,
          hex: "#FF0000",
        },
      ]
    },
    {
      colaborador: 'OFELIA',
      diasLaborables: [
        {
          id_tipo_horario: 0,
          label: "lunes, miercoles y viernes",
          horarios: [],
          items: [],
          horario: "06:00:00.0000000",
          minutos: 720,
          hex: "#0000ff",
        },
        {
          id_tipo_horario: 2,
          label: "lunes, miercoles y viernes",
          horarios: [],
          items: [],
          horario: "13:00:00.0000000",
          minutos: 60,
          hex: "#FF0000",
        },
      ]
    },
    {
      colaborador: 'MIRTHA',
      diasLaborables: [
        {
          id_tipo_horario: 0,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "06:00:00.0000000",
          minutos: 720,
          hex: "#0000ff",
        },
        {
          id_tipo_horario: 2,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "13:00:00.0000000",
          minutos: 60,
          hex: "#FF0000",
        },
      ]
    },
    {
      colaborador: 'CARLOS',
      diasLaborables: [
        {
          id_tipo_horario: 0,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "06:30:00.0000000",
          minutos: 540,
          hex: "#0000ff",
        },
        {
          id_tipo_horario: 2,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "13:00:00.0000000",
          minutos: 60,
          hex: "#FF0000",
        },
        {
          id_tipo_horario: 0,
          label: "sabado",
          horarios: [],
          items: [],
          horario: "07:30:00.0000000",
          minutos: 300,
          hex: "#0000ff",
        },
      ]
    },
    {
      colaborador: 'MARINA',
      diasLaborables: [
        {
          id_tipo_horario: 0,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "08:30:00.0000000",
          minutos: 450,
          hex: "#0000ff",
        },
        {
          id_tipo_horario: 2,
          label: "lunes a viernes",
          horarios: [],
          items: [],
          horario: "13:00:00.0000000",
          minutos: 60,
          hex: "#FF0000",
        },
      ]
    }
  ];
  console.log({dataRaw});
  
  return (
    <div style={{ padding: 16, background: "#f9fafb", minHeight: "60vh" }}>
      <ScheduleTable data={dataTest} />
    </div>
  );
}

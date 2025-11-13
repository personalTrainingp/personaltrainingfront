import dayjs from "dayjs";
import React, { useRef, useEffect } from "react";
import { agruparPorHorarioYMinutos, resumirConsecutivos } from "./middleware/resumirConsecutivos";

/**
 * ScheduleTimeline.jsx — versión simplificada y 100% visible con demoData.
 *
 * - Eje X: 3:00am → 11:59pm (casi 21h)
 * - 2 columnas estáticas (sticky) a la izquierda: Colaborador, Cargo
 * - En el timeline se ven barras azules según hora de inicio (horario) y duración (minutos)
 * - Demo embebido para que "figure" sin pasar props
 */

// Escala base: 1 minuto = 5px
const PX_PER_MIN = 1;

// Nuevo ancho total (de 03:00 → 23:59)
const START_MIN = 3 * 60;           // 180
const END_MIN = 23 * 60 + 59;       // 1439
const TOTAL_MIN = END_MIN - START_MIN; // 1259
const TIMELINE_WIDTH = TOTAL_MIN * PX_PER_MIN; // ≈ 6295px
function timeStrToMinutes(hms = "00:00:00") {
  // Acepta "HH:mm:ss" y "HH:mm:ss.SSSSSSS"
  const [hh, mm = "0", ssRaw = "0"] = String(hms).split(":");
  // parseInt("00.0000000", 10) → 0 OK
  const h = parseInt(hh, 10) || 0;
  const m = parseInt(mm, 10) || 0;
  return h * 60 + m; // ignoramos segundos para estabilidad visual
}

function clamp(n, min, max) { return Math.max(min, Math.min(n, max)); }

function RowBar({ startStr, minutes }) {
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
        background: "#2563eb",
        color: "#fff",
        fontSize: 21,
        borderRadius: 4,
        lineHeight: "28px",
        textAlign: "center",
        whiteSpace: "nowrap",
        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
      }}
      title={`${startStr} · ${minutes} min`}
    >
      {dayjs.utc(startStr, "HH:mm:ss").format("hh:mm A")} –{" "}
      {dayjs.utc(startStr, "HH:mm:ss").add(minutes, "minutes").format("hh:mm A")}
    </div>
  );
}

function HoursHeader({dataDias}) {
  const labels = [];
  for (let h = 3; h <= 23; h++) {
    const h1 = h<10?`0${h}`:`${h}`;
    labels.push(`${h1}:00:00`);
  }
  const dataHorasVistas= dataDias.map(dia=>dia.horario)
  function obtenerHoraMenor(hora) {
    const isTimeView = dataHorasVistas.find(e=>e===hora)
    if(isTimeView){
      return true;
    }
    return false
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
              textAlign: "center",
              fontSize: 13,
              fontWeight: 500,
              color: `${obtenerHoraMenor(txt)?'#000':'#ffffff'}`,
            }}
          >
            {txt}
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineCell({ startStr, minutes }) {
  return (
    <div
      style={{
        position: "relative",
        width: TIMELINE_WIDTH,
        height: 36,
        backgroundImage:
          "repeating-linear-gradient(to right, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 300px)", // cada 300px = 1h
        backgroundPosition: "left center",
        backgroundRepeat: "repeat-x",
        boxSizing: "border-box",
      }}
    >
      <RowBar startStr={startStr} minutes={minutes} />
    </div>
  );
}

function TableHeader({ syncRef, dataDias }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 5, background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr" }}>
        {/* <div style={{ position: "sticky", left: 0, zIndex: 6, background: "#fff", borderRight: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 12, fontWeight: 600, color: "#374151" }}>Colaborador</div> */}
        <div clas style={{ position: "sticky", left: 0, zIndex: 6, background: "#fff", borderRight: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 12, fontWeight: 600, color: "#374151" }}>Dia</div>
        <div ref={syncRef}>
          <HoursHeader dataDias={dataDias}/>
        </div>
      </div>
    </div>
  );
}

function Row({ colaborador, cargo, sublabel, startStr, minutes, scrollLeft }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", borderBottom: "1px solid #f3f4f6", height: 56 }}>
      {/* <div style={{ position: "sticky", left: 0, zIndex: 4, background: "#fff", borderRight: "1px solid #f3f4f6", padding: "0 12px", display: "flex", alignItems: "center" }}>
        <div style={{ overflow: "hidden" }}>
          <div title={colaborador} style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{colaborador}</div>
        </div>
      </div> */}
      <div style={{ position: "sticky", left: 0, zIndex: 4, background: "#fff", borderRight: "1px solid #f3f4f6", padding: "0 12px", display: "flex", alignItems: "center", fontSize: 12, color: "#374151" }} title={cargo}>
        {
          sublabel && (
            <span style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }} className="fs-4 fw-bold">{sublabel}</span>
          )
        }
      </div>
      <div >
        <TimelineCell startStr={startStr} minutes={minutes} />
      </div>
    </div>
  );
}

function ScheduleTable({ data }) {
  // Simple sincronización del scroll horizontal del header → filas (opcional)
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
    <div style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", background: "#fff", overflow: "hidden" }}>
      <div>
        {data.map((person, idxPerson) => (
          <div key={idxPerson}>
            <div className="bg-change text-white text-center p-2 fs-3 fw-bold">
              {person.colaborador.split(' ')[0]}
            </div>
          <TableHeader syncRef={headScrollRef} dataDias={person.diasLaborables}/>
            {person.diasLaborables.map((dia, idxDia) => (
              <div key={idxDia}
                   ref={(el) => (bodyScrollRefs.current[idxPerson + "-" + idxDia] = el)}
                   style={{ overflowX: "hidden" }}>
                    {JSON.stringify(dia.horario, null, 2)}
                {/* <Row
                  colaborador={person.colaborador}
                  cargo={person.cargo}
                  sublabel={dia.label}
                  startStr={dia.horario}
                  minutes={dia.minutos}
                /> */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}


export default function ViewDataHorarios({dataRaw}) {
  const dataAlter = dataRaw.map(d=>{
    return {
      ...d,
      diasLaborables: agruparPorHorarioYMinutos(resumirConsecutivos(d.diasLaborables)),
      diasLaborables1: (resumirConsecutivos(d.diasLaborables)),
      di2: d.diasLaborables
    }
  })
  console.log({dataAlter});
  
  return (
    <div style={{ padding: 16, background: "#f9fafb", minHeight: "60vh" }}>
      <ScheduleTable data={dataAlter} />
    </div>
  );
}

// /src/utils/ganttAdapter.js
const pad = (n) => String(n).padStart(2, "0");

function parseHorarioToMinutes(horario) {
  // "06:00:00.0000000" -> 360
  const [hh, mm] = horario.split(":").map(Number);
  return (hh || 0) * 60 + (mm || 0);
}

function toHHMM(m) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${pad(h)}:${pad(min)}`;
}

function* slotsFromRange(startMin, durationMin, step = 30) {
  const end = startMin + Math.max(0, durationMin);
  for (let t = startMin; t < end; t += step) {
    yield toHHMM(t);
  }
}

/** "Vie 31" con TZ explícida (America/Lima por defecto) */
function dayLabel(fechaISO, timeZone = "America/Lima", locale = "es-PE") {
  const d = new Date(fechaISO); // viene con +00:00
  const fmtDay = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone });
  const fmtNum = new Intl.DateTimeFormat(locale, { day: "2-digit", timeZone });
  return `${capitalize(fmtDay.format(d))} ${fmtNum.format(d)}`;
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/**
 * Adapta UNA fila { cargo, colaborador, diasLaborables:[{fecha, horario, minutos}, ...] }
 * al formato esperado por GanttHorario: diasLaborables:[{label, horarios:[{label:"HH:MM"}]}]
 */
export function adaptRowToGanttSlots(row, step = 30, timeZone = "America/Lima") {
  // Agrupar por label de día
  const map = new Map(); // label -> Set(slots)
  (row.diasLaborables || []).forEach((d) => {
    const label = dayLabel(d.fecha, timeZone);
    if (!map.has(label)) map.set(label, new Set());
    const set = map.get(label);

    const startMin = parseHorarioToMinutes(d.horario ?? "00:00:00.0000000");
    const dur = d.minutos || 0;
    if (dur <= 0) return; // día sin horario: quedará sin slots

    for (const s of slotsFromRange(startMin, dur, step)) {
      set.add(s);
    }
  });

  const diasLaborables = Array.from(map.entries()).map(([label, set]) => ({
    label,
    horarios: Array.from(set).sort().map((hhmm) => ({ label: hhmm })),
  }));

  // También queremos días que aparezcan con minutos=0 (para que salga la fila “vacía”):
  // Detecta días presentes pero sin slots y añádelos con lista vacía
  (row.diasLaborables || []).forEach((d) => {
    const label = dayLabel(d.fecha, timeZone);
    if (!map.has(label)) {
      diasLaborables.push({ label, horarios: [] });
      map.set(label, new Set());
    }
  });

  // Ordena por fecha (aprox) usando el número de día en el label
  diasLaborables.sort((a, b) => {
    const na = parseInt(a.label.split(" ")[1], 10);
    const nb = parseInt(b.label.split(" ")[1], 10);
    return (isNaN(na) ? 0 : na) - (isNaN(nb) ? 0 : nb);
  });

  return {
    cargo: row.cargo,
    colaborador: row.colaborador,
    diasLaborables,
  };
}

/** Adapta TODO el arreglo dataRaw */
export function adaptDataToGanttSlots(dataRaw, step = 30, timeZone = "America/Lima") {
  return (dataRaw || []).map((row) => adaptRowToGanttSlots(row, step, timeZone));
}

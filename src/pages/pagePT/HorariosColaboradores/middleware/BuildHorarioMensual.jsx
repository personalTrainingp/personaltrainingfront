import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Lima");

// util: suma minutos a "HH:mm"
function addMinutesToTime(horaHHmm, minutos) {
  const [hStr, mStr] = horaHHmm.split(":");
  const start = dayjs().hour(Number(hStr)).minute(Number(mStr)).second(0);
  const end = start.add(minutos, "minute");
  return end.format("HH:mm");
}

// util: obtener nombre día semana en MAYÚSCULAS español corto
// 0=Domingo ... 6=Sábado
const diasSemanaMap = [
  "DOMINGO",
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO"
];

export function buildHorarioMensual({ dataRaw, horarioColors, fechaInicio, fechaFin }) {
  // fechaInicio / fechaFin en formato "YYYY-MM-DD"
  const start = dayjs.tz(fechaInicio + " 00:00", "America/Lima");
  const end = dayjs.tz(fechaFin + " 23:59", "America/Lima");

  // helper para color por tipo
  const colorByTipo = Object.fromEntries(
    horarioColors.map(h => [h.id_tipo_horario, h.bg])
  );

  return dataRaw.map(colab => {
    const diasMap = {}; // {LUNES: [ {horaInicio,horaFin,rango,fechas[],bg} ], ... }

    colab.diasLaborables.forEach(diaLab => {
      // convertir fecha a Lima y filtrar por rango
      const fechaLocal = dayjs(diaLab.fecha).tz("America/Lima");
      if (fechaLocal.isBefore(start) || fechaLocal.isAfter(end)) return;

      const dowName = diasSemanaMap[fechaLocal.day()]; // ej "LUNES"

      // calcular inicio y fin
      const horaInicio = dayjs(diaLab.horario).format("HH:mm"); // "07:00"
      const horaFin = addMinutesToTime(horaInicio, diaLab.minutos); // "13:00"
      const rango = `${horaInicio} - ${horaFin}`;
      const bg = colorByTipo[diaLab.id_tipo_horario] ?? "gray";

      if (!diasMap[dowName]) {
        diasMap[dowName] = [];
      }

      // buscamos si ya existe EXACTAMENTE ese bloque horario y color
      const match = diasMap[dowName].find(
        b => b.horaInicio === horaInicio && b.horaFin === horaFin && b.bg === bg
      );

      if (match) {
        match.fechas.push(fechaLocal.format("YYYY-MM-DD"));
      } else {
        diasMap[dowName].push({
          horaInicio,
          horaFin,
          rango,
          fechas: [fechaLocal.format("YYYY-MM-DD")],
          bg
        });
      }
    });

    return {
      colaborador: colab.colaborador,
      cargo: colab.cargo,
      dias: diasMap
    };
  });
}
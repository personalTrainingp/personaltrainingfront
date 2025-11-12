import { Table } from "react-bootstrap";
import React, { useMemo } from "react";
import {
  agruparPorHorarioYMinutos,
  generarIntervalos,
  resumirConsecutivos
} from "./middleware/resumirConsecutivos";

export default function HorarioMensual({ dataRaw=[], horarioColors, fechaInicio, fechaFin }) {
  const todosIntervalos = useMemo(() => generarIntervalos("01:00", "22:00", 30), []);

  // 1️⃣ recolectar horas usadas globalmente
  const horasUsadas = useMemo(() => {
    const set = new Set();
    dataRaw?.forEach(row => {
      row.diasLaborables?.forEach(d => {
        d.horarios?.forEach(h => set.add(h.label));
      });
    });
    return set;
  }, [dataRaw]);

  // 2️⃣ generar una lista visual: horas activas + pequeños espacios
  const intervalosFiltrados = useMemo(() => {
    const arr = [];
    for (let i = 0; i < todosIntervalos.length; i++) {
      const h = todosIntervalos[i];
      const used = horasUsadas.has(h.label);
      arr.push({ ...h, used });
      // si hay salto entre este y el siguiente con no uso total,
      // metemos un “espacio” visual mínimo
      const next = todosIntervalos[i + 1];
      // if (next && !horasUsadas.has(next.label) && !used) {
      //   arr.push({ label: `gap-${i}`, isGap: true });
      // }
    }
    return arr;
  }, [todosIntervalos, horasUsadas]);

  return (
    <div className="horario-wrapper">
      <div className="horario-scroll-x">
        <Table bordered className="horario-table">
          <thead>
            <tr>
              <th className="sticky-col first-col">Cargo</th>
              <th className="sticky-col second-col">Colaborador</th>
              <th className="sticky-col third-col">Día</th>
              {intervalosFiltrados.map((hora) => (
                <th
                  key={hora.label}
                  className={`horario-header p-0 ${hora.isGap ? "horario-gap" : ""}`}
                >
                  {!hora.isGap && hora.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRaw.map((row, idx) => {
              const diasAgrupados = agruparPorHorarioYMinutos(
                resumirConsecutivos(row.diasLaborables)
              );
              const rowSpan = diasAgrupados.length;

              return diasAgrupados.map((dia, i) => {
                const activos = new Set(dia.horarios?.map(h => h.label));
                return (
                  <tr key={`${idx}-${i}`}>
                    {i === 0 && (
                      <>
                        <td rowSpan={rowSpan} className="sticky-col first-col">
                          {row.cargo}
                        </td>
                        <td rowSpan={rowSpan} className="sticky-col second-col">
                          {row.colaborador}
                        </td>
                      </>
                    )}
                    <td className="sticky-col third-col">{dia.label}</td>
                    {/* {intervalosFiltrados.map((h) => {
                      if (h.isGap) {
                        return <td key={h.label} className="horario-cell gap"></td>;
                      }
                      const isOn = activos.has(h.label);
                      const color = isOn
                        ? horarioColors?.defaultOn || "bg-success"
                        : horarioColors?.defaultOff || "bg-secondary";
                      return (
                        <td key={h.label} className="horario-cell p-0">
                          <div className={`${color} horario-box`} />
                        </td>
                      );
                    })} */}
                  </tr>
                );
              });
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

import { Table } from "react-bootstrap";
import { agruparPorHorarioYMinutos, generarIntervalos, resumirConsecutivos } from "./middleware/resumirConsecutivos";
import React from "react";

export default function HorarioMensual({
  dataRaw,
  horarioColors,
  fechaInicio,
  fechaFin
}) {
  const intervalos = generarIntervalos("06:00", "22:00", 30);

  return (
    <div className="horario-wrapper">
      {/* contenedor scroll horizontal */}
      <div className="horario-scroll-x">
        <Table bordered className="horario-table">
          <thead className="bg-change">
            <tr>
              <th className="sticky-col first-col">Cargo</th>
              <th className="sticky-col second-col">Colaborador</th>
              <th className="sticky-col third-col">Día</th>
              {intervalos.map((hora) => (
                <th key={hora.label} className="horario-header">
                  {hora.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRaw.map((row, idx) => {
              const diasAgrupados = agruparPorHorarioYMinutos(resumirConsecutivos(row.diasLaborables));
              const rowSpan = diasAgrupados.length + 1;

              return (
                <React.Fragment key={idx}>
                  <tr>
                    <td rowSpan={rowSpan} className="sticky-col first-col">
                      {row.cargo}
                    </td>
                    <td rowSpan={rowSpan} className="sticky-col second-col">
                      {row.colaborador}
                    </td>
                  </tr>
                  {diasAgrupados.map((dia, i) => (
                    <tr key={i}>
                      <td className="sticky-col third-col">{dia.label}</td>
                      {intervalos.map((h) => {
                        const is = dia?.horarios?.some((a) => a.label === h.label)
                          ? "bg-success"
                          : "bg-secondary";
                        return (
                          <td key={h.label} className="horario-cell">
                            <div className={`${is} horario-box`}></div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

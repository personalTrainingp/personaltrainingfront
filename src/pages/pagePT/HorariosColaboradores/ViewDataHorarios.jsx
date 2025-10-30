import { Table } from "react-bootstrap";
import { agruparPorHorarioYMinutos, generarIntervalos, resumirConsecutivos } from "./middleware/resumirConsecutivos";

export default function HorarioMensual({
  dataRaw,
  horarioColors,
  fechaInicio,
  fechaFin
}) {
  return (
    <div
    >
      <Table bordered>
        <thead className="bg-change" >
          <tr>
            <th className="text-white">Cargo</th>
            <th className="text-white">Colaborador</th>
            <th className="text-white">Dia</th>
            {
              generarIntervalos('06:00', '22:00',30).map(hora=>{
                return (
                  <th className="text-white">{hora.label}</th>
                )
              })
            }
          </tr>
        </thead>
        <tbody >
          {
            dataRaw.map(row=>{
              console.log({d: agruparPorHorarioYMinutos(resumirConsecutivos(row.diasLaborables))});
              
              return (
                <>
                <tr>
                  <td rowSpan={agruparPorHorarioYMinutos(resumirConsecutivos(row.diasLaborables)).length+1}>{row.cargo}</td>
                  <td rowSpan={agruparPorHorarioYMinutos(resumirConsecutivos(row.diasLaborables)).length+1}>{row.colaborador}</td>
                </tr>
                {
                  agruparPorHorarioYMinutos(resumirConsecutivos(row.diasLaborables))?.map(dia=>{
                    return (
                      <>
                        <tr>
                          <td>{dia.label}</td>
                          <td className="p-0 m-0" style={{width: '100%', height: '100%'}}>
                            <div className="bg-danger p-0 m-0" style={{width: '70px', height: '70px'}}>
                            </div>
                          </td>
                        </tr>
                      </>
                    )
                  })
                }
                </>
              )
            })
          }
        </tbody>
      </Table>
    </div>
  );
}

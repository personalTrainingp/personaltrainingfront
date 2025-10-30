import { Table } from "react-bootstrap";
import { agruparPorHorarioYMinutos, resumirConsecutivos } from "./middleware/resumirConsecutivos";

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
            <th className="text-white">06:00</th>
            <th className="text-white">06:30</th>
            <th className="text-white">07:00</th>
            <th className="text-white">07:30</th>
            <th className="text-white">08:00</th>
            <th className="text-white">08:30</th>
            <th className="text-white">09:00</th>
            <th className="text-white">09:30</th>
            <th className="text-white">10:00</th>
            <th className="text-white">11:00</th>
            <th className="text-white">12:00</th>
            <th className="text-white">13:00</th>
            <th className="text-white">14:00</th>
            <th className="text-white">15:00</th>
            <th className="text-white">16:00</th>
            <th className="text-white">17:00</th>
            <th className="text-white">18:00</th>
            <th className="text-white">19:00</th>
            <th className="text-white">20:00</th>
            <th className="text-white">20:00</th>
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

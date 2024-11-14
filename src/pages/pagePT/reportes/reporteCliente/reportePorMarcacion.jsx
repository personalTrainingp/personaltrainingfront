import React from "react";
import { Card, Table } from "react-bootstrap";

const obtenerFechasUnicas = (clientes)=>{
    const fechas = new Set();
    console.log("clientes");

    console.log(clientes);
    if(clientes){
        clientes.clientes.map((cliente)=>{
            cliente.dias.map((dia)=>{
                fechas.add(dia.fecha);
            });
        });
        return Array.from(fechas).sort();
    }else{
        return [];
    }
}

export const ReportePorMarcacion = ({dataAsistencia}) => {


    const fechasUnicas = obtenerFechasUnicas(dataAsistencia);
    return (
        <div className="card-body text-secondary card border-secondary box-shadow">
            <Card>
                <Table 
                    responsive
                    striped
                    className="table-centered mb-0 overflow-auto"
                >
                    <thead className="bg-primary">
                        <tr>
                            <th scope="col" className="pe-0 me-0 text-white">Socio</th>
                            {
                                fechasUnicas.map((fecha , index)=>(
                                    <th className="w-100 text-nowrap text-white" style={{  }} key={index} scope="col">{fecha}</th>
                                ))
                            }
                        </tr>
                    </thead>

                    <tbody>
                    {
                        dataAsistencia?.clientes?.map((cliente , index)=>(
                            <tr key={index}>
                            {/* <th scope="row">1</th> */}
                            <td>{cliente.dni}
                                <br />
                                {cliente.nombre_apellidos_cli}
                                <br />
                                {cliente.email}
                                <br />
                                {cliente.telefono}
                            </td>
                                {
                                    fechasUnicas.map((fecha , i)=>
                                        {
                                            let diaAsistencia = cliente.dias.find(dia => dia.fecha === fecha);
                                            console.log(diaAsistencia?.fecha);
                                            return(
                                                <td className="w-100 text-nowrap" key={i}>
                                                    {dataAsistencia ? (
                                                        <>
                                                            { diaAsistencia?.FechaMasReciente ? (
                                                                <>
                                                                 <div>Ingreso: {diaAsistencia?.FechaMasReciente ? new Date(diaAsistencia?.FechaMasReciente[0]).toLocaleTimeString('es-PE',{
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                 }): ""}</div>
                                                                 <div>Salida: {diaAsistencia?.FechaUltima[0] ? new Date(diaAsistencia?.FechaUltima[0]).toLocaleTimeString('es-PE',{
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                 }) : "No hay registro"}</div>
                                                                </>
                                                            ) : "No asistió"}
                                                        </>
                                                    ): "No asistió"}
                                                </td>
                                            );
                                        }
                                    )
                                }
                            <td>
                                {/* {
                                    cliente.dias.map((dia , index)=>(
                                        <React.Fragment key={index}>
                                        <ul>
                                            <li> {dia.fecha}</li>


                                            Fecha y hora de ingreso = {new Date(dia.FechaMasReciente[0]).toLocaleDateString('es-PE', {
                                                    year: 'numeric',
                                                    month: 'numeric',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            <br />
                                            Fecha y hora de salida = {new Date(dia.FechaUltima[0]).toLocaleDateString('es-PE', {
                                                    year: 'numeric',
                                                    month: 'numeric',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                        </ul>
                                        </React.Fragment>
                                    ))
                                } */}
                            </td>

       
                            </tr>
                        ))
              
                    }

                </tbody>
                </Table>
            </Card>
            <table className="table table-hover">
   
                
            </table>
        </div>
    );
}
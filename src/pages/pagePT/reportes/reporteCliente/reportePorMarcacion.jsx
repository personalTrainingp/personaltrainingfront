import React from "react";
export const ReportePorMarcacion = ({dataAsistencia}) => {

    console.log(dataAsistencia);
    return (
        <div className="card-body text-secondary card border-secondary box-shadow">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Socio</th>
                        <th scope="col">Dias</th>

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
                            <td>
                                {
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
                                }
                            </td>

       
                            </tr>
                        ))
              
                    }

                </tbody>
            </table>
        </div>
    );
}
import { PageBreadcrumb } from '@/components'
import { useReporteStore } from '@/hooks/hookApi/useReporteStore';
import dayjs from 'dayjs';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Table } from 'react-bootstrap'

export const ReporteSeguimiento = () => {
	const { reporteSeguimiento, obtenerReporteSeguimiento, obtenerReporteSeguimientoTODO, viewSeguimiento, agrupado_programas, loadinData } = useReporteStore();
    useEffect(() => {
      obtenerReporteSeguimiento(true, 598)
    }, [])
    console.log(ordenarPorDistrito(reporteSeguimiento));
    console.log(ordenarPorHorario(reporteSeguimiento));
    const HorarioBodyTemplate = (rowData)=>{
        
        return (
            <>
            {rowData.horario}
            </>
        )
    }
    const cantidadBodyTemplate=(rowData)=>{
        return (
            <>
            {rowData.items.length}
            </>
        )
    }
    const filtroDeHorario = (time)=>{
// Función para convertir el horario a un valor numérico para la comparación
        const convertirAHora = (horario) => {
            const [hora, periodo] = horario.split(' ');
            let [h, m] = hora.split(':').map(Number);
            if (periodo === 'PM' && h !== 12) h += 12; // Convertir a formato de 24 horas
            if (periodo === 'AM' && h === 12) h = 0; // Ajustar 12 AM a 0 horas
            return h * 60 + m; // Retornar el tiempo en minutos
        };
        const hore = ordenarPorHorario(reporteSeguimiento).filter(horario => horario.horario.includes(time))
        // Ordenar de mayor a menor
        const horariosOrdenados = hore.sort((a, b) => convertirAHora(b.horario) - convertirAHora(a.horario));
        return horariosOrdenados
    }
  return (
    <>
        <PageBreadcrumb subName={'T'} title={'REPORTE DE SEGUIMIENTO'}/>
        <Row>
            <Col lg={6}>
                <h3 className='text-center'>HORARIO MAÑANA</h3>
                <DataTable
                            stripedRows 
                            value={filtroDeHorario('AM')} 
                            size={'small'} 
                            tableStyle={{ minWidth: '30rem' }} 
                            scrollable 
                            selectionMode="single"
                            scrollHeight="400px"
                            >
                            <Column header="HORARIO" body={HorarioBodyTemplate}></Column>
                            <Column header="CANTIDAD" sortable body={cantidadBodyTemplate}></Column>
                </DataTable>
            </Col>
            <Col lg={6}>
                <h3 className='text-center'>HORARIO TARDE</h3>
                <DataTable
                            stripedRows 
                            value={filtroDeHorario('PM')} 
                            size={'small'} 
                            tableStyle={{ minWidth: '30rem' }} 
                            scrollable 
                            selectionMode="single"
                            scrollHeight="400px"
                            >
                            <Column header="HORARIO" body={HorarioBodyTemplate}></Column>
                            <Column header="CANTIDAD" sortable body={cantidadBodyTemplate}></Column>
                </DataTable>
            </Col>
        </Row>
    </>
  )
}
// {
//     ordenarPorDistrito(reporteSeguimiento).map(f=>(
//                 <th>{f.distrito}</th>
//     ))
// }
/*

            {
                ordenarPorDistrito(reporteSeguimiento).map(h=>(
                    <tr key={h.horario}>
                        <th>{h.horario}</th>
                        {
                            h.items.map(f=>(
                                <td>{f.tb_ventum.tb_cliente.tb_distrito?.distrito}</td>
                            ))
                        }
                    </tr>
                ))
            }
*/
function agruparPorHorarioYDistrito(datos) {
    const resultado = [];

    datos.forEach(item => {
        const horario =  new Date(item.horario).toISOString().split("T")[1];
        const distrito = item.tb_ventum.tb_cliente.tb_distrito?.distrito;

        // Busca si ya existe un grupo para este horario y distrito
        let grupo = resultado.find(g => g.horario === horario && g.distrito === distrito);

        // Si no existe, lo crea
        if (!grupo) {
            grupo = { horario, distrito, items: [] };
            resultado.push(grupo);
        }

        // Agrega el item al grupo correspondiente
        grupo.items.push(item);
    });

    return resultado;
}
function ordenarPorDistrito(data) {
    // Creamos un objeto para agrupar los datos por distrito
    const agrupadoPorDistrito = {};

    data.forEach(item => {
        // Obtenemos el nombre del distrito
        const distrito = item.tb_ventum.tb_cliente?.tb_distrito?.distrito;

        // Si el distrito no está en el objeto, lo inicializamos con un array vacío
        if (!agrupadoPorDistrito[distrito]) {
            agrupadoPorDistrito[distrito] = {
                distrito: distrito,
                items: []
            };
        }
        // Agregamos el item al array correspondiente al distrito
        agrupadoPorDistrito[distrito].items.push(item);
    });

    // Convertimos el objeto a un array de objetos
    return Object.values(agrupadoPorDistrito);
}
function ordenarPorHorario(data) {
    // Creamos un objeto para agrupar los datos por distrito
    const agrupadoPorDistrito = {};

    data.forEach(item => {
        // Obtenemos el nombre del distrito
        const horario = dayjs(new Date(item.horario).toISOString().split("T")[1].split('.00')[0], 'hh:mm:ss').format('hh:mm A');

        // Si el distrito no está en el objeto, lo inicializamos con un array vacío
        if (!agrupadoPorDistrito[horario]) {
            agrupadoPorDistrito[horario] = {
                horario: horario,
                items: []
            };
        }

        // Agregamos el item al array correspondiente al distrito
        agrupadoPorDistrito[horario].items.push(item);
    });

    // Convertimos el objeto a un array de objetos
    return Object.values(agrupadoPorDistrito);
}
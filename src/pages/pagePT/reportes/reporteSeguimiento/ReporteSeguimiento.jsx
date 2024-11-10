import { PageBreadcrumb } from '@/components'
import { useReporteStore } from '@/hooks/hookApi/useReporteStore';
import dayjs from 'dayjs';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Table } from 'react-bootstrap'

export const ReporteSeguimiento = () => {
    const [selectHorario, setselectHorario] = useState([])
	const { reporteSeguimiento, obtenerReporteSeguimiento, obtenerReporteSeguimientoTODO, viewSeguimiento, agrupado_programas, loadinData } = useReporteStore();
    useEffect(() => {
      obtenerReporteSeguimiento(true, 598)
      obtenerReporteSeguimientoTODO(598)
    }, [])
    const [customers, setCustomers] = useState([])
    // console.log(ordenarPorDistrito(viewSeguimiento));
    // console.log(agruparPorHorarioYDistrito(viewSeguimiento));
    // console.log(viewSeguimiento);
    const onSelectHorario = (d)=>{
        setselectHorario(d)
    }
    const HorarioBodyTemplate = (rowData)=>{
        return (
            <span className='font-20 fw-bold'>
            {rowData.horario}
            </span>
        )
    }
    
    const cantidadBodyTemplate=(rowData)=>{
        return (
            <span className='font-20'>
            {rowData.cantidad} SOCIOS
            </span>
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
        const hore = ordenarPorHorario(viewSeguimiento).map(g=>{return {...g, cantidad: g.items.length}}).filter(horario => horario.horario.includes(time))
        // Ordenar de mayor a menor
        
        const horariosOrdenados = hore.sort((a, b) =>convertirAHora(a.horario) - convertirAHora(b.horario));
        return horariosOrdenados
    }
    console.log(selectHorario.items, viewSeguimiento, ordenarPorDistrito(selectHorario.items));
    
  return (
    <>
        <PageBreadcrumb subName={'T'} title={'REPORTE DE SEGUIMIENTO'}/>
        <Row>
            <Col lg={1}>
            </Col>
            <Col lg={10}>
                <Row>
                    <Col lg={6}>
                        <div>
                            <h3 className='text-center'>HORARIOS SOCIOS INSCRITOS TURNO AM ({filtroDeHorario('AM').reduce((suma, item) => suma + item.cantidad, 0)})</h3>
                                <DataTable
                                            stripedRows 
                                            value={filtroDeHorario('AM')} 
                                            selection={selectHorario} onSelectionChange={(e)=>onSelectHorario(e.value)}
                                            size={'small'} 
                                            
                                            scrollable 
                                            selectionMode="single"
                                            scrollHeight="400px"
                                            // width={'400'}
                                            >
                                            <Column header={<span className='font-24'>HORARIO</span>} style={{width: '20px'}} body={HorarioBodyTemplate}></Column>
                                            <Column header={<span className='font-24'>CANTIDAD</span>}  style={{width: '20px'}} filterField='cantidad' field='cantidad' sortable body={cantidadBodyTemplate}></Column>
                                </DataTable>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div>
                            <h3 className='text-center'>HORARIOS SOCIOS INSCRITOS TURNO PM ({filtroDeHorario('PM').reduce((suma, item) => suma + item.cantidad, 0)})</h3>
                            <DataTable
                                        stripedRows 
                                        value={filtroDeHorario('PM')} 
                                        selection={selectHorario} onSelectionChange={(e)=>onSelectHorario(e.value)}
                                        size={'small'} 
                                        // tableStyle={{ width: '30rem' }} 
                                        scrollable 
                                        selectionMode="single"
                                        scrollHeight="400px"
                                        >
                                        <Column header={<span className='font-24'>HORARIO</span>} style={{width: '20px'}} body={HorarioBodyTemplate}></Column>
                                        <Column header={<span className='font-24'>CANTIDAD</span>} style={{width: '20px'}} filterField='cantidad' field='cantidad' sortable body={cantidadBodyTemplate}></Column>
                            </DataTable>
                        </div>
                    </Col>
                    <br/>
                    <br/>
                    <br/>
                    <Col lg={12}>
                        <h3 className='text-center'>POR DISTRITO</h3>
                        <Row>
                            {
                                ordenarPorDistrito(selectHorario.items).map(g=>(
                                    
                                    <Col lg={4}>
                                    <h2 className='text-center'>{g.distrito?`${g.distrito}(${g.items.length})`:'SIN DEFINIR'}</h2>
                                    <DataTable
                                                stripedRows 
                                                value={ordenarPorHorario(g.items).map(m=>{return {...m, cantidad: m.items.length}})} 
                                                size={'small'} 
                                                // tableStyle={{ minWidth: '30rem' }} 
                                                scrollable 
                                                selectionMode="single"
                                                scrollHeight="400px"
                                                >
                                                <Column header={<span className='font-20'>HORARIO</span>}  style={{width: '20px'}} body={HorarioBodyTemplate}></Column>
                                                <Column header={<span className='font-20'>CANTIDAD</span>}  style={{width: '20px'}} filterField='cantidad' field='cantidad' sortable body={cantidadBodyTemplate}></Column>
                                    </DataTable>
                                </Col>
                                ))
                            }
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col lg={1}>
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

    data?.forEach(item => {
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
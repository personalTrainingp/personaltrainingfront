import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Table, Row } from 'react-bootstrap';
import { usePlanillaStore } from './usePlanillaStore';
import dayjs from 'dayjs';
import { TabPanel, TabView } from 'primereact/tabview';
import { useJornadaStore } from '@/hooks/hookApi/useJornadaStore';
import { Image } from 'primereact/image';
// import customParseFormat from 'dayjs/plugin/customParseFormat'
// dayjs.extend(customParseFormat); // Activar la extensión

function restarTiempo(horaInicio, horaFin) {

    // Crear objetos dayjs para las dos horas
    horaInicio = dayjs(horaInicio, 'hh:mm A'); // 6:00 AM
    horaFin = dayjs(horaFin, 'hh:mm A'); // 2:00 PM
    // Calcular la diferencia en horas y minutos
const diferenciaEnMinutos = horaFin.diff(horaInicio, 'minute');
const horas = Math.floor(diferenciaEnMinutos / 60); // Obtener horas completas
const minutos = diferenciaEnMinutos % 60; // Obtener minutos restantes
// console.log(horaInicio, horaFin);
    
return `${horas} HRS ${minutos!==0?`Y ${minutos} MIN`:''}`
}
function calcularMinutosDesdeHoraCero(hora) {
    // Parsear la hora ingresada
    const horaIngresada = dayjs(hora, "h:mm A"); // Formato: 6:00 AM
  
    // Crear una hora base (00:00)
    const horaCero = dayjs("00:00", "HH:mm");
  
    // Calcular la diferencia en minutos
    const minutosDesdeHoraCero = horaIngresada.diff(horaCero, "minute");
  
    return minutosDesdeHoraCero;
}

function restarMinutos(horaInicio, horaFin) {
    return calcularMinutosDesdeHoraCero(horaFin)-calcularMinutosDesdeHoraCero(horaInicio)
}
// function restarMinutos(horaInicio, horaFin) {

//     // Crear objetos dayjs para las dos horas
//     horaInicio = dayjs(horaInicio, 'hh:mm A'); // 6:00 AM
//     horaFin = dayjs(horaFin, 'hh:mm A'); // 2:00 PM
//     // Calcular la diferencia en horas y minutos
//     const diferencia = horaFin.diff(horaInicio, 'minute'); // Restar en minutos 
    
// return `${diferencia}`

// }
export const ModalReportAsistencia = ({show, onHide, uid_empl, id_planilla, avatarImage}) => {
    const { postPlanillaxEMPL, obtenerAsistenciasxEmpl, obtenerPlanillaxID, dataPlanilla, asistenciaxEmplxPlanilla } = usePlanillaStore()
    const { dataJornadaxEmpl, obtenerJornadaxEmpleado } = useJornadaStore()
    useEffect(() => {
        if(id_planilla==0) return;
        obtenerPlanillaxID(id_planilla)
        obtenerAsistenciasxEmpl(uid_empl, id_planilla)
        obtenerJornadaxEmpleado(uid_empl)
        }, [id_planilla])
        // console.log(, dataPlanilla);
        const arrayDeDiasxSemana = obtenerDiasPorRango(dayjs.utc(dataPlanilla.fecha_desde).format('DD/MM/YYYY'), dayjs.utc(dataPlanilla.fecha_hasta).format('DD/MM/YYYY'), asistenciaxEmplxPlanilla, dataJornadaxEmpl)
        // console.log(arrayDeDiasxSemana, 
        //     arrayDeDiasxSemana.flatMap(f=>f.items).map(m=>{
        //         const minTardanzas = restarMinutos(m.marcacionInicio ,m.jornadaEntrada )
        //         // console.log(m.marcacionInicio ,m.jornadaEntrada);
                
        //         return {
        //             minutostardanzas: minTardanzas,
        //             ...m,
        //         }
        //     }), "jorjor");
        
  return (
    <Dialog
        visible={show}
        onHide={onHide}
        position='top'
        style={{width: '120rem'}}
        header='REPORTE DE ASISTENCIA'
        >
            <div className='d-flex justify-content-center'>
                <Image src={avatarImage} className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="250" />
            </div>
          <h4>PERIODO DESDE: {dayjs.utc(dataPlanilla.fecha_desde).format('DD/MM/YYYY')} </h4>
          <h4>PERIODO HASTA: {dayjs.utc(dataPlanilla.fecha_hasta).format('DD/MM/YYYY')} </h4>
          <div>
            <Row>
              <Col xxl={12}>
              {
                arrayDeDiasxSemana.map(s=>(
                    <>
                    <h3>SEMANA {s.semana}</h3>
                    <div style={{width: '1300px'}} className='d-flex justify-content-center'>
                    <Table
                                className="table-centered table-striped table-normal mb-0"
                            >
                                <thead className="bg-primary">
                                    <tr>
                                        <th className='text-white text-center p-1' rowSpan={2} colSpan={1} style={{width: '130px'}}>DIA Y FECHA</th>
                                        <th className='text-white text-center p-1' colSpan={2}>HORARIO </th>
                                        <th className='text-white text-center p-1' colSpan={2}>ASISTENCIA</th>
                                        <th className='text-white text-center p-1' colSpan={2}>RESUMEN</th>
                                        <th className='text-white text-center p-1' colSpan={2}>PERMISOS</th>
                                        {/* <th className='text-white text-center p-1' colSpan={2}>SALIDAS</th> */}
                                        <th className='text-white text-center p-1' rowSpan={2} colSpan={1} style={{width: '100px'}}>HORAS <br/> EXTRAS</th>
                                    </tr>
                                    <tr>
                                        <th className='text-white text-center p-1' colSpan={1} style={{width: '110px'}}>ENTRADA</th>
                                        <th className='text-white text-center p-1' colSpan={1} style={{width: '110px'}}>SALIDA</th>

                                        <th className='text-white text-center p-1' colSpan={1} style={{width: '110px'}}>ENTRADA</th>
                                        <th className='text-white text-center p-1' colSpan={1} style={{width: '110px'}}>SALIDA</th>

                                        <th className='text-white text-center p-1' colSpan={1} style={{width: '80px'}}>HORAS</th>
                                        {/* <th className='text-white text-center p-1' colSpan={2}>ASIST.</th> */}
                                        {/* <th className='text-white text-center p-1' colSpan={1}>JORNADA</th> */}
                                        <th className='text-white text-center p-1' colSpan={1} style={{width: '80px'}}><div className='p-0' >TARDANZAS</div></th>
                                        {/* <th className='text-white text-center p-1' colSpan={1}>S. TEMPR.</th> */}
                                        {/* <th className='text-white text-center p-1' colSpan={1}>S. TEMPR.</th> */}

                                        <th className='text-white text-center m-0 p-0' colSpan={1} style={{width: '130px'}}><div className='p-0'>AUTORIZADO</div></th>
                                        <th className='text-white text-center m-0 p-0' colSpan={1} style={{width: '130px'}}><div className='p-0'>NO <br/> AUTORIZADO</div></th>

                                        {/* <th className='text-white text-center p-1' colSpan={1}>CON SUELDO</th>
                                        <th className='text-white text-center p-1' colSpan={1}>SIN SUELDO</th> */}
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                {
                                    s.items.map(i=>{
                                        const jornadaEntrada = dayjs.utc(i.jornadaEntrada, 'hh:mm').format('hh:mm A')
                                        const jornadaSalida = dayjs.utc(i.jornadaSalida, 'hh:mm').format('hh:mm A')
                                        const marcacionInicio = dayjs.utc(i.marcacionInicio).format('hh:mm A')
                                        const marcacionFin = dayjs.utc(i.marcacionFin).format('hh:mm A')
                                        const tardanzas = (!isNaN(restarMinutos( jornadaEntrada, marcacionInicio))&&restarMinutos( jornadaEntrada, marcacionInicio)>0)&& `${restarMinutos( jornadaEntrada, marcacionInicio)} MIN`
                                        const salidasTempranas = (!isNaN(restarMinutos( jornadaSalida, marcacionFin))&&restarMinutos( jornadaSalida, marcacionFin)<0)&& `${-restarMinutos( jornadaSalida, marcacionFin)} MIN`
                                        // console.log(new Date(marcacionInicio), i.marcacionInicio, "gg", dayjs(i.fecha, 'DD/MM').format('dddd DD'), "jor");
                                        // console.log(
                                        //     calcularMinutosDesdeHoraCero(jornadaEntrada)-calcularMinutosDesdeHoraCero(marcacionInicio)
                                        // );
                                        
                                        return(
                                                    <tr className=''>
                                                        <th>{dayjs.utc(i.fecha, 'DD/MM/YYYY').format('dddd DD')}</th>
                                                        <td>{i.jornadaEntrada!='00:00'&&jornadaEntrada}</td>
                                                        <td>{i.jornadaSalida!='00:00'&&jornadaSalida}</td>
                                                        <td>{i.marcacionInicio!='00:00:00'&&i.jornadaEntrada!='00:00'&&marcacionInicio}</td>
                                                        <td>{i.marcacionFin!='00:00:00'&&i.jornadaSalida!='00:00'&&marcacionFin}</td>
                                                        <td>{i.jornadaEntrada!='00:00'&&restarTiempo(jornadaEntrada, jornadaSalida)}</td>
                                                        {/* <td>{i.marcacionInicio!='00:00:00'&&i.jornadaEntrada!='00:00'&&restarTiempo(marcacionInicio, marcacionFin)}</td> */}
                                                        {/* <td></td> */}
                                                        <td>{isNaN(marcacionInicio)&& tardanzas}</td>
                                                        {/* <td>{i.marcacionInicio!='00:00:00'&&(restarMinutos(marcacionFin ,jornadaSalida )<=0) && (restarMinutos(marcacionFin ,jornadaSalida )>=0)&&`${restarMinutos(marcacionFin ,jornadaSalida)} MIN`} </td> */}
                                                        {/* <td>{isNaN(marcacionInicio)&& salidasTempranas}</td> */}
                                                        {/* <td></td> */}
                                                        <td></td>
                                                        <td></td>
                                                        {/* <td>SALA</td>
                                                        <td>SALB</td> */}
                                                        <td></td>
                                                    </tr>
                                        )
                                    }
                                )
                                }
                                </tbody>
                        </Table>
                    </div>
                    </>
                ))
              }
                    <br/>
              </Col>
              <Col xxl={2}>
              <Table
                          className="table-centered mb-0"
                      >
                          <thead className="bg-primary">
                              <tr>
                                  <th className='text-white text-center p-1' colSpan={2}>TIEMPO NORMAL</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <th>ASISTENCIA</th>
                                  <td>194:17</td>
                              </tr>
                              <tr>
                                  <th>JORNADA</th>
                                  <td>194:17</td>
                              </tr>
                              <tr>
                                  <th>AUSENCIA</th>
                                  <td>194:17</td>
                              </tr>
                              <tr>
                                  <th>ATRASO</th>
                                  <td>194:17</td>
                              </tr>
                              <tr>
                                  <th>SALIDA TEMPRANA</th>
                                  <td>194:17</td>
                              </tr>
                          </tbody>
                </Table>
              </Col>
              <Col xxl={2}>
              <Table
                          className="table-centered mb-0"
                      >
                          <thead className="bg-primary">
                              <tr>
                                  <th className='text-white text-center p-1' colSpan={2}>TOTAL DE SALIDAS ESPECIALES</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>MARTES 03/10</td>
                                  <td>LUNES 02/10</td>
                              </tr>
                          </tbody>
                </Table>
              </Col>
              <Col xxl={2}>
              <Table
                          className="table-centered mb-0"
                      >
                          <thead className="bg-primary">
                              <tr>
                                  <th className='text-white text-center p-1' colSpan={2}>CANTIDAD</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>MARTES 03/10</td>
                                  <td>LUNES 02/10</td>
                              </tr>
                          </tbody>
                </Table>
              </Col>
              <Col xxl={6}>
              <Table
                          className="table-centered mb-0"
                      >
                          <thead className="bg-primary">
                              <tr>
                                  <th className='text-white text-center p-1' colSpan={2}>HORAS EXTRAS</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>MARTES 03/10</td>
                                  <td>LUNES 02/10</td>
                              </tr>
                          </tbody>
                </Table>
              </Col>
            </Row>
          </div>
    </Dialog>
  )
}




function obtenerDiasPorRango(fechaDesde, fechaHasta, marcaciones, jornadas) {
    const fechaInicio = dayjs(fechaDesde, 'DD/MM/YYYY');
    const fechaFin = dayjs(fechaHasta, 'DD/MM/YYYY');
    const dataDiasRango = [];
    let semanaActual = [];
    let semanaNumero = 1;
    let fechaActual = fechaInicio;

    // Crear un mapa de marcaciones para acceso rápido
    const mapaMarcaciones = marcaciones.reduce((mapa, item) => {
        const fecha = dayjs(item.fecha).format('DD/MM/YYYY');
        mapa[fecha] = {
            inicio: item.items[0].tiempo_marcacion_new,
            fin: item.items[item.items.length - 1].tiempo_marcacion_new,
        };
        return mapa;
    }, {});

    // Crear un mapa de jornadas para acceso rápido
    const mapaJornadas = jornadas.reduce((mapa, item) => {
        if (!mapa[item.semana]) mapa[item.semana] = {};
        mapa[item.semana][item.dia] = {
            entrada: item.entrada,
            salida: item.salida,
        };
        return mapa;
    }, {});

    const diasSemana = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

    while (fechaActual.isBefore(fechaFin) || fechaActual.isSame(fechaFin)) {
        const diaFormateado = fechaActual.format('DD/MM/YYYY');
        
        const diaSemana = fechaActual.day(); // Obtiene el día de la semana (0=Domingo, 6=Sábado)
        const nombreDia = diasSemana[diaSemana];
        const marcacion = mapaMarcaciones[diaFormateado] || { inicio: '00:00:00', fin: '00:00:00' };
        const jornada = (mapaJornadas[semanaNumero] && mapaJornadas[semanaNumero][nombreDia]) || { entrada: '00:00', salida: '00:00' };
        // Añadir el día con marcación y jornada al array de la semana actual
        semanaActual.push({
            fecha: diaFormateado,
            marcacionInicio: marcacion.inicio,
            marcacionFin: marcacion.fin,
            jornadaEntrada: jornada.entrada,
            jornadaSalida: jornada.salida,
        });

        // Si es domingo o el último día del rango, cerrar la semana
        if (diaSemana === 0 || fechaActual.isSame(fechaFin)) {
            dataDiasRango.push({
                semana: semanaNumero,
                items: [...semanaActual],
            });
            semanaActual = [];
            semanaNumero++;
        }

        fechaActual = fechaActual.add(1, 'day');
    }

    return dataDiasRango;
    // const fechaInicio = dayjs(fechaDesde, 'DD/MM/YYYY');
    // const fechaFin = dayjs(fechaHasta, 'DD/MM/YYYY');
    // const dataDiasRango = [];
    // let semanaActual = [];
    // let semanaNumero = 1;
    // let fechaActual = fechaInicio;

    // // Crear un mapa de marcaciones para acceso rápido
    // const mapaMarcaciones = marcaciones.reduce((mapa, item) => {
    //     const fecha = dayjs(item.fecha).format('DD/MM');
    //     mapa[fecha] = {
    //         inicio: item.items[0].tiempo_marcacion_new,
    //         fin: item.items[item.items.length - 1].tiempo_marcacion_new,
    //     };
    //     return mapa;
    // }, {});

    // while (fechaActual.isBefore(fechaFin) || fechaActual.isSame(fechaFin)) {
    //     const diaFormateado = fechaActual.format('DD/MM');
    //     const marcacion = mapaMarcaciones[diaFormateado] || '00:00:00';

    //     // Añadir el día con su marcación al array de la semana actual
    //     semanaActual.push({ fecha: diaFormateado, marcacion });

    //     // Si es domingo o el último día del rango, cerrar la semana
    //     if (fechaActual.day() === 0 || fechaActual.isSame(fechaFin)) {
    //         dataDiasRango.push({
    //             semana: semanaNumero,
    //             items: [...semanaActual],
    //         });
    //         semanaActual = [];
    //         semanaNumero++;
    //     }

    //     fechaActual = fechaActual.add(1, 'day');
    // }

    // return dataDiasRango;
}





















// import { Button } from 'primereact/button';
// import { Dialog } from 'primereact/dialog'
// import React, { useRef, useState } from 'react'
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { ColumnGroup } from 'primereact/columngroup';
// import { Row } from 'primereact/row';

// export const ModalReportAsistencia = ({show, onHide, dataEmpl}) => {
//   const stepperRef = useRef(null);
//   const [sales] = useState([
//     { product: 'Bamboo Watch', lastYearSale: 51, thisYearSale: 40, lastYearProfit: 54406, thisYearProfit: 43342 },
//     { product: 'Black Watch', lastYearSale: 83, thisYearSale: 9, lastYearProfit: 423132, thisYearProfit: 312122 },
//     { product: 'Blue Band', lastYearSale: 38, thisYearSale: 5, lastYearProfit: 12321, thisYearProfit: 8500 },
//     { product: 'Blue T-Shirt', lastYearSale: 49, thisYearSale: 22, lastYearProfit: 745232, thisYearProfit: 65323 },
//     { product: 'Brown Purse', lastYearSale: 17, thisYearSale: 79, lastYearProfit: 643242, thisYearProfit: 500332 },
//     { product: 'Chakra Bracelet', lastYearSale: 52, thisYearSale: 65, lastYearProfit: 421132, thisYearProfit: 150005 },
//     { product: 'Galaxy Earrings', lastYearSale: 82, thisYearSale: 12, lastYearProfit: 131211, thisYearProfit: 100214 },
//     { product: 'Game Controller', lastYearSale: 44, thisYearSale: 45, lastYearProfit: 66442, thisYearProfit: 53322 },
//     { product: 'Gaming Set', lastYearSale: 90, thisYearSale: 56, lastYearProfit: 765442, thisYearProfit: 296232 },
//     { product: 'Gold Phone Case', lastYearSale: 75, thisYearSale: 54, lastYearProfit: 21212, thisYearProfit: 12533 }
// ]);

// const lastYearSaleBodyTemplate = (rowData) => {
//     return `${rowData.lastYearSale}%`;
// };

// const thisYearSaleBodyTemplate = (rowData) => {
//     return `${rowData.thisYearSale}%`;
// };

// const formatCurrency = (value) => {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// };

// const lastYearTotal = () => {
//     let total = 0;

//     for (let sale of sales) {
//         total += sale.lastYearProfit;
//     }

//     return formatCurrency(total);
// };

// const thisYearTotal = () => {
//     let total = 0;

//     for (let sale of sales) {
//         total += sale.thisYearProfit;
//     }

//     return formatCurrency(total);
// };

// const headerGroup = (
//     <ColumnGroup>
//         <Row>
//             <Column header="FECHA" rowSpan={2} colSpan={1} />
//             <Column header="Horario" colSpan={2} />
//             <Column header="Jornada real" colSpan={2} />
//             <Column header="Horas" colSpan={6} />
//             <Column header="Permisos y salidas" colSpan={3} />
//             <Column header="Horas extras" colSpan={1} rowSpan={2}/>
//             <Column header="Horas falta" colSpan={1} rowSpan={2}/>
//             <Column header="tipo de evento" colSpan={2} rowSpan={2}/>
//         </Row>
//         <Row>
//             <Column header="ENTRADA" colSpan={1} />
//             <Column header="SALIDA" colSpan={1} />
//             <Column header="ENTRADA" colSpan={1} />
//             <Column header="SALIDA" colSpan={1} />
//             <Column header="ASIGN." colSpan={1} />
//             <Column header="ASIST." colSpan={1} />
//             <Column header="JORNADA" colSpan={1} />
//             <Column header="ATRASO" colSpan={1} />
//             <Column header="S. TEMP." colSpan={1} />
//             <Column header="AUSENC." colSpan={1} />
//             <Column header="S.J.T" colSpan={1} />
//             <Column header="S.J.N.T" colSpan={1} />
//             <Column header="S.N.J" colSpan={1} />
//             {/* <Column header="" colSpan={1} /> */}
//         </Row>
//     </ColumnGroup>
// );

// const footerGroup = (
//     <ColumnGroup>
//         <Row>
//             <Column footer="Totals:" colSpan={3} footerStyle={{ textAlign: 'right' }} />
//             <Column footer={lastYearTotal} />
//             <Column footer={thisYearTotal} />
//         </Row>
//     </ColumnGroup>
// );
//   return (
//     <Dialog
//         visible={show}
//         onHide={onHide}
//         position='top'
//         style={{width: '110rem', borderRadius: '0 !important'}}
//         header='REPORTE DE ASISTENCIA'
//         >
//           <h4>PERIODO DESDE: 05/10/2024 </h4>
//           <h4>PERIODO HASTA: 05/11/2024 </h4>
//           <div className="card">
//             <DataTable value={sales} headerColumnGroup={headerGroup} tableStyle={{ minWidth: '50rem' }}>
//                 <Column field="product" />
//                 <Column field="lastYearSale" body={lastYearSaleBodyTemplate} />
//                 <Column field="thisYearSale" body={thisYearSaleBodyTemplate} />
//                 <Column field="thisYearSale" body={thisYearSaleBodyTemplate} />
//             </DataTable>
//         </div>
//     </Dialog>
//   )
// }

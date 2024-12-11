import { PageBreadcrumb } from '@/components'
import React, { useEffect } from 'react'
import { Card, Col, Row, Table } from 'react-bootstrap'
import { useReporteResumenComparativoStore } from './useReporteResumenComparativoStore'
import config from '@/config'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { FechaRange } from '@/components/RangeCalendars/FechaRange'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
export const ResumenComparativo = () => {
    const { obtenerComparativoResumen, dataGroup, loading, dataEstadoGroup, obtenerEstadosOrigenResumen } = useReporteResumenComparativoStore()

    const { RANGE_DATE } = useSelector(e=>e.DATA)
    useEffect(() => {
        if(RANGE_DATE[0]===null) return;
        if(RANGE_DATE[1]===null) return;
        obtenerComparativoResumen(RANGE_DATE)
        // obtenerEstadosOrigenResumen(RANGE_DATE)
    }, [RANGE_DATE])
    // console.log(dataGroup, dataGroup[0].detalle_ventaMembresium, groupByIdOrigen(dataGroup[0].detalle_ventaMembresium));
    // console.log(dataGroup[0].detalle_ventaMembresium);
    
    // console.log(dataGroup, groupByIdOrigen(dataGroup[0].detalle_ventaMembresium));
    
    
    
  return (
    <>
        {loading ?(
            <div className='text-center'>
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only"></span>
            </div>
          </div>

        ):(
            <>
            <PageBreadcrumb title={'RESUMEN COMPARATIVO'} subName={'T'}/>
            <FechaRange rangoFechas={RANGE_DATE}/>
            <br/>
            <Row>
                
                {
                    dataGroup.map(d=>(
                        <Col key={d.id_pgm} style={{paddingBottom: '1px !important'}} xxl={4}>
                            <Card>
                                <Card.Header className=' align-self-center'>
                                    {/* <Card.Title>
                                        <h4>{d.name_pgm}</h4>
                                    </Card.Title> */}
                                    <img src={`${config.API_IMG.LOGO}${d.tb_image[0].name_image}`} height={d.tb_image[0].height} width={d.tb_image[0].width}/>
                                    
                                </Card.Header>
                                <Card.Body style={{paddingBottom: '1px !important'}}>
                                    <br/>
                                    <Table
                                                        // style={{tableLayout: 'fixed'}}
                                                        className="table-centered mb-0"
                                                        hover
                                                        striped
                                                        responsive
                                                    >
                                                        <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>venta de <br/> membresias:</span></li>
                                                                        </td>
                                                                        <th>
                                                                            <span style={{fontSize: '40px'}} className='d-flex justify-content-end align-content-end align-items-end'>{d.detalle_ventaMembresium.length}</span>
                                                                        </th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <li className='d-flex flex-row justify-content-between p-2 text-center'><span className='fw-bold text-primary fs-2'>Ventas:</span></li>
                                                                        </td>
                                                                        <th> <span className='fs-2 d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.tarifa_total}/>}/></span></th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Ticket medio:</span></li>
                                                                        </td>
                                                                        <th> 
                                                                        <span className='fs-2 d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={(d.tarifa_total/d.detalle_ventaMembresium.length).toFixed(2)}/>}/></span>
                                                                        </th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Costo <br/> por sesion:</span></li>
                                                                        </td>
                                                                        <th> 
                                                                        <span className='fs-2 d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.tarifa_total/d.sesiones_total}/>}/></span>
                                                                        </th>
                                                                    </tr>
                                                                    
                                                        </tbody>
                                                    </Table>
                                {/* <ul className='text-decoration-none list-unstyled font-20'>
                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>venta de <br/> membresias:</span> <span className='fs-2 d-flex justify-content-end align-content-end align-items-end left'>{d.detalle_ventaMembresium.length}</span></li>
                                            <li className='d-flex flex-row justify-content-between p-2 text-center'><span className='fw-bold text-primary fs-2'>Ventas:</span> <span className='fs-2 d-flex justify-content-end align-content-end align-items-end left'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.tarifa_total}/>}/></span></li>
                                            <li className='d-flex flex-row justify-content-between p-2 text-center'><span className='fw-bold text-primary fs-2'>Ticket medio:</span> <span className='fs-2 d-flex justify-content-end align-content-end align-items-end left'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={(d.tarifa_total/d.detalle_ventaMembresium.length).toFixed(2)}/>}/></span></li>
                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Costo <br/> por sesion:</span> <span className='fs-2 d-flex justify-content-end align-content-end align-items-end left'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.tarifa_total/d.sesiones_total}/>}/></span></li>
                                            
                                        </ul> */}
                                </Card.Body>
                            </Card>
                        </Col>
                    
                    ))
                }
                {
                    dataGroup.map(d=>(
                        <Col key={d.id_pgm} style={{paddingBottom: '1px !important'}} xxl={4}>
                            <Card>
                                <Card.Header className=' align-self-center'>
                                    {/* <Card.Title>
                                        <h4>{d.name_pgm}</h4>
                                    </Card.Title> */}
                                    <img src={`${config.API_IMG.LOGO}${d.tb_image[0].name_image}`} height={d.tb_image[0].height} width={d.tb_image[0].width}/>
                                    
                                </Card.Header>
                                <Card.Body style={{paddingBottom: '1px !important'}}>
                                    <br/>
                                    <Table
                                                        // style={{tableLayout: 'fixed'}}
                                                        className="table-centered mb-0"
                                                        hover
                                                        striped
                                                        responsive
                                                    >
                                                        <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>NUEVOS:</span></li>
                                                                        </td>
                                                                        <th>
                                                                            <span style={{fontSize: '40px'}} className='d-flex justify-content-end align-content-end align-items-end'>{
                                                                        // console.log(groupByIdOrigen(d.detalle_ventaMembresium).filter(({ id_origen }) => id_origen !== 692 && id_origen !== 691)
                                                                        // .reduce((sum, { items }) => sum + items.length, 0))
                                                                        }
                                                                        {groupByIdOrigen(d.detalle_ventaMembresium).filter(({ id_origen }) => id_origen !== 692 && id_origen !== 691)
                                                                        .reduce((sum, { items }) => sum + items.length, 0)}
                                                                        </span>
                                                                        </th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <li className='d-flex flex-row justify-content-between p-2 text-center'><span className='fw-bold text-primary fs-2'>REINSCRIPCIONES:</span></li>
                                                                        </td>
                                                                        <th> <span style={{fontSize: '40px'}} className='d-flex justify-content-end align-content-end align-items-end'>{groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===692)?groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===692)?.items.length:0}</span></th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>RENOVACIONES:</span></li>
                                                                        </td>
                                                                        <th> 
                                                                        <span style={{fontSize: '40px'}} className='d-flex justify-content-end align-content-end align-items-end'>{groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===691)?groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===691)?.items.length:0}</span>
                                                                        </th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRASPASOS:</span></li>
                                                                        </td>
                                                                        <th> 
                                                                        <span style={{fontSize: '40px'}} className='d-flex justify-content-end align-content-end align-items-end'>{groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen==691)?.items.length}</span>
                                                                        </th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRANSFERENCIAS:</span></li>
                                                                        </td>
                                                                        <th> 
                                                                        <span style={{fontSize: '40px'}} className='d-flex justify-content-end align-content-end align-items-end'>{groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen==691)?.items.length}</span>
                                                                        </th>
                                                                    </tr>
                                                                    
                                                        </tbody>
                                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    
                    ))
                }
                {
                    // dataEstadoGroup.map(d=>(
                    //     <Col key={d.id_pgm} style={{paddingBottom: '1px !important'}} xxl={4}>
                    //         <Card>
                    //         <Card.Header className=' align-self-center'>
                    //                 {/* <Card.Title>
                    //                     <h4>{d.name_pgm}</h4>
                    //                 </Card.Title> */}
                    //                 <img src={`${config.API_IMG.LOGO}${d.tb_image[0].name_image}`} height={d.tb_image[0].height} width={d.tb_image[0].width}/>
                                    
                    //             </Card.Header>
                    //             <Card.Body>
                    //             <li className='d-flex flex-column'><span className='fw-bold text-primary fs-2'></span> <span className='fs-2'>
                    //                             <div className='table-responsive'>
                    //                             <Table
                    //                                     // style={{tableLayout: 'fixed'}}
                    //                                     className="table-centered mb-0"
                    //                                     hover
                    //                                     striped
                    //                                     responsive
                    //                                 >
                    //                                     <tbody>
                    //                                             <tr>
                    //                                                 <td>NUEVOS</td>
                    //                                                 <th>
                    //                                                     <span style={{fontSize: '40px', marginRight: '120px'}} className='d-flex justify-content-end align-content-end align-items-end'>{d.detallesNuevos.length}</span>
                    //                                                 </th>
                    //                                             </tr> 
                                                                
                    //                                             <tr>
                    //                                                 <td>REINSCRIPCIONES</td>
                    //                                                 <th>
                    //                                                     <span style={{fontSize: '40px', marginRight: '120px'}} className='d-flex justify-content-end align-content-end align-items-end'>{d.detallesReinscritos.length}</span>
                    //                                                 </th>
                    //                                             </tr> 
                    //                                             <tr>
                    //                                                 <td>RENOVACIONES</td>
                    //                                                 <th>
                    //                                                     <span style={{fontSize: '40px', marginRight: '120px'}} className='d-flex justify-content-end align-content-end align-items-end'>{d.detallesRenovaciones.length}</span>
                    //                                                 </th>
                    //                                             </tr> 
                    //                                             <tr>
                    //                                                 <td>TRANSFERENCIAS</td>
                    //                                                 <th>
                    //                                                     <span style={{fontSize: '40px', marginRight: '120px'}} className='d-flex justify-content-end align-content-end align-items-end'>30</span>
                    //                                                 </th>
                    //                                             </tr> 
                    //                                             <tr>
                    //                                                 <td>TRASPASOS</td>
                    //                                                 <th>
                    //                                                     <span style={{fontSize: '40px', marginRight: '120px'}} className='d-flex justify-content-end align-content-end align-items-end'>{d.detallesTraspasos.length}</span>
                    //                                                 </th>
                    //                                             </tr> 
                    //                                     </tbody>
                    //                                 </Table>
                    //                             </div>
                    //                             </span></li>
                    //             </Card.Body>
                    //         </Card>
                    //     </Col>
                    // ))
                }
                
                
                {
                    dataGroup.map(d=>(
                        <Col key={d.id_pgm} style={{paddingBottom: '1px !important'}} xxl={4}>
                            <Card>
                            <Card.Header className=' align-self-center'>
                                    {/* <Card.Title>
                                        <h4>{d.name_pgm}</h4>
                                    </Card.Title> */}
                                    <img src={`${config.API_IMG.LOGO}${d.tb_image[0].name_image}`} height={d.tb_image[0].height} width={d.tb_image[0].width}/>
                                    
                                </Card.Header>
                                <Card.Body>
                                <li className='d-flex flex-column'><span className='fw-bold text-primary fs-2'>MEMBRESIAS POR HORARIO</span> <span className='fs-2'>
                                                <div className='table-responsive'>
                                                <Table
                                                        // style={{tableLayout: 'fixed'}}
                                                        className="table-centered mb-0"
                                                        hover
                                                        striped
                                                        responsive
                                                    >
                                                        <thead className="bg-primary">
                                                            <tr>
                                                                <th className='text-white p-1'>Horarios</th>
                                                                <th className='text-white p-1' 
                                                                >
                                                                    <div 
                                                                style={{marginLeft: '60px'}}>
                                                                    CANT.
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {/* {
                                                                console.log(
                                                                    Object.values(agruparPorHorario(d.detalle_ventaMembresium)).sort((a, b) => new Date(a.horario) - new Date(b.horario))
                                                                )
                                                                
                                                            } */}
                                                            {
                                                                Object.values(agruparPorHorario(d.detalle_ventaMembresium)).sort((a, b) => new Date(a.horario) - new Date(b.horario))
                                                                .filter(item => {
                                                                    const hour = dayjs(item.horario).hour();
                                                                    const isAM = dayjs(item.horario).format('A') === 'AM';
                                                                    return hour <= 12 && isAM;
                                                                }).map(h=>{
                                                                    return (
                                                                    <tr>
                                                                        <td>{dayjs.utc(h.horario).format('hh:mm A')}</td>
                                                                        <th>
                                                                            <span style={{fontSize: '40px', marginRight: '120px'}} className='d-flex justify-content-end align-content-end align-items-end'>{h.detalles.length}</span>
                                                                        </th>
                                                                        {/* <span style={{fontSize: '40px'}} className='d-flex justify-content-end align-content-end align-items-end'>{1}</span> */}

                                                                    </tr> 
                                                                )
                                                                }
                                                            )
                                                            }
                                                            {
                                                                Object.values(agruparPorHorario(d.detalle_ventaMembresium)).sort((a, b) => new Date(a.horario) - new Date(b.horario)).filter(item => {
                                                                    const hour = dayjs(item.horario).hour();
                                                                    const isAM = dayjs(item.horario).format('A') === 'PM';
                                                                    return hour >= 12 && isAM;
                                                                }).map((h, index)=>{
                                                                    return (
                                                                        <>
                                                                        {/* <div className={index==0&&'border-primary border-bottom-3'} style={{height: '100px'}}>
                                                                        </div> */}
                                                                        {
                                                                            index==0?(

                                                                                <tr style={{borderTop: '5px solid red'}} key={index}>
                                                                                <td>{dayjs.utc(h.horario).format('hh:mm A')}</td>
                                                                                <th>
                                                                                    <span style={{fontSize: '40px', marginRight: '120px'}} className='d-flex justify-content-end align-content-end align-items-end'>{h.detalles.length}</span>
                                                                                </th>
                                                                            </tr> 
                                                                            ):(
                                                                            <tr className={''} key={index}>
                                                                                <td>{dayjs.utc(h.horario).format('hh:mm A')}</td>
                                                                                <th>
                                                                            <span style={{fontSize: '40px', marginRight: '120px'}} className='d-flex justify-content-end align-content-end align-items-end'>{h.detalles.length}</span>
                                                                        </th>
                                                                            </tr> 
                                                                            )
                                                                        }
                                                                        </>
                                                                )
                                                                }
                                                            )
                                                            }
                                                            <tr className={'fw-bold fs-1'}>
                                                                <td className='text-primary'>TOTAL</td>
                                                                <th><span style={{marginRight: '120px'}} className='d-flex justify-content-end align-content-end align-items-end'>{Object.values(agruparPorHorario(d.detalle_ventaMembresium)).reduce((sum, item) => sum + item.detalles.length, 0)}</span></th>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                </span></li>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                }
                
            </Row>
            </>
        )
        }
    </>
  )
}

// Agrupar por id_pgm con categorías separadas
function agruparVentasConDetalles({
    ventasProgramaNuevo = [],
    ventasProgramaReinscritos = [],
    ventasProgramaRenovaciones = [],
    ventasProgramaTraspasos = [],
    ventasProgramaTransferencias = [],
}) {
    const agrupados = {};

    const agregarDetalles = (array, tipo) => {
        array.forEach((venta) => {
            const { name_pgm, id_pgm, tb_image, detalle_ventaMembresium } = venta;

            // Generar una clave única para el agrupamiento
            const key = `${name_pgm}_${id_pgm}`;

            // Si el grupo no existe, se inicializa
            if (!agrupados[key]) {
                agrupados[key] = {
                    name_pgm,
                    id_pgm,
                    tb_image: [],
                    detallesNuevos: [],
                    detallesReinscritos: [],
                    detallesRenovaciones: [],
                    detallesTraspasos: [],
                    detalleTransferencias: [],
                };
            }

            // Agregar `tb_image` solo si no está ya incluido
            if (!agrupados[key].tb_image.some((img) => img === tb_image)) {
                agrupados[key].tb_image.push(tb_image);
            }
            console.log(tipo, "dddd");
            

            // Agregar el detalle al tipo correspondiente
            agrupados[key][tipo].push(detalle_ventaMembresium);
        });
    };

    // Procesar cada tipo de ventas
    agregarDetalles(ventasProgramaNuevo, "detallesNuevos");
    agregarDetalles(ventasProgramaReinscritos, "detallesReinscritos");
    agregarDetalles(ventasProgramaRenovaciones, "detallesRenovaciones");
    agregarDetalles(ventasProgramaTraspasos, "detallesTraspasos");
    agregarDetalles(ventasProgramaTransferencias, "detalleTransferencias");
    

    // Convertir el objeto agrupado en un array
    return Object.values(agrupados);
}

// Ejemplo de uso con los arrays proporcionados
// const ventasUnidas = 

const agruparPorHorario = (data) => {
    return data?.reduce((acumulador, item) => {
      const horario = item.horario;
  
      if (!acumulador[horario]) {
        acumulador[horario] = {
          horario,
          tarifa_total: 0,
          sesiones_total: 0,
          detalles: [],
        };
      }
  
      acumulador[horario].tarifa_total += item.tarifa_monto;
      acumulador[horario].sesiones_total += item.tb_semana_training.sesiones;
      acumulador[horario].detalles.push(item);
  
      return acumulador;
    }, {});
  };

  const groupByIdOrigen = (data) => {
	return data.reduce((acc, item) => {
		const idOrigen = item.tb_ventum.id_origen;

		// Busca si ya existe un grupo para este id_origen
		let group = acc.find((g) => g.id_origen === idOrigen);

		if (!group) {
			// Si no existe, crea uno nuevo
			group = { id_origen: idOrigen, items: [] };
			acc.push(group);
		}

		// Agrega el elemento al grupo correspondiente
		group.items.push(item);
		return acc;
	}, []);
};
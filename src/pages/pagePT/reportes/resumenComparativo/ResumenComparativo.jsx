import { PageBreadcrumb } from '@/components'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Table } from 'react-bootstrap'
import { useReporteResumenComparativoStore } from './useReporteResumenComparativoStore'
import config from '@/config'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { NumberFormatMoney, NumberFormatter } from '@/components/CurrencyMask'
import { FechaRange } from '@/components/RangeCalendars/FechaRange'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
import { ModalSocios } from './ModalSocios'
import { VentasPorComprobante } from './VentasPorComprobante'
import { arrayEstadoCivil, arrayOrigenDeCliente, arraySexo } from '@/types/type'

dayjs.extend(utc);
export const ResumenComparativo = () => {
    const { obtenerComparativoResumen, dataGroup, loading, dataGroupTRANSFERENCIAS, dataEstadoGroup, obtenerEstadosOrigenResumen } = useReporteResumenComparativoStore()

    const { RANGE_DATE } = useSelector(e=>e.DATA)
    const [isOpenModalSocio, setisOpenModalSocio] = useState(false)
    const [clickDataSocios, setclickDataSocios] = useState([])
    const [clickDataLabel, setclickDataLabel] = useState('')
    useEffect(() => {
        if(RANGE_DATE[0]===null) return;
        if(RANGE_DATE[1]===null) return;
        obtenerComparativoResumen(RANGE_DATE)
        // obtenerEstadosOrigenResumen(RANGE_DATE)
    }, [RANGE_DATE])
    // console.log(dataGroup, dataGroup[0].detalle_ventaMembresium, groupByIdOrigen(dataGroup[0].detalle_ventaMembresium));
    // console.log(dataGroup[0].detalle_ventaMembresium);
    
    // console.log(dataGroup, groupByIdOrigen(dataGroup[0].detalle_ventaMembresium));
    const onOpenModalSOCIOS = (d, label)=>{
        console.log(d);
        setclickDataSocios(d.detalle_ventaMembresium)
        setclickDataLabel(label)
        setisOpenModalSocio(true)
    }
    const onCloseModalSOCIOS = ()=>{
        setisOpenModalSocio(false)
    }
    const dataNewGroup = dataGroup.map(f=>{
        return {
            ...f,
            detalle_ventaMembresium: f.detalle_ventaMembresium.map(g=>{
                return {...g, id_tipoFactura: g.tb_ventum?.id_tipoFactura}
            })
        }
    })
    function dataAlterada(detalleMem) {
        return detalleMem.map(g=>{
            const tb_ventum = g.tb_ventum
            const tb_cliente = g.tb_ventum?.tb_cliente
            const nombres_apellidos_cli = `${tb_cliente?.nombre_cli} ${tb_cliente?.apPaterno_cli} ${tb_cliente?.apMaterno_cli}`
            const estCivil_cli = tb_cliente?.estCivil_cli;
            const sexo_cli=tb_cliente?.sexo_cli;
            const origen = tb_ventum?.id_origen
            const labelDistrito = tb_cliente?.tb_distrito.distrito
            const labelEstCivil = arrayEstadoCivil.find(f=>f.value === estCivil_cli)?.label
            const labelOrigen = arrayOrigenDeCliente.find(f=>f.value === origen)?.label
            const labelSexo = arraySexo.find(f=>f.value === sexo_cli)?.label
            return {
                nombres_apellidos_cli,
                tarifa_monto: g.tarifa_monto,
                labelDistrito,
                labelEstCivil,
                labelOrigen,
                labelSexo
            }
        })
    }
    const ProcData = dataGroup.map(f=>f.detalle_ventaMembresium?.map(g=>{
        const tb_ventum = g.tb_ventum
        const tb_cliente = g.tb_ventum?.tb_cliente
        const nombres_apellidos_cli = `${tb_cliente?.nombre_cli} ${tb_cliente?.apPaterno_cli} ${tb_cliente?.apMaterno_cli}`
        const estCivil_cli = tb_cliente?.estCivil_cli;
        const sexo_cli=tb_cliente?.sexo_cli;
        const origen = tb_ventum?.id_origen
        const labelDistrito = tb_cliente?.tb_distrito?.distrito
        const labelEstCivil = arrayEstadoCivil.find(f=>f.value === estCivil_cli)?.label
        const labelOrigen = arrayOrigenDeCliente.find(f=>f.value === origen)?.label
        const labelSexo = arraySexo.find(f=>f.value === sexo_cli)?.label
        return {
            nombres_apellidos_cli,
            tarifa_monto: g.tarifa_monto,
            labelDistrito,
            labelEstCivil,
            labelOrigen,
            labelSexo
        }
    }))

    // const GroupProcedencia = ProcData[0].reduce((resultado, item) => {
	// 	// Buscar si ya existe un grupo con el mismo id_pgm
	// 	let grupo = resultado.find((g) => g.labelOrigen === item.labelOrigen);

	// 	if (!grupo) {
	// 		// Si no existe, crear uno nuevo
	// 		grupo = { labelOrigen: item.labelOrigen, items: [] };
	// 		resultado.push(grupo);
	// 	}

	// 	// Agregar el objeto {venta_venta, id_pgm} al grupo
	// 	grupo.items.push({  labelOrigen: item.labelOrigen });

	// 	return resultado;
	// }, []);
    // const GroupDistrito = ProcData.reduce((resultado, item) => {
	// 	// Buscar si ya existe un grupo con el mismo id_pgm
	// 	let grupo = resultado.find((g) => g.labelDistrito === item.labelDistrito);

	// 	if (!grupo) {
	// 		// Si no existe, crear uno nuevo
	// 		grupo = { labelDistrito: item.labelDistrito, items: [] };
	// 		resultado.push(grupo);
	// 	}

	// 	// Agregar el objeto {venta_venta, id_pgm} al grupo
	// 	grupo.items.push({ venta_venta: item.venta_venta, labelDistrito: item.labelDistrito });

	// 	return resultado;
	// }, []);
    // const GroupSexo = ProcData.reduce((resultado, item) => {
	// 	// Buscar si ya existe un grupo con el mismo id_pgm
	// 	let grupo = resultado.find((g) => g.labelSexo === item.labelSexo);

	// 	if (!grupo) {
	// 		// Si no existe, crear uno nuevo
	// 		grupo = { labelSexo: item.labelSexo, items: [] };
	// 		resultado.push(grupo);
	// 	}

	// 	// Agregar el objeto {venta_venta, id_pgm} al grupo
	// 	grupo.items.push({ venta_venta: item.venta_venta, labelSexo: item.labelSexo });

	// 	return resultado;
	// }, []);

    function GroupProcedencia(detalledata) {
        // console.log(detalledata);
        
        return arrayOrigenDeCliente.map((sexo) => {
            // Filtrar los datos correspondientes al label actual
            const items = detalledata.filter((item) => item.labelOrigen === sexo.label);
    
            // Retornar la estructura agrupada
            return {
                labelOrigen: sexo.label,
                items: items, // Si no hay coincidencias, será un array vacío []
            };
        });
    }
    function GroupDistrito(detalledata) {
        return detalledata.reduce((resultado, item) => {
            // Buscar si ya existe un grupo con el mismo id_pgm
            let grupo = resultado.find((g) => g.labelDistrito === item.labelDistrito);
    
            if (!grupo) {
                // Si no existe, crear uno nuevo
                grupo = { labelDistrito: item.labelDistrito, items: [] };
                resultado.push(grupo);
            }
    
            // Agregar el objeto {venta_venta, id_pgm} al grupo
            grupo.items.push({ venta_venta: item.venta_venta, labelDistrito: item.labelDistrito });
    
            return resultado;
        }, []);
    }
    function GroupSexo(detalledata) {
        return arraySexo.map((sexo) => {
            // Filtrar los datos correspondientes al label actual
            const items = detalledata.filter((item) => item.labelSexo === sexo.label);
    
            // Retornar la estructura agrupada
            return {
                labelSexo: sexo.label,
                items: items, // Si no hay coincidencias, será un array vacío []
            };
        });
    }
    
    /*
    */
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
            <PageBreadcrumb title={'RESUMEN PARA MARKETING'} subName={'T'}/>
            <FechaRange rangoFechas={RANGE_DATE}/>
            <br/>
            
            {/* <VentasPorComprobante dataGroup={dataGroup}/> */}
            <Row>
                
                {
                    dataGroup.map(d=>{

                        
                        const ventasSinCeros = groupByIdFactura(d.detalle_ventaMembresium).filter(f=>f.id_tipoFactura!==701).map(m=>m.items).flat()
                        const traspasos = groupByIdFactura(d.detalle_ventaMembresium).filter(f=>f.id_tipoFactura==701).map(m=>m.items).flat()
                        const nuevosxProgram = groupByIdOrigen(ventasSinCeros).filter(f=>f.id_origen!==691&&f.id_origen!==692)
                        const reinscripcionesxProgram = groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===692)?groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===692)?.items.length:0
                        const renovacionesxProgram = groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===691)?groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===691)?.items.length:0
                        // console.log(d.detalle_ventaMembresium, "newww");
                        const ventas = nuevosxProgram
                        .reduce((sum, { items }) => sum + items.length, 0)+renovacionesxProgram+reinscripcionesxProgram
                        
                        const sesionesVendidas = ventasSinCeros.map(t=>t.tb_semana_training?.sesiones).reduce((acumulador, numero) => acumulador + numero, 0)
                        console.log("asdf", d);
                        
                        
                        return (
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
                                                        // hover
                                                        striped
                                                        responsive
                                                    >
                                                        <tbody>
                                                                    <tr>
                                                                            <td className='' onClick={()=>onOpenModalSOCIOS(d, 'ventas')}>
                                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>venta de <br/> membresias:</span></li>
                                                                            </td>
                                                                            <td>
                                                                                <span style={{fontSize: '40px'}} className='d-flex justify-content-end align-content-end align-items-end'>{ventas}</span>
                                                                            </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Venta acumulada:</span></li>
                                                                        </td>
                                                                        <td> <span className='fs-1 d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.tarifa_total}/>}/></span></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Ticket medio:</span></li>
                                                                        </td>
                                                                        <td> 
                                                                        <span className='fs-1 d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={(d.tarifa_total/ventas).toFixed(2)}/>}/></span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Sesiones <br/> vendidas:</span></li>
                                                                        </td>
                                                                        <td> 
                                                                        <span className='fs-1 d-flex justify-content-end align-content-end align-items-end'><NumberFormatter amount={sesionesVendidas}/></span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Costo <br/> por sesion:</span></li>
                                                                        </td>
                                                                        <td> 
                                                                        <span className='fs-1 d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.tarifa_total/sesionesVendidas}/>}/></span>
                                                                        </td>
                                                                    </tr>
                                                                    
                                                        </tbody>
                                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                    }
                )
                }
                {
                    dataGroup.map(d=>
                    {
                        const ventasSinCeros = groupByIdFactura(d.detalle_ventaMembresium).filter(f=>f.id_tipoFactura!==701).map(m=>m.items).flat()
                        const traspasos = groupByIdFactura(d.detalle_ventaMembresium).filter(f=>f.id_tipoFactura==701).map(m=>m.items).flat()
                        const nuevosxProgram = groupByIdOrigen(ventasSinCeros).filter(f=>f.id_origen!==691&&f.id_origen!==692)
                        const reinscripcionesxProgram = groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===692)?groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===692)?.items.length:0
                        const renovacionesxProgram = groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===691)?groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===691)?.items.length:0
                        // console.log(d.detalle_ventaMembresium, "newww");
                        const sumaEstado = nuevosxProgram.reduce((sum, { items }) => sum + items.length, 0)+reinscripcionesxProgram+renovacionesxProgram+traspasos.length
                        return(
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
                                                        // hover
                                                        striped
                                                        responsive
                                                    >
                                                        <tbody>
                                                                    <tr>
                                                                        <td onClick={()=>onOpenModalSOCIOS(d, 'nuevos')}>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>NUEVOS:</span></li>
                                                                        </td>
                                                                        <td>
                                                                            <span style={{fontSize: '40px'}} className='d-flex justify-content-end align-content-end align-items-end'>{
                                                                        // console.log(groupByIdOrigen(d.detalle_ventaMembresium).filter(({ id_origen }) => id_origen !== 692 && id_origen !== 691)
                                                                        // .reduce((sum, { items }) => sum + items.length, 0))
                                                                        }
                                                                        {nuevosxProgram
                                                                        .reduce((sum, { items }) => sum + items.length, 0)}
                                                                        </span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td onClick={()=>onOpenModalSOCIOS(d, 'renovaciones')}>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>RENOVACIONES:</span></li>
                                                                        </td>
                                                                        <td> 
                                                                        <span style={{fontSize: '40px'}} className=' d-flex justify-content-end align-content-end align-items-end'>{renovacionesxProgram}</span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td onClick={()=>onOpenModalSOCIOS(d, 'reinscripciones')}>
                                                                            <li className='d-flex flex-row justify-content-between p-2 text-center'><span className='fw-bold text-primary fs-2'>REINSCRIPCIONES:</span></li>
                                                                        </td>
                                                                        <td> <span style={{fontSize: '40px'}} className='d-flex justify-content-end align-content-end align-items-end'>{reinscripcionesxProgram}</span></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td onClick={()=>onOpenModalSOCIOS(d, 'traspasos')}>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRASPASOS:</span></li>
                                                                        </td>
                                                                        <td> 
                                                                        <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end'>{traspasos.length-d.ventas_transferencias.length||0}</span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td onClick={()=>onOpenModalSOCIOS(d, 'transferencias')}>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRANSFERENCIAS:</span></li>
                                                                        </td>
                                                                        <td> 
                                                                        <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end'>{d.ventas_transferencias.length||0}</span>
                                                                        </td>
                                                                    </tr>
                                                                    
                                                                    <tr className='bg-primary'>
                                                                        <td>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL:</span></li>
                                                                        </td>
                                                                        <td> 
                                                                        <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                            {sumaEstado}</span>
                                                                        </td>
                                                                    </tr>
                                                                    
                                                        </tbody>
                                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                    }
                )
                }
                <VentasPorComprobante dataGroup={dataGroup}/>
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
                                <li className='d-flex flex-column'><span className='fw-bold text-primary fs-2'>VENTAS POR HORARIO</span> <span className='fs-2'>
                                                <Table
                                                        // style={{tableLayout: 'fixed'}}
                                                        className="table-centered mb-0"
                                                        // hover
                                                        striped
                                                        responsive
                                                    >
                                                        <thead className="bg-primary">
                                                            <tr>
                                                                <th className='text-white p-2 py-2'>Horarios</th>
                                                                <th className='text-white p-2 py-2' 
                                                                >
                                                                    <div 
                                                                style={{marginLeft: '60px'}}>
                                                                    CANT.
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
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
                                                                        <td>
                                                                        {/* {h.detalles.length} */}
                                                                        <span style={{fontSize: '40px'}} className=' d-flex justify-content-end align-content-end align-items-end'>{h.detalles.length}</span>
                                                                        {/* {''} */}
                                                                            {/* <span style={{fontSize: '40px', marginRight: '120px'}} className='d-flex justify-content-end align-content-end align-items-end'>{h.detalles.length}</span> */}
                                                                        </td>
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
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex justify-content-end align-content-end align-items-end'>{h.detalles.length}</span>
                                                                                </td>
                                                                            </tr> 
                                                                            ):(
                                                                            <tr className={''} key={index}>
                                                                                <td>{dayjs.utc(h.horario).format('hh:mm A')}</td>
                                                                                <td>
                                                                            <span style={{fontSize: '40px'}} className='d-flex justify-content-end align-content-end align-items-end'>{h.detalles.length}</span>
                                                                            </td>
                                                                            </tr> 
                                                                            )
                                                                        }
                                                                        </>
                                                                )
                                                                }
                                                            )
                                                            }
                                                        </tbody>
                                                            
                                                            <tr className='bg-primary'>
                                                                        <td>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL:</span></li>
                                                                        </td>
                                                                        <td> 
                                                                        <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                            {Object.values(agruparPorHorario(d.detalle_ventaMembresium)).reduce((sum, item) => sum + item.detalles.length, 0)}</span>
                                                                        </td>
                                                                    </tr>
                                                    </Table>
                                                </span></li>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                }
                
                {
                        dataGroup.map(d=>{
                            const ventasSinCeros = groupByIdFactura(d.detalle_ventaMembresium).filter(f=>f.id_tipoFactura!==701).map(m=>m.items).flat()
                            const traspasos = groupByIdFactura(d.detalle_ventaMembresium).filter(f=>f.id_tipoFactura==701).map(m=>m.items).flat()
                            const nuevosxProgram = groupByIdOrigen(ventasSinCeros).filter(f=>f.id_origen!==691&&f.id_origen!==692)
                            const reinscripcionesxProgram = groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===692)?groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===692)?.items.length:0
                            const renovacionesxProgram = groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===691)?groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===691)?.items.length:0
                            const sumaEstado = nuevosxProgram.reduce((sum, { items }) => sum + items.length, 0)+reinscripcionesxProgram+renovacionesxProgram+traspasos.length
                            
                            return(
                            <Col key={d.id_pgm} style={{paddingBottom: '1px !important'}} xxl={4}>
                                <Card>
                                <Card.Header className=' align-self-center'>
                                        {/* <Card.Title>
                                            <h4>{d.name_pgm}</h4>
                                        </Card.Title> */}
                                        <img src={`${config.API_IMG.LOGO}${d.tb_image[0].name_image}`} height={d.tb_image[0].height} width={d.tb_image[0].width}/>
                                        
                                    </Card.Header>
                                    <Card.Body>
                                    <li className='d-flex flex-column'><span className='fs-2'>
                                                    <div className='table-responsive'>
                                                    <Table
                                                            // style={{tableLayout: 'fixed'}}
                                                            className="table-centered mb-0"
                                                            // hover
                                                            striped
                                                            responsive
                                                        >
                                                            <thead className="bg-primary">
                                                                <tr>
                                                                    <th className='text-white p-2 py-2'>PROCEDENCIA</th>
                                                                    <th className='text-white p-2 py-2' 
                                                                    >
                                                                        CANT.
                                                                        {/* <div 
                                                                    style={{marginLeft: '60px'}}>
                                                                        </div> */}
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                
                                                                {
                                                                    GroupProcedencia(dataAlterada(d.detalle_ventaMembresium)).map(g=>(
                                                                        
                                                            <tr>
                                                            <td>
                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{g.labelOrigen}</span></li>
                                                            </td>
                                                            <th> 
                                                            <span className='fs-1 d-flex justify-content-end align-content-end align-items-end'>{g.items.length}</span>
                                                            </th>
                                                        </tr>
                                                                    ))
                                                                }
                                                                
                                                            </tbody>
                                                        <tr className='bg-primary'>
                                                                        <td>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL:</span></li>
                                                                        </td>
                                                                        <td> 
                                                                        <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                            {sumaEstado}</span>
                                                                        </td>
                                                                    </tr>
                                                        </Table>
                                                    </div>
                                                    </span></li>
                                    </Card.Body>
                                </Card>
                            </Col>
                            )
                        }
                        )
                    }

                    
                {
                        dataGroup.map(d=>{
                            const ventasSinCeros = groupByIdFactura(d.detalle_ventaMembresium).filter(f=>f.id_tipoFactura!==701).map(m=>m.items).flat()
                            const traspasos = groupByIdFactura(d.detalle_ventaMembresium).filter(f=>f.id_tipoFactura==701).map(m=>m.items).flat()
                            const nuevosxProgram = groupByIdOrigen(ventasSinCeros).filter(f=>f.id_origen!==691&&f.id_origen!==692)
                            const reinscripcionesxProgram = groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===692)?groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===692)?.items.length:0
                            const renovacionesxProgram = groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===691)?groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===691)?.items.length:0
                            const sumaEstado = nuevosxProgram.reduce((sum, { items }) => sum + items.length, 0)+reinscripcionesxProgram+renovacionesxProgram+traspasos.length
                            console.log(GroupSexo(dataAlterada(d.detalle_ventaMembresium)));
                            
                            return(
                            <Col key={d.id_pgm} style={{paddingBottom: '1px !important'}} xxl={4}>
                                <Card>
                                <Card.Header className=' align-self-center'>
                                        {/* <Card.Title>
                                            <h4>{d.name_pgm}</h4>
                                        </Card.Title> */}
                                        <img src={`${config.API_IMG.LOGO}${d.tb_image[0].name_image}`} height={d.tb_image[0].height} width={d.tb_image[0].width}/>
                                        
                                    </Card.Header>
                                    <Card.Body>
                                    <li className='d-flex flex-column'><span className='fs-2'>
                                                    <div className='table-responsive'>
                                                    <Table
                                                            // style={{tableLayout: 'fixed'}}
                                                            className="table-centered mb-0"
                                                            // hover
                                                            striped
                                                            responsive
                                                        >
                                                            <thead className="bg-primary">
                                                                <tr>
                                                                    <th className='text-white p-2 py-2'>SEXO</th>
                                                                    <th className='text-white p-2 py-2' 
                                                                    >
                                                                        <div 
                                                                    style={{marginLeft: '60px'}}>
                                                                        CANT.
                                                                        </div>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    GroupSexo(dataAlterada(d.detalle_ventaMembresium)).map(g=>(
                                                                        
                                                            <tr>
                                                            <td>
                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{g.labelSexo}</span></li>
                                                            </td>
                                                            <th> 
                                                            <span className='fs-1 d-flex justify-content-end align-content-end align-items-end'>{g.items.length}</span>
                                                            </th>
                                                        </tr>
                                                                    ))
                                                                }
                                                            </tbody>
                                                            
                                                        <tr className='bg-primary'>
                                                                        <td>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL:</span></li>
                                                                        </td>
                                                                        <td> 
                                                                        <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                            {sumaEstado}</span>
                                                                        </td>
                                                                    </tr>
                                                        </Table>
                                                    </div>
                                                    </span></li>
                                    </Card.Body>
                                </Card>
                            </Col>
                            )
                        }
                        )
                    }
                    {
                            dataGroup.map(d=>{
                                const ventasSinCeros = groupByIdFactura(d.detalle_ventaMembresium).filter(f=>f.id_tipoFactura!==701).map(m=>m.items).flat()
                            const traspasos = groupByIdFactura(d.detalle_ventaMembresium).filter(f=>f.id_tipoFactura==701).map(m=>m.items).flat()
                            const nuevosxProgram = groupByIdOrigen(ventasSinCeros).filter(f=>f.id_origen!==691&&f.id_origen!==692)
                            const reinscripcionesxProgram = groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===692)?groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===692)?.items.length:0
                            const renovacionesxProgram = groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===691)?groupByIdOrigen(d.detalle_ventaMembresium).find(f=>f.id_origen===691)?.items.length:0
                            const sumaEstado = nuevosxProgram.reduce((sum, { items }) => sum + items.length, 0)+reinscripcionesxProgram+renovacionesxProgram+traspasos.length
                            
                                return(
                                <Col key={d.id_pgm} style={{paddingBottom: '1px !important'}} xxl={4}>
                                    <Card>
                                    <Card.Header className=' align-self-center'>
                                            {/* <Card.Title>
                                                <h4>{d.name_pgm}</h4>
                                            </Card.Title> */}
                                            <img src={`${config.API_IMG.LOGO}${d.tb_image[0].name_image}`} height={d.tb_image[0].height} width={d.tb_image[0].width}/>
                                            
                                        </Card.Header>
                                        <Card.Body>
                                        <li className='d-flex flex-column'><span className='fs-2'>
                                                        <div className='table-responsive'>
                                                        <Table
                                                                // style={{tableLayout: 'fixed'}}
                                                                className="table-centered mb-0"
                                                                // hover
                                                                striped
                                                                responsive
                                                            >
                                                                <thead className="bg-primary">
                                                                    <tr>
                                                                        <th className='text-white p-2 py-2'>DISTRITO</th>
                                                                        <th className='text-white p-2 py-2' 
                                                                        >
                                                                            <div 
                                                                        style={{marginLeft: '60px'}}>
                                                                            CANT.
                                                                            </div>
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        GroupDistrito(dataAlterada(d.detalle_ventaMembresium)).map(g=>(
                                                                            
                                                            <tr>
                                                            <td>
                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{g.labelDistrito}</span></li>
                                                            </td>
                                                            <th> 
                                                            <span className='fs-1 d-flex justify-content-end align-content-end align-items-end'>{g.items.length}</span>
                                                            </th>
                                                        </tr>
                                                                        ))
                                                                    }
                                                                </tbody>
                                                                
                                                        <tr className='bg-primary'>
                                                                        <td>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL:</span></li>
                                                                        </td>
                                                                        <td> 
                                                                        <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                            {sumaEstado}</span>
                                                                        </td>
                                                                    </tr>
                                                            </Table>
                                                        </div>
                                                        </span></li>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                )
                            }
                            )
                        }
            </Row>
            </>
        )
        }
        <ModalSocios clickDataLabel={clickDataLabel} onHide={onCloseModalSOCIOS} data={clickDataSocios} show={isOpenModalSocio}/>
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
      acumulador[horario].sesiones_total += item.tb_semana_training?.sesiones;
      acumulador[horario].detalles.push(item);
  
      return acumulador;
    }, {});
  };

  const groupByIdOrigen = (data) => {
	return data.reduce((acc, item) => {
		const idOrigen = item.tb_ventum?.id_origen;

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
const groupByIdFactura = (data) => {
  return data.reduce((acc, item) => {
      const idFactura = item.tb_ventum?.id_tipoFactura;

      // Busca si ya existe un grupo para este id_origen
      let group = acc.find((g) => g.id_tipoFactura === idFactura);

      if (!group) {
          // Si no existe, crea uno nuevo
          group = { id_tipoFactura: idFactura, items: [] };
          acc.push(group);
      }

      // Agrega el elemento al grupo correspondiente
      group.items.push(item);
      return acc;
  }, []);
};
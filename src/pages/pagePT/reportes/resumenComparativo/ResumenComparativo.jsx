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
import { arrayDistritoTest, arrayEstadoCivil, arrayOrigenDeCliente, arraySexo } from '@/types/type'
import { VentasxMesGrafico } from './VentasxMesGrafico'
import { VentasMesGrafico } from './HistoricoVentasMembresias/VentasMesGrafico'
import { CardGraficoTotalDeEstadoCliente } from './HistoricoVentasMembresias/CardGraficoTotalDeEstadoCliente'
import SimpleBar from 'simplebar-react'
import { ModalTableSocios } from './ModalTableSocios'
import { ItemTableTotal } from './ItemTableTotal'
import { TableTotal } from './TableTotal'

dayjs.extend(utc);
export const ResumenComparativo = () => {
    const { obtenerComparativoResumen, dataIdPgmCero, obtenerHorariosPorPgm, dataMarcacions, dataTarifas, dataHorarios, dataGroup, loading, dataGroupTRANSFERENCIAS, dataEstadoGroup, obtenerEstadosOrigenResumen, obtenerTarifasPorPgm, dataAsesoresFit, obtenerAsesoresFit } = useReporteResumenComparativoStore()

    const { RANGE_DATE } = useSelector(e=>e.DATA)
    const [isOpenModalSocio, setisOpenModalSocio] = useState(false)
    const [avatarProgramaSelect, setavatarProgramaSelect] = useState({})
    const [clickDataSocios, setclickDataSocios] = useState([])
    const [clickDataLabel, setclickDataLabel] = useState('')
    useEffect(() => {
        obtenerTarifasPorPgm()
        obtenerAsesoresFit()
    }, [])
    
    useEffect(() => {
        if(RANGE_DATE[0]===null) return;
        if(RANGE_DATE[1]===null) return;
        obtenerComparativoResumen(RANGE_DATE)
        obtenerHorariosPorPgm()
        // obtenerEstadosOrigenResumen(RANGE_DATE)
    }, [RANGE_DATE])
    const onOpenModalSOCIOS = (d, avatarPrograma, label)=>{
        // console.log(d, "d???????????");
        setavatarProgramaSelect(avatarPrograma)
        setclickDataSocios(d)
        setclickDataLabel(label)
        setisOpenModalSocio(true)
    }
    const onCloseModalSOCIOS = ()=>{
        setisOpenModalSocio(false)
    }
    //AGRUPADO POR ARRAYS
    function agruparPorSexo(detalledata) {
        return arraySexo?.map(({ label, value, order }) => {
            const items = detalledata?.filter(
              (cliente) => cliente.tb_ventum.tb_cliente.sexo_cli === value
            );
            return {
              propiedad: label,
              order,
              value,
              items,
            };
          });
    }
    function agruparPorDistrito(detalledata) {
        const arrayDistritos = detalledata?.map(d=>d.tb_ventum.tb_cliente.tb_distrito.distrito)
        // console.log(detalledata, arrayDistritos, "detalledata");
        return arrayDistritoTest?.map(({ label, value, order }) => {
            const items = detalledata?.filter(
              (cliente) => cliente.tb_ventum.tb_cliente.tb_distrito.distrito === label
            );
            return {
              propiedad: label,
              order,
              value,
              items,
            };
          });
    }
    function agruparPorTarifas(detalledata) {
        const tarifas = dataTarifas?.map(({ label, value, order }) => {
            const items = detalledata?.filter(
              (cliente) => cliente.id_tarifa === value
            );
            
            return {
              propiedad: label,
              order,
              value,
              items,
            };
          });
          return tarifas?.filter(f=>f.items?.length > 0);
    }
    function agruparPorProcedencia(detalledata) {
        return arrayOrigenDeCliente?.map(({ label, value, order }) => {
            const items = detalledata?.filter(
              (cliente) => cliente.tb_ventum.id_origen === value
            );
            return {
              propiedad: label,
              order,
              value,
              items,
            };
          });
    }
    function agruparPorEstCivil(detalledata) {
        return arrayEstadoCivil?.map(({ label, value, order }) => {
            const items = detalledata?.filter(
              (cliente) => cliente.tb_ventum.tb_cliente.estCivil_cli === value
            );
            return {
              propiedad: label,
              order,
              value,
              items,
            };
          });
    }
    //AGRUPAR POR HORARIOS
    function agruparPorHorarios(detalledata) {
        return arrayOrigenDeCliente.map(({ label, value, order }) => {
            const items = detalledata.filter(
              (cliente) => cliente.horario === value
            );
            return {
              propiedad: label,
              order,
              value,
              items,
            };
          });
    }
    function agruparPorSesiones(data) {
        const resultado = [];
      
        data?.forEach((item) => {
          const { sesiones } = item.tb_semana_training;
      
          // Verificar si ya existe un grupo con la misma cantidad de sesiones
          let grupo = resultado?.find((g) => g.propiedad === sesiones);
      
          if (!grupo) {
            // Si no existe, crear un nuevo grupo
            grupo = { propiedad: sesiones, items: [] };
            resultado.push(grupo);
          }
      
          // Agregar el item al grupo correspondiente
          grupo.items.push(item);
        });
      
        return resultado;
    }
    //AGRUPADO POR DIFERENTE DE MYOR A MENOR
    const agruparPorRangoEdad = (data) => {
        const rangos = [
            { rango_edad: "40 - 49", min: 40, max: 49 },
            // { rango_edad: "43 a 47", min: 43, max: 47 },
            { rango_edad: "30 - 39", min: 30, max: 39 },
            { rango_edad: "50 - 57", min: 50, max: 57 },
            { rango_edad: "58 - 75", min: 58, max: 75 },
            // { rango_edad: "34 a 39", min: 34, max: 39 },
            // { rango_edad: "56 a 59", min: 56, max: 59 },
            { rango_edad: "21 - 29", min: 21, max: 29 },
            // { rango_edad: "16 a 24", min: 16, max: 24 },
            { rango_edad: "12 - 20", min: 12, max: 20 },
            // { rango_edad: "60 a 69", min: 60, max: 69 },
            // { rango_edad: "64 a 69", min: 64, max: 69 },
            // { rango_edad: "76 a -|-", min: 70, max: Infinity },
          ];
          // Función para calcular la edad
  const calcularEdad = (fechaNacimiento, fechaVenta) => {
    const nacimiento = new Date(fechaNacimiento);
    const venta = new Date(fechaVenta);
    let edad = venta.getFullYear() - nacimiento.getFullYear();
    if (
      venta.getMonth() < nacimiento.getMonth() ||
      (venta.getMonth() === nacimiento.getMonth() && venta.getDate() < nacimiento.getDate())
    ) {
      edad--;
    }
    return edad;
  };

  function calcularDiferenciaFechas(fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
  
    const diferenciaAnios = fin.getFullYear() - inicio.getFullYear();
    return diferenciaAnios;
  }
  // Crear un objeto para agrupar por rango de edad
  const agrupado = rangos.map(rango => ({
    propiedad: rango.rango_edad,
    items: [],
  }));

  // Agrupar los datos
  data?.forEach(item => {
    const { fecNac_cli } = item.tb_ventum.tb_cliente;
    const { fecha_venta } = item.tb_ventum;
    const edad = calcularDiferenciaFechas(fecNac_cli, fecha_venta);

    const rango = agrupado.find(r => edad >= rangos.find(rg => rg.rango_edad === r.propiedad).min && edad <= rangos.find(rg => rg.rango_edad === r.propiedad).max);
    if (rango) {
      rango.items.push(item);
    }
  });

  return agrupado.sort((a,b)=>b.items.length-a.items.length);
      };
      
    // console.log(dataTarifas, "tarifas");
    const dataAlter = dataGroup.map(d=>{
        const avatarPrograma = {
            urlImage: `${config.API_IMG.LOGO}${d.tb_image[0].name_image}`,
            width: d.tb_image[0].width,
            height: d.tb_image[0].height
        }
        const test =  d.detalle_ventaMembresium.map((item) => {
            const relacionado = dataMarcacions.find(
              (obj) => obj.id_venta === item.tb_ventum.id
            );
            if (relacionado) {
              return { ...item, tb_marcacions: relacionado ? [relacionado] : [] };
            }
            return item;
          });
        const ventasEnCeros = test.filter(f=>f.tarifa_monto===0)
        const ventasSinCeros = test.filter(f=>f.tarifa_monto!==0)
        const TransferenciasEnCeros = d.ventas_transferencias
        const TraspasosEnCero = ventasEnCeros.filter(f=>f.tb_ventum.id_tipoFactura===701)
        const membresiasNuevas = ventasSinCeros.filter(f=>f.tb_ventum.id_origen!==691 && f.tb_ventum.id_origen!==692)
        const membresiasRenovadas = ventasSinCeros.filter(g=>g.tb_ventum.id_origen===691)
        const membresiasReinscritos = ventasSinCeros.filter(g=>g.tb_ventum.id_origen===692)
        const porSexo = agruparPorSexo(ventasSinCeros)
        const porDistrito= agruparPorDistrito(ventasSinCeros)
        const sumaDeSesiones = ventasSinCeros.reduce((total, item) => total + (item?.tb_semana_training.sesiones || 0), 0)
        const sumaDeVentasEnSoles = ventasSinCeros.reduce((total, item) => total + (item?.tarifa_monto || 0), 0)
        const agrupadoPorSesiones = agruparPorSesiones(ventasSinCeros)
        const agrupadoPorTarifas = agruparPorTarifas(ventasSinCeros)
        const agrupadoPorEstadoCivil = agruparPorEstCivil(ventasSinCeros)
        const agruparPorRangoEdades = agruparPorRangoEdad(ventasSinCeros).sort((a,b)=>a.items.length > b.items.length)
        const activosDeVentasPorSemanaMarcacions = agruparPrimeraMarcacionGlobal(ventasSinCeros) 
        // console.log(activosDeVentasPorSemanaMarcacions,  test, 'activossss');
        
        // const porHorario =
        // const porHorarios
        // const porProcedencia
        // const porAsesor
        // const porSemanas
        // const tarifas
        // const porEstadoCivil
        // const porRangoEdad
        // console.log({activosDeVentasPorSemanaMarcacions, agruparPorRangoEdades, agrupadoPorEstadoCivil, agrupadoPorTarifas, agrupadoPorSesiones, sumaDeVentasEnSoles, sumaDeSesiones, porSexo, porDistrito, ventasEnCeros, ventasSinCeros, membresiasNuevas, membresiasRenovadas, membresiasReinscritos}, "alter");
        return {
            activosDeVentasPorSemanaMarcacions,
            agruparPorRangoEdades,
            agrupadoPorEstadoCivil,
            agrupadoPorTarifas,
            agrupadoPorSesiones,
            sumaDeVentasEnSoles,
            sumaDeSesiones,
            avatarPrograma,
            ventasEnCeros, 
            TraspasosEnCero,
            TransferenciasEnCeros,
            porDistrito,
            porSexo,
            ventasSinCeros, 
            membresiasNuevas, 
            membresiasRenovadas, 
            membresiasReinscritos
        }
    })
    
    const dataAlterIdPgmCero =
    [dataIdPgmCero]?.map(d=>{
        const avatarPrograma = {
            urlImage: 'TOTAL',
        }
        const test =  d.detalle_ventaMembresium?.map((item) => {
            const relacionado = dataMarcacions?.find(
              (obj) => obj.id_venta === item.tb_ventum.id
            );
            if (relacionado) {
              return { ...item, tb_marcacions: relacionado ? [relacionado] : [] };
            }
            return item;
          });
        const ventasEnCeros = test?.filter(f=>f.tarifa_monto===0)
        const ventasSinCeros = test?.filter(f=>f.tarifa_monto!==0)
        const TransferenciasEnCeros = d.ventas_transferencias
        const TraspasosEnCero = ventasEnCeros?.filter(f=>f.tb_ventum.id_tipoFactura===701)
        const membresiasNuevas = ventasSinCeros?.filter(f=>f.tb_ventum.id_origen!==691 && f.tb_ventum.id_origen!==692)
        const membresiasRenovadas = ventasSinCeros?.filter(g=>g.tb_ventum.id_origen===691)
        const membresiasReinscritos = ventasSinCeros?.filter(g=>g.tb_ventum.id_origen===692)
        const porSexo = agruparPorSexo(ventasSinCeros)
        const porDistrito= agruparPorDistrito(ventasSinCeros)
        const sumaDeSesiones = ventasSinCeros?.reduce((total, item) => total + (item?.tb_semana_training.sesiones || 0), 0)
        const sumaDeVentasEnSoles = ventasSinCeros?.reduce((total, item) => total + (item?.tarifa_monto || 0), 0)
        const agrupadoPorSesiones = agruparPorSesiones(ventasSinCeros)
        const agrupadoPorTarifas = agruparPorTarifas(ventasSinCeros)
        const agrupadoPorEstadoCivil = agruparPorEstCivil(ventasSinCeros)
        const agruparPorRangoEdades = agruparPorRangoEdad(ventasSinCeros).sort((a,b)=>a.items.length > b.items.length)
        const activosDeVentasPorSemanaMarcacions = agruparPrimeraMarcacionGlobal(ventasSinCeros) 
        const avataresDeProgramas = dataIdPgmCero.tb_image
        // const montoTotal_ACTIVO = []
        // console.log(dataIdPgmCero);
        
        // const 
        // console.log(activosDeVentasPorSemanaMarcacions,  test, 'activossss');
        // console.log(agruparPorRangoEdades, "EDAD");
        
        // const porHorario =
        // const porHorarios
        // const porProcedencia
        // const porAsesor
        // const porSemanas
        // const tarifas
        // const porEstadoCivil
        // const porRangoEdad
        // console.log({activosDeVentasPorSemanaMarcacions, agruparPorRangoEdades, agrupadoPorEstadoCivil, agrupadoPorTarifas, agrupadoPorSesiones, sumaDeVentasEnSoles, sumaDeSesiones, porSexo, porDistrito, ventasEnCeros, ventasSinCeros, membresiasNuevas, membresiasRenovadas, membresiasReinscritos}, "alter");
        return {
            activosDeVentasPorSemanaMarcacions,
            agruparPorRangoEdades,
            agrupadoPorEstadoCivil,
            agrupadoPorTarifas,
            agrupadoPorSesiones,
            sumaDeVentasEnSoles,
            sumaDeSesiones,
            avatarPrograma,
            ventasEnCeros, 
            TraspasosEnCero,
            TransferenciasEnCeros,
            porDistrito,
            porSexo,
            ventasSinCeros, 
            membresiasNuevas, 
            membresiasRenovadas, 
            membresiasReinscritos,
            avataresDeProgramas
        }
    })
    console.log({dataIdPgmCero});
    
  return (
    <>
    
    <FechaRange rangoFechas={RANGE_DATE}/>
    {loading ?(
    <div className='text-center'>
    <div className="spinner-border text-primary" role="status">
      <span className="sr-only"></span>
    </div>
  </div>

):(
    <>
    <br/>
    
    <Row>
        {/* POR VENTAS */}
        <Col xxl={12}>
            <Row>
                    {
                        dataAlter.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                                <Card>
                                    <Card.Header className=' align-self-center'>
                                        {/* <Card.Title>
                                            <h4>{d.name_pgm}</h4>
                                        </Card.Title> */}
                                        <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                        
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
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>venta de <br/> membresias:</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{d.ventasSinCeros.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>
                                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Venta <br/> acumulada:</span></li>
                                                                            </td>
                                                                            <td> <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.sumaDeVentasEnSoles}/>}/></span></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>
                                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Ticket <br/> medio:</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={(d.sumaDeVentasEnSoles/d.ventasSinCeros.length).toFixed(2)}/>}/></span>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Sesiones <br/> vendidas:</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><NumberFormatter amount={d.sumaDeSesiones}/></span>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Costo <br/> por sesion:</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.sumaDeVentasEnSoles/d.sumaDeSesiones}/>}/></span>
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
                        dataAlterIdPgmCero.map(d=>{
                            return (
                                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                    <Card>
                                        <Card.Header className=' align-self-center'>
                                            {/* <Card.Title>
                                                <h4>{d.name_pgm}</h4>
                                            </Card.Title> */}
                                            {/* <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/> */}
                                            {/* <h2>TOTAL</h2> */}
                                        <div style={{fontSize: '120px'}}>TOTAL</div>
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
                                                                                    <td className=''>
                                                                                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>venta de <br/> membresias:</span></li>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{d?.ventasSinCeros?.length}</span>
                                                                                    </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Venta <br/> acumulada:</span></li>
                                                                                </td>
                                                                                <td> <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.sumaDeVentasEnSoles}/>}/></span></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Ticket <br/> medio:</span></li>
                                                                                </td>
                                                                                <td> 
                                                                                <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={(d.sumaDeVentasEnSoles/d.ventasSinCeros?.length).toFixed(2)}/>}/></span>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Sesiones <br/> vendidas:</span></li>
                                                                                </td>
                                                                                <td> 
                                                                                <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><NumberFormatter amount={d.sumaDeSesiones}/></span>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>
                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Costo <br/> por sesion:</span></li>
                                                                                </td>
                                                                                <td> 
                                                                                <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.sumaDeVentasEnSoles/d.sumaDeSesiones}/>}/></span>
                                                                                </td>
                                                                            </tr>
                                                                            
                                                                </tbody>
                                                            </Table>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })
                    }
            </Row>
        </Col>
        {/* POR ESTADO DEL CLIENTE */}
        <Col xxl={12}>
            <Row>
                    {
                        dataAlter.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                                <Card>
                                    <Card.Header className=' align-self-center'>
                                        {/* <Card.Title>
                                            <h4>{d.name_pgm}</h4>
                                        </Card.Title> */}
                                        <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                        
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
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.membresiasNuevas, d.avatarPrograma, `NUEVOS`)}>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>NUEVOS:</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{d.membresiasNuevas.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.membresiasRenovadas, d.avatarPrograma, `RENOVACIONES`)}>
                                                                            <td>
                                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>RENOVACIONES:</span></li>
                                                                            </td>
                                                                            <td> <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{d.membresiasRenovadas.length}</span></td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.membresiasReinscritos, d.avatarPrograma, `REINSCRIPCIONES`)}>
                                                                            <td>
                                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>REINSCRIPCIONES:</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{d.membresiasReinscritos.length}</span>
                                                                            </td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.TraspasosEnCero, d.avatarPrograma, `TRASPASOS`)}>
                                                                            <td>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRASPASOS PT:</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{d.TraspasosEnCero.length}</span>
                                                                            </td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.TransferenciasEnCeros, d.avatarPrograma, `TRANSFERENCIAS`)}>
                                                                            <td>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRANSFERENCIAS <br/>(COSTO CERO):</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{d.TransferenciasEnCeros.length}</span>
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
                        dataAlterIdPgmCero.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <Card>
                                    <Card.Header className=' align-self-center'>
                                        {/* <Card.Title>
                                            <h4>{d.name_pgm}</h4>
                                        </Card.Title> */}
                                        {/* <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/> */}
                                        <div style={{fontSize: '120px'}}>TOTAL</div>
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
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.membresiasNuevas, d.avatarPrograma, `NUEVOS`)}>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>NUEVOS:</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{d.membresiasNuevas?.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.membresiasRenovadas, d.avatarPrograma, `RENOVACIONES`)}>
                                                                            <td>
                                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>RENOVACIONES:</span></li>
                                                                            </td>
                                                                            <td> <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{d.membresiasRenovadas?.length}</span></td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.membresiasReinscritos, d.avatarPrograma, `REINSCRITOS`)}>
                                                                            <td>
                                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>REINSCRITOS:</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{d.membresiasReinscritos?.length}</span>
                                                                            </td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.TraspasosEnCero, d.avatarPrograma, `TRASPASOS`)}>
                                                                            <td>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRASPASOS PT:</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{d.TraspasosEnCero?.length}</span>
                                                                            </td>
                                                                        </tr>
                                                                        <tr onClick={()=>onOpenModalSOCIOS(d.TransferenciasEnCeros, d.avatarPrograma, `TRANSFERENCIAS`)}>
                                                                            <td>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRANSFERENCIAS <br/>(COSTO CERO):</span></li>
                                                                            </td>
                                                                            <td> 
                                                                            <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'>{13}</span>
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
            </Row>
        </Col>
        {/* POR ASESORES */}
        <Col xxl={12}>
            <Row>
                    {
                        dataAlter.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                                <Card>
                                    <Card.Header className=' align-self-center'>
                                        {/* <Card.Title>
                                            <h4>{d.name_pgm}</h4>
                                        </Card.Title> */}
                                        <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                        
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
                                                                {
                                                                    d.agrupadoPorSesiones.map(p=>{
                                                                        return (
                                                                            <tr onClick={()=>onOpenModalSOCIOS(p.items, d.avatarPrograma, `SESIONES - ${p.propiedad}`)}>
                                                                                    <td className=''>
                                                                                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad} SESIONES:</span></li>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items.length}</span>
                                                                                    </td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                            
                                                    <tr className='bg-primary'>
                                                                    <td>
                                                                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL:</span></li>
                                                                    </td>
                                                                    <td> 
                                                                    <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                        {d.agrupadoPorSesiones.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                        
                                                                    </span>
                                                                    </td>
                                                                </tr>
                                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                        }
                        )
                    }
                    {
                        dataAlterIdPgmCero.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <TableTotal avataresDeProgramas={d.avataresDeProgramas} labelTotal={'SESIONES'} tbImage={d.avataresDeProgramas} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.agrupadoPorSesiones}/>
                            </Col>
                        )
                        }
                        )
                    }
            </Row>
        </Col>
            
        {/* POR TARIFAS */}
        {/* POR PROCEDENCIA */}
        {/* ------------------------------------------------------------------------------------------------------------------------------------- */}
        {/* --------------------------------------ESTADISTICAS DE CLIENTE(TODOS, VENTAS)------------------------------------------------------------------------ */}
        {/* ------------------------------------------------------------------------------------------------------------------------------------- */}

        {/* POR SESIONES */}
        <Col xxl={12}>
        <Row>
                {
                    dataAlter.map(d=>{
                        return (
                        <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                            <Card>
                                <Card.Header className=' align-self-center'>
                                    {/* <Card.Title>
                                        <h4>{d.name_pgm}</h4>
                                    </Card.Title> */}
                                    <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                    
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
                                                            {
                                                                d.porDistrito.map(p=>{
                                                                    return (
                                                                        <tr onClick={()=>onOpenModalSOCIOS(p.items, d.avatarPrograma, `DISTRITO - ${p.propiedad}`)}>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}:</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                        
                                                <tr className='bg-primary'>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL:</span></li>
                                                                </td>
                                                                <td> 
                                                                <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                    {d.porDistrito.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                    
                                                                </span>
                                                                </td>
                                                            </tr>
                                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                    }
                    )
                }
                {
                    dataAlterIdPgmCero.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <TableTotal avataresDeProgramas={d.avataresDeProgramas} labelTotal={'DISTRITO'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.porDistrito}/>
                            </Col>
                        )
                        }
                    )
                }
        </Row>
        </Col>
        <Col xxl={12}>
        <Row>
                {
                    dataAlter.map(d=>{
                        return (
                        <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                            <Card>
                                <Card.Header className=' align-self-center'>
                                    {/* <Card.Title>
                                        <h4>{d.name_pgm}</h4>
                                    </Card.Title> */}
                                    <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                    
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
                                                            {
                                                                d.agruparPorRangoEdades.map(p=>{
                                                                    return (
                                                                        <tr onClick={()=>onOpenModalSOCIOS(p.items, d.avatarPrograma, `RANGO DE EDAD - ${p.propiedad}`)}>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}:</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                        
                                                <tr className='bg-primary'>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL:</span></li>
                                                                </td>
                                                                <td> 
                                                                <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                    {d.agruparPorRangoEdades.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                    
                                                                </span>
                                                                </td>
                                                            </tr>
                                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                    }
                    )
                }
                {
                    dataAlterIdPgmCero.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <TableTotal avataresDeProgramas={d.avataresDeProgramas} labelTotal={'RANGO DE EDAD'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.agruparPorRangoEdades}/>
                            </Col>
                        )
                        }
                    )
                }
        </Row>
        </Col>
        <Col xxl={12}>
        <Row>
        {
                    dataAlter.map(d=>{
                        return (
                        <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                            <Card>
                                <Card.Header className=' align-self-center'>
                                    {/* <Card.Title>
                                        <h4>{d.name_pgm}</h4>
                                    </Card.Title> */}
                                    <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                    
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
                                                            {
                                                                d.agrupadoPorEstadoCivil.map(p=>{
                                                                    return (
                                                                        <tr onClick={()=>onOpenModalSOCIOS(p.items, d.avatarPrograma, `ESTADO CIVIL - ${p.propiedad}`)}>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}:</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                        
                                                <tr className='bg-primary'>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL:</span></li>
                                                                </td>
                                                                <td> 
                                                                <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                    {d.agrupadoPorEstadoCivil.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                    
                                                                </span>
                                                                </td>
                                                            </tr>
                                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                    }
                )
                }
                {
                            dataAlterIdPgmCero.map(d=>{
                                return (
                                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <TableTotal avataresDeProgramas={d.avataresDeProgramas} labelTotal={'ESTADO CIVIL'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.agrupadoPorEstadoCivil}/>
                                    
                                </Col>
                            )
                            }
                        )
                        }
        </Row>
        </Col>
        <Col xxl={12}>
        <Row>
            {
                        dataAlter.map(d=>{
                            return (
                            <Col style={{paddingBottom: '1px !important'}} xxl={4}>
                                <Card>
                                    <Card.Header className=' align-self-center'>
                                        {/* <Card.Title>
                                            <h4>{d.name_pgm}</h4>
                                        </Card.Title> */}
                                        <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                        
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
                                                                {
                                                                    d.porSexo.map(p=>{
                                                                        return (
                                                                            <tr onClick={()=>onOpenModalSOCIOS(p.items, d.avatarPrograma, `GENERO - ${p.propiedad}`)}>
                                                                                    <td>
                                                                                        <li  className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>{p.propiedad}:</span></li>
                                                                                    </td>
                                                                                    <td>
                                                                                        <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items?.length}</span>
                                                                                    </td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                            
                                                    <tr className='bg-primary'>
                                                                    <td>
                                                                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL:</span></li>
                                                                    </td>
                                                                    <td> 
                                                                    <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                        {d.porSexo?.reduce((acc, curr) => acc + curr.items?.length, 0)}
                                                                        
                                                                    </span>
                                                                    </td>
                                                                </tr>
                                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                        }
                    )
                    }
                    {
                                dataAlterIdPgmCero.map(d=>{
                                    return (
                                    <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                                <TableTotal avataresDeProgramas={d.avataresDeProgramas} labelTotal={'SEXO'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.porSexo}/>
                                    </Col>
                                )
                                }
                            )
                            }
        </Row>
        </Col>
        {/* POR DISTRITO */}
        {/* POR HORARIOS */}
        {/* POR RANGO DE EDAD */}
        {/* POR ESTADO CIVIL */}
        {/* POR SEXO */}
        {/* POR MARCACIONES */}
        {/* <SimpleBar style={{ maxHeight: '100%'}} scrollbarMaxSize={300}>
            <div className='d-flex'>
                {
                    dataAlter.map(d=>{
                        return (
                        <Col className='mx-1' style={{paddingBottom: '1px !important'}} xxl={4}>
                            <Card>
                                <Card.Header className=' align-self-center'>
                                    <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/>
                                    
                                </Card.Header>
                                <Card.Body style={{paddingBottom: '1px !important'}}>
                                    <br/>
                                    <Table
                                                        className="table-centered mb-0"
                                                        striped
                                                        responsive
                                                    >
                                                        <tbody>
                                                            {
                                                                d.activosDeVentasPorSemanaMarcacions.map(p=>{
                                                                    return (
                                                                        <tr>
                                                                                <td className=''>
                                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>SEMANA {p.propiedad}:</span></li>
                                                                                </td>
                                                                                <td>
                                                                                    <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items.length}</span>
                                                                                </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                        
                                                <tr className='bg-primary'>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL:</span></li>
                                                                </td>
                                                                <td> 
                                                                <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                                                                    {d.activosDeVentasPorSemanaMarcacions.reduce((acc, curr) => acc + curr.items.length, 0)}
                                                                    
                                                                </span>
                                                                </td>
                                                            </tr>
                                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                    }
                )
                }
                <Col className='mx-2' xxl={4}>
                    <Card>
                        <Card.Header>
                            <h1 className='text-center'>TOTAL</h1>
                        </Card.Header>
                    </Card>
                </Col>
            </div>
        </SimpleBar> */}
        
    </Row>
    </>
)
}
                                    <ModalTableSocios
                                    clickDataSocios={clickDataSocios}
                                    avatarProgramaSelect={avatarProgramaSelect}
                                    clickDataLabel={clickDataLabel} show={isOpenModalSocio} onHide={onCloseModalSOCIOS}/>
        {/* <ModalSocios clickDataLabel={clickDataLabel} onHide={onCloseModalSOCIOS} data={clickDataSocios} show={isOpenModalSocio}/> */}
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


function agruparMarcacionesPorSemana(data) {
    return data.map((obj) => {
        const inicioMem = dayjs(obj.fec_inicio_mem);

        // Filtrar la primera marcación de cada día
        const primerasMarcaciones = Object.values(
            obj.tb_marcacions.reduce((acumulador, marcacion) => {
                const fechaDia = dayjs(marcacion.tiempo_marcacion).format('YYYY-MM-DD');
                if (
                    !acumulador[fechaDia] ||
                    dayjs(marcacion.tiempo_marcacion).isBefore(
                        acumulador[fechaDia].tiempo_marcacion
                    )
                ) {
                    acumulador[fechaDia] = marcacion; // Guardar la más temprana del día
                }
                return acumulador;
            }, {})
        );

        // Agrupar las primeras marcaciones por semana
        const marcacionPorSemana = primerasMarcaciones.reduce((acumulador, marcacion) => {
            const fechaMarcacion = dayjs(marcacion.tiempo_marcacion);

            // Calcular la semana desde el inicio de la membresía
            const diasDesdeInicio = fechaMarcacion.diff(inicioMem, 'day');
            const semana = Math.floor(diasDesdeInicio / 7) + 1;

            // Buscar o crear el grupo para esta semana
            let grupo = acumulador.find((g) => g.semana === semana);
            if (!grupo) {
                grupo = { semana, items: [] };
                acumulador.push(grupo);
            }

            // Añadir la marcación al grupo
            grupo.items.push(marcacion);

            return acumulador;
        }, []);

        // Retornar el objeto original con el nuevo array `marcacionPorSemana`
        return { ...obj, marcacionPorSemana };
    });
}

function agruparPrimeraMarcacionGlobal(data) {
    const marcacionesPorSemanaGlobal = {};

    data?.forEach((obj) => {
        const inicioMem = dayjs(obj.fec_inicio_mem);

        // Filtrar la primera marcación de cada día
        const primerasMarcaciones = Object?.values(
            obj.tb_marcacions?.reduce((acumulador, marcacion) => {
                const fechaDia = dayjs(marcacion.tiempo_marcacion).format('YYYY-MM-DD');
                if (
                    !acumulador[fechaDia] ||
                    dayjs(marcacion.tiempo_marcacion).isBefore(
                        acumulador[fechaDia].tiempo_marcacion
                    )
                ) {
                    acumulador[fechaDia] = marcacion; // Guardar la más temprana del día
                }
                return acumulador;
            }, {})
        );

        // Agrupar las primeras marcaciones por semana
        primerasMarcaciones.forEach((marcacion) => {
            const fechaMarcacion = dayjs(marcacion.tiempo_marcacion);

            // Calcular la semana desde el inicio de la membresía
            const diasDesdeInicio = fechaMarcacion.diff(inicioMem, 'day');
            const semana = Math.floor(diasDesdeInicio / 7) + 1;

            // Inicializar el grupo de la semana si no existe
            if (!marcacionesPorSemanaGlobal[semana]) {
                marcacionesPorSemanaGlobal[semana] = { propiedad: semana, items: [] };
            }

            // Añadir la marcación al grupo global
            marcacionesPorSemanaGlobal[semana].items.push({
                ...marcacion,
                fec_inicio_mem: obj.fec_inicio_mem,
                tb_marcacions: obj.tb_marcacions,
                marcacionPorSemana: obj.marcacionPorSemana,
            });
        });
    });

    // Convertir el objeto en un array
    return Object.values(marcacionesPorSemanaGlobal);
}
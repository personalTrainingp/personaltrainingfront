import { PageBreadcrumb } from '@/components'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Table } from 'react-bootstrap'
import { useReporteResumenComparativoStore } from './useReporteResumenComparativoStore'
import config from '@/config'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { FUNMoneyFormatter, NumberFormatMoney, NumberFormatter } from '@/components/CurrencyMask'
import { FechaRange } from '@/components/RangeCalendars/FechaRange'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
import { ModalSocios } from './ModalSocios'
import { VentasPorComprobante } from './VentasPorComprobante'
import { arrayDistritoTest, arrayEstadoCivil, arrayOrigenDeCliente, arrayOrigenEnCeroDeCliente, arraySexo } from '@/types/type'
import { VentasxMesGrafico } from './VentasxMesGrafico'
import { VentasMesGrafico } from './HistoricoVentasMembresias/VentasMesGrafico'
import { CardGraficoTotalDeEstadoCliente } from './HistoricoVentasMembresias/CardGraficoTotalDeEstadoCliente'
import SimpleBar from 'simplebar-react'
import { ModalTableSocios } from './ModalTableSocios'
import { ItemTableTotal } from './ItemTableTotal'
import { TableTotal } from './TableTotal'
import { Loading } from '@/components/Loading'
import { useInView } from 'react-intersection-observer'
import { useDispatch } from 'react-redux'
import { onSetViewSubTitle } from '@/store'
import { ItemTablePgm } from './ItemTablePgm'
import { ItemCardPgm } from './ItemCardPgm'
import { FormatTable } from './Component/FormatTable'
import { onSetDataView } from '@/store/data/dataSlice'
import { FormatDataTable } from './Component/FormatDataTable'
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);
export const ResumenComparativo = () => {
    const { obtenerComparativoResumen, dataIdPgmCero, 
            obtenerHorariosPorPgm, dataMarcacions, dataTarifas, dataHorarios, 
            dataGroup, loading, dataGroupTRANSFERENCIAS, dataEstadoGroup, 
            dataClientesxMarcacion,
            obtenerEstadosOrigenResumen, obtenerTarifasPorPgm, dataAsesoresFit, 
            obtenerAsesoresFit,
            obtenerClientesConMarcacion } = useReporteResumenComparativoStore()

    const dispatch = useDispatch()
    const { RANGE_DATE, dataView } = useSelector(e=>e.DATA)
    const [isOpenModalSocio, setisOpenModalSocio] = useState(false)
    const [avatarProgramaSelect, setavatarProgramaSelect] = useState({})
    const [clickDataSocios, setclickDataSocios] = useState([])
    const [clickDataLabel, setclickDataLabel] = useState('')
    const [isDataNeedGruped, setisDataNeedGruped] = useState(false)
    // COuseSelector(e=>e.DATA)
    useEffect(() => {
        if(RANGE_DATE[0]===null) return;
        if(RANGE_DATE[1]===null) return;
        obtenerComparativoResumen(RANGE_DATE)
        obtenerHorariosPorPgm()
        obtenerClientesConMarcacion()
        // obtenerEstadosOrigenResumen(RANGE_DATE)
    }, [RANGE_DATE])
    const onOpenModalSOCIOS = (d, avatarPrograma=[], label, )=>{
        // console.log(d, "d???????????");
        setavatarProgramaSelect(avatarPrograma)
        dispatch(onSetDataView(d))
        setclickDataSocios(d)
        setisDataNeedGruped(datagruped)
        setclickDataLabel(label)
        setisOpenModalSocio(true)
    }
    console.log({dataView});
    
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
    function agruparPorTarifas(data) {
        const resultado = [];
      
        data?.forEach((item) => {
            // console.log(item, "items");
            const {sesiones, semanas_st} = item.tb_semana_training
          const { nombreTarifa_tt, descripcionTarifa_tt, tarifaCash_tt, id_tt, fecha_fin, fecha_inicio, id_tipo_promocion } = item.tarifa_venta;
            const labelTarifa = `${nombreTarifa_tt}-${sesiones}`
          // Verificar si ya existe un grupo con la misma cantidad de sesiones
          let grupo = resultado?.find((g) => g.unif === labelTarifa);
      
          if (!grupo) {
            // Si no existe, crear un nuevo grupo
            grupo = { propiedad: <div className={id_tipo_promocion===3050?'text-black':''}>{nombreTarifa_tt} <br/> <div className='text-black'>{semanas_st} SEMANAS</div> <span className='font-24 mr-3'>x</span> <SymbolSoles isbottom={true}  numero={<NumberFormatMoney amount={tarifaCash_tt}/>}/><br/> {id_tipo_promocion===3050?'PROMOCION INTERNA':'PROMOCION REDES SOCIALES'} </div>, 
            unif: labelTarifa, 
            tarifaCash_tt, 
            sesiones, 
            semanas: (sesiones/5).toFixed(0), 
            items: [] ,
            fecha_inicio,
            fecha_fin
        };
            resultado.push(grupo);
          }
      
          // Agregar el item al grupo correspondiente
          grupo.items.push(item);
        });
      
        return resultado.sort((a,b)=>b.items.length-a.items.length);
    }
    function agruparPorVendedores(data) {
        const resultado = [];
      
        data?.forEach((item) => {
          const { id_empl, apMaterno_empl, apPaterno_empl, nombre_empl } = item.tb_ventum.tb_empleado;
      
          // Verificar si ya existe un grupo con la misma cantidad de sesiones
          let grupo = resultado?.find((g) => g.propiedad === nombre_empl);
      
          if (!grupo) {
            // Si no existe, crear un nuevo grupo
            grupo = { propiedad: nombre_empl, items: [] };
            resultado.push(grupo);
          }
      
          // Agregar el item al grupo correspondiente
          grupo.items.push(item);
        });
      
        return resultado.sort((a,b)=>b.items.length-a.items.length);
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
          }).sort((a,b)=>b.items.length-a.items.length);
    }
    function agruparPorProcedenciaEnCero(detalledata) {
        return arrayOrigenEnCeroDeCliente?.map(({ label, value, order }) => {
            const items = detalledata?.filter(
              (cliente) => cliente.tb_ventum.id_origen === value
            );
            return {
              propiedad: label,
              order,
              value,
              items,
            };
          }).sort((a,b)=>b.items.length-a.items.length);
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
    function agruparPorHorarios(data) {
        const resultado = [];
        
        data?.forEach((item) => {
          const { horario, tarifa_monto } = item;
          
          const formatHorario = dayjs.utc(horario).format("hh:mm A")
          console.log({formatHorario, horario});
          
        //   console.log(horario, formatHorario, "horarrrr");
          // Verificar si ya existe un grupo con la misma cantidad de sesiones
          let grupo = resultado?.find((g) => g.propiedad === formatHorario);
      
          if (!grupo) {
            // Si no existe, crear un nuevo grupo
            grupo = { propiedad: formatHorario, items: [], tarifa_monto };
            resultado.push(grupo);
          }
          // Agregar el item al grupo correspondiente
          grupo.items.push(item);
        });
        
        return resultado.sort((a,b)=>b.items.length-a.items.length).sort((a,b)=>b.tarifa_monto-a.tarifa_monto);
    }
    function agruparPorSesiones(data) {
        const resultado = [];
      
        data?.forEach((item) => {
          const { sesiones, semanas_st } = item.tb_semana_training;
      
          // Verificar si ya existe un grupo con la misma cantidad de sesiones
          let grupo = resultado?.find((g) => g.lbel === sesiones);
      
          if (!grupo) {
            // Si no existe, crear un nuevo grupo
            grupo = {  lbel: sesiones, propiedad: <div style={{width: '350px'}}>{semanas_st} SEMANAS <br/> {sesiones} Sesiones</div>, semanas_st, items: [] };
            resultado.push(grupo);
          }
      
          // Agregar el item al grupo correspondiente
          grupo.items.push(item);
        });
      
        return resultado.sort((a,b)=>b.items.length-a.items.length);
    }
    function agruparPorVenta(data) {
        if (!Array.isArray(data)) {
            console.error("La variable 'data' no es un array válido.");
            return [];
          }
        
          const resultado = data?.reduce((acc, item) => {
            const idVenta = item?.tb_ventum?.id; // Usar el operador de encadenamiento opcional
            if (!acc.has(idVenta)) {
              acc.set(idVenta, item);
            }
            return acc;
          }, new Map());
        
          // Convertir el Map en un array
          return Array.from(resultado?.values());
      }
      
    //AGRUPADO POR DIFERENTE DE MYOR A MENOR
    const agruparPorRangoEdad = (data) => {
        const rangos = [
            { rango_edad: "40 - 49", min: 40, max: 49 },
            // { rango_edad: "43 a 47", min: 43, max: 47 },
            { rango_edad: "30 - 39", min: 30, max: 39 },
            { rango_edad: "50 - 57", min: 50, max: 57 },
            { rango_edad: "58 - 75", min: 58, max: 75 },
            { rango_edad: "75 a mas", min: 75, max: Infinity },
            // { rango_edad: "34 a 39", min: 34, max: 39 },
            // { rango_edad: "56 a 59", min: 56, max: 59 },
            { rango_edad: "22 - 29", min: 22, max: 29 },
            // { rango_edad: "16 a 24", min: 16, max: 24 },
            { rango_edad: "12 - 21", min: 12, max: 21 },
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
    const { fecha_nacimiento } = item.tb_ventum.tb_cliente;
    const { fecha_venta } = item.tb_ventum;
    const edad = calcularDiferenciaFechas(fecha_nacimiento, fecha_venta);

    const rango = agrupado.find(r => edad >= rangos.find(rg => rg.rango_edad === r.propiedad).min && edad <= rangos.find(rg => rg.rango_edad === r.propiedad).max);
    if (rango) {
      rango.items.push(item);
    }
  });

  return agrupado.map(m=>{
    return {
        ...m,
        sexo: agruparPorSexo(m.items)
    }
  }).sort((a,b)=>b.items.length-a.items.length);
      };

      const AlterGrupo=(data)=>{
        data.map()
      }


      console.log({dataGroup});
      
    const dataAlter = dataGroup.map(d=>{
        const avatarPrograma = {
            urlImage: `${config.API_IMG.LOGO}${d.tb_image[0].name_image}`,
            width: d.tb_image[0].width,
            height: d.tb_image[0].height
        }
        
        const test =  d.detalle_ventaMembresium?.map((item) => {
            const relacionado = dataClientesxMarcacion.find(
                (obj) => {

                    return obj.id_cli === item.tb_ventum.id_cli
                }
              )
              return relacionado
                ? { ...item, tb_marcacions: relacionado.tb_marcacions.filter((f)=>{
                    const tiempoMarcacion = new Date(f.tiempo_marcacion);
                    const fechaInicio = new Date(item.fec_inicio_mem);
                    const fechaFin = new Date(item.fec_fin_mem);
                    return tiempoMarcacion >= fechaInicio && tiempoMarcacion <= fechaFin
                }) }
                : {...item, tb_marcacions: []};
          })
          const aforo = d.id_pgm===2?18:d.id_pgm===3?10:d.id_pgm===4?14:''
          const aforo_turno = d.id_pgm===2?36:d.id_pgm===3?10:d.id_pgm===4?14:''
          
          const ventasEnCeros =  agruparPorVenta(test)
          const ventasSinCeros =  agruparPorVenta(test)
          const TransferenciasEnCeros = d.ventas_transferencias
        const TraspasosEnCero = ventasEnCeros.filter(f=>f.tb_ventum.id_tipoFactura===701)
        const CanjesEnCero = ventasEnCeros.filter(f=>f.tb_ventum.id_tipoFactura===703)
        const membresiasNuevas = ventasSinCeros.filter(f=>f.tb_ventum.id_origen!==691 && f.tb_ventum.id_origen!==692)
        const membresiasRenovadas = ventasSinCeros.filter(g=>g.tb_ventum.id_origen===691)
        const membresiasReinscritos = ventasSinCeros.filter(g=>g.tb_ventum.id_origen===692)
        const sumaDeSesiones = ventasSinCeros.reduce((total, item) => total + (item?.tb_semana_training.sesiones || 0), 0)
        const sumaDeVentasEnSoles = ventasSinCeros.reduce((total, item) => total + (item?.tarifa_monto || 0), 0)
        const porSexo = agruparPorSexo(ventasSinCeros).map((grupo, index, array) => {
            const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
            const sumaXITEMS = grupo.items.length
            return [
            { header: "GENERO", value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL' },
            { header: "socios", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
            { header: "% socios", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100||0).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100||0).toFixed(2) },
                ]
            }
            )
            const porDistrito= agruparPorDistrito(ventasSinCeros).sort((a,b)=>b.items.length-a.items.length).map((grupo, index, array) => {
                const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
                const sumaXITEMS = grupo.items.length
                
                const sumaMontoxItems = grupo.items.reduce((total, item) => total+(item?.tarifa_monto||0), 0)
                const sumaTotalMonto = array.reduce((total, item)=>total + (item?.items.reduce((total, item) => total+(item?.tarifa_monto||0), 0) || 0), 0)
                console.log({grupo}, "por dist", sumaMontoxItems);
                return [
                { header: "DISTRITO", value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL' },
                { header: <>SOCIOS <br/> % SOCIOS</>, isSummary: true, value: <>{sumaXITEMS} <br/> {((sumaXITEMS/sumaTotal||0)*100).toFixed(2)} </>, tFood: <>{sumaTotal} <br/> {((sumaXITEMS/sumaXITEMS)*100).toFixed(2) && 0}</> },
                // { header: "% SOCIOS", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100).toFixed(2) },
                { header: "VENTA", isSummary: true, value: <NumberFormatMoney amount={sumaMontoxItems}/>, items: grupo.items, tFood: <NumberFormatMoney amount={sumaTotalMonto}/>},
                    ]
                }
                )
        const agrupadoPorSesiones = agruparPorSesiones(ventasSinCeros).map((grupo, index, array) => {
            const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
            const sumaXITEMS = grupo.items.length
            return [
            { header: "sesiones", value: grupo.lbel, isPropiedad: true, tFood: 'TOTAL' },
            { header: "SEMANAS", value: grupo.semanas_st,isPropiedad: true, tFood: '' },
            { header: "socios", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
            { header: "% socios", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100).toFixed(2) },
                ]
            }
            )
        const agrupadoPorEstadoCivil = agruparPorEstCivil(ventasSinCeros).map((grupo, index, array) => {
            const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
            const sumaXITEMS = grupo.items.length
            return [
            { header: "EST. CIVIL", value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL' },
            { header: "socios", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
            { header: "% socios", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100||0).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100||0).toFixed(2) },
                ]
            }
            )
            
            const agrupadoPorProcedencia = agruparPorProcedencia(ventasSinCeros).map((grupo, index, array) => {
                const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
                const sumaXITEMS = grupo.items.length
                return [
                { header: "PROCEDENCIA", value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL' },
                { header: "socios", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
                { header: "% socios", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100).toFixed(2) },
                    ]
                }
                )
                
            const agrupadoPorVendedores = agruparPorVendedores(ventasSinCeros).map((grupo, index, array) => {
                const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
                const sumaXITEMS = grupo.items.length
                return [
                { header: "ASESORES", value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL' },
                { header: "socios", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
                { header: "% socios", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100).toFixed(2) },
                    ]
                }
                )
                
            const agrupadoPorTarifas = agruparPorTarifas(ventasSinCeros).map((grupo, index, array) => {
                const sumaTotalSocio = array.reduce((total, item) => total + (item?.items.length || 0), 0)

                return [
                    { header: "PROMOCION", isTime: true, value: grupo.propiedad, isPropiedad: true, tFood: '' },
                    { header: "SOCIOS", isTime: true, value: grupo.items.length, tFood: sumaTotalSocio },
                    // { header: <>SEMANAS<br/>(sesiones)</>, value: <div style={{fontSize: '26px'}}>{grupo.semanas} SEMANAS<br/> {grupo.sesiones} SESIONES</div>, items: grupo.items, tFood: '' },
                    // { header: <div className='d-flex justify-content-center'>S/.</div>, value: <NumberFormatMoney amount={grupo.tarifaCash_tt}/>, tFood: '' },
                    { header: <div className='d-flex justify-content-center'>FECHA</div>, value: <div className='text-primary'> <span className='text-black'>INICIO: </span><br/>{dayjs(grupo.fecha_inicio, 'YYYY-MM-DD').format('DD/MM/YYYY')}<br/> <span className='text-black'>FIN: </span> <br/>{grupo.fecha_fin?dayjs(grupo.fecha_fin, 'YYYY-MM-DD').format('DD/MM/YYYY'):'ABIERTO'}<br/> </div>, items: grupo.items },
                    // { header: "FIN", isSummary: true, value: `${(((grupo.items.length/aforo)*100)).toFixed(2)}`, items: grupo.items, tFood: '100 h' },
                    // { header: "socios", isSummary: true, value: grupo.items.length, items: grupo.items },
                  ]
            })
            
            const agruparPorRangoEdades = agruparPorRangoEdad(ventasSinCeros).sort((a,b)=>{
                if (a.propiedad === '75 a mas') return 1; // '75 a mas' va al final
                if (b.propiedad === '75 a mas') return -1; // '75 a mas' va al final
                return a.items.length > b.items.length
            }).map((grupo, index, array) => {
                const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
                const sumaTotalFem = array.reduce((total, item) => total + (item?.sexo[0].items.length || 0), 0)
                const sumaTotalMasc = array.reduce((total, item) => total + (item?.sexo[1].items.length || 0), 0)
                const sumaXITEMS = grupo.items.length
                return [
                    { header: "RANGO DE EDAD", value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL' },
                    { header: "SOCIOS", isSummary: true, value: grupo.items.length, items: grupo.items, tFood: `${sumaTotal.toFixed(0)}` },
                    { header: "FEM", isSummary: true, value: grupo.sexo[0].items.length, items: grupo.items, tFood: `${sumaTotalFem.toFixed(0)}` },
                    { header: `MASC`, isSummary: true, value: grupo.sexo[1].items.length, tFood: sumaTotalMasc },
                  ]
            })
            const activosDeVentasPorSemanaMarcacions = agruparPrimeraMarcacionGlobal(ventasSinCeros) 
        const agrupadoPorHorario = agruparPorHorarios(ventasSinCeros)
        .sort((a, b) => b.items.length - a.items.length)
        .map((f) => {
          const cuposDispo = aforo - f.items.length;
          const cuposOcupado = f.items.length;
          return { ...f, cuposDispo, cuposOcupado };
        })
        .map((grupo, index, array) => {
          const sumaTotal = array.reduce((total, item) => total + (item?.cuposOcupado || 0), 0);
          const sumarCuposDispo = array.reduce((total, item) => total + item.cuposDispo, 0);
          
          // Porcentajes globales (sumatoria total)
          const sumaPorcentajeOcupados = ((sumaTotal / aforo) * 100).toFixed(2);
          const sumaPorcentajeDispo = ((sumarCuposDispo / aforo) * 100).toFixed(2);
          
          // Porcentajes individuales por grupo
          const porcentajeOcupadoGrupo = ((grupo.cuposOcupado / aforo) * 100).toFixed(2);
          const porcentajePendienteGrupo = ((grupo.cuposDispo / aforo) * 100).toFixed(2);
      
          return [
            { header: "TURNO", isTime: true, value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL' },
            { header: "SOCIOS PAGANTES", isSummary: true, value: grupo.cuposOcupado, items: grupo.items, tFood: sumaTotal },
            { header: "CUPOS DISPONIBLES", isSummary: true, value: grupo.cuposDispo, items: grupo.items, tFood: sumarCuposDispo },
            { header: "% OCUPADO", isSummary: true, value: <NumberFormatMoney amount={porcentajeOcupadoGrupo}/>, items: grupo.items, tFood: <NumberFormatMoney amount={sumaPorcentajeOcupados/array.length} /> },
            { header: "% PENDIENTE", isSummary: true, value: <NumberFormatMoney amount={porcentajePendienteGrupo}/>, tFood: <NumberFormatMoney amount={sumaPorcentajeDispo/array.length}/> },
          ];
        });
        const agrupadoPorProcedenciaCeros = agruparPorProcedenciaEnCero(CanjesEnCero).map((grupo, index, array) => {
            const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
            const sumaXITEMS = grupo.items.length
            return [
            { header: "PROCEDENCIA", value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL' },
            { header: "socios", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
            { header: "% socios", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100).toFixed(2) },
                ]
            }
            )
            
        // console.log({ventasSinCeros, agrupadoPorHorario, agrupadoPorTarifas, agrupadoPorVendedores, agru: agruparPorVenta(test)});
        // console.log({test, horarios: agruparPrimeraMarcacionGlobal(ventasSinCeros), semana: agruparMarcacionesPorSemana(ventasSinCeros), agruparPorProcedencia: agruparPorProcedencia(ventasSinCeros)});;
        
        // const porHorarios
        // const porProcedencia
        // const porAsesor
        // const tarifas
        // console.log({activosDeVentasPorSemanaMarcacions, agruparPorRangoEdades, agrupadoPorEstadoCivil, agrupadoPorTarifas, agrupadoPorSesiones, sumaDeVentasEnSoles, sumaDeSesiones, porSexo, porDistrito, ventasEnCeros, ventasSinCeros, membresiasNuevas, membresiasRenovadas, membresiasReinscritos}, "alter");
        return {
            CanjesEnCero,
            aforo,
            aforo_turno,
            agrupadoPorVendedores,
            agrupadoPorHorario,
            agrupadoPorProcedencia,
            activosDeVentasPorSemanaMarcacions,
            agruparPorRangoEdades,
            agrupadoPorEstadoCivil,
            agrupadoPorTarifas,
            agrupadoPorProcedenciaCeros,
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
        const test = d.detalle_ventaMembresium?.map((item) => {
            const relacionado = dataClientesxMarcacion.find(
                (obj) => {

                    return obj.id_cli === item.tb_ventum.id_cli
                }
              )
              return relacionado
                ? { ...item, tb_marcacions: relacionado.tb_marcacions.filter((f)=>{
                    const tiempoMarcacion = new Date(f.tiempo_marcacion);
                    const fechaInicio = new Date(item.fec_inicio_mem);
                    const fechaFin = new Date(item.fec_fin_mem);
                    return tiempoMarcacion >= fechaInicio && tiempoMarcacion <= fechaFin
                }) }
                : {...item, tb_marcacions: []};
          });
        const ventasEnCeros = agruparPorVenta(test)
        const ventasSinCeros = agruparPorVenta(test)
        const TransferenciasEnCeros = d.ventas_transferencias
        const TraspasosEnCero = ventasEnCeros?.filter(f=>f.tb_ventum.id_tipoFactura===701)
        const clientesCanjes = ventasEnCeros?.filter(f=>f.tb_ventum.id_tipoFactura===703)
        const membresiasNuevas = ventasSinCeros?.filter(f=>f.tb_ventum.id_origen!==691 && f.tb_ventum.id_origen!==692)
        const membresiasRenovadas = ventasSinCeros?.filter(g=>g.tb_ventum.id_origen===691)
        const membresiasReinscritos = ventasSinCeros?.filter(g=>g.tb_ventum.id_origen===692)
        const porSexo = agruparPorSexo(ventasSinCeros)
        const porDistrito= agruparPorDistrito(ventasSinCeros)
        const sumaDeSesiones = ventasSinCeros?.reduce((total, item) => total + (item?.tb_semana_training.sesiones || 0), 0)
        const sumaDeVentasEnSoles = ventasSinCeros?.reduce((total, item) => total + (item?.tarifa_monto || 0), 0)
        const agrupadoPorSesiones = agruparPorSesiones(ventasSinCeros).map((g)=>{
            return {
                ...g,
            }
        })
        const agrupadoPorTarifas = agruparPorTarifas(ventasSinCeros)
        const agrupadoPorEstadoCivil = agruparPorEstCivil(ventasSinCeros)
        const agrupadoPorVendedores = agruparPorVendedores(ventasSinCeros)
        const agrupadoPorHorario = agruparPorHorarios(ventasSinCeros)
        const agruparPorRangoEdades = agruparPorRangoEdad(ventasSinCeros).sort((a,b)=>a.items.length > b.items.length)
        // const clientesCanjes = []
        // const activosDeVentasPorSemanaMarcacions = agruparPrimeraMarcacionGlobal(ventasSinCeros) 
        const avataresDeProgramas = dataIdPgmCero.tb_image
        // const montoTotal_ACTIVO = []
        const agrupadoPorProcedencia = agruparPorProcedencia(ventasSinCeros)
        const agrupadoPorProcedenciaCeros = agruparPorProcedenciaEnCero(clientesCanjes)
        console.log({ agrupadoPorVendedores, agruparPorRangoEdades, agrupadoPorEstadoCivil, agrupadoPorTarifas, agrupadoPorSesiones, sumaDeVentasEnSoles, sumaDeSesiones, porSexo, porDistrito, ventasEnCeros, ventasSinCeros, membresiasNuevas, membresiasRenovadas, membresiasReinscritos}, "alter");
        return {
            clientesCanjes,
            // clientesCanjes,
            agrupadoPorProcedenciaCeros,
            agrupadoPorHorario,
            agrupadoPorVendedores,
            agrupadoPorProcedencia,
            // activosDeVentasPorSemanaMarcacions,
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

    const dataInscritosCategoria = [
        {
            propiedad: 'NUEVOS',
            items: dataAlterIdPgmCero?.map(f=>f.membresiasNuevas).flat()
        },
        {
            propiedad: 'RENOVACIONES',
            items: dataAlterIdPgmCero?.map(f=>f.membresiasRenovadas).flat()
        },
        {
            propiedad: 'REINSCRITOS',
            items: dataAlterIdPgmCero?.map(f=>f.membresiasReinscritos).flat()
        },
        {
            propiedad: 'TRASPASOS PT',
            items: dataAlterIdPgmCero?.map(f=>f.TraspasosEnCero).flat()
        },
        {
            propiedad: 'TRANSFERENCIAS (COSTO CERO)',
            items: []
        },
        {
            propiedad: 'CANJES',
            items: dataAlterIdPgmCero?.map(f=>f.clientesCanjes).flat()
        }
    ]
    

    const data = [

        {
            isComparative: true,
            title: 'SOCIOS POR HORARIO VS AFORO ',
            id: 'COMPARATIVOPORHORARIOPORPROGRAMA',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={6}>
                    {/* <FormatTable data={d.agrupadoPorHorario}/> */}
                    <ItemCardPgm aforo={d.aforo} aforoTurno={d.aforo_turno} avatarPrograma={d.avatarPrograma} arrayEstadistico={d.agrupadoPorHorario} onOpenModalSOCIOS={onOpenModalSOCIOS} isViewSesiones={true} labelParam={'SESION'}/>
                </Col>
            )
            }
            )
        },
        {
            title: 'SOCIOS POR HORARIO VS AFORO  - TOTAL',
            id: 'COMPARATIVOPORHORARIOTOTAL',
            HTML: dataAlterIdPgmCero.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                    <TableTotal titleH1={''} isTime avataresDeProgramas={d.avataresDeProgramas} labelTotal={'HORARIO'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.agrupadoPorHorario}/>
                </Col>
            )
            }
        )
        },
        {
            isComparative: true,
            title: 'SOCIOS POR GENERO',
            id: 'COMPARATIVOPORHORARIOPORPROGRAMA',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={4}>
                    {/* <FormatTable data={d.agrupadoPorHorario}/> */}
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} arrayEstadistico={d.porSexo} onOpenModalSOCIOS={onOpenModalSOCIOS} isViewSesiones={true} labelParam={'GENERO'}/>
                </Col>
            )
            }
            )
        },
        {
            title: 'SOCIOS POR GENERO - TOTAL',
            id: 'COMPARATIVOPORHORARIOTOTAL',
            HTML: dataAlterIdPgmCero.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                    <TableTotal titleH1={''} isTime avataresDeProgramas={d.avataresDeProgramas} labelTotal={'GENERO'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.porSexo}/>
                </Col>
            )
            }
        )
        },
        {
            isComparative: true,
            title: 'SOCIOS POR DISTRITO',
            id: 'COMPARATIVOPROGRAMASPORDISTRITO',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={4}>
                    {/* <FormatTable data={d.agrupadoPorHorario}/> */}
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} 
                    arrayEstadistico={d.porDistrito} 
                    onOpenModalSOCIOS={onOpenModalSOCIOS} 
                    isViewSesiones={true} 
                    labelParam={'DISTRITO'}/>
                </Col>
            )
            }
            )
        },
        {
            title: 'SOCIOS POR DISTRITO - TOTAL',
            id: 'COMPARATIVOTOTALPORDISTRITO',
            HTML: dataAlterIdPgmCero.map(d=>{
                    return (
                    <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                        <TableTotal  titleH1={''}  avataresDeProgramas={d.avataresDeProgramas} labelTotal={'DISTRITO'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.porDistrito}/>
                    </Col>
                )
                }
            )
        },
        
        {
            isComparative: true,
            title: 'SOCIOS RANGO DE EDAD POR PROGRAMA / GENERO',
            id: 'COMPARATIVORANGODEEDAD/SEXOPORPROGRAMA',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={4}>
                    {/* <FormatTable data={d.agrupadoPorHorario}/> */}
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} 
                    arrayEstadistico={d.agruparPorRangoEdades} 
                    onOpenModalSOCIOS={onOpenModalSOCIOS} 
                    // isViewSesiones={true} 
                    labelParam={'RANGO DE EDAD'}/>
                </Col>
            )
            }
            )
        },
        {
            title: 'SOCIOS RANGO DE EDAD TOTAL / GENERO ',
            id: 'COMPARATIVORANGODEEDADTOTAL',
            HTML: dataAlterIdPgmCero.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                    <TableTotal isNeedGenere={true} titleH1={''} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'RANGO DE EDAD'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.agruparPorRangoEdades}/>
                </Col>
            )
            }
        )
        },
        {
            isComparative: true,
            title: 'SOCIOS ESTADO CIVIL',
            id: 'COMPARATIVOESTADOCIVILPORPROGRAMA',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={4}>
                    {/* <FormatTable data={d.agrupadoPorHorario}/> */}
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} 
                    arrayEstadistico={d.agrupadoPorEstadoCivil} 
                    onOpenModalSOCIOS={onOpenModalSOCIOS} 
                    isViewSesiones={true} 
                    labelParam={'EST. CIVIL'}/>
                </Col>
            )
            }
            )
        },
        {
            title: 'SOCIOS ESTADO CIVIL - TOTAL',
            id: 'COMPARATIVOTOTALESTADOCIVIL',
            HTML: dataAlterIdPgmCero.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                <TableTotal titleH1={''} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'ESTADO CIVIL'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.agrupadoPorEstadoCivil}/>
                    
                </Col>
            )
            }
        )
        },
    ]
    const [extractTitle, setextractTitle] = useState('')
    const sectionRefs = data.map(() =>
        useInView({
          threshold: 0.2, // Activa cuando el 50% de la sección esté visible
          triggerOnce: false, // Detectar entrada y salida constantemente
        })
      );
      useEffect(() => {
        sectionRefs.forEach(({ inView }, index) => {
          if (inView) {
            setextractTitle(data[index].title)
            // setActiveSection(sections[index].title);
            // dispatch(onSetViewSubTitle(`${data[index].title}`))
          }
        });
      }, [sectionRefs]);
      useEffect(() => {
        dispatch(onSetViewSubTitle(extractTitle))
      }, [sectionRefs])
      
  return (
    <>
    
    <FechaRange rangoFechas={RANGE_DATE}/>
    {loading ?(
                        <Loading show={loading}/>
):(
    <>
    <br/>
    <Row>
        {data.map((section, index) => (
            <Col xxl={12} ref={sectionRefs[index].ref}>
            <Row className='d-flex justify-content-center'>
                <br/>
        {/* <h1 className='pt-5' style={{fontSize: '60px'}}>{section.title}</h1> */}
                    {section.HTML}
            </Row>
        </Col>
        ))}
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


function agruparMarcacionesPorSemana(data=[]) {
    if (!Array.isArray(data)) {
        throw new Error("El parámetro 'data' debe ser un array.");
    }
    return data?.map((obj) => {
        const inicioMem = dayjs(obj.fec_inicio_mem);
        // Validar que `tb_marcacions` sea un array
        if (!Array.isArray(obj.tb_marcacions)) {
            console.warn("El objeto 'tb_marcacions' no es un array o está ausente.", obj);
            return; // Saltar al siguiente objeto
        }
        // Filtrar la primera marcación de cada día
        const primerasMarcaciones = Object.values(
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
    // if (!Array.isArray(data)) {
    //     throw new Error("El parámetro 'data' debe ser un array.");
    // }
    data?.forEach((obj) => {
        const inicioMem = dayjs(obj?.fec_inicio_mem);

        // Validar que `tb_marcacions` sea un array
        if (!Array.isArray(obj.tb_marcacions)) {
            console.warn("El objeto 'tb_marcacions' no es un array o está ausente.", obj);
            return; // Saltar al siguiente objeto
        }
        // Filtrar la primera marcación de cada día
        const primerasMarcaciones = Object.values(
            obj.tb_marcacions?.reduce((acumulador, marcacion) => {
                const fechaDia = dayjs(marcacion?.tiempo_marcacion).format('YYYY-MM-DD');
                if (
                    !acumulador[fechaDia] ||
                    dayjs(marcacion?.tiempo_marcacion).isBefore(
                        acumulador[fechaDia]?.tiempo_marcacion
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

            // Añadir la marcación al grupo TOTAL
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
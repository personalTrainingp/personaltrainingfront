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
import { ModalTableSociosCanje } from './ModalTableSociosCanje'
import { TableTotalS } from './TableTotalS'
import { Button } from 'primereact/button'
import { SpeedDial } from 'primereact/speeddial'
import { GrafPie } from './GrafPie'

dayjs.extend(utc);
export const ResumenComparativo = () => {
    const { obtenerComparativoResumen, dataIdPgmCero, 
            obtenerHorariosPorPgm, dataMarcacions, dataTarifas, dataHorarios, 
            dataGroup, loading, dataGroupTRANSFERENCIAS, dataEstadoGroup, 
            obtenerEstadosOrigenResumen, obtenerTarifasPorPgm, dataAsesoresFit, 
            obtenerAsesoresFit } = useReporteResumenComparativoStore()

    const dispatch = useDispatch()
    const { RANGE_DATE, dataView } = useSelector(e=>e.DATA)
    const [isOpenModalSocio, setisOpenModalSocio] = useState(false)
    const [avatarProgramaSelect, setavatarProgramaSelect] = useState({})
    const [clickDataSocios, setclickDataSocios] = useState([])
    const [clickDataLabel, setclickDataLabel] = useState('')
    const [isDataNeedGruped, setisDataNeedGruped] = useState(false)
    const [isOpenModalSOCIOSCanjes, setisOpenModalSOCIOSCanjes] = useState(false)
    // COuseSelector(e=>e.DATA)
    useEffect(() => {
        if(RANGE_DATE[0]===null) return;
        if(RANGE_DATE[1]===null) return;
        obtenerComparativoResumen(RANGE_DATE)
        obtenerHorariosPorPgm()
        // obtenerClientesConMarcacion()
        // obtenerEstadosOrigenResumen(RANGE_DATE)
    }, [RANGE_DATE])
    const onOpenModalSOCIOS = (d, avatarPrograma=[], label, isdatagruped)=>{
        // console.log(d, "d???????????");
        if(isdatagruped){
            setclickDataSocios(d)
            setisDataNeedGruped(isdatagruped)
            setisOpenModalSocio(true)
        }else{
            setisOpenModalSocio(true)
            setavatarProgramaSelect(avatarPrograma)
            dispatch(onSetDataView(d))
            setclickDataSocios(d)
            setclickDataLabel(label)

        }
    }
    const onCloseModalSOCIOSCANJE = (d, avatarPrograma=[], label, isdatagruped)=>{
        // console.log(d, "d???????????");
        if(isdatagruped){
            setclickDataSocios(d)
            setisDataNeedGruped(isdatagruped)
            setisOpenModalSocio(true)
        }else{
            setisOpenModalSocio(true)
            setavatarProgramaSelect(avatarPrograma)
            dispatch(onSetDataView(d))
            setclickDataSocios(d)
            setclickDataLabel(label)

        }
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
        const resultado = [];
        
        detalledata?.forEach((item) => {
            
          const { tarifa_monto } = item;
          const { distrito } = item.tb_ventum.tb_cliente.ubigeo_nac;
          
          // Verificar si ya existe un grupo con la misma cantidad de sesiones
          let grupo = resultado?.find((g) => g.propiedad === distrito);
      
          if (!grupo) {
            // Si no existe, crear un nuevo grupo
            grupo = { propiedad: distrito, items: [], tarifa_monto };
            resultado.push(grupo);
          }
          // Agregar el item al grupo correspondiente
          grupo.items.push(item);
        });
        
        return resultado.sort((a,b)=>b.items.length-a.items.length).sort((a,b)=>b.tarifa_monto-a.tarifa_monto);
    }
    function agruparPorDistritoTrabajo(detalledata) {
        const resultado = [];
        
        detalledata?.forEach((item) => {
            
          const { tarifa_monto } = item;
          
          const { distrito } = (item.tb_ventum.tb_cliente?.ubigeo_trabajo) || {};
          
          // Verificar si ya existe un grupo con la misma cantidad de sesiones
          let grupo = resultado?.find((g) => g.propiedad === distrito);
      
          if (!grupo) {
            // Si no existe, crear un nuevo grupo
            grupo = { propiedad: distrito, items: [], tarifa_monto };
            resultado.push(grupo);
          }
          // Agregar el item al grupo correspondiente
          grupo.items.push(item);
        });
        
        return resultado.sort((a,b)=>b.items.length-a.items.length).sort((a,b)=>b.tarifa_monto-a.tarifa_monto);
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
            grupo = { 
                // propiedad: <div className={id_tipo_promocion===3050?'text-black':''}>{nombreTarifa_tt} <br/> <div className='text-black'>{semanas_st} SEMANAS</div> <span className='font-24 mr-3'>x</span> <SymbolSoles isbottom={true}  numero={<NumberFormatMoney amount={tarifaCash_tt}/>}/><br/> {id_tipo_promocion===3050?'PROMOCION INTERNA':'PROMOCION REDES SOCIALES'} </div>, 
                propiedad: `${nombreTarifa_tt} ${semanas_st} SEMANAS ${tarifaCash_tt}`, 
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
          const { id_empl, apMaterno_empl, apPaterno_empl, nombre_empl, estado_empl } = item.tb_ventum.tb_empleado;
          // Verificar si ya existe un grupo con la misma cantidad de sesiones
          let grupo = resultado?.find((g) => g.propiedad === nombre_empl);
      
          if (!grupo) {
            // Si no existe, crear un nuevo grupo
            grupo = { propiedad: nombre_empl, estado_empl, items: [] };
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
    function agruparPorVentaDistritoPorPgmPorSemanas(detalledata) {
        const resultado = [];
        
        detalledata?.forEach((item) => {
            
          const { tarifa_monto } = item;
          const { distrito } = item.tb_ventum.tb_cliente.ubigeo_nac;
          
          // Verificar si ya existe un grupo con la misma cantidad de sesiones
          let grupo = resultado?.find((g) => g.propiedad === distrito);
      
          if (!grupo) {
            // Si no existe, crear un nuevo grupo
            grupo = { propiedad: distrito, items: [], tarifa_monto };
            resultado.push(grupo);
          }
          // Agregar el item al grupo correspondiente
          grupo.items.push(item);
        });
        
        return resultado.sort((a,b)=>b.items.length-a.items.length).sort((a,b)=>b.tarifa_monto-a.tarifa_monto);
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
          
          const formatHorario = dayjs.utc(horario).format('hh:mm A') 
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
    
    //AGRUPAR POR HORARIOS
    function agruparPorHorariosDeVenta(data) {
        const resultado = [];
        
        data?.forEach((item) => {
          const { horario, tarifa_monto, tb_ventum } = item;
          const {fecha_venta} = tb_ventum          
          const formatHorario = dayjs.utc(fecha_venta).locale('es').subtract(5, 'hour').format('A')
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
            grupo = {  lbel: sesiones, 
                // propiedad: <div style={{width: '350px'}}>{semanas_st} SEMANAS <br/> {sesiones} Sesiones</div>, 
                propiedad: `${semanas_st} SEMANAS (${sesiones} SESIONES)`, 
                semanas_st, items: [] };
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
            { rango_edad: "76 a mas", min: 76, max: Infinity },
            // { rango_edad: "34 a 39", min: 34, max: 39 },
            // { rango_edad: "56 a 59", min: 56, max: 59 },
            { rango_edad: "22 - 29", min: 22, max: 29 },
            // { rango_edad: "16 a 24", min: 16, max: 24 },
            { rango_edad: "12 - 21", min: 12, max: 21 },
            { rango_edad: '0 - 11', min: 0, max: 11} 
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
      const generarResumen = (array, grupo, labelCaracter, index, objDeleting, objAumenta=[]) => {
        const arrayGeneral = array.map(f=>f.items).flat()
        const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0);
        const cantidadxProps = grupo.items.length
        const porcentajexProps = ((cantidadxProps/sumaTotal)*100).toFixed(2);
        const montoxProps = grupo.items.reduce((total, item)=>total + (item?.tarifa_monto||0),0)
        const sumaMontoTotal =  arrayGeneral.reduce((acc, item)=>acc+item?.tarifa_monto, 0)
        const porcentajexMontoProps = ((montoxProps/sumaMontoTotal)*100).toFixed(2)
        const ticketMedio = (montoxProps/cantidadxProps)||0
        const sumaTicketMedio = sumaTotal ? (sumaMontoTotal / sumaTotal) : 0;
        const sumaDeSesionesxProps = grupo.items.reduce((total, item)=>total + (item?.tb_semana_training.sesiones||0),0)
        const sumaDeSesiones = arrayGeneral.reduce((total, item)=>total + (item?.tb_semana_training.sesiones||0),0)
        const promedioPrecioxSesiones = arrayGeneral.reduce((total, item)=>total + (item?.tb_semana_training?.sesiones||0),0)
        // const sumaTicketMedioProp = estadisticas.reduce((acc, item)=>acc+item.monto_total,0)/arrayEstadistico?.reduce((acc, curr) => acc + curr.items?.length, 0)
        // const porcentajexMontoProps = (array).toFixed(2) d.sumaDeVentasEnSoles/d.sumaDeSesiones
        console.log({array, arrayGeneral});
        
        //d.sumaDeVentasEnSoles/d.sumaDeSesiones
        const isSortable = true
        let resumen = [
            { header: labelCaracter, isIndexado: true, onClick: ()=>onOpenModalSOCIOS(grupo.items, '', labelCaracter, false), items: grupo.items, value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL', order: 1 },
            { header: 'S/. VENTA TOTAL', isSortable, HTML: <NumberFormatMoney amount={montoxProps}/>, value: montoxProps, tFood: <NumberFormatMoney amount={sumaMontoTotal}/>, order: 2 },
            { header: 'SOCIOS', isSortable, value: cantidadxProps, tFood: sumaTotal, order: 3 },
            { header: `% VENTA TOTAL`, isSortable, HTML: <>{porcentajexMontoProps} %</>, value: porcentajexMontoProps, tFood: 100, order: 4 },
            { header: `% SOCIOS`, isSortable, value: porcentajexProps, tFood: 100, order: 5 },
            { header: `S/. TICKET MEDIO`, isSortable, value: ticketMedio, HTML: <NumberFormatMoney amount={ticketMedio}/>, tFood: <NumberFormatMoney amount={sumaTicketMedio}/>, order: 5 },
            { header: `S/. PRECIO POR SESION`, isSortable, value: montoxProps, HTML: <NumberFormatMoney amount={montoxProps/sumaDeSesionesxProps}/>, tFood: <NumberFormatMoney amount={sumaMontoTotal/sumaDeSesiones}/>, order: 5 },
        ]
            // 1️⃣ Filtrar los elementos de resumen que estén en objDeleting
            if (Array.isArray(objDeleting)) {
                const headersAEliminar = objDeleting.map(obj => obj.header);
                resumen = resumen.filter(item => !headersAEliminar.includes(item.header));
            }

            // 2️⃣ Crear un mapa de objAumenta para sobrescribir elementos de resumen
            const objAumentaMap = new Map(objAumenta.map(item => [item.header, item]));

            // 3️⃣ Fusionar los datos, dando prioridad a objAumenta
            resumen = resumen.filter(item => !objAumentaMap.has(item.header)); // Eliminar duplicados
            resumen = [...resumen, ...objAumentaMap.values()]; // Agregar objAumenta

            // 4️⃣ Ordenar por la propiedad order
            return resumen.sort((a, b) => a.order - b.order);
    };
    function agruparPorCliente(data) {
        // Agrupar por id_cli
        const agrupado = Object.values(
            data.reduce((acc, item) => {
            const id_cli = item.tb_ventum.id_cli;
            if (!acc[id_cli]) {
                acc[id_cli] = { id_cli, items: [] };
            }
            acc[id_cli].items.push(item);
            return acc;
            }, {})
        );

        // Filtrar clientes que tienen al menos un id_tipoFactura = 701
        const clientesFiltrados = agrupado
            .filter(cliente => cliente.items.some(item => item.tb_ventum.id_tipoFactura === 701))
            .map(cliente => ({
            id_cli: cliente.id_cli,
            items: cliente.items.filter(item => item.tb_ventum.id_tipoFactura !== 701) // Remover los "traspaso"
            }))
            .filter(cliente => cliente.items.length > 0); // Eliminar clientes sin items

        // Obtener todos los items acumulados
        const ventas = clientesFiltrados.flatMap(cliente => cliente.items);

        return {
            clientes: clientesFiltrados,
            ventas // Acumulado de todos los items
        };
      }

    

    const dataAlter = dataGroup.map((d, array)=>{
        const avatarPrograma = {
            urlImage: `${config.API_IMG.LOGO}${d.tb_image[0].name_image}`,
            width: d.tb_image[0].width,
            height: d.tb_image[0].height
        }
        
        // const test =  d.detalle_ventaMembresium?.map((item) => {
        //     const relacionado = dataClientesxMarcacion.find(
        //         (obj) => {

        //             return obj.id_cli === item.tb_ventum.id_cli
        //         }
        //       )
        //       return relacionado
        //         ? { ...item, tb_marcacions: relacionado.tb_marcacions.filter((f)=>{
        //             const tiempoMarcacion = new Date(f.tiempo_marcacion);
        //             const fechaInicio = new Date(item.fec_inicio_mem);
        //             const fechaFin = new Date(item.fec_fin_mem);
        //             return tiempoMarcacion >= fechaInicio && tiempoMarcacion <= fechaFin
        //         }) }
        //         : {...item, tb_marcacions: []};
        //   })
          const aforo = d.id_pgm===2?18:d.id_pgm===3?10:d.id_pgm===4?14:''
          const aforo_turno = d.id_pgm===2?36:d.id_pgm===3?10:d.id_pgm===4?14:''
          
          const ventasEnCeros =  agruparPorVenta(d.detalle_ventaMembresium).filter(f=>f.tarifa_monto===0)
          const ventasSinCeros =  agruparPorVenta(d.detalle_ventaMembresium).filter(f=>f.tarifa_monto!==0)
          const TransferenciasEnCeros = d.ventas_transferencias
          
        const TraspasosEnCero = ventasEnCeros.filter(f=>f.tb_ventum.id_tipoFactura===701)
        
        const CanjesEnCero = ventasEnCeros.filter(f=>f.tb_ventum.id_tipoFactura===703)
        const membresiasNuevas = ventasSinCeros.filter(f=>f.tb_ventum.id_origen!==691 && f.tb_ventum.id_origen!==692&& f.tb_ventum.id_origen!==696)
        const membresiasRenovadas = ventasSinCeros.filter(g=>g.tb_ventum.id_origen===691)
        const membresiasReinscritos = ventasSinCeros.filter(g=>g.tb_ventum.id_origen===692)
        const sumaDeSesiones = ventasSinCeros.reduce((total, item) => total + (item?.tb_semana_training.sesiones || 0), 0)
        const sumaDeVentasEnSoles = ventasSinCeros.reduce((total, item) => total + (item?.tarifa_monto || 0), 0)
        const porSexo = agruparPorSexo(ventasSinCeros).map((grupo, index, array) => {
            const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
            const sumaXITEMS = grupo.items.length
            return [
            { header: "GENERO", value: grupo.propiedad, items: grupo.items, isPropiedad: true, tFood: 'TOTAL' },
            { header: "socios", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
            { header: "% socios", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100).toFixed(2) },
                ]
            }
            )
            const porDistrito= agruparPorDistrito(ventasSinCeros).sort((a,b)=>b.items.length-a.items.length).map((grupo, index, array) => {
                const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
                const sumaXITEMS = grupo.items.length
                
                const sumaMontoxItems = grupo.items.reduce((total, item) => total+(item?.tarifa_monto||0), 0)
                const sumaTotalMonto = array.reduce((total, item)=>total + (item?.items.reduce((total, item) => total+(item?.tarifa_monto||0), 0) || 0), 0)
                return [
                { header: "DISTRITO", value: grupo.propiedad, items: grupo.items, isPropiedad: true, tFood: 'TOTAL' },
                { header: <>SOCIOS <br/> % SOCIOS</>, isSummary: true, value: <><span className='text-primary'>{sumaXITEMS}</span> <br/> <span className=''>{((sumaXITEMS/sumaTotal)*100).toFixed(2)}</span> </>, tFood: <>{sumaTotal} <br/> {((sumaXITEMS/sumaXITEMS)*100).toFixed(2)}</> },
                // { header: "% SOCIOS", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100).toFixed(2) },
                { header: "VENTA", isSummary: true, value: <NumberFormatMoney amount={sumaMontoxItems}/>, items: grupo.items, tFood: <NumberFormatMoney amount={sumaTotalMonto}/>},
                    ]
                }
                )
                
            const porDistritoTrabajo = agruparPorDistritoTrabajo(ventasSinCeros).sort((a,b)=>b.items.length-a.items.length).map((grupo, index, array) => {
                const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
                const sumaXITEMS = grupo.items.length
                
                const sumaMontoxItems = grupo.items.reduce((total, item) => total+(item?.tarifa_monto||0), 0)
                const sumaTotalMonto = array.reduce((total, item)=>total + (item?.items.reduce((total, item) => total+(item?.tarifa_monto||0), 0) || 0), 0)
                return [
                { header: "DISTRITO", value: grupo.propiedad, items: grupo.items, isPropiedad: true, tFood: 'TOTAL' },
                { header: <>SOCIOS <br/> % SOCIOS</>, isSummary: true, value: <><span className='text-primary'>{sumaXITEMS}</span> <br/> <span className=''>{((sumaXITEMS/sumaTotal)*100).toFixed(2)}</span> </>, tFood: <>{sumaTotal} <br/> {((sumaXITEMS/sumaXITEMS)*100).toFixed(2)}</> },
                // { header: "% SOCIOS", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100).toFixed(2) },
                { header: "VENTA", isSummary: true, value: <NumberFormatMoney amount={sumaMontoxItems}/>, items: grupo.items, tFood: <NumberFormatMoney amount={sumaTotalMonto}/>},
                    ]
                }
                )
        const agrupadoPorSesiones = agruparPorSesiones(ventasSinCeros).map((grupo, index, array) => {
            const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
            const sumaXITEMS = grupo.items.length
            return [
            { header: "semanas (sesiones)", value: grupo.propiedad,items: grupo.items, isPropiedad: true, tFood: 'TOTAL' },
            // { header: "SEMANAS", value: grupo.semanas_st,isPropiedad: true, tFood: '' },
            { header: "socios", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
            { header: "% socios", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100).toFixed(2) },
                ]
            }
            )
        const agrupadoPorEstadoCivil = agruparPorEstCivil(ventasSinCeros).map((grupo, index, array) => {
            const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
            const sumaXITEMS = grupo.items.length
            return [
            { header: "EST. CIVIL (A)", value: grupo.propiedad, items: grupo.items, isPropiedad: true, tFood: 'TOTAL' },
            { header: "socios", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
            { header: "% socios", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100||0).toFixed(2), items: grupo.items, tFood: (100).toFixed(2) },
                ]
            }
            )
            
            const agrupadoPorProcedencia = agruparPorProcedencia(ventasSinCeros).map((grupo, index, array) => {
                const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
                const sumaXITEMS = grupo.items.length
                return [
                { header: "PROCEDENCIA", value: grupo.propiedad, items: grupo.items, isPropiedad: true, tFood: 'TOTAL' },
                { header: "socios", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
                { header: "% socios", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100||0).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100||0).toFixed(2) },
                    ]
                }
                )
                
            const agrupadoPorVendedores = agruparPorVendedores(ventasSinCeros).map((grupo, index, array) => {
                const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
                const sumaXITEMS = grupo.items.length
                return [
                { header: "ASESORES", value: grupo.propiedad, items: grupo.items, isPropiedad: true, tFood: 'TOTAL' },
                { header: "socios", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
                { header: "% socios", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100).toFixed(2) },
                    ]
                }
                )
                
            const agrupadoPorTarifas = agruparPorTarifas(ventasSinCeros).map((grupo, index, array) => {
                const sumaTotalSocio = array.reduce((total, item) => total + (item?.items.length || 0), 0)

                return [
                    { header: "PROMOCION", isTime: true, value: grupo.propiedad, items: grupo.items, isPropiedad: true, tFood: '' },
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
                const porcentajeSocios = ((sumaXITEMS/sumaTotal)*100)
                const porcentajeSociosFem = ((grupo.sexo[0].items.length/sumaTotalFem)*100)
                const porcentajeSociosMas = ((grupo.sexo[1].items.length/sumaTotalMasc)*100)
                return [
                    { header: "RANGO DE EDAD", value: grupo.propiedad, items: grupo.items, isPropiedad: true, tFood: 'TOTAL' },
                    { header: "SOCIOS", isSummary: true, value: grupo.items.length, items: grupo.items, tFood: `${sumaTotal.toFixed(0)}` },
                    { header: "% SOCIOS", isSummary: true, value: <><NumberFormatMoney amount={porcentajeSocios}/></>, items: array.items, tFood: `${100}` },
                    { header: "FEMENINO", isSummary: true, value: grupo.sexo[0].items.length, items: grupo.items, tFood: `${sumaTotalFem.toFixed(0)}` },
                    { header: "% FEMENINO", isSummary: true, value: <><NumberFormatMoney amount={porcentajeSociosFem}/></>, items: array.items, tFood: `${100}` },
                    { header: `MASCULINO`, isSummary: true, value: grupo.sexo[1].items.length, tFood: sumaTotalMasc },
                    { header: "% MASCULINO", isSummary: true, value: <><NumberFormatMoney amount={porcentajeSociosMas}/></>, items: array.items, tFood: `${100}` },
                  ]
            })
            const activosDeVentasPorSemanaMarcacions = []
            //agruparPrimeraMarcacionGlobal(ventasSinCeros) 
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
            { header: "TURNO", isTime: true, value: grupo.propiedad, items: grupo.items, isPropiedad: true, tFood: 'TOTAL' },
            { header: "SOCIOS PAGANTES", isSummary: true, value: grupo.cuposOcupado, items: grupo.items, tFood: sumaTotal },
            { header: "CUPOS DISPONIBLES", isSummary: true, value: grupo.cuposDispo, items: grupo.items, tFood: sumarCuposDispo },
            { header: "% OCUPADO", isSummary: true, value: <NumberFormatMoney amount={porcentajeOcupadoGrupo}/>, items: grupo.items, tFood: <NumberFormatMoney amount={sumaPorcentajeOcupados/array.length} /> },
            { header: "% PENDIENTE", isSummary: true, value: <NumberFormatMoney amount={porcentajePendienteGrupo}/>, tFood: <NumberFormatMoney amount={sumaPorcentajeDispo/array.length}/> },
          ];
        });
        const agrupadoPorHorarioDeVenta = agruparPorHorariosDeVenta(ventasSinCeros)
        .sort((a, b) => b.items.length - a.items.length)
        .map((f) => {
          const cuposDispo = aforo - f.items.length;
          const cuposOcupado = f.items.length;
          return { ...f, cuposDispo, cuposOcupado };
        })
        .map((grupo, index, array) => {
          const sumaTotal = array.reduce((total, item) => total + (item?.cuposOcupado || 0), 0);
          return [
            { header: "TURNO", isTime: true, value: grupo.propiedad, items: grupo.items, isPropiedad: true, tFood: 'TOTAL' },
            { header: "SOCIOS", isSummary: true, value: grupo.cuposOcupado, items: grupo.items, tFood: sumaTotal },
          ];
        });
        console.log({agrupadoPorHorarioDeVenta: agruparPorHorariosDeVenta(ventasSinCeros)
        .sort((a, b) => b.items.length - a.items.length)});
        
        const agrupadoPorProcedenciaCeros = agruparPorProcedenciaEnCero(CanjesEnCero).map((grupo, index, array) => {
            const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
            const sumaXITEMS = grupo.items.length
            return [
            { header: "PROCEDENCIA", value: grupo.propiedad, items: grupo.items, isPropiedad: true, tFood: 'TOTAL' },
            { header: "socios", isSortable: true, isSummary: true, value: grupo.items.length, tFood: sumaTotal },
            { header: "% socios", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100||0).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100||0).toFixed(2) },
                ]
            }
            )
            const arTest = agruparPorDistrito(ventasSinCeros).map(d=>{
            return {
                ...d,
                agrupadoPorSesiones: agruparPorSesiones(d.items).map((grupo, index, array) => {
            
            return [
                ...generarResumen(array, grupo, <div className='ml-3'>SEMANAS (SESIONES)</div>, index)
                ]
            }
            )
            }
        })

        // console.log({ventasSinCeros, agrupadoPorHorario, agrupadoPorTarifas, agrupadoPorVendedores, agru: agruparPorVenta(test)});
        // console.log({test, horarios: agruparPrimeraMarcacionGlobal(ventasSinCeros), semana: agruparMarcacionesPorSemana(ventasSinCeros), agruparPorProcedencia: agruparPorProcedencia(ventasSinCeros)});;
        
        // const porHorarios
        // const porProcedencia
        // const porAsesor
        // const tarifas
        // console.log({activosDeVentasPorSemanaMarcacions, agruparPorRangoEdades, agrupadoPorEstadoCivil, agrupadoPorTarifas, agrupadoPorSesiones, sumaDeVentasEnSoles, sumaDeSesiones, porSexo, porDistrito, ventasEnCeros, ventasSinCeros, membresiasNuevas, membresiasRenovadas, membresiasReinscritos}, "alter");
        return {
            arTest,
            CanjesEnCero,
            aforo,
            aforo_turno,
            agrupadoPorVendedores,
            agrupadoPorHorarioDeVenta,
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
            porDistritoTrabajo,
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
        // const test = d.detalle_ventaMembresium?.map((item) => {
        //     const relacionado = dataClientesxMarcacion.find(
        //         (obj) => {

        //             return obj.id_cli === item.tb_ventum.id_cli
        //         }
        //       )
        //       return relacionado
        //         ? { ...item, tb_marcacions: relacionado.tb_marcacions.filter((f)=>{
        //             const tiempoMarcacion = new Date(f.tiempo_marcacion);
        //             const fechaInicio = new Date(item.fec_inicio_mem);
        //             const fechaFin = new Date(item.fec_fin_mem);
        //             return tiempoMarcacion >= fechaInicio && tiempoMarcacion <= fechaFin
        //         }) }
        //         : {...item, tb_marcacions: []};
        //   });
        const avatarPrograma = {
            urlImage: 'TOTAL',
        }
        const ventasEnCeros = agruparPorVenta(d.detalle_ventaMembresium)?.filter(f=>f.tarifa_monto===0)
        const ventasSinCeros = agruparPorVenta(d.detalle_ventaMembresium)?.filter(f=>f.tarifa_monto!==0)
        const TransferenciasEnCeros = d.ventas_transferencias
        console.log({t: d});
        
        const TraspasosEnCero = ventasEnCeros?.filter(f=>f.tb_ventum.id_tipoFactura===701)
        const clientesCanjes = ventasEnCeros?.filter(f=>f.tb_ventum.id_tipoFactura===703)
        const membresiasNuevas = ventasSinCeros?.filter(f=>f.tb_ventum.id_origen!==691 && f.tb_ventum.id_origen!==692 && f.tb_ventum.id_origen!==696)
        const membresiasRenovadas = ventasSinCeros?.filter(g=>g.tb_ventum.id_origen===691)
        const membresiasReinscritos = ventasSinCeros?.filter(g=>g.tb_ventum.id_origen===692 || g.tb_ventum.id_origen==696)
        const porSexo = agruparPorSexo(ventasSinCeros).map((grupo, index, array) => {
            return [
                ...generarResumen(array, grupo, 'genero', index)
                ]
            }
            )
        const porDistrito= agruparPorDistrito(ventasSinCeros).map((grupo, index, array) => {
            return [
                ...generarResumen(array, grupo, 'DISTRITO', index)
                ]
            }
            )
        const porDistritoTrabajo = agruparPorDistritoTrabajo(ventasSinCeros).map((grupo, index, array) => {
            return [
                ...generarResumen(array, grupo, 'DISTRITO', index)
                ]
            }
            )
        const sumaDeSesiones = ventasSinCeros?.reduce((total, item) => total + (item?.tb_semana_training.sesiones || 0), 0)
        const sumaDeVentasEnSoles = ventasSinCeros?.reduce((total, item) => total + (item?.tarifa_monto || 0), 0)
        const agrupadoPorSesiones = agruparPorSesiones(ventasSinCeros).map((grupo, index, array) => {
            
            return [
                ...generarResumen(array, grupo, 'SEMANAS(SESIONES)', index)
                ]
            }
            )
        const agrupadoPorTarifas = agruparPorTarifas(ventasSinCeros).map((grupo, index, array) => {
            return [
                ...generarResumen(array, grupo, 'PROMOCIONES', index, {})
                ]
            }
            )
        const agrupadoPorEstadoCivil = agruparPorEstCivil(ventasSinCeros).map((grupo, index, array) => {
            return [
                ...generarResumen(array, grupo, 'ESTADO CIVIL (A)', index)
                ]
            }
            )
        const agrupadoPorVendedores = agruparPorVendedores(ventasSinCeros).map((grupo, index, array) => {
            
            return [
                ...generarResumen(array, grupo, 'ASESORES', index, [], [{header: 'ASESORES', value: grupo.propiedad, isPropiedad: true, items: grupo.items, HTML: <span className={grupo.estado_empl?'text-primary':'text-black'}>{grupo.propiedad}</span>, order: 0}]),
                // {header: 'ESTADO', value: `${grupo.estado_empl}`}
                ]
            }
            )
        const agrupadoPorHorario = agruparPorHorarios(ventasSinCeros).map((grupo, index, array) => {
            return [
                ...generarResumen(array, grupo, 'HORARIO', index)
                ]
            }
            )
        const agrupadoPorHorarioVenta = agruparPorHorariosDeVenta(ventasSinCeros).map((grupo, index, array) => {
            return [
                ...generarResumen(array, grupo, 'HORARIO', index)
                ]
            }
            )
        const agruparPorRangoEdades = agruparPorRangoEdad(ventasSinCeros).sort((a,b)=>a.items.length > b.items.length).map((grupo, index, array) => {
            return [
                ...generarResumen(array, grupo, 'RANGO DE EDAD', index)
                ]
            }
            )
        // const clientesCanjes = []
        // const activosDeVentasPorSemanaMarcacions = agruparPrimeraMarcacionGlobal(ventasSinCeros) 
        const avataresDeProgramas = dataIdPgmCero.tb_image
        // const montoTotal_ACTIVO = []
        const agrupadoPorProcedencia = agruparPorProcedencia(ventasSinCeros).map((grupo, index, array) => {
            return [
                ...generarResumen(array, grupo, 'PROCEDENCIA', index)
                ]
            }
            )
        const agrupadoPorProcedenciaCeros = agruparPorProcedenciaEnCero(clientesCanjes).map((grupo, index, array) => {
            return [
                ...generarResumen(array, grupo, 'PROCEDENCIA', index, [{header: 'S. VENTA TOTAL'}, {header: `% VENTA TOTAL`}, {header: `% TICKET MEDIO`}])
                ]
            }
            )
            // console.log(d, agruparPorCliente(agruparPorVenta(d.detalle_ventaMembresium)), agruparPorCliente(agruparPorVenta(d.detalle_ventaMembresium)), agruparPorVenta(d.detalle_ventaMembresium), "aroga");
            
        const agrupadoPorSociosCanjes = agruparPorProcedenciaEnCero(clientesCanjes)
        const agrupadoxDistritoxPrograma = []
        const arTest = agruparPorDistrito(ventasSinCeros).map(d=>{
            return {
                ...d,
                agrupadoPorSesiones: agruparPorSesiones(d.items).map((grupo, index, array) => {
            
            return [
                ...generarResumen(array, grupo, 'SEMANAS (SESIONES)', index)
                ]
            }
            )
            }
        })

        
        return {
            clientesCanjes,
            arTest,
            agrupadoxDistritoxPrograma,
            ventasDespuesDeTraspaso: agruparPorCliente(agruparPorVenta(d.detalle_ventaMembresium)),
            ITEMSventasDespuesDeTraspaso: agruparPorCliente(agruparPorVenta(d.detalle_ventaMembresium)),
            // clientesCanjes,
            agrupadoPorProcedenciaCeros,
            agrupadoPorSociosCanjes,
            agrupadoPorHorario,
            agrupadoPorHorarioVenta,
            agrupadoPorVendedores,
            agrupadoPorProcedencia,
            porDistritoTrabajo,
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
            header: 'NUEVOS',
            items: dataAlterIdPgmCero?.map(f=>f.membresiasNuevas).flat()
        },
        {
            propiedad: 'RENOVACIONES',
            header: 'RENOVACIONES',
            items: dataAlterIdPgmCero?.map(f=>f.membresiasRenovadas).flat()
        },
        {
            propiedad: 'REINSCRITOS',
            header: 'REINSCRITOS',
            items: dataAlterIdPgmCero?.map(f=>f.membresiasReinscritos).flat()
        },
        {
            propiedad: 'CANJES',
            header: 'CANJES',
            items: dataAlterIdPgmCero?.map(f=>f.clientesCanjes).flat()
        },
        {
            propiedad: 'TRANSFERENCIAS EX-PT A TERCEROS',
            header: 'TRANSFERENCIAS EX-PT A TERCEROS',
            items: dataAlterIdPgmCero?.map(f=>f.TransferenciasEnCeros).flat()
        },
        {
            propiedad: 'TOTAL TRASPASOS EX-PT',
            header: <>TOTAL TRASPASOS <br/> EX-PT ({dataAlterIdPgmCero[0].TraspasosEnCero.length})</>,
            items: dataAlterIdPgmCero[0].TraspasosEnCero.slice(0, Math.max(0, dataAlterIdPgmCero[0].TraspasosEnCero?.length - dataAlterIdPgmCero[0].TransferenciasEnCeros?.length)),
        },
    ]
    
    const data = [
        {
            title: 'VENTAS POR PROGRAMA',
            id: 'comparativoventasenprograma',
            HTML: dataAlter.map((d, array)=>{
                const dataGen = dataAlterIdPgmCero.map(c=>c.ventasSinCeros.length)[0]
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
                                                                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>venta de <br/> membresias</span></li>
                                                                    </td>
                                                                    <td>
                                                                        <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{d.ventasSinCeros.length} / {((d.ventasSinCeros.length/dataGen)*100).toFixed(2)}%</span>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Venta <br/> acumulada</span></li>
                                                                </td>
                                                                <td> <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.sumaDeVentasEnSoles}/>}/></span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Ticket <br/> medio</span></li>
                                                                </td>
                                                                <td> 
                                                                <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={(d.sumaDeVentasEnSoles/d.ventasSinCeros.length).toFixed(2)}/>}/></span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>Sesiones <br/> vendidas</span></li>
                                                                </td>
                                                                <td> 
                                                                <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><NumberFormatter amount={d.sumaDeSesiones}/></span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>PRECIO <br/> por sesion</span></li>
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
        },
        {
            title: 'PROMEDIO VENTAS ACUMULADAS - TOTAL',
            id: 'comparativoventastotal',
            HTML: dataAlterIdPgmCero.map(d=>{
                return (
                    <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                        <Card>
                            <Card.Header className=' d-flex align-self-center'>
                                
                                {
                                    d.avataresDeProgramas?.map((d, index)=>{
    
                                        return(
                                            <div>
                                                <img className='m-4' src={`${config.API_IMG.LOGO}${d.name_image}`} height={d.height} width={d.width}/>
                                                <span style={{fontSize: '50px'}}>{index===2?'':'+'}</span>
                                            </div>
                                        )
                                    }
                                )
                                }
                                {/* <Card.Title>
                                    <h4>{d.name_pgm}</h4>
                                </Card.Title> */}
                                {/* <img src={d.avatarPrograma.urlImage} height={d.avatarPrograma.height} width={d.avatarPrograma.width}/> */}
                                {/* <h2>TOTAL</h2> */}
                            </Card.Header>
                            <Card.Body className='d-flex justify-content-center' style={{paddingBottom: '1px !important'}}>
                                <br/>
                                <div  style={{width: '1080px'}}>
                                <Table
                                                    // style={{tableLayout: 'fixed'}}
                                                    className="table-centered mb-0"
                                                    // hover
                                                    striped
                                                    responsive
                                                >
                                                    <tbody>
                                                                <tr>
                                                                        <td className='' 
                                                                        onClick={()=>onOpenModalSOCIOS(d?.ventasDespuesDeTraspaso.ventas, '', 'VENTAS POR TRASPASO EX-PT', false)}
                                                                        >
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-1'>VENTAS POR TRASPASO EX-PT</span></li>
                                                                        </td>
                                                                        <td>
                                                                            <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{d?.ventasDespuesDeTraspaso.clientes.length===0?0:d?.ventasDespuesDeTraspaso.ventas.length}</span>
                                                                        </td>
                                                                </tr>
                                                                <tr>
                                                                        <td className=''>
                                                                            <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-1'>venta de membresias</span></li>
                                                                        </td>
                                                                        <td>
                                                                            <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{d?.ventasSinCeros?.length}</span>
                                                                        </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-1'>Venta acumulada</span></li>
                                                                    </td>
                                                                    <td> <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.sumaDeVentasEnSoles}/>}/></span></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-1'>Ticket medio</span></li>
                                                                    </td>
                                                                    <td> 
                                                                    <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={(d.sumaDeVentasEnSoles/d.ventasSinCeros?.length).toFixed(2)}/>}/></span>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-1'>Sesiones vendidas</span></li>
                                                                    </td>
                                                                    <td> 
                                                                    <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><NumberFormatter amount={d.sumaDeSesiones}/></span>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-1'>PRECIO por sesion</span></li>
                                                                    </td>
                                                                    <td> 
                                                                    <span className='fs-1 fw-bold d-flex justify-content-end align-content-end align-items-end'><SymbolSoles isbottom={true} numero={ <NumberFormatMoney amount={d.sumaDeVentasEnSoles/d.sumaDeSesiones}/>}/></span>
                                                                    </td>
                                                                </tr>
                                                                
                                                    </tbody>
                                                </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )
            })
        },
        {
            isComparative: true,
            title: 'SOCIOS TOTAL POR CATEGORIA',
            id: 'comparativoINSCRITOSPORCATEGORIASPORPROGRAMA',
            HTML: dataAlter.map(d=>{
                //data a analizar
                
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={6}>
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
                                                <thead className='bg-primary fs-2'>
                                                    <tr>
                                                        <th className={`text-white`}>
                                                            {'CATEGORIA'}{' '}
                                                        </th>
                                                        <th className={`text-white`}>
                                                            {'SOCIOS'}{' '}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                            <tr onClick={()=>onOpenModalSOCIOS(d.membresiasNuevas, d.avatarPrograma, `NUEVOS`)}>
                                                                    <td className=''>
                                                                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>NUEVOS</span></li>
                                                                    </td>
                                                                    <td className=''>
                                                                        <li className={`d-flex flex-row justify-content-between p-2`}>
                                                                                                <span style={{fontSize: '32px'}} className={`fw-bold ml-3`}>{d.membresiasNuevas.length}</span>
                                                                        </li>
                                                                    </td>
                                                            </tr>
                                                            <tr onClick={()=>onOpenModalSOCIOS(d.membresiasRenovadas, d.avatarPrograma, `RENOVACIONES`)}>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>RENOVACIONES</span></li>
                                                                </td>
                                                                <td className=''>
                                                                        <li className={`d-flex flex-row justify-content-between p-2`}>
                                                                                                <span style={{fontSize: '32px'}} className={`fw-bold ml-3`}>{d.membresiasRenovadas.length}</span>
                                                                        </li>
                                                                    </td>
                                                            </tr>
                                                            <tr onClick={()=>onOpenModalSOCIOS(d.membresiasReinscritos, d.avatarPrograma, `REINSCRIPCIONES`)}>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>REINSCRIPCIONES</span></li>
                                                                </td>
                                                                <td className=''>
                                                                    <li className={`d-flex flex-row justify-content-between p-2`}>
                                                                                            <span style={{fontSize: '32px'}} className={`fw-bold ml-3`}>{d.membresiasReinscritos.length}</span>
                                                                    </li>
                                                                </td>
                                                            </tr>
                                                            <tr onClick={()=>onOpenModalSOCIOS(d.TraspasosEnCero, d.avatarPrograma, `TRASPASOS`)}>
                                                                <td>
                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRASPASOS PT</span></li>
                                                                </td>
                                                                <td className=''>
                                                                    <li className={`d-flex flex-row justify-content-between p-2`}>
                                                                                            <span style={{fontSize: '32px'}} className={`fw-bold ml-3`}>{d.TraspasosEnCero.length}</span>
                                                                    </li>
                                                                </td>
                                                            </tr>
                                                            <tr onClick={()=>onOpenModalSOCIOS(d.TransferenciasEnCeros, d.avatarPrograma, `TRANSFERENCIAS`)}>
                                                                <td>
                                                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRANSFERENCIAS <br/>(COSTO CERO)</span></li>
                                                                </td>
                                                                <td className=''>
                                                                    <li className={`d-flex flex-row justify-content-between p-2`}>
                                                                                            <span style={{fontSize: '32px'}} className={`fw-bold ml-3`}>{d.TransferenciasEnCeros.length}</span>
                                                                    </li>
                                                                </td>
                                                            </tr>
                                                            <tr onClick={()=>onOpenModalSOCIOS(d.CanjesEnCero, d.avatarPrograma, `CANJES`)}>
                                                                <td>
                                    <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>CANJES <br/>(COSTO CERO)</span></li>
                                                                </td>
                                                                <td className=''>
                                                                    <li className={`d-flex flex-row justify-content-between p-2`}>
                                                                                            <span style={{fontSize: '32px'}} className={`fw-bold ml-3`}>{d.CanjesEnCero.length}</span>
                                                                    </li>
                                                                </td>
                                                            </tr>
                                                    </tbody>
                                                        <tr className='bg-primary'>
                                                            <td>
                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white ml-4' style={{fontSize: '40px'}}>{'TOTAL'}</span></li>
                                                            </td>
                                                            <td>
                                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white ml-4' style={{fontSize: '40px'}}>{d.membresiasNuevas.length+d.membresiasRenovadas.length+d.membresiasReinscritos.length+d.TraspasosEnCero.length+d.TransferenciasEnCeros.length+d.CanjesEnCero.length}</span></li>
                                                            </td>
                                                    </tr>
                                            </Table>
                        </Card.Body>
                        <h1 className='text-center'>SOCIOS TOTAL POR CATEGORIA VENTAS</h1>
                        <GrafPie height={600} width={600} data={
                            [{label: 'NUEVOS', val: d.membresiasNuevas.length}, {label: 'RENOVACIONES', val: d.membresiasRenovadas.length}, {label: 'REINSCRIPCIONES', val: d.membresiasReinscritos.length}]}/>
                        <h1 className='text-center'>SOCIOS TOTAL POR CATEGORIA</h1>
                        <GrafPie height={1000} width={1000} data={[{label: 'NUEVOS', val: d.membresiasNuevas.length}, {label: 'RENOVACIONES', val: d.membresiasRenovadas.length}, {label: 'REINSCRIPCIONES', val: d.membresiasReinscritos.length}, {label: 'TRASPASOS', val: d.TraspasosEnCero.length}, {label: 'TRANSFERENCIAS', val: d.TransferenciasEnCeros.length}, {label: 'CANJES', val: d.CanjesEnCero.length, color: '#fff33'}]}/>
                    </Card>
                </Col>
            )
            }
        )
        },
        {
            title: 'SOCIOS TOTAL POR CATEGORIA - RESUMEN',
            id: 'comparativoinscritosporcategoriatotal',
            HTML: dataAlterIdPgmCero.map(d=>{
                const dataSeg = dataInscritosCategoria.map(c=>{
                    return{
                        label: c.propiedad,
                        val: c.items.length
                    }
                }).filter(c=>c.label==='NUEVOS' || c.label ==='RENOVACIONES' || c.label==='REINSCRITOS')
                const dataSeg1 = dataInscritosCategoria.map(c=>{
                    return{
                        label: c.header,
                        val: c.items.length
                    }
                })
                return(
                    <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                        {/* <div style={{width: '400px', height: '400px'}}>
                            <GrafPie data={dataSeg}/>
                        </div> */}
                        <TableTotalS titleH1={''} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'INSCRITOS POR CATEGORIA'} tbImage={d.avataresDeProgramas} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={dataInscritosCategoria}/>
                    </Col>
                )
            }
        )
        },
        {
            isComparative: true,
            title: 'venta semana (SESIONES) por distrito',
            id: 'COMPARATIVOPORSESIONESPORPROGRAMA',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={6}>
                    {/* <FormatTable data={d.agrupadoPorSesiones}/> */}
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} isSesion={true} arrayEstadistico={d.agrupadoPorSesiones} onOpenModalSOCIOS={onOpenModalSOCIOS} isViewSesiones={true} labelParam={'SESION'}/>
                </Col>
            )
            }
            )
        },//VENTA POR SEMANA(SESIONES) POR DISTRITO
        {
            title: 'comparativo distritos por venta por semana por programa',
            id: 'COMPARATIVOPORSESIONESTOTAL',
            HTML: dataAlterIdPgmCero.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                    <TableTotal data={d.agrupadoPorSesiones} titleH1={''} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'SESIONES'} tbImage={d.avataresDeProgramas} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.agrupadoPorSesiones}/>
                </Col>
            )
            }
            )
        },
        {
            isComparative: true,
            title: 'comparativo distritos por venta por semana por programa',
            id: 'comparativodistritosporventaporsemanaporprograma',
            HTML: dataAlter.map(d=>{
                return (
                    <Col>
                        <Row>
                            {
                                d.arTest.map(g=>{
                                    return (
                                            <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={12}>
                                                asdf
                                                <ItemCardPgm titleRecurrent={<div className='fs-1'>{g.propiedad}</div>} avatarPrograma={d.avatarPrograma} isSesion={true} arrayEstadistico={g.agrupadoPorSesiones} onOpenModalSOCIOS={onOpenModalSOCIOS} isViewSesiones={true} labelParam={'SESION'}/>
                                            </Col>
                                    )
                                })
                            }
                        </Row>
                    </Col>
            )
            }
            )
        },
        {
            isComparative: true,
            title: 'comparativo distritos por venta por semana por programa',
            id: 'comparativodistritosporventaporsemanaporprograma',
            HTML: dataAlter.map(d=>{
                return (
                    <Col>
                        <Row>
                            {
                                d.arTest.map(g=>{
                                    return (
                                            <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={12}>
                                                asdf
                                                <ItemCardPgm titleRecurrent={<div className='fs-1'>{g.propiedad}</div>} avatarPrograma={d.avatarPrograma} isSesion={true} arrayEstadistico={g.agrupadoPorSesiones} onOpenModalSOCIOS={onOpenModalSOCIOS} isViewSesiones={true} labelParam={'SESION'}/>
                                            </Col>
                                    )
                                })
                            }
                        </Row>
                    </Col>
            )
            }
            )
        },
        // {
        //     title: 'comparativo distritos por venta por semana por programa',
        //     id: 'comparativodistritosporventaporsemanaporprograma',
        //     HTML: dataAlterIdPgmCero.map(d=>{
        //         return (
        //         <Col style={{paddingBottom: '1px !important'}} xxl={12}>
        //             {
        //                 d.arTest.map(t=>{
        //                     return (
        //                         <>
        //                         <TableTotal data={t.agrupadoPorSesiones} titleH1={<span style={{fontSize: '50px'}}>{t.propiedad}</span>} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'SESIONES'} tbImage={d.avataresDeProgramas} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={t.agrupadoPorSesiones}/>
        //                         </>
        //                     )
        //                 })
        //             }
        //         </Col>
        //     )
        //     }
        //     )
        // },
        
        {
            isComparative: true,
            title: 'HORARIOS DE VENTA ',
            id: 'HORARIOSVENTA',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={6}>
                    {/* <FormatTable data={d.agrupadoPorHorario}/> */}
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} arrayEstadistico={d.agrupadoPorHorarioDeVenta} onOpenModalSOCIOS={onOpenModalSOCIOS} labelParam={'HORARIO'}/>
                </Col>
            )   
            }
            )
        },
        {
            isComparative: true,
            title: 'TOTAL HISTORICO ACUMULADO DE VENTAS POR TURNO',
            id: 'HORARIOSVENTA',
            HTML: dataAlterIdPgmCero.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={12}>
                    {/* <FormatTable data={d.agrupadoPorHorario}/> */}
                    <TableTotal titleH1={''} isTime avataresDeProgramas={d.avataresDeProgramas} labelTotal={'HORARIO'} onOpenModalSOCIOS={onOpenModalSOCIOS} data={d.agrupadoPorHorarioVenta}/>
                </Col>
            )   
            }
            )
        },

        {
            title: 'SOCIOS PAGANTES POR HORARIO VS AFORO  - TOTAL',
            id: 'COMPARATIVOPORHORARIOTOTAL',
            HTML: dataAlterIdPgmCero.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                    <TableTotal titleH1={''} isTime avataresDeProgramas={d.avataresDeProgramas} labelTotal={'HORARIO'} onOpenModalSOCIOS={onOpenModalSOCIOS} data={d.agrupadoPorHorario}/>
                </Col>
            )
            }
        )
        },
        {
            isComparative: true,
            title: 'SOCIOS PAGANTES POR GENERO',
            id: 'COMPARATIVOPORHORARIOPORPROGRAMA',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={6}>
                    {/* <FormatTable data={d.agrupadoPorHorario}/> */}
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} arrayEstadistico={d.porSexo} onOpenModalSOCIOS={onOpenModalSOCIOS} isViewSesiones={true} labelParam={'GENERO'}/>
                </Col>
            )
            }
            )
        },
        {
            title: 'SOCIOS PAGANTES POR GENERO - TOTAL',
            id: 'COMPARATIVOPORHORARIOTOTAL',
            HTML: dataAlterIdPgmCero.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                    <TableTotal data={d.porSexo} titleH1={''} isTime avataresDeProgramas={d.avataresDeProgramas} labelTotal={'GENERO'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.porSexo}/>
                </Col>
            )
            }
        )
        },
        {
            isComparative: true,
            title: 'SOCIOS PAGANTES POR DISTRITO',
            id: 'COMPARATIVOPROGRAMASPORDISTRITO',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={6}>
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
            title: 'SOCIOS PAGANTES POR DISTRITO - TOTAL',
            id: 'COMPARATIVOTOTALPORDISTRITO',
            HTML: dataAlterIdPgmCero.map(d=>{
                    return (
                    <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                        <TableTotal data={d.porDistrito} titleH1={''}  avataresDeProgramas={d.avataresDeProgramas} labelTotal={'DISTRITO'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.porDistrito}/>
                    </Col>
                )
                }
            )
        },


        
        {
            isComparative: true,
            title: 'SOCIOS PAGANTES POR DISTRITO DE TRABAJO',
            id: 'COMPARATIVOPROGRAMASPORDISTRITO',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={6}>
                    {/* <FormatTable data={d.agrupadoPorHorario}/> */}
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} 
                    arrayEstadistico={d.porDistritoTrabajo} 
                    onOpenModalSOCIOS={onOpenModalSOCIOS} 
                    isViewSesiones={true} 
                    labelParam={'DISTRITO'}/>
                </Col>
            )
            }
            )
        },
        {
            title: 'SOCIOS PAGANTES POR DISTRITO DE TRABAJO - TOTAL',
            id: 'COMPARATIVOTOTALPORDISTRITO',
            HTML: dataAlterIdPgmCero.map(d=>{
                    return (
                    <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                        <TableTotal data={d.porDistritoTrabajo} titleH1={''}  avataresDeProgramas={d.avataresDeProgramas} labelTotal={'DISTRITO'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.porDistrito}/>
                    </Col>
                )
                }
            )
        },
        
        {
            isComparative: true,
            title: 'SOCIOS PAGANTES RANGO DE EDAD POR PROGRAMA / GENERO',
            id: 'COMPARATIVORANGODEEDAD/SEXOPORPROGRAMA',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={6}>
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
            title: 'SOCIOS PAGANTES RANGO DE EDAD TOTAL / GENERO - TOTAL ',
            id: 'COMPARATIVORANGODEEDADTOTAL',
            HTML: dataAlterIdPgmCero.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                    <TableTotal 
                        isNeedGenere={true} 
                        data={d.agruparPorRangoEdades}
                        titleH1={''} 
                        avataresDeProgramas={d.avataresDeProgramas} 
                        labelTotal={'RANGO DE EDAD'} 
                        onOpenModalSOCIOS={onOpenModalSOCIOS} 
                        arrayEstadistico={d.agruparPorRangoEdades}/>
                </Col>
            )
            }
        )
        },
        {
            isComparative: true,
            title: 'SOCIOS PAGANTES ESTADO CIVIL',
            id: 'COMPARATIVOESTADOCIVILPORPROGRAMA',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={6}>
                    {/* <FormatTable data={d.agrupadoPorHorario}/> */}
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} 
                    arrayEstadistico={d.agrupadoPorEstadoCivil} 
                    onOpenModalSOCIOS={onOpenModalSOCIOS} 
                    isViewSesiones={true} 
                    labelParam={'EST. CIVIL (A)'}/>
                </Col>
            )
            }
            )
        },
        {
            title: 'SOCIOS PAGANTES ESTADO CIVIL - TOTAL',
            id: 'COMPARATIVOTOTALESTADOCIVIL',
            HTML: dataAlterIdPgmCero.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                <TableTotal titleH1={''} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'ESTADO CIVIL (A)'} onOpenModalSOCIOS={onOpenModalSOCIOS} data={d.agrupadoPorEstadoCivil}/>
                    
                </Col>
            )
            }
        )
        },
        {
            isComparative: true,
            title: 'COMPARATIVO VENTAS ASESORES',
            id: 'COMPARATIVOASESORES',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={6}>
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} 
                    arrayEstadistico={d.agrupadoPorVendedores} 
                    onOpenModalSOCIOS={onOpenModalSOCIOS} 
                    isViewSesiones={true} 
                    labelParam={'ASESORES'}/>
                </Col>
            )
            }
            )
        },
        {
            title: 'COMPARATIVO VENTAS ASESORES - TOTAL',
            id: 'COMPARATIVOASESORESTOTAL',
            HTML: dataAlterIdPgmCero.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                <TableTotal titleH1={''} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'ASESORES'} onOpenModalSOCIOS={onOpenModalSOCIOS} data={d.agrupadoPorVendedores}/>
                    
                </Col>
            )
            }
        )
        },
        {
            title: 'COMPARATIVO VENTAS ASESORES x NUEVOS - TOTAL',
            id: 'COMPARATIVOASESORESXNUEVOSTOTAL',
            HTML: dataAlterIdPgmCero.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                <TableTotal titleH1={''} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'ASESORES'} onOpenModalSOCIOS={onOpenModalSOCIOS} data={d.agrupadoPorVendedores}/>
                    
                </Col>
            )
            }
        )
        },
        {
            isComparative: true,
            title: 'SOCIOS PAGANTES POR PROCEDENCIA',
            id: 'COMPARATIVOPROCEDENCIA',
            HTML: dataAlter.map(d=>{
                const formattedData = d.agrupadoPorProcedencia.map(group => {
                    const propiedadObj = group.find(item => item.isPropiedad);
                    return {
                      label: propiedadObj.value,
                      val: propiedadObj.items.length
                    };
                  });
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={6}>
                    <ItemCardPgm grafPie={<GrafPie data={formattedData} width={500} height={500}/>} avatarPrograma={d.avatarPrograma} 
                    arrayEstadistico={d.agrupadoPorProcedencia} 
                    onOpenModalSOCIOS={onOpenModalSOCIOS} 
                    isViewSesiones={true} 
                    labelParam={'ASESORES'}/>
                </Col>
            )
            }
            )
        },
        {
            title: 'SOCIOS PAGANTES POR PROCEDENCIA - TOTAL',
            id: 'COMPARATIVOPROCEDENCIATOTAL',
            HTML: dataAlterIdPgmCero.map(d=>{
                
                return (
                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                <TableTotal titleH1={''} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'ASESORES'} onOpenModalSOCIOS={onOpenModalSOCIOS} data={d.agrupadoPorProcedencia}/>
                    
                </Col>
            )
            }
        )
        },
        // {
        //     title: 'SOCIOS DESPUES DEL TRASPASO POR PROCEDENCIA - TOTAL',
        //     id: 'COMPARATIVOPROCEDENCIATOTAL',
        //     HTML: dataAlterIdPgmCero.map(d=>{
        //         return (
        //         <Col style={{paddingBottom: '1px !important'}} xxl={12}>
        //         <TableTotal titleH1={''} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'ASESORES'} onOpenModalSOCIOS={onOpenModalSOCIOS} data={d.agrupadoPorProcedencia}/>
                    
        //         </Col>
        //     )
        //     }
        // )
        // },
        
        {
            isComparative: true,
            title: 'SOCIOS CANJE POR PROCEDENCIA',
            id: 'COMPARATIVOPROCEDENCIA',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={6}>
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} 
                    arrayEstadistico={d.agrupadoPorProcedenciaCeros} 
                    onOpenModalSOCIOS={onOpenModalSOCIOS} 
                    isViewSesiones={true} 
                    labelParam={'PROCEDENCIA'}/>
                </Col>
            )
            }
            )
        },
        {
            title: 'SOCIOS CANJE POR PROCEDENCIA - TOTAL',
            id: 'COMPARATIVOPROCEDENCIATOTAL',
            HTML: dataAlterIdPgmCero.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
                    {/* <TableTotal/> */}
                <TableTotal titleH1={''} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'procedencia'} onOpenModalSOCIOS={onOpenModalSOCIOS} data={d.agrupadoPorProcedenciaCeros}/>
                        
                </Col>
            )
            }
        )
        },
        {
            isComparative: true,
            title: 'SOCIOS PAGANTES POR PROMOCIONES',
            id: 'COMPARATIVOPROMOCIONESPORPROGRAMA',
            HTML: dataAlter.map(d=>{
                return (
                    <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={6}>
                    {/* <FormatTable data={d.agrupadoPorHorario}/> */}
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} 
                    arrayEstadistico={d.agrupadoPorTarifas} 
                    onOpenModalSOCIOS={onOpenModalSOCIOS} 
                    isViewSesiones={true} 
                    labelParam={'PROMO'}/>
                </Col>
            )
            }
        )
        },
        {
            title: 'SOCIOS PAGANTES POR PROMOCIONES - TOTAL',
            id: 'COMPARATIVOTOTALDEPROMOCIONES',
            HTML: dataAlterIdPgmCero.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important'}} xxl={12}>
        {/* <FormatDataTable arrayEstadistico={d.agrupadoPorTarifas}/> */}
            <TableTotal  titleH1={''} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'PROMOCION'} onOpenModalSOCIOS={onOpenModalSOCIOS} data={d.agrupadoPorTarifas}/>
                </Col>
            )
            }
        )
        },
    ]
    const [extractTitle, setextractTitle] = useState('')
    const sectionRefs = data.map(() =>
        useInView({
          threshold: 0.1, // Activa cuando el 50% de la sección esté visible
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
      const items = [
        {
            label: 'Add',
            icon: 'pi pi-pencil',
            command: () => {
                toast.current.show({ severity: 'info', summary: 'Add', detail: 'Data Added' });
            }
        },
        {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {
                toast.current.show({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => {
                toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
            }
        },
        {
            label: 'Upload',
            icon: 'pi pi-upload',
            command: () => {
                router.push('/fileupload');
            }
        },
        {
            label: 'React Website',
            icon: 'pi pi-external-link',
            command: () => {
                window.location.href = 'https://react.dev/';
            }
        }
    ];
  return (
    <>
    <FechaRange rangoFechas={RANGE_DATE}/>
    {
        loading ?
        (
            <>LOADING</>
        )
        : 

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
    }
    <SpeedDial model={items} direction="up" className="speeddial-bottom-right right-0 bottom-0" buttonClassName="p-button-danger" />
                                    <ModalTableSocios
                                    clickDataSocios={clickDataSocios}
                                    isDataNeedGruped={isDataNeedGruped}
                                    avatarProgramaSelect={avatarProgramaSelect}
                                    clickDataLabel={clickDataLabel} show={isOpenModalSocio} onHide={onCloseModalSOCIOS}/>
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
import { PageBreadcrumb } from '@/components'
import { Loading } from '@/components/Loading'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Table } from 'react-bootstrap'
import { FechaRange } from '@/components/RangeCalendars/FechaRange'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
import { useReporteDemograficoxMembresiaStore } from './useReporteDemograficoxMembresiaStore'
import { useSelector } from 'react-redux'
import config from '@/config'
import { arrayDistritoTest, arrayEstadoCivil, arraySexo } from '@/types/type'
import { useDispatch } from 'react-redux'
import { useInView } from 'react-intersection-observer'
import { onSetViewSubTitle } from '@/store'
import { ItemCardPgm } from './ItemCardPgm'
import { ModalTableSocios } from './ModalTableSocios'
import { TableTotal } from './TableTotal'
dayjs.extend(utc);

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
  
  
function agruparPorCliente(data=[]) {
  // console.log({data});
  
        const filteredData = [];
    const seenClients = new Set();

        for (const item of data) {
        const idCli = item.tb_ventum.id_cli;
        if (!seenClients.has(idCli)) {
            filteredData.push(item);
            seenClients.add(idCli);
        }
        }
return filteredData
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
export const ResumenComparativo = () => {
    const loading = false;
    const { RANGE_DATE } = useSelector(e=>e.DATA)
    const { dataMembresiasxPrograma, dataIdPgmCero, obtenerDemografiaMembresia } = useReporteDemograficoxMembresiaStore()
        useEffect(() => {
            if(RANGE_DATE[0]===null) return;
            if(RANGE_DATE[1]===null) return;
            obtenerDemografiaMembresia(RANGE_DATE)
            // obtenerEstadosOrigenResumen(RANGE_DATE)
        }, [RANGE_DATE])
        // console.log({RANGE_DATE, MEM: agruparPorVenta(dataMembresiasxPrograma)});
        
            const [isOpenModalSocio, setisOpenModalSocio] = useState(false)
            const [avatarProgramaSelect, setavatarProgramaSelect] = useState({})
            const [clickDataSocios, setclickDataSocios] = useState([])
            const [clickDataLabel, setclickDataLabel] = useState('')
        

        const onOpenModalSOCIOS = (d, avatarPrograma=[], label)=>{
            // console.log(d, "d???????????");
            setavatarProgramaSelect(avatarPrograma)
            setclickDataSocios(d)
            setclickDataLabel(label)
            setisOpenModalSocio(true)
        }
        const onCloseModalSOCIOS = ()=>{
            setisOpenModalSocio(false)
        }
    const dataAlter = dataMembresiasxPrograma.map(d=>{
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
          const aforo = d.id_pgm===2?36:d.id_pgm===3?10:d.id_pgm===4?14:''
          
          const todoVentas = agruparPorVenta(agruparPorCliente(d.detalle_ventaMembresium))
        const porSexo = agruparPorSexo(todoVentas).map((grupo, index, array) => {
            const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
            const sumaXITEMS = grupo.items.length
            return [
            { header: "GENERO", value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL' },
            { header: "socios", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
            { header: "% SOCIOS", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100).toFixed(2) },
                ]
            }
            )
        const agrupadoPorEstadoCivil = agruparPorEstCivil(todoVentas).map((grupo, index, array) => {
            const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
            const sumaXITEMS = grupo.items.length
            return [
            { header: "EST. CIVIL", value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL' },
            { header: "socios", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
            { header: "% SOCIOS", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100).toFixed(2) },
                ]
            }
            )
            const agrupadoPorHorario = agruparPorHorarios(todoVentas).sort((a,b)=>b.items.length-a.items.length).map((grupo, index, array) => {
                const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
                const sumaXITEMS = grupo.items.length
                return [
                { header: "Horario", value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL' },
                { header: "socios", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
                { header: "% SOCIOS", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100).toFixed(2) },
                    ]
                }
                )
                
            const porDistrito= agruparPorDistrito(todoVentas).sort((a,b)=>b.items.length-a.items.length).map((grupo, index, array) => {
                const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
                const sumaXITEMS = grupo.items.length
                return [
                { header: "DISTRITO", value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL' },
                { header: "SOCIOS", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
                { header: "% SOCIOS", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100).toFixed(2) },
                    ]
                }
                )
            const agrupadoPorRangoEdadSexo = agruparPorRangoEdad(todoVentas).sort((a,b)=>a.items.length > b.items.length).map((grupo, index, array) => {
                const sumaTotal = array.reduce((total, item) => total + (item?.items.length || 0), 0)
                const sumaXITEMS = grupo.items.length
                return [
                { header: "DISTRITO", value: grupo.propiedad, isPropiedad: true, tFood: 'TOTAL' },
                { header: "SOCIOS", isSummary: true, value: grupo.items.length, tFood: sumaTotal },
                { header: "% SOCIOS", isSummary: true, value: ((sumaXITEMS/sumaTotal)*100).toFixed(2), items: grupo.items, tFood: ((sumaXITEMS/sumaXITEMS)*100).toFixed(2) },
                    ]
                }
                )
        return {
            porDistrito,
            todoVentas,
            aforo,
            porSexo,
            agrupadoPorEstadoCivil,
            avatarPrograma,
            agrupadoPorHorario,
            agrupadoPorRangoEdadSexo
        }
    })

    
    const dataAlterIdPgmCero =
    [dataIdPgmCero]?.map(d=>{
        const avatarPrograma = {
            urlImage: 'TOTAL',
        }
          const todoVentas = agruparPorVenta(agruparPorCliente(d.detalle_ventaMembresium))
        
        const porSexo = agruparPorSexo(todoVentas)
        const porDistrito= agruparPorDistrito(todoVentas)
        // const agrupadoPorSesiones = agruparPorSesiones(ventasSinCeros)
        // const agrupadoPorTarifas = agruparPorTarifas(ventasSinCeros)
        const agrupadoPorEstadoCivil = agruparPorEstCivil(todoVentas)
        // const agrupadoPorVendedores = agruparPorVendedores(ventasSinCeros)
        const agrupadoPorHorario = agruparPorHorarios(todoVentas)
        const agruparPorRangoEdades = agruparPorRangoEdad(todoVentas).sort((a,b)=>a.items.length > b.items.length)
        const clientesCanjes = []
        // const activosDeVentasPorSemanaMarcacions = agruparPrimeraMarcacionGlobal(ventasSinCeros) 
        const avataresDeProgramas = dataIdPgmCero.tb_image
        // const montoTotal_ACTIVO = []
        // const agrupadoPorProcedencia = agruparPorProcedencia(ventasSinCeros)
        // console.log({ agrupadoPorVendedores, agruparPorRangoEdades, agrupadoPorEstadoCivil, agrupadoPorTarifas, agrupadoPorSesiones, sumaDeVentasEnSoles, sumaDeSesiones, porSexo, porDistrito, ventasEnCeros, ventasSinCeros, membresiasNuevas, membresiasRenovadas, membresiasReinscritos}, "alter");
        return {
            // clientesCanjes,
            // clientesCanjes,
            agrupadoPorHorario,
            // agrupadoPorVendedores,
            // agrupadoPorProcedencia,
            // activosDeVentasPorSemanaMarcacions,
            agruparPorRangoEdades,
            agrupadoPorEstadoCivil,
            // agrupadoPorTarifas,
            // agrupadoPorSesiones,
            avatarPrograma,
            porDistrito,
            porSexo,
            avataresDeProgramas
        }
    })
    
    const data = [
        {
            isComparative: true,
            title: 'SOCIOS TOTAL POR GENERO',
            id: 'COMPARATIVOSEXO',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={4}>
                    {/* <FormatTable data={d.agrupadoPorHorario}/> */}
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} 
                    arrayEstadistico={d.porSexo} 
                    onOpenModalSOCIOS={onOpenModalSOCIOS} 
                    isViewSesiones={true} 
                    labelParam={'GENERO'}/>
                </Col>
            )
            }
            )
        },
      //   {
      //     isComparative: true,
      //     title: 'SOCIOS TOTAL POR GENERO - RESUMEN',
      //     id: 'COMPARATIVOSEXO',
      //     HTML: dataAlterIdPgmCero.map(d=>{
      //                     return(
      //                         <Col style={{paddingBottom: '1px !important'}} xxl={12}>
      //                             <TableTotal titleH1={''} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'INSCRITOS POR CATEGORIA'} tbImage={d.avataresDeProgramas} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.porSexo}/>
      //                         </Col>
      //                     )
      //                 }
      //             )
      // },
        {
            isComparative: true,
            title: 'SOCIOS TOTAL POR ESTADO CIVIL',
            id: 'COMPARATIVOESTADOCIVIL',
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
            isComparative: true,
            title: 'SOCIOS TOTAL POR HORARIO',
            id: 'SOCIOSTOTALPORHORARIO',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={4}>
                    {/* <FormatTable data={d.agrupadoPorHorario}/> */}
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} 
                    arrayEstadistico={d.agrupadoPorHorario} 
                    onOpenModalSOCIOS={onOpenModalSOCIOS} 
                    isViewSesiones={true} 
                    labelParam={'HORARIO'}/>
                </Col>
            )
            }
            )
        },
        {
            isComparative: true,
            title: 'SOCIOS TOTAL POR DISTRITO',
            id: 'SOCIOSTOTALPORDISTRITO',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={4}>
                    {/* <FormatTable data={d.agrupadoPorHorario}/> */}
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} 
                    arrayEstadistico={d.porDistrito} 
                    onOpenModalSOCIOS={onOpenModalSOCIOS} 
                    isViewSesiones={true} 
                    labelParam={'HORARIO'}/>
                </Col>
            )
            }
            )
        },
        {
            isComparative: true,
            title: 'SOCIOS TOTAL POR RANGO DE EDAD',
            id: 'SOCIOSTOTALPORRANGODEEDAD',
            HTML: dataAlter.map(d=>{
                return (
                <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={4}>
                    {/* <FormatTable data={d.agrupadoPorHorario}/> */}
                    <ItemCardPgm avatarPrograma={d.avatarPrograma} 
                    arrayEstadistico={d.agrupadoPorRangoEdadSexo} 
                    onOpenModalSOCIOS={onOpenModalSOCIOS} 
                    isViewSesiones={true} 
                    labelParam={'HORARIO'}/>
                </Col>
            )
            }
            )
        },
        // {
        //     isComparative: true,
        //     title: 'SOCIOS TOTAL POR HORARIO',
        //     id: 'COMPARATIVOESTADOCIVIL',
        //     HTML: dataAlter.map(d=>{
        //         return (
        //         <Col style={{paddingBottom: '1px !important', marginTop: '100px'}} xxl={4}>
        //             {/* <FormatTable data={d.agrupadoPorHorario}/> */}
        //             <ItemCardPgm avatarPrograma={d.avatarPrograma} 
        //             arrayEstadistico={d.agrupadoPorHorario} 
        //             onOpenModalSOCIOS={onOpenModalSOCIOS} 
        //             isViewSesiones={true} 
        //             labelParam={'HORARIO'}/>
        //         </Col>
        //     )
        //     }
        //     )
        // },
        // {
        //     title: 'COMPARATIVO ESTADO CIVIL - TOTAL',
        //     id: 'COMPARATIVOTOTALESTADOCIVIL',
        //     HTML: dataAlterIdPgmCero.map(d=>{
        //         return (
        //         <Col style={{paddingBottom: '1px !important'}} xxl={12}>
        //         <TableTotal titleH1={''} avataresDeProgramas={d.avataresDeProgramas} labelTotal={'ESTADO CIVIL'} onOpenModalSOCIOS={onOpenModalSOCIOS} arrayEstadistico={d.agrupadoPorEstadoCivil}/>
                    
        //         </Col>
        //     )
        //     }
        // )
        // },
    ]
    
    const dispatch = useDispatch()
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

            console.log(`Estás en: ${data[index].title}`);
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
            <Row>
                <br/>
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
                                    {/* <ModalTableSocios
                                    clickDataSocios={clickDataSocios}
                                    avatarProgramaSelect={avatarProgramaSelect}
                                    clickDataLabel={clickDataLabel} show={isOpenModalSocio} onHide={onCloseModalSOCIOS}/> */}
        {/* <ModalSocios clickDataLabel={clickDataLabel} onHide={onCloseModalSOCIOS} data={clickDataSocios} show={isOpenModalSocio}/> */}
    </>
  )
}

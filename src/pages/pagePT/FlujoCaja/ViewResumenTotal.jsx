import React, { useEffect, useState } from 'react'
import { useFlujoCaja } from './hook/useFlujoCajaStore';
import { Table } from 'react-bootstrap';
import dayjs from 'dayjs';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import { obtenerAnioMesDiaActualPeru } from './helpers/fechaPeru';

// Suma un campo (o el resultado de una función) de un array de meses
// (dataAlter/dataAlterMesCompleto). Antes cada total se recalculaba con su
// propio `.reduce(...)` inline, repetido varias veces con el mismo
// array+campo — esto es solo esa misma cuenta, hecha una vez y reutilizada
// donde antes se repetía.
const sumarCampo = (data, campoOFn) => {
	const valor = typeof campoOFn === 'function' ? campoOFn : (item) => item[campoOFn]
	return data.reduce((total, item) => total + valor(item), 0)
}

// Grupos "BOLSA" (gasto e ingreso) en la BD. Por defecto los ids que usa
// CHANGE (153 gasto, 121 ingreso); las demás empresas pueden pasar los suyos
// propios por prop (`idGrupoGastoBolsa` / `idGrupoIngresoBolsa`) si en su
// plan de cuentas esos grupos tienen otro id.
const ID_GRUPO_GASTO_BOLSA_DEFAULT = 153
const ID_GRUPO_INGRESO_BOLSA_DEFAULT = 121

// Nombre de la empresa mostrado en los títulos/filas de la tabla "{empresa} +
// BOLSA" (ej. "UTILIDAD / PERDIDA CHANGE"). Antes decía "CHANGE" fijo aunque
// este mismo componente se usa también para CIRCUS y REDUCTO.
const NOMBRE_EMPRESA_DEFAULT = 'CHANGE'

export const ViewResumenTotal = ({fechas, id_enterprice, bgTotal, bgPastel, anio, onOpenModalTableItems, idGrupoGastoBolsa = ID_GRUPO_GASTO_BOLSA_DEFAULT, idGrupoIngresoBolsa = ID_GRUPO_INGRESO_BOLSA_DEFAULT, nombreEmpresa = NOMBRE_EMPRESA_DEFAULT}) => {
    const fechaElegida = new Date(anio[0])
    const anioElegido = fechaElegida.getFullYear()
    const mesElegido = fechaElegida.getMonth()+1
    // "Hoy" en hora peruana (UTC-5 fijo), no en la zona horaria del entorno
    // donde corra el código — evita que el mes/día se adelante cerca de la
    // medianoche UTC (7pm-12am hora Perú).
    const { anioActual, mesActual, dateActual } = obtenerAnioMesDiaActualPeru()
    const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja()
    useEffect(() => {
        obtenerEgresosxFecha(id_enterprice, anio)
    }, [id_enterprice])
    useEffect(() => {
        obtenerIngresosxFecha(id_enterprice, anio)
    }, [])
    const dataAlter = fechas.map((f, index, array)=>{
        const dataGastos1272 = dataGastosxFecha.flujoxGrupo.flatMap(e=>e.parametro_grupo_gasto).filter(f=>f.id==1272 ).flatMap(e=>e.itemsxDia).filter(e=>e?.mes===f?.mes);
        const dataGast = dataGastosxFecha.flujoxGrupo.filter(f=>f.id!==97 && f.id!==110&& f.id!==idGrupoGastoBolsa && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150 && f.id!==157 ).flatMap(e=>e.parametro_grupo_gasto).flatMap(e=>e.itemsxDia).filter(e=>e?.mes===f?.mes);
        const dataGasto = dataGastosxFecha.flujoxGrupo.filter(f=>f.id!==97 && f.id!==110 && f.id!==idGrupoGastoBolsa && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150 && f.id!==157).flatMap(e=>e.itemsxDia).filter(e=>e?.mes===f?.mes).flatMap(e=>e.items);
        const dataGastoNoPagados = dataGastosxFecha.flujoxGrupo.filter(f=>f.id!==97 && f.id!==110&& f.id!==idGrupoGastoBolsa && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150 && f.id!==157 ).flatMap(e=>e.itemsxDia).filter(e=>e?.mes===f?.mes).flatMap(e=>e.items).filter(f=>f.id_estado_gasto===1424);
        const dataGastoBolsa = dataGastosxFecha.flujoxGrupo.filter(f=>f.id===idGrupoGastoBolsa).flatMap(e=>e.itemsxDia).filter(e=>e?.mes===f?.mes).flatMap(e=>e.items);
        const dataIngresos = dataIngresosxFecha.flujoxGrupo.filter(f=>f.grupo!=='PRESTAMOS A TERCEROS').filter(f=>f.id!==idGrupoIngresoBolsa).flatMap(e=>e.itemsxDia).filter(e=>e?.mes===f?.mes).flatMap(e=>e.items);
        const dataIngresosExcepcionales = dataIngresosxFecha.flujoxGrupo.filter(f=>f.id===idGrupoIngresoBolsa).flatMap(e=>e.itemsxDia).filter(e=>e?.mes===f?.mes).flatMap(e=>e.items);
        const cuotas = getQuotaParaMes(f?.mes, f.anio)?.meta
        // true si esta fila-mes es el mes en curso (se usa para resaltar la
        // columna y para las secciones "en vivo" que muestran el proyectado).
        const esMesActual = `${f?.mes}-${f.anio}`===`${mesActual}-${anioActual}`
        // SUMA
        const sumaProyectado = dataGast.reduce((total, item)=>item.monto_proyectado+total, 0)
        const sumaNoPagados = dataGast.reduce((total, item)=>item.monto_no_pagados+total, 0)
        const sumaIngresos = dataIngresos.reduce((total, item)=>item.monto+total, 0) //
        const sumaGastos = dataGasto.reduce((total, item)=>item.monto+total, 0) //
        const sumaGastosBolsa = dataGastoBolsa.reduce((total, item)=>item.monto+total, 0) //
        const sumaIngresosExcepcional = dataIngresosExcepcionales.reduce((total, item)=>item.monto+total, 0); //
        const cantidadIngresos = dataIngresos.length;
        const cantidadIngresosExcepcional = dataIngresosExcepcionales.length;
        const cantidadGastos = dataGasto.length;

        const sumagastos1272 = dataGastos1272.reduce((total, item)=>item.monto+total, 0)
        const utilidadBolsa = sumaIngresosExcepcional-sumaGastosBolsa
        const utilidadBruta = dateActual>7?sumaGastos===0?0:sumaIngresos-(sumaProyectado+sumaGastos): sumaGastos===0?0:sumaIngresos-(sumaProyectado+sumaGastos)
        const utilidadNeta = (sumaIngresos)-sumaGastos
        const utilidadUltimaLinea = ((utilidadBruta && sumaIngresos) && (utilidadBruta*100)/sumaIngresos)
        const utilidadUltimaLineaChangeMasBolsa = ((utilidadBruta && sumaIngresos) && ((utilidadBruta+utilidadBolsa))/(sumaIngresos+sumaIngresosExcepcional))
        const utilidadEmpresaMasBolsa = utilidadBolsa+utilidadBruta
        const bonoGerencia = (sumaIngresos-(sumaProyectado+sumaGastos))*0.05
        const utilidadPerdida_ultimaLinea = utilidadBruta<=0?utilidadBruta:sumaIngresos-(sumaProyectado+sumaGastos+sumagastos1272)
        return {
            ...f,
            esMesActual,
            utilidadEmpresaMasBolsa,
            utilidadUltimaLineaChangeMasBolsa,
            cuotas,
            sumagastos1272,
            dataGastos1272,
            utilidadPerdida_ultimaLinea,
            bonoGerencia,
            dataGastoNoPagados,
            sumaNoPagados,
            sumaProyectado,
            utilidadBolsa,
            sumaGastosBolsa,
            dataIngresos,
            dataGasto,
            sumaGastos,
            utilidadNeta,
            utilidadBruta,
            cantidadGastos,
            sumaIngresos,
            cantidadIngresos,
            sumaIngresosExcepcional,
            cantidadIngresosExcepcional,
            utilidadUltimaLinea: (utilidadUltimaLinea),
            mesStr: dayjs(`${f.anio}-${f?.mes}-1`, 'YYYY-M-D').format('MMM [.]'),
        }
    })
    // Mismos meses que dataAlter, pero solo los ya cerrados (año anterior al
    // actual, o año actual con mes menor al actual): así el mes en curso
    // (incompleto) no distorsiona los TOTAL/PROMEDIO de las tablas de abajo.
    const dataAlterMesCompleto = dataAlter.filter((f)=>f.anio<anioActual || (f.anio===anioActual && f.mes<mesActual)).map(f=>{
        return {
          ...f
        }
    })

    // Totales (sobre meses ya cerrados) reutilizados por varias filas de las
    // tablas de abajo. Antes cada fila volvía a hacer su propio `.reduce(...)`
    // sobre el mismo array+campo; acá se calculan una sola vez.
    const totalIngresos = sumarCampo(dataAlterMesCompleto, 'sumaIngresos')
    const totalGastos = sumarCampo(dataAlterMesCompleto, 'sumaGastos')
    const totalIngresosExcepcional = sumarCampo(dataAlterMesCompleto, 'sumaIngresosExcepcional')
    const totalGastosBolsa = sumarCampo(dataAlterMesCompleto, 'sumaGastosBolsa')
    const totalGastos1272 = sumarCampo(dataAlterMesCompleto, 'sumagastos1272')
    const totalUtilidadEmpresaMasBolsa = sumarCampo(dataAlterMesCompleto, 'utilidadEmpresaMasBolsa')
    const totalCuotas = sumarCampo(dataAlterMesCompleto, 'cuotas')
    const totalNoPagados = sumarCampo(dataAlterMesCompleto, 'sumaNoPagados')
    // Nota: a diferencia de totalNoPagados, este usa dataAlter (todos los
    // meses, incluido el actual) — así estaba en el original.
    const totalNoPagadosTodosLosMeses = sumarCampo(dataAlter, 'sumaNoPagados')
    // UTILIDAD/PERDIDA CHANGE de la tabla "CHANGE + BOLSA": utilidadBruta de
    // cada mes (no confundir con `utilidadBrutaTotal`, que sale de
    // ingresos-gastos) menos el bono gerencial (sumagastos1272).
    const totalUtilidadBrutaMenosGastos1272 = sumarCampo(dataAlterMesCompleto, (item) => item.utilidadBruta - item.sumagastos1272)

    const ingresosAcumulados = totalIngresos
    const utilidadBrutaTotal = totalIngresos - totalGastos
    // Nota: a diferencia de los demás totales, este usa dataAlter (todos los
    // meses, incluido el actual) para los gastos — así estaba en el original.
    const utilidadNetaTotal = (totalIngresos + totalIngresosExcepcional) - sumarCampo(dataAlter, 'sumaGastos')
    const utilidadBrutaTotalExtraordinario = totalIngresosExcepcional - totalGastosBolsa
    const utilidadBrutaTotalMESCOMPLETOExtraordinario = utilidadBrutaTotalExtraordinario

    // Divisores de "PROMEDIO MENSUAL". `encontrarFechas` hoy ignora su
    // segundo argumento y siempre devuelve 8 (ver función al final del
    // archivo) — se deja el cálculo del conteo tal cual estaba por si esa
    // función vuelve a activarse más adelante.
    const divisorIngresos = encontrarFechas(anioElegido, dataAlter.filter(f=>f.sumaIngresos!=0).length)
    const divisorGastos = encontrarFechas(anioElegido, dataAlter.filter(f=>f.sumaGastos!=0).length)
    const divisorGastosMesCompleto = encontrarFechas(anioElegido, dataAlterMesCompleto.filter(f=>f.sumaGastos!=0).length)
    const divisorGastosBolsa = encontrarFechas(anioElegido, dataAlter.filter(f=>f.sumaGastosBolsa!=0).length)
    const divisorIngresosExcepcional = encontrarFechas(anioElegido, dataAlter.filter(f=>f.sumaIngresosExcepcional!=0).length)
    const divisorNoPagados = encontrarFechas(anioElegido, dataAlter.filter(f=>f.sumaNoPagados!=0).length)

    // Resalta la columna del mes en curso con el color pastel de la empresa
    // (mismo `bg-${id_enterprice}-pastel` que ya se usaba en cada `<td>`).
    const claseMesActual = (esMesActual) => esMesActual ? `bg-${id_enterprice}-pastel` : ''
    // Igual que `esMesActual` en dataAlter, pero para los `<thead>` que
    // mapean directo sobre la prop `fechas` (sin pasar por dataAlter).
    const esMesActualRaw = (f) => `${f?.mes}-${f.anio}`===`${mesActual}-${anioActual}`
    return (
        <>
          <Table className="tabla-egresos fs-3" style={{ width: '100%', marginBottom: '200px' }} bordered>
            <thead>
              <tr>
                <th style={{width: '500px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white`}><div className='text-black'>{'RESULTADO ANUAL'}</div></th>
                {
                  fechas.map(f=>{
                    return (
                      <React.Fragment key={`${f?.mes}`}>
                      <td className={`text-center border-top-10  ${bgTotal} ${claseMesActual(esMesActualRaw(f))}`} style={{width: '270px'}}>{f.mesSTR}</td>
                      </React.Fragment>
                    )
                  })
                }
                <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '330px'}}>TOTAL</th>
                <th className='text-center border-top-10 border-bottom-10 border-right-10' style={{width: '230px'}}>PROMEDIO <br/> MENSUAL</th>
              </tr>
            </thead>
            <tbody>
              {
                id_enterprice===598 && (
                  <tr>
                    <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>CUOTA</td>
                  {
                    dataAlter.map(e=>{
                      return (
                        <React.Fragment>
                          <td className={`text-end ${claseMesActual(e.esMesActual)}`}>
                            <div className={``} style={{fontSize: '30px'}}>
                              <NumberFormatMoney
                                className='fs-1'
                                amount=
                                {e.cuotas}
                              />
                            </div>
                          </td>
                        </React.Fragment>
                        )
                      })
                    }
                          <td className={`text-end border-left-10 border-right-10 fs-1 text-center`}>
                  <div className='text-end' style={{fontSize: '30px'}}>
                    <NumberFormatMoney className='fs-1' amount={totalCuotas}/>
                  </div></td>
                          <td className={`text-end border-right-10 fs-1 text-center`}>
                            <div className='text-end' style={{fontSize: '30px'}}>
                    <NumberFormatMoney className='fs-1' amount={totalCuotas/divisorIngresos}/>
                  </div></td>
                  </tr> 
                )
              }
              <tr>
                <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>INGRESOS</td>
                {
                  dataAlter.map((e, i)=>{
                    return (
                      <React.Fragment>
                        <td className={`text-end ${claseMesActual(e.esMesActual)}`}> <NumberFormatMoney className='fs-1' amount={e.sumaIngresos}/></td>
                      </React.Fragment>
                    )
                  })
                }
                <td className='border-left-10 border-right-10'>
                  <div className='text-end' style={{fontSize: '30px'}}>
                    <NumberFormatMoney className='fs-1' amount={totalIngresos}/>
                  </div>
                </td>
                <td className='border-right-10'>
                  <div className='text-end'>
                    <NumberFormatMoney className='fs-1' amount={totalIngresos/divisorIngresos}/>
                  </div>
                </td>
              </tr>
              <tr>
                <td className={`sticky-td border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>
                  <div className='d-flex flex-column'>
                    <span className='mb-2'>
                      EGRESOS
                    </span>
                    <span className='text-black'>
                      PROYECTADO
                    </span>
                  </div>
                </td>
                {
                dataAlter.map(e=>{
                  return (
                    <React.Fragment>
                      <td onClick={()=>onOpenModalTableItems(e.dataGasto, dataGastosxFecha, e.mes, anio, true)} className={`text-change text-end ${claseMesActual(e.esMesActual)}`}> 
                        <div className='d-flex flex-column'>
                          <div className='text-change'>
                            <NumberFormatMoney className='fs-1' amount={-e.sumaGastos}/>
                            <br/>
                          </div>
                          {
                            e.sumaProyectado!==0 ? (
                              <div className='text-orange'>
                                <div>
                                  <NumberFormatMoney className='fs-1' amount={-e.sumaProyectado}/>
                                </div>
                              </div>
                            ): (
                              <div className='text-white d-none'>
                              <NumberFormatMoney className='fs-1' amount={-e.sumaProyectado}/>
                              </div>
                            )
                          }
                        </div>
                      </td>
                    </React.Fragment>
                    )
                  })
                }
                <td className='border-left-10 border-right-10'>
                  <div className='text-change text-end '>
                    <NumberFormatMoney className='fs-1' amount={-totalGastos}/>
                  </div>
                </td>
                <td className='border-right-10 '>
                  <div className='text-change text-end '>
                    <NumberFormatMoney className='fs-1' amount={-totalGastos/divisorGastos}/>
                  </div>
                </td>
              </tr>
              <tr>
                <td className={`sticky-td border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>UTILIDAD / PERDIDA <br/><span className='fs-4'>*Actualización del proyectado: el 10 de cada mes.</span></td>
              {
                dataAlter.map(e=>{
                  return (
                    <React.Fragment>
                      <td className={`text-end ${claseMesActual(e.esMesActual)}`}> 
                        {
                              !e.esMesActual && (
                                <div className={`${(e.sumaIngresos-(e.sumaGastos))>0?'text-ISESAC':'text-change'} `} >
                                  <NumberFormatMoney className='fs-1' amount={e.sumaIngresos-(e.sumaGastos)}/>
                                  <br/>
                                </div>
                              )
                        }
                        {
                              (e.esMesActual || `${e?.mes}-${e.anio}`===`${mesActual-1}-${anioActual}` && (e.sumaIngresos-(e.sumaProyectado+e.sumaGastos))!==(e.sumaIngresos-(e.sumaGastos))) && (
                                <div className={`${e.utilidadBruta>0?'text-orange':'text-orange'} `} >
                                  <NumberFormatMoney 
                                    className='fs-1'
                                    amount=
                                    {e.sumaIngresos-(e.sumaProyectado+e.sumaGastos)}/>
                                </div>
                              )
                        }
                      </td>
                    </React.Fragment>
                    )
                  })
                }
                <td className='border-left-10 border-right-10'>
                  <div className={`${utilidadBrutaTotal>0?'text-ISESAC':'text-change'} text-end`} ><NumberFormatMoney className='fs-1' amount={utilidadBrutaTotal}/></div>
                </td>
                <td className='border-right-10'>
                  <div className={`${utilidadBrutaTotal>0?'text-ISESAC':'text-change'} text-end`}>
                    <NumberFormatMoney className='fs-1' amount={(totalIngresos-totalGastos)/divisorGastos}/>
                  </div>
                </td>
              </tr>
              {
                id_enterprice===598 && (
                  <tr>
                    <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>BONO GERENCIAS TRIMESTRAL <br/> (3% UTILIDAD ULTIMA LINEA)</td>
                  {
                    dataAlter.map(e=>{
                      return (
                        <React.Fragment>
                          <td className={`text-end ${claseMesActual(e.esMesActual)}`}>
                            <div className='text-change'>
                              {
                                  <NumberFormatMoney  amount={-e.sumagastos1272} className='fs-1'/>
                              }
                            </div>
                            
                          </td>
                        </React.Fragment>
                        )
                      })
                    }
                          <td className={`text-end border-left-10 border-right-10`}>
                      <div className={`${utilidadBrutaTotal>0?'text-change':'text-change'} text-end`} ><NumberFormatMoney className={'fs-1'} amount={-totalGastos1272}/></div>
                          </td>
                          <td className={`text-end border-right-10`}>
                            <div className={`${utilidadBrutaTotal>0?'text-change':'text-change'}`}>
                              <NumberFormatMoney className={'fs-1'} amount={-((totalGastos1272)/divisorGastosMesCompleto)}/>
                            </div>
                          </td>
                  </tr>
                )
              }
              <tr>
                <td className={`sticky-td border-left-10 border-right-10  sticky-td-${id_enterprice} ${bgTotal}`}>UTILIDAD / PERDIDA <br/>ULTIMA LINEA</td>
              {
                dataAlter.map(e=>{
                  const bonoGerencia = (e.sumaIngresos-(e.sumaProyectado+e.sumaGastos))*0.1
                  return (
                    <React.Fragment>
                      <td className={`text-end  ${claseMesActual(e.esMesActual)}`}> 
                        {
                              !e.esMesActual && (
                                <div className={`${e.utilidadPerdida_ultimaLinea>0?'text-ISESAC':'text-change'} `} >
                                  <NumberFormatMoney className='fs-1' amount={e.utilidadPerdida_ultimaLinea}/>
                                </div>
                              )
                        }
                        {
                              e.esMesActual && (
                                <div className={`${e.utilidadBruta-bonoGerencia>0?'text-orange':'text-orange'} `} >
                                  <NumberFormatMoney 
                                  className='fs-1'
                                    amount=
                                    {e.utilidadPerdida_ultimaLinea}/></div>
                              )
                        }
                      </td>
                    </React.Fragment>
                    )
                  })
                }
                <td className='border-left-10 border-right-10  '>
                  <div className={`${utilidadBrutaTotal>0?'text-ISESAC':'text-change'} text-end`} >
                    <NumberFormatMoney className='fs-1' amount={
                      -(totalGastos1272)
                      +(totalIngresos-totalGastos)
                      }/></div>
                </td>
                <td className='border-right-10'>
                  <div className={`${utilidadBrutaTotal>0?'text-ISESAC':'text-change'} text-end`}>
                    <NumberFormatMoney className='fs-1' amount={
                      (-(totalGastos1272)
                      +(totalIngresos-totalGastos))/divisorGastosMesCompleto}/>
                  </div>
                </td>
              </tr>
              {
                id_enterprice === 598 && (
                  <tr>
                    <td className={`border-left-10 border-right-10 border-bottom-10 sticky-td-${id_enterprice} ${bgTotal}`}>Utilidad / Perdida %</td>
                  {
                    dataAlter.map(e=>{
                      return (
                        <React.Fragment>
                          <td className={`text-end border-bottom-10 ${claseMesActual(e.esMesActual)}`}>
                            {
                                  (e.esMesActual&&`${e?.mes}-${e.anio}`===`${mesActual-1}-${anioActual}`) ? (
                                    <div className={`${e.utilidadBruta>0?'text-orange':'text-orange'} `} >
                                      <NumberFormatMoney className='fs-1' amount={
                                        e.utilidadUltimaLinea
                                        }/> %
                                      </div>
                                  ): (
                                    <div className={`fs-1 ${e.utilidadUltimaLinea>0?'text-ISESAC':'text-change'}`}>{(e.utilidadUltimaLinea).toFixed(2)} %</div>
                                  )
                            }
                          </td>
                        </React.Fragment>
                        )
                      })
                    }
                      <td className={`text-end border-left-10 border-bottom-10 border-right-10`}><div className={`fs-1 ${(utilidadNetaTotal/ingresosAcumulados)>0?'text-ISESAC':'text-change'}`}>
                      <NumberFormatMoney className='fs-1' amount={(((-(totalGastos1272)
                          +(totalIngresos-totalGastos))*100)/totalIngresos)}/> %</div></td>
                      <td className={`text-end border-right-10 border-bottom-10`}><div className={`fs-1 ${(utilidadNetaTotal&&ingresosAcumulados)&&(utilidadNetaTotal/ingresosAcumulados)>0?'text-ISESAC':'text-change'}`}><NumberFormatMoney className='fs-1' amount={(((-(totalGastos1272)
                          +(totalIngresos-totalGastos))*100)/totalIngresos)}/> 
                        {/* (-(totalGastos1272)
                          +(totalIngresos-totalGastos))/divisorGastosMesCompleto
                        */}
                        %</div></td>
                  </tr> 
                )
              }
            </tbody>
          </Table>
          {
            id_enterprice===598 && (
              <div className='text-orange'>
                <Table className="tabla-egresos fs-3" style={{ width: '100%' }} bordered>
                  <thead>
                    <tr>
                      <th style={{width: '500px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white`}><div className='text-black'>{'BONO GERENCIAS TRIMESTRAL'}</div></th>
                      {
                      fechas.map(f=>{
                        return (
                          <React.Fragment key={`${f?.mes}`}>
                          <td className={`text-center border-top-10  ${bgTotal} ${claseMesActual(esMesActualRaw(f))}`} style={{width: '270px'}}>{f.mesSTR}</td>
                          </React.Fragment>
                        )
                      })
                    }
                      <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '230px'}}>TOTAL </th>
                      <th className='text-center border-top-10 border-bottom-10 border-right-10' style={{width: '230px'}}>PROMEDIO <br/> MENSUAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>BONO GERENCIAS TRIMESTRAL <br/>(3% UTILIDAD ULTIMA LINEA)</td>
                    {
                      dataAlter.map(e=>{
                        return (
                          <React.Fragment>
                            {/* <td className={`text-end ${claseMesActual(e.esMesActual)}`}><div> <NumberFormatMoney className='fs-2' amount={e.utilidadBolsa+utilidadPerdida}/></div></td> */}
                            <td className={`text-end ${claseMesActual(e.esMesActual)}`}> 
                            {
                                  !e.esMesActual && (
                                    <div>
                                      <NumberFormatMoney className='fs-1' amount={-e.sumagastos1272}/>
                                    </div>
                                  )
                            }
                            {
                                  e.esMesActual && (
                                    <div className='text-orange'>
                                      <NumberFormatMoney 
                                      className='fs-1'
                                        amount=
                                        {e.utilidadBolsa}/></div>
                                  )
                            }
                          </td>
                          </React.Fragment>
                          )
                        })
                      }
                            <td className={`text-end border-left-10 border-right-10`}><div> <NumberFormatMoney className='fs-1' amount={utilidadBrutaTotalExtraordinario}/></div></td>
                            <td className={`text-end border-right-10`}><div> <NumberFormatMoney className='fs-1' amount={utilidadBrutaTotalMESCOMPLETOExtraordinario/divisorGastosBolsa}/></div></td>
                    </tr> 
                    <tr>
                      <td className={`border-left-10 border-right-10 border-bottom-10 sticky-td-${id_enterprice} ${bgTotal}`}>BONO GERENCIAS TRIMESTRAL <br/>(10% UTILIDAD ULTIMA LINEA)<br/><span className='fs-1'>PROYECTADO</span></td>
                    {
                  dataAlter.map(e=>{
                    return (
                      <React.Fragment>
                        <td className={`text-end border-bottom-10 ${claseMesActual(e.esMesActual)}`}> 
                          {
                                !e.esMesActual && (
                                  <div className={`${(e.utilidadBruta)>0?'text-orange':'text-change'}`}>
                                    <NumberFormatMoney className='fs-1' amount={(e.utilidadBruta-e.sumagastos1272)*0.1}/>
                                  </div>
                                )
                          }
                          {
                                e.esMesActual && (
                                  <div className='text-orange'>
                                    <NumberFormatMoney 
                                    className='fs-1'
                                      amount=
                                      {(e.utilidadBruta-e.sumagastos1272)*0.1}/></div>
                                )
                          }
                        </td>
                      </React.Fragment>
                      )
                    })
                  }
                            <td className={`text-end border-left-10 border-right-10 border-bottom-10 `}><div> <NumberFormatMoney className='fs-2' amount={utilidadBrutaTotalExtraordinario}/></div></td>
                            <td className={`text-end border-right-10 border-bottom-10 `}><div> <NumberFormatMoney className='fs-2' amount={utilidadBrutaTotalMESCOMPLETOExtraordinario/divisorGastosBolsa}/></div></td>
                    </tr> 
                  </tbody>
                </Table>
              </div>
            )
          }
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          {
            id_enterprice!==800 && (
              <div className='text-orange'>
                <Table className="tabla-egresos fs-3" style={{ width: '100%' }} bordered>
                  <thead>
                    <tr>
                      <th style={{width: '500px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white`}><div className='text-black'>{`${nombreEmpresa} + BOLSA`}</div></th>
                      {
                      fechas.map(f=>{
                        return (
                          <React.Fragment key={`${f?.mes}`}>
                          <td className={`text-center border-top-10 ${bgTotal} ${claseMesActual(esMesActualRaw(f))}`} style={{width: '270px'}}>{f.mesSTR}</td>
                          </React.Fragment>
                        )
                      })
                    }
                      <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '230px'}}>TOTAL</th>
                      <th className='text-center border-top-10 border-bottom-10 border-right-10' style={{width: '230px'}}>PROMEDIO <br/> MENSUAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                  <td className={`sticky-td border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>{`UTILIDAD / PERDIDA ${nombreEmpresa}`}</td>
                {
                  dataAlter.map(e=>{
                    const bonoGerencia = (e.utilidadBruta-(totalGastos/divisorGastos-e.sumaGastos))*0.05
                    const utilidadPerdida = e.utilidadBruta<=0?e.utilidadBruta:e.sumaIngresos-(e.sumaProyectado+e.sumaGastos+bonoGerencia)
                    return (
                      <React.Fragment>
                        <td className={`text-end ${claseMesActual(e.esMesActual)}`}> 
                          {
                                !e.esMesActual && (
                                  <div className={`${(e.utilidadBruta-e.sumagastos1272)>0?'text-ISESAC':'text-change'}`}>
                                    <NumberFormatMoney className='fs-1' amount={(e.utilidadBruta-e.sumagastos1272)}/>
                                  </div>
                                )
                          }
                          {
                                e.esMesActual && (
                                  <div className='text-orange'>
                                    <NumberFormatMoney 
                                    className='fs-1'
                                      amount=
                                      {e.sumaIngresos-(e.sumaProyectado+e.sumaGastos)}/></div>
                                )
                          }
                        </td>
                      </React.Fragment>
                      )
                    })
                  }
                  <td className={`border-left-10 border-right-10 text-end`}>
                    <div className={`text-end ${totalUtilidadBrutaMenosGastos1272>0?'text-ISESAC':'text-change'}`} >
                      <NumberFormatMoney 
                      className='fs-1'
                      amount={totalUtilidadBrutaMenosGastos1272}/></div>
                  </td>
                  <td className='border-right-10'>
                    <div className={`text-end ${totalUtilidadBrutaMenosGastos1272>0?'text-ISESAC':'text-change'}`}>
                      <NumberFormatMoney className='fs-1' amount={(totalUtilidadBrutaMenosGastos1272)/divisorGastosMesCompleto}/>
                    </div>
                  </td>
                </tr>
                    <tr>
                      <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>INGRESOS BOLSA</td>
                    {
                      dataAlter.map(e=>{
                        return (
                          <React.Fragment>
                            {/* <td className={`text-end ${claseMesActual(e.esMesActual)}`}><div> <NumberFormatMoney className='fs-2' amount={e.utilidadBolsa+utilidadPerdida}/></div></td> */}
                            <td className={`text-end ${claseMesActual(e.esMesActual)}`}> 
                            {
                                  !e.esMesActual && (
                                    <div className='text-ISESAC'>
                                      <NumberFormatMoney className='fs-1' amount={e.sumaIngresosExcepcional}/>
                                    </div>
                                  )
                            }
                            {
                                  e.esMesActual && (
                                    <div className='text-orange'>
                                      <NumberFormatMoney 
                                      className='fs-1'
                                        amount=
                                        {e.sumaIngresosExcepcional}/></div>
                                  )
                            }
                          </td>
                          </React.Fragment>
                          )
                        })
                      }
                            <td className={`text-end border-left-10 border-right-10`}><div className={`${totalIngresosExcepcional<0?'text-change':'text-ISESAC'}`}> <NumberFormatMoney className='fs-1' amount={totalIngresosExcepcional}/></div></td>
                            <td className={`text-end border-right-10`}><div className={`${totalIngresosExcepcional<0?'text-change':'text-ISESAC'}`}> <NumberFormatMoney className='fs-1' amount={totalIngresosExcepcional/divisorIngresosExcepcional}/></div></td>
                    </tr> 
                    <tr>
                      <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>INVERSION BOLSA</td>
                    {
                      dataAlter.map(e=>{
                        return (
                          <React.Fragment>
                            {/* <td className={`text-end ${claseMesActual(e.esMesActual)}`}><div> <NumberFormatMoney className='fs-2' amount={e.utilidadBolsa+utilidadPerdida}/></div></td> */}
                            <td className={`text-end ${claseMesActual(e.esMesActual)}`}> 
                            {
                                  !e.esMesActual && (
                                    <div className='text-change'>
                                      <NumberFormatMoney className='fs-1' amount={-e.sumaGastosBolsa}/>
                                    </div>
                                  )
                            }
                            {
                                  e.esMesActual && (
                                    <div className='text-orange'>
                                      <NumberFormatMoney 
                                      className='fs-1'
                                        amount=
                                        {e.sumaGastosBolsa}/></div>
                                  )
                            }
                          </td>
                          </React.Fragment>
                          )
                        })
                      }
                            <td className={`text-end border-left-10 border-right-10 text-change`}><div> <NumberFormatMoney className='fs-1 text-change' amount={-totalGastosBolsa}/></div></td>
                            <td className={`text-end border-right-10 text-change`}><div> <NumberFormatMoney className='fs-1 text-change' amount={-totalGastosBolsa/divisorGastosBolsa}/></div></td>
                    </tr> 
                    <tr>
                      <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>UTILIDAD / PERDIDA BOLSA</td>
                    {
                      dataAlter.map(e=>{
                        return (
                          <React.Fragment>
                            {/* <td className={`text-end ${claseMesActual(e.esMesActual)}`}><div> <NumberFormatMoney className='fs-2' amount={e.utilidadBolsa+utilidadPerdida}/></div></td> */}
                            <td className={`text-end ${claseMesActual(e.esMesActual)}`}> 
                            {
                                  !e.esMesActual && (
                                    <div className={`${e.utilidadBolsa>0?'text-ISESAC':'text-change'}`}>
                                      <NumberFormatMoney className='fs-1' amount={e.utilidadBolsa}/>
                                    </div>
                                  )
                            }
                            {
                                  e.esMesActual && (
                                    <div className={`text-orange ${e.utilidadBolsa>0?'text-orange':'text-change'}`}>
                                      <NumberFormatMoney 
                                      className='fs-1'
                                        amount=
                                        {e.utilidadBolsa}/></div>
                                  )
                            }
                          </td>
                          </React.Fragment>
                          )
                        })
                      }
                            <td className={`text-end border-left-10 border-right-10`}><div className={`${utilidadBrutaTotalExtraordinario>0?'text-ISESAC':'text-change'}`}> <NumberFormatMoney className='fs-1' amount={utilidadBrutaTotalExtraordinario}/></div></td>
                            <td className={`text-end border-right-10`}><div className={`${utilidadBrutaTotalExtraordinario>0?'text-ISESAC':'text-change'}`}> <NumberFormatMoney className='fs-1' amount={utilidadBrutaTotalMESCOMPLETOExtraordinario/divisorGastosBolsa}/></div></td>
                    </tr> 
                    <tr>
                      <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>{`TOTAL ${nombreEmpresa} + BOLSA`}</td>
                    {
                      dataAlter.map(e=>{
                        return (
                          <React.Fragment>
                            {/* <td className={`text-end ${claseMesActual(e.esMesActual)}`}><div> <NumberFormatMoney className='fs-2' amount={e.utilidadBolsa+utilidadPerdida}/></div></td> */}
                            <td className={`text-end ${claseMesActual(e.esMesActual)}`}> 
                            {
                                  !e.esMesActual && (
                                    <div className={`${e.utilidadBolsa+e.utilidadBruta-e.sumagastos1272>0?'text-ISESAC':'text-change'}`}>
                                      <NumberFormatMoney className='fs-1' amount={e.utilidadBolsa+e.utilidadBruta-e.sumagastos1272}/>
                                    </div>
                                  )
                            }
                            {
                                  e.esMesActual && (
                                    <div className='text-orange'>
                                      <NumberFormatMoney 
                                      className='fs-1'
                                        amount=
                                        {e.utilidadBolsa}/></div>
                                  )
                            }
                          </td>
                          </React.Fragment>
                          )
                        })
                      }
                            <td className={`text-end border-left-10 border-right-10`}><div className={`${utilidadBrutaTotalExtraordinario>0?'text-ISESAC':'text-change'}`}> <NumberFormatMoney className='fs-1' amount={totalUtilidadEmpresaMasBolsa}/></div></td>
                            <td className={`text-end border-right-10`}><div className={`${utilidadBrutaTotalExtraordinario>0?'text-ISESAC':'text-change'}`}> <NumberFormatMoney className='fs-1' amount={totalUtilidadEmpresaMasBolsa/divisorGastosBolsa}/></div></td>
                    </tr> 
                    
                {/* TODO */}
                
                {
                  id_enterprice===598 && (
                    <tr>
                      <td className={`border-left-10 border-right-10 border-bottom-10 sticky-td-${id_enterprice} ${bgTotal}`}>Utilidad / Perdida %</td>
                    {
                      dataAlter.map(e=>{
                        return (
                          <React.Fragment>
                            <td className={`text-end border-bottom-10 ${claseMesActual(e.esMesActual)}`}>
                              {
                                    (e.esMesActual) ? (
                                      <div className={`${e.utilidadUltimaLineaChangeMasBolsa>0?'text-orange':'text-change'} `} >
                                        <NumberFormatMoney className='fs-1' amount={
                                          e.utilidadUltimaLineaChangeMasBolsa
                                          }/> %
                                        </div>
                                    ): (
                                      <div className={`fs-1 ${e.utilidadUltimaLineaChangeMasBolsa>0?'text-ISESAC':'text-change'}`}>{(e.utilidadUltimaLineaChangeMasBolsa).toFixed(2)}%</div>
                                    )
                              }
                            </td>
                          </React.Fragment>
                          )
                        })
                      }
                        <td className={`text-end border-left-10 border-right-10 border-bottom-10`}>
                          <div className={`${(utilidadNetaTotal/ingresosAcumulados)>0?'text-ISESAC':'text-change'}`}>
                            <NumberFormatMoney className='fs-1' amount={((totalUtilidadEmpresaMasBolsa*100)/(totalIngresos+totalIngresosExcepcional))}/> %
                          </div>
                        </td>
                        <td className={`text-end border-right-10 border-bottom-10`}>
                          <div className={`${(utilidadNetaTotal&&ingresosAcumulados)&&(utilidadNetaTotal/ingresosAcumulados)>0?'text-ISESAC':'text-change'}`}>
                            <NumberFormatMoney className='fs-1' amount={((totalUtilidadEmpresaMasBolsa*100)/(totalIngresos+totalIngresosExcepcional))}/> %
                          </div>
                        </td>
                    </tr> 
                  )
                }
                  </tbody>
                </Table>
              </div>
            )
          }
          
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          {
            id_enterprice!==800 && (
              <Table className="tabla-egresos fs-3" style={{ width: '100%' }} bordered>
                <thead>
                  <tr>
                    <th style={{width: '500px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white`}><div className='text-black'>{'DEUDA RAL / PROVEEDORES'}</div></th>
                    {
                      fechas.map(f=>{
                        return (
                          <React.Fragment key={`${f?.mes}`}>
                          <td className={`text-center border-top-10 ${bgTotal} ${claseMesActual(esMesActualRaw(f))}`} style={{width: '270px'}}>{f.mesSTR}</td>
                          </React.Fragment>
                        )
                      })
                    }
                    <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '230px'}}>TOTAL</th>
                    <th className='text-center border-top-10 border-bottom-10 border-right-10' style={{width: '230px'}}>PROMEDIO <br/> MENSUAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={`border-left-10 border-right-10 border-bottom-10 sticky-td-${id_enterprice} ${bgTotal}`}></td>
                    {
                    dataAlter.map(e=>{
                      return (
                        <React.Fragment>
                          <td className={`text-end border-bottom-10 ${claseMesActual(e.esMesActual)}`} onClick={()=>onOpenModalTableItems(e.dataGastoNoPagados, dataGastosxFecha, e.mes, anio, true)}>
                            <div className='text-change'>
                              <NumberFormatMoney amount={e.sumaNoPagados}/>
                            </div>
                          </td>
                        </React.Fragment>
                        )
                      })
                    }
                    <td className={`text-end border-left-10 border-right-10 border-bottom-10`}> 
                      <div className='text-change'>
                        <NumberFormatMoney amount={-totalNoPagadosTodosLosMeses}/>
                      </div>

                      </td>
                    
                    <td className='border-right-10 border-bottom-10'>
                      <div className={`text-end`}>
                        <NumberFormatMoney amount={totalNoPagados/divisorNoPagados}/>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            )
          }
          
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
        </>
  )
}

function encontrarFechas(anio, a=0) {
//   const hoy = new Date()
//   // Año actual
// const year = hoy.getFullYear();
// // console.log({asdf: a});

// // Mes actual (0 = enero, 11 = diciembre)
// const month = hoy.getMonth();
// const ultimaFecha = new Date(year, month , 0);
// const diaUltimaFecha = ultimaFecha.getDate()
// const diaActual = hoy.getDate()
// if(anio===year){
//   return diaActual==diaUltimaFecha?0:month;
// }else{
//   // if(anio===2024){
//   //   return a
//   // }
// }
return 8;
}


const getQuotaParaMes = (monthIndex, year) => {
  const y = year;
  const m = monthIndex;
  switch (`${m}-${y}`) {
    case "8-2026":
      return {
        meta: 80000,
      };
    case "7-2026":
      return {
        meta: 80000,
      };
    case "6-2026":
      return {
        meta: 80000,
      };
    case "5-2026":
      return {
        meta: 80000,
      };
    case "4-2026":
      return {
        meta: 80000,
      };
    case "3-2026":
      return {
        meta: 100000,
      };
    case "2-2026":
      return {
        meta: 80000,
      };
    case "1-2026":
      return {
        meta: 110000,
      };
    case "12-2025":
      return {
        meta: 90000,
      };

    case "11-2025":
      return {
        meta: 90000,
      };

    case "10-2025":
      return {
        meta: 85000,
      };

    case "9-2025":
      return {
        meta: 75000,
      };

    case "8-2025":
      return {
        meta: 70000,
      };

    case "7-2025":
      return {
        meta: 60000,
      };

    case "6-2025":
      return {
        meta: 60000,
      };

    case "5-2025":
      return {
        meta: 60000,
      };

    case "4-2025":
      return {
        meta: 60000,
      };

    case "3-2025":
      return {
        meta: 60000,
      };

    case "2-2025":
      return {
        meta: 60000,
      };

    case "1-2025":
      return {
        meta: 60000,
      };

    default:
      return {
        meta: 0,
      };
  }
};
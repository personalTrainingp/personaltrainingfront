import React, { useEffect, useState } from 'react'
import { useFlujoCaja } from './hook/useFlujoCajaStore';
import { Table } from 'react-bootstrap';
import dayjs from 'dayjs';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import { ModalProyectados } from './view/ModalProyectados';

export const ViewResumenTotal = ({fechas, id_enterprice, bgTotal, bgPastel, anio, onOpenModalTableItems}) => {
    const fechaElegida = new Date(anio[0])
    const fechaActual = new Date()
    const anioElegido = fechaElegida.getFullYear()
    const mesElegido = fechaElegida.getMonth()+1
    const anioActual = fechaActual.getFullYear()
    const mesActual = fechaActual.getMonth()+1
    const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja()
    useEffect(() => {
        obtenerEgresosxFecha(id_enterprice, anio)
    }, [id_enterprice])
    useEffect(() => {
        obtenerIngresosxFecha(id_enterprice, anio)
    }, [])
    const dataAlter = fechas.map((f, index, array)=>{
        const dataGastos1272 = dataGastosxFecha.flujoxGrupo.flatMap(e=>e.parametro_grupo_gasto).filter(f=>f.id==1272 ).flatMap(e=>e.itemsxDia).filter(e=>e?.mes===f?.mes);
        const dataGast = dataGastosxFecha.flujoxGrupo.filter(f=>f.id!==97 && f.id!==110&& f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150 && f.id!==157 ).flatMap(e=>e.parametro_grupo_gasto).flatMap(e=>e.itemsxDia).filter(e=>e?.mes===f?.mes);
        const dataGasto = dataGastosxFecha.flujoxGrupo.filter(f=>f.id!==97 && f.id!==110 && f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150 && f.id!==157).flatMap(e=>e.itemsxDia).filter(e=>e?.mes===f?.mes).flatMap(e=>e.items);
        const dataGastoNoPagados = dataGastosxFecha.flujoxGrupo.filter(f=>f.id!==97 && f.id!==110&& f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150 && f.id!==157 ).flatMap(e=>e.itemsxDia).filter(e=>e?.mes===f?.mes).flatMap(e=>e.items).filter(f=>f.id_estado_gasto===1424);
        const dataGastoBolsa = dataGastosxFecha.flujoxGrupo.filter(f=>f.id===153).flatMap(e=>e.itemsxDia).filter(e=>e?.mes===f?.mes).flatMap(e=>e.items);
        const dataIngresos = dataIngresosxFecha.flujoxGrupo.filter(f=>f.grupo!=='PRESTAMOS A TERCEROS').filter(f=>f.id!==121).flatMap(e=>e.itemsxDia).filter(e=>e?.mes===f?.mes).flatMap(e=>e.items);
        const dataIngresosExcepcionales = dataIngresosxFecha.flujoxGrupo.filter(f=>f.id===121).flatMap(e=>e.itemsxDia).filter(e=>e?.mes===f?.mes).flatMap(e=>e.items);
        const cuotas = getQuotaParaMes(f?.mes, f.anio)?.meta
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
        const utilidadBruta = sumaGastos===0?0:sumaIngresos-(sumaProyectado+sumaGastos)
        const utilidadNeta = (sumaIngresos)-sumaGastos
        const utilidadUltimaLinea = ((utilidadBruta && sumaIngresos) && (utilidadBruta*100)/sumaIngresos)


        const bonoGerencia = (sumaIngresos-(sumaProyectado+sumaGastos))*0.05
        const utilidadPerdida_ultimaLinea = utilidadBruta<=0?utilidadBruta:sumaIngresos-(sumaProyectado+sumaGastos+sumagastos1272)
        return {
            ...f,
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
    const dataAlterMesCompleto = dataAlter.filter((f)=>`${f.anio}-${f?.mes}`!==`${anioActual}-${mesActual}`).map(f=>{
        return {
          ...f
        }
    })    
    const ingresosAcumulados = dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresos+total, 0)
    const utilidadBrutaTotal = dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresos+total, 0)-dataAlterMesCompleto.reduce((total, item)=>item.sumaGastos+total, 0)
    const utilidadNetaTotal = (dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresos+total, 0)+dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresosExcepcional+total, 0))-dataAlter.reduce((total, item)=>item.sumaGastos+total, 0)
    const utilidadBrutaTotalMESCOMPLETOExtraordinario = (dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresosExcepcional+total, 0))-dataAlterMesCompleto.reduce((total, item)=>item.sumaGastosBolsa+total, 0)
    const utilidadBrutaTotalExtraordinario = (dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresosExcepcional+total, 0))-dataAlterMesCompleto.reduce((total, item)=>item.sumaGastosBolsa+total, 0)
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
                      <td className={`text-center border-top-10  ${bgTotal} ${`${f?.mes}-${f.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`} style={{width: '270px'}}>{f.mesSTR}</td>
                      </React.Fragment>
                    )
                  })
                }
                <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '230px'}}>TOTAL <br/> ANUAL</th>
                <th className='text-center border-top-10 border-bottom-10 border-right-10' style={{width: '230px'}}>PROMEDIO <br/> MENSUAL <br/> ANUAL</th>
              </tr>
            </thead>
            <tbody>
              {
                id_enterprice!==800 && (
                  <tr>
                    <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>CUOTA</td>
                  {
                    dataAlter.map(e=>{
                      return (
                        <React.Fragment>
                          <td className={`text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}>
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
                          <td className={`text-end border-left-10 border-right-10 border-bottom-10 fs-1 text-center`}>
                  <div className='text-end' style={{fontSize: '30px'}}>
                    <NumberFormatMoney className='fs-1' amount={dataAlterMesCompleto.reduce((total, item)=>item.cuotas+total, 0)}/>
                  </div></td>
                          <td className={`text-end border-right-10 border-bottom-10 fs-1 text-center`}>
                            <div className='text-end' style={{fontSize: '30px'}}>
                    <NumberFormatMoney className='fs-1' amount={dataAlterMesCompleto.reduce((total, item)=>item.cuotas+total, 0)/encontrarFechas(anioElegido, dataAlter.filter(f=>f.sumaIngresos!=0).length)}/>
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
                        <td className={`text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}> <NumberFormatMoney className='fs-1' amount={e.sumaIngresos}/></td>
                      </React.Fragment>
                    )
                  })
                }
                <td className='border-left-10 border-right-10'>
                  <div className='text-end' style={{fontSize: '30px'}}>
                    <NumberFormatMoney className='fs-1' amount={dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresos+total, 0)}/>
                  </div>
                </td>
                <td className='border-right-10'>
                  <div className='text-end'>
                    <NumberFormatMoney className='fs-1' amount={dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresos+total, 0)/encontrarFechas(anioElegido, dataAlter.filter(f=>f.sumaIngresos!=0).length)}/>
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
                      <td onClick={()=>onOpenModalTableItems(e.dataGasto, dataGastosxFecha, e.mes, anio, true)} className={`text-change text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}> 
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
                              <div className='text-white'>
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
                    <NumberFormatMoney className='fs-1' amount={-dataAlterMesCompleto.reduce((total, item)=>item.sumaGastos+total, 0)}/>
                  </div>
                </td>
                <td className='border-right-10 '>
                  <div className='text-change text-end '>
                    <NumberFormatMoney className='fs-1' amount={-dataAlterMesCompleto.reduce((total, item)=>item.sumaGastos+total, 0)/encontrarFechas(anioElegido, dataAlter.filter(f=>f.sumaGastos!=0).length)}/>
                  </div>
                </td>
              </tr>
              <tr>
                <td className={`sticky-td border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>UTILIDAD / PERDIDA</td>
              {
                dataAlter.map(e=>{
                  return (
                    <React.Fragment>
                      <td className={`text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}> 
                        {
                              `${e?.mes}-${e.anio}`!==`${mesActual}-${anioActual}` && (
                                <div className={`${(e.sumaIngresos-(e.sumaGastos))>0?'text-ISESAC':'text-change'} `} >
                                  <NumberFormatMoney className='fs-1' amount={e.sumaIngresos-(e.sumaGastos)}/>
                                  <br/>
                                </div>
                              )
                        }
                        {
                              (`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` || `${e?.mes}-${e.anio}`===`${mesActual-1}-${anioActual}` && (e.sumaIngresos-(e.sumaProyectado+e.sumaGastos))!==(e.sumaIngresos-(e.sumaGastos))) && (
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
                    <NumberFormatMoney className='fs-1' amount={(dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresos+total, 0)-dataAlterMesCompleto.reduce((total, item)=>item.sumaGastos+total, 0))/encontrarFechas(anioElegido, dataAlter.filter(f=>f.sumaGastos!=0).length)}/>
                  </div>
                </td>
              </tr>
              <tr>
                <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>% Utilidad / Perdida</td>
              {
                dataAlter.map(e=>{
                  return (
                    <React.Fragment>
                      <td className={`text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}>
                        {
                              (`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}`&&`${e?.mes}-${e.anio}`===`${mesActual-1}-${anioActual}`) ? (
                                <div className={`${e.utilidadBruta>0?'text-orange':'text-orange'} `} >
                                  <NumberFormatMoney className='fs-1' amount={
                                    e.utilidadUltimaLinea
                                    }/>
                                  </div>
                              ): (
                                <div className={`fs-1 ${e.utilidadUltimaLinea>0?'text-ISESAC':'text-change'}`}>{(e.utilidadUltimaLinea).toFixed(2)}</div>
                              )
                        }
                      </td>
                    </React.Fragment>
                    )
                  })
                }
                  <td className={`text-end border-left-10 border-right-10`}><div className={`${(utilidadNetaTotal/ingresosAcumulados)>0?'text-ISESAC':'text-change'}`}><NumberFormatMoney className='fs-1' amount={(utilidadNetaTotal&&ingresosAcumulados)&&((utilidadNetaTotal*100)/ingresosAcumulados)}/></div></td>
                  <td className={`text-end border-right-10`}><div className={`${(utilidadNetaTotal&&ingresosAcumulados)&&(utilidadNetaTotal/ingresosAcumulados)>0?'text-ISESAC':'text-change'}`}><NumberFormatMoney className='fs-1' amount={((utilidadNetaTotal&&ingresosAcumulados)&&((utilidadNetaTotal*100)/ingresosAcumulados))}/></div></td>
              </tr> 
              {
                id_enterprice!==800 && (
                  <tr>
                    <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>BONO GERENCIAS TRIMESTRAL <br/> (3% UTILIDAD ULTIMA LINEA)</td>
                  {
                    dataAlter.map(e=>{
                      return (
                        <React.Fragment>
                          <td className={`text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}>
                            {
                                <NumberFormatMoney  amount={e.sumagastos1272} className='fs-1'/>
                            }
                          </td>
                        </React.Fragment>
                        )
                      })
                    }
                          <td className={`text-end border-left-10 border-right-10`}>
                      <div className={`${utilidadBrutaTotal>0?'text-change':'text-change'} text-end`} ><NumberFormatMoney className={'fs-1'} amount={dataAlterMesCompleto.reduce((total, item)=>item.sumagastos1272+total, 0)}/></div>
                          </td>
                          <td className={`text-end border-right-10`}>
                            <div className={`${utilidadBrutaTotal>0?'text-change':'text-change'}`}>
                              <NumberFormatMoney className={'fs-1'} amount={((dataAlterMesCompleto.reduce((total, item)=>item.sumagastos1272+total, 0))/encontrarFechas(anioElegido, dataAlter.filter(f=>f.sumaGastos!=0).length))*0.03}/>
                            </div>
                          </td>
                  </tr>
                )
              }
              <tr>
                <td className={`sticky-td border-left-10 border-right-10 border-bottom-10 sticky-td-${id_enterprice} ${bgTotal}`}>UTILIDAD / PERDIDA <br/>ULTIMA LINEA</td>
              {
                dataAlter.map(e=>{
                  const bonoGerencia = (e.sumaIngresos-(e.sumaProyectado+e.sumaGastos))*0.03
                  return (
                    <React.Fragment>
                      <td className={`text-end border-bottom-10  ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}> 
                        {
                              `${e?.mes}-${e.anio}`!==`${mesActual}-${anioActual}` && (
                                <div className={`${e.utilidadPerdida_ultimaLinea>0?'text-ISESAC':'text-change'} `} >
                                  <NumberFormatMoney className='fs-1' amount={e.utilidadPerdida_ultimaLinea}/>
                                </div>
                              )
                        }
                        {
                              `${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && (
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
                <td className='border-left-10 border-right-10 border-bottom-10 '>
                  <div className={`${utilidadBrutaTotal>0?'text-ISESAC':'text-change'} text-end`} >
                    <NumberFormatMoney className='fs-1' amount={
                      -(dataAlterMesCompleto.reduce((total, item)=>item.sumagastos1272+total, 0))
                      +(dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresos+total, 0)-dataAlterMesCompleto.reduce((total, item)=>item.sumaGastos+total, 0))
                      }/></div>
                </td>
                <td className='border-right-10 border-bottom-10 '>
                  <div className={`${utilidadBrutaTotal>0?'text-ISESAC':'text-change'} text-end`}>
                    <NumberFormatMoney className='fs-1' amount={
                      (-(dataAlterMesCompleto.reduce((total, item)=>item.sumagastos1272+total, 0))
                      +(dataAlterMesCompleto.reduce((total, item)=>item.sumaIngresos+total, 0)-dataAlterMesCompleto.reduce((total, item)=>item.sumaGastos+total, 0)))/encontrarFechas(anioElegido, dataAlterMesCompleto.filter(f=>f.sumaGastos!=0).length)}/>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
          {
            id_enterprice!==800 && (
              <div className='text-orange'>
                <Table className="tabla-egresos fs-3" style={{ width: '100%' }} bordered>
                  <thead>
                    <tr>
                      <th style={{width: '500px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white`}><div className='text-black'>{''}</div></th>
                      {
                      fechas.map(f=>{
                        return (
                          <React.Fragment key={`${f?.mes}`}>
                          <td className={`text-center ${bgTotal} ${`${f?.mes}-${f.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`} style={{width: '270px'}}>{f.mesSTR}</td>
                          </React.Fragment>
                        )
                      })
                    }
                      <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '230px'}}>TOTAL <br/> ANUAL</th>
                      <th className='text-center border-top-10 border-bottom-10 border-right-10' style={{width: '230px'}}>PROMEDIO <br/> MENSUAL <br/> ANUAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>BONO GERENCIAS TRIMESTRAL <br/>
(3% UTILIDAD ULTIMA LINEA)</td>
                    {
                      dataAlter.map(e=>{
                        return (
                          <React.Fragment>
                            {/* <td className={`text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}><div> <NumberFormatMoney className='fs-2' amount={e.utilidadBolsa+utilidadPerdida}/></div></td> */}
                            <td className={`text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}> 
                            {
                                  `${e?.mes}-${e.anio}`!==`${mesActual}-${anioActual}` && (
                                    <div>
                                      <NumberFormatMoney className='fs-1' amount={-e.sumagastos1272}/>
                                    </div>
                                  )
                            }
                            {
                                  `${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && (
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
                            <td className={`text-end border-right-10`}><div> <NumberFormatMoney className='fs-1' amount={utilidadBrutaTotalMESCOMPLETOExtraordinario/encontrarFechas(anioElegido,dataAlter.filter(f=>f.sumaGastosBolsa!=0).length)}/></div></td>
                    </tr> 
                    <tr>
                      <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}>BONO GERENCIAS TRIMESTRAL <br/>(3% UTILIDAD ULTIMA LINEA)<br/><span className='fs-1'>PROYECTADO</span></td>
                    {
                  dataAlter.map(e=>{
                    const bonoGerencia = (e.utilidadBruta-(dataAlterMesCompleto.reduce((total, item)=>item.sumaGastos+total, 0)/encontrarFechas(anioElegido, dataAlter.filter(f=>f.sumaGastos!=0).length)-e.sumaGastos))*0.05
                    const utilidadPerdida = e.utilidadBruta<=0?e.utilidadBruta:e.sumaIngresos-(e.sumaProyectado+e.sumaGastos+bonoGerencia)
                    return (
                      <React.Fragment>
                        <td className={`text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`}> 
                          {
                                `${e?.mes}-${e.anio}`!==`${mesActual}-${anioActual}` && (
                                  <div className={`${(e.utilidadBruta-bonoGerencia)>0?'text-orange':'text-change'}`}>
                                    <NumberFormatMoney className='fs-1' amount={(e.utilidadBruta-e.sumagastos1272)*0.03}/>
                                  </div>
                                )
                          }
                          {
                                `${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && (
                                  <div className='text-orange'>
                                    <NumberFormatMoney 
                                    className='fs-1'
                                      amount=
                                      {utilidadPerdida}/></div>
                                )
                          }
                        </td>
                      </React.Fragment>
                      )
                    })
                  }
                            <td className={`text-end border-left-10 border-right-10`}><div> <NumberFormatMoney className='fs-2' amount={utilidadBrutaTotalExtraordinario}/></div></td>
                            <td className={`text-end border-right-10`}><div> <NumberFormatMoney className='fs-2' amount={utilidadBrutaTotalMESCOMPLETOExtraordinario/encontrarFechas(anioElegido,dataAlter.filter(f=>f.sumaGastosBolsa!=0).length)}/></div></td>
                    </tr> 
                  </tbody>
                </Table>
              </div>
            )
          }
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
                          <td className={`text-center ${bgTotal} ${`${f?.mes}-${f.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`} style={{width: '270px'}}>{f.mesSTR}</td>
                          </React.Fragment>
                        )
                      })
                    }
                    <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '230px'}}>TOTAL <br/> ANUAL</th>
                    <th className='text-center border-top-10 border-bottom-10 border-right-10' style={{width: '230px'}}>PROMEDIO <br/> MENSUAL <br/> ANUAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={`border-left-10 border-right-10 sticky-td-${id_enterprice} ${bgTotal}`}></td>
                    {
                    dataAlter.map(e=>{
                      return (
                        <React.Fragment>
                          <td className={`text-end ${`${e?.mes}-${e.anio}`===`${mesActual}-${anioActual}` && `bg-${id_enterprice}-pastel`}`} onClick={()=>onOpenModalTableItems(e.dataGastoNoPagados, dataGastosxFecha, e.mes, anio, true)}>
                            <div className='text-change'>
                              <NumberFormatMoney amount={e.sumaNoPagados}/>
                            </div>
                          </td>
                        </React.Fragment>
                        )
                      })
                    }
                    <td className={`text-end border-left-10 border-right-10`}> 
                      <div className='text-change'>
                        <NumberFormatMoney amount={-dataAlter.reduce((total, item)=>item.sumaNoPagados+total, 0)}/>
                      </div>

                      </td>
                    
                    <td className='border-right-10'>
                      <div className={`text-end`}>
                        <NumberFormatMoney amount={dataAlterMesCompleto.reduce((total, item)=>item.sumaNoPagados+total, 0)/encontrarFechas(anioElegido,dataAlter.filter(f=>f.sumaNoPagados!=0).length)}/>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            )
          }
        </>
  )
}

function encontrarFechas(anio, a=0) {
  const hoy = new Date()
  // Año actual
const year = hoy.getFullYear();
// console.log({asdf: a});

// Mes actual (0 = enero, 11 = diciembre)
const month = hoy.getMonth();
const ultimaFecha = new Date(year, month , 0);
const diaUltimaFecha = ultimaFecha.getDate()
const diaActual = hoy.getDate()
if(anio===year){
  return diaActual==diaUltimaFecha?0:month;
}else{
  // if(anio===2024){
  //   return a
  // }
  return 12;
}
}


const getQuotaParaMes = (monthIndex, year) => {
  const y = year;
  const m = monthIndex;
  switch (`${m}-${y}`) {
    case "7-2026":
      return {
        meta: 100000,
      };
    case "6-2026":
      return {
        meta: 90000,
      };
    case "5-2026":
      return {
        meta: 80000,
      };
    case "4-2026":
      return {
        meta: 90000,
      };
    case "3-2026":
      return {
        meta: 100000,
      };
    case "2-2026":
      return {
        meta: 90000,
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
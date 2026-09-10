import { NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import React from 'react'
import { Table } from 'react-bootstrap';

// Conceptos que se resaltan con bgPastel en la columna de nombre y en las celdas de cada mes
const CONCEPTOS_PASTEL = [1272]
// Conceptos que se resaltan en blanco (columna fija) en vez del color de la empresa
const CONCEPTOS_DESTACADOS_BLANCO = [941, 1117, 1046, 1285, 1134, 1247, 1251, 1271, 1124]

export const DataTablePrincipal = ({anio, cat='', id_empresa, sumaTotal, itemsxDias=[], conceptos=[], fechas=[], nombreGrupo='', index='', bgTotal, bgPastel, onOpenModalTableItems, data=[]}) => {
  const fecha = new Date()
  const anioActual = fecha.getFullYear()
  const mesActual = fecha.getMonth()+1

  const sumaMontototal = conceptos.reduce((total, item)=>item?.monto+total, 0)
  const sumaLentotal = conceptos.reduce((total, item)=>item?.len+total, 0)

  const funSumaTotal = (mes)=>{
    return conceptos.flatMap(f=>f.itemsxDia).filter(f=>f.mes===mes).reduce((total, item)=>total+item.monto, 0)
  }
  const funSumaTotalProyectado = (mes)=>{
    return conceptos.flatMap(f=>f.itemsxDia).filter(f=>f.mes===mes).reduce((total, item)=>total+item.monto_proyectado, 0)
  }
  const funSumatoriaFinal = (mes=1)=>{
    return data.flatMap(f=>f.itemsxDia).filter(f=>f.mes===mes).reduce((total, item)=>total+item.monto, 0)
  }

  // Un mes se contabiliza en TOTAL ANUAL / PROMEDIO solo si ya terminó: año anterior al actual,
  // o año actual con un mes anterior al actual (el mes en curso y los futuros no cuentan)
  const esMesContabilizado = (mes) => anio<anioActual || (anio===anioActual && mes<mesActual)

  const getPrimeraColumnaClass = (idConcepto) => {
    if (CONCEPTOS_DESTACADOS_BLANCO.includes(idConcepto)) return `sticky-td-${id_empresa}-white`
    return ''
  }
  const getEtiquetaConceptoClass = (idConcepto) => {
    if (CONCEPTOS_PASTEL.includes(idConcepto)) return 'text-black'
    if (CONCEPTOS_DESTACADOS_BLANCO.includes(idConcepto)) return 'bg-white text-black'
    return ''
  }
  const getCeldaMesClass = (idConcepto, mes) => (idConcepto===1124 || !esMesContabilizado(mes)) ?? ''

  return (
    <>
      <Table className="tabla-egresos fs-3" style={{ width: '100%' }} bordered>
        <thead>
          <tr>
            <th style={{width: '500px'}} className={`text-break fs-1 border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white sticky-td-${id_empresa}-white text-black`}>{index}. {nombreGrupo}</th>
            {
              fechas.map(f=>(
                <React.Fragment key={f.mesStr}>
                  <td className={`text-center border-black border-top-10 ${bgTotal}`} style={{width: '180px'}}>{dayjs(`${f.anio}-${f.mes}-1`, 'YYYY-M-D').format('MMM [.]')}</td>
                  <td className={`text-center border-black border-top-10 ${bgPastel}`} style={{width: '90px'}}>MOV.</td>
                </React.Fragment>
              ))
            }
            <th className={`text-center border-top-10 border-left-10 border-bottom-10 sticky-td-1-right-${id_empresa}`} style={{width: '200px'}}>TOTAL <br/> ANUAL</th>
            <th className='text-center border-top-10 border-bottom-10' style={{width: '200px'}}>MOV. <br/> ANUAL</th>
            <th className='text-center border-top-10 border-bottom-10' style={{width: '120px'}}>%<br/>PART. <br/> ANUAL</th>
            <th className={`text-center border-top-10 border-right-10 border-bottom-10 sticky-td-right-${id_empresa}`} style={{width: '200px'}}>PROMEDIO<br/>MENSUAL <br/> ANUAL</th>
          </tr>
        </thead>
        <tbody>
          {
            conceptos
              .sort((a, b)=>a.orden-b.orden)
              .filter(f=>f.monto_proyectado!==0 || f.monto!==0)
              .map((c, i)=>{
                const mesesContabilizados = c.itemsxDia?.filter(f=>esMesContabilizado(f.mes)) ?? []
                const totalAnual = mesesContabilizados.reduce((total, im)=>total+im?.monto, 0)
                const mesesConMovimiento = mesesContabilizados.filter(f=>f.monto!==0).length
                const promedioMensual = totalAnual/mesesConMovimiento
                const totalLen = c.itemsxDia?.reduce((total, im)=>total+im?.len, 0)
                const totalMonto = c.itemsxDia?.reduce((total, im)=>total+im?.monto, 0)
                const porcentajeParticipacion = (totalMonto/sumaMontototal)*100
                const esDestacado = CONCEPTOS_DESTACADOS_BLANCO.includes(c.id)
                const textoGrisDestacado = esDestacado ? 'text-gray' : ''

                return (
                  <tr key={''}>
                    <td className={`border-left-10 border-right-10 ${bgTotal} sticky-td-${id_empresa} ${getPrimeraColumnaClass(c.id)}`}>
                      <span className={getEtiquetaConceptoClass(c.id)}>
                        {i+1}. {c.nombre_gasto}
                      </span>
                    </td>
                    {
                      c.itemsxDia.map(m=>(
                        <React.Fragment key={m.id}>
                          <td className={`text-center ${(m.monto===0 && m.monto_proyectado===0) ? 'text-gray' : ''} ${getCeldaMesClass(c.id, m.mes)} ${textoGrisDestacado}`}>
                            {m.mesSTR}
                            <div>
                              {
                                (m.monto_pagados!==0 || m.monto_no_pagados===0) && (
                                  <>
                                    <span onClick={()=>onOpenModalTableItems(m.items_pagados)}>
                                      <NumberFormatMoney amount={m.monto_pagados}/>
                                    </span>
                                    <br/>
                                  </>
                                )
                              }
                              {
                                m.monto_no_pagados>0 && (
                                  <>
                                    <span className={`text-change ${textoGrisDestacado}`} onClick={()=>onOpenModalTableItems(m.itemsNoPagados)}>
                                      <NumberFormatMoney amount={m.monto_no_pagados}/>
                                    </span>
                                    <br/>
                                  </>
                                )
                              }
                              {
                                m.monto_proyectado!=0 && nombreGrupo!=='INGRESOS' && (
                                  <span className={`text-orange ${textoGrisDestacado}`}>
                                    <NumberFormatMoney amount={m.monto_proyectado}/>
                                  </span>
                                )
                              }
                            </div>
                          </td>
                          <td className={`${m.monto_pagados===0 && 'text-gray'} text-center ${getCeldaMesClass(c.id, m.mes)} ${textoGrisDestacado}`}>
                            <div>{m.len}</div>
                          </td>
                        </React.Fragment>
                      ))
                    }
                    <td className={`text-center border-left-10 sticky-td-1-right-${id_empresa} sticky-td-${id_empresa}-white ${textoGrisDestacado}`}>
                      <NumberFormatMoney amount={totalAnual}/>
                    </td>
                    <td className={`fs-3 text-center ${textoGrisDestacado}`}>{totalLen}</td>
                    <td className={`fs-3 text-center ${textoGrisDestacado}`}>{porcentajeParticipacion.toFixed(2)} %</td>
                    <td className={`text-center border-right-10 sticky-td-right-${id_empresa} sticky-td-${id_empresa}-white ${textoGrisDestacado}`}>
                      <NumberFormatMoney amount={promedioMensual}/>
                    </td>
                  </tr>
                )
              })
          }
          <tr>
            <td className={`sticky-td-${id_empresa} border-left-10 border-right-10 ${bgTotal}`}>TOTAL</td>
            {
              fechas.map((f, i)=>(
                <React.Fragment key={i}>
                  <td className={`text-center ${bgTotal}`} style={{width: '120px'}}>
                    <NumberFormatMoney amount={funSumaTotal(f.mes)}/>
                    <br/>
                    {
                      funSumaTotalProyectado(f.mes)!==0 && (
                        <div className='text-orange bg-white'>
                          <NumberFormatMoney amount={funSumaTotalProyectado(f.mes)}/>
                        </div>
                      )
                    }
                  </td>
                  <td className={`text-center ${bgPastel}`} style={{width: '120px'}}>
                    {funSumaTotal(f.mes)?.len}
                  </td>
                </React.Fragment>
              ))
            }
            <th colSpan={2} className={`text-center fs-2 ${bgTotal} border-left-10 border-right-10 sticky-td-right-598`}>TOTAL ANUAL</th>
          </tr>
          <tr>
            <td className={`sticky-td-${id_empresa} border-left-10 border-right-10 border-bottom-10 ${bgTotal}`}>% <span className='mx-1'></span> PARTICIPACION</td>
            {
              fechas.map((f, i)=>(
                <React.Fragment key={i}>
                  <td className={`text-center border-bottom-10 ${bgTotal}`} style={{width: '120px'}}>
                    <NumberFormatMoney amount={(funSumaTotal(f.mes)/funSumatoriaFinal(f.mes))*100}/> %
                  </td>
                  <td className={`text-center border-bottom-10 ${bgPastel}`} style={{width: '120px'}}></td>
                </React.Fragment>
              ))
            }
            <td className={`text-end border-bottom-10 border-left-10 sticky-td-1-right-${id_empresa} text-white`}>
              <NumberFormatMoney className='fs-2' amount={sumaMontototal}/>
            </td>
            <td className='fs-2 text-end border-bottom-10'>{sumaLentotal}</td>
            <td className='fs-2 text-center border-bottom-10'>100 %</td>
            <td className={`fs-2 text-center border-bottom-10 border-right-10 sticky-td-right-${id_empresa} text-white`}>
              <NumberFormatMoney className='fs-2' amount={sumaMontototal/8}/>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}

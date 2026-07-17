import { FUNMoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import React from 'react'
import { Table } from 'react-bootstrap';

export const  DataTablePrincipal2 = ({anio, id_empresa, sumaTotal, itemsxDias=[], conceptos=[], fechas=[], nombreGrupo='', index='', bgTotal, bgPastel, onOpenModalTableItems, data=[]}) => {
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
  return (
    <>
      <Table className="tabla-egresos fs-3" style={{ width: '100%' }} bordered>
        <thead>
          <tr>
            <th style={{width: '500px'}} className={` text-break fs-1 border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white sticky-td-${id_empresa}-white text-black `}>{index}. {nombreGrupo==='GAS / MANTENIMIENTO Y MOVILIDADES'?<>GAS<br/> MANTENIMIENTO<br/> MOVILIDADES</>:(nombreGrupo)}</th>
            {
              fechas.map(f=>{
                return (
                  <React.Fragment key={`${f.mesStr}`}>
                  <td className={`text-center border-black ${bgTotal}`} style={{width: '180px'}}>{dayjs(`${f.anio}-${f.mes}-1`, 'YYYY-M-D').format('MMM [.]')}</td>
                  <td className={`text-center border-black ${bgPastel}`} style={{width: '90px'}}>MOV.</td>
                  </React.Fragment>
                )
              })
            }
            <th className='text-center border-top-10 border-left-10 border-bottom-10' style={{width: '200px'}}>TOTAL <br/> ANUAL</th>
            <th className='text-center border-top-10 border-bottom-10' style={{width: '120px'}}>MOV. <br/> ANUAL</th>
            <th className='text-center border-top-10 border-bottom-10' style={{width: '120px'}}>%<br/>PART. <br/> ANUAL</th>
            <th className='text-center border-top-10 border-right-10 border-bottom-10' style={{width: '200px'}}>PROMEDIO<br/>MENSUAL <br/> ANUAL</th>
          </tr>
        </thead>
        <tbody>
          {
            conceptos.sort((a, b)=>a.orden-b.orden).filter(f=>f.monto_proyectado!==0 || f.monto!==0).map((c, i)=>{
              return (
                <tr key={''}>
                  <td className={`sticky-td-${id_empresa} border-left-10 border-right-10 ${bgTotal}`}>
                    {c.id}. {(c.nombre_gasto)}
                  </td>
                  {
                    c.itemsxDia.map(m=>{
                      return (
                        <React.Fragment key={m.id}>
                          <td className='text-center'>
                            <div >
                              {
                                (m.monto_pagados!==0 || m.monto_no_pagados===0) &&
                                (
                                  <>
                                  <span onClick={()=>onOpenModalTableItems(m.items_pagados)}>
                                    <NumberFormatMoney
                                      amount=
                                      {m.monto_pagados}
                                    /> 
                                  </span>
                                  <br/>
                                  </>
                                )
                              }
                              {

                              }
                              {
                                m.monto_no_pagados>0 && (
                                  <>
                                  <span className='text-change' onClick={()=>onOpenModalTableItems(m.itemsNoPagados)}>
                                    <NumberFormatMoney
                                      amount=
                                      {m.monto_no_pagados}
                                    /> 
                                  </span>
                                </>
                                )
                              }
                              { 
                              ((m.monto_proyectado)!=0) && nombreGrupo!=='INGRESOS'
                              &&
                               (
                                <>
                                    <span className='text-orange'>
                                      <NumberFormatMoney
                                        amount=
                                        {m.monto_proyectado}
                                      />
                                    </span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className={`${m.monto_pagados===0 && 'text-gray'} text-center`}>
                            <div>
                              {m.len}
                            </div>
                          </td>
                        </React.Fragment>
                      )
                    })
                  }
                <td className='text-center border-left-10'>
                  <NumberFormatMoney amount={c.itemsxDia?.reduce((total, im)=>total+im?.monto, 0)}/>
                  </td>
                <td className='fs-3 text-center'>{c.itemsxDia?.reduce((total, im)=>total+im?.len, 0)}</td>
                <td className='fs-3 text-center'>{(((c.itemsxDia?.reduce((total, im)=>total+im?.monto, 0))/sumaMontototal)*100).toFixed(2)}</td>
                <td className='text-center border-right-10'>
                  <NumberFormatMoney amount={c.itemsxDia?.filter(f=>f.mes<=mesActual-1).reduce((total, im)=>total+im?.monto, 0)/Number(mesActual-1)}/>
                  </td>
                </tr>
              )
            })
          }
          <tr>
            <td className={`sticky-td-${id_empresa} border-left-10 border-right-10 ${bgTotal}`}>TOTAL</td>
            {
              fechas.map((f, i)=>{
                return (
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
                )
              })
            }
            <td colSpan={4} className={`text-center fs-2 ${bgTotal} border-left-10 border-right-10`}>TOTAL ANUAL</td>
          </tr>
          <tr>
            <td className={`sticky-td-${id_empresa} border-left-10 border-right-10 border-bottom-10 ${bgTotal}`}>% <span className='mx-1'></span> PARTICIPACION</td>
            {
              fechas.map((f, i)=>{
                return (
                  <React.Fragment key={i}>
                  <td className={`text-center ${bgTotal}`} style={{width: '120px'}}>
                    <NumberFormatMoney amount={(funSumaTotal(f.mes)/funSumatoriaFinal(f.mes))*100}/>
                  </td>
                  <td className={`text-center ${bgPastel}`} style={{width: '120px'}}>
                  </td>
                  </React.Fragment>
                )
              })
            }
            <td className='text-end border-bottom-10 border-left-10'>
              <NumberFormatMoney
              className='fs-2'
                amount={
                  sumaMontototal
                }
              />
            </td>
            <td className='fs-2 text-end border-bottom-10'>{sumaLentotal}</td>
            <td className='fs-2 text-center border-bottom-10'>{'100'}</td>
            <td className='fs-2 text-center border-bottom-10 border-right-10'><NumberFormatMoney className='fs-2' amount={sumaMontototal/dataTotalFormular(anio)}/></td>
          </tr>
        </tbody>
      </Table>

    </>
  )
}
function dataTotalFormular(anio=2024) {
    const hoy = new Date()
  // Año actual
const year = hoy.getFullYear();

// Mes actual (0 = enero, 11 = diciembre)
const month = hoy.getMonth()+ 1;
const ultimaFecha = new Date(year, month , 0);
const diaUltimaFecha = ultimaFecha.getDate()
const diaActual = hoy.getDate()
if(anio===year){
  return diaActual==diaUltimaFecha?0:month-1;
}else{
  return 12;
}
}

import { FUNMoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import React from 'react'
import { Table } from 'react-bootstrap';

export const DataTablePrincipal = ({data=[], anio, id_empresa, itemsxDias=[], conceptos=[], fechas=[], nombreGrupo='', index='', bgTotal, bgPastel, onOpenModalTableItems}) => {
  const fecha = new Date()
  const anioActual = fecha.getFullYear()
  const mesActual = fecha.getMonth()+1
  const dataAlter = fechas.map((f, index, array)=>{
      const dataTotal = itemsxDias.find(i=>i.mes===f.mes && i.anio===f.anio)??{}
      const dataPagadas = dataTotal.items?.filter(e=>e?.id_estado_gasto===1423) || [];
      const dataNoPagadas = dataTotal.items?.filter(e=>e?.id_estado_gasto===1424) || [];
      const data =  [...dataPagadas, ...dataNoPagadas]
    return {
        ...f,
        // items: conceptos.flatMap(grupo => grupo.items).filter(i=>i.mes===f.mes && i.anio===f.anio),
        mesStr: dayjs(`${f.anio}-${f.mes}-1`, 'YYYY-M-D').format('MMM [.]'),
        dataTotalPagadas: dataPagadas||[],
        montoTotalPagadas: ( dataPagadas?.reduce((total, item)=>total+item?.monto, 0)||0),
        data: data,
        dataSumaMontos: data.reduce((total, item)=>total+item?.monto, 0)||0,
        dataSumaCantidad : data.length,
        cantidadTotalPagadas: dataPagadas?.length ||0,
        dataTotalNoPagadas: dataNoPagadas||[],
        montoTotalNoPagadas: (dataNoPagadas?.reduce((total, item)=>total+item?.monto, 0)||0),
        cantidadTotalNoPagadas: dataNoPagadas?.length ||0,
    }
  })
  
  const montoAcumuladoDeMontoTotal = dataAlter.reduce((total, item)=>total+item?.dataSumaMontos, 0)
  const montoAcumuladoDecantidadTotal = dataAlter.reduce((total, item)=>total+item?.dataSumaCantidad, 0)
  const dataFilter = dataAlter.filter(f=>f.data?.length !== 0).length
  return (
    <>
      <Table className="tabla-egresos fs-3" style={{ width: '100%' }} bordered>
        <thead>
          <tr>
            <th style={{width: '500px'}} className={` text-break fs-1 border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white sticky-td-${id_empresa}-white text-black `}>{index}. {nombreGrupo==='GAS / MANTENIMIENTO Y MOVILIDADES'?<>GAS<br/> MANTENIMIENTO<br/> MOVILIDADES</>:buscarPuntosYPonerTransparente(nombreGrupo)}</th>
            {
              dataAlter.map(f=>{
                return (
                  <React.Fragment key={`${f.mesStr}`}>
                  <td className={`text-center border-black ${bgTotal}`} style={{width: '180px'}}>{f.mesStr}</td>
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
          { conceptos.map((c, i)=>{
            return (
              <tr key={`${i}-${c.concepto}`}>
                <td className={`sticky-td-${id_empresa} border-left-10 border-right-10 ${bgTotal}`}>{i+1}. {buscarPuntosYPonerTransparente(c.concepto)}</td>
                {
                    dataAlter.map((f, i)=>{
                      
                      const itemsDelMesFiltrado1423= c.items?.find(m=>m.mes===f.mes && m.anio===f.anio)?.items?.filter(e=>e.id_estado_gasto===1423)
                      const itemsDelMesFiltrado1424= c.items?.find(m=>m.mes===f.mes && m.anio===f.anio)?.items?.filter(e=>e.id_estado_gasto===1424)
                      const sumaMontoMensual = FUNMoneyFormatter(itemsDelMesFiltrado1423?.reduce((total, im)=>total+im?.monto, 0))
                      const sumaCantidadMensual = itemsDelMesFiltrado1423?.length
                      const sumaMontoMensual1424 = FUNMoneyFormatter(itemsDelMesFiltrado1424?.reduce((total, im)=>total+im?.monto, 0))
                      const sumaCantidadMensual1424 = itemsDelMesFiltrado1424?.length
                    return (
                      <React.Fragment key={`${i}`}>
                      <td className='text-center' >
                        <div >
                          {
                            (sumaMontoMensual!=='0.00' || sumaMontoMensual1424==='0.00') && (
                              <div 
                              className='text-center'
                              onClick={()=>onOpenModalTableItems(itemsDelMesFiltrado1423)}
                              >
                              {sumaMontoMensual}
                              <br/>
                              {`${f.anio}-${f.mes}` ===`${anioActual}-${mesActual}` && (c.data?.reduce((total, im)=>total+im?.monto, 0)/dataTotalFormular(anio, dataAlter))>sumaMontoMensual && (
                                <div className='text-orange'>
                                  <NumberFormatMoney 
                                  amount={(c.data?.reduce((total, im)=>total+im?.monto, 0)/dataTotalFormular(anio, dataAlter))-sumaMontoMensual}/>
                                </div>
                              )
                              }
                                <br/> 
                              </div>
                            )
                          }
                          <div className='text-change' onClick={()=>onOpenModalTableItems(itemsDelMesFiltrado1424)}>
                            
                            {sumaMontoMensual1424!=='0.00'&&sumaMontoMensual1424}
                          </div>
                        </div>
                      </td>
                      <td className='text-center'>
                        <div>
                          {
                            (sumaCantidadMensual!==0 || sumaCantidadMensual1424===0) && (
                              <>
                              {sumaCantidadMensual||0}
                                <br/> 
                              </>
                            )
                          }
                          <div className='text-change' onClick={()=>onOpenModalTableItems(itemsDelMesFiltrado1424)}>
                            
                            {sumaMontoMensual1424!=='0.00'&&sumaCantidadMensual1424}
                          </div>
                        </div>
                      </td>
                      </React.Fragment>
                    )
                  })
                }
                <td className='text-end border-left-10'><NumberFormatMoney amount={c.data?.reduce((total, im)=>total+im?.monto, 0)}/></td>
                <td className='fs-3 text-end'>{c.data.length}</td>
                <td className='fs-3 text-end'>{(((c.data?.reduce((total, im)=>total+im?.monto, 0))/montoAcumuladoDeMontoTotal)*100).toFixed(2)}</td>
                <td className='text-end border-right-10'>
                  <NumberFormatMoney amount={c.data?.reduce((total, im)=>total+im?.monto, 0)/dataTotalFormular(anio, dataAlter)}/>
                  </td>
              </tr>
            )
          })
          }
          <tr>
            <td className={`sticky-td-${id_empresa} border-left-10 border-right-10 ${bgTotal}`}>TOTAL</td>
            {
              dataAlter.map((f, i)=>{
                return (
                  <React.Fragment key={i}>
                  <td className={`text-center ${bgTotal}`} style={{width: '120px'}}>
                    <NumberFormatMoney amount={f.montoTotalPagadas +f.montoTotalNoPagadas}/>
                  </td>
                  <td className={`text-center ${bgPastel}`} style={{width: '120px'}}>
                    {f.dataSumaCantidad}

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
              dataAlter.map((f, i)=>{
                return (
                  <React.Fragment key={i}>
                  <td className={`text-center ${bgTotal}`} style={{width: '120px'}}><NumberFormatMoney amount={(f.montoTotalPagadas/montoAcumuladoDeMontoTotal)*100}/></td>
                  <td className={`text-center ${bgPastel}`} style={{width: '120px'}}>{((f.cantidadTotalPagadas/montoAcumuladoDecantidadTotal)*100).toFixed(2) && 0}</td>
                  </React.Fragment>
                )
              })
            }
            <td className='text-end border-bottom-10 border-left-10'>
              <NumberFormatMoney
              className='fs-2'
                amount={
                  dataAlter.reduce((total, item)=>item.montoTotalPagadas+item.montoTotalNoPagadas+total, 0)
                }
              />
            </td>
            <td className='fs-2 text-end border-bottom-10'>{dataAlter.reduce((total, item)=>item.dataSumaCantidad+total, 0)}</td>
            <td className='fs-2 text-center border-bottom-10'>{'100'}</td>
            <td className='fs-2 text-center border-bottom-10 border-right-10'><NumberFormatMoney className='fs-2' amount={dataAlter.reduce((total, item)=>item.montoTotalPagadas+item.montoTotalNoPagadas+total, 0)/dataTotalFormular(anio, dataAlter)}/></td>
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

function buscarPuntosYPonerTransparente(txt='') {
  return txt.split(/(\.+)/g).map((parte, i) => {
    if (parte.startsWith(".")) {
      return (
        <span key={i} style={{ visibility: "hidden" }}>
          {parte}
        </span>
      );
    }
    return <span key={i}>{parte}</span>;
  });
  
}
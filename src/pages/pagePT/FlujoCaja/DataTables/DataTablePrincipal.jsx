import { FUNMoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import React from 'react'
import { Table } from 'react-bootstrap';

export const DataTablePrincipal = ({data=[], id_empresa, itemsxDias=[], conceptos=[], fechas=[], nombreGrupo='', index='', bgTotal, bgPastel, onOpenModalTableItems}) => {
  const dataAlter = fechas.map((f, index, array)=>{
      const dataTotal = itemsxDias.find(i=>i.mes===f.mes && i.anio===f.anio)??{}
      const dataPagadas = dataTotal.items?.filter(e=>e?.id_estado_gasto===1423) || [];
      const dataNoPagadas = dataTotal.items?.filter(e=>e?.id_estado_gasto===1424) || [];
    return {
        ...f,
        // items: conceptos.flatMap(grupo => grupo.items).filter(i=>i.mes===f.mes && i.anio===f.anio),
        mesStr: dayjs(`${f.anio}-${f.mes}-1`, 'YYYY-M-D').format('MMM [.]'),
        dataTotalPagadas: dataPagadas||[],
        montoTotalPagadas: ( dataPagadas?.reduce((total, item)=>total+item?.monto, 0)||0),
        cantidadTotalPagadas: dataPagadas?.length ||0,
        dataTotalNoPagadas: dataNoPagadas||[],
        montoTotalNoPagadas: (dataNoPagadas?.reduce((total, item)=>total+item?.monto, 0)||0),
        cantidadTotalNoPagadas: dataNoPagadas?.length ||0,
    }
  })
  console.log({dataAlter, conceptos});
  
  const montoAcumuladoDeMontoTotal = dataAlter.reduce((total, item)=>total+item?.montoTotalPagadas, 0)
  const montoAcumuladoDecantidadTotal = dataAlter.reduce((total, item)=>total+item?.cantidadTotalPagadas, 0)
  return (
    <Table className="tabla-egresos" style={{ width: '100%' }} bordered>
      <thead>
        <tr>
          <th style={{width: '280px'}} className={`fs-3 border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white sticky-td-${id_empresa}-white text-black`}>{index}. {nombreGrupo}</th>
          {
            dataAlter.map(f=>{
              return (
                <React.Fragment key={`${f.mesStr}`}>
                <th className={`text-center ${bgTotal}`} style={{width: '120px'}}>{f.mesStr}</th>
                <th className={`text-center ${bgPastel}`} style={{width: '120px'}}>MOV.</th>
                </React.Fragment>
              )
            })
          }
          <th className='text-center' style={{width: '120px'}}>TOTAL <br/> ANUAL</th>
          <th className='text-center' style={{width: '120px'}}>MOV. <br/> ANUAL</th>
          <th className='text-center' style={{width: '120px'}}>%<br/>PART. <br/> ANUAL</th>
          <th className='text-center' style={{width: '120px'}}>PROMEDIO<br/>MENSUAL <br/> ANUAL</th>
        </tr>
      </thead>
      <tbody>
        { conceptos.map((c, i)=>{
          return (
            <tr key={`${i}-${c.concepto}`}>
              <td className={`sticky-td-${id_empresa} border-left-10 border-right-10 ${bgTotal}`}>{i+1}. {c.concepto}</td>
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
                      <div onClick={()=>onOpenModalTableItems(itemsDelMesFiltrado1423)}>
                        {
                          (sumaMontoMensual!=='0.00' || sumaMontoMensual1424==='0.00') && (
                            <>
                            {sumaMontoMensual}
                              <br/> 
                            </>
                          )
                        }
                        <div className='text-orange'>
                          
                          {sumaMontoMensual1424!=='0.00'&&sumaMontoMensual1424}
                        </div>
                      </div>
                    </td>
                    <td className='text-center'>
                      <div onClick={()=>onOpenModalTableItems(itemsDelMesFiltrado1423)}>
                        {
                          (sumaCantidadMensual!==0 || sumaCantidadMensual1424===0) && (
                            <>
                            {sumaCantidadMensual}
                              <br/> 
                            </>
                          )
                        }
                        <div className='text-orange'>
                          
                          {sumaMontoMensual1424!=='0.00'&&sumaCantidadMensual1424}
                        </div>
                      </div>
                    </td>
                    </React.Fragment>
                  )
                })
              }
              <td><NumberFormatMoney amount={c.data?.reduce((total, im)=>total+im?.monto, 0)}/></td>
              <td>{c.data.length}</td>
              <td><NumberFormatMoney amount={(c.data?.reduce((total, im)=>total+im?.monto, 0)/c.data.length)*100}/></td>
              <td></td>
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
                  {f.cantidadTotalPagadas+f.cantidadTotalNoPagadas}

                </td>
                </React.Fragment>
              )
            })
          }
          <td colSpan={4} className='text-center'>TOTAL ANUAL</td>
        </tr>
        <tr>
          <td className={`sticky-td-${id_empresa} border-left-10 border-right-10 border-bottom-10 ${bgTotal}`}>PARTICIPACION</td>
          {
            dataAlter.map((f, i)=>{
              return (
                <React.Fragment key={i}>
                <td className={`text-center ${bgTotal}`} style={{width: '120px'}}><NumberFormatMoney amount={(f.montoTotalPagadas/montoAcumuladoDeMontoTotal)*100}/></td>
                <td className={`text-center ${bgPastel}`} style={{width: '120px'}}>{((f.cantidadTotalPagadas/montoAcumuladoDecantidadTotal)*100).toFixed(2)}</td>
                </React.Fragment>
              )
            })
          }
          <td><NumberFormatMoney amount={montoAcumuladoDeMontoTotal}/></td>
          <td>{montoAcumuladoDecantidadTotal}</td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </Table>
  )
}




function dataTotalFormular(anio=2024, data=[]) {
	return anio===2024?data.slice(data.findIndex(n => n !== 0)):data
}

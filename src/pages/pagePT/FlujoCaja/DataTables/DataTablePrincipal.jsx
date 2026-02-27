import { NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import React from 'react'
import { Table } from 'react-bootstrap';

export const DataTablePrincipal = ({data=[], itemsxDias=[], conceptos=[], fechas=[], nombreGrupo='', index='', bgTotal, bgPastel, onOpenModalTableItems}) => {
  const dataAlter = fechas.map((f, index, array)=>{
      const dataTotal = itemsxDias.find(i=>i.mes===f.mes && i.anio===f.anio)??{}
    return {
        ...f,
        // items: conceptos.flatMap(grupo => grupo.items).filter(i=>i.mes===f.mes && i.anio===f.anio),
        mesStr: dayjs(`${f.anio}-${f.mes}-1`, 'YYYY-M-D').format('MMM [.]'),
        dataTotal: dataTotal.items||[],
        montoTotal: dataTotal.items?.reduce((total, item)=>total+item?.monto, 0)||0,
        cantidadTotal: dataTotal.items?.length ||0,
    }
  })
  const montoAcumuladoDeMontoTotal = dataAlter.reduce((total, item)=>total+item?.montoTotal, 0)
  const montoAcumuladoDecantidadTotal = dataAlter.reduce((total, item)=>total+item?.cantidadTotal, 0)
  return (
    <Table className="tabla-egresos" style={{ width: '100%' }} bordered>
      <thead>
        <tr>
          <th style={{width: '280px'}} className={`border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white`}>{index}. {nombreGrupo}</th>
          {
            dataAlter.map(f=>{
              return (
                <React.Fragment key={`${f.mesStr}`}>
                <td className={`text-center ${bgTotal}`} style={{width: '120px'}}>{f.mesStr}</td>
                <td className={`text-center ${bgPastel}`} style={{width: '120px'}}>MOV.</td>
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
              <td className={`sticky-td border-left-10 border-right-10 ${bgTotal}`}>{i+1}. {c.concepto}</td>
              {
                  dataAlter.map((f, i)=>{
                  const itemsDelMesFiltrado= c.items?.find(m=>m.mes===f.mes && m.anio===f.anio)
                  const sumaMontoMensual = itemsDelMesFiltrado?.items?.reduce((total, im)=>total+im?.monto, 0)
                  const sumaCantidadMensual = itemsDelMesFiltrado?.items?.length
                  
                  return (
                    <React.Fragment key={`${i}`}>
                    <td className='text-center' onClick={()=>onOpenModalTableItems(itemsDelMesFiltrado.items)}><NumberFormatMoney amount={sumaMontoMensual}/></td>
                    <td className='text-center'>{sumaCantidadMensual||0}</td>
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
          <td className={`sticky-td border-left-10 border-right-10 ${bgTotal}`}>TOTAL</td>
          {
            dataAlter.map((f, i)=>{
              return (
                <React.Fragment key={i}>
                <td className={`text-center ${bgTotal}`} style={{width: '120px'}}><NumberFormatMoney amount={f.montoTotal}/></td>
                <td className={`text-center ${bgPastel}`} style={{width: '120px'}}>{f.cantidadTotal}</td>
                </React.Fragment>
              )
            })
          }
          <td colSpan={4} className='text-center'>TOTAL ANUAL</td>
        </tr>
        <tr>
          <td className={`sticky-td border-left-10 border-right-10 border-bottom-10 ${bgTotal}`}>PARTICIPACION</td>
          {
            dataAlter.map((f, i)=>{
              return (
                <React.Fragment key={i}>
                <td className={`text-center ${bgTotal}`} style={{width: '120px'}}><NumberFormatMoney amount={(f.montoTotal/montoAcumuladoDeMontoTotal)*100}/></td>
                <td className={`text-center ${bgPastel}`} style={{width: '120px'}}>{((f.cantidadTotal/montoAcumuladoDecantidadTotal)*100).toFixed(2)}</td>
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

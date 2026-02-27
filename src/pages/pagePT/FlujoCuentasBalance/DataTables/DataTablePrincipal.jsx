import { NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import React from 'react'
import { Table } from 'react-bootstrap';

export const DataTablePrincipal = ({data=[], itemsxDias=[], conceptos=[], fechas=[], index='', nombreGrupo=''}) => {
  const dataAlter = fechas.map((f, index, array)=>{
      const dataTotal = itemsxDias.find(i=>i.mes===f.mes && i.anio===f.anio)??{}
      
    return {
        ...f,
        // items: conceptos.flatMap(grupo => grupo.items).filter(i=>i.mes===f.mes && i.anio===f.anio),
        mesStr: dayjs(`${f.anio}-${f.mes}-1`, 'YYYY-M-D').format('MMM [.]'),
        dataTotal: dataTotal.items,
        montoTotal: dataTotal.items?.reduce((total, item)=>total+item?.monto, 0),
        cantidadTotal: dataTotal.items?.length,
    }
  })
  const montoAcumuladoDeMontoTotal = dataAlter.reduce((total, item)=>total+item?.montoTotal, 0)
  const montoAcumuladoDecantidadTotal = dataAlter.reduce((total, item)=>total+item?.cantidadTotal, 0)
  console.log({d10: data, fechas, dataAlter, conceptos, nombreGrupo, montoAcumuladoDeMontoTotal});
  
  return (
    <Table  className="tabla-egresos" style={{ width: '100%' }} bordered>
      <thead>
        <tr>
          <th style={{width: '190px'}}>{index}{nombreGrupo}</th>
          {
            dataAlter.map(f=>{
              return (
                <>
                <th className='text-center' style={{width: '120px'}}>{f.mesStr}</th>
                <th className='text-center' style={{width: '120px'}}>MOV.</th>
                </>
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
        { conceptos.map(c=>{
          return (
            <tr>
              <td>{c.concepto}</td>
              {
                  dataAlter.map(f=>{
                  const itemsDelMesFiltrado= c.items?.find(m=>m.mes===f.mes && m.anio===f.anio)
                  const sumaMontoMensual = itemsDelMesFiltrado?.items?.reduce((total, im)=>total+im?.monto, 0)
                  
                  const sumaCantidadMensual = itemsDelMesFiltrado?.items?.length
                  return (
                    <>
                    <td className='text-center'><NumberFormatMoney amount={sumaMontoMensual}/></td>
                    <td className='text-center'>{sumaCantidadMensual}</td>
                    </>
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
          <td>TOTAL</td>
          {
            dataAlter.map(f=>{
              return (
                <>
                <td className='text-center' style={{width: '120px'}}><NumberFormatMoney amount={f.montoTotal}/></td>
                <td className='text-center' style={{width: '120px'}}>{f.cantidadTotal}</td>
                </>
              )
            })
          }
        </tr>
        <tr>
          <td>PARTICIPACION</td>
          {
            dataAlter.map(f=>{
              
              return (
                <>
                <td className='text-center' style={{width: '120px'}}><NumberFormatMoney amount={(f.montoTotal/montoAcumuladoDeMontoTotal)*100}/></td>
                <td className='text-center' style={{width: '120px'}}>{((f.cantidadTotal/montoAcumuladoDecantidadTotal)*100).toFixed(2)}</td>
                </>
              )
            })
          }
        </tr>
      </tbody>
    </Table>
  )
}




function dataTotalFormular(anio=2024, data=[]) {
	return anio===2024?data.slice(data.findIndex(n => n !== 0)):data
}

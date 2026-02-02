import { NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import React from 'react'
import { Table } from 'react-bootstrap';

export const DataTablePrincipal = ({data=[], itemsxDias=[], conceptos=[], fechas=[], nombreGrupo=''}) => {
  const dataAlter = fechas.map(f=>{
      const dataTotal = itemsxDias.find(i=>i.mes===f.mes && i.anio===f.anio)??{}
      
    return {
        ...f,
        // items: conceptos.flatMap(grupo => grupo.items).filter(i=>i.mes===f.mes && i.anio===f.anio),
        mesStr: dayjs(`${f.anio}-${f.mes}-1`, 'YYYY-M-D').format('MMM [.]'),
        dataTotal: dataTotal.items
    }
  })
  console.log({d10: data, fechas, dataAlter, conceptos, nombreGrupo});
  
  return (
    <Table  className="tabla-egresos" style={{ width: '100%' }} bordered>
      <thead>
        <tr>
          <th style={{width: '190px'}}>{nombreGrupo}</th>
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
                <th className='text-center' style={{width: '120px'}}>{f.mesStr}</th>
                <th className='text-center' style={{width: '120px'}}>MOV.</th>
                </>
              )
            })
          }
        </tr>
        <tr>
          <td>PARTICIPACION</td>
        </tr>
      </tbody>
    </Table>
  )
}

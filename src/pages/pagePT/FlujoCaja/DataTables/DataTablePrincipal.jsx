import { NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import React from 'react'
import { Table } from 'react-bootstrap';

export const DataTablePrincipal = ({data=[], conceptos=[], fechas=[], nombreGrupo=''}) => {
  const dataAlter = fechas.map(f=>{
    
    return {
        ...f,
        mesStr: dayjs(`${f.anio}-${f.mes}-1`, 'YYYY-M-D').format('MMM [.]')
    }
  })
  console.log({d10: data, fechas, dataAlter, conceptos});
  
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
      </tbody>
    </Table>
  )
}

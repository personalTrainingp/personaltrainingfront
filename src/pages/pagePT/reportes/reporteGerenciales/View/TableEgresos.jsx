import { NumberFormatMoney } from '@/components/CurrencyMask'
import React from 'react'
import { Table } from 'react-bootstrap'

export const TableEgresos = ({bgTotal, data=[]}) => {
  const dataAlter = data.map(d=>{
    // const montoDataPagosPendientes = d.data?.reduce((total, item)=>total+item.monto,0)
    const montoData = d.data?.reduce((total, item)=>total+item?.monto,0)
    return {
      ...d,
      // montoDataPagosPendientes,
      montoData
    }
  })
  const onClickData = async(g)=>{
    console.log({g});
      
  }
  return (
    <Table style={{width: '90%'}}>
        <thead className={`${bgTotal}`}>
          <tr>
            <th className='text-white'>EGRESOS</th>
            <th className='text-white'>CANCELADO</th>
            {/* <th className='text-white'>PAGO <br/> PENDIENTE</th> */}
          </tr>
        </thead>
        <tbody>
          {
            dataAlter?.map(g=>{
              return (
                <tr onClick={()=>onClickData(g)}>
                  <td>{g?.grupo}</td>
                  <td><NumberFormatMoney amount={g?.montoData}/></td>
                </tr>
              )
            })
          }
        </tbody>
    </Table>
  )
}

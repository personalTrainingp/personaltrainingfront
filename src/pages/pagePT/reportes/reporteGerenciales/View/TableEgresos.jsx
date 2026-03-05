import { NumberFormatMoney } from '@/components/CurrencyMask'
import React from 'react'
import { Table } from 'react-bootstrap'

export const TableEgresos = ({bgTotal, data=[], onOpenModalConceptos, nombreHeader=''}) => {
  const dataAlter = data.map(d=>{
    const montoData = d.data?.reduce((total, item)=>total+item?.monto,0)
    return {
      ...d,
      montoData
    }
  })
  const onClickData = async(g, headerGrupo)=>{
      onOpenModalConceptos(g, headerGrupo)
  }
  return (
    <>
      <Table style={{width: '90%'}}>
          <thead className={`${bgTotal}`}>
            <tr>
              <th className='text-white'>{nombreHeader}</th>
              <th className='text-white'>CANCELADO</th>
              {/* <th className='text-white'>PAGO <br/> PENDIENTE</th> */}
            </tr>
          </thead>
          <tbody>
            {
              dataAlter?.map(g=>{
                return (
                  <tr onClick={()=>onClickData(g.conceptos, g.grupo)}>
                    <td>{g?.grupo}</td>
                    <td><NumberFormatMoney amount={g?.montoData}/></td>
                  </tr>
                )
              })
            }
            <tr className={`${bgTotal}`}>
              <td className='fs-2 text-white'>TOTAL</td>
              <td className='fs-2 text-white'><NumberFormatMoney amount={dataAlter.reduce((total, item)=>total+item.montoData, 0)}/></td>
            </tr>
          </tbody>
      </Table>
    </>
  )
}

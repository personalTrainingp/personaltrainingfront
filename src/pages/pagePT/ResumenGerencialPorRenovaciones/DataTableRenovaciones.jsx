import { NumberFormatMoney } from '@/components/CurrencyMask'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import dayjs from 'dayjs'
import React from 'react'
import { Table } from 'react-bootstrap'

export const DataTableOrigen = ({renovaciones, vencimientos, mes, anio, pendientes_acum}) => {
  return (
    <>
    <Table>
      <tbody>
        <tr className={`${colorxAnio(anio)}`}>
          <th className='text-white fs-3' colSpan={2}> 
            <div className={`text-center fs-1 `}>
              {dayjs(`${anio}-${mes}-01`).format(' YYYY - MMMM')}
            </div>
          </th>
        </tr>
        <tr>
          <th className='fs-3'>RENOVACIONES DEL MES</th>
          <td className='fs-3'>{renovaciones?.length}</td>
        </tr>
        <tr>
          <th className='fs-3'>RENOVACIONES %</th>
          <td className='fs-3'><NumberFormatMoney amount={(renovaciones?.length/vencimientos?.length)*100}/></td>
        </tr>
        <tr>
          <th className='fs-3'>VENCIMIENTOS FUTURO</th>
          <td className='fs-3'>{vencimientos?.length}</td>
        </tr>
        <tr>
          <th className='fs-3'>PENDIENTES EN RENOVAR</th>
          <td className='fs-3'>{vencimientos?.length-renovaciones?.length }</td>
        </tr>
        {/* <tr>
          <th className='fs-3'>ACUMULADO CARTERA</th>
          <td className='fs-3'>{pendientes_acum }</td>
        </tr> */}
      </tbody>
    </Table>
    </>
  )
}

function colorxAnio(anio) {
  if(anio===2024){
    return 'bg-circus'
  }
  if(anio===2025){
    return 'bg-change'
  }
  if(anio==2026){
    return 'bg-morado'
  }
  if(anio==2027){
    return 'bg-greenISESAC'
  }
}
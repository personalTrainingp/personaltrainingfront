import { NumberFormatMoney } from '@/components/CurrencyMask'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import dayjs from 'dayjs'
import React from 'react'
import { Table } from 'react-bootstrap'

export const DataTableOrigen = ({renovaciones, dataRenovacionesAnteriores, vencimientos, mes, anio, pendientes_acum}) => {
  return (
    <>
    <Table striped>
      
        <tr className={`${colorxAnio(anio).bgHeader}`}>
          <th className='text-white fs-3' colSpan={2}> 
            <div className={`text-center fs-1 `}>
              {dayjs(`${anio}-${mes}-01`).format(' YYYY - MMMM')}
            </div>
          </th>
        </tr>
      <tbody>
        <tr>
          <th className='fs-2'>VENCIMIENTOS <br/> {dayjs(`${anio}-${mes}-01`).format('MMMM')}</th>
          <td className='fs-2 text-right'>{vencimientos?.length}</td>
        </tr>
        <tr>
          <th className='fs-2'>RENOVACIONES <br/> REALIZADAS</th>
          <td className='fs-2 text-right'>{renovaciones?.length}</td>
        </tr>
        {/* <tr>
          <th className='fs-2'>RENOVACIONES <br/> {dayjs(`${anio}-${mes-1}-01`).format('MMMM')} </th>
          <td className='fs-2 text-right'>{renovaciones?.length}</td>
        </tr> */}
        <tr>
          <th className='fs-3'>% RENOVACIONES</th>
          <td className='fs-3 text-right'><NumberFormatMoney amount={(renovaciones?.length/vencimientos?.length)*100}/>%</td>
        </tr>
        <tr>
          <th className='fs-3'>RENOVACIONES <br/> PENDIENTES</th>
          <td className='fs-3 text-right'>{vencimientos?.length-renovaciones?.length }</td>
        </tr>
        <tr>
          <th className='fs-3'>renovaciones <br/>({dayjs(`${anio}-${mes===1?mes-2:mes-2}-01`).format('MMMM')} - {dayjs(`${anio}-${mes-1}-01`).format('MMMM')})</th>
          <td className='fs-3 text-right'>{dataRenovacionesAnteriores?.reduce((acc, item)=>acc+item.items?.length, 0)}</td>
        </tr>
        {/* <tr className={`${colorxAnio(anio).bgRei}`} style={{background: ''}}>
          <th className='fs-3'>reinscripciones </th>
          <td className='fs-3 text-right'>FD</td>
        </tr> */}
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
    return {
      bgHeader: 'bg-circus',
      bgRei: 'bg-circus-pastel'
    }
  }
  if(anio===2025){
    return {
      bgHeader: 'bg-change',
      bgRei: 'bg-change-pastel'
    }
  }
  if(anio==2026){
    return {
      bgHeader: 'bg-morado',
      bgRei: 'bg-morado-pastel'
    }
  }
  if(anio==2027){
    return {
      bgHeader: 'bg-greenISESAC',
      bgRei: 'bg-greenISESAC-pastel'
    }
  }
}
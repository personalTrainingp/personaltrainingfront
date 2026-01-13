import { NumberFormatMoney } from '@/components/CurrencyMask'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import dayjs from 'dayjs'
import React from 'react'
import { Table } from 'react-bootstrap'

export const DataTableOrigen = ({renovaciones, mes, anio}) => {
  
  return (
    <>
    <Table>
      <tbody>
        <tr className={`${colorxAnio(anio)}`}>
          <th className='text-white fs-3' colSpan={3}> 
            <div className={`text-center fs-1 `}>
              {dayjs(`${anio}-${mes}-01`).format(' YYYY - MMMM')}
            </div>
          </th>
        </tr>
        <tr>
          <th className='fs-3'>REINSCRIPCIONES DEL MES</th>
          <td className='fs-3'>{renovaciones?.length}</td>
          <td className='fs-3'><NumberFormatMoney amount={renovaciones?.reduce((acc, curr) => acc + curr.monto, 0)}/></td>
        </tr>
        {
          agruparEmpl(renovaciones).map(r=>{
            return(
              <tr>
                <th className='fs-3'>{r?.empl}</th>
                <th className='fs-3'>{r?.items.length}</th>
                <th className='fs-3'><NumberFormatMoney amount={r?.items?.reduce((acc, curr) => acc + curr?.monto, 0)}/></th>
              </tr>
            )
          })
        }
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
  return 'bg-danger'
}

function agruparEmpl(data) {
  return Object.values(
  data.reduce((acc, item) => {
    const key = item.empl || 'SIN EMPLEADO';

    if (!acc[key]) {
      acc[key] = {
        empl: key,
        items: []
      };
    }

    acc[key].items.push(item);
    return acc;
  }, {})
);
}
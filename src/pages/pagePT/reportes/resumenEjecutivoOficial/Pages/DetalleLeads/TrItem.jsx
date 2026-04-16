import { NumberFormatMoney } from '@/components/CurrencyMask'
import React from 'react'

export const TrItem = ({anio, data=[], montoAnio=0}) => {
  return (
    <tr>
        <td className='sticky-td-598 fs-1 text-center text-white' style={{width: '240px'}}>{anio}</td>
        {
            data.map(d=>{
                return (
                    <td className='text-center fs-1'>
                        {d.monto}
                    </td>
                )
            })
        }
        <td className='text-center fs-1'>
            {montoAnio}
        </td>
    </tr>
  )
}

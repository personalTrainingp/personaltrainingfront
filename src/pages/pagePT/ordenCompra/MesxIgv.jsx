import { NumberFormatMoney } from '@/components/CurrencyMask'
import React from 'react'

export const MesxIgv = ({monto_acumulado, m, len}) => {
  return (
    <>
    <td style={{ marginBottom: 14 }}>
        <strong className='text-center text-black'>
            S/. <NumberFormatMoney amount={monto_acumulado}/> 
        </strong>

    </td>
    <td style={{ marginBottom: 14 }} className='fs-2'>
      {len}
    </td>
    </>
  )
}

import { NumberFormatMoney } from '@/components/CurrencyMask'
import React from 'react'

export const MesxIgv = ({monto_acumulado, m, len, className}) => {
  return (
    <>
    <td style={{ marginBottom: 14 }} className='text-isesac'>
        <strong className='text-center text-black'>
          <div className={className}>
            S/. <NumberFormatMoney amount={monto_acumulado}/> 
          </div>
        </strong>

    </td>
    <td style={{ marginBottom: 14 }} className='fs-2'>
      <div className={className}>
        {len}
      </div>
    </td>
    </>
  )
}

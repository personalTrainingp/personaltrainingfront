import { NumberFormatMoney } from '@/components/CurrencyMask'
import React from 'react'

export const MesxIgv = ({label, monto_acumulado, data}) => {
  return (
    <div style={{ marginBottom: 14 }} className={`d-flex justify-content-center flex-column border-black-6`}>
            <span className={` fs-2 text-center  p-0 border-bottom-black-6`}>
                {label}
            </span>
        <strong className='text-center text-black'>
            S/. <NumberFormatMoney amount={monto_acumulado}/> <span className='fs-3'>({data?.length})</span>
        </strong>

    </div>
  )
}

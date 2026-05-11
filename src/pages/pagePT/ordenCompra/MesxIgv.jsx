import { NumberFormatMoney } from '@/components/CurrencyMask'
import React from 'react'

export const MesxIgv = ({monto_acumulado, m, len, className, mes, anio}) => {
  return (
    <>
    <td style={{ marginBottom: 14 }} className={`text-isesac ${anio===2024?mes<9?'bg-change-pastel':'':''}`}>
        <strong className='text-center text-black'>
          <div className={`text-isesac ${anio===2024?mes<9?'text-black':className:''}`}>
            S/. <NumberFormatMoney amount={monto_acumulado}/> 
          </div>
        </strong>

    </td>
    </>
  )
}

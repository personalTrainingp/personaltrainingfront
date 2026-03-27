import React from 'react'
import { DataTableGastos } from '../GestGastos/DataTableGastos'
import { useSelector } from 'react-redux'
import { NumberFormatMoney } from '@/components/CurrencyMask'

export const AppOrdenCompra = ({id_empresa}) => {
      const { dataView } = useSelector(e=>e.EGRESOS)
  return (
    <div>
        <div className='fs-2 text-change'>IGV ACUMULADO EN TOTAL: <NumberFormatMoney amount={dataView.reduce((total, item)=>item.monto+total, 0)}/></div>
        <DataTableGastos sonCompras={true} id_empresa={id_empresa} />
    </div>
  )
}

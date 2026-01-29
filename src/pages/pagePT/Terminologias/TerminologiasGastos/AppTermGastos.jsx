import React from 'react'
import { App2 } from './App2'
import { PageBreadcrumb } from '@/components'

export const AppTermGastos = ({id_empresa, tipo}) => {
  return (
    <div>
        <PageBreadcrumb title={'TERM. GASTOS'}/>
        <App2 id_empresa={id_empresa} tipo={tipo}/>
    </div>
  )
}

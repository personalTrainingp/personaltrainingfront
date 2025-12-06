import { PageBreadcrumb } from '@/components'
import { FechaCorte } from '@/components/RangeCalendars/FechaRange'
import React from 'react'
import { DataTableOrigen } from './DataTableOrigen'

export const App = () => {
  return (
    <div>
        <PageBreadcrumb title={'DETALLE ORIGEN'}/>
        <FechaCorte inicio={2} corte={5}/>
        <DataTableOrigen/>
    </div>
  )
}

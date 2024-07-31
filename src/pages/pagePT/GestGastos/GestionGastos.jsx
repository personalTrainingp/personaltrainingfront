import React from 'react'
import { Card, Tab, Tabs } from 'react-bootstrap'
import { GestionGastosIngresos } from './GestionGastosIngresos'
import { PageBreadcrumb } from '@/components'

export const GestionGastos = () => {
  return (
    <>
    
    <PageBreadcrumb title={'GESTION DE EGRESOS'} subName={'T'}/>
    <Card className='p-4 m-2'>
              <GestionGastosIngresos/>
    </Card>
    </>
  )
}

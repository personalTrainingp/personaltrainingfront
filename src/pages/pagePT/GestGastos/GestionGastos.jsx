import React from 'react'
import { Card, Tab, Tabs } from 'react-bootstrap'
import { GestionGastosIngresos } from './GestionGastosIngresos'

export const GestionGastos = () => {
  return (
    <>
    <Card className='p-4 m-2'>
              <GestionGastosIngresos/>
    </Card>
    </>
  )
}

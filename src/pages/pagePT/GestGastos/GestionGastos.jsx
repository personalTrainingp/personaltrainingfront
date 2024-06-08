import React from 'react'
import { Card, Tab, Tabs } from 'react-bootstrap'
import GestGastosFvsV from './ParamsGestGastos'
import { GestionGastosIngresos } from './GestionGastosIngresos'
import AdvancedFilterDemo from './Tratch'

export const GestionGastos = () => {
  return (
    <>
    <Card className='p-4 m-2'>
      <Tabs>
          <Tab eventKey={'parametros'} title={'Parametros de Gastos'}>
              {/* <GestGastosFvsV/> */}
              <AdvancedFilterDemo/>
          </Tab>
          <Tab eventKey={'gf_gv'} title={'Ingresos y gastos'}>
              <GestionGastosIngresos/>
          </Tab>
      </Tabs>
    </Card>
    </>
  )
}

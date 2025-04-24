import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import { AgregarEntradaArticulos } from './AgregarEntradaArticulos'

export const PrincipalView = () => {
  const [isModalEntradaInventario, setisModalEntradaInventario] = useState(false)
  const onOpenModalEntradaInventario = () => {
    setisModalEntradaInventario(true)
  }
  const onCloseModalEntradaInventario = ()=>{
    setisModalEntradaInventario(false)
  }
  return (
    <>
    <PageBreadcrumb title={'ENTRADA DE ITEMS'}/>
    <Row>
      <TabView>
        <TabPanel header="ENTRADA">
          <TabView>
            <TabPanel header="CHANGE THE SLIM STUDIO">
                  <AgregarEntradaArticulos id_enterprice={598} actionKardex={'entrada'}/>
            </TabPanel>
            <TabPanel header="REDUCTO INVENTARIO TOTAL">
                  <AgregarEntradaArticulos id_enterprice={599} actionKardex={'entrada'}/>
            </TabPanel>
          </TabView>
        </TabPanel>
        <TabPanel header="SALIDA">
          <TabView>
            <TabPanel header="CHANGE THE SLIM STUDIO">
                  <AgregarEntradaArticulos id_enterprice={598} actionKardex={'salida'}/>
            </TabPanel>
            <TabPanel header="REDUCTO INVENTARIO TOTAL">
                  <AgregarEntradaArticulos id_enterprice={599} actionKardex={'salida'}/>
            </TabPanel>
          </TabView>
        </TabPanel>
      </TabView>
    </Row>
    </>
  )
}

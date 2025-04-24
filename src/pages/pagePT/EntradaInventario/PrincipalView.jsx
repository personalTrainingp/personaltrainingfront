import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { ModalEntradaInventario } from './ModalEntradaInventario'
import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import { DataEntrada } from './DataEntrada'

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
              <TabPanel header="CHANGE THE SLIM STUDIO">
                    <DataEntrada id_enterprice={598} actionKardex={'entrada'}/>
              </TabPanel>
              <TabPanel header="REDUCTO INVENTARIO TOTAL">
                    <DataEntrada id_enterprice={599} actionKardex={'entrada'}/>
              </TabPanel>
                            <TabPanel header="CHORRILLOS">
                                  <DataEntrada id_enterprice={601} actionKardex={'entrada'}/>
                            </TabPanel>
            </TabView>
    </Row>
    </>
  )
}

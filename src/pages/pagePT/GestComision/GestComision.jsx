import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { TipoCliente } from './TipoCliente/TipoCliente'
import { ComisionProductos } from './PorProductos/ComisionProductos'

export function GestComision(){
  return (
    <>
      <PageBreadcrumb title={'Comisiones'} subName={'gestcomision'}/>
      <Row>
        <Col lg={12}>
          <Card>
            <TabView>
              <TabPanel header="Tipo de clientes">
                <TipoCliente/>
              </TabPanel>
              <TabPanel header="Productos">
                <ComisionProductos/>
              </TabPanel>
            </TabView>
          </Card>
        </Col>
      </Row>
    </>
  )
}

import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import GestGastosFvsV from './ParamsGestGastos'

export const Terminologias = () => {
  return (
    <>
			<PageBreadcrumb title={`Terminologias`} subName="E" />
            <Row>
            <Col>
            <Card>
                <Card.Body>
                    <TabView>
                        <TabPanel header="Tipo de Egresos">
                        <GestGastosFvsV/>
                        </TabPanel>
                        <TabPanel header="">
                            <p>Terminología 2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet consequat nunc, vel ultricies metus. Integer tincidunt, lacus a vulputate viverra, est turpis semper velit, in consectetur neque justo ac justo.</p>
                        </TabPanel>
                    </TabView>
                </Card.Body>
            </Card>
            </Col>
        </Row>
    </>
  )
}

import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
<<<<<<< HEAD
import GestGastosFvsV from './ParamsGestGastos'
=======
import GestGastosFvsV from './ParamsTermGastos'
>>>>>>> b00dfd5c3bcc58a35668bafb5462362edc331ba2

export const Terminologias = () => {
  return (
    <>
			<PageBreadcrumb title={`Terminologias`} subName="E" />
            <Row>
            <Col>
            <Card>
                <Card.Body>
                    <TabView>
<<<<<<< HEAD
                        <TabPanel header="Tipo de Egresos">
=======
                        <TabPanel header="TERMINOLOGIAS DE GASTOS">
>>>>>>> b00dfd5c3bcc58a35668bafb5462362edc331ba2
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

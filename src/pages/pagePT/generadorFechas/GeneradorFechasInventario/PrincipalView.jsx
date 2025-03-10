import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { Row } from 'react-bootstrap'
import TableGenerarFechas from './TableGenerarFechas'
import { Button } from 'primereact/button'

export const PrincipalView = () => {
  return (
    <>
        <PageBreadcrumb title={'Generador de fechas'}/>
        <Row>
        <TabView>
                <TabPanel header="CHANGE THE SLIM STUDIO">
                        <TableGenerarFechas id_empresa={598}/>
                </TabPanel>
                <TabPanel header="MP">
                        <TableGenerarFechas id_empresa={600}/>
                </TabPanel>
                <TabPanel header="CIRCUS SALON">
                        <TableGenerarFechas id_empresa={599}/>
                </TabPanel>
                </TabView>
        </Row>
    </>
  )
}

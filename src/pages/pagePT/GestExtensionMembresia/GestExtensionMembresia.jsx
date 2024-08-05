import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { GestCongelamientoMembresia } from './GestCongelamientoMembresia'
import { GestRegalosMembresia } from './GestRegalosMembresia'
import { PageBreadcrumb } from '@/components'

export const GestExtensionMembresia = () => {
  return (
    <>
        <PageBreadcrumb subName={'T'} title={"CONGELAMIENTOS Y REGALOS"}/>
        <TabView>
            <TabPanel header='CONGELAMIENTOS'>
                <GestCongelamientoMembresia/>
            </TabPanel>
            <TabPanel header='REGALOS'>
                <GestRegalosMembresia/>
            </TabPanel>

        </TabView>
    </>
  )
}

import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { AppTermGastos } from './TerminologiasGastos/AppTermGastos'

export const AppTerminologias = () => {
  return (
    <div>
        <TabView>
            <TabPanel header={'TERMINOLOGIA DE GASTOS'}>
              <TabView>
                <TabPanel header={'CHANGE'}>
                  <AppTermGastos id_empresa={598} tipo={1573}/>
                </TabPanel>
                <TabPanel header={'REDUCTO'}>
                  <AppTermGastos id_empresa={599} tipo={1573}/>
                </TabPanel>
                <TabPanel header={'CIRCUS'}>
                  <AppTermGastos id_empresa={601} tipo={1573}/>
                </TabPanel>
                <TabPanel header={'RAL'}>
                  <AppTermGastos id_empresa={800} tipo={1573}/>
                </TabPanel>
              </TabView>
            </TabPanel>
        </TabView>
    </div>
  )
}

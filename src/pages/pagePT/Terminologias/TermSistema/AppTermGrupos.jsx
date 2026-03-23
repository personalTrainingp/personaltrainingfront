import React, { useState } from 'react'
import { PageBreadcrumb } from '@/components'
import { ViewTerminosGrupo } from './View/ViewTerminosGrupo'
import { TabPanel, TabView } from 'primereact/tabview'

export const AppTermGrupos = () => {
  return (
    <div>
            <PageBreadcrumb title={'TERM. GRUPOS'}/>
            <TabView>
              <TabPanel header={'CHANGE'}>
                <ViewTerminosGrupo id_empresa={598} titulo={'GRUPO'}/>
              </TabPanel>
              <TabPanel header={'CIRCUS'}>
                <ViewTerminosGrupo id_empresa={599} titulo={'GRUPO'}/>
              </TabPanel>
              <TabPanel header={'REDUCTO'}>
                <ViewTerminosGrupo id_empresa={601} titulo={'GRUPO'}/>
              </TabPanel>
              <TabPanel header={'RAL'}>
                <ViewTerminosGrupo id_empresa={800} titulo={'GRUPO'}/>
              </TabPanel>
            </TabView>
    </div>
  )
}

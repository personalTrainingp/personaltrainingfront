import React, { useState } from 'react'
import { PageBreadcrumb } from '@/components'
import { ViewTerminos } from './View/ViewTerminos'
import { TabPanel, TabView } from 'primereact/tabview'

export const AppTermSistemas = () => {
  return (
    <div>
            <PageBreadcrumb title={'TERM. SISTEMAS'}/>
            <TabView>
              <TabPanel header={'PROVEEDOR'}>
                <TabView>
                  <TabPanel header={'OFICIOS'}>
                    <ViewTerminos titulo={'OFICIOS'} grupo={'tipo_oficio'} entidad={'proveedor'}/>
                  </TabPanel>
                </TabView>
              </TabPanel>
              <TabPanel header={'INVENTARIO'}>
                <TabView>
                  <TabPanel header={'MARCA'}>
                    <ViewTerminos titulo={'MARCA'} grupo={'marca'} entidad={'articulo'}/>
                  </TabPanel>
                </TabView>
              </TabPanel>
            </TabView>
    </div>
  )
}

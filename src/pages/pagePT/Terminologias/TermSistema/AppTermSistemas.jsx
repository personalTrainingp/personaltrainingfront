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
                  <TabPanel header={'CATEGORIA'}>
                    <ViewTerminos titulo={'CATEGORIA'} grupo={'categoria'} entidad={'articulo'}/>
                  </TabPanel>
                  <TabPanel header={'SUBCATEGORIA'}>
                    <ViewTerminos titulo={'SUBCATEGORIA'} grupo={'subcategoria'} entidad={'articulo'}/>
                  </TabPanel>
                </TabView>
              </TabPanel>
              <TabPanel header={'FORMA DE PAGO'}>
                <TabView>
                  <TabPanel header={'FORMA DE PAGO'}>
                    <ViewTerminos titulo={'FORMA DE PAGO'} grupo={'formapago'} entidad={'formapago'}/>
                  </TabPanel>
                  <TabPanel header={'TIPO DE TARJETA'}>
                    <ViewTerminos titulo={'TIPO DE TARJETA'} grupo={'tipotarjeta'} entidad={'formapago'}/>
                  </TabPanel>
                  <TabPanel header={'TARJETAS'}>
                    <ViewTerminos titulo={'TARJETAS'} grupo={'tarjeta'} entidad={'formapago'}/>
                  </TabPanel>
                  <TabPanel header={'BANCOS'}>
                    <ViewTerminos titulo={'BANCOS'} grupo={'banco'} entidad={'formapago'}/>
                  </TabPanel>
                </TabView>
              </TabPanel>
            </TabView>
    </div>
  )
}

import { PageBreadcrumb } from '@/components'
import React, { useState } from 'react'
import { App2 } from './App2'
import { ColorEmpresa } from '@/components/ColorEmpresa'
import { TabPanel, TabView } from 'primereact/tabview'

export const App = () => {

  return (
    <>
    <PageBreadcrumb title={'GESTION DE INVENTARIO'} subName={'T'}/>
    <TabView>
      <TabPanel header={'PROYECTO 1'}>
        <App2 id_empresa={5992}/>
      </TabPanel>
      <TabPanel header={'REDUCTO'}>
        <App2 id_empresa={599}/>
      </TabPanel>
    </TabView>
    <ColorEmpresa
      childrenChange={
        <App2 id_empresa={598}/>
      }
      childrenReducto={
        <App2 id_empresa={599}/>
      }
      childrenInventarioSinIncluirCircusBussiness={
        <App2 id_empresa={610}/>
      }
      childenBUSSINESS={
        <App2 id_empresa={602}/>
      }
      childrenChorrillos={
        <App2 id_empresa={601}/>
      }
      childrenmpTarata={
        <App2 id_empresa={600}/>
      }
    />
    </>
  )
}
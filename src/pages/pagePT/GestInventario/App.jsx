import { PageBreadcrumb } from '@/components'
import React, { useState } from 'react'
import { App2 } from './App2'
import { ColorEmpresa } from '@/components/ColorEmpresa'

export const App = () => {

  return (
    <>
    <PageBreadcrumb title={'GESTION DE INVENTARIO'} subName={'T'}/>
    <ColorEmpresa
      childrenChange={
        <App2 id_empresa={598}/>
      }
      childrenInventarioSinIncluirCircusBussiness={
        <App2 id_empresa={599}/>
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
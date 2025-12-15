import { PageBreadcrumb } from '@/components'
import React, { useState } from 'react'
import { App2 } from './App2'

export const App = () => {

  return (
    <>
    <PageBreadcrumb title={'GESTION DE INVENTARIO'} subName={'T'}/>
    <App2 id_empresa={598}/>
    </>
  )
}
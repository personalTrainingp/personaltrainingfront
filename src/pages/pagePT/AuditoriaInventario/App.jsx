import React, { useState } from 'react'
import { App2 } from './App2'
import { ColorEmpresa } from '@/components/ColorEmpresa'
import { PageBreadcrumb } from '@/components'

export const App = () => {

  return (
    <div>
        <PageBreadcrumb title={'Historial de cambios de articulos'}/>
        <ColorEmpresa
            childrenChange={
                <App2 idEmpresa={598} tipo={'Porcobrar'}/>
            }
            childrenCircus={
                <App2 idEmpresa={599} tipo={'Porcobrar'}/>
            }
            childrenReducto={
                <App2 idEmpresa={601} tipo={'Porcobrar'}/>
            }
            childrenRal={
                <App2 idEmpresa={800} tipo={'Porcobrar'}/>
            }
        />
    </div>
  )
}

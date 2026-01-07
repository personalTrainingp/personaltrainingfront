import React, { useState } from 'react'
import { App2 } from './App2'
import { ColorEmpresa } from '@/components/ColorEmpresa'
import { PageBreadcrumb } from '@/components'

export const App = ({tipo, headerTipo}) => {

  return (
    <div>
        <PageBreadcrumb title={`CUENTAS POR ${headerTipo}`}/>
        <ColorEmpresa
            childrenChange={
                <App2 idEmpresa={598} tipo={tipo} headerTipo={headerTipo}/>
            }
            childrenCircus={
                <App2 idEmpresa={599} tipo={tipo} headerTipo={headerTipo}/>
            }
            childrenReducto={
                <App2 idEmpresa={601} tipo={tipo} headerTipo={headerTipo}/>
            }
            childrenRal={
                <App2 idEmpresa={800} tipo={tipo} headerTipo={headerTipo}/>
            }
        />
    </div>
  )
}

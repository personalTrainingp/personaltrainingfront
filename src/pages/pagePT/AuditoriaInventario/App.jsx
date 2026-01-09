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
                <App2 idEmpresa={598}/>
            }
            childrenCircus={
                <App2 idEmpresa={602}/>
            }
            childrenSoto={
                <App2 idEmpresa={5992}/>
            }
        />
    </div>
  )
}

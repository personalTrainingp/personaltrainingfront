import { ColorEmpresa } from '@/components/ColorEmpresa'
import React from 'react'
import { PageBreadcrumb } from '@/components'
import { AppGestionGastos } from './AppGestionGastos'

export const App = () => {
  return (
    <div>
        <PageBreadcrumb title={'GESTION DE EGRESOS'} subName={'T'}/>
        <ColorEmpresa
            childrenChange={<AppGestionGastos id_empresa={598}/>}
            childrenCircus={<AppGestionGastos id_empresa={601}/>}
            childrenReducto={<AppGestionGastos id_empresa={599}/>}
            childrenRal={<AppGestionGastos id_empresa={800}/>}
        />
    </div>
  )
}

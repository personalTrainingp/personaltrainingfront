import { ColorEmpresa } from '@/components/ColorEmpresa'
import React from 'react'
import { PageBreadcrumb } from '@/components'
import { AppGestionCheckList } from './AppGestionCheckList'

export const App = () => {
  return (
    <div>
        <PageBreadcrumb title={'GESTION DE CHECKLIST DE INVENTARIO'} subName={'T'}/>
        <ColorEmpresa
            childrenChange={<AppGestionCheckList id_empresa={598}/>}
            childrenCircus={<AppGestionCheckList id_empresa={601}/>}
            childrenReducto={<AppGestionCheckList id_empresa={599}/>}
            childrenRal={<AppGestionCheckList id_empresa={800}/>}
        />
    </div>
  )
}

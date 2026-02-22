import { PageBreadcrumb } from '@/components'
import { ColorEmpresa } from '@/components/ColorEmpresa'
import React from 'react'
import { AppGestionProveedores } from './AppGestionProveedores'

export const App = ({estado=true, tipo=1573}) => {
  return (
    <>
    <PageBreadcrumb title={'GESTION DE PROVEEDORES'}/>
    <ColorEmpresa
        childrenChange={<AppGestionProveedores estado={estado} idEmpresa={598} tipo={tipo}/>}
        childrenCircus={<AppGestionProveedores estado={estado} idEmpresa={599} tipo={tipo}/>}
        childrenReducto={<AppGestionProveedores estado={estado} idEmpresa={601} tipo={tipo}/>}
        childrenRal={<AppGestionProveedores estado={estado} idEmpresa={0} tipo={tipo}/>}
    />
    
    </>
  )
}

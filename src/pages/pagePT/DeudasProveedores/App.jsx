import React from 'react'
import { TableDeudasProveedores } from './TableDeudasProveedores'
import { PageBreadcrumb } from '@/components'
import { ColorEmpresa } from '@/components/ColorEmpresa'

export const App = () => {
  return (
    <>
        <PageBreadcrumb title={'Deudas Proveedores'}/>
        <ColorEmpresa
            childrenChange={
                <TableDeudasProveedores id_empresa={598}/>
            }
            childrenCircus={
                <TableDeudasProveedores id_empresa={599}/>
            }
            childrenReducto={
                <TableDeudasProveedores id_empresa={599}/>
            }
        />
    </>
  )
}

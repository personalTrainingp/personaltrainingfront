import { ColorEmpresa } from '@/components/ColorEmpresa'
import React from 'react'
import { ViewGestionEmpleados } from './ViewGestionEmpleados'

export const AppGestionEmpleados = ({idEstado=true}) => {
  return (
    <div>
        <ColorEmpresa
            childrenChange={<ViewGestionEmpleados id_empresa={598} id_estado={idEstado}/>}
            childrenCircus={<ViewGestionEmpleados id_empresa={599} id_estado={idEstado}/>}
        />
    </div>
  )
}

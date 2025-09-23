import React from 'react'
import { DataTableContratos } from './DataTableContratos'

export const App = ({id_empleado}) => {
  return (
    <div>
      <DataTableContratos
        id_empleado={id_empleado}
      />
    </div>
  )
}

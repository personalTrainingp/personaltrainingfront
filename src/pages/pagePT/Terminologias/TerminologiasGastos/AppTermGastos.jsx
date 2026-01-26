import React from 'react'
import { App2 } from './App2'

export const AppTermGastos = ({id_empresa, tipo}) => {
  return (
    <div>
        <App2 id_empresa={id_empresa} tipo={tipo}/>
    </div>
  )
}

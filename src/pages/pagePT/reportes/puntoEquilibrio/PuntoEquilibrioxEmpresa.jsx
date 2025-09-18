import React, { useEffect } from 'react'
import { usePuntoEquilibrioStore } from './usePuntoEquilibrioStore'
import { App } from '../../GestionLead/App'

export const PuntoEquilibrioxEmpresa = ({id_empresa}) => {
    const { obtenerGastosxEmpresa } = usePuntoEquilibrioStore()
    useEffect(() => {
        obtenerGastosxEmpresa(id_empresa)
    }, [])
    
  return (
    <div><App/></div>
  )
}

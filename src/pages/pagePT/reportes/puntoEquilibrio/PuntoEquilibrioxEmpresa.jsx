import React, { useEffect } from 'react'
import { usePuntoEquilibrioStore } from './usePuntoEquilibrioStore'

export const PuntoEquilibrioxEmpresa = ({id_empresa}) => {
    const { obtenerGastosxEmpresa } = usePuntoEquilibrioStore()
    useEffect(() => {
        obtenerGastosxEmpresa(id_empresa)
    }, [])
    
  return (
    <div>PuntoEquilibrioxEmpresa</div>
  )
}

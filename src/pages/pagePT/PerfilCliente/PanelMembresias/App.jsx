import React, { useEffect } from 'react'
import { useDetalleMembresiaStore } from './useDetalleMembresiaStore'

export const App = () => {
    const { obtenerVentasxIdCli, dataVentasMembresia } = useDetalleMembresiaStore()
    useEffect(() => {
        obtenerVentasxIdCli()
    }, [])
    
  return (
    <div>App</div>
  )
}

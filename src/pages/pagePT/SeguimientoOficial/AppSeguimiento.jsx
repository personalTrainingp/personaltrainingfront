import React, { useEffect } from 'react'
import { useSeguimientoStore } from './useSeguimientoStore'

export const AppSeguimiento = () => {
    const { obtenerSeguimiento } = useSeguimientoStore()
    useEffect(() => {
        obtenerSeguimiento([new Date().toISOString(),
  new Date(2028, 1, 15).toISOString()])
    }, [])
    
  return (
    <div>AppSeguimiento</div>
  )
}

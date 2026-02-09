import React, { useEffect } from 'react'
import { useSeguimientoStore } from './useSeguimientoStore'

export const AppSeguimiento = () => {
    const { obtenerSeguimiento } = useSeguimientoStore()
    useEffect(() => {
        obtenerSeguimiento()
    }, [])
    
  return (
    <div>AppSeguimiento</div>
  )
}

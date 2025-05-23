import React, { useEffect } from 'react'
import { useSeguimientoStore } from './useSeguimientoStore'

export const Seguimiento2 = () => {
    const { obtenerTodoSeguimiento } = useSeguimientoStore()
    useEffect(() => {
        obtenerTodoSeguimiento(598)
    }, [])
    
  return (
    <div>Seguimiento2</div>
  )
}

import React, { useEffect } from 'react'
import { useSeguimientoStore } from './hook/useSeguimientoStore'

export const Seguimiento2 = () => {
  const { obtenerSeguimiento } = useSeguimientoStore()
  return (
    <div>Seguimiento2</div>
  )
}

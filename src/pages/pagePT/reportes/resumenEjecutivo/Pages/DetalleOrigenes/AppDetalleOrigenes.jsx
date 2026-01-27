import React, { useEffect } from 'react'
import { useInformeEjecutivoStore } from '../../useInformeEjecutivoStore'

export const AppDetalleOrigenes = () => {
    const { obtenerVentas, dataVentas } = useInformeEjecutivoStore()
    useEffect(() => {
        obtenerVentas()
    }, [])
    
  return (
    <div>AppDetalleOrigenes</div>
  )
}

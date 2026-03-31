import React, { useEffect } from 'react'
import { DataTableMembresiasAgrupadas } from './DataTableMembresiasAgrupadas'
import { useMembresiasStore } from './useMembresiasStore'

export const AppMembresiasAgrupadas = () => {
    const { obtenerVentaMembresias, dataMembresias } = useMembresiasStore()
    useEffect(() => {
        obtenerVentaMembresias()
    }, [])
    
  return (
    <div>
        <DataTableMembresiasAgrupadas data={dataMembresias}/>
        
    </div>
  )
}

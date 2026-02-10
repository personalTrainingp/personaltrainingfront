import React, { useEffect } from 'react'
import { useSeguimientoStore } from './useSeguimientoStore'

export const TableSeguimientos = ({rangeDate}) => {
    
        const { obtenerSeguimientoxFecha, dataSeguimientoxFecha } = useSeguimientoStore()
        useEffect(() => {
            obtenerSeguimientoxFecha([rangeDate[0], rangeDate[1]])
        }, [])
        console.log({dataSeguimientoxFecha, rangeDate});
        
  return (
    <div>TableSeguimientos</div>
  )
}

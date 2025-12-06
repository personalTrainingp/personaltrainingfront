import React, { useEffect } from 'react'
import { useResumenEjecutivoStore } from './useResumenEjecutivoStore'

export const App1 = () => {
    const { obtenerVentasPorFecha, dataVentaxFecha } = useResumenEjecutivoStore()
    useEffect(() => {
        obtenerVentasPorFecha(['2025-01-02 15:45:47.6640000 +00:00','2025-12-04 20:42:20.4490000 +00:00'])
    }, [])
    
  return (
    <div>
        <pre>
            {JSON.stringify(dataVentaxFecha, null, 2)}
        </pre>
    </div>
  )
}

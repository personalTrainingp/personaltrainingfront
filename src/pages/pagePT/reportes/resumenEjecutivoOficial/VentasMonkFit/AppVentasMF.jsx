import React, { useEffect } from 'react'
import { useInformeEjecutivoStore } from '../useInformeEjecutivoStore'

export const AppVentasMF = ({corte, titulo}) => {
  const { obtenerVentas, dataVentas } = useInformeEjecutivoStore()

  useEffect(() => {
      obtenerVentas(['2025-01-02 15:45:47.6640000 +00:00','2025-12-04 20:42:20.4490000 +00:00'])
  }, [])
  const totalMap = [...dataVentas.dataMFMap]
  
  return (
    <div>AppVentasMF</div>
  )
}

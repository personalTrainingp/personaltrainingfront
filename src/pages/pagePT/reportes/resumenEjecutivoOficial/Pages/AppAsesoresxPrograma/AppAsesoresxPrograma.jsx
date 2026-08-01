import React, { useEffect } from 'react'
import { useInformeEjecutivoStore } from '../../useInformeEjecutivoStore'

export const AppAsesoresxPrograma = ({corte}) => {
    const { obtenerVentas, dataVentas,  } = useInformeEjecutivoStore()
    const corteAnio = corte?.fecha?.split('-')[0]
    const corteMes = corte?.fecha?.split('-')[1]
    useEffect(() => {
        obtenerVentas(['2025-01-02 15:45:47.6640000 +00:00','2025-12-04 20:42:20.4490000 +00:00'])
    }, [])
    const dataVt = dataVentas.dataMembresias
    const dataAlterada = corte?.dia?.map(m=>{
        const dataFiltrada =  dataVt?.filter((f)=>Number(f.mes)===Number(corteMes) && Number(f.anio)===Number(corteAnio) && Number(f.dia)===Number(m))
        const montoTotal = dataFiltrada?.reduce((total, item) => total + (item?.montoTotal || 0), 0)
        return {
            ...m,
            m,
            corteAnio,
            corteMes,
            montoTotal
        }
    })
  return (
    <div>
        <pre>
            {JSON.stringify(dataAlterada, null, 2)}
        </pre>
    </div>
  )
}

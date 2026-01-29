import React, { useEffect } from 'react'
import { useFlujoCaja } from './hook/useFlujoCaja';

export const ViewResumenTotal = ({arrayRangeDate, bgTotal, bgPastel, nombre_empresa, id_enterprice, background}) => {
        const { dataGastosxFecha, obtenerEgresosxFecha } = useFlujoCaja();
    useEffect(() => {
        obtenerEgresosxFecha(id_enterprice, [new Date(2024, 0, 1), new Date(2026, 11, 31)])
    }, [id_enterprice])
  return (
    <div>
        <div className='text-center'>2026</div>
    </div>
  )
}

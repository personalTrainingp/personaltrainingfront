import React, { useEffect } from 'react'
import { FechaCorte } from '@/components/RangeCalendars/FechaRange'
import { useSelector } from 'react-redux'
import { useInformeEjecutivoStore } from '../../useInformeEjecutivoStore'
import { DataTable1 } from './DataTableComparativoConMes/DataTable1'
import { generarMesYanio } from '../../helpers/generarMesYanio'
import { useInformeEjecutivoStoreRenovaciones } from '../../useInformeEjecutivoStoreRenovaciones'

export const AppComparativoConMesRenovaciones = ({titulo}) => {
    const { obtenerVentasRenovaciones, dataVentasRenovaciones } = useInformeEjecutivoStoreRenovaciones()
    const { corte } = useSelector((e) => e.DATA);

    useEffect(() => {
        obtenerVentasRenovaciones(['2025-01-02 15:45:47.6640000 +00:00','2025-12-04 20:42:20.4490000 +00:00'])
    }, [])
    const totalMap = [...dataVentasRenovaciones.dataMembresias]
  return (
    <div>
        <div className='fs-1'>
          {titulo}
        </div>
        <FechaCorte corte={corte.corte} inicio={corte.inicio}/>
        <DataTable1 nombreCategoriaVenta={'TOTAL'} data={totalMap?.filter((el) => corte.dia.includes(el.dia))} arrayFechas={generarMesYanio('2024-09-01 15:45:47.6640000 +00:00')}/>
    </div>
  )
}

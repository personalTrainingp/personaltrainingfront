import React, { useEffect } from 'react'
import { useInformeEjecutivoStore } from '../../useInformeEjecutivoStore'
import { DataTableDetalleLead } from './DataTableDetalleLead'
import { generarMesYanio } from '../../helpers/generarMesYanio'

export const AppDetalleLeads = ({corte, titulo}) => {
    const { obtenerVentas, dataVentas, obtenerLeads, dataLeads } = useInformeEjecutivoStore()
    useEffect(() => {
        obtenerLeads()
        obtenerVentas(['2025-01-02 15:45:47.6640000 +00:00','2025-12-04 20:42:20.4490000 +00:00'])
    }, [])
    const data = [...dataVentas.dataMembresias, ...dataVentas.dataProductos17,...dataVentas.dataProductos18, ...dataVentas.dataMFMap]
    return (
    <div>
        <DataTableDetalleLead dataLeads={dataLeads} label={'TOTAL'} labelMontoVenta={'VENTA TOTAL AL CORTE'} nombreDeComparativo='CUOTA DEL MES' arrayFechas={generarMesYanio('2024-09-01 15:45:47.6640000 +00:00')} data={data} corte={corte} />
    </div>
  )
}

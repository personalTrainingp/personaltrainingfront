import React, { useEffect } from 'react'
import { DataTableDetalleLeads } from './DataTableDetalleLeads'
import { useInformeEjecutivoStore } from '../../useInformeEjecutivoStore'
import { generarMesYanio } from '../../helpers/generarMesYanio'

export const AppDetalleLeads = () => {
    const { dataLeads, obtenerLeads } = useInformeEjecutivoStore()
    useEffect(() => {
        obtenerLeads()
    }, [])
    const dataMesesYanio = generarMesYanio('2024-01-01 15:45:47.6640000 +00:00')
    const dataMeses = generarMesYanio('2025-01-15 15:45:47.6640000 +00:00', '2025-12-15 15:45:47.6640000 +00:00')
  return (
    <div>
                {/* <FechaCorte corte={corte.corte} inicio={corte.inicio}/> */}
                <DataTableDetalleLeads dataMesesYanio={dataMesesYanio} MESES={dataMeses}/>
    </div>
  )
}

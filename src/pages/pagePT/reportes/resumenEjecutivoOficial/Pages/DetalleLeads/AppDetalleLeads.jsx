import React, { useEffect } from 'react'
import { DataTableDetalleLeads } from './DataTableDetalleLeads'
import { generarMesYanio } from '../../helpers/generarMesYanio'
import { useGestVentasStore } from '../../useGestVentasStore'

export const AppDetalleLeads = () => {
    const dataMesesYanio = generarMesYanio('2024-01-01 15:45:47.6640000 +00:00', `${new Date().getFullYear()}-12-15 15:45:47.6640000 +00:00`)
    const dataMeses = generarMesYanio('2025-01-15 15:45:47.6640000 +00:00', '2025-12-15 15:45:47.6640000 +00:00')
            const { obtenerVentasxEmpresa, dataVentasRenovacionesxEmpresa, dataVentasGeneral, dataVentasNuevosxEmpresa, dataVentasReixEmpresa } = useGestVentasStore()
            
        useEffect(() => {
            obtenerVentasxEmpresa(598)
        }, [])
  return (
    <div>
                {/* <FechaCorte corte={corte.corte} inicio={corte.inicio}/> */}
                <DataTableDetalleLeads label={'RENOVACIONES'} dataMesesYanio={dataMesesYanio} MESES={dataMeses} dataVentasGeneral={dataVentasGeneral} dataVentasRenovacionesxEmpresa={dataVentasRenovacionesxEmpresa}/>
                <DataTableDetalleLeads label={'NUEVOS'} dataMesesYanio={dataMesesYanio} MESES={dataMeses} dataVentasGeneral={dataVentasGeneral} dataVentasRenovacionesxEmpresa={dataVentasNuevosxEmpresa}/>
                <DataTableDetalleLeads label={'REINSCRIPCIONES'} dataMesesYanio={dataMesesYanio} MESES={dataMeses} dataVentasGeneral={dataVentasGeneral} dataVentasRenovacionesxEmpresa={dataVentasReixEmpresa}/>
    </div>
  )
}

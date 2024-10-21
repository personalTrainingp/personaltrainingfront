import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect } from 'react'

export const DataTableContratoCliente = () => {
  const { obtenerContratosDeClientes, dataContratos } = useVentasStore()
  useEffect(() => {
    obtenerContratosDeClientes()
  }, [])
  const firmaBodyTemplate = (rowData)=>{
    return (
      <>
      {rowData.detalle_ventaMembresia.contrato_x_serv==undefined?<a >SIN FIRMA</a>:''}
      </>
    )
  }
  return (
    <>
      <DataTable value={dataContratos} paginator rows={10} dataKey="id"
                    globalFilterFields={['usuario', 'ip', 'accion', 'observacion', 'fecha_audit']} emptyMessage="Sin Contratos">
                <Column header="SOCIOS" style={{ minWidth: '12rem' }} />
                <Column header="Programa | Semanas" style={{ minWidth: '12rem' }} />
                <Column header="Asesor comercial" style={{ maxWidth: '10rem' }} />
                <Column header="Firmas" body={firmaBodyTemplate} style={{ maxWidth: '5rem' }} />
                <Column header="Contratos" style={{ maxWidth: '20rem' }} />

            </DataTable>
    </>
  )
}

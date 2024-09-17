import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'

export const DataTableContratoCliente = () => {
  
  return (
    <>
      <DataTable value={[]} paginator rows={10} dataKey="id"
                    globalFilterFields={['usuario', 'ip', 'accion', 'observacion', 'fecha_audit']} emptyMessage="Sin Contratos">
                <Column header="Cliente" style={{ minWidth: '12rem' }} />
                <Column header="Programa | Semanas" style={{ minWidth: '12rem' }} />
                <Column header="Asesor comercial" style={{ maxWidth: '10rem' }} />
                <Column header="Firmas" style={{ maxWidth: '5rem' }} />
                <Column header="Contratos" style={{ maxWidth: '20rem' }} />

            </DataTable>
    </>
  )
}

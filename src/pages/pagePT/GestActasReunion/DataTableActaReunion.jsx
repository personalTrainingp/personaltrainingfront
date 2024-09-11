import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'

export const DataTableActaReunion = () => {
    // const { } = useTipoCambioStore()
    // useEffect(() => {

    // }, [])
    
  return (
    <DataTable value={[]} size='small' emptyMessage='SIN DATOS' sortField="price" sortOrder={-1} tableStyle={{ minWidth: '50rem' }}>
        <Column field="id" header="Id" sortable style={{ width: '10px' }}></Column>
        <Column field="prec_venta" header="Fecha del acta" sortable style={{ width: '20%' }}></Column>
        <Column field="prec_compra" header="Precio de compra" sortable style={{ width: '20%' }}></Column>
        <Column field="fecha" header="Fecha de cambio" sortable style={{ width: '20%' }}></Column>
        <Column field="moneda" header="Moneda" sortable style={{ width: '20%' }}></Column>
        <Column sortable></Column>
    </DataTable>
  )
}

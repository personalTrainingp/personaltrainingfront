import { CurrencyMask } from '@/components/CurrencyMask';
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'

export const TableEgresosProveedor = ({data}) => {
const proveedorBodyTemplate = (rowData)=>{
  return (
    <div>
      {rowData.proveedor}
    </div>
  )
}

const formatCurrency = (value, currency) => {
  return value.toLocaleString('en-ES', { style: 'currency', currency });
};
const TotalBodyTemplate = (rowData)=>{
  return(
    <div>
      {formatCurrency(rowData.suma_monto_PEN, 'PEN')} 
      <br></br>
      {rowData.suma_monto_USD!=0?formatCurrency(rowData.suma_monto_USD, 'USD'):''}
    </div>
  )
}
  return (
    <div>
        <DataTable stripedRows value={data} size={'small'} tableStyle={{ minWidth: '30rem' }} scrollable scrollHeight="400px">
            <Column  header="Proveedor" body={proveedorBodyTemplate}></Column>
            <Column field="name" header="Total" body={TotalBodyTemplate}></Column>
        </DataTable>
    </div>
  )
}

import { CurrencyMask, FormatoDateMask } from '@/components/CurrencyMask';
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore';
import { ModalIngresosGastos } from '@/pages/pagePT/GestGastos/ModalIngresosGastos';
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useState } from 'react'

export const TableEgresosPorGasto = ({data, showToast}) => {
  const [expandedRows, setExpandedRows] = useState(null);
const gastoBodyTemplate = (rowData)=>{
  return (
    <div>
      {rowData.gasto}
    </div>
  )
}

const formatCurrency = (value, currency) => {
  return value?.toLocaleString('en-ES', { style: 'currency', currency });
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

const onRowExpand = (event) => {
  // toast.current.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
};
const { obtenerGastoxID, gastoxID, isLoading, startDeleteGasto } = useGf_GvStore()
const [isOpenModalEgresos, setisOpenModalEgresos] = useState(false)
    const onCloseModalIvsG = ()=>{
        setisOpenModalEgresos(false)
    }
    const onOpenModalIvsG = ()=>{
        setisOpenModalEgresos(true)
    }  
const onRowCollapse = (event) => {
  // toast.current.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
};
const allowExpansion = (rowData)=>{
  return rowData.egresos.length > 0;
}
const montoMonedaBodyTemplate = (rowData)=>{
  return (
    formatCurrency(rowData.monto, rowData.moneda)
  )
}
const onViewModalEgreso = (id)=>{
  onOpenModalIvsG()
  obtenerGastoxID(id)
}
const IdBodyTemplate = (rowData)=>{
  return(
    <a href='#' style={{color: 'blue'}} onClick={()=>onViewModalEgreso(rowData.id)}>
      {rowData.id}
    </a>
  )
}
const FechaPagoTemplate = (rowData)=>{
  
  const [year, month, day] = rowData.fec_pago.split('-').map(Number);
  return (
    <div>
      {FormatoDateMask(new Date(year, month - 1, day), 'D [de] MMMM [del] YYYY')}
    </div>
  )
}
const proveedorBodyTemplate = (rowData)=>{
  return(
    <div>
      {rowData.tb_Proveedor.razon_social_prov}
    </div>
  )
}
const rowExpansionTemplate = (data) => {
  return (
      <div className="p-3">
          <h5>Egresos de {data.gasto}</h5>
          <DataTable value={data.egresos}>
              <Column header="Id" body={IdBodyTemplate} sortable></Column>
              <Column header="Proveedor" body={proveedorBodyTemplate} sortable></Column>
              <Column header="Fecha de pago" body={FechaPagoTemplate} sortable></Column>
              <Column header="Descripcion" field='descripcion' sortable></Column>
              <Column header="N° Operacion" field='n_operacion' sortable></Column>
              <Column header="Monto"  sortable body={montoMonedaBodyTemplate}></Column>
              {/* <Column field="date" header="Date" sortable></Column>
              <Column field="amount" header="Amount" body={amountBodyTemplate} sortable></Column>
              <Column field="status" header="Status" body={statusOrderBodyTemplate} sortable></Column>
              <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column> */}
          </DataTable>
      </div>
  );
};
  return (
    <div>
        <DataTable 
          expandedRows={expandedRows} 
          onRowToggle={(e) => setExpandedRows(e.data)} 
          stripedRows 
          rowExpansionTemplate={rowExpansionTemplate} 
          onRowExpand={onRowExpand} 
          onRowCollapse={onRowCollapse} 
          value={data} 
          size={'small'} 
          tableStyle={{ minWidth: '30rem' }} 
          scrollable 
          scrollHeight="400px"
          >
            <Column expander={allowExpansion} style={{ width: '5rem' }} />
            <Column  header="GASTO" body={gastoBodyTemplate}></Column>
            <Column field="name" header="Total" body={TotalBodyTemplate}></Column>
        </DataTable>
        <ModalIngresosGastos show={isOpenModalEgresos} onHide={onCloseModalIvsG} data={gastoxID} showToast={showToast} isLoading={isLoading}/>
    </div>
  )
}

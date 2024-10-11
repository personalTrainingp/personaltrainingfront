import { CurrencyMask, FormatoDateMask, MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore';
import { ModalIngresosGastos } from '@/pages/pagePT/GestGastos/ModalIngresosGastos';
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useState } from 'react'
import { ModalViewConceptos } from '../ModalViewConceptos';

export const TableEgresosProveedor = ({data, showToast}) => {
  const [expandedRows, setExpandedRows] = useState(null);
  const [selectGrupos, setselectGrupos] = useState(null)
  const [selectGruposName, setselectGruposName] = useState('');
  const [isopenModalViewConceptos, setisopenModalViewConceptos] = useState(false)

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
const TotalSolesBodyTemplate = (rowData)=>{
  return(
    <div>
      <NumberFormatMoney amount={rowData.suma_monto_PEN} symbol={''}/>
    </div>
  )
}
const TotalDolaresBodyTemplate = (rowData)=>{
  return(
    <div>
      {rowData.suma_monto_USD!=0?
      <NumberFormatMoney amount={rowData.suma_monto_USD}/>
      :
      ''
      }
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
const rowExpansionTemplate = (data) => {
  return (
      <div className="p-3">
          <h5>Egresos de {data.proveedor}</h5>
          <DataTable value={data.egresos}>
              <Column header="Id" body={IdBodyTemplate} sortable></Column>
              <Column header="Fecha de pago" body={FechaPagoTemplate} sortable></Column>
              <Column header="Descripcion" field='descripcion' sortable></Column>
              <Column header="N° Operacion" field='n_operacion' sortable></Column>
              <Column header="Monto"  sortable body={montoMonedaBodyTemplate}></Column>
              {/* <Column field="date" header="Date" sortable></Column> n_operacion
              <Column field="amount" header="Amount" body={amountBodyTemplate} sortable></Column>
              <Column field="status" header="Status" body={statusOrderBodyTemplate} sortable></Column>
              <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column> */}
          </DataTable>
      </div>
  );
};
const IdProvBodyTemplate =(rowData)=>{
  return (
    <div>
      {rowData.id_prov}
    </div>
  )
}
const OpenModalConceptos = (i)=>{
  setisopenModalViewConceptos(true)
  setselectGrupos(i)
  console.log(i);
  
  setselectGruposName(i.proveedor)
}

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
          selectionMode="single"
          selection={selectGrupos} onSelectionChange={(e)=>OpenModalConceptos(e.value)}
          scrollHeight="400px"
          >
          <Column header="ID" body={IdProvBodyTemplate}></Column>
          <Column header="PROVEEDOR" body={proveedorBodyTemplate}></Column>
          <Column header={<div className='d-flex w-50'>TOTAL S/.</div>} body={TotalSolesBodyTemplate}></Column>
          <Column header={<div className='d-flex w-50'>TOTAL $</div>} body={TotalDolaresBodyTemplate}></Column>
        </DataTable>
        <ModalIngresosGastos show={isOpenModalEgresos} onHide={onCloseModalIvsG} data={gastoxID} showToast={showToast} isLoading={isLoading}/>
        <ModalViewConceptos label_data={selectGruposName} data={selectGrupos} onHide={()=>setisopenModalViewConceptos(false)} show={isopenModalViewConceptos}/>
    </div>
  )
}

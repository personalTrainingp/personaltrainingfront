import { PageBreadcrumb } from '@/components'
import { FormatoDateMask } from '@/components/CurrencyMask'
import { useAuditoriaStore } from '@/hooks/hookApi/useAuditoriaStore'
import { useExtensionStore } from '@/hooks/hookApi/useExtensionStore'
import dayjs from 'dayjs'
import { FilterMatchMode, FilterOperator, locale } from 'primereact/api'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { Skeleton } from 'primereact/skeleton'
import React, { useEffect, useState } from 'react'
import { Row } from 'react-bootstrap'

export const GestCongelamientoMembresia = () => {
  locale('es')
  const [customers, setCustomers] = useState(null);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCustomers, setselectedCustomers] = useState([])
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  // const { obtenerGastos, obtenerProveedoresUnicos } = useGf_GvStore()
  // const {dataGastos, dataProvUnicosxGasto} = useSelector(e=>e.finanzas)
  const { obtenerExtensionEnTabla, dataExtension } = useExtensionStore()
  const [valueFilter, setvalueFilter] = useState([])
  useEffect(() => {
      obtenerExtensionEnTabla('CON')
  }, [])
      useEffect(() => {
      const fetchData = () => {
          setCustomers(getCustomers(dataExtension));
          setLoading(false);
      };
      fetchData()
      initFilters();
      }, [dataExtension]);
  const getCustomers = (data) => {
      return data.map(item => {
          // Crea una copia del objeto antes de modificarlo
          let newItem = { ...item };
          // Convertir la fecha a la zona horaria de Lima
          // Realiza las modificaciones en la copia
          // const [year, month, day] = item.extension_inicio.split('-').map(Number);
          // const [yearc=year, monthc=month, dayc=day] = item.fec_comprobante.split('-').map(Number)
          // const [yearr=year, monthr = month, dayr = day] = item.fec_registro.split('-').map(Number)
          // console.log(item.fec_registro);
          
          // let date = dayjs.utc(item.extension_inicio);
          // newItem.fec_registro = new Date(date.format());
          return newItem;
          });
  };
  const highlightText = (text, search) => {
      if (!search) {
          return text;
      }
      if (!text) {
          return text;
      }
      const regex = new RegExp(`(${search})`, 'gi');
      return text.split(regex).map((part, index) =>
          part.toLowerCase() === search.toLowerCase() ? (
              <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
          ) : (
              part
          )
      );
  };
  const formatDate = (value) => {
      return value.toLocaleDateString('es-PE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'America/Lima'
      });
  };
  const formatCurrency = (value, currency) => {
      return value.toLocaleString('en-ES', { style: 'currency', currency });
  };
  const clearFilter = () => {
      initFilters();
      setGlobalFilterValue('');
  };

  const onGlobalFilterChange = (e) => {
      const value = e.target.value;
      let _filters = { ...filters };

      _filters['global'].value = value;

      setFilters(_filters);
      setGlobalFilterValue(value);
  };
  const initFilters = () => {
      setFilters({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
          extension_inicio: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
          extension_fin: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
          descripcion: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      });
      // setGlobalFilterValue('');
  };
  const [showModalImportadorData, setshowModalImportadorData] = useState(false)
  const renderHeader = () => {
      return (
          <div className="d-flex justify-content-between">
              <div className='d-flex'>
                  <IconField iconPosition="left">
                      <InputIcon className="pi pi-search" />
                      <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscador general" />
                  </IconField>
                  <Button type="button" icon="pi pi-filter-slash" outlined onClick={clearFilter} />
              </div>
              <div className='d-flex'>
                  <Button label="IMPORTAR" icon='pi pi-file-import' onClick={()=>setshowModalImportadorData(true)} disabled text/>
                  {/* <ExportToExcel data={valueFilter}/> */}
              </div>
          </div>
      );
  };
  const valueFiltered = (e)=>{
      setvalueFilter(e)
  }
  const header = renderHeader();
  const IdBodyTemplate = (rowData)=>{
      return (
          <div className="flex align-items-center gap-2">
              <span>{highlightText(`${rowData.id}`, globalFilterValue)}</span>
          </div>
      )
  }
  const FechaInicioBodyTemplate = (rowData)=>{
    return (
        <div className="flex align-items-center gap-2">
            <span>{FormatoDateMask(rowData.extension_inicio, 'D [de] MMMM [del] YYYY')}</span>
        </div>
    )
}
const FechaFinBodyTemplate = (rowData)=>{
  return (
      <div className="flex align-items-center gap-2">
          <span>{FormatoDateMask(rowData.extension_fin, 'D [de] MMMM [del] YYYY')}</span>
      </div>
  )
}
  return (
      <>
          {
              dataExtension.length!==0?(
                  <>
                  <DataTable size='large' 
                      value={customers} 
                      paginator 
                      header={header}
                      rows={10} 
                      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                      rowsPerPageOptions={[10, 25, 50]} 
                      dataKey="id"
              selection={selectedCustomers}
                      onSelectionChange={(e) => setselectedCustomers(e.value)}
                      filters={filters} 
                      filterDisplay="menu" 
                      globalFilterFields={['Id', 'extension_inicio', 'extension_fin', 'observacion']} 
                      emptyMessage="Congelamientos no encontrados."
                      showGridlines 
                      loading={loading} 
                      stripedRows
                      scrollable
                      onValueChange={valueFiltered}
                      >
              <Column header="Id" field='id' filterField="id" sortable style={{ width: '1rem' }} filter body={IdBodyTemplate}/>
              <Column header="Inicio del congelamiento" field='extension_inicio' filterField="extension_inicio" sortable style={{ width: '1rem' }} filter body={FechaInicioBodyTemplate}/>
              <Column header="Fin del congelamiento" field='extension_fin' filterField="extension_fin" sortable style={{ width: '1rem' }} filter body={FechaFinBodyTemplate}/>
              <Column header="Observacion" field='observacion' filterField="observacion" sortable style={{ width: '1rem' }} filter/>
          </DataTable>
          
          </>
              )
              :(
                  //Array.from({ length: 10 }, (v, i) => i)
                  <DataTable size='large' 
                  value={Array.from({ length: 10 }, (v, i) => i)} 
                  className="p-datatable-striped"
                  >
                      <Column header="Id" style={{ width: '1rem' }} body={<Skeleton/>}/>
                      <Column header="Inicio de la extension" style={{ width: '3rem' }} body={<Skeleton/>} />
                      <Column header="Fin de la extension" style={{ width: '3rem' }} body={<Skeleton/>} />
                      <Column header="Observacion" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                  </DataTable>
              )
          }

      </>
  );
}

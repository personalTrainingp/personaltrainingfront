import { Table } from '@/components'
import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator, locale } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { ModalViewObservacion } from '../ModalViewObservacion';
import { arrayFacturas } from '@/types/type';
import { DateMaskString, FormatoDateMask, MoneyFormatter } from '@/components/CurrencyMask';
import dayjs from 'dayjs';


export const TodoVentas=({id_empresa})=> {
  
  locale('es')
  const { obtenerTablaVentas, dataVentas } = useVentasStore()
  useEffect(() => {
      obtenerTablaVentas(id_empresa)
  }, [])
  const [customers, setCustomers] = useState(null);
  const [valueFilter, setvalueFilter] = useState([])
    const [filters, setFilters] = useState({
      
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        fecha_venta: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        tipo_comprobante: {operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]},
        "tb_empleado.nombres_apellidos_empl": {operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]}
    });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        const fetchData = () => {
          setCustomers(getCustomers(dataVentas));
          setLoading(false);
        };
        fetchData()
        // initFilters();
    }, [dataVentas]);

    const getCustomers = (data) => {
        return [...(data || [])].map((d) => {
            // d.date = new Date(d.date);
            let newItem = {...d}
            let date = dayjs.utc(d.fecha_venta);
            newItem.fecha_venta = new Date(date.format());
            newItem.tipo_comprobante = arrayFacturas.find(e=>e.value===d.id_tipoFactura)?.label
            return newItem;
        });
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
          <>
                  <span className='font-24'>
                    Total de ventas: {valueFilter?.length==0?customers?.length-1:valueFilter?.length-1}
                  </span>
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscador general" />
                </IconField>
            </div>
          </>
        );
    };

    const totalVentasBodyTemplate = (rowData)=>{
      // const obj = {...rowData.detalle_ventaCitasrowData.detalle_ventaCitas, ...rowData.detalle_ventaMembresia, detalle_ventaProductos}
        // Combinar los arrays en un solo array
        const combinedArray = [
          ...rowData.detalle_ventaCitas,
          ...rowData.detalle_ventaMembresia,
          ...rowData.detalle_ventaProductos
        ];

        // Calcular la suma total de tarifa_monto
        const sumaTotal = combinedArray.reduce((total, item) => total + item.tarifa_monto, 0);

      return(
          <div className="flex align-items-center gap-2">
            
              <span>{<MoneyFormatter  amount={sumaTotal}/> }</span>
          </div>
      )
    }
    const formatCurrency = (value, currency) => {
      return value.toLocaleString('en-ES', { style: 'currency', currency });
  };
  const [viewVentas, setviewVentas] = useState(false)
  const [idVentas, setidVentas] = useState(0)
  const onModalviewVENTAS = (id)=>{
    setidVentas(id)
    setviewVentas(true)
  }
  const onModalCancelVENTAS = ()=>{
    setviewVentas(false)
  }
  const fechaDeComprobanteBodyTemplate = (rowData)=>{
    
    return (
      <div className="flex align-items-center gap-2">
          <span>{FormatoDateMask(rowData.fecha_venta, 'dddd D [de] MMMM [del] YYYY [a las] h:mm A')}</span>
      </div>
    )
  }
  const actionBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            <Button 
              rounded 
              className="mr-2 p-0 border-0 text-decoration-underline" 
              onClick={() => onModalviewVENTAS(rowData.id)} 
              >DETALLE DE LA VENTA</Button>
        </React.Fragment>
    );
};
const comprobanteBodyTemplate = (rowData)=>{
  return (
    <>
    { rowData.tipo_comprobante}
    </>
  )
}
const valueFiltered = (f)=>{
  setvalueFilter(f)
}
  console.log(valueFilter);
  
    const header = renderHeader();

    return (
        <>
          <DataTable value={customers} 
                  onValueChange={valueFiltered}
                        stripedRows paginator rows={10} dataKey="id" filters={filters} loading={loading}
                  globalFilterFields={["tb_cliente.nombres_apellidos_cli", "tb_empleado.nombres_apellidos_empl", "tipo_comprobante", "numero_transac"]} header={header} emptyMessage="No customers found.">
              <Column field="id" header="NUMERO DE OPERACION" filter filterPlaceholder="Search by name" style={{ minWidth: '5rem' }} />
              <Column field="fecha_venta" header="FECHA" filter filterPlaceholder="BUSCAR FECHA" style={{ minWidth: '8rem' }} body={fechaDeComprobanteBodyTemplate}/>
              <Column field="tb_cliente.nombres_apellidos_cli" header="SOCIOS" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
              <Column field="tb_empleado.nombres_apellidos_empl" header="ASESOR COMERCIAL" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
              <Column field="tipo_comprobante" header="COMPROBANTE" body={comprobanteBodyTemplate} filter filterPlaceholder="Buscar tipo de comprobante" style={{ minWidth: '12rem' }} />
              <Column field="numero_transac" header="Nº DE COMPR." filter filterPlaceholder="Search by name" style={{ maxWidth: '7rem' }} />
              <Column header="TOTAL" body={totalVentasBodyTemplate} style={{ minWidth: '12rem' }} />
              <Column header="" frozen style={{ minWidth: '12rem' }} body={actionBodyTemplate} />
          </DataTable>
          <ModalViewObservacion show={viewVentas} onHide={onModalCancelVENTAS} id={idVentas}/>
        </>
    );
}
        

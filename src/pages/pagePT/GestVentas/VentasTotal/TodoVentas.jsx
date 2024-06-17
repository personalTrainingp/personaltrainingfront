import { Table } from '@/components'
import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
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


export const TodoVentas=()=> {
  const { obtenerTablaVentas, dataVentas } = useVentasStore()
  useEffect(() => {
      obtenerTablaVentas()
  }, [])
  const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [representatives] = useState([
        { name: 'Amy Elsner', image: 'amyelsner.png' },
        { name: 'Anna Fali', image: 'annafali.png' },
        { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        { name: 'Onyama Limba', image: 'onyamalimba.png' },
        { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        { name: 'XuXue Feng', image: 'xuxuefeng.png' }
    ]);
    const [statuses] = useState(['unqualified', 'qualified', 'new', 'negotiation', 'renewal']);

    const getSeverity = (status) => {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warning';

            case 'renewal':
                return null;
        }
    };

    useEffect(() => {
        const fetchData = () => {
          setCustomers(getCustomers(dataVentas));
          setLoading(false);
        };
        fetchData()
        // initFilters();
    }, [dataVentas]); // eslint-disable-line react-hooks/exhaustive-deps

    const getCustomers = (data) => {
        return [...(data || [])].map((d) => {
            // d.date = new Date(d.date);

            return d;
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
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
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
              <span>{formatCurrency(sumaTotal, 'PEN')}</span>
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
  const actionBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            <Button 
              rounded 
              className="mr-2 p-0 border-0 text-decoration-underline" 
              onClick={() => onModalviewVENTAS(rowData.id)} 
              >Ver mas informacion</Button>
        </React.Fragment>
    );
};

    const header = renderHeader();

    return (
        <>
          <DataTable value={customers} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                  globalFilterFields={[]} header={header} emptyMessage="No customers found.">
              <Column field="id" header="Id" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
              <Column field="fecha_venta" header="Fecha" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
              <Column field="tb_cliente.nombres_apellidos_cli" header="Clientes" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
              <Column field="tb_empleado.nombres_apellidos_empl" header="Vendedor" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
              <Column field="id_tipoFactura" header="Comprobante" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
              <Column field="numero_transac" header="Nº de comprobante" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
              <Column header="Total" body={totalVentasBodyTemplate} style={{ minWidth: '12rem' }} />
              <Column header="Action" frozen style={{ minWidth: '12rem' }} body={actionBodyTemplate} />
          </DataTable>
          <ModalViewObservacion show={viewVentas} onHide={onModalCancelVENTAS} id={idVentas}/>
        </>
    );
}
        

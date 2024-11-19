import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { useAuditoriaStore } from '@/hooks/hookApi/useAuditoriaStore';
// import { CustomerService } from './service/CustomerService';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { FormatoDateMask } from '@/components/CurrencyMask';
import { typesCRUD } from '@/types/type';

dayjs.extend(utc);
export function Auditoria() {
    const [customers, setCustomers] = useState(null);
    const { obtenerAuditoriaTabla, dataAuditoria } = useAuditoriaStore()
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
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
        const fetchData = async()=>{
          await obtenerAuditoriaTabla()
        }
        fetchData()
        // obtenerAuditoriaTabla.then((data) => {
        //     setCustomers(getCustomers(data));
        //   });
          setLoading(false);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getCustomers = (data) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);

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
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscado general" />
                </IconField>
            </div>
        );
    };
    const usuarioAuthBodyTemplate = (rowData)=>{
      return `${rowData?.auth_user?.usuario_user||'Sin definido'}`
    }
    const ipAuthBodyTemplate = (rowData)=>{
      return rowData.ip_user
    }
    const actionBodyTemplate = (rowData)=>{
        
      return typesCRUD.find(e=>e.id === rowData.accion).method
    }
    const observacionBodyTemplate = (rowData)=>{
      return rowData.observacion
    }
    const fechaBodyTemplate = (rowData)=>{
        let date = dayjs.utc(rowData.fecha_audit)
      return FormatoDateMask(new Date(date.format()), 'D [de] MMMM [del] YYYY [a las] h:mm A')
    }

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable value={dataAuditoria} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                    globalFilterFields={['usuario', 'ip', 'accion', 'observacion', 'fecha_audit']} header={header} emptyMessage="Sin Registro de auditoria">
                <Column header="Usuario" body={usuarioAuthBodyTemplate} style={{ minWidth: '12rem' }} />
                <Column header="Ip" body={ipAuthBodyTemplate} style={{ minWidth: '12rem' }} />
                <Column header="Accion" body={actionBodyTemplate} style={{ maxWidth: '5rem' }} />
                <Column header="Observacion" body={observacionBodyTemplate} style={{ maxWidth: '20rem' }} />
                <Column header="Fecha de auditoria" body={fechaBodyTemplate} style={{ minWidth: '12rem' }} />
            </DataTable>
        </div>
    );
}
        
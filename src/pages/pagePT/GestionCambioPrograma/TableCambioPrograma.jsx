import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { useSelector } from 'react-redux';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';
import { Link } from 'react-router-dom';
import { arrayDistrito, arrayTipoCliente } from '@/types/type';
import { useGestionCambioProgramaStore } from './useGestionCambioProgramaStore';

export default function TableCambioPrograma() {
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const  { obtenerLosCambiosMembresia } = useGestionCambioProgramaStore()
    const {dataView} = useSelector(e=>e.DATA)
	const { Dataclientes } = useSelector(e=>e.authClient)
    useEffect(() => {
        obtenerLosCambiosMembresia()
    }, [])
        useEffect(() => {
        const fetchData = () => {
            setCustomers(getCustomers(Dataclientes));
            setLoading(false);
        };
        fetchData()
        initFilters();
        }, [Dataclientes]);
    const getCustomers = (data) => {
        return data.map(item => {
            // Crea una copia del objeto antes de modificarlo
            let newItem = { ...item };
            newItem.distrito = arrayDistrito.find(i => i.value === item.ubigeo_distrito)?.label;
            newItem.tipo_cliente = arrayTipoCliente.find(i => i.value === item.tipoCli_cli)?.label;
            // Realiza las modificaciones en la copia
            return newItem;
        });
    };
    const formatDate = (value) => {
        return value.toLocaleDateString('en-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    const clearFilter = () => {
        initFilters();
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
            ['nombres_apellidos_cli']: { value: null, matchMode: FilterMatchMode.CONTAINS },
            ['distrito']: { value: null, matchMode: FilterMatchMode.CONTAINS },
            ['email_cli']: { value: null, matchMode: FilterMatchMode.CONTAINS },
            ['tel_cli']: { value: null, matchMode: FilterMatchMode.CONTAINS },
            ['tipo_cliente']: { value: null, matchMode: FilterMatchMode.CONTAINS },
            // 'ProgramavsSemana': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        });
        setGlobalFilterValue('');
    };
    
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscador general" />
                </IconField>
                <Button type="button" icon="pi pi-filter-slash" label="Limpiar filtros" outlined onClick={clearFilter} />
            </div>
        );
    };
    
    const ProgramaSemanasBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData.tipo_cliente, globalFilterValue)}</span>
            </div>
        );
    };
    const telefonoBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData.tel_cli?`${rowData.tel_cli}`.replace(/ /g, "").match(/.{1,3}/g).join('-'):'', globalFilterValue)}</span>
            </div>
        );
    }
    const distritoBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData.distrito, globalFilterValue)}</span>
            </div>
        );
    }
    const verHistoryBodyTemplate = (rowData) => {
        return (
            <div>
                <Button icon='pi pi-trash'/>
            </div>
        );
    }

    const ClientesBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData.nombres_apellidos_cli, globalFilterValue)}</span>
            </div>
        );
    };
    const IdBodyTemplate = (rowData, { rowIndex })=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowIndex + 1}</span>
            </div>
        );
    }
    const emailBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData.email_cli, globalFilterValue)}</span>
            </div>
        );
    }
    
    const header = renderHeader();

    return (
            <DataTable  size='small' 
                        value={customers} 
                        paginator 
                        showGridlines 
                        rows={10} 
                        loading={loading} 
                        dataKey="id_cli" 
                        stripedRows
                        sortMode="multiple"
                        scrollable
                        filters={filters} 
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        rowsPerPageOptions={[10, 25, 50]} 
                        globalFilterFields={["id_cli", "nombres_apellidos_cli", "email_cli", "tel_cli", "distrito"]} 
                        header={header}
                        emptyMessage="SOCIOS NO ENCONTRADOS.">
                {/* <Column header="Tipo de gasto" filterField="tb_parametros_gasto.nombre_gasto" sortable style={{ minWidth: '10rem' }} body={tipoGastoBodyTemplate} filter /> */}
                {/* <Column header="Monto" filterField="monto" style={{ minWidth: '10rem' }} sortable body={montoBodyTemplate} filter/> */}
                <Column header="Id"  style={{ minWidth: '10rem' }} sortable body={IdBodyTemplate} filter/>
                <Column header="SOCIO"  style={{ minWidth: '10rem' }} sortable body={ClientesBodyTemplate} filter/>
                <Column header="FECHA DE CAMBIO DE PROGRAMA"  style={{ minWidth: '10rem' }} sortable body={ProgramaSemanasBodyTemplate} filter/>
                <Column header="PROGRAMA"  style={{ minWidth: '10rem' }} sortable body={emailBodyTemplate} filter/>
                <Column header="HORARIO"  style={{ minWidth: '10rem' }} sortable body={telefonoBodyTemplate} filter/>
                <Column header="MOTIVO"  style={{ minWidth: '10rem' }} sortable body={distritoBodyTemplate} filter/>
                <Column header="OBSERVACION"  style={{ minWidth: '10rem' }} sortable body={distritoBodyTemplate} filter/>

                {/* <Column header="Vencimiento" filterField="vencimiento_REGALOS_CONGELAMIENTO" sortable style={{ minWidth: '10rem' }} body={fecRegistroBodyTemplate} filter filterElement={dateFilterTemplate}  dataType="date" /> */}
                {/* <Column header="Proveedor" filterField="tb_Proveedor.razon_social_prov" style={{ minWidth: '10rem' }} sortable showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }}  
                body={proveedorBodyTemplate} filter filterElement={proveedorFilterTemplate} /> */}

                {/* <Column header="Estado" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={verHistoryBodyTemplate}/> */}
                <Column header="" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={verHistoryBodyTemplate}/>
            </DataTable>
    );
}



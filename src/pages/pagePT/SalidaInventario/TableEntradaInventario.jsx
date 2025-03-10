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
import { useEntradaInventario } from './useEntradaInventario';

export default function TableEntradaInventario({id_enterprice, action}) {
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const  { obtenerTablePrincipal } = useEntradaInventario()
	const { dataView } = useSelector(e=>e.DATA)
    useEffect(() => {
        obtenerTablePrincipal(action, id_enterprice)
    }, [])
        useEffect(() => {
        const fetchData = () => {
            setCustomers(getCustomers(dataView));
            setLoading(false);
        };
        fetchData()
        initFilters();
        }, [dataView]);
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
    
    const cantidadKardexBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData.cantidad, globalFilterValue)}</span>
            </div>
        );
    };
    const motivoBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData.parametro_motivo.label_param, globalFilterValue)}</span>
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
                <span>{highlightText(rowData.articulos_kardex?.producto, globalFilterValue)}</span>
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
    
    const fechaKardexBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData.fecha_cambio, globalFilterValue)}</span>
            </div>
        );
    }
    
    const observacionBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData.observacion, globalFilterValue)}</span>
            </div>
        );
    }
    const cantidadInicialBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData.articulos_kardex?.cantidad, globalFilterValue)}</span>
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
                        emptyMessage="Items NO ENCONTRADOS.">
                {/* <Column header="Tipo de gasto" filterField="tb_parametros_gasto.nombre_gasto" sortable style={{ minWidth: '10rem' }} body={tipoGastoBodyTemplate} filter /> */}
                {/* <Column header="Monto" filterField="monto" style={{ minWidth: '10rem' }} sortable body={montoBodyTemplate} filter/> */}
                <Column header="Id" filterField="id_cli" style={{ minWidth: '10rem' }} sortable body={IdBodyTemplate} filter/>
                <Column header="ITEM" filterField="nombres_apellidos_cli" style={{ minWidth: '10rem' }} sortable body={ClientesBodyTemplate} filter/>
                <Column header="CANTIDAD INICIAL" filterField={`tipo_cliente`} style={{ minWidth: '10rem' }} sortable body={cantidadInicialBodyTemplate} filter/>
                <Column header="CANTIDAD ENTRADA" filterField={`tipo_cliente`} style={{ minWidth: '10rem' }} sortable body={cantidadKardexBodyTemplate} filter/>
                <Column header="FECHA EN LA QUE ENTRO" filterField={`email_cli`} style={{ minWidth: '10rem' }} sortable body={fechaKardexBodyTemplate} filter/>
                <Column header="MOTIVO" filterField={`distrito`} style={{ minWidth: '10rem' }} sortable body={motivoBodyTemplate} filter/>
                <Column header="OBSERVACION" filterField={`distrito`} style={{ minWidth: '10rem' }} sortable body={observacionBodyTemplate} filter/>
                {/* <Column header="Vencimiento" filterField="vencimiento_REGALOS_CONGELAMIENTO" sortable style={{ minWidth: '10rem' }} body={fecRegistroBodyTemplate} filter filterElement={dateFilterTemplate}  dataType="date" /> */}
                {/* <Column header="Proveedor" filterField="tb_Proveedor.razon_social_prov" style={{ minWidth: '10rem' }} sortable showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }}  
                body={proveedorBodyTemplate} filter filterElement={proveedorFilterTemplate} /> */}

                {/* <Column header="Estado" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={verHistoryBodyTemplate}/> */}
                <Column header="" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={verHistoryBodyTemplate}/>
            </DataTable>
    );
}



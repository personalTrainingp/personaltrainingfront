import React, { useState, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { arrayDistrito, arrayTipoCliente } from '@/types/type';
import { useEntradaInventario } from './useEntradaInventario';

const initTable = {
  action: "",
  articulos_kardex: {producto: ''},
  cantidad: 0,
  fecha_cambio: "",
  observacion: "",
  parametro_motivo: {label_param: ''},
}

export default function TableEntradaInventario({id_enterprice, action}) {
    const [customers, setCustomers] = useState([initTable]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const  { obtenerTablePrincipal } = useEntradaInventario()
	let { dataView } = useSelector(e=>e.DATA)
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
            newItem.label_motivo=item.parametro_motivo?.label_param||''

            // Realiza las modificaciones en la copia
            return newItem;
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
            // ['nombres_apellidos_cli']: { value: null, matchMode: FilterMatchMode.CONTAINS },
            // ['distrito']: { value: null, matchMode: FilterMatchMode.CONTAINS },
            // ['email_cli']: { value: null, matchMode: FilterMatchMode.CONTAINS },
            // ['tel_cli']: { value: null, matchMode: FilterMatchMode.CONTAINS },
            // ['tipo_cliente']: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
                <span>{highlightText(rowData.label_motivo, globalFilterValue)}</span>
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
                <Column header="Id"style={{ minWidth: '10rem' }} sortable body={IdBodyTemplate} filter/>
                <Column header="ITEM"style={{ minWidth: '10rem' }} sortable body={ClientesBodyTemplate} filter/>
                <Column header="CANTIDAD INICIAL"style={{ minWidth: '10rem' }} sortable body={cantidadInicialBodyTemplate} filter/>
                <Column header="CANTIDAD ENTRADA" style={{ minWidth: '10rem' }} sortable body={cantidadKardexBodyTemplate} filter/>
                <Column header="FECHA EN LA QUE SALIO" style={{ minWidth: '10rem' }} sortable body={fechaKardexBodyTemplate} filter/>
                <Column header="MOTIVO" style={{ minWidth: '10rem' }} sortable body={motivoBodyTemplate} filter/>
                <Column header="OBSERVACION" style={{ minWidth: '10rem' }} sortable body={observacionBodyTemplate} filter/>
                <Column header="" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={verHistoryBodyTemplate}/>
            </DataTable>
    );
}



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
import { useProspectoLeadsStore } from '@/hooks/hookApi/useProspectoLeadsStore';
import dayjs from 'dayjs';

export default function TableClientes() {
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const  { obtenerProspectosLeads } = useProspectoLeadsStore()
	const { dataView } = useSelector(e=>e.DATA)
    useEffect(() => {
        obtenerProspectosLeads()
    }, [])
        useEffect(() => {
        const fetchData = () => {
            setCustomers(getCustomers(dataView));
            setLoading(false);
        };
        fetchData()
        initFilters();
        }, []);
    const getCustomers = (data) => {
        return data.map(item => {
            // Crea una copia del objeto antes de modificarlo
            let newItem = { ...item };
            newItem.estado_lead = item.parametro_estado_lead.label_param
            newItem.canal_lead = item.parametro_canal.label_param
            newItem.campania_lead = item.parametro_campania.label_param
            newItem.tipo_cliente = arrayTipoCliente.find(i => i.value === item.tipoCli_cli)?.label;
            // Realiza las modificaciones en la copia
            return newItem;
        });
    };
    console.log(dataView);
    
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
    
    const FechaRegistroBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{dayjs(rowData.fecha_registro ).format('DD [del] MMMM [del] YYYY')}</span>
            </div>
        );
    };
    const apellidosBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData.apellido_materno?rowData.apellido_materno:'', globalFilterValue)}</span>
            </div>
        );
    }
    const celularBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData.celular, globalFilterValue)}</span>
            </div>
        );
    }
    const verHistoryBodyTemplate = (rowData) => {
        return (
            <Link to={`/historial-cliente/${rowData.uid}`} className="action-icon" style={{fontSize: '14px', color: 'blue', textDecoration: 'underline'}}>
                Ver Historial
            </Link>
        );
    }
    const IdBodyTemplate = (rowData, { rowIndex })=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowIndex + 1}</span>
            </div>
        );
    }
    const nombreBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData.nombres, globalFilterValue)}</span>
            </div>
        );
    }
    const empleadoBodyTemplate = (rowData)=>{
        return (
            <>
            {rowData.empleado.nombres_apellidos_empl}
            </>
        )
    }
    const distritoBodyTemplate = (rowData)=>{
        return (
            <>
            {rowData.lead_distrito?.distrito}
            </>
        )
    }
    const estadoLeadBodyTemplate = (rowData)=>{
        return (
            <>
            {rowData.estado_lead}
            </>
        )
    }
    const fechaCitaBodyTemplate = (rowData)=>{
        return (
            <>
            {rowData.fecha_cita}
            </>
        )
    }
    const planBodyTemplate = (rowData)=>{
        return (
            <>
            {rowData.plan_lead}
            </>
        )
    }
    const campaniaBodyTemplate = (rowData)=>{
        return (
            <>
            {rowData.parametro_campania.label_param}
            </>
        )
    }
    const canalBodyTemplate = (rowData)=>{
        return (
            <>
            {rowData.parametro_canal.label_param}
            </>
        )
    }
    const header = renderHeader();

    return (
            <DataTable size='small' 
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
                        globalFilterFields={["id", "estado_lead", "nombres", "apellido_materno", "canal_lead", "campania_lead", "distrito"]} 
                        header={header}
                        emptyMessage="SOCIOS NO ENCONTRADOS.">
                {/* <Column header="Tipo de gasto" filterField="tb_parametros_gasto.nombre_gasto" sortable style={{ minWidth: '10rem' }} body={tipoGastoBodyTemplate} filter /> */}
                {/* <Column header="Monto" filterField="monto" style={{ minWidth: '10rem' }} sortable body={montoBodyTemplate} filter/> */}
                <Column header="Id" style={{ minWidth: '5rem' }} sortable body={IdBodyTemplate} filter/>
                <Column header="ASESOR" filterField="asesor" style={{ minWidth: '10rem' }} sortable body={empleadoBodyTemplate} filter/>
                <Column header="FECHA DE REGISTRO" style={{ minWidth: '10rem' }} sortable body={FechaRegistroBodyTemplate} filter/>
                <Column header="NOMBRE" style={{ minWidth: '10rem' }} sortable body={nombreBodyTemplate} filter/>
                <Column header="APELLIDOS" style={{ minWidth: '10rem' }} sortable body={apellidosBodyTemplate} filter/>
                <Column header="CELULAR" style={{ minWidth: '10rem' }} sortable body={celularBodyTemplate} filter/>
                <Column header="DISTRITO" style={{ minWidth: '10rem' }} sortable body={distritoBodyTemplate} filter/>
                <Column header="CANAL" style={{ minWidth: '10rem' }} sortable body={canalBodyTemplate} filter/>
                <Column header="CAMPAÑA" style={{ minWidth: '10rem' }} sortable body={campaniaBodyTemplate} filter/>
                <Column header="PLAN S/." style={{ minWidth: '10rem' }} sortable body={planBodyTemplate} filter/>
                <Column header="FECHA CITA" style={{ minWidth: '10rem' }} sortable body={fechaCitaBodyTemplate} filter/>
                <Column header="ESTADO" style={{ minWidth: '10rem' }} sortable body={estadoLeadBodyTemplate} filter/>
                {/* <Column header="Vencimiento" filterField="vencimiento_REGALOS_CONGELAMIENTO" sortable style={{ minWidth: '10rem' }} body={fecRegistroBodyTemplate} filter filterElement={dateFilterTemplate}  dataType="date" /> */}
                {/* <Column header="Proveedor" filterField="tb_Proveedor.razon_social_prov" style={{ minWidth: '10rem' }} sortable showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }}  
                body={proveedorBodyTemplate} filter filterElement={proveedorFilterTemplate} /> */}

                {/* <Column header="Estado" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={verHistoryBodyTemplate}/> */}
                <Column header="" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={verHistoryBodyTemplate}/>
            </DataTable>
    );
}



import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Calendar } from 'primereact/calendar';
import { useSelector } from 'react-redux';
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore';
import { MultiSelect } from 'primereact/multiselect';
import { ExportToExcel } from './BtnExportExcel';
import { Button } from 'primereact/button';
import { ModalIngresosGastos } from './ModalIngresosGastos';
import { confirmDialog } from 'primereact/confirmdialog';
import { helperFunctions } from '@/common/helpers/helperFunctions';
export default function AdvancedFilterDemo({showToast}) {
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedCustomers, setselectedCustomers] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const { obtenerGastos, obtenerProveedoresUnicos } = useGf_GvStore()
    const {dataGastos, dataProvUnicosxGasto} = useSelector(e=>e.finanzas)
    const [valueFilter, setvalueFilter] = useState([])
    useEffect(() => {
        obtenerGastos()
        obtenerProveedoresUnicos()
    }, [])
        useEffect(() => {
        const fetchData = () => {
            setCustomers(getCustomers(dataGastos));
            setLoading(false);
        };
        fetchData()
        initFilters();
        }, [dataGastos]);
        
    const getCustomers = (data) => {
        return data.map(item => {
            // Crea una copia del objeto antes de modificarlo
            let newItem = { ...item };
            // Realiza las modificaciones en la copia
            newItem.fec_registro = new Date(item.fec_registro);
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
    const formatCurrency = (value, currency) => {
        return value.toLocaleString('en-ES', { style: 'currency', currency });
    };
    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const { obtenerGastoxID, gastoxID, isLoading, startDeleteGasto } = useGf_GvStore()
    const actionBodyTemplate = (rowData)=>{
        const onClickEditModalEgresos = ()=>{
            onOpenModalIvsG()
            obtenerGastoxID(rowData.id)
        }
        const confirmDeleteGastoxID = ()=>{
            confirmDialog({
                message: 'Seguro que quiero eliminar el gasto?',
                header: 'Eliminar gasto',
                icon: 'pi pi-info-circle',
                defaultFocus: 'reject',
                acceptClassName: 'p-button-danger',
                accept:  onAcceptDeleteGasto,
            });
        }
        
        const onAcceptDeleteGasto = async()=>{
            console.log(rowData.id);
            await startDeleteGasto(rowData.id)
            showToast('success', 'Eliminar gasto', 'Gasto Eliminado correctamente', 'success')
        }
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" 
                onClick={onClickEditModalEgresos} 
                />
                <Button icon="pi pi-trash" rounded outlined severity="danger" 
                onClick={confirmDeleteGastoxID} 
                />
            </React.Fragment>
        );
    }

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            ['tb_Proveedor.razon_social_prov']:{ value: null, matchMode: FilterMatchMode.IN },
            fec_registro: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            'tb_parametros_gasto.nombre_gasto': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'tb_parametros_gasto.grupo': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            descripcion: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            monto: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
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
    
    const montoBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{formatCurrency(rowData.monto, rowData.moneda?rowData.moneda:'PEN')}</span>
            </div>
        );
    };

    const descripcionBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.descripcion}</span>
            </div>
        );
    };
    const {daysUTC} = helperFunctions()
    const fecRegistroBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{daysUTC(new Date(rowData.fec_registro))}</span>
            </div>
        );
    }
    const proveedorBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData?.tb_Proveedor?.razon_social_prov?rowData.tb_Proveedor.razon_social_prov:'SIN'}</span>
            </div>
        );
    }
    const tipoGastoBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.tb_parametros_gasto?.nombre_gasto?rowData.tb_parametros_gasto?.nombre_gasto:'SIN'}</span>
            </div>
        );
    };
    const grupoBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.tb_parametros_gasto?.grupo}</span>
            </div>
        );
    };
    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };
    
    const proveedorFilterTemplate = (options) => {
        return <MultiSelect value={options.value} options={dataProvUnicosxGasto} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="razon_social_prov" optionValue='razon_social_prov' placeholder="Any" className="p-column-filter" />;
    };
    
    const representativesItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{option['razon_social_prov']}</span>
            </div>
        );
    };
    const valueFiltered = (e)=>{
        setvalueFilter(e)
    }
    const header = renderHeader();
    const [isOpenModalEgresos, setisOpenModalEgresos] = useState(false)
    const onCloseModalIvsG = ()=>{
        setisOpenModalEgresos(false)
    }
    const onOpenModalIvsG = ()=>{
        setisOpenModalEgresos(true)
    }
    return (
        <div className="card">
            {/* <Button onClick={onExportExcelPersonalized}>Exportar excel personalizado</Button> */}
            {/* <BtnExportExcel csvData={valueFilter} fileName={'Gastos'}/> */}
            <ExportToExcel data={valueFilter}/>
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
                        globalFilterFields={['fec_pago', 'id_prov', 'tb_parametros_gasto.nombre_gasto', 'descripcion', 'monto', 'moneda', ['tb_Proveedor.razon_social_prov'],"fec_registro"]} 
                        emptyMessage="Egresos no encontrados."
                        // showGridlines 
                        loading={loading} 
                        stripedRows
                        // sortMode="multiple"
                        onValueChange={valueFiltered}
                        >
                <Column header="Fecha registro" field='fec_registro' filterField="fec_registro" sortable dataType="date" style={{ width: '3rem' }} body={fecRegistroBodyTemplate} filter filterElement={dateFilterTemplate} />
                <Column header="Gasto" field='tb_parametros_gasto.nombre_gasto' filterField="tb_parametros_gasto.nombre_gasto" sortable style={{ minWidth: '10rem' }} body={tipoGastoBodyTemplate} filter />
                <Column header="Grupo" field='tb_parametros_gasto.grupo' filterField="tb_parametros_gasto.grupo" style={{ minWidth: '10rem' }} sortable body={grupoBodyTemplate} filter/>
                <Column header="Monto" field='monto' filterField="monto" style={{ minWidth: '10rem' }} sortable body={montoBodyTemplate} filter/>
                <Column header="descripcion" field='descripcion' filterField="descripcion" style={{ minWidth: '10rem' }} sortable body={descripcionBodyTemplate} filter/>
                <Column header="Proveedor" field='tb_Proveedor.razon_social_prov' filterField="tb_Proveedor.razon_social_prov" style={{ minWidth: '10rem' }} sortable showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }}  
                body={proveedorBodyTemplate} filter filterElement={proveedorFilterTemplate} />

                <Column header="Action" filterField="id" style={{ minWidth: '10rem' }} frozen body={actionBodyTemplate}/>
            </DataTable>
            
        <ModalIngresosGastos show={isOpenModalEgresos} onHide={onCloseModalIvsG} data={gastoxID} isLoading={isLoading}/>
        </div>
    );
}
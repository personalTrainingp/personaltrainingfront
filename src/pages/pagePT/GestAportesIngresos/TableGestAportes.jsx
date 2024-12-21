import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator, locale } from 'primereact/api';
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
import { confirmDialog } from 'primereact/confirmdialog';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import { arrayCargoEmpl, arrayFinanzas } from '@/types/type';
import dayjs from 'dayjs';
import { FormatoDateMask, FUNMoneyFormatter } from '@/components/CurrencyMask';
import utc from 'dayjs/plugin/utc';
import { Skeleton } from 'primereact/skeleton';
import { Col, Modal, Row } from 'react-bootstrap';
import { ModalImportadorData } from './ModalImportadorData';
import { ModalAportante } from './ModalAportante';
import { useAportesIngresosStore } from '@/hooks/hookApi/useAportesIngresosStore';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
dayjs.extend(utc);
export default function TableGestAportes({showToast}) {
    locale('es')
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedCustomers, setselectedCustomers] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const {dataView} = useSelector(e=>e.DATA)
    const { startRegistrarAportes, obtenerAportes, isLoading } = useAportesIngresosStore()
    const [valueFilter, setvalueFilter] = useState([])
    useEffect(() => {
        obtenerAportes()
    }, [])
        useEffect(() => {
            if(dataView.length<=0){
                const fetchData = () => {
                    setCustomers(getCustomers(dataView));
                };
                fetchData()
                initFilters();
            }
        }, [dataView]);
    const getCustomers = (data) => {
        return data.map(item => {
            // Crea una copia del objeto antes de modificarlo
            let newItem = { ...item };
            // Convertir la fecha a la zona horaria de Lima
            // Realiza las modificaciones en la copia
            const [year, month, day] = item.fecha_aporte.split('-').map(Number);
            const [yearc=year, monthc=month, dayc=day] = item.fec_comprobante.split('-').map(Number)
            // const [yearr=year, monthr = month, dayr = day] = item.fec_registro.split('-').map(Number)
            // console.log(item.fec_registro);
            
            let date = dayjs.utc(item.fecha_aporte);
            newItem.fec_registro = new Date(date.format());
            newItem.fec_comprobante =new Date(yearc, monthc-1, dayc);
            newItem.fecha_aporte = new Date(year, month - 1, day);
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
    const [showLoading, setshowLoading] = useState(false)
    const { aportexID, obtenerAportexID } = useAportesIngresosStore()
    const actionBodyTemplate = (rowData)=>{
        const onClickEditModalEgresos = ()=>{
            onOpenModalIvsG()
            obtenerAportexID(rowData.id)
        }
        const confirmDeleteGastoxID = ()=>{
            confirmDialog({
                message: 'Seguro que quiero eliminar el Aporte?',
                header: 'Eliminar aporte',
                icon: 'pi pi-info-circle',
                defaultFocus: 'reject',
                acceptClassName: 'p-button-danger',
                accept:  onAcceptDeleteGasto,
            });
        }
        
        const onAcceptDeleteGasto = async()=>{
            setshowLoading(true)
            // await startDeleteGasto(rowData.id)
            setshowLoading(false)
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
            id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            ['tb_Proveedor.razon_social_prov']:{ operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            fecha_aporte: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            fec_comprobante: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            observacion: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            monto_aporte: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
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
                    <ExportToExcel data={valueFilter}/>
                </div>
            </div>
        );
    };
    const fecPagoBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                
                {/* <span>{formatDate(rowData.fec_pago) }</span> */}
                <span>{FormatoDateMask(rowData.fecha_aporte, 'D [de] MMMM [del] YYYY') }</span>
            </div>
        );
    }
    const observacionAporteBodyTemplate = (rowData)=>{
        return(
            <>
                {rowData.observacion}
            </>
        )
    }
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
    const IdBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(`${rowData.id}`, globalFilterValue)}</span>
            </div>
        )
    }
    const fecComprobanteBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{new Date(rowData.fec_comprobante).getFullYear()===1900? '': FormatoDateMask(rowData.fec_comprobante, 'D [de] MMMM [del] YYYY')}</span>
            </div>
        )
    }
    const montoBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(FUNMoneyFormatter(rowData.monto_aporte, rowData.moneda=='PEN'?<><SymbolSoles isbottom={false}/> </>:'$ '), globalFilterValue)}</span>
            </div>
        );
    };
    return (
        <>
            {
                showLoading&&
                <Modal size='sm' show={showLoading}>
                    <Modal.Body>
                    <div className='d-flex flex-column align-items-center justify-content-center text-center' style={{height: '15vh'}}>
                            <span className="loader-box2"></span>
                            <br/>
                            <p className='fw-bold font-16'>
                                Si demora mucho, comprobar su conexion a internet
                            </p>
                    </div>
                    </Modal.Body>
                </Modal> 
            }
            {
                !loading?(
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
                        globalFilterFields={[]} 
                        emptyMessage="Aportes no encontrados."
                        showGridlines 
                        loading={loading} 
                        stripedRows
                        scrollable
                        onValueChange={valueFiltered}
                        >
                <Column header="Id" field='id' filterField="id" sortable style={{ width: '1rem' }} filter body={IdBodyTemplate}/>
                <Column header="Fecha del aporte" field='fecha_aporte' filterField="fecha_aporte" sortable dataType="date" style={{ width: '3rem' }} body={fecPagoBodyTemplate} filter />
                <Column header="Fecha de comprobante" field='fec_comprobante' filterField="fec_comprobante" style={{ minWidth: '10rem' }} sortable body={fecComprobanteBodyTemplate} dataType="date" filter/>
                <Column header="Monto" field='monto_aporte' filterField="monto_aporte" sortable style={{ width: '3rem' }} body={montoBodyTemplate} filter/>
                <Column header="Observacion" field='observacion' filterField="observacion" style={{ minWidth: '10rem' }} sortable body={observacionAporteBodyTemplate} filter/>
                <Column header="Action" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={actionBodyTemplate}/>
            </DataTable>
            
            <ModalAportante show={isOpenModalEgresos} onShow={onOpenModalIvsG} onHide={onCloseModalIvsG} data={aportexID} showToast={showToast} isLoading={isLoading}/>
            <ModalImportadorData onHide={()=>setshowModalImportadorData(false)} onShow={showModalImportadorData}/>
            </>
                )
                :(
                    //Array.from({ length: 10 }, (v, i) => i)
                    <DataTable size='large' 
                    value={Array.from({ length: 10 }, (v, i) => i)} 
                    className="p-datatable-striped"
                    >
                        <Column header="Id" style={{ width: '1rem' }}/>
                        <Column header="Fecha registro" style={{ width: '3rem' }} body={<Skeleton/>} />
                        {/* <Column header="Fecha pago" style={{ width: '3rem' }} body={<Skeleton/>} />
                        <Column header="Fecha de comprobante" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Tipo de gasto" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Gasto" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Grupo" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Monto" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="descripcion" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Proveedor" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Action" style={{ minWidth: '10rem' }} body={<Skeleton/>}/> */}
                    </DataTable>
                )
            }

        </>
    );
}
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
import { ModalInventario } from './ModalInventario';
import { confirmDialog } from 'primereact/confirmdialog';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import { arrayCargoEmpl, arrayFinanzas } from '@/types/type';
import dayjs from 'dayjs';
import { FormatoDateMask, FUNMoneyFormatter, MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import utc from 'dayjs/plugin/utc';
import { Skeleton } from 'primereact/skeleton';
import { Card, Col, Modal, Row } from 'react-bootstrap';
import { ModalImportadorData } from './BtnImportarData/ModalImportadorData';
import { useInventarioStore } from '@/hooks/hookApi/useInventarioStore';
import config from '@/config';
import { Image } from 'primereact/image';
import sinImage from '@/assets/images/SinImage.jpg'
import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
dayjs.extend(utc);
export default function TableInventario({showToast, id_enterprice, id_zona}) {
    locale('es')
    console.log({id_enterprice});
    
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedCustomers, setselectedCustomers] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const { obtenerArticulos, isLoading, EliminarArticulo } = useInventarioStore()
    const {dataView} = useSelector(e=>e.DATA)
    const [valueFilter, setvalueFilter] = useState([])
    useEffect(() => {
        obtenerArticulos(id_enterprice, true)
        // obtenerProveedoresUnicos()
    }, [id_enterprice])
        useEffect(() => {
            if(dataView.length>=0){
                const fetchData = () => {
                    setCustomers(getCustomers(dataView));
                    setLoading(false);
                };
                fetchData()
                initFilters();
            }
        }, [dataView]);
    const getCustomers = (data) => {
        return data?.map(item => {
            // Crea una copia del objeto antes de modificarlo
            let newItem = { ...item };
            // Convertir la fecha a la zona horaria de Lima
            // Realiza las modificaciones en la copia
            // const [year, month, day] = item.fec_pago.split('-').map(Number);
            // const [yearc=year, monthc=month, dayc=day] = item.fec_comprobante.split('-').map(Number)
            // const [yearr=year, monthr = month, dayr = day] = item.fec_registro.split('-').map(Number)
            // console.log(item.fec_registro);
            
            let date = dayjs.utc(item.fec_registro);
            // newItem.fec_registro = new Date(date.format());
            // newItem.fec_comprobante =new Date(yearc, monthc-1, dayc);
            // newItem.fec_pago = new Date(year, month - 1, day);
            // newItem.tipo_gasto = arrayFinanzas.find(e=>e.value === item?.tb_parametros_gasto?.id_tipoGasto)?.label
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
    // const { obtenerGastoxID, gastoxID, isLoading, startDeleteGasto, setgastoxID } = useGf_GvStore()
    const { obtenerArticulo, articulo, setArticulo } = useInventarioStore()
    const [showLoading, setshowLoading] = useState(false)
    const actionBodyTemplate = (rowData)=>{
        const onClickEditModalEgresos = ()=>{
            onOpenModalIvsG()
            obtenerArticulo(rowData.id)
        }
        const confirmDeleteGastoxID = ()=>{
            confirmDialog({
                message: 'Seguro que quiero eliminar el item?',
                header: 'Eliminar item',
                icon: 'pi pi-info-circle',
                defaultFocus: 'reject',
                acceptClassName: 'p-button-danger',
                accept:  onAcceptDeleteGasto,
            });
        }
        const onAcceptDeleteGasto = async()=>{
            setshowLoading(true)
            await EliminarArticulo(rowData.id, id_enterprice)
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
            id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            ['tb_Proveedor.razon_social_prov']:{ operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            fec_registro: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            fec_pago: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            fec_comprobante: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            'tb_parametros_gasto.nombre_gasto': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            'tb_parametros_gasto.grupo': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            descripcion: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            tipo_gasto: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            monto: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        });
        // setGlobalFilterValue('');
    };
    const [showModalImportadorData, setshowModalImportadorData] = useState(false)
    const onOpenModalImportadorData = ()=>{
        setshowModalImportadorData(true)
        
    }
    const onCloseModalImportadorData = ()=>{
        setshowModalImportadorData(false)
    }
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
                    <Button label="IMPORTAR" icon='pi pi-file-import' onClick={onOpenModalImportadorData} text/>
                    <ExportToExcel data={valueFilter}/>
                </div>
            </div>
        );
    };
    
    const imagenBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                        <Image src={rowData.tb_images.length===0?sinImage:`${config.API_IMG.AVATAR_ARTICULO}${rowData.tb_images[rowData.tb_images.length-1]?.name_image}`} className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="170" />
            </div>
        );
    }
    const marcaBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2 font-24">
                
                {/* <span>{formatDate(rowData.fec_pago) }</span> */}
                <span>{rowData.parametro_marca?.label_param}</span>
            </div>
        );
    }
    const lugarBodyTemplate = (rowData)=>{
        return (
            <div className="gap-2 font-24">
                
                {/* <span>{formatDate(rowData.fec_pago) }</span> */}
                {/* <div>NIVEL {rowData.parametro_nivel?.label_param}</div> */}

                <div>{rowData.parametro_lugar_encuentro?.label_param}</div>
            </div>
        );
    }
    const descripcionBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2 font-24">
                
                {/* <span>{formatDate(rowData.fec_pago) }</span> */}
                <>{rowData.descripcion}</>
                <br/>
                {highlightText( `${rowData.observacion}`, globalFilterValue)}
            </div>
        );
    }
    const cantidadBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-end w-50 gap-2 justify-content-end font-24">
                <span>{highlightText( `${rowData.cantidad}`, globalFilterValue)}</span>
            </div>
        );
    };
    // const valorUnitDeprecBodyTemplate = (rowData) => {
    //     return (
    //         <div className="flex align-items-end w-50 gap-2 justify-content-end font-24">
    //             <><MoneyFormatter amount={rowData.valor_unitario_depreciado}/></>
    //         </div>
    //     );
    // };
    const costounitariosolesBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-end w-50 gap-2 justify-content-end font-24 border-0"  style={{width: '100px'}}>
                <> <NumberFormatMoney amount={rowData.costo_unitario}/></>
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
    const IdBodyTemplate = (rowData, { rowIndex })=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(`${rowIndex+1}`, globalFilterValue)}</span>
            </div>
        )
    }
    const observacionBodyTemplate = (rowData)=>{
        return (
            
            <div className="flex align-items-center gap-2 font-24">
                <span>{highlightText( `${rowData.observacion}`, globalFilterValue)}</span>
            </div>
        )
    }
    const ItemBodyTemplate = (rowData)=>{
        return (
            
            <div className="flex align-items-center gap-2 font-24">
                <span>{rowData.producto}</span>
            </div>
        )
    }
    const costototaldolaresBodyTemplate = (rowData)=>{
        return (
            
            <div className="d-flex font-24" >
                <div className='text-right text-color-dolar fw-bold' style={{marginLeft: '30px'}}>
                    <NumberFormatMoney amount={rowData.costo_total_dolares}/>
                </div>
            </div>
        )
    }
    const costounitariodolaresBodyTemplate = (rowData)=>{
        return (
            
            <div className="d-flex font-24" >
                <div className='text-right text-color-dolar fw-bold' style={{marginLeft: '30px'}}>
                    <NumberFormatMoney amount={rowData.costo_unitario_dolares}/>
                </div>
            </div>
        )
    }
    
        const costoManoObraBodyTemplate = (rowData)=>{
            return (
                
                <div className="d-flex font-24" >
                    <div className='text-right fw-bold' style={{marginLeft: '30px'}}>
                        <NumberFormatMoney amount={rowData.mano_obra_soles}/>
                    </div>
                </div>
            )
        }
    const costototalsolesBodyTemplate = (rowData)=>{
        return (
            
            <div className="flex align-items-center gap-2 font-24">
                <span><NumberFormatMoney amount={rowData.costo_total_soles}/></span>
            </div>
        )
    }
    const onOpenModalGastos = (e)=>{
        setArticulo(undefined)
        onOpenModalIvsG(e)
    }
    return (
        <>
                    <div>
                        <Button label="AGREGAR NUEVO" severity="success" raised onClick={onOpenModalGastos} />
                    </div>
                    <DataTable 
                        size='small' 
                        className='dataTable-verticals-lines'
                        value={customers} 
                        paginator 
                        header={header}
                        rows={10} 
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        rowsPerPageOptions={[10, 25, 50, 100, 250]} 
                        dataKey="id"
				        selection={selectedCustomers}
                        onSelectionChange={(e) => setselectedCustomers(e.value)}
                        filters={filters} 
                        filterDisplay="menu" 
                        globalFilterFields={['id', "parametro_lugar_encuentro.label_param", 'producto', 'marca', 'descripcion', 'observacion', 'cantidad', 'valor_unitario_depreciado', "valor_unitario_actual","lugar_compra_cotizacion"]} 
                        emptyMessage="ARTICULOS NO ENCONTRADOS."
                        showGridlines={true}
                        loading={loading} 
                        stripedRows
                        scrollable
                        onValueChange={valueFiltered}
                        >
                <Column header={<span className={'font-24'}>Id</span>} field='id' filterField="id" sortable style={{ width: '1rem' }} filter body={IdBodyTemplate}/>
                <Column header={<span className={'font-24'}>FOTO</span>} style={{ width: '3rem' }} body={imagenBodyTemplate}/>
                <Column header={<span className={'font-24'}>ITEM</span>} field='producto' filterField="producto" sortable style={{ width: '3rem'}} body={ItemBodyTemplate} filter/>
                <Column header={<span className={'font-24'}>MARCA</span>} field='marca' filterField="marca" sortable style={{ width: '3rem' }} body={marcaBodyTemplate} filter/>
                {/* <Column header={<span className={'font-24'}>INVENTARIO</span>} field='marca' filterField="marca" sortable style={{ width: '3rem' }} body={marcaBodyTemplate} filter/> */}
                <Column header={<span className={'font-24'}>UBICACION</span>} field='parametro_lugar_encuentro.label_param' filterField="parametro_lugar_encuentro.label_param" style={{ minWidth: '10rem' }} sortable body={lugarBodyTemplate} filter/>
                <Column header={<span className={'font-24'}>CANT. </span>} field='cantidad' filterField="cantidad" sortable style={{ minWidth: '5rem' }} body={cantidadBodyTemplate} />
                <Column header={<div className={'font-24'} style={{width: '100px'}}>COSTO UNIT. <SymbolSoles isbottom={false}/></div>} field='costo_unitario' filterField="costo_unitario" style={{ minWidth: '10rem' }} sortable body={costounitariosolesBodyTemplate} filter/>
                <Column header={<div className={'font-24'} style={{width: '100px'}}>COSTO UNIT. <SymbolDolar isbottom={false}/></div>} field='costo_unitario' filterField="costo_unitario" style={{ minWidth: '10rem' }} sortable body={costounitariodolaresBodyTemplate} filter/>
                <Column header={<div className={'font-24'} style={{width: '100px'}}>COSTO MANO OBRA</div>} field='valor_total_dolares' filterField="valor_total_dolares" style={{ minWidth: '10rem' }} sortable body={costoManoObraBodyTemplate} filter/>
                <Column header={<div className={'font-24'} style={{width: '130px'}}>COSTO TOTAL <SymbolSoles isbottom={false}/></div>} field='costo_total_soles' filterField="costo_total_soles" style={{ minWidth: '10rem' }} sortable body={costototalsolesBodyTemplate} filter/>
                {/* <Column header={<div className={'font-24'} style={{width: '100px'}}>COSTO UNIT. $</div>} field='valor_unitario_actual' filterField="valor_unitario_actual" style={{ minWidth: '10rem' }} sortable body={valorUnitActualDolaresBodyTemplate} filter/> */}
                <Column header={<div className={'font-24 text-color-dolar fw-bold'} style={{width: '100px'}}>COSTO TOTAL $</div>} field='valor_total_dolares' filterField="valor_total_dolares" style={{ minWidth: '10rem' }} sortable body={costototaldolaresBodyTemplate} filter/>
                <Column header={<span className={'font-24'}>DESCRIPCION</span>} field='descripcion' filterField="descripcion" style={{ minWidth: '10rem' }} sortable body={descripcionBodyTemplate} filter/>
                {/* <Column header={<span className={'font-24'}>OBSERVACION</span>}field='observacion' filterField='observacion' style={{ minWidth: '10rem' }} sortable body={observacionBodyTemplate} filter/> */}
                <Column header="" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={actionBodyTemplate}/>
            </DataTable>
            <ModalInventario id_enterprice={id_enterprice} id_zona={id_zona} show={isOpenModalEgresos} onShow={onOpenModalIvsG} onHide={onCloseModalIvsG} data={articulo} showToast={showToast} isLoading={isLoading}/>
            <ModalImportadorData onHide={onCloseModalImportadorData} onShow={showModalImportadorData}/>
            </>
    );
}









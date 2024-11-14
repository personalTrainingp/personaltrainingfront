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
import { FormatoDateMask, FUNMoneyFormatter, MoneyFormatter } from '@/components/CurrencyMask';
import utc from 'dayjs/plugin/utc';
import { Skeleton } from 'primereact/skeleton';
import { Card, Col, Modal, Row } from 'react-bootstrap';
import { ModalImportadorData } from './ModalImportadorData';
import { useInventarioStore } from '@/hooks/hookApi/useInventarioStore';
import config from '@/config';
import { Image } from 'primereact/image';
dayjs.extend(utc);
export default function TableInventario({showToast, id_enterprice}) {
    locale('es')
    
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedCustomers, setselectedCustomers] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const { obtenerArticulos, isLoading } = useInventarioStore()
    const {dataView} = useSelector(e=>e.DATA)
    const [valueFilter, setvalueFilter] = useState([])
    useEffect(() => {
        obtenerArticulos(id_enterprice)
        // obtenerProveedoresUnicos()
    }, [id_enterprice])
        useEffect(() => {
        const fetchData = () => {
            setCustomers(getCustomers(dataView));
            setLoading(false);
        };
        fetchData()
        initFilters();
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
    const [showLoading, setshowLoading] = useState(false)
    const actionBodyTemplate = (rowData)=>{
        const onClickEditModalEgresos = ()=>{
            onOpenModalIvsG()
            // obtenerGastoxID(rowData.id)
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
            setshowLoading(true)
            // await startDeleteGasto(rowData.id, id_enterprice)
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
    
    const lugarCompraBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData.lugar_compra_cotizacion, globalFilterValue)}</span>
            </div>
        );
    };
    const {daysUTC} = helperFunctions()
    const productoBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{ FormatoDateMask(rowData.fec_registro, 'dddd D [de] MMMM [del] YYYY [a las] h:mm A') }</span>
            </div>
        );
    }
    const imagenBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                        <Image src={`${config.API_IMG.AVATAR_ARTICULO}${rowData.tb_image?.name_image}`} className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="170" />
                {/* <img src={`${config.API_IMG.AVATAR_ARTICULO}${rowData.tb_image.name_image}`}/>
                `${proveedor.tb_image?.length!==0?`${config.API_IMG.AVATARES_PROV}${proveedor.tb_image?.name_image}`:sinAvatar}`
                */}
            </div>
        );
    }
    const marcaBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                
                {/* <span>{formatDate(rowData.fec_pago) }</span> */}
                <span>{rowData.parametro_marca?.label_param}</span>
            </div>
        );
    }
    const lugarBodyTemplate = (rowData)=>{
        return (
            <div className="gap-2">
                
                {/* <span>{formatDate(rowData.fec_pago) }</span> */}
                <div>NIVEL {rowData.parametro_nivel?.label_param}</div>

                <div>{rowData.parametro_lugar_encuentro?.label_param}</div>
            </div>
        );
    }
    const descripcionBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                
                {/* <span>{formatDate(rowData.fec_pago) }</span> */}
                <span>{rowData.descripcion}</span>
            </div>
        );
    }
    const cantidadBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-end w-50 gap-2 justify-content-end">
                <span>{highlightText( rowData.cantidad, globalFilterValue)}</span>
            </div>
        );
    };
    const valorUnitDeprecBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span><MoneyFormatter amount={rowData.valor_unitario_depreciado}/></span>
            </div>
        );
    };
    const valorUnitActualBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span> <MoneyFormatter amount={rowData.valor_unitario_actual}/></span>
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
    const IdBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(`${rowData.id}`, globalFilterValue)}</span>
            </div>
        )
    }
    const observacionBodyTemplate = (rowData)=>{
        return (
            
            <div className="flex align-items-center gap-2">
                <span>{highlightText( `${rowData.observacion}`, globalFilterValue)}</span>
            </div>
        )
    }
    const valorTotalBodyTemplate = (rowData)=>{
        return (
            
            <div className="flex align-items-center gap-2">
                <span><MoneyFormatter amount={rowData.valor_total}/></span>
            </div>
        )
    }
    const onOpenModalGastos = (e)=>{
        // setgastoxID(undefined)
        onOpenModalIvsG(e)
    }
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
                !isLoading?(
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
                        globalFilterFields={['id', 'producto', 'marca', 'descripcion', 'observacion', 'cantidad', 'valor_unitario_depreciado', "valor_unitario_actual","lugar_compra_cotizacion"]} 
                        emptyMessage="ARTICULOS NO ENCONTRADOS."
                        showGridlines={true}
                        loading={loading} 
                        stripedRows
                        scrollable
                        onValueChange={valueFiltered}
                        >
                <Column header="Id" field='id' filterField="id" sortable style={{ width: '1rem' }} filter body={IdBodyTemplate}/>
                <Column header="IMAGEN" style={{ width: '3rem' }} body={imagenBodyTemplate}/>
                <Column header="ARTICULO" field='producto' filterField="producto" sortable style={{ width: '3rem' }} filter/>
                <Column header="CANTIDAD" field='cantidad' filterField="cantidad" sortable style={{ minWidth: '10rem' }} body={cantidadBodyTemplate} filter />
                <Column header="MARCA" field='marca' filterField="marca" sortable style={{ width: '3rem' }} body={marcaBodyTemplate} filter/>
                <Column header="UBICACION" field='parametro_lugar_encuentro.label_param' filterField="parametro_lugar_encuentro.label_param" style={{ minWidth: '10rem' }} sortable body={lugarBodyTemplate} filter/>
                <Column header="DESCRIPCION" field='descripcion' filterField="descripcion" style={{ minWidth: '10rem' }} sortable body={descripcionBodyTemplate} filter/>
                <Column header="OBSERVACIONES" field='observacion' filterField='observacion' style={{ minWidth: '10rem' }} sortable body={observacionBodyTemplate} filter/>
                <Column header="VALOR ADQUISICION" field='valor_unitario_actual' filterField="valor_unitario_actual" style={{ minWidth: '10rem' }} sortable body={valorUnitActualBodyTemplate} filter/>
                <Column header="VALOR ACTUAL" field='valor_unitario_depreciado' filterField="valor_unitario_depreciado" style={{ minWidth: '10rem' }} sortable body={valorUnitDeprecBodyTemplate} filter/>
                {/* <Column header="VALOR TOTAL" field='valor_total' filterField="valor_total" style={{ minWidth: '10rem' }} body={valorTotalBodyTemplate} sortable filter/> */}
                {/* <Column header="LUGAR DE COMPRA O COTIZACION" field='lugar_compra_cotizacion' filterField="lugar_compra_cotizacion" style={{ minWidth: '10rem' }} sortable body={lugarCompraBodyTemplate} filter/> */}
                
                <Column header="Editar/Eliminar" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={actionBodyTemplate}/>
            </DataTable>
            
            <ModalInventario id_enterprice={id_enterprice} show={isOpenModalEgresos} onShow={onOpenModalIvsG} onHide={onCloseModalIvsG} data={null} showToast={showToast} isLoading={isLoading}/>
            {/* <ModalImportadorData onHide={()=>setshowModalImportadorData(false)} onShow={showModalImportadorData}/> */}
            </>
                )
                :(
                    //Array.from({ length: 10 }, (v, i) => i)
                    <DataTable size='large' 
                    value={Array.from({ length: 10 }, (v, i) => i)} 
                    className="p-datatable-striped"
                    >
                        <Column header="Id" style={{ width: '1rem' }}/>
                        <Column header="PRODUCTO" style={{ width: '3rem' }} body={<Skeleton/>} />
                        <Column header="MARCA" style={{ width: '3rem' }} body={<Skeleton/>} />
                        <Column header="DESCRIPCION" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="OBSERVACIONES" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="CANTIDAD" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="VALOR UNITARIO DEPRECIADO" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="LUGAR DE COMPRA O COTIZACION" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="VALOR TOTAL" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                    </DataTable>
                )
            }

        </>
    );
}
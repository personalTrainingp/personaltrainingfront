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
import { TabPanel, TabView } from 'primereact/tabview';
dayjs.extend(utc);
export default function TableInventario({showToast, id_enterprice, id_zona}) {
    locale('es')
    const [customers, setCustomers] = useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedCustomers, setselectedCustomers] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const { obtenerArticulos, isLoading, EliminarArticulo, RestaurarArticulo } = useInventarioStore()
    const {dataView} = useSelector(e=>e.DATA)
    const [valueFilter, setvalueFilter] = useState([])
    useEffect(() => {
        obtenerArticulos(id_enterprice)
        // obtenerProveedoresUnicos()
    }, [id_enterprice])
        useEffect(() => {
            if(dataView.length>=0){
                const fetchData = () => {
                    setCustomers(getCustomers([...dataView]));
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
        const onClickRestaurarModalEgresos = ()=>{
            confirmDialog({
                message: `Seguro que quieres restaurar el item?`,
                header: `eliminar item`,
                icon: 'pi pi-info-circle',
                defaultFocus: 'reject',
                acceptClassName: 'p-button-danger',
                accept:  onAcceptRestaurarGasto,
            });
        }
        const confirmDeleteGastoxID = ()=>{
            confirmDialog({
                message: `Seguro que quieres eliminar el item?`,
                header: `eliminar item`,
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
        const onAcceptRestaurarGasto = async()=>{
            setshowLoading(true)
            await RestaurarArticulo(rowData.id, id_enterprice)
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
                {
                    id_enterprice===610 && (
                        <Button icon="pi pi-reply" rounded outlined className="mr-2" 
                        onClick={onClickRestaurarModalEgresos} 
                        />
                        
                    )
                }
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
        const images = [...(rowData.tb_images || [])];

    // Ordenamos por ID descendente
    const sortedImages = images.sort((a, b) => b.id - a.id);
    const latestImage = sortedImages[0]?.name_image;

    const imageUrl = latestImage
        ? `${config.API_IMG.AVATAR_ARTICULO}${latestImage}`
        : sinImage;
        return (
            <div className="flex align-items-center gap-2">
                        <Image src={rowData.tb_images.length===0?sinImage:`${imageUrl}`} className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="170" />
            </div>
        );
    }
    const marcaBodyTemplate = (rowData)=>{
        return (
            <>
            <div className=''>MARCA</div>
            <div className="flex align-items-center gap-2 font-24 fw-bold">
                
                {/* <span>{formatDate(rowData.fec_pago) }</span> */}
                <span>{rowData.parametro_marca?.label_param}</span>
            </div>
            </>
        );
    }
    const lugarBodyTemplate = (rowData)=>{
        return (
            <>
                <div className=''>UBICACION</div>
            <div className="gap-2 font-24 fw-bold">
                
                {/* <span>{formatDate(rowData.fec_pago) }</span> */}
                {/* <div>NIVEL {rowData.parametro_nivel?.label_param}</div> */}
                <div>{rowData.parametro_lugar_encuentro?.label_param}</div>
            </div>
            </>
        );
    }
    const descripcionBodyTemplate = (rowData)=>{
        return (
            <>
                <div className=''>DESCRIPCION</div>
            <div className="fw-bold flex align-items-center gap-2 font-24">
                <>{rowData.descripcion}</>
                <br/>
            </div>
            </>
        );
    }
    const cantidadBodyTemplate = (rowData) => {
        return (
            <>
                <div className=''>CANT.</div>
            <div className="fw-bold d-flex align-items-end w-50 gap-2 justify-content-end font-24">
                <span>{highlightText( `${rowData.cantidad}`, globalFilterValue)}</span>
            </div>
            </>
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
            <>
                <div className=''>COSTO UNIT. S/.</div>
                <div className="d-flex font-24 w-100 " >
                    <div className='text-left w-100 fw-bold text-right'>
                        <NumberFormatMoney amount={rowData.costo_unitario_soles}/>
                    </div>
                </div>
            </>
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
            <>
                <div className=''>PRODUCTO</div>
            <div className="flex align-items-center gap-2 font-24 fw-bold">
                <span>{rowData.producto}</span>
            </div>
            </>
        )
    }
    const costototaldolaresBodyTemplate = (rowData)=>{
        const costo_total_dolares = (rowData.costo_unitario_dolares*rowData.cantidad)+rowData.mano_obra_dolares
        return (
            <>
                <div className='text-color-dolar'>COSTO TOTAL $.</div>
                <div className="d-flex font-24 w-100" >
                    <div className='text-left w-100 text-color-dolar fw-bold text-right'>
                    <NumberFormatMoney amount={costo_total_dolares}/>
                    </div>
                </div>
            </>
        )
    }
    const costounitariodolaresBodyTemplate = (rowData)=>{
        return (
            <div className=''> 
            <div className='text-color-dolar'> COSTO UNITARIO $.</div>
            
                <div className="d-flex font-24 w-100" >
                    <div className='text-left w-100 text-color-dolar fw-bold text-right'>
                    <NumberFormatMoney amount={rowData.costo_unitario_dolares}/>
                    </div>
                </div>
            </div>
        )
    }
    
        const costoManoObraBodyTemplate = (rowData)=>{
            return (
                <>
                <div className=''> COSTO MANO OBRA S/.</div>
                
                <div className="d-flex font-24 w-100" >
                    <div className='text-left w-100 fw-bold text-right'>
                    <NumberFormatMoney amount={rowData.mano_obra_soles}/>
                    </div>
                </div>
                </>
            )
        }
    const costototalsolesBodyTemplate = (rowData)=>{
        const costo_total_soles = (rowData.costo_unitario_soles*rowData.cantidad)+rowData.mano_obra_soles
        return (
            <>
                <div className=''> COSTO TOTAL S/.</div>
            
                <div className="d-flex font-24 w-100" >
                    <div className='text-left w-100 fw-bold text-right'>
                    <NumberFormatMoney amount={costo_total_soles}/>
                    </div>
                </div>
            </>
        )
    }
    const onOpenModalGastos = (e)=>{
        setArticulo(undefined)
        onOpenModalIvsG(e)
    }
    const groupedData = Object.values(
        customers?.reduce((acc, item) => {
          const key = item.parametro_lugar_encuentro.label_param;
          if (!acc[key]) {
            acc[key] = { lugar: key, orden_param: item.parametro_lugar_encuentro.orden_param, items: [] };
          }
          acc[key].items.push(item);
          return acc;
        }, {})
      );
      groupedData.sort((a,b)=>a.orden_param-b.orden_param)
      // Agregamos el grupo "todos"
        const todosGroup = {
            lugar: 'todos',
            orden_param: -1, // o algún valor que definas para ordenar este grupo
            items: customers || []
        };
        
        // Si quieres que "todos" esté al inicio:
        groupedData.unshift(todosGroup);
    return (
        <>
                    <div>
                        <Button label="AGREGAR NUEVO" severity="success" raised onClick={onOpenModalGastos} />
                    </div>
                    <TabView>
                        {
                            groupedData.map(g=>{
                                return (
                                    <TabPanel header={g.lugar}>
                                        <DataTable  
                                            className='dataTable-verticals-lines dataTable-inventario'
                                            value={g.items} 
                                            paginator 
                                            header={header}
                                            rows={10} 
                                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                            rowsPerPageOptions={[10, 25, 50, 100, 250, 500]} 
                                            dataKey="id"
                                            selection={selectedCustomers}
                                            onSelectionChange={(e) => setselectedCustomers(e.value)}
                                            filters={filters} 
                                            filterDisplay="menu" 
                                            globalFilterFields={['id', "parametro_marca.label_param", "parametro_lugar_encuentro.label_param", 'producto', 'marca', 'descripcion', 'observacion', 'cantidad', 'costo_unitario_soles', "costo_unitario_dolares","lugar_compra_cotizacion"]} 
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
                                    <Column header={<span className={'font-24'}>UBIC.</span>} field='parametro_lugar_encuentro.label_param' filterField="parametro_lugar_encuentro.label_param" style={{ minWidth: '2rem' }} sortable body={lugarBodyTemplate} filter/>
                                    <Column header={<span className={'font-24'}>CANT. </span>} field='cantidad' filterField="cantidad" sortable style={{ minWidth: '5rem' }} body={cantidadBodyTemplate} />
                                    <Column header={<div className={'font-24'} style={{width: '100px'}}>COSTO UNIT. <SymbolSoles isbottom={false}/></div>} field='costo_unitario' filterField="costo_unitario" style={{ minWidth: '10rem' }} sortable body={costounitariosolesBodyTemplate} filter/>
                                    <Column header={<div className={'font-24'} style={{width: '100px'}}>COSTO UNIT. <SymbolDolar isbottom={false}/></div>} field='costo_unitario' filterField="costo_unitario" style={{ minWidth: '10rem' }} sortable body={costounitariodolaresBodyTemplate} filter/>
                                    <Column header={<div className={'font-24'} style={{width: '130px'}}>COSTO MANO OBRA</div>} field='valor_total_dolares' filterField="valor_total_dolares" style={{ minWidth: '5rem' }} sortable body={costoManoObraBodyTemplate} filter/>
                                    <Column header={<div className={'font-24'} style={{width: '130px'}}>COSTO TOTAL <SymbolSoles isbottom={false}/></div>} field='costo_total_soles' filterField="costo_total_soles" style={{ minWidth: '10rem' }} sortable body={costototalsolesBodyTemplate} filter/>
                                    <Column header={<div className={'font-24 text-color-dolar fw-bold'} style={{width: '100px'}}>COSTO TOTAL $</div>} field='valor_total_dolares' filterField="valor_total_dolares" style={{ minWidth: '10rem' }} sortable body={costototaldolaresBodyTemplate} filter/>
                                    <Column header={<span className={'font-24'}>DESCRIPCION</span>} field='descripcion' filterField="descripcion" style={{ minWidth: '10rem' }} sortable body={descripcionBodyTemplate} filter/>
                                    <Column header="" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={actionBodyTemplate}/>
                                </DataTable>
                                    </TabPanel>
                                )
                            })
                        }
                    </TabView>
            <ModalInventario id_enterprice={id_enterprice} id_zona={id_zona} show={isOpenModalEgresos} onShow={onOpenModalIvsG} onHide={onCloseModalIvsG} data={articulo} showToast={showToast} isLoading={isLoading}/>
            <ModalImportadorData onHide={onCloseModalImportadorData} onShow={showModalImportadorData}/>
            </>
    );
}









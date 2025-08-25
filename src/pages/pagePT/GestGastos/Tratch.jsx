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
import { ModalIngresosGastos } from './ModalIngresosGastos';
import { confirmDialog } from 'primereact/confirmdialog';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import { arrayCargoEmpl, arrayFinanzas } from '@/types/type';
import dayjs from 'dayjs';
import { FormatoDateMask, FUNMoneyFormatter, MoneyFormatter } from '@/components/CurrencyMask';
import utc from 'dayjs/plugin/utc';
import { Skeleton } from 'primereact/skeleton';
import { Col, Modal } from 'react-bootstrap';
import { ModalImportadorData } from './ModalImportadorData';
import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { ModalTipoDeCambio } from './ModalTipoDeCambio';
import { useTcStore } from './hooks/useTcStore';
import { Row } from 'primereact/row';
import { ColumnGroup } from 'primereact/columngroup';
dayjs.extend(utc);

export default function AdvancedFilterDemo({showToast, id_enterprice, bgEmpresa}) {
    locale('es')
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedCustomers, setselectedCustomers] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const { obtenerGastos, obtenerProveedoresUnicos, isLoadingData } = useGf_GvStore()
    const {dataGastos, dataProvUnicosxGasto} = useSelector(e=>e.finanzas)
    const [valueFilter, setvalueFilter] = useState([])
        const [search, setSearch] = useState('');
    
    useEffect(() => {
        obtenerGastos(id_enterprice)
        // obtenerProveedoresUnicos()
    }, [id_enterprice])
    useEffect(() => {

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
            // Convertir la fecha a la zona horaria de Lima
            // Realiza las modificaciones en la copia
            const [year, month, day] = item.fec_pago.split('-').map(Number);
            const [yearc=year, monthc=month, dayc=day] = item.fec_comprobante.split('-').map(Number)
            // const [yearr=year, monthr = month, dayr = day] = item.fec_registro.split('-').map(Number)
            // console.log(item.fec_registro);
            let date = dayjs.utc(item.fec_registro);
            newItem.fec_registro = new Date(date.format());
            newItem.fec_comprobante =new Date(yearc, monthc-1, dayc);
            newItem.fec_pago = new Date(year, month - 1, day);
            newItem.tipo_gasto = arrayFinanzas.find(e=>e.value === item?.tb_parametros_gasto?.id_tipoGasto)?.label
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
    const { obtenerGastoxID, gastoxID, isLoading, startDeleteGasto, setgastoxID } = useGf_GvStore()
    const [showLoading, setshowLoading] = useState(false)
    const [isCopy, setisCopy] = useState(false)
    const actionBodyTemplate = (rowData)=>{
        const onClickEditModalEgresos = ()=>{
            onOpenModalIvsG()
            obtenerGastoxID(rowData.id)

        }
        const onClickCopyModalEgresos = ()=>{
            onOpenModalIvsG()
            obtenerGastoxID(rowData.id)
            setisCopy(true)
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
            await startDeleteGasto(rowData.id, id_enterprice)
            setshowLoading(false)
            showToast('success', 'Eliminar gasto', 'Gasto Eliminado correctamente', 'success')
        }
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" 
                onClick={onClickEditModalEgresos} 
                />
                <Button icon="pi pi-trash" rounded outlined severity="danger"  className='mr-2'
                onClick={confirmDeleteGastoxID} 
                />
                <Button icon="pi pi-copy" rounded outlined severity="danger" 
                onClick={onClickCopyModalEgresos} 
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
                <div className="d-flex justify-content-between">
                                      <InputText
                                        placeholder="Buscar..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="mb-3"
                                    />
                            </div>
                <div className='d-flex'>
                    <Button label="IMPORTAR" icon='pi pi-file-import' onClick={()=>setshowModalImportadorData(true)} disabled text/>
                    <ExportToExcel data={valueFilter}/>
                </div>
            </div>
        );
    };
    
    const montoBodyTemplate = (rowData) => {
        return (
            <div className=" gap-2">
                <div className={rowData.moneda === 'PEN'?'':'text-success fw-bold'}>
                        {rowData.moneda === 'PEN' ? <SymbolSoles fontSizeS={'font-15'}/> : <SymbolDolar fontSizeS={'font-15'}/>}
                    {highlightText(
                        FUNMoneyFormatter(rowData.monto, ''),
                        search
                    )}
                </div>
            </div>
        );
    };

    const descripcionBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData.descripcion, globalFilterValue)}</span>
            </div>
        );
    };
    const fecRegistroBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2 ">
                <span>{ FormatoDateMask(rowData.fec_registro, 'dddd D [de] MMMM [del] YYYY [a las] h:mm A') }</span>
            </div>
        );
    }
    const fecPagoBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                
                {/* <span>{formatDate(rowData.fec_pago) }</span> */}
                <span>{FormatoDateMask(rowData.fec_pago, 'dddd D [de] MMMM [del] YYYY') }</span>
            </div>
        );
    }
    const fecComprobanteBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                
                {/* <span>{formatDate(rowData.fec_pago) }</span> */}
                <span>{new Date(rowData.fec_comprobante).getFullYear()===1900? '': FormatoDateMask(rowData.fec_comprobante, 'dddd D [de] MMMM [del] YYYY')}</span>
            </div>
        );
    }
    const proveedorBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(rowData?.tb_Proveedor?.razon_social_prov?rowData.tb_Proveedor.razon_social_prov:'SIN', search)}</span>
            </div>
        );
    }
    const tipoGastoBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText( rowData.tb_parametros_gasto?.nombre_gasto?rowData.tb_parametros_gasto?.nombre_gasto:'SIN', search)}</span>
            </div>
        );
    };
    const grupoBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2" >
                <span>{highlightText(`${rowData.tb_parametros_gasto?.grupo}`, search)}</span>
            </div>
        );
    };
    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };
    
    const valueFiltered = (e)=>{
        setvalueFilter(e)
    }
    
    const header = renderHeader();
    const [isOpenModalEgresos, setisOpenModalEgresos] = useState(false)
    const [isOpenModalTC, setisOpenModalTC] = useState(false)
    const onCloseModalIvsG = ()=>{
        setisOpenModalEgresos(false)
    }
    const onOpenModalIvsG = ()=>{
        setisOpenModalEgresos(true)
    }   
    const IdBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(`${rowData.id}`, search)}</span>
            </div>
        )
    }
    const tipoGastosBodyTemplate = (rowData)=>{
        return (
            
            <div className="flex align-items-center gap-2 ">
                <span>{highlightText( `${rowData.tipo_gasto}`, search)}</span>
            </div>
        )
    }
    const nComprobanteBodyTemplate = (rowData)=>{
        return (
            
            <div className="flex align-items-center gap-2 ">
                <span>{highlightText( `${rowData.n_comprabante}`, search)}</span>
            </div>
        )
    }
    const nOperacionBodyTemplate =(rowData)=>{
        return (
            
            <div className="flex align-items-center gap-2 ">
                <span>{highlightText( `${rowData.n_operacion}`, search)}</span>
            </div>
        )
    }
    const onOpenModalGastos = (e)=>{
        setgastoxID(undefined)
        onOpenModalIvsG(e)
    }
    const onOpenModalTC = (e)=>{
        setisOpenModalTC(true)
    }
    const onCloseModalTC = (e)=>{
        setisOpenModalTC(false)
    }
    const headerGroup = (
  <ColumnGroup>
    <Row className="bg-danger text-white">
      <Column header="ID" />
      <Column header="Fecha registro" />
      <Column header="Edad" />
      <Column header="Email" />
    </Row>
  </ColumnGroup>
);
console.log({customers});

                                const flattenObjectValues = (obj) => {
    let result = [];
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            result = result.concat(flattenObjectValues(obj[key]));
        } else {
            result.push(String(obj[key]));
        }
    }
    return result;
};

const filterData = customers?.filter((item) => {
    const values = flattenObjectValues(item);
    return values.some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
    );
});
    return (
        <>
            {
                showLoading&&
                <Modal size='sm' show={showLoading}>
                    <Modal.Body>
                    <div className='d-flex flex-column align-items-center justify-content-center text-center' style={{height: '15vh'}}>
                            <span className="loader-box2"></span>
                    </div>
                    </Modal.Body>
                </Modal> 
            }
            {
                !isLoadingData?(
                    <>
                    <div>
                        <Button className='m-1' label="AGREGAR NUEVO" severity="success" raised onClick={onOpenModalGastos} />
                        <Button className='m-1' label="TIPO DE CAMBIO" severity="success" text onClick={onOpenModalTC} />
                    </div>
                    <DataTable 
                        size='small' 
                        value={filterData} 
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
                        globalFilterFields={['id', 'fec_pago', 'id_prov', 'tb_parametros_gasto.nombre_gasto', 'descripcion', 'monto', 'n_operacion', 'n_comprabante', 'moneda', "tb_Proveedor.razon_social_prov","fec_registro"]} 
                        emptyMessage="Egresos no encontrados."
                        showGridlines 
                        loading={loading} 
                        stripedRows
                        scrollable
                        onValueChange={valueFiltered}
                        >
                                <Column headerClassName={`${bgEmpresa} text-white`} headerStyle={{ color: '#fff' }}  header="Id" field='id' filterField="id" sortable style={{ width: '1rem' }} filter body={IdBodyTemplate}/>
                                <Column headerClassName={`${bgEmpresa} text-white`} headerStyle={{ color: '#fff' }}  header="COMPROBANTE" field='n_comprabante' filterField="n_comprabante" sortable style={{ width: '1rem' }} filter body={nComprobanteBodyTemplate}/>
                                <Column headerClassName={`${bgEmpresa} text-white`} headerStyle={{ color: '#fff' }}  header="OPERACION" field='n_operacion' filterField="n_operacion" sortable style={{ width: '1rem' }} filter body={nOperacionBodyTemplate}/>
                                <Column headerClassName={`${bgEmpresa} text-white`} headerStyle={{ color: '#fff' }}  header="Fecha registro" field='fec_registro' filterField="fec_registro" sortable dataType="date" style={{ width: '3rem' }} body={fecRegistroBodyTemplate} filter filterElement={dateFilterTemplate} />
                                <Column headerClassName={`${bgEmpresa} text-white`} headerStyle={{ color: '#fff' }}  header="Fecha pago" field='fec_pago' filterField="fec_pago" sortable dataType="date" style={{ width: '3rem' }} body={fecPagoBodyTemplate} filter filterElement={dateFilterTemplate} />
                                <Column headerClassName={`${bgEmpresa} text-white`} headerStyle={{ color: '#fff' }}  header="Fecha de comprobante" field='fec_comprobante' filterField="fec_comprobante" style={{ minWidth: '10rem' }} sortable body={fecComprobanteBodyTemplate} dataType="date" filter filterElement={dateFilterTemplate}/>
                                <Column headerClassName={`${bgEmpresa} text-white`} headerStyle={{ color: '#fff' }}  header="Tipo de gasto" field='tipo_gasto' filterField='tipo_gasto' style={{ minWidth: '10rem' }} sortable body={tipoGastosBodyTemplate} filter/>
                                <Column headerClassName={`${bgEmpresa} text-white`} headerStyle={{ color: '#fff' }}  header="RUBRO" field='tb_parametros_gasto.grupo' filterField="tb_parametros_gasto.grupo" style={{ minWidth: '10rem' }} sortable body={grupoBodyTemplate} filter/>
                                <Column headerClassName={`${bgEmpresa} text-white`} headerStyle={{ color: '#fff' }}  header="Gasto" field='tb_parametros_gasto.nombre_gasto' filterField="tb_parametros_gasto.nombre_gasto" sortable style={{ minWidth: '10rem' }} body={tipoGastoBodyTemplate} filter />
                                <Column headerClassName={`${bgEmpresa} text-white`} headerStyle={{ color: '#fff' }}  header={<>MONTO</>} field='monto' filterField="monto" style={{ minWidth: '10rem' }} sortable body={montoBodyTemplate} filter/>
                                <Column headerClassName={`${bgEmpresa} text-white`} headerStyle={{ color: '#fff' }}  header="descripcion" field='descripcion' filterField="descripcion" style={{ minWidth: '10rem' }} sortable body={descripcionBodyTemplate} filter/>
                                <Column headerClassName={`${bgEmpresa} text-white`} headerStyle={{ color: '#fff' }}  header="Proveedor" field='tb_Proveedor.razon_social_prov' filterField="tb_Proveedor.razon_social_prov" style={{ minWidth: '10rem' }} sortable showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }}  
                                body={proveedorBodyTemplate} filter />
                                <Column headerClassName={`${bgEmpresa} text-white`} headerStyle={{ color: '#fff' }}  header="Action" filterField="id" style={{ minWidth: '12rem' }} frozen alignFrozen="right" body={actionBodyTemplate}/>
            </DataTable>
            
            <ModalIngresosGastos setisCopyHide={()=>setisCopy(false)} isCopy={isCopy} id_enterprice={id_enterprice} show={isOpenModalEgresos} onShow={onOpenModalIvsG} onHide={onCloseModalIvsG} data={gastoxID} showToast={showToast} isLoading={isLoading}/>
            <ModalImportadorData onHide={()=>setshowModalImportadorData(false)} onShow={showModalImportadorData}/>
            <ModalTipoDeCambio onShow={onOpenModalTC} show={isOpenModalTC} onHide={onCloseModalTC}/>
            </>
                )
                :(
                    <DataTable size='large' 
                    value={Array.from({ length: 10 }, (v, i) => i)} 
                    className="p-datatable-striped"
                    >
                        <Column header="Id" style={{ width: '1rem' }}/>
                        <Column header="Fecha registro" style={{ width: '3rem' }} body={<Skeleton/>} />
                        <Column header="Fecha pago" style={{ width: '3rem' }} body={<Skeleton/>} />
                        <Column header="Fecha de comprobante" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Tipo de gasto" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Gasto" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Grupo" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Monto" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="descripcion" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Proveedor" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Action" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                    </DataTable>
                )
            }

        </>
    );
}
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
import { arrayCargoEmpl, arrayDistrito, arrayTipoCliente } from '@/types/type';
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import config from '@/config';
import { Image } from 'primereact/image';
import { useDispatch } from 'react-redux';
import { ModalEmpleado } from './ModalEmpleado';
import dayjs from 'dayjs';
import { FormatoDateMask } from '@/components/CurrencyMask';

export const TableEmpleados = ({isOpenButtonRegister, id_empresa, id_estado}) => {
    const [customers, setCustomers] = useState(null);
    const [isOpenModalRegisterEmpleado, setisOpenModalRegisterEmpleado] = useState(false)
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const  { obtenerUsuariosEmpleados } = useUsuarioStore()
    const {dataView} = useSelector((e) => e.DATA);
    useEffect(() => {
        obtenerUsuariosEmpleados(id_empresa, id_estado)
    }, [id_empresa, id_estado])
    
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
    const clearFilter = () => {
        initFilters();
    };
    const onOpenModalRegisterEmpleado = ()=>{
        setisOpenModalRegisterEmpleado(true)
    }
    const onCloseModalRegisterEmpleado=()=>{
        setisOpenModalRegisterEmpleado(false)
    }
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
    
    const telefonoBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center fw-bold" style={{fontSize: '22px'}}>
                <span>{highlightText(rowData.telefono_empl?`${rowData.telefono_empl}`.replace(/ /g, "").match(/.{1,3}/g).join(' '):'', globalFilterValue)}</span>
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
            <Link to={`/perfil-colaborador/${rowData.uid}`} className="action-icon text-primary fw-bold" style={{fontSize: '14px', textDecoration: 'underline'}}>
                Ver Perfil
            </Link>
        );
    }

    const NombresApellidosEmplBodyTemplate = (rowData) => {
        return (
            <div className="">
                <span className='text-primary fs-2 fw-bold'>{highlightText(`${rowData.nombre_empl.split(' ')[0]} `, globalFilterValue)} </span>
                {
                    rowData.nombre_empl.split(' ')[1] && (<br/>)
                }
                <span className=''>{highlightText(`${rowData.nombre_empl.split(' ')[1] || ''} `, globalFilterValue)} {highlightText(`${rowData.nombre_empl.split(' ')[2] || ''} `, globalFilterValue)} </span>
                <br/>
                <span>{highlightText(`${rowData.apPaterno_empl} `, globalFilterValue)} </span>
                <span>{highlightText(`${rowData.apMaterno_empl} `, globalFilterValue)}</span>
            </div>
        );
    };

    const FecNacEmplBodyTemplate = (rowData) => {
            const [year, month, day] = rowData.fecNac_empl.split('-').map(Number);
        return (
            <div className="flex align-items-center gap-2 text-primary fw-bold">
                <span>{dayjs.utc(rowData.fecha_nacimiento).format('D [de] MMMM')}</span>
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
            <div className="align-items-center flex-column">
                <span>
                <span>EMAIL PERSONAL: </span>
                <br/>
                <strong>
                    {highlightText(rowData.email_empl, globalFilterValue)}
                </strong>
                <br/>
                </span>
                {rowData?.email_corporativo&&(
                    <span>
                        <span>EMAIL CORPORATIVO: </span>
                <br/>
                    <strong className=''>
                        {highlightText(rowData?.email_corporativo, globalFilterValue)}
                    </strong>
                <br/>

                    </span>)}
            </div>
        );
    }
    const imagenBodyTemplate = (rowData)=>{
        const imgsSort = [...(rowData.tb_images || [])]?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
        return(
            <div className=''>
                <Image className='rounded-circle' 
                indicatorIcon={<i className="pi pi-search"></i>} 
                alt="Image" preview width="100" 
                src={imgsSort?.length==0?sinAvatar:`${config.API_IMG.AVATAR_EMPL}${imgsSort[0]?.name_image}`}></Image>
            </div>
        )
    }
    const cargoBodyTemplate = (rowData)=>{
        return (
            <div className="fw-bold text-primary" style={{fontSize: '20px'}}>
                {arrayCargoEmpl.find(f=>f.value===Number(rowData?.cargo_empl))?.label}
            </div>
        )
    }
    const header = renderHeader();

    return (
        <>
        {
            isOpenButtonRegister && (
                <Button label='AGREGAR COLABORADOR' icon={'mdi mdi-plus-circle'} onClick={onOpenModalRegisterEmpleado}/>
            )
        }
            <div className='fs-1'>
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
                        globalFilterFields={["id_cli", "nombres_apellidos_empl", "email_cli", "tel_cli", "distrito", "cargo_empl"]} 
                        header={header}
                        emptyMessage="SOCIOS NO ENCONTRADOS.">
                {/* <Column header="Tipo de gasto" filterField="tb_parametros_gasto.nombre_gasto" sortable style={{ minWidth: '10rem' }} body={tipoGastoBodyTemplate} filter /> */}
                {/* <Column header="Monto" filterField="monto" style={{ minWidth: '10rem' }} sortable body={montoBodyTemplate} filter/> */}
                {/* <Column header="Id" filterField="id_cli" style={{ minWidth: '2rem' }} sortable body={IdBodyTemplate}/> */}
                <Column header="FOTO" filterField="id_cli" style={{ minWidth: '10rem' }} sortable body={imagenBodyTemplate} filter/>
                <Column header="CARGO" style={{ minWidth: '2rem' }} body={cargoBodyTemplate}/>
                <Column header={<>NOMBRES <br/> APELLIDOS</>} filterField="nombres_apellidos_empl" style={{ minWidth: 'auto' }} sortable body={NombresApellidosEmplBodyTemplate} filter/>
                <Column header="CELULAR" filterField={`tel_cli`} style={{ minWidth: '10rem' }} sortable body={telefonoBodyTemplate} filter/>
                <Column header="EMAIL" filterField={`email_cli`} style={{ minWidth: '10rem' }} sortable body={emailBodyTemplate} filter/>
                <Column header="cumpleaños" style={{ minWidth: '10rem' }} sortable body={FecNacEmplBodyTemplate} filter/>
                <Column header="DISTRITO" filterField={`distrito`} style={{ minWidth: '10rem' }} sortable body={distritoBodyTemplate} filter/>
                {/* <Column header="ESTADO" filterField={`estado_empl`} style={{ minWidth: '10rem' }} sortable body={estadoBodyTemplate} filter/> */}

                {/* <Column header="Vencimiento" filterField="vencimiento_REGALOS_CONGELAMIENTO" sortable style={{ minWidth: '10rem' }} body={fecRegistroBodyTemplate} filter filterElement={dateFilterTemplate}  dataType="date" /> */}
                {/* <Column header="Proveedor" filterField="tb_Proveedor.razon_social_prov" style={{ minWidth: '10rem' }} sortable showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }}  
                body={proveedorBodyTemplate} filter filterElement={proveedorFilterTemplate} /> */}

                {/* <Column header="Estado" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={verHistoryBodyTemplate}/> */}
                <Column header="" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={verHistoryBodyTemplate}/>
            </DataTable>
            </div>
            <ModalEmpleado show={isOpenModalRegisterEmpleado} onHide={onCloseModalRegisterEmpleado} id_Estado={true} id_empresa={id_empresa}/>
        </>
    );
}

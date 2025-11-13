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
import { useEmpleadosStore } from './useEmpleadosStore';

export const TableEmpleados = ({isOpenButtonRegister, id_empresa, id_estado}) => {
    const [customers, setCustomers] = useState(null);
    const [isOpenModalRegisterEmpleado, setisOpenModalRegisterEmpleado] = useState(false)
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const  { obtenerUsuariosEmpleados } = useUsuarioStore()
    const { dataParientes, obtenerParientesEmpleados, obtenerDocumentosDeEmpleados, dataDocumentosInternosEmpl } = useEmpleadosStore()
    const {dataView} = useSelector((e) => e.DATA);
    useEffect(() => {
        obtenerUsuariosEmpleados(id_empresa, id_estado)
        obtenerParientesEmpleados()
        obtenerDocumentosDeEmpleados()
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
        const waTel = `https://wa.me/${rowData.telefono_empl}`
        return (
            <div className="flex align-items-center fw-bold" style={{fontSize: '22px'}}>
                <a className='' href={waTel} target='_blank'>
                    <span>{highlightText(rowData.telefono_empl?`${rowData.telefono_empl}`.replace(/ /g, "").match(/.{1,3}/g).join(' '):'', globalFilterValue)}</span>
                </a>
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
            <Link to={`/perfil-colaborador/${rowData.uid}`} className="action-icon text-primary fw-bold" style={{fontSize: '20px', textDecoration: 'underline'}}>
                Ver Perfil
            </Link>
        );
    }

    const NombresApellidosEmplBodyTemplate = (rowData) => {
        return (
            <div className="">
                {cargoBodyTemplate(rowData)}
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
    const ContactoEmergenciaBodyTemplate = (rowData)=>{
        const dataPariente = dataParientes.filter(d=>d.uid_location===rowData.uid_contactsEmergencia)
        return (
            <div style={{fontSize: '20px'}} className={`flex align-items-center gap-2 ml-7  fw-bold ${dataPariente.length>0?'text-ISESAC':'text-change'}`}>
                {dataPariente.length>0?'SI':'NO'}
            </div>
        );
    }
    const cvBodyTemplate = (rowData)=>{
        const dataDocsInternos = dataDocumentosInternosEmpl.filter(e=>e.uid_location===rowData.tb_images[0]?.uid_location)
        const cvs =dataDocsInternos.filter(doc=>doc.id_tipo_doc===1519)
        return (
            <div style={{fontSize: '20px'}} className={`flex align-items-center gap-2 ml-7  fw-bold ${cvs.length>0?'text-ISESAC':'text-change'}`}>
                {cvs.length>0?'SI':'NO'}

            </div>
        );
    }
    const contratoBodyTemplate = (rowData)=>{
        const dataDocsInternos = dataDocumentosInternosEmpl.filter(e=>e.uid_location===rowData.tb_images[0]?.uid_location)
        const cvs =dataDocsInternos.filter(doc=>doc.id_tipo_doc===1540)
        return (
            <div style={{fontSize: '20px'}} className={`flex align-items-center gap-2 ml-7  fw-bold ${cvs.length>0?'text-ISESAC':'text-change'}`}>
                {cvs.length>0?'SI':'NO'}

            </div>
        );
    }
    const dniBodyTemplate = (rowData)=>{
        const dataDocsInternos = dataDocumentosInternosEmpl.filter(e=>e.uid_location===rowData.tb_images[0]?.uid_location)
        const dnis =dataDocsInternos.filter(doc=>doc.id_tipo_doc===1518)
        return (
            <div style={{fontSize: '20px'}} className={`flex align-items-center gap-2 ml-6  fw-bold ${dnis.length>0?'text-ISESAC':'text-change'}`}>
                {dnis.length>0?'SI':'NO'}

            </div>
        );
    }
    const toMailto = (value, subject = "", body = "") => {
  // extrae el correo aunque venga como "Nombre <correo@dom.com>"
  const match = String(value).match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}/);
  if (!match) return null;
  const email = match[0];
  const qs = `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return `mailto:${email}${qs}`;
};


    const emailBodyTemplate = (rowData) => {
        const urlMail =`mailto:${rowData.email_empl}`
        const urlMailCorp =`mailto:${rowData.email_corporativo}`
        // window.location.href = urlMail;
        return (
            <div>
                <a href={toMailto(urlMail)} style={{fontSize: '20px'}} className={`flex align-items-center gap-2 ml-7  fw-bold ${rowData.email_empl.length===0?'text-change':'text-ISESAC'}`}>
                    {rowData.email_empl.length===0?'NO':'SI'}
                </a>
            </div>
        );
    }
    
    const emailCorpBodyTemplate = (rowData) => {
        const urlMail =`mailto:${rowData.email_empl}`
        const urlMailCorp =`mailto:${rowData?.email_corporativo}`
        // window.location.href = urlMail;
        return (
            <div>
                <a href={toMailto(urlMailCorp)} style={{fontSize: '20px'}} className={`flex align-items-center gap-2 ml-2  fw-bold ${rowData.email_corporativo?.length===0?'text-change':'text-ISESAC'}`}>
                    {rowData.email_corporativo?.length===0?'NO':'SI'}
                </a>
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
        const cargoLabel = arrayCargoEmpl.find(f=>f?.value===Number(rowData?.cargo_empl))?.label
        return (
            <div className="fw-bold text-primary" style={{fontSize: '20px'}}>

                {cargoLabel && (
                    cargoLabel==='ASESOR FINANCIERO Y COMERCIAL'?(
                        <>
                        ASESOR FINANCIERO
                        <br/>
                        COMERCIAL
                        </>
                    ):(
                        <>
                        {cargoLabel.split('/')[0]}
                        <br/>
                        {cargoLabel.split('/')[1]}
                        </>
                    )
                )
                }
            </div>
        )
    }
    const idBodyTemplate = (rowData, {rowIndex})=>{
        return (
            <>
            {rowIndex+1}
            </>
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
                {/* {JSON.stringify(dataParientes, null, 2)} */}
                {/* <pre>
                {JSON.stringify(dataDocumentosInternosEmpl, null, 2)}

                </pre> */}
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
                <Column header={<div style={{fontSize: '15px'}}>ID</div>}  style={{ minWidth: '2rem' }} body={idBodyTemplate}/>
                <Column header={<div style={{fontSize: '15px'}}>FOTO</div>} filterField="id_cli" style={{ minWidth: '8rem' }} body={imagenBodyTemplate} />
                {/* <Column header={<div style={{fontSize: '15px'}}>CARGO</div>} style={{ minWidth: '2rem' }} body={cargoBodyTemplate}/> */}
                <Column header={<div style={{fontSize: '15px'}}>NOMBRES <br/> APELLIDOS</div>} filterField="nombres_apellidos_empl" style={{ minWidth: 'auto' }} body={NombresApellidosEmplBodyTemplate}/>
                <Column header={<div style={{fontSize: '15px'}}>CELULAR</div>} filterField={`tel_cli`} style={{ minWidth: '10rem' }} body={telefonoBodyTemplate} />
                <Column header={<div style={{fontSize: '15px'}} className='ml-6'>EMAIL</div>} filterField={`email_cli`} style={{ minWidth: '5rem' }} body={emailBodyTemplate}/>
                <Column header={<div style={{fontSize: '15px'}} className='ml-0'>CORP.</div>} filterField={`email_cli`} style={{ minWidth: '5rem' }} body={emailCorpBodyTemplate}/>
                <Column header={<div style={{fontSize: '15px'}} className='ml-4'>CONTACTO <br/> EMERGENCIA</div>} style={{ minWidth: '3rem' }} body={ContactoEmergenciaBodyTemplate}/>
                <Column header={<div style={{fontSize: '15px'}} className='ml-6'>DNI</div>} style={{ minWidth: '2rem' }} body={dniBodyTemplate}/>
                <Column header={<div style={{fontSize: '15px'}} className='ml-7'>CV</div>} style={{ minWidth: '5rem' }} body={cvBodyTemplate}/>
                <Column header={<div style={{fontSize: '15px'}} className='ml-7'>CONTRATO</div>} style={{ minWidth: '5rem' }} body={contratoBodyTemplate}/>
                <Column header="" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={verHistoryBodyTemplate}/>
            </DataTable>
            </div>
            <ModalEmpleado show={isOpenModalRegisterEmpleado} onHide={onCloseModalRegisterEmpleado} id_Estado={true} id_empresa={id_empresa}/>
        </>
    );
}

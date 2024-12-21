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
import { arrayTipoCliente } from '@/types/type';
import { useProspectoLeadsStore } from '@/hooks/hookApi/useProspectoLeadsStore';
import dayjs from 'dayjs';
import { MoneyFormatter } from '@/components/CurrencyMask';
import { Card, Col, Row } from 'react-bootstrap';
import { ModalCliente } from './ModalCliente';
import { ModalComentarios } from './ModalComentarios';
import { logEvent } from 'firebase/analytics';
import { confirmDialog } from 'primereact/confirmdialog';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';

export default function TableNoClientes({dataV}) {
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [uidComment, setuidComment] = useState('')
    const [showModalEditComercio, setshowModalEditComercio] = useState(false)
    const [showModalComentarios, setshowModalComentarios] = useState(false)
    const { obtenerProspectoxID, prospectoLeadxID, startDeleteProspectoLead } = useProspectoLeadsStore()
    console.log(dataV);
    
    const onModalCloseComentarios = ()=>{
        setshowModalComentarios(false)
    }
    const onModalOpenComentarios = (uid_coment)=>{
        setshowModalComentarios(true)
        setuidComment(uid_coment)
    }
    const onModalCancelComercioxID = ()=>{
        setshowModalEditComercio(false)
    }
    const onModalOpenComercio = ()=>{
        setshowModalEditComercio(true)
    }
        useEffect(() => {
        const fetchData = () => {
            setCustomers(getCustomers(dataV));
            setLoading(false);
        };
        fetchData()
        initFilters();
        }, [dataV]);
    const getCustomers = (data) => {
        return data.map(item => {
            // Crea una copia del objeto antes de modificarlo
            let newItem = { ...item };
            newItem.estado_lead = item.parametro_estado_lead?.label_param
            newItem.canal_lead = item.parametro_canal?.label_param
            newItem.campania_lead = item.parametro_campania?.label_param
            newItem.tipo_cliente = arrayTipoCliente.find(i => i.value === item.tipoCli_cli)?.label;
            // Realiza las modificaciones en la copia
            return newItem;
        });
    };
    // console.log(agruparPorCanal(dataV));
    
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
                <span>{dayjs(rowData.fecha_registro, 'YYYY/MM/DD').format('DD [del] MMMM [del] YYYY')}</span>
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
        const onModalEditComercioxID = ()=>{
            onModalOpenComercio()
            obtenerProspectoxID(rowData.id)
        }
        const onModalTrashComercioxID = ()=>{
            confirmDialog({
                message: 'Seguro que quieres eliminar?',
                header: 'Eliminar',
                icon: 'pi pi-info-circle',
                defaultFocus: 'reject',
                acceptClassName: 'p-button-danger',
                accept:  onAcceptDeleteComercio,
            });
        }
        
        const onAcceptDeleteComercio = async()=>{
            // setshowLoading(true)
            await startDeleteProspectoLead(rowData.id)
            // setshowLoading(false)
            // showToast('success', 'Eliminar gasto', 'Gasto Eliminado correctamente', 'success')
        }
        return (
            <>
                <Button icon="pi pi-comment" onClick={()=>onModalOpenComentarios(rowData.uid_comentario)} rounded outlined className="mr-2" />
                <Button icon="pi pi-pencil" onClick={()=>onModalEditComercioxID(rowData.id)} rounded outlined className="mr-2" />
                <Button icon="pi pi-trash" onClick={()=>onModalTrashComercioxID(rowData.id)} rounded outlined className="mr-2" />
            </>
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
            <div className="">
                <div><strong>NOMBRES: </strong>{highlightText(rowData.nombres, globalFilterValue)} {highlightText(rowData.apellido_materno?rowData.apellido_materno:'', globalFilterValue)}</div>
                <div><strong>CELULAR: </strong>{highlightText(rowData.celular, globalFilterValue)}</div>
            </div>
        );
    }
    const empleadoBodyTemplate = (rowData)=>{
        return (
            <>
            {rowData.empleado?.nombres_apellidos_empl}
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
            <h3>
                                        
                <span className={`badge ${rowData.parametro_estado_lead?.id_param==737 && 'text-bg-info'}  
                                        ${rowData.parametro_estado_lead?.id_param==736 && 'text-bg-secondary'}
                                        ${rowData.parametro_estado_lead?.id_param==740 && 'text-bg-warning'} 
                                        ${rowData.parametro_estado_lead?.id_param==739 && 'text-bg-success'}
                                        ${rowData.parametro_estado_lead?.id_param==738 && 'text-bg-success'}
                                        `}>
                {rowData.estado_lead}
                </span>
            </h3>
        )
    }
    const ultimaFechaDeSeguimiento = (rowData)=>{
        return (
            <>
            {rowData.ultimo_dia_seguimiento?dayjs(rowData.ultimo_dia_seguimiento, 'YYYY/MM/DD').format('DD [del] MMMM [del] YYYY'):''}
            
            </>
        )
    }
    const fechaCitaBodyTemplate = (rowData)=>{
        return (
            <>
            {rowData.fecha_cita?dayjs(rowData.fecha_cita, 'YYYY/MM/DD').format('DD [del] MMMM [del] YYYY'):''}
            
            </>
        )
    }
    const planBodyTemplate = (rowData)=>{
        return (
            <>
            <MoneyFormatter amount={rowData.plan_lead}/>
            </>
        )
    }
    const campaniaBodyTemplate = (rowData)=>{
        return (
            <>
            {rowData.parametro_campania?.label_param}
            </>
        )
    }
    const canalBodyTemplate = (rowData)=>{
        return (
            <>
            {rowData.parametro_canal?.label_param}
            </>
        )
    }
    const comentarioBodyTemplate =(rowData)=>{
        console.log(rowData);
        
        return (
            <>
            {rowData.comentario.length>0&&rowData?.comentario[rowData?.comentario?.length-1]?.comentario_com}
            </>
        )
    }
    const header = renderHeader();

    return (
        <>
            <Row>
                {/* <Col lg={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title>
                                <h3 className='text-center'>CANALES</h3>
                            </Card.Title>
                        </Card.Header>
                        <Card.Body style={{alignItems: 'center'}}>
                            <Row>
                                {
                                    agruparPorCanal(dataV).map(d=>(
                                        <Col>
                                            <Card className="shadow-none m-0">
                                                <Card.Body className="text-center">
                                                    <h3>
                                                        <span>{d.label_canal}</span>
                                                    </h3>
                                                    <p className="text-muted font-24 mb-0">{d.items.length}</p>
                                                </Card.Body>
                                            </Card>
                                        </Col>

                                    ))
                                }
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title>
                                <h3 className='text-center'>CAMPAÑAS</h3>
                            </Card.Title>
                        </Card.Header>
                        <Card.Body style={{ alignItems: 'center'}}>
                            <Row>
                                {
                                    agruparPorCampanias(dataV).map(d=>(
                                        <Col lg={3}>
                                            <Card className="shadow-none m-0">
                                                <Card.Body className="text-center">
                                                    <h3>
                                                        <span className='font-20'>{d.label_campanias}</span>
                                                    </h3>
                                                    <p className="text-muted font-24 mb-0">{d.items.length}</p>
                                                </Card.Body>
                                            </Card>
                                        </Col>

                                    ))
                                }
                            </Row>
                        </Card.Body>
                    </Card>
                </Col> */}
            </Row>
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
                <Column header="NOMBRE" style={{ minWidth: '20rem' }} sortable body={nombreBodyTemplate} filter/>
                {/* <Column header="APELLIDOS" style={{ minWidth: '10rem' }} sortable body={apellidosBodyTemplate} filter/> */}
                {/* <Column header="CELULAR" style={{ minWidth: '10rem' }} sortable body={celularBodyTemplate} filter/> */}
                <Column header="DISTRITO" style={{ minWidth: '10rem' }} sortable body={distritoBodyTemplate} filter/>
                <Column header="ULTIMO COMENTARIO" style={{ minWidth: '10rem' }} sortable body={comentarioBodyTemplate} filter/>
                <Column header="CANAL" style={{ minWidth: '10rem' }} sortable body={canalBodyTemplate} filter/>
                <Column header="CAMPAÑA" style={{ minWidth: '10rem' }} sortable body={campaniaBodyTemplate} filter/>
                <Column header={<>PLAN <SymbolSoles/></>} style={{ minWidth: '10rem' }} sortable body={planBodyTemplate} filter/>
                <Column header="FECHA CITA" style={{ minWidth: '10rem' }} sortable body={fechaCitaBodyTemplate} filter/>
                <Column header="ULTIMA FECHA DE SEGUIMIENTO" style={{ minWidth: '10rem' }} sortable body={ultimaFechaDeSeguimiento} filter/>
                {/* <Column header="ULTIMO COMENTARIO" style={{ minWidth: '10rem' }} sortable body={estadoLeadBodyTemplate} filter/> */}
                <Column header="ESTADO" style={{ minWidth: '10rem' }} sortable body={estadoLeadBodyTemplate} filter/>
                <Column header="" filterField="id" style={{ minWidth: '13rem' }} frozen alignFrozen="right" body={verHistoryBodyTemplate}/>
            </DataTable>
            <ModalCliente 
            data={prospectoLeadxID} 
            show={showModalEditComercio} onHide={onModalCancelComercioxID}/>
            <ModalComentarios uid_comentario={uidComment} show={showModalComentarios} onHide={onModalCloseComentarios}/>
        </>
    );
}



// Función para agrupar por label_canal
const agruparPorCanal = (data) => {
    return data.reduce((result, item) => {
      const labelCanal = item.parametro_canal?.label_param;
      
      // Encuentra el canal en el resultado
      let canal = result.find(group => group.label_canal === labelCanal);
      
      // Si no existe, lo crea
      if (!canal) {
        canal = { label_canal: labelCanal, items: [] };
        result.push(canal);
      }
      
      // Agrega el item al canal correspondiente
      canal.items.push(item);
      
      return result;
    }, []);
  };

  // Función para agrupar por label_canal
  const agruparPorCampanias = (data) => {
      return data.reduce((result, item) => {
        const labelCampanias = item.parametro_campania?.label_param;
        
        // Encuentra el canal en el resultado
        let canal = result.find(group => group.label_campanias === labelCampanias);
        
        // Si no existe, lo crea
        if (!canal) {
          canal = { label_campanias: labelCampanias, items: [] };
          result.push(canal);
        }
        
        // Agrega el item al canal correspondiente
        canal.items.push(item);
        
        return result;
      }, []);
    };
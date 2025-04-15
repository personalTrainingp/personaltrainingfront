import { Row, Col, Card, Modal } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { FilterMatchMode } from 'primereact/api';
import { Badge } from 'primereact/badge';
import React, { useState, useEffect, useRef } from 'react';
import { ModalTerminologia } from './modalTerminologia'
import { useDispatch } from 'react-redux';
import { onSetTerminologia } from '@/store/dataTerminologia/terminologiaSlice';
import { useTerminologiaStore } from '@/hooks/hookApi/useTerminologiaStore';
import { confirmDialog } from 'primereact/confirmdialog';
import { ModalTerminologiaGasto } from './modalTerminologiaGasto';
import { arrayFinanzas } from '@/types/type';


const DataTerminologiaGasto = (({data, id_empresa}) => {    
    const dispatch = useDispatch();
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const {terminologiaPorId,setTerminologiaPorId , actualizarTerminologiaGasto  ,  EliminarTerminologiaGasto} = useTerminologiaStore();

    const [isModalOpenTerminologiaGasto, setisModalOpenTerminologiaGasto] = useState(false);

    const modalTerminologiaGastoClose = () => {
        setisModalOpenTerminologiaGasto(false)
    }
    const modalTerminologiaGastoOpen = (terminologiaData) => {
        dispatch(onSetTerminologia(terminologiaData));
        setisModalOpenTerminologiaGasto(true)
    };

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between">
                <div className='d-flex'>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscador general" />
                    </IconField>
                </div>
                <div className='d-flex'>
                    {/* <Button label="IMPORTAR" icon='pi pi-file-import' onClick={()=>setshowModalImportadorData(true)} disabled text/> */}
                    {/* <ExportToExcel data={valueFilter}/> */}
                </div>
            </div>
        );
    };
    const actionBodyTemplate = (rowData)=>{
        const onClickEditModalEgresos = ()=>{
            setTerminologiaPorId(rowData);
            modalTerminologiaGastoOpen();
        }
        const confirmDeleteTerminologia = ()=>{
            confirmDialog({
                message: 'Seguro que quiero eliminar la Terminologia?',
                header: 'Eliminar Terminologia',
                icon: 'pi pi-info-circle',
                defaultFocus: 'reject',
                acceptClassName: 'p-button-danger',
                accept:  onAcceptDeleteTerminologiaGasto(rowData),
            });
        }


        
        const onAcceptDeleteTerminologiaGasto = async(rowData)=>{
            //setshowLoading(true)
            await EliminarTerminologiaGasto(rowData)
            //setshowLoading(false)
            showToast('success', 'Eliminar Terminologia', 'Terminologia Eliminado correctamente', 'success')
        }
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" 
                onClick={onClickEditModalEgresos} 
                />
                <Button icon="pi pi-trash" rounded outlined severity="danger" 
                onClick={confirmDeleteTerminologia} 
                />
            </React.Fragment>
        );
    }
    const onOpenModalIvsG = ()=>{
        //setisOpenModalEgresos(true)
    }   
    const tipoGastoBodyTemplate = (rowData)=>{
        return (
            <>
                {arrayFinanzas.find(g=>g.value===rowData.id_tipoGasto)?.label}
            </>
        )
    }
    
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };


	const header = renderHeader()
    
    return (
        <>
            <Row>
                <Col xs={12}>
                    <DataTable
                        size='small'
                        value={data} 
                        paginator
                        header={header}
                        rows={10}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        rowsPerPageOptions={[10, 25, 50, 100, 250]}
                        dataKey="id_param"
                        // selection={selectedCustomers}
                        // onSelectionChange={(e) => setselectedCustomers(e.value)}
                        filters={filters} 
                        filterDisplay="menu"
                        globalFilterFields={['grupo', 'nombre_gasto', 'id_tipoGasto']} 
                        emptyMessage="Terminologias no encontradas."
                        showGridlines
                        // loading={loading} 
                        stripedRows
                        scrollable
                    >
                        <Column header="ID" field='id' filterField="id" sortable style={{ width: '1rem' }} filter />
                        <Column header="GASTO" field='id_tipoGasto' filterField="id_tipoGasto" body={tipoGastoBodyTemplate} sortable />
                        <Column header="GRUPO" field='grupo' filterField="grupo" sortable />
                        <Column header="CONCEPTO" field='nombre_gasto' filterField='nombre_gasto'  sortable filter />
                        <Column header="" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right"  body={actionBodyTemplate} />
 
                    </DataTable>
                </Col>
            </Row>
            <ModalTerminologiaGasto  id_empresa={id_empresa} show={isModalOpenTerminologiaGasto} onHide={modalTerminologiaGastoClose} boleanActualizar={true} data={terminologiaPorId}  ></ModalTerminologiaGasto>

        </>
    );
});

export{DataTerminologiaGasto};
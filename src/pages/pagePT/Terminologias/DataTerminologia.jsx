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


const DataTerminologia = (({data}) => {
    const dispatch = useDispatch();
    const {terminologiaPorId,setTerminologiaPorId , actualizarTerminologia  , EliminarTerminologia} = useTerminologiaStore();

    const [isModalOpenProv, setisModalOpenProv] = useState(false);
    const modalProvClose = () => {

        setisModalOpenProv(false)
        //setSelectedParametro(null);
    }
    const modalProvOpen = (terminologiaData) => {
        dispatch(onSetTerminologia(terminologiaData));


        setisModalOpenProv(true)
    };

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between">
                {/* <div className='d-flex'>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscador general" />
                    </IconField>
                    <Button type="button" icon="pi pi-filter-slash" outlined onClick={clearFilter} />
                </div> */}
                <div className='d-flex'>
                </div>
            </div>
        );
    };
    const actionBodyTemplate = (rowData)=>{
        const onClickEditModalEgresos = ()=>{
            console.log(rowData);
            setTerminologiaPorId(rowData);
            modalProvOpen();

            //obtenerGastoxID(rowData.id)
        }
        const confirmDeleteTerminologia = ()=>{
            confirmDialog({
                message: 'Seguro que quiero eliminar la Terminologia?',
                header: 'Eliminar Terminologia',
                icon: 'pi pi-info-circle',
                defaultFocus: 'reject',
                acceptClassName: 'p-button-danger',
                accept:  onAcceptDeleteTerminologia(rowData),
            });
        }


        
        const onAcceptDeleteTerminologia = async(rowData)=>{
            //setshowLoading(true)
            await EliminarTerminologia(rowData)
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
                        // filters={filters} 
                        filterDisplay="menu"
                        // globalFilterFields={['id', 'oficio', 'column_razon_social', 'nombre_contacto', 'oficio', 'razon_social_prov', 'ruc_prov', 'cel_prov', 'nombre_vend_prov', 'Estado']} 
                        emptyMessage="Terminologias no encontradas."
                        showGridlines
                        // loading={loading} 
                        stripedRows
                        scrollable
                    >
                         <Column header="Id" field='id_param' filterField="id_param" sortable style={{ width: '1rem' }} filter />
                        <Column header="Grupo" field='grupo_param' filterField="grupo_param" sortable />
                        <Column header="Sigla" field='sigla_param' filterField='sigla_param'  sortable filter />
                        <Column header="Label" field='label_param' filterField='label_param'  sortable filter />
                        <Column header="Action" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right"  body={actionBodyTemplate} />
 
                    </DataTable>
                </Col>
            </Row>
            <ModalTerminologia  show={isModalOpenProv} onHide={modalProvClose} boleanActualizar={true} data={terminologiaPorId}  ></ModalTerminologia>

        </>
    );
});

export{DataTerminologia};
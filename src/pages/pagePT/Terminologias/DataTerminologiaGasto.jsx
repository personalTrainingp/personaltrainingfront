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


const DataTerminologiaGasto = (({data}) => {
    const dispatch = useDispatch();
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
                {/* <div className='d-flex'>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscador general" />
                    </IconField>
                    <Button type="button" icon="pi pi-filter-slash" outlined onClick={clearFilter} />
                </div> */}
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
                         <Column header="Id" field='id' filterField="id" sortable style={{ width: '1rem' }} filter />
                        <Column header="Grupo" field='grupo' filterField="grupo" sortable />
                        <Column header="Sigla" field='nombre_gasto' filterField='nombre_gasto'  sortable filter />
                        <Column header="Action" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right"  body={actionBodyTemplate} />
 
                    </DataTable>
                </Col>
            </Row>
            <ModalTerminologiaGasto  show={isModalOpenTerminologiaGasto} onHide={modalTerminologiaGastoClose} boleanActualizar={true} data={terminologiaPorId}  ></ModalTerminologiaGasto>

        </>
    );
});

export{DataTerminologiaGasto};
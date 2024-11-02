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

const DataTerminologia = (({data}) => {

    console.log(data);
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
 
                    </DataTable>
                </Col>
            </Row>
        </>
    );
});

export{DataTerminologia};
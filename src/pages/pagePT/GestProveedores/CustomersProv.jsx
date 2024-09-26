import { Row, Col, Card,  Modal } from 'react-bootstrap';
import { Table, PageBreadcrumb } from '@/components';
import { Proveedores } from '../data';
import { columns, sizePerPageList } from './ColumnsSet';
import { useToggle } from '@/hooks';
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { use } from 'i18next';
import { useForm } from '@/hooks/useForm';
import { useDispatch } from 'react-redux';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import { useOptionsStore } from '@/hooks/useOptionsStore';
import Select from 'react-select';
import { ModalProveedor } from './ModalProveedor';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { FilterMatchMode } from 'primereact/api';

const CustomersProv = () => {
	const dispatch = useDispatch()
	// const [modalProv, toggleModalProv] = useToggle();
    const [filters, setFilters] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS }
	});
    const [globalFilterValue, setGlobalFilterValue] = useState('');
	const [isModalOpenProv, setisModalOpenProv] = useState(false)
	const { obtenerProveedores }= useProveedorStore()
	const { dataProveedores } = useSelector(e=>e.prov)
	const modalProvClose = ()=>{
		setisModalOpenProv(false)
	}
	const modalProvOpen = ()=>{
		setisModalOpenProv(true)
	}
	useEffect(() => {
		obtenerProveedores()
	}, [])
	
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const clearFilter = () => {
        initFilters();
        setGlobalFilterValue('');
    };
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        });
        setGlobalFilterValue('');
    };
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
                    {/* <Button label="IMPORTAR" icon='pi pi-file-import' onClick={()=>setshowModalImportadorData(true)} disabled text/> */}
                    {/* <ExportToExcel data={valueFilter}/> */}
                </div>
            </div>
        );
    };
	
	const header = renderHeader()
	const HistorialProvBodyTemplate = (rowData)=>{
		return (
            <Link to={`/perfil-proveedor/${rowData.uid}`} className="action-icon" style={{fontSize: '14px', color: 'blue', textDecoration: 'underline'}}>
                Ver Perfil
            </Link>
		)
	}
	return (
		<>
			<PageBreadcrumb title="Gestion de proveedores" subName="E" />
			<Row>
				<Col xxl={1}>
				</Col>
				<Col xs={10}>
					<Card>
						<Card.Body>
							<Row>
								<Col sm={5}>
									{/* <Button className="btn btn-danger mb-2" onClick={modalProvOpen}>
										<i className="mdi mdi-plus-circle me-2"></i> Agregar proveedores
									</Button> */}
									<Button label='Agregar proveedor' onClick={modalProvOpen}/>
								</Col>
								<Col sm={7}>
								</Col>
							</Row>
							
							<DataTable 
							size='small' 
							value={dataProveedores} 
							paginator 
							header={header}
							rows={10} 
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
							rowsPerPageOptions={[10, 25, 50, 100, 250]} 
							dataKey="id"
							// selection={selectedCustomers}
							// onSelectionChange={(e) => setselectedCustomers(e.value)}
							filters={filters} 
							filterDisplay="menu" 
							globalFilterFields={['id', 'razon_social_prov', 'ruc_prov', 'cel_prov', 'nombre_vend_prov', 'Estado']} 
							emptyMessage="Egresos no encontrados."
							showGridlines 
							// loading={loading} 
							stripedRows
							scrollable
							// onValueChange={valueFiltered}
							>
							<Column header="Id" field='id' filterField="id" sortable style={{ width: '1rem' }} filter/>
							<Column header="Razon social" field='razon_social_prov' filterField="razon_social_prov" sortable/>
							<Column header="Ruc del proveedor" field='ruc_prov' filterField="ruc_prov" sortable style={{ width: '3rem' }} filter/>
							<Column header="Celular del proveedor" field='cel_prov' filterField="cel_prov" style={{ minWidth: '10rem' }} sortable/>
							<Column header="Nombre del vendedor" field='nombre_vend_prov' filterField='nombre_vend_prov' style={{ minWidth: '10rem' }} sortable filter/>
							<Column header="Estado" field='Estado' filterField="Estado" sortable style={{ minWidth: '10rem' }} filter />
							<Column header="Action" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={HistorialProvBodyTemplate}/>
						</DataTable>
						</Card.Body>
					</Card>
				</Col>
				<Col xxl={1}>
				</Col>
				<ModalProveedor show={isModalOpenProv} onHide={modalProvClose}/>
			</Row>
		</>
	);
};

export { CustomersProv };

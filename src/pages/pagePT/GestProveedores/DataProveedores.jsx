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
import { TabPanel, TabView } from 'primereact/tabview';
import { CustomersProv } from './CustomersProv';

export const DataProveedores = () => {
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
							<TabView>
                <TabPanel className='tabPanel-color-success' header={'Activos'}>
                  <CustomersProv estado_prov={true}/>
                </TabPanel>
                <TabPanel header={'Inactivos'}>
                  <CustomersProv estado_prov={false}/>
                </TabPanel>
              </TabView>
						</Card.Body>
					</Card>
				</Col>
				<Col xxl={1}>
				</Col>
			</Row>
      
				<ModalProveedor show={isModalOpenProv} onHide={modalProvClose}/>
		</>
	);
};

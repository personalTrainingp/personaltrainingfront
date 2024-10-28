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
import { Badge } from 'primereact/badge';

const CustomersAgente = ({estado_prov, agente}) => {
	const dispatch = useDispatch()
	// const [modalProv, toggleModalProv] = useToggle();
    const [filters, setFilters] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS }
	});
    const [globalFilterValue, setGlobalFilterValue] = useState('');
	const [isModalOpenProv, setisModalOpenProv] = useState(false)
	const [Customers, setCustomers] = useState(null);
	const { obtenerAgentes }= useProveedorStore()
	const { dataProveedores } = useSelector(e=>e.prov)
	const modalProvClose = ()=>{
		setisModalOpenProv(false)
	}
	const modalProvOpen = ()=>{
		setisModalOpenProv(true)
	}
	useEffect(() => {
		obtenerAgentes()
	}, [])
	useEffect(() => {
        const fetchData = () => {
            setCustomers(getCustomers(dataProveedores));
        };
        fetchData()
        initFilters();
        }, [dataProveedores]);
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
	
    const getCustomers = (data) => {
        return data.map(item => {
            // Crea una copia del objeto antes de modificarlo
            let newItem = { ...item };
			newItem.oficio = item.parametro_oficio?.label_param
			newItem.marca = item.parametro_marca?.label_param
			newItem.column_razon_social= `${item.parametro_oficio?` ${item.razon_social_prov}`:item.razon_social_prov}`
            return newItem;
            });
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
            <Link to={`/perfil-proveedor/${rowData.uid}`} className="action-icon text-primary" style={{fontSize: '14px', color: 'blue', textDecoration: 'underline'}}>
                Ver Perfil
            </Link>
		)
	}
	const EstadoProvBodyTemplate = (rowData)=>{
		return (
			<Badge value={`${rowData.estado?'Activo':'Inactivo'}`} size="normal" severity={`${rowData.estado?'success':'danger'}`}></Badge>
		)
	}
	const razonSocialBodyTemplate = (rowData)=>{
		return(
			<>
			    <span className='fw-bold'><p className='mb-0 pb-0'>{rowData.column_razon_social}</p></span>
			</>
		)
	}
	const oficioBodyTemplate = (rowData)=>{
		return(
			<>
			    <span className='fw-bold'><p className='mb-0 pb-0'><span className='text-primary'>{rowData.oficio}</span></p></span>
			</>
		)
	}
	const telefonoBodyTemplate = (rowData)=>{
		return(
			<>
			    <span className='fw-bold'><p className='mb-0 pb-0'><span className=''>{rowData.cel_prov&&rowData.cel_prov.match(/.{1,3}/g).join('-')}</span></p></span>
			</>
		)
	}
	const nombreContactoBodyTemplate = (rowData)=>{
		return(
			<>
			    <span className='fw-bold'><p className='mb-0 pb-0'><span className=''>{rowData.nombre_contacto}</span></p></span>
			</>
		)
	}
	return (
		<>
			<Row>
				<Col xs={12}>
							
							<DataTable 
							size='small' 
							value={Customers} 
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
							globalFilterFields={['id', 'oficio', 'column_razon_social', 'nombre_contacto', 'oficio', 'razon_social_prov', 'ruc_prov', 'cel_prov', 'nombre_vend_prov', 'Estado']} 
							emptyMessage="Egresos no encontrados."
							showGridlines 
							// loading={loading} 
							stripedRows
							scrollable
							// onValueChange={valueFiltered}
							>
								<Column header="Id" field='id' filterField="id" sortable style={{ width: '1rem' }} filter/>
								<Column header="Servicio y/o producto" field='oficio' filterField="oficio" body={oficioBodyTemplate} sortable/>
								<Column header="MARCA" field='marca' filterField='marca' style={{ minWidth: '10rem' }} sortable filter/>
								<Column header={<span>Nombre del <br/>contacto</span>} field='nombre_contacto' filterField="nombre_contacto" body={nombreContactoBodyTemplate} sortable/>
								<Column header={'Razon social'} field='razon_social_prov' filterField="razon_social_prov" body={razonSocialBodyTemplate} sortable/>
								{/* <Column header="Ruc del proveedor" field='ruc_prov' filterField="ruc_prov" sortable style={{ width: '3rem' }} filter/> */}
								<Column header="Celular del contacto" field='cel_prov' filterField="cel_prov" style={{ minWidth: '10rem' }} body={telefonoBodyTemplate} sortable/>
								{/* <Column header="Estado" field='Estado' filterField="Estado" sortable style={{ minWidth: '10rem' }} filter body={EstadoProvBodyTemplate} /> */}
								<Column header="Action" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={HistorialProvBodyTemplate}/>
							</DataTable>
				</Col>
			</Row>
		</>
	);
};

export { CustomersAgente };
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
import { App } from './PagosProveedores/App';
export const DataProveedores = () => {
	const [isModalOpenProv, setisModalOpenProv] = useState(false)
	const modalProvClose = ()=>{
		setisModalOpenProv(false)
	}
	const modalProvOpen = ()=>{
		setisModalOpenProv(true)
	}
	
	return (
		<>
			<PageBreadcrumb title="Gestion de proveedores" subName="E" />
			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<Row>
								<Col sm={5}>
									<Button label='Agregar proveedor' onClick={modalProvOpen}/>
								</Col>
								<Col sm={7}>
								</Col>
							</Row>
							<TabView>
								<TabPanel header={'PROVEEDORES'}>
									<TabView>
										<TabPanel header={'CHANGE'}>
											<TabView>
												<TabPanel header={'ACTIVOS'}>
													<CustomersProv estado_prov={true} agente={true} id_empresa={598}/>
												</TabPanel>
												<TabPanel header={'INACTIVOS'}>
													<CustomersProv estado_prov={false} agente={true} id_empresa={598}/>
												</TabPanel>
											</TabView>
										</TabPanel>
										<TabPanel header={'CIRCUS'}>
											<TabView>
												<TabPanel header={'ACTIVOS'}>
											<CustomersProv estado_prov={true} agente={true} id_empresa={601}/>
												</TabPanel>
												<TabPanel header={'INACTIVOS'}>
											<CustomersProv estado_prov={false} agente={true} id_empresa={601}/>
												</TabPanel>
											</TabView>
										</TabPanel>
										<TabPanel header={'REDUCTO'}>
											<TabView>
													<TabPanel header={'ACTIVOS'}>
												<CustomersProv estado_prov={true} agente={true} id_empresa={599}/>
													</TabPanel>
													<TabPanel header={'INACTIVOS'}>
												<CustomersProv estado_prov={false} agente={true} id_empresa={599}/>
													</TabPanel>
											</TabView>
										</TabPanel>
									</TabView>
								</TabPanel>
								<TabPanel header={'CONTRATOS POR PROVEEDOR'}>
									<TabView>
										<TabPanel header={'CHANGE'}>
											<App id_empresa={598} bgEmpresa='bg-change' classNameTablePrincipal={'bg-change p-2'}/>
										</TabPanel>
										<TabPanel header={'CIRCUS'}>
											<App id_empresa={601} bgEmpresa='bg-circus' classNameTablePrincipal={'bg-circus p-2'}/>
										</TabPanel>
										<TabPanel header={'REDUCTO'}>
											<App id_empresa={599} bgEmpresa='bg-greenISESAC' classNameTablePrincipal={'bg-greenISESAC p-2'}/>
										</TabPanel>
									</TabView>
								</TabPanel>
							</TabView>
						</Card.Body>
					</Card>
				</Col>
			</Row>
      
				<ModalProveedor show={isModalOpenProv} onHide={modalProvClose}/>
		</>
	);
};

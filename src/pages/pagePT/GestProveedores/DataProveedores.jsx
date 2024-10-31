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
                <TabPanel className='tabPanel-color-success' header={'Activos'}>
                  <CustomersProv estado_prov={true} agente={false}/>
                </TabPanel>
                <TabPanel header={'Inactivos'}>
                  <CustomersProv estado_prov={false} agente={false}/>
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

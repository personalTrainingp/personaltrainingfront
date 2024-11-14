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
			<PageBreadcrumb title="GASTOS" subName="E" />
			<Row>
				<Col xxl={1}>
				</Col>
				<Col xs={10}>
					<Card>
						<Card.Body>
							<Row>
								<Col sm={7}>
								</Col>
							</Row>
                  				<CustomersProv agente={true}/>
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

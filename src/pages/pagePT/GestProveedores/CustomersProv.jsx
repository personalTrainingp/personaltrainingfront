import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
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

const CustomersProv = () => {
	const dispatch = useDispatch()
	// const [modalProv, toggleModalProv] = useToggle();
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
	
	return (
		<>
			<PageBreadcrumb title="Gestion de proveedores" subName="E" />

			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<Row>
								<Col sm={5}>
									<Button className="btn btn-danger mb-2" onClick={modalProvOpen}>
										<i className="mdi mdi-plus-circle me-2"></i> Agregar proveedores
									</Button>
								</Col>
								<Col sm={7}>
									<div className="text-sm-end">
										<Button className="btn btn-success mb-2 me-1">
											<i className="mdi mdi-cog"></i>
										</Button>

										<Button className="btn btn-light mb-2 me-1">Importar</Button>

										<Button className="btn btn-light mb-2">Exportar</Button>
									</div>
								</Col>
							</Row>

							<Table
								columns={columns}
								data={dataProveedores}
								pageSize={10}
								sizePerPageList={sizePerPageList}
								isSortable={true}
								pagination={true}
								isSelectable={false}
								isSearchable={true}
								tableClass="table-striped"
								searchBoxClass="mt-2 mb-3"
							/>
						</Card.Body>
					</Card>
				</Col>
				
								{/* Sign up Modal */}
								<ModalProveedor show={isModalOpenProv} onHide={modalProvClose}/>
			</Row>
		</>
	);
};

export { CustomersProv };

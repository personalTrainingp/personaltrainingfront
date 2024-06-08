import { PageBreadcrumb, Table } from '@/components';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap';
import { columns, sizePerPageList } from './ColumnsSet';
import { products } from './data';
import { ModalEmpleado } from './ModalEmpleado';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';
import { useSelector } from 'react-redux';


export const GestionEmpleados = () => {
    const [show, setshow] = useState(false)
	const { obtenerUsuariosEmpleados } = useUsuarioStore()
	const {Dataempleados}  = useSelector(e=>e.authEmpl)
    const onModalEmpleadoOpen=()=>{
        setshow(true)
    }
    const  onModalEmpleadoClose =()=>{
        setshow(false)
    }
	useEffect(() => {
	  obtenerUsuariosEmpleados()
	}, [])
    return (
		<>
			<PageBreadcrumb title="Gestion de empleados" subName="E-commerce" />

			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<Row className="mb-2">
								<Col sm={5}>
									<span className="btn btn-danger mb-2" onClick={onModalEmpleadoOpen}>
										<i className="mdi mdi-plus-circle me-2"></i> Agregar empleados
									</span>
								</Col>

								<Col sm={7}>
									<div className="text-sm-end">
										<Button variant="success" className="mb-2 me-1">
											<i className="mdi mdi-cog-outline"></i>
										</Button>

										<Button variant="light" className="mb-2 me-1">
											Import
										</Button>

										<Button variant="light" className="mb-2">
											Export
										</Button>
									</div>
								</Col>
							</Row>

							<Table
								columns={columns}
								data={Dataempleados}
								pageSize={5}
								sizePerPageList={sizePerPageList}
								isSortable={true}
								pagination={true}
								isSearchable={true}
								theadClass="table-light"
								searchBoxClass="mb-2"
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>
            <ModalEmpleado show={show} onHide={onModalEmpleadoClose}/>
		</>
	);
}

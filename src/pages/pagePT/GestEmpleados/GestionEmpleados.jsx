import { PageBreadcrumb, Table } from '@/components';
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import { columns, sizePerPageList } from './ColumnsSet';
import { products } from './data';
import { ModalEmpleado } from './ModalEmpleado';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { TableEmpleados } from './TableEmpleados';


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
									{/* <Button onClick={onModalEmpleadoOpen}>
										<i className="mdi mdi-plus-circle me-2"></i> Agregar empleados
									</Button> */}
									<Button label='Agregar empleados' icon={'mdi mdi-plus-circle'} onClick={onModalEmpleadoOpen}/>
								</Col>
							</Row>
							{/* <Table
								columns={columns}
								data={Dataempleados}
								pageSize={5}
								sizePerPageList={sizePerPageList}
								isSortable={true}
								pagination={true}
								isSearchable={true}
								theadClass="table-light"
								searchBoxClass="mb-2"
							/> */}
							<TableEmpleados/>
						</Card.Body>
					</Card>
				</Col>
			</Row>
            <ModalEmpleado show={show} onHide={onModalEmpleadoClose}/>
		</>
	);
}

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
import { TabPanel, TabView } from 'primereact/tabview';


export const GestionEmpleados = () => {
    const [show, setshow] = useState(false)
    const onModalEmpleadoOpen=()=>{
        setshow(true)
    }
    const  onModalEmpleadoClose =()=>{
        setshow(false)
    }
    return (
		<>
			<PageBreadcrumb title="COLABORADORES" subName="E-commerce" />

			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<Row className="mb-2">
								<Col sm={5}>
									{/* <Button onClick={onModalEmpleadoOpen}>
										<i className="mdi mdi-plus-circle me-2"></i> Agregar empleados
									</Button> */}
									<Button label='AGREGAR COLABORADOR' icon={'mdi mdi-plus-circle'} onClick={onModalEmpleadoOpen}/>
								</Col>
							</Row>
							<TabView>
								<TabPanel header='CIRCUS'>
									<TabView>
										<TabPanel header='ACTIVOS'>
											<TableEmpleados  id_empresa={599} id_estado={1}/>
										</TabPanel>
										<TabPanel header='INACTIVOS'>
											<TableEmpleados  id_empresa={599} id_estado={0}/>
										</TabPanel>
									</TabView>
								</TabPanel>
								<TabPanel header='CHANGE'>
									<TabView>
										<TabPanel header='ACTIVOS'>
											<TableEmpleados  id_empresa={598} id_estado={1}/>
										</TabPanel>
										<TabPanel header='INACTIVOS'>
											<TableEmpleados  id_empresa={598} id_estado={0}/>
										</TabPanel>
									</TabView>
								</TabPanel>
								<TabPanel header='HISTORICO'>
									<TabView>
										<TabPanel header='INACTIVOS'>
											<TableEmpleados id_empresa={0} id_estado={0}/>
										</TabPanel>
									</TabView>
								</TabPanel>
							</TabView>
						</Card.Body>
					</Card>
				</Col>
			</Row>
            <ModalEmpleado show={show} onHide={onModalEmpleadoClose}/>
		</>
	);
}

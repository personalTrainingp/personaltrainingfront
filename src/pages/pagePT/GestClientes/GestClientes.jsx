import { PageBreadcrumb, Table } from '@/components';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap';
import { columns, sizePerPageList } from './ColumnsSet';
import { ModalCliente } from './ModalCliente';
import { useSelector } from 'react-redux';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';
import TableClientes from './TableClientes';


export const GestClientes = () => {
    const [showModalCliente, setshowModalCliente] = useState(false)
    const  { obtenerUsuariosClientes } = useUsuarioStore()
	const { Dataclientes } = useSelector(e=>e.authClient)
    const onModalRegClienteOpen=()=>{
        setshowModalCliente(true)
    }
    const  onModalRegClienteClose =()=>{
        setshowModalCliente(false)
    }
	useEffect(() => {
		obtenerUsuariosClientes()
	}, [])
	
  return (
    <>
    			<PageBreadcrumb title="GESTION DE SOCIOS" subName="E-commerce" />
                
			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<Row className="mb-2">
								<Col sm={5}>
									<span className="btn btn-danger mb-2" onClick={onModalRegClienteOpen}>
										<i className="mdi mdi-plus-circle me-2"></i> Agregar socio
									</span>
								</Col>
							</Row>
{/* 
							<Table
								columns={columns}
								data={Dataclientes}
								pageSize={5}
								sizePerPageList={sizePerPageList}
								isSortable={true}
								pagination={true}
								isSelectable={false}
								isSearchable={true}
								theadClass="table-light"
								searchBoxClass="mb-2"
							/> */}
							<TableClientes/>
						</Card.Body>
					</Card>
				</Col>
            <ModalCliente show={showModalCliente} onHide={onModalRegClienteClose}/>
			</Row>
    </>
  )
}

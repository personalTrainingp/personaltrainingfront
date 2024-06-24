import React, { useState } from 'react';
import { Card, Col, Dropdown, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ModalAgregarComisionCliente } from './ModalAgregarComisionCliente';

export const TipoCliente = () => {
    const tipoCliente = [
        {
            id: 1,
            sigla: 'NUE',
            tipo: 'NUEVO',
            descripcion: 'clientes que se inscriben en la membresía por primera vez'
        },{
            id: 2,
            sigla: 'REE',
            tipo: 'REEINSCRITO',
            descripcion: 'clientes que, después de haber cancelado o dejado expirar su membresía, deciden inscribirse nuevamente.'
        },
        {
            id: 3,
            sigla: 'REN',
            tipo: 'RENOVACION',
            descripcion: 'clientes que deciden renovar su membresía antes de que esta expire, manteniendo una continuidad en su afiliación.'
        }
    ]
    const [modalAddComision, setmodalAddComision] = useState(false)
    const [isCliente, setisCliente] = useState('')
    const onOpenModalAgregarComision=(sigla, tipo)=>{
        setmodalAddComision(true)
        setisCliente(tipo)
    }
	return (
		<div>
			<Row>
                {
                    tipoCliente.map(e=>(
                        <Col lg={4} key={e.id}>
                            <Card className="border border-3">
						<Card.Body>
							<Dropdown className="card-widgets" align="end">
								<Dropdown.Toggle
									variant="link"
									as="a"
									className="card-drop arrow-none cursor-pointer p-0 shadow-none"
								>
									<i className="ri-more-fill"></i>
								</Dropdown.Toggle>

								<Dropdown.Menu>
									<Dropdown.Item>
										<i className="mdi mdi-delete me-1"></i>Delete
									</Dropdown.Item>
                                    <Dropdown.Item onClick={()=>onOpenModalAgregarComision(e.sigla, e.tipo)}>
										<i className="mdi mdi-delete me-1"></i>Agregar comision
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>

							<h4 className="mt-0" style={{ cursor: 'pointer' }}>
								<Link style={{ color: 'black', fontSize: '30px' }} to={`/programa`}>
									{e.tipo}
								</Link>
							</h4>
							<p className="mb-1">
								<span className="pe-2 text-nowrap mb-2 d-inline-block">
									Ultima comision: <b>{/* {e.bono} */}</b>
								</span>
							</p>
							{
								<p className="text-muted font-13 my-1">
                                    {e.descripcion}
								</p>
							}
						</Card.Body>
					</Card>
                        </Col>
                    ))
                }
			</Row>
            <ModalAgregarComisionCliente show={modalAddComision} onHide={()=>setmodalAddComision(false)} isCliente={isCliente}/>
		</div>
	);
};

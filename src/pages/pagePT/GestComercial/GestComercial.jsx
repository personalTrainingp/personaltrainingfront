import { PageBreadcrumb, Table } from '@/components';
import React, { useEffect, useState } from 'react'
import {Card, Col, Row } from 'react-bootstrap';
import { columns, sizePerPageList } from './ColumnsSet';
import { ModalCliente } from './ModalCliente';
import { useSelector } from 'react-redux';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';
import TableClientes from './TableClientes';
import { Button } from 'primereact/button';
import { useProspectoLeadsStore } from '@/hooks/hookApi/useProspectoLeadsStore';


export const GestComercial = () => {
    const [showModalCliente, setshowModalCliente] = useState(false)
    // const  { obtenerProspectosLeads } = useProspectoLeadsStore()
	// const { dataView } = useSelector(e=>e.DATA)
    const onModalRegClienteOpen=()=>{
        setshowModalCliente(true)
    }
    const  onModalRegClienteClose =()=>{
        setshowModalCliente(false)
    }
	
  return (
    <>
    			<PageBreadcrumb title="GESTION DE SOCIOS" subName="E-commerce" />
                
			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<Row className="mb-2">
								<Col sm={5}>
									<Button label='Agregar socio' icon={'mdi mdi-plus-circle'} onClick={onModalRegClienteOpen}/>
								</Col>
							</Row>
							<TableClientes/>
						</Card.Body>
					</Card>
				</Col>
            <ModalCliente show={showModalCliente} onHide={onModalRegClienteClose}/>
			</Row>
    </>
  )
}

import { PageBreadcrumb } from '@/components';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row, Tab, Tabs } from 'react-bootstrap';
import { columns } from './ColumnsSet';
import { DataTableCR } from '@/components/DataView/DataTableCR';
import { ModalFormUser } from './ModalFormUser';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export const GestionAuthUser = () => {
    const [showFormUser, setshowFormUser] = useState(false)
    const { obtenerUsuariosAuth } = useUsuarioStore()
    const { DataUsuarios } = useSelector(e=>e.authEmpl)
    // estado = estado_user: un usuario inactivo no puede iniciar sesion
    const usuarios = DataUsuarios ?? []
    const activos = usuarios.filter(u=>u.estado)
    const inactivos = usuarios.filter(u=>!u.estado)
    const onModalFormUser = (bool)=>{
        setshowFormUser(bool)
    }
    useEffect(() => {
        obtenerUsuariosAuth()
    }, [])
    
  return (
    <>
    
			<PageBreadcrumb title="Gestion de usuarios" subName="E-commerce" />
<Row>
        <Col xs={12}>
            <Card>
                <Card.Body>
                    <Row className="mb-2">
                        <Col sm={5}>
                            <span className="btn btn-danger mb-2" onClick={()=>onModalFormUser(true)}>
                                <i className="mdi mdi-plus-circle me-2"></i> Agregar usuarios
                            </span>
                        </Col>
                    </Row>
                    <Tabs>
                        <Tab eventKey={'usuarios'} title={`Todo los usuarios (${usuarios.length})`}>
                            <DataTableCR
                                columns={columns}
                                data={usuarios}
                            />
                        </Tab>
                        <Tab eventKey={'usuariosAct'} title={`Usuarios activos (${activos.length})`}>
                            <DataTableCR
                                columns={columns}
                                data={activos}
                            />
                        </Tab>
                        <Tab eventKey={'usuariosInac'} title={`Usuarios inactivos (${inactivos.length})`}>
                            <DataTableCR
                                columns={columns}
                                data={inactivos}
                            />
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </Col>
        </Row>
        <ModalFormUser show={showFormUser} onHide={()=>onModalFormUser(false)}/>
    </>
  )
}

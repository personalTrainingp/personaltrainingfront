import { PageBreadcrumb, Table } from '@/components';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row, Tab, Tabs } from 'react-bootstrap';
import { columns, sizePerPageList } from './ColumnsSet';
import { products } from './data';
import { ModalFormUser } from './ModalFormUser';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export const GestionAuthUser = () => {
    const [showFormUser, setshowFormUser] = useState(false)
    const { obtenerUsuariosAuth } = useUsuarioStore()
    const { DataUsuarios } = useSelector(e=>e.authEmpl)
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
                        <Tab eventKey={'usuarios'} title={'Todo los usuarios'}>
                            <Table
                                columns={columns}
                                data={DataUsuarios}
                                pageSize={5}
                                sizePerPageList={sizePerPageList}
                                isSortable={true}
                                pagination={true}
                                isSearchable={true}
                                theadClass="table-light"
                                searchBoxClass="m-3"
                            />
                        </Tab>
                        {/* <Tab eventKey={'usuariosAct'} title={'Usuarios activos'}>
                        </Tab>
                        <Tab eventKey={'usuariosInac'} title={'Usuarios inactivados'}>
                        </Tab> */}
                    </Tabs>
                </Card.Body>
            </Card>
        </Col>
        </Row>
        <ModalFormUser show={showFormUser} onHide={()=>onModalFormUser(false)}/>
    </>
  )
}

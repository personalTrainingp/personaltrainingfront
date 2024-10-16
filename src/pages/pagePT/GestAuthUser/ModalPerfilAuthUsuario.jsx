import React, { useState } from 'react';
import sinAvatar from '@/assets/images/sinPhoto.jpg'
import { Button, Col, Modal, Row, Tab, Tabs } from 'react-bootstrap';

export const ModalPerfilAuthUsuario = ({ id_user, show, onHide }) => {
    
	const usuario = {
		id_user: 1,
        "nombres_user": "Carlos Kenedy",
        "apellidos_user": "Rosales Morales",
        "usuario_user": "usuarioPrueba123",
        "password_user": "123456",
        "email_user": "carlosrosales21092002@hotmail.com",
        "telefono_user": "933102718",
        "rol_user": 1,
        "notiPush_user": true,
        "estado_user": true
	};
    const [selectedFile, setSelectedFile] = useState(sinAvatar);
    const onSubmitActualizarPerfil = ()=>{

    }
	return (
		<Modal show={show} onHide={onHide} size='lg'>

			<Modal.Header>
                <Modal.Title>Perfil de {usuario.usuario_user}</Modal.Title>
                </Modal.Header>
            <Modal.Body>
                <Row className='mx-4'>
                    <Col lg={3}>
                            <img src={selectedFile} width={150} height={150} className='rounded-circle'/>
                    </Col>
                    <Col lg={9}>
                        <Row>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <span className='fs-5 fw-bold'>
                                        Nombres:
                                    </span>
                                    <p className='fs-5 text-break'>{usuario.nombres_user}</p>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <span className='fs-5 fw-bold'>
                                        Apellidos:
                                    </span>
                                    <p className='fs-5 text-break'>{usuario.apellidos_user}</p>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <span className='fs-5 fw-bold'>
                                        Usuario:
                                    </span>
                                    <p className='fs-5 text-break'>{usuario.usuario_user}</p>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <span className='fs-5 fw-bold'>
                                        Email:
                                    </span>
                                    <p className='fs-5 text-break'>{usuario.email_user}</p>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <span className='fs-5 fw-bold'>
                                        Telefono:
                                    </span>
                                    <p className='fs-5 text-break'>{usuario.telefono_user}</p>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <span className='fs-5 fw-bold'>
                                        Rol:
                                    </span>
                                    <p className='fs-5 text-break'>SuperUsuario</p>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <span className='bg-danger text-white p-1 rounded rounded-4'>Eliminar usuario</span>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className='mx-4 mt-4'>
                    <Tabs>
                        <Tab title={'Informacion basica'} eventKey='InfoBas'>
                            <form onSubmit={onSubmitActualizarPerfil}>
                                
                                <Button type='submit'>Actualizar perfil</Button>
                            </form>
                        </Tab>
                        <Tab title={'Actividades'} eventKey='Activ'>

                        </Tab>
                    </Tabs>
                </Row>
            </Modal.Body>
		</Modal>
	);
};

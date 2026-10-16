import React, { useEffect, useState } from 'react';
import sinAvatar from '@/assets/images/sinPhoto.jpg'
import { Button, Col, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import Select from 'react-select';
import { arrayEstados, arrayRoles } from '@/types/type';
import { useColaboradoresActivos } from './useColaboradoresActivos';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';

const formDesdeUsuario = (usuario) => ({
    nombres_user: usuario.nombres_user || '',
    apellidos_user: usuario.apellidos_user || '',
    usuario_user: usuario.usuario_user || '',
    password_user: '',
    email_user: usuario.email_user || '',
    telefono_user: usuario.telefono_user || '',
    rol_user: usuario.rol_user || 0,
    estado_user: usuario.estado_user ?? usuario.estado ?? true,
    id_colaborador: usuario.id_colaborador || 0,
})

export const ModalPerfilAuthUsuario = ({ usuario = {}, show, onHide }) => {
    const { obtenerColaboradoresActivos, dataColaboradores: dataEmpleados } = useColaboradoresActivos()
    const { startUpdateUsuarioAuth } = useUsuarioStore()
    const [form, setForm] = useState(formDesdeUsuario(usuario))
    const [guardando, setGuardando] = useState(false)
    useEffect(() => {
        if(show){
            obtenerColaboradoresActivos()
            setForm(formDesdeUsuario(usuario))
        }
    }, [show])
    const onChangeInput = ({ target }) => {
        setForm({ ...form, [target.name]: target.value })
    }
    const onChangeSelect = (option, name) => {
        setForm({ ...form, [name]: option?.value ?? null })
    }
    const rol = arrayRoles.find((r) => r.value === usuario.rol_user)?.label || '-'
    const colaborador = dataEmpleados.find((e) => e.value === usuario.id_colaborador)?.label || '-'
    const estado = usuario.estado_user ?? usuario.estado
    const [selectedFile, setSelectedFile] = useState(sinAvatar);
    const onSubmitActualizarPerfil = async(e)=>{
        e.preventDefault()
        setGuardando(true)
        const ok = await startUpdateUsuarioAuth(usuario.id, form)
        setGuardando(false)
        if(ok) onHide()
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
                                    <p className='fs-5 text-break'>{usuario.nombres_user || usuario.nombres_apellidos_user || '-'}</p>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <span className='fs-5 fw-bold'>
                                        Apellidos:
                                    </span>
                                    <p className='fs-5 text-break'>{usuario.apellidos_user || '-'}</p>
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
                                    <p className='fs-5 text-break'>{usuario.email_user || '-'}</p>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <span className='fs-5 fw-bold'>
                                        Telefono:
                                    </span>
                                    <p className='fs-5 text-break'>{usuario.telefono_user || '-'}</p>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <span className='fs-5 fw-bold'>
                                        Rol:
                                    </span>
                                    <p className='fs-5 text-break'>{rol}</p>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <span className='fs-5 fw-bold'>
                                        Colaborador:
                                    </span>
                                    <p className='fs-5 text-break'>{colaborador}</p>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <span className='fs-5 fw-bold'>
                                        Estado:
                                    </span>
                                    <p className='fs-5 text-break'>{estado ? 'Activo' : 'Inactivo'}</p>
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
                            <form onSubmit={onSubmitActualizarPerfil} className='mt-3'>
                                <Row>
                                    <Col lg={6}>
                                        <div className="mb-2">
                                            <label htmlFor="edit_nombres_user" className="form-label">Nombres*</label>
                                            <input className="form-control" type="text" id="edit_nombres_user" name="nombres_user" value={form.nombres_user} onChange={onChangeInput} required />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-2">
                                            <label htmlFor="edit_apellidos_user" className="form-label">Apellidos*</label>
                                            <input className="form-control" type="text" id="edit_apellidos_user" name="apellidos_user" value={form.apellidos_user} onChange={onChangeInput} required />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-2">
                                            <label htmlFor="edit_usuario_user" className="form-label">Usuario*</label>
                                            <input className="form-control" type="text" id="edit_usuario_user" name="usuario_user" value={form.usuario_user} onChange={onChangeInput} required />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-2">
                                            <label htmlFor="edit_password_user" className="form-label">Nueva contraseña</label>
                                            <input className="form-control" type="password" id="edit_password_user" name="password_user" value={form.password_user} onChange={onChangeInput} placeholder="Dejar vacio para no cambiarla" />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-2">
                                            <label htmlFor="edit_email_user" className="form-label">Email</label>
                                            <input className="form-control" type="text" id="edit_email_user" name="email_user" value={form.email_user} onChange={onChangeInput} />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-2">
                                            <label htmlFor="edit_telefono_user" className="form-label">Telefono</label>
                                            <input className="form-control" type="text" id="edit_telefono_user" name="telefono_user" value={form.telefono_user} onChange={onChangeInput} />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-2">
                                            <label className="form-label">Rol*</label>
                                            <Select
                                                onChange={(e) => onChangeSelect(e, 'rol_user')}
                                                placeholder={'Seleccione el rol'}
                                                className="react-select"
                                                classNamePrefix="react-select"
                                                options={arrayRoles}
                                                value={arrayRoles.find((o) => o.value === form.rol_user) || null}
                                            />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-2">
                                            <label className="form-label">Estado*</label>
                                            <Select
                                                onChange={(e) => onChangeSelect(e, 'estado_user')}
                                                placeholder={'Seleccione el estado'}
                                                className="react-select"
                                                classNamePrefix="react-select"
                                                options={arrayEstados}
                                                value={arrayEstados.find((o) => o.value === form.estado_user) || null}
                                            />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-2">
                                            <label className="form-label">Colaborador</label>
                                            <Select
                                                onChange={(e) => onChangeSelect(e, 'id_colaborador')}
                                                placeholder={'Seleccione el colaborador'}
                                                className="react-select"
                                                classNamePrefix="react-select"
                                                options={dataEmpleados}
                                                value={dataEmpleados.find((o) => o.value === form.id_colaborador) || null}
                                                isClearable
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Button type='submit' disabled={guardando}>{guardando ? 'Guardando...' : 'Actualizar perfil'}</Button>
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

import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore'
import { useForm } from '@/hooks/useForm'
import { arrayEstados, arrayRoles } from '@/types/type'
import React from 'react'
import { Button, Col, Modal, Row, Tab, Tabs } from 'react-bootstrap'
import Select from 'react-select'
const registerUsuario = {
    nombres_user: '',
    apellidos_user:'',
    usuario_user: '',
    password_user:'',
    email_user:'',
    telefono_user:'',
    rol_user: 0,
    notiPush_user: false,
    estado_user: false,
}
export const ModalFormUser = ({show, onHide}) => {
    const { 
            formState,
            nombres_user,
            apellidos_user,
            usuario_user,
            password_user,
            email_user,
            telefono_user,
            rol_user,
            notiPush_user,
            estado_user,
            onInputChange,
            onInputChangeReact,
            onResetForm} = useForm(registerUsuario)
            const {startRegisterUsuarioAuth} = useUsuarioStore()

            const submitUsuario = (e)=>{
                e.preventDefault()
                startRegisterUsuarioAuth(formState)
                cancelarModal()
            }
            const cancelarModal = ()=>{
                onHide()
                onResetForm()
            }
  return (
    <Modal show={show} onHide={cancelarModal} size='xxl'>
        <Modal.Header>
            Registrar un usuarios
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={submitUsuario}>
            <Row>
                            <Col>
                                <div className="mb-2">
                                    <label htmlFor="nombres_user" className="form-label">
                                        Nombres*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="nombres_user"
                                        id="nombres_user"
                                        placeholder="Nombres completos"
                                        value={nombres_user}
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>
                            </Col>
                            <Col>
                                <div className="mb-2">
                                    <label htmlFor="apellidos_user" className="form-label">
                                        Apellidos*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="apellidos_user"
                                        id="apellidos_user"
                                        placeholder="Apellidos completos"
                                        value={apellidos_user}
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="mb-2">
                                    <label htmlFor="usuario_user" className="form-label">
                                        Usuario*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="usuario_user"
                                        id="usuario_user"
                                        placeholder="Usuario"
                                        value={usuario_user}
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>
                            </Col>
                            <Col>
                                <div className="mb-2">
                                    <label htmlFor="password_user" className="form-label">
                                        Contraseña*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="password_user"
                                        id="password_user"
                                        placeholder="*********"
                                        value={password_user}
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="mb-2">
                                    <label htmlFor="email_user" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        className="form-control"
                                        name="email_user"
                                        id="email_user"
                                        placeholder="Email"
                                        value={email_user}
                                        onChange={onInputChange}
                                    />
                                </div>
                            </Col>
                            <Col>
                                <div className="mb-2">
                                    <label htmlFor="telefono_user" className="form-label">
                                        Telefono
                                    </label>
                                    <input
                                        className="form-control"
                                        name="telefono_user"
                                        id="telefono_user"
                                        placeholder="Telefono"
                                        value={telefono_user}
                                        onChange={onInputChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <div className="mb-2">
                            <label className="form-label col-form-label">Roles*:</label>
                            <div>
                                <Select
                                    onChange={(e) => onInputChangeReact(e, 'rol_user')}
                                    name="rol_user"
                                    placeholder={'Seleccione el estado'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={arrayRoles}
                                    value={arrayRoles.find(
                                        (option) => option.value === rol_user
                                    )}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="form-label col-form-label">Estado*:</label>
                            <div>
                                <Select
                                    onChange={(e) => onInputChangeReact(e, 'estado_user')}
                                    name="estado_user"
                                    placeholder={'Seleccione el estado'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={arrayEstados}
                                    value={arrayEstados.find(
                                        (option) => option.value === estado_user
                                    )}
                                    required
                                />
                            </div>
                        </div>
                        <div className='d-flex justify-content-center'>
                            <Button type='submit' className='mx-2'>Agregar usuario</Button>
                            <a onClick={cancelarModal} className='mx-2'>Cancelar</a>
                        </div>
                {/* Notificaciones: productos en stock minimo, ventas eliminadas y ventas hechas*/}

            </form>
        </Modal.Body>
    </Modal>
  )
}

import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { arrayEstados, arrayTarjetasTemp } from '@/types/type'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import Select from 'react-select'
const registerProvedor = {
    ruc_prov: '', 
	razon_social_prov: '', 
	tel_prov: '',
	cel_prov: '', 
	email_prov: '', 
	direc_prov: '', 
	dni_vend_prov: '',
	nombre_vend_prov: '',
	cel_vend_prov: '',
	email_vend_prov: '',
	estado_prov: true,
    id_oficio: 0
}
export const ModalProveedor = ({status, dataProv, onHide, show}) => {
    const { ruc_prov, 
            razon_social_prov, 
            tel_prov,
            cel_prov, 
            email_prov, 
            direc_prov, 
            dni_vend_prov,
			nombre_vend_prov,
			cel_vend_prov,
			email_vend_prov,
            estado_prov,
            cci,
            n_cuenta,
            id_tarjeta,
            id_oficio,
            formState, onResetForm, onInputChange, onInputChangeReact } = useForm(dataProv?dataProv:registerProvedor)
            const { startRegisterProveedor, message, isLoading, actualizarProveedor } = useProveedorStore()
            const { comboOficio, obtenerOficios } = useTerminoStore()
            const [visible, setVisible] = useState(false);
          
            const toastBC = useRef(null);
            useEffect(() => {
              if (visible && !isLoading) {
                toastBC.current?.show({
                  severity: `${message.ok?'success':'danger'}`,
                  summary: message.msg,
                  life: 1500,  // Duración del toast en milisegundos (3 segundos)
                //   sticky: true,
                  position: 'top-right'
                });
              }
            }, [visible, isLoading]);
            
            useEffect(() => {
                obtenerOficios()
            }, [])
            
            console.log(comboOficio);
            



            const clear = () => {
                toastBC.current.clear();
                setVisible(false);
            };
            
            const submitProveedor = async(e)=>{
                e.preventDefault()
                if(dataProv){
                    // console.log("actualizaro");
                    actualizarProveedor(formState, dataProv.id)
                    setVisible(true);
                    onCancelForm()
                    return;
                }
                await startRegisterProveedor(formState)
                onCancelForm()
                setVisible(true);
            }
            
            const onCancelForm = ()=>{
                onHide()
                onResetForm()
            }
  return (
    <>
        <Toast ref={toastBC} onRemove={clear} />
    <Modal onHide={onCancelForm} show={show} size='lg' backdrop={'static'}>
        
        {status=='loading'?'Cargando....':(
            <>
                <Modal.Header>
                    <Modal.Title>
                        {dataProv?'Actualizar proveedor':'Registrar proveedor'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={submitProveedor}>
                        <Row>
                            <Col lg={12}>
                                <p className='fw-bold fs-5 text-decoration-underline'>
                                Datos del proveedor
                                </p>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="ruc_prov" className="form-label">
                                    Ruc*
                                </label>
                                <input
                                    className="form-control"
                                    name="ruc_prov"
                                    id="ruc_prov"
                                    value={ruc_prov}
                                    onChange={onInputChange}
                                    placeholder="00000000000000"
                                    required
                                />
                            </div>
                            </Col>
                            <Col lg={8}>
                            <div className="mb-4">
                                <label htmlFor="razon_social_prov" className="form-label">
                                    Razon social*
                                </label>
                                <input
                                    className="form-control"
                                    name="razon_social_prov"
                                    id="razon_social_prov"
                                    value={razon_social_prov}
                                    onChange={onInputChange}
                                    placeholder="EJ. Distribuidora lima"
                                    required
                                />
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="cel_prov" className="form-label">
                                    N° Celular*
                                </label>
                                <input
                                    className="form-control"
                                    name="cel_prov"
                                    id="cel_prov"
                                    value={cel_prov}
                                    onChange={onInputChange}
                                    placeholder="EJ. 999 999 999"
                                />
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="tel_prov" className="form-label">
                                    N° Telefono*
                                </label>
                                <input
                                    className="form-control"
                                    name="tel_prov"
                                    id="tel_prov"
                                    value={tel_prov}
                                    onChange={onInputChange}
                                    placeholder="EJ. 321 5650"
                                />
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="email_prov" className="form-label">
                                    Correo*
                                </label>
                                <input
                                    className="form-control"
                                    name="email_prov"
                                    id="email_prov"
                                    value={email_prov}
                                    onChange={onInputChange}
                                    placeholder="EJ. EXAMPLE@GMAIL.COM"
                                />
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="direc_prov" className="form-label">
                                    Tarjeta
                                </label>
                                <Select
                                        onChange={(e) => onInputChangeReact(e, 'id_tarjeta')}
                                        name="id_tarjeta"
                                        placeholder={'Seleccione la tarjeta'}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        options={arrayTarjetasTemp}
                                        value={arrayTarjetasTemp.find(
                                            (option) => option.value === id_tarjeta
                                        )}
                                    />
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="n_cuenta" className="form-label">
                                    Numero de cuenta*
                                </label>
                                <input
                                    className="form-control"
                                    name="n_cuenta"
                                    id="n_cuenta"
                                    value={n_cuenta}
                                    onChange={onInputChange}
                                    placeholder="EJ. 0000000000"
                                />
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="cci" className="form-label">
                                    CCI*
                                </label>
                                <input
                                    className="form-control"
                                    name="cci"
                                    id="cci"
                                    value={cci}
                                    onChange={onInputChange}
                                    placeholder="EJ. 00000000000000000000"
                                />
                            </div>
                            </Col>
                            <Col lg={8}>
                            <div className="mb-4">
                                <label htmlFor="direc_prov" className="form-label">
                                    Direccion*
                                </label>
                                <input
                                    className="form-control"
                                    name="direc_prov"
                                    id="direc_prov"
                                    value={direc_prov}
                                    onChange={onInputChange}
                                    placeholder="EJ. JR LAS PERLAS"
                                />
                            </div>
                            </Col>
                            <Col lg={4}>
                                
                                <div className="mb-4">
                                    <label htmlFor="id_oficio" className="form-label">
                                        Oficio del proveedor*
                                    </label>
                                    
                                    <Select
                                        onChange={(e) => onInputChangeReact(e, 'id_oficio')}
                                        name="id_oficio"
                                        placeholder={'Seleccione el oficio del proveedor'}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        options={comboOficio}
                                        value={comboOficio.find(
                                            (option) => option.value === id_oficio
                                        )}
                                    />
                                </div>
                            </Col>
                            <Col lg={4}>
                                
                                <div className="mb-4">
                                    <label htmlFor="estado_prov" className="form-label">
                                        Estado*
                                    </label>
                                    
                                    <Select
                                        onChange={(e) => onInputChangeReact(e, 'estado_prov')}
                                        name="estado_prov"
                                        placeholder={'Seleccione el estado'}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        options={arrayEstados}
                                        value={arrayEstados.find(
                                            (option) => option.value === estado_prov
                                        )}
                                        required
                                    />
                                </div>
                            </Col>
                            <Col lg={12}>
                                <p className='fw-bold fs-5 text-decoration-underline'>
                                Datos del vendedor
                                </p>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-4">
                                    <label htmlFor="dni_vend_prov" className="form-label">
                                        Dni*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="dni_vend_prov"
                                        id="dni_vend_prov"
                                        value={dni_vend_prov}
                                        onChange={onInputChange}
                                        placeholder="60606061"
                                    />
                                </div>
                            </Col>
                            <Col lg={8}>
                                <div className="mb-4">
                                    <label htmlFor="nombre_vend_prov" className="form-label">
                                        Nombres*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="nombre_vend_prov"
                                        id="nombre_vend_prov"
                                        value={nombre_vend_prov}
                                        onChange={onInputChange}
                                        placeholder="Jhon Doe"
                                    />
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-4">
                                    <label htmlFor="cel_vend_prov" className="form-label">
                                        N° celular*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="cel_vend_prov"
                                        id="cel_vend_prov"
                                        value={cel_vend_prov}
                                        onChange={onInputChange}
                                        placeholder="999999999"
                                    />
                                </div>
                            </Col>
                            <Col lg={8}>
                                <div className="mb-4">
                                    <label htmlFor="email_vend_prov" className="form-label">
                                        Correo*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="email_vend_prov"
                                        id="email_vend_prov"
                                        value={email_vend_prov}
                                        onChange={onInputChange}
                                        placeholder="EJ. VENDEDOR@GMAIL.COM"
                                    />
                                </div>
                            </Col>
                            <Col lg={12}>
                                <Button type='submit'>
                                {dataProv?'Actualizar':'Registrar'}
                                </Button>
                                <a className='m-3 text-danger' onClick={onCancelForm} style={{cursor: 'pointer'}}>Cancelar</a>
                            </Col>
                        </Row>
                    </form>
                </Modal.Body>
            </>
        )
        }
    </Modal>
    </>
  )
}

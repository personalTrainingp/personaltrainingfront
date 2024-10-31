import { useForm } from '@/hooks/useForm'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import Select from 'react-select'

const Parametro = {
    id_param: '',
    entidad_param: '',
    grupo_param: '',
    sigla_param: '',
    label_param: '',
    estado_param: '',
    flag: true,
};

export const ModalTerminologia = ({status, dataProv, onHide, show })=>{

    const   {
        id_param ,
        entidad_param ,
        grupo_param ,
        sigla_param ,
        label_param ,
        estado_param,
        onResetForm, onInputChange, onInputChangeReact } = useForm(Parametro);   

    const [visible, setVisible] = useState(false);
    const toastBC = useRef(null);
    const clear = () => {
        toastBC.current.clear();
        setVisible(false);
    };
    const onCancelForm = ()=>{
        onHide()
        onResetForm()
    }
  
    const submitProveedor = async(e)=>{

    }

    return (
        <>
            <Toast ref={toastBC} onRemove={clear} />
        <Modal onHide={onCancelForm} show={show} size='lg' backdrop={'static'}>
            
            {status=='loading'?'Cargando....':(
                <>
                    <Modal.Header>
                        <Modal.Title>
                            {dataProv?'Actualizar Terminologia':'Registrar Terminologia'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={submitProveedor}>
                            <Row>
                                <Col lg={12}>
                                    <p className='fw-bold fs-5 text-decoration-underline'>
                                        Datos de la terminologia
                                    </p>
                                </Col>
                                <Col lg={12}>
                                    <div className="mb-4">
                                        <label htmlFor="nombre_contacto" className="form-label">
                                            Label*
                                        </label>
                                        <input
                                            className="form-control"
                                            name="nombre_contacto"
                                            id="nombre_contacto"
                                            value={label_param}
                                            onChange={onInputChange}
                                            placeholder=""
                                        />
                                    </div>
                                </Col>
                                <Col lg={8}>
                                <div className="mb-4">
                                    <label htmlFor="razon_social_prov" className="form-label">
                                       Sigla*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="razon_social_prov"
                                        id="razon_social_prov"
                                        value={sigla_param}
                                        onChange={onInputChange}
                                        placeholder=""
                                        required
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
};

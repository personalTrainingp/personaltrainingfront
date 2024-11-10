import { useForm } from '@/hooks/useForm'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { useTerminologiaStore } from '@/hooks/hookApi/useTerminologiaStore'

const Parametro = {
    id_param: '',
    entidad_param: '',
    grupo_param: '',
    sigla_param: '',
    label_param: '',
    estado_param: '',
    flag: true,
};

export const ModalTerminologia = ({status, onHide, show  , boleanActualizar , data})=>{

    const { registrarTerminologia , actualizarTerminologia } = useTerminologiaStore();
    const   {
        id_param ,
        entidad_param ,
        grupo_param ,
        sigla_param ,
        label_param ,
        estado_param,
        formState,
        onResetForm, onInputChange, onInputChangeReact } = useForm(data?data:Parametro);   

    const [visible, setVisible] = useState(false);
    const toastBC = useRef(null);
    const clear = () => {
        toastBC.current.clear();
        setVisible(false);
    };
    const onCancelForm = ()=>{
        onHide()
        onResetForm()
    };
  
    
    const { terminologia  } = useSelector(e => e.terminologia);
    let paramatero;
    if (terminologia) {
     paramatero = terminologia?.parametros ? terminologia?.parametros[0] : "";
        
    };

    
    const submitParametro = async(e)=>{
        e.preventDefault();
        // Parametro.entidad_param = paramatero.entidad_param;
        // Parametro.grupo_param = paramatero.grupo_param;
        // Parametro.sigla_param = sigla_param;
        // Parametro.label_param = label_param;
        //Parametro.estado_param = estado_param;

        const nuevoParametro = {
            ...Parametro,
            id_param: id_param,
            entidad_param: entidad_param,
            grupo_param: grupo_param,
            sigla_param: sigla_param,
            label_param: label_param,
        };
        if (boleanActualizar) {
            actualizarTerminologia(nuevoParametro);
        }
        if (!boleanActualizar) {
            console.log(paramatero);
            const nuevoParametro = {
                ...Parametro,
                id_param: id_param,
                entidad_param: paramatero.entidad_param,
                grupo_param: paramatero.grupo_param,
                sigla_param: sigla_param,
                label_param: label_param,
            };
            console.log("nuevoParametro");
            console.log(nuevoParametro);
            registrarTerminologia(nuevoParametro);
        }

        setVisible(true);
        onCancelForm();

        return;

    };

    //paramatero.grupo_param
    //paramatero.entidad_param
    return (
        <>
            <Toast ref={toastBC} onRemove={clear} />
        <Modal onHide={onCancelForm} show={show} size='lg' backdrop={'static'}>
            
            {status=='loading'?'Cargando....':(
                <>
                    <Modal.Header>
                        <Modal.Title>
                            {boleanActualizar?'Actualizar Terminologia':'Registrar Terminologia'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={submitParametro}>
                            <Row>
                                <Col lg={12}>
                                    <p className='fw-bold fs-5 text-decoration-underline'>
                                        Datos de la terminologia
                                    </p>
                                </Col>
                                <Col lg={12}>
                                    <div className="mb-4">
                                        <label htmlFor="label_param" className="form-label">
                                            Concepto*
                                        </label>
                                        <input
                                            className="form-control"
                                            name="label_param"
                                            id="label_param"
                                            value={label_param}
                                            onChange={onInputChange}
                                            placeholder=""
                                        />
                                    </div>
                                </Col>
                                <Col lg={8}>
                                <div className="mb-4">
                                    <label htmlFor="sigla_param" className="form-label">
                                       Sigla*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="sigla_param"
                                        id="sigla_param"
                                        value={sigla_param}
                                        onChange={onInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div>
                                </Col>
                              

                                <Col lg={12}>
                                    <Button type='submit'>
                                    {boleanActualizar?'Actualizar':'Registrar'}
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

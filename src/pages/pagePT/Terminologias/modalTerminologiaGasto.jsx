import { useForm } from '@/hooks/useForm'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { useTerminologiaStore } from '@/hooks/hookApi/useTerminologiaStore'
import { arrayFinanzas } from '@/types/type'

const ParametroGasto = {
    id: 0,
    grupo: '',
    id_tipoGasto: '',
    nombre_gasto: '',
    flag: true,
};

export const ModalTerminologiaGasto = ({status, onHide, show  , boleanActualizar, id_empresa , data})=>{
    console.log(id_empresa, "dddd");
    
    const { registrarTerminologiaGasto , actualizarTerminologiaGasto } = useTerminologiaStore();
    const   {
        id,
        grupo,
        id_tipoGasto,
        nombre_gasto,
        formState,
        onResetForm, onInputChange, onInputChangeReact } = useForm(data?data:ParametroGasto);   

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
    let paramateroGasto;
    if (terminologia) {
     paramateroGasto = terminologia?.parametros ? terminologia?.parametros[0] : "";
        
    };

    
    const submitParametro = async(e)=>{
        e.preventDefault();
        const nuevoParametroGasto = {
            // ...ParametroGasto,
            id: id,
            id_empresa: id_empresa,
            grupo: grupo,
            id_tipoGasto: id_tipoGasto,
            nombre_gasto: nombre_gasto,
        };
        if (boleanActualizar) {
            actualizarTerminologiaGasto(nuevoParametroGasto);
        }
        if (!boleanActualizar) {
            //console.log(paramatero);
            const nuevoParametroGasto = {
                //...ParametroGasto,
                id_empresa: id_empresa,
                grupo: grupo,
                id_tipoGasto: id_tipoGasto,
                nombre_gasto: nombre_gasto,
            };
            
            registrarTerminologiaGasto(nuevoParametroGasto);
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
                            {boleanActualizar?'Actualizar Terminologia Gasto':'Registrar Terminologia Gasto'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={submitParametro}>
                            <Row>
                                <Col lg={12}>
                                    <p className='fw-bold fs-5 text-decoration-underline'>
                                        Datos de la terminologia Gasto
                                    </p>
                                </Col>
                                <Col lg={12}>
                                    <div className="mb-4">
                                        <label htmlFor="nombre_gasto" className="form-label">
                                            TIPO DE GASTO*
                                        </label>
                                        <Select
                                            onChange={(e) => onInputChangeReact(e, 'id_tipoGasto')}
                                            name="id_tipoGasto"
                                            placeholder={'SELECCIONAR EL TIPO DE GASTO'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={arrayFinanzas}
                                            value={arrayFinanzas.find(
                                                (option) => option.value === id_tipoGasto
                                            )}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="mb-4">
                                        <label htmlFor="grupo" className="form-label">
                                            Grupo*
                                        </label>
                                        <input
                                            className="form-control"
                                            name="grupo"
                                            id="grupo"
                                            value={grupo}
                                            onChange={onInputChange}
                                            placeholder=""
                                        />
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="mb-4">
                                        <label htmlFor="nombre_gasto" className="form-label">
                                            Concepto*
                                        </label>
                                        <input
                                            className="form-control"
                                            name="nombre_gasto"
                                            id="nombre_gasto"
                                            value={nombre_gasto}
                                            onChange={onInputChange}
                                            placeholder=""
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

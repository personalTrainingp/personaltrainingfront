import { useForm } from '@/hooks/useForm'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { useTerminologiaStore } from '@/hooks/hookApi/useTerminologiaStore'
import { arrayFinanzas } from '@/types/type'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'

const ParametroGasto = {
    grupo: '',
    id_tipoGasto: '',
    id_grupo: 0,
    nombre_gasto: '',
    orden: 0,
    flag: true,
};

export const ModalTerminologiaGasto = ({status, onHide, show  , boleanActualizar, id_empresa , data})=>{
    const { registrarTerminologiaGasto , actualizarTerminologiaGasto } = useTerminologiaStore();
    const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
    const   {
        id,
        grupo,
        id_tipoGasto,
        orden,
        nombre_gasto,
        id_grupo,
        formState,
        onResetForm, onInputChange, onInputChangeReact } = useForm(data?data:ParametroGasto);   
        console.log({data});
        
    const [visible, setVisible] = useState(false);
    const toastBC = useRef(null);
    useEffect(() => {
        obtenerParametroPorEntidadyGrupo('grupos-gastos', id_empresa)
    }, [])
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
        if (boleanActualizar) {
            await actualizarTerminologiaGasto({...formState, id_empresa, grupo: dataParametros.find(
                                                (option) => option.value === id_grupo
                                            ).label});
        }
        if (!boleanActualizar) {
            await registrarTerminologiaGasto({...formState, id_empresa, grupo: dataParametros.find(
                                                (option) => option.value === id_grupo
                                            ).label});
        }

        setVisible(true);
        onCancelForm();

        return;

    };
    
    const dataParametros = DataGeneral.map(d=>{
        return {
            value: d.id,
            label: d.param_label
        }
    })
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
                                        <label htmlFor="id_grupo" className="form-label">
                                            Rubro*
                                        </label>
                                        <Select
                                            onChange={(e) => onInputChangeReact(e, 'id_grupo')}
                                            name="id_grupo"
                                            placeholder={'SELECCIONAR EL GRUPO'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={dataParametros}
                                            value={dataParametros.find(
                                                (option) => option.value === id_grupo
                                            )}
                                            required
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
                                    <div className="mb-4">
                                        <label htmlFor="orden" className="form-label">
                                            ORDEN*
                                        </label>
                                        <input
                                            className="form-control"
                                            name="orden"
                                            id="orden"
                                            value={orden}
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

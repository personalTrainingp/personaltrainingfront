import { useProgramaTrainingStore } from '@/hooks/hookApi/useProgramaTrainingStore'
import { useForm } from '@/hooks/useForm'
import { arrayEstados } from '@/types/type'
import React from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import Select from 'react-select'
const registerSemana = {
    sigla_pgm: '',
    semanas_st: '',
    congelamiento_st: '',
    nutricion_st: '',
    estado_st: true
}
export const ModalSemana = ({show, onHide, data, idpgm, uidPgm}) => {
    const { formState, sigla_pgm, semanas_st, congelamiento_st, nutricion_st, estado_st,onInputChangeReact, onInputChange, onResetForm } = useForm(data?data:registerSemana)
    const cancelModalSemana = () =>{
        onHide()
        onResetForm()
    }
    const { startRegisterSemanaPgm } = useProgramaTrainingStore()
    const submitSemanaPt = (e)=>{
        e.preventDefault()
        startRegisterSemanaPgm(formState, idpgm, uidPgm)
        cancelModalSemana()
    }
  return (
    <Modal show={show} onHide={cancelModalSemana} size={`${data?'lg':'xxl'}`}>
        <Modal.Header>
            <Modal.Title>
                Registrar Semana
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            
                <Row>
                    <Col>
                        <form onSubmit={submitSemanaPt}>
                            {/* <div className="mb-3 row">
                                <label className="form-label col-form-label">
                                    Sigla de programa:
                                </label>
                                <div>
                                    <Select
                                        onChange={(e) => onInputChangeReact(e, 'id_pgm')}
                                        name={'id_pgm'}
                                        placeholder={'Seleccione la sigla de programa'}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        options={newArray}
                                        value={newArray.find(
                                            (option) => option.value === sigla_pgm
                                        )}
                                        required
                                    ></Select>
                                </div>
                            </div> */}
                            <div className="mb-3 row">
                                <label className="form-label col-form-label">Semanas:</label>
                                <div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        onChange={onInputChange}
                                        name="semanas_st"
                                        id="semanas_st"
                                        value={semanas_st}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label className="form-label col-form-label">
                                    Congelamientos:
                                </label>
                                <div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        onChange={onInputChange}
                                        name="congelamiento_st"
                                        id="congelamiento_st"
                                        value={congelamiento_st}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label className="form-label col-form-label">Nutricion:</label>
                                <div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        onChange={onInputChange}
                                        name="nutricion_st"
                                        id="nutricion_st"
                                        value={nutricion_st}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label className="form-label col-form-label">Estado:</label>
                                <div>
                                    <Select
                                        onChange={(e) => onInputChangeReact(e, 'estado_st')}
                                        name="estado_st"
                                        placeholder={'Seleccione el estado'}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        options={arrayEstados}
                                        value={arrayEstados.find(
                                            (option) => option.value === estado_st
                                        )}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <Button type="submit">
                                    {/* {id_st === 0 ? 'Registrar' : 'Actualizar'} */}
                                    Registrar
                                </Button>
                            </div>
                        </form>
                    </Col>
                    { data &&
                    <Col>
                    {/* ACA TODAS LAS TARIFAS*/}
                    
                    </Col>
                    }
                </Row>
        </Modal.Body>
    </Modal>
  )
}

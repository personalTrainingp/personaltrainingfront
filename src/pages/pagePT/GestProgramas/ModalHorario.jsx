import { useForm } from '@/hooks/useForm'
import { arrayDataTrainer, arrayEstados } from '@/types/type'
import React, { useEffect } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import Select from 'react-select'
import { useProgramaTrainingStore } from '@/hooks/hookApi/useProgramaTrainingStore'
const registerHorario = {
    time_HorarioPgm: '00:00:00',
    aforo_HorarioPgm: '',
    trainer_HorarioPgm: 0,
    estado_HorarioPgm: true
}
export const ModalHorario = ({onHide, show, data, uidPgm, idpgm}) => {
    
    const { 
        id_HorarioPgm,
        time_HorarioPgm,
        aforo_HorarioPgm,
        trainer_HorarioPgm,
        estado_HorarioPgm,
        onInputChange: onPostInputHorarioChange,
        onInputChangeButton,
        onInputChangeReact,
        onInputChangeFlaticon, formState: formStateHr, onResetForm: onResetFormHr } = useForm(data?data:registerHorario)
        const { startRegisterHorarioPgm } = useProgramaTrainingStore()
        
        
        const onStartSubmitPost = (e) =>{
            e.preventDefault()
            startRegisterHorarioPgm(formStateHr, uidPgm, idpgm)
            onCancelSubmitPost()
        }
        const onCancelSubmitPost = (e) =>{
            onHide()
            onResetFormHr()
        }
  return (
    
    <Modal onHide={onCancelSubmitPost} show={show} backdrop={'static'}>
        <Modal.Header>
            Agregar Horario
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={onStartSubmitPost}>
                        <Row>
                            <Col xl={12}>
                                <div className='mb-2'>
                                    <input
                                            className="form-control"
                                            placeholder="Aforo"
                                            type='time'
                                            value={time_HorarioPgm}
                                            name='time_HorarioPgm'
                                            id='time_HorarioPgm'
                                            onChange={onPostInputHorarioChange}
                                            required
                                    />
                                </div>
                            </Col>
                            <Col xl={12}>
                                <div className='mb-2'>
                                    <input
                                            className="form-control"
                                            placeholder="Aforo"
                                            type='number'
                                            value={aforo_HorarioPgm}
                                            name='aforo_HorarioPgm'
                                            id='aforo_HorarioPgm'
                                            onChange={onPostInputHorarioChange}
                                            required
                                    />
                                </div>
                            </Col>
                            <Col xl={12}>
                                <div className='mb-2'>
                                    <Select
                                            onChange={(e)=>onInputChangeReact(e, "trainer_HorarioPgm")}
                                            name={"trainer_HorarioPgm"}
                                            placeholder={'Seleccione el entrenador(a)'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={arrayDataTrainer}
                                            value={arrayDataTrainer.find(
                                              (option) => option.value === trainer_HorarioPgm
                                            )}
                                            required
                                    ></Select>
                                </div>
                            </Col>
                            <Col xl={12} >
                                <div className='mb-2'>
                                    <Select
                                            onChange={(e)=>onInputChangeReact(e, "estado_HorarioPgm")}
                                            name={"estado_HorarioPgm"}
                                            placeholder={'Selecciona el estado'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={arrayEstados}
                                            value={arrayEstados.find(
                                              (option) => option.value === estado_HorarioPgm
                                            )}
                                            required
                                    ></Select>
                                </div>
                            </Col>
                            <Col xl={2}>
                                <Button type='submit'>Agregar</Button>
                                <a className='m-3 text-danger' onClick={onCancelSubmitPost}>Cancelar</a>
                            </Col>
                        </Row>
                    </form>
        </Modal.Body>
    </Modal>
  )
}

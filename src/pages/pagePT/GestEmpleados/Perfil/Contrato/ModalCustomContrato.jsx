import { useForm } from '@/hooks/useForm'
import React from 'react'
import { useContratoColaboradorStore } from './useContratoColaboradorStore'
import { Col, Modal, Row } from 'react-bootstrap'
import { InputDate, InputSelect, InputText } from '@/components/InputText'
const customContrato = {
  fecha_inicio: null,
  fecha_fin: null,
  sueldo: 0.00,
  observacion: ''
}
const customJornadaxDia = {

}
export const ModalCustomContrato = ({show, onHide, id_empleado}) => {
  const { formState, fecha_inicio, fecha_fin, sueldo, observacion, onInputChange, onResetForm } = useForm(customContrato)
  const { postContratoColaborador } = useContratoColaboradorStore()
  const onCancelCustomContrato = ()=>{
    onHide()
    onResetForm()
  }
  const onClickCustomContrato = (e)=>{
    e.preventDefault()
    postContratoColaborador(formState, id_empleado)
    onCancelCustomContrato()
  }
  return (
    <Modal show={show} onHide={onCancelCustomContrato} size='xl'>
      <Modal.Header>
        <Modal.Title>
          AGREGAR CONTRATO
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <Row>
            <Col lg={5}>
            <div>
              <h4 className='underline'>Dato laboral</h4>
            </div>
              <div className='m-2'>
                  <InputText label={'SUELDO'} nameInput={'sueldo'} onChange={onInputChange} value={sueldo} required/>
              </div>
              <div className='m-2'>
                  <InputDate label={'FECHA DE INICIO'} nameInput={'fecha_inicio'} onChange={onInputChange} value={fecha_inicio} required/>
              </div>
              <div className='m-2'>
                  <InputDate label={'FECHA FIN'} nameInput={'fecha_fin'} onChange={onInputChange} value={fecha_fin} required/>
              </div>
              <div>
                <h4 className='underline'>Jornada por dia</h4>
              </div>
                <div className='m-2'>
                    <Row className='align-items-center'>
                      <Col lg={4}>
                        <InputSelect options={[{value: '', label: 'FIJO'}, {value: '', label: '1 DIA SI, UN DIA NO'}, {value: '', label: '1 DIA SI, UN DIA NO'}]}/>
                      </Col>
                      <Col lg={4}>
                        <InputDate label={''} type='time'/>
                      </Col>
                      <Col lg={4}>
                        <InputSelect options={[{value: '', label: 'FIJO'}, {value: '', label: '1 DIA SI, UN DIA NO'}, {value: '', label: '1 DIA SI, UN DIA NO'}]}/>
                      </Col>
                    </Row>
                </div>
            </Col>
            <Col lg={12}>
            </Col>
          </Row>
        </form>
      </Modal.Body>
    </Modal>
  )
}

import { InputButton, InputDate, InputNumber, InputSelect, InputText } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import React, { useEffect } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { useGestionOperadoresPagoStore } from './useGestionOperadoresPagoStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
const customOperadoresPago = {
  fecha_ingreso: '',
  id_operador: 0,
  id_forma_pago: 0,
  id_tipo_tarjeta: 0,
  id_marca_tarjeta: 0,
  id_banco: 0,
  cuota: 0,
  porcentaje_comision: 0
}
export const ModalCustomOperadoresPago = ({show, onHide, isCopy, id}) => {
  const { updateGestionOperadoresPago, postGestionOperadoresPago, dataOperadorxID, obtenerGestionOperadorPagoxID } = useGestionOperadoresPagoStore()
  const { DataGeneral:dataOperadores, obtenerParametroPorEntidadyGrupo:obtenerOperadores } = useTerminoStore()
  const { DataGeneral:dataFormaPago, obtenerParametroPorEntidadyGrupo:obtenerFormaPago } = useTerminoStore()
  const { DataGeneral:dataTarjeta, obtenerParametroPorEntidadyGrupo:obtenerTarjeta } = useTerminoStore()
  const { DataGeneral:dataBancos, obtenerParametroPorEntidadyGrupo:obtenerBancos } = useTerminoStore()
  useEffect(() => {
    if(show){
      obtenerOperadores('formapago', 'operador')
      obtenerFormaPago('formapago', 'formapago')
      obtenerTarjeta('formapago', 'tarjeta')
      obtenerBancos('formapago', 'banco')
    }
  }, [show])
  
  useEffect(() => {
    if (id!==0) {
      obtenerGestionOperadorPagoxID(id)
    }
  }, [id])
  const { formState, onInputChange, onResetForm, fecha_ingreso, id_operador, id_forma_pago, id_tipo_tarjeta, id_marca_tarjeta, id_banco, cuota, porcentaje_comision } = useForm(id!==0?dataOperadorxID:customOperadoresPago)
  const onSubmit = ()=>{
    if(isCopy){
            const {  id, ...valores } = formState;
      postGestionOperadoresPago(valores)
    }else{
      if(id==0){
        postGestionOperadoresPago(formState)
      }else{
        updateGestionOperadoresPago(id, formState)
      }
    }
    onCancel()
  }
  const onCancel = ()=>{
    onHide()
    onResetForm()
  }
  return (
    <Modal show={show} onHide={onHide} size='lg'>
      <Modal.Header>
        <Modal.Title>
          AGREGAR
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <Row>
            <Col lg={12}>
              <div className='m-1'>
                <InputDate label={'FECHA DE INGRESO'} nameInput={'fecha_ingreso'} onChange={onInputChange} value={fecha_ingreso}/>
              </div>
            </Col>
            <Col lg={12}>
              <div className='m-1'>
                <InputSelect label={'Operador'} nameInput={'id_operador'} onChange={onInputChange} value={id_operador} options={dataOperadores}/>
              </div>
            </Col>
            <Col lg={12}>
              <div className='m-1'>
                <InputSelect label={'Forma pago'} nameInput={'id_forma_pago'} onChange={onInputChange} value={id_forma_pago} options={dataFormaPago}/>
              </div>
            </Col>
            <Col lg={12}>
              <div className='m-1'>
                <InputSelect label={'TIPO DE TARJETA'} nameInput={'id_tipo_tarjeta'} onChange={onInputChange} value={id_tipo_tarjeta} options={[{value: 35, label: 'DEBITO'}, {value: 37, label: 'CREDITO'}]}/>
              </div>
            </Col>
            <Col lg={12}>
              <div className='m-1'>
                <InputSelect label={'MARCA DE TARJETA'} nameInput={'id_marca_tarjeta'} onChange={onInputChange} value={id_marca_tarjeta} options={dataTarjeta}/>
              </div>
            </Col>
            <Col lg={12}>
              <div className='m-1'>
                <InputSelect label={'BANCO'} nameInput={'id_banco'} onChange={onInputChange} value={id_banco} options={dataBancos}/>
              </div>
            </Col>
            <Col lg={12}>
              <div className='m-1'>
                <InputNumber label={'CUOTA'} nameInput={'cuota'} onChange={onInputChange} value={cuota} />
              </div>
            </Col>
            <Col lg={12}>
              <div className='m-1'>
                <InputNumber label={'PORCENTAJE DE COMISION'} nameInput={'porcentaje_comision'} onChange={onInputChange} value={porcentaje_comision} />
              </div>
            </Col>
            <Col lg={12}>
              <div className='m-1'>
                <InputButton label={'AGREGAR'} onClick={onSubmit}/>
                <InputButton label={'CANCELAR'} variant={'_link'} onClick={onCancel}/>
              </div>
            </Col>
          </Row>
        </form>
      </Modal.Body>
    </Modal>
  )
}

import { InputButton, InputSelect, InputText } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import React, { useEffect } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { useGestionComercialStore } from './useGestionComercialStore'
const customComercial = {
  nombres: '',
  apellidos: '',
  celular: '',
  ubigeo_distrito_residencia: '',
  id_canal: 0,
  id_medio_comunicacion: 0,
  id_pgm: 0,
  id_estado: 0,
  id_empl: 0
}
export const ModalCustomComercial = ({show, onHide, isCopy, id}) => {
  const { formState, onInputChange, onResetForm, nombres, apellidos, celular, id_empl, ubigeo_distrito_residencia, id_canal, id_medio_comunicacion, id_pgm, id_estado } = useForm(customComercial)
  const { dataEmpleados, obtenerEmpleadosVendedores, dataCanales, dataMedioComunicacion, obtenerCanales, obtenerMedioComunicacion, obtenerEstadosComerciales, dataEstadoComercial,postGestionComercial, obtenerDistritosDeLima, dataDistritos } = useGestionComercialStore()
  useEffect(() => {
    if(show){
      obtenerEmpleadosVendedores()
      obtenerCanales()
      obtenerMedioComunicacion()
      obtenerEstadosComerciales()
      obtenerDistritosDeLima()
    }
  }, [show])
  const onSubmit = ()=>{
    postGestionComercial(formState)
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
            <Col lg={4}>
              <div className='m-1'>
                <InputText label={'CELULAR'} nameInput={'celular'} onChange={onInputChange} value={celular} required/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='m-1'>
                <InputText label={'NOMBRES'} nameInput={'nombres'} value={nombres} onChange={onInputChange} required/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='m-1'>
                <InputText label={'APELLIDOS'} nameInput={'apellidos'} value={apellidos} onChange={onInputChange} required/>
              </div>
            </Col>
            <Col lg={6}>
              <div className='m-1'>
                <InputSelect label={'ASESOR'} options={dataEmpleados} nameInput={'id_empl'} onChange={onInputChange} value={id_empl} required/>
              </div>
            </Col>
            <Col lg={6}>
              <div className='m-1'>
                <InputSelect label={'CANAL'} options={dataCanales} nameInput={'id_canal'} onChange={onInputChange} value={id_canal} required/>
              </div>
            </Col>
            <Col lg={6}>
              <div className='m-1'>
                <InputSelect label={'MEDIO DE COMUNICACION'} options={dataMedioComunicacion} nameInput={'id_medio_comunicacion'} onChange={onInputChange} value={id_medio_comunicacion} required/>
              </div>
            </Col>
            <Col lg={6}>
              <div className='m-1'>
                <InputSelect label={'UBIGEO'} options={dataDistritos} nameInput={'ubigeo_distrito_residencia'} onChange={onInputChange} value={ubigeo_distrito_residencia} required/>
              </div>
            </Col>
            <Col lg={6}>
              <div className='m-1'>
                <InputSelect label={'PROGRAMA'} options={[{label: 'CHANGE 45', value: 2}, {label: 'FS 45', value: 3}, {label: 'FISIO MUSCLE', value: 4}, {label: 'VERTIKAL CHANGE', value: 12}]} nameInput={'id_pgm'} onChange={onInputChange} value={id_pgm} required/>
              </div>
            </Col>
            <Col lg={6}>
              <div className='m-1'>
                <InputSelect label={'ESTADO'} options={dataEstadoComercial} nameInput={'id_estado'} onChange={onInputChange} value={id_estado} required/>
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

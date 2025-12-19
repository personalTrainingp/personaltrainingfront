import { InputButton, InputDate, InputSelect, InputText, InputTextArea } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useGestionAportes } from './hook/useGestionAportes'
import { TerminosOnShow } from '@/hooks/usePropiedadesStore'

const customAporte = {
  id_concepto: 0,
  n_comprobante: '',
  n_operacion: '',
  id_prov: 0,
  id_estado: 0,
  descripcion: '',
  monto: 0.00,
  id_comprobante: 0,
  fecha_comprobante: '',
  fecha_pago: '',
  id_forma_pago: 0,
  id_tipo_moneda: 0,
  id_banco: 0,
  id_tarjeta: 0
}
export const ModalCustomAporte = ({id, onHide, show, idEmpresa}) => {
  const { onPostGestionAporte } = useGestionAportes()
  const { dataOrigen } = TerminosOnShow(show)
  const { formState, onInputChange, onResetForm, id_concepto, n_comprobante, n_operacion, id_prov, id_estado, descripcion, id_tipo_moneda, monto, id_comprobante, fecha_comprobante, fecha_pago, id_forma_pago, id_banco, id_tarjeta } = useForm(customAporte)
  const onSubmit = ()=>{
    if(id===0){
      onPostGestionAporte(formState, idEmpresa)
    }else{

    }
    console.log({formState});
  }
  const onCancelCustomAporte = ()=>{
    onHide()
    onResetForm()
  }
  return (
    <Dialog onHide={onCancelCustomAporte} visible={show} header={`${id===0?'AGREGAR APORTE':'ACTUALIZAR APORTE'}`} style={{width: '70rem'}} position='top'>
        <form>
          <Row>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Concepto'} value={id_concepto} nameInput={'id_concepto'} onChange={onInputChange} options={[]}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Tipo de moneda'} value={id_tipo_moneda} nameInput={'id_tipo_moneda'} onChange={onInputChange} options={[]}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputText label={'Monto'} nameInput={'monto'} onChange={onInputChange} value={monto}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Tipo de comprobante'} value={id_comprobante} nameInput={'id_comprobante'} onChange={onInputChange} options={[]}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputText label={'N° de comprobante'} nameInput={'n_comprobante'} onChange={onInputChange} value={n_comprobante}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputDate label={'Fecha comprobante'} nameInput={'fecha_comprobante'} onChange={onInputChange} value={fecha_comprobante}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputText label={'N° de operacion'} nameInput={'n_operacion'} onChange={onInputChange} value={n_operacion}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputDate label={'Fecha Pago'} nameInput={'fecha_pago'} onChange={onInputChange} value={fecha_pago}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Forma pago'} value={id_forma_pago} nameInput={'id_forma_pago'} onChange={onInputChange} options={[]}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Banco'} value={id_banco} nameInput={'id_banco'} onChange={onInputChange} options={[]}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Tarjeta'} value={id_tarjeta} nameInput={'id_tarjeta'} onChange={onInputChange} options={[]}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Proveedor'} value={id_prov} nameInput={'id_prov'} onChange={onInputChange} options={[]}/>
              </div>
            </Col>
            <Col lg={4}>
              <div className='mb-2'>
                <InputSelect label={'Estados'} value={id_estado} nameInput={'id_estado'} onChange={onInputChange} options={[]}/>
              </div>
            </Col>
            <Col lg={12}>
              <div className='mb-2'>
                <InputTextArea label={'descripcion'} nameInput={'descripcion'} onChange={onInputChange} value={descripcion}/>
              </div>
            </Col>
            <Col lg={12}>
              <div className='mb-2'>
                <InputButton label={'Agregar'} onClick={onSubmit}/>
                <InputButton label={'Cancelar'} variant={'link'} onClick={onCancelCustomAporte}/>
              </div>
            </Col>
          </Row>
        </form>
    </Dialog>
  )
}

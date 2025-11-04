import { InputButton, InputSelect, InputText } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Col, Row } from 'react-bootstrap'
const customFeriados = {
  id: 0,
  nombre: '',
  descripcion: '',
  fecha: '',
  es_recurrente: false,
  tipo_feriado: 0,
}
export const ModalCustomFeriados = ({show, onHide, id}) => {
  const { formState, onInputChange, nombre, descripcion, fecha, tipo_feriado, onResetForm } = useForm(customFeriados)
  const onClickCustomFeriados = ()=>{
    
  }
  const onCancelCustomFeriados = ()=>{
    onResetForm()
    onHide()
  }
  return (
    <Dialog visible={show} onHide={onHide} style={{width: '40rem'}}>
      <form>
                <Row>
                    <Col lg={12}>
                        <div className='mb-3'>
                            <InputText label={'Nombre'} nameInput={'nombre'} onChange={onInputChange} value={nombre} required />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className='mb-3'>
                            <InputText label={'fecha'} nameInput={'fecha'} onChange={onInputChange} value={fecha} type={'date'} required />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className='mb-3'>
                            <InputText label={'Descripcion'} nameInput={'descripcion'} onChange={onInputChange} value={descripcion} required />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className='mb-3'>
                            <InputSelect label={'Tipo de feriado'} nameInput={'tipo_feriado'} onChange={onInputChange} value={tipo_feriado} required />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <InputButton onClick={onClickCustomFeriados} label={id==0?'Guardar':'Actualizar'}/>
                        <InputButton onClick={onCancelCustomFeriados} variant='link' label={'Cancelar'}/>
                    </Col>
                </Row>
            </form>
    </Dialog>
  )
}

import { InputButton, InputDate, InputSelect, InputText, InputTextArea } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useFeriadosStore } from './useFeriadosStore'
const customFeriados = {
  nombre: '',
  observacion: '',
  fecha: '',
  tipo: 0,
}
export const ModalCustomFeriados = ({show, onHide, id=0, id_empresa}) => {
  const { formState, onInputChange, nombre, fecha, onResetForm } = useForm(customFeriados)
  const { postFeriados } = useFeriadosStore()
  const onClickCustomFeriados = ()=>{
    postFeriados({...formState, fechaDesde: fecha, fechaHasta: fecha}, id_empresa)
    onCancelCustomFeriados()
  }
  const onCancelCustomFeriados = ()=>{
    onResetForm()
    onHide()
  }
  return (
    <Dialog visible={show} onHide={onHide} header={`FERIADO`} style={{width: '40rem'}}>
      <form>
                <Row>
                    <Col lg={12}>
                        <div className='mb-3'>
                            <InputText label={'AGREGAR FERIADO'} nameInput={'nombre'} onChange={onInputChange} value={nombre} required />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className='mb-3'>
                            <InputDate label={'fecha'} nameInput={'fecha'} onChange={onInputChange} value={fecha} type={'date'} required />
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

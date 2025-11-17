import { InputButton, InputDate, InputSelect, InputText, InputTextArea } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Col, Row } from 'react-bootstrap'
const customPenalidad = {
    id_tipo_penalidad: 0,
    fecha: '',
    monto: 0,
    observacion: ''
}
export const ModalCustomPenalidad = ({id, onHide, show}) => {
    const { formState, id_tipo_penalidad, fecha, monto, observacion, onInputChange } = useForm(customPenalidad)
    const onClickCustomProducto = ()=>{
        if(id==0){
            onPostProducto(formState, 0)
            onCancelCustomProducto()
            return;
        }else{
            onUpdateProducto(formState, id, 0)
            onCancelCustomProducto()
            return;
        }
    }
    const onCancelCustomProducto = ()=>{
        onHide();
        onResetForm();
    }
  return (
    <Dialog header={'Agregar penalidad'}>
        <form>
            <Row>
                <Col lg={4}>
                    <div className='mb-3'>
                        <InputSelect label={'TIPO DE PENALIDAD'} value={id_tipo_penalidad} nameInput={'id_tipo_penalidad'}/>
                    </div>
                </Col>
                <Col>
                    <div>
                        <InputDate label={'FECHA'} nameInput={'fecha'} value={fecha} onChange={onInputChange} required/>
                    </div>
                </Col>
                <Col lg={4}>
                    <div className='mb-3'>
                        <InputText label={'Monto a descontar'} nameInput={'monto'} onChange={onInputChange} value={monto} required />
                    </div>
                </Col>
                <Col lg={4}>
                    <div className='mb-3'>
                        <InputTextArea  label={'OBSEVACION'} nameInput={'observacion'} onChange={onInputChange} value={observacion} required />
                    </div>
                </Col>
                <Col lg={12}>
                    <InputButton onClick={onClickCustomProducto} label={id==0?'Guardar':'Actualizar'}/>
                    <InputButton onClick={onCancelCustomProducto} variant='link' label={'Cancelar'}/>
                </Col>
            </Row>
        </form>
    </Dialog>
  )
}

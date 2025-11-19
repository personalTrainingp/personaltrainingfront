import { InputButton, InputDate, InputSelect, InputText, InputTextArea } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { usePenalidadStore } from './usePenalidadStore'
const customPenalidad = {
    id_tipo_penalidad: 0,
    fecha: '',
    monto: 0,
    observacion: ''
}
export const ModalCustomPenalidad = ({id, onHide, show, idContrato=0}) => {
    const { formState, id_tipo_penalidad, fecha, monto, observacion, onInputChange, onResetForm } = useForm(customPenalidad)
    const { onPostPenalidad } = usePenalidadStore()
      const { obtenerParametroPorEntidadyGrupo:obtenerDataTipoPenalidades, DataGeneral:dataTipoPenalidades } = useTerminoStore()
    const onClickCustomPenalidad = ()=>{
        if(id==0){
            onPostPenalidad(formState, idContrato)
            onCancelCustomPenalidad()
            return;
        }else{
            onUpdateProducto(formState, id, idContrato)
            onCancelCustomPenalidad()
            return;
        }
    }
    const onCancelCustomPenalidad = ()=>{
        onHide();
        onResetForm();
    }
    useEffect(() => {
    if(show){
        obtenerDataTipoPenalidades('penalidad','tipo')
    }
    }, [show])
    
  return (
    <Dialog onHide={onHide} visible={show} header={'Agregar penalidad'} style={{width: '30rem'}}>
        <form>
            <Row>
                <Col lg={12}>
                    <div className='mb-3'>
                        <InputSelect label={'TIPO DE PENALIDAD'} value={id_tipo_penalidad} nameInput={'id_tipo_penalidad'} options={dataTipoPenalidades} onChange={onInputChange} required/>
                    </div>
                </Col>
                <Col lg={12}>
                    <div>
                        <InputDate label={'FECHA'} nameInput={'fecha'} value={fecha} onChange={onInputChange} required/>
                    </div>
                </Col>
                <Col lg={12}>
                    <div className='mb-3'>
                        <InputText label={'Monto a descontar'} nameInput={'monto'} onChange={onInputChange} value={monto} required />
                    </div>
                </Col>
                <Col lg={12}>
                    <div className='mb-3'>
                        <InputTextArea  label={'OBSEVACION'} nameInput={'observacion'} onChange={onInputChange} value={observacion} required />
                    </div>
                </Col>
                <Col lg={12}>
                    <InputButton onClick={onClickCustomPenalidad} label={id==0?'Guardar':'Actualizar'}/>
                    <InputButton onClick={onCancelCustomPenalidad} variant='link' label={'Cancelar'}/>
                </Col>
            </Row>
        </form>
    </Dialog>
  )
}

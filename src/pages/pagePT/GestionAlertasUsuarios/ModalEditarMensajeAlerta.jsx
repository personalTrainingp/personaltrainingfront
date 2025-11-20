import React from 'react'
import { useAlertasUsuarios } from './useAlertasUsuarios'
import { Dialog } from 'primereact/dialog'
import { InputText } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import { Button } from 'react-bootstrap'
const customMensajeAlerta = {
    mensaje: ''
}
export const ModalEditarMensajeAlerta = ({show, onHide, data}) => {
    const { updateMensajeAlertas } = useAlertasUsuarios()
    const mensajeAnterior=data.mensaje;
    const { formState, mensaje, onInputChange, onResetForm } = useForm(data)
    const onSubmitMensaje = ()=>{
        updateMensajeAlertas(mensaje, mensajeAnterior)
        onCancelarMensaje()
    }
    const onCancelarMensaje = ()=>{
        onHide()
        onResetForm()
    }
  return (
    <Dialog visible={show} onHide={onCancelarMensaje} header={`editar mensaje ${mensajeAnterior}`}>
        <form>
            <InputText label={'MENSAJE'} nameInput={'mensaje'} onChange={onInputChange} value={mensaje} required/>
            <Button onClick={onSubmitMensaje}>EDITAR</Button>
        </form>
    </Dialog>
  )
}

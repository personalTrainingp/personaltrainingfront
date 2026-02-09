import { InputButton, InputText } from '@/components/InputText'
import React from 'react'
import { Modal } from 'react-bootstrap'
import { useTerminologiaStore } from './useTerminologiaStore'
import { useForm } from '@/hooks/useForm'
const customTerm={
    label_param: '',
}
export const ModalAgregarTermino = ({show, onHide, onShowProveedores, onShowGastos, titulo, terminoAgregar, entidad, grupo}) => {
    const { registrarTerminologiaxEntidadyGrupo } = useTerminologiaStore()
    const { formState, label_param, onInputChange } = useForm(customTerm)
    const salirModal = ()=>{
        onHide()
        onShowProveedores()
        onShowGastos()
    }
    const onSubmit = ()=>{
        registrarTerminologiaxEntidadyGrupo({entidad_param: entidad, grupo_param: grupo, label_param}, entidad, grupo)
        salirModal()
    }
  return (
    <Modal show={show} onHide={onHide}>
        <Modal.Header>
            <Modal.Title>AGREGAR </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form>
                <div className='m-2'>
                    <InputText label={`${terminoAgregar}`} nameInput={'label_param'} value={label_param} onChange={onInputChange}/>
                </div>
                <div className='m-2'>
                    <InputButton label={'Agregar'} onClick={()=>onSubmit()}/>
                </div>
            </form>
        </Modal.Body>
    </Modal>
  )
}

import { InputButton, InputText } from '@/components/InputText'
import React from 'react'
import { useTerminologiaStore } from './useTerminologiaStore'
import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import { Modal } from 'react-bootstrap'
const customTerm={
    label_param: '',
}
export const ModalAgregarTermino = ({show, onHide, titulo, terminoAgregar, entidad, grupo}) => {
    const { registrarTerminologiaxEntidadyGrupo } = useTerminologiaStore()
    const { formState, label_param, onInputChange } = useForm(customTerm)
    const salirModal = ()=>{
        onHide()
    }
    const onSubmit = ()=>{
        registrarTerminologiaxEntidadyGrupo({entidad_param: entidad, grupo_param: grupo, label_param}, entidad, grupo)
        salirModal()
    }
  return (
    <Modal show={show} onHide={onHide} header={'AGREGAR'}>
            <form>
                <div className='m-2'>
                    <InputText label={`${terminoAgregar}`} nameInput={'label_param'} value={label_param} onChange={onInputChange}/>
                </div>
                <div className='m-2'>
                    <InputButton label={'Agregar'} onClick={()=>onSubmit()}/>
                    <InputButton label={'Cancelar'} onClick={()=>salirModal()} variant={'link'}/>
                </div>
            </form>
    </Modal>
  )
}

import { InputButton, InputSelect, InputText } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import { arrayFinanzas } from '@/types/type'
import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useTerminologias } from '../hook/useTerminologias'
const customTermGasto={
id_tipoGasto: 0, 
nombre_gasto: '', 
orden: 0, 
id_grupo: 0
}
export const ModalCustomTermGastos = ({show, onHide, id, id_empresa, tipo}) => {
    const { postTerm2, updateTerm2xID, obtenerTerm2 } = useTerminologias()
    useEffect(() => {
        if(id!==0){
            obtenerTerm2(id)
        }
    }, [id])
    
    const { formState, id_tipoGasto, nombre_gasto, orden, id_grupo, onInputChange, onResetForm } = useForm(customTermGasto)
    const cancelar = ()=>{
        onHide()
        onResetForm()
    }
    const guardar = ()=>{
        if (id!==0) {
            updateTerm2xID(id, id_empresa, tipo, formState)
        }else{
            postTerm2(id_empresa, tipo, formState)
        }
        cancelar()
    }
  return (
    <Modal show={show} onHide={cancelar}>
        <Modal.Header>
            <Modal.Title>
                Registrar Terminologia Gasto
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form>
                <div className='mb-2'>
                    <InputSelect label={'Tipo de gasto'} nameInput={'id_tipoGasto'} onChange={onInputChange} value={id_tipoGasto} options={arrayFinanzas} required/>
                </div>
                <div className='mb-2'>
                    <InputSelect label={'Grupo'} nameInput={'id_grupo'} onChange={onInputChange} value={id_grupo} options={arrayFinanzas} required/>
                </div>
                <div className='mb-2'>
                    <InputText label={'Concepto'} nameInput={'nombre_gasto'} onChange={onInputChange} value={nombre_gasto} required/>
                </div>
                <div className='mb-2'>
                    <InputText label={'orden'} nameInput={'orden'} onChange={onInputChange} value={orden} required/>
                </div>
                <div className='mb-2'>
                    <InputButton label={'Registrar'} onClick={()=>guardar()}/>
                    <InputButton label={'Cancelar'} variant={'link'} onClick={()=>cancelar()}/>
                </div>
            </form>
        </Modal.Body>
    </Modal>
  )
}

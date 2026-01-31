import { InputButton, InputSelect, InputText } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import { arrayFinanzas } from '@/types/type'
import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useTerminologias } from '../hook/useTerminologias'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
const customTermGasto={
id_tipoGasto: 0, 
nombre_gasto: '', 
orden: 0, 
id_grupo: 0
}
export const ModalCustomTermGastos = ({show, onHide, id, id_empresa, tipo}) => {
    const { postTerm2, updateTerm2xID, obtenerTerm2, dataTerm2 } = useTerminologias()
        const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
        useEffect(() => {
            if(show){
                obtenerParametroPorEntidadyGrupo('grupos-gastos', id_empresa)
            }
        }, [id_empresa, show])
        
    useEffect(() => {
        if(show){
            obtenerTerm2(id)
        }
    }, [show])
    console.log({id_empresa, DataGeneral, dataTerm2, id});
    
    const { formState, id_tipoGasto, nombre_gasto, orden, id_grupo, onInputChange, onResetForm } = useForm(id===0?customTermGasto:dataTerm2)
    const cancelar = ()=>{
        onHide()
        onResetForm()
    }
    const guardar = ()=>{
        if (id!==0) {
            updateTerm2xID(id, id_empresa, tipo, {...formState, grupo: DataGeneral.find(d=>d.id===id_grupo).param_label})
        }else{
            postTerm2(id_empresa, tipo, {...formState, grupo: DataGeneral.find(d=>d.id===id_grupo).param_label})
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
                    <InputSelect label={'Grupo'} nameInput={'id_grupo'} onChange={onInputChange} value={id_grupo} options={DataGeneral.map(d=>{
                        return {
                            value: d.id,
                            label: d.param_label
                        }
                    })} required/>
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

import { useForm } from '@/hooks/useForm'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { useGestionLeadStore } from './useGestionLeadStore'

const customLead = {
    fecha: null,
    cantidad: 0,
    monto: 0
}
export const ModalCustomLead = ({show, onHide, id, id_empresa=598, formUpdating}) => {
    const { postLead, updateLead } = useGestionLeadStore()
    const {formState, fecha, cantidad, monto, onInputChange, onResetForm} = useForm(id===0?customLead:formUpdating)
    const onCancelCustomLead = (e)=>{
        // e.preventDefault()
        onHide()
        onResetForm()
    }
    const onClickCustomLead = (e)=>{
        e.preventDefault()
        if(id!==0){
            updateLead(id, formState, id_empresa)
        }else{
            postLead(id_empresa, formState)
        }
        onCancelCustomLead()
    }
    console.log({fecha});
    
  return (
    <Dialog visible={show} onHide={onHide} header={`${id!==0?'EDITAR LEAD': 'AGREGAR LEAD'}`}>
        <form>
            <div className='mb-2'>
                <label>CANTIDAD</label>
                <input
                    className='form-control'
                    name='cantidad'
                    value={cantidad}
                    type='text'
                    onChange={onInputChange}
                />
            </div>
            <div className='mb-2'>
                <label>FECHA</label>
                <input
                    className='form-control'
                    name='fecha'
                    value={fecha}
                    type='date'
                    onChange={onInputChange}
                />
            </div>
            <div className='mb-2'>
                <label>MONTO</label>
                <input
                    className='form-control'
                    name='monto'
                    value={monto}
                    type='text'
                    onChange={onInputChange}
                />
            </div>
            <div className='mb-2'>
                <Button label='AGREGAR' type='submit' onClick={(e)=>onClickCustomLead(e)} />
                <Button label='CANCELAR' text onClick={(e)=>onCancelCustomLead(e)}/>
            </div>
        </form>
    </Dialog>
  )
}

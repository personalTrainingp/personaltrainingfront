import { useForm } from '@/hooks/useForm'
import { onDataFail, onSetDataView } from '@/store/data/dataSlice'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { useDispatch } from 'react-redux'
const regMesResChange = {
    mes: '', inversion: '', facturacion: '', numero_cierre: ''
}
export const ModalAddMesResChange = ({show, onHide}) => {
    const dispatch = useDispatch()
    const {formState, mes, inversion, facturacion, numero_cierre, ticket_medio, numero_mensajes, onInputChange} = useForm(regMesResChange)
    const onSubmitForm = (e)=>{
        e.preventDefault()
        dispatch(onDataFail(formState))
        onHide()
    }
  return (
    <Dialog
        visible={show}
        onHide={onHide}
        style={{width: '40rem'}}
        header='AGREGAR'
        >
        <form onSubmit={onSubmitForm}>
            <div className='mb-2'>
                <label>INVERSION</label>
                <input className='form-control' name='inversion' onChange={onInputChange} value={inversion}/>
            </div>
            <div className='mb-2'>
                <label>NUMERO DE MENSAJES</label>
                <input className='form-control' name='numero_mensajes' onChange={onInputChange} value={numero_mensajes}/>
            </div>
            <Button type='submit' label='agregar'/>
        </form>
    </Dialog>
  )
}

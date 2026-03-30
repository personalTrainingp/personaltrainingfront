import { InputButton, InputText } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useVentasPagosStore } from './useVentasPagosStore'
const customCuotas = {
    n_cuotas: 0,
}
export const ModalReportePagosVentas = ({onHide, show=false, id}) => {
    const { updatePagosVentas, obtenerPagosVentasxID, dataPagosxID } = useVentasPagosStore()
    useEffect(() => {
        obtenerPagosVentasxID(id)
    }, [id])
    const { formState, n_cuotas, onInputChange, onResetForm } = useForm(id!==0?customCuotas:dataPagosxID)
    const onClickSubmit = ()=>{
        updatePagosVentas(id, formState)
        cancelSubmit()
    }
    const cancelSubmit = ()=>{
        onHide()
        onResetForm()
    }
  return (
    <Modal show={show} onHide={onHide}>
        <div className='m-2'>
            <InputText label={'N CUOTAS'} nameInput={'n_cuotas'} onChange={onInputChange} value={n_cuotas} required/>
            <InputButton label={'ACTUALIZAR'} onClick={onClickSubmit}/>
            <InputButton label={'CANCELAR'} onClick={cancelSubmit} variant={'_link'}/>
        </div>
    </Modal>
  )
}

import { InputButton, InputDate, InputText } from '@/components/InputText'
import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useTc } from './hook/useTc'
import { useForm } from '@/hooks/useForm'
const customTC = {
    precio_venta: 0.00,
    precio_compra: 0.00,
    fecha: '',

}
export const ModalTc = ({show, onHide, id}) => {
    const { postTC, updateTCxID, dataTC, obtenerTCxID } = useTc()
    useEffect(() => {
        obtenerTCxID(id)
    }, [id])
    
    const { formState, precio_compra, precio_venta, fecha, onInputChange, onResetForm } = useForm(id!==0?dataTC:customTC)
    const submitTC = ()=>{
        if(id!==0){
            updateTCxID({...formState, monedaOrigen: 'USD', monedaDestino: 'PEN'}, id)
            cancelarTC()
        }else{
            postTC({...formState, monedaOrigen: 'USD', monedaDestino: 'PEN'})
            cancelarTC()
        }
    }
    const cancelarTC = ()=>{
        onHide()
        onResetForm()
    }
  return (
    <Modal show={show} onHide={cancelarTC}>
        <Modal.Header>
            <Modal.Title>AGREGAR TC</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form>
                <div className='m-2'>
                    <InputText label={'PRECIO DE VENTA'} nameInput={'precio_venta'} onChange={onInputChange} value={precio_venta} required/>
                </div>
                <div className='m-2'>
                    <InputText label={'PRECIO DE COMPRA'} nameInput={'precio_compra'} onChange={onInputChange} value={precio_compra} required/>
                </div>
                <div className='m-2'>
                    <InputDate label={'FECHA'} nameInput={'fecha'} onChange={onInputChange} value={fecha} type='date' required/>
                </div>
                <div>
                    <InputButton label={'AGREGAR'} onClick={submitTC}/>
                    <InputButton label={'CANCELAR'} onClick={cancelarTC} variant={'link'}/>
                </div>
            </form>
        </Modal.Body>
    </Modal>
  )
}

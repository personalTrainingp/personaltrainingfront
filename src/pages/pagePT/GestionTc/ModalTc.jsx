import { InputDate, InputText } from '@/components/InputText'
import React from 'react'
import { Modal } from 'react-bootstrap'

export const ModalTc = () => {
  return (
    <Modal>
        <Modal.Header>
            <Modal.Title>AGREGAR TC</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form>
                <div className='m-2'>
                    <InputText label={'PRECIO DE COMPRA'}/>
                </div>
                <div className='m-2'>
                    <InputText label={'PRECIO DE COMPRA'}/>
                </div>
                <div className='m-2'>
                    <InputText label={'PRECIO DE VENTA'}/>
                </div>
                <div className='m-2'>
                    <InputDate label={'FECHA'}/>
                </div>
            </form>
        </Modal.Body>
    </Modal>
  )
}

import { InputDate, InputText } from '@/components/InputText'
import React from 'react'
import { Modal } from 'react-bootstrap'

export const ModalCustomGestionIgv = ({show, onHide, id}) => {
  return (
    <Modal show={show} onHide={onHide}>
        <Modal.Header>
            <Modal.Title>
                GESTION DE IGV {id}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form>
                <InputDate label={'FECHA DE COMPROBANTE'}/>
            </form>
        </Modal.Body>
    </Modal>
  )
}

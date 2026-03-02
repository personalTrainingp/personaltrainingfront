import { SectionComentario } from '@/components/Comentario/SectionComentario'
import React from 'react'
import { Modal } from 'react-bootstrap'

export const ModalComentario = ({show, onHide, uid_comentario=''}) => {
  return (
    <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header>
            <Modal.Title>
                COMENTARIOS
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <SectionComentario uid_comentario={uid_comentario}/>
        </Modal.Body>
    </Modal>
  )
}

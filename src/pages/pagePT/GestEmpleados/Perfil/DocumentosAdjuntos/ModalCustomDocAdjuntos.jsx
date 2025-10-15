import { Dialog } from 'primereact/dialog'
import React from 'react'

export const ModalCustomDocAdjuntos = ({show, onHide, id, uid_docs}) => {
  return (
    <Dialog visible={show} onHide={onHide} header={`AGREGAR DOCUMENTO ${id}`}>
          
    </Dialog>
  )
}

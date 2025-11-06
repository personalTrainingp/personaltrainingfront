import { Dialog } from 'primereact/dialog'
import React from 'react'

export const ModalCustomAsistencia = ({onHide, show=false, id=0}) => {
  return (
    <Dialog onHide={onHide} visible={show} header={'AGREGAR ASISTENCIA'}>

    </Dialog>
  )
}

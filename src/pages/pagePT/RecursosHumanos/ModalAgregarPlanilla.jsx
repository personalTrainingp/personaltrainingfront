import { Dialog } from 'primereact/dialog'
import React from 'react'

export const ModalAgregarPlanilla = ({show, onHide}) => {
  return (
    <Dialog onHide={onHide} visible={show}>
        <h1>AGREGAR COLABORADOR PARA PLANILLA</h1>
    </Dialog>
  )
}

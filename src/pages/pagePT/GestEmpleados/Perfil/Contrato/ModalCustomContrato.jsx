import { Dialog } from 'primereact/dialog'
import React from 'react'

export const ModalCustomContrato = ({show, onHide}) => {
  return (
    <Dialog visible={show} onHide={onHide} header={'AGREGAR CONTRATO'}>
      <form>
        
      </form>
    </Dialog>
  )
}

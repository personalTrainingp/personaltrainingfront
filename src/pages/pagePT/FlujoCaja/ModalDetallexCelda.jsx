import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Table } from 'react-bootstrap'

export const ModalDetallexCelda = ({show, onHide, data}) => {
  return (
    <Dialog visible={show} style={{width: '60rem'}} onHide={onHide} header={`EGRESOS POR DETALLE - ${data?.grupo} - ${data?.concepto}`}>
        <Table responsive hover>

        </Table>
    </Dialog>
  )
}

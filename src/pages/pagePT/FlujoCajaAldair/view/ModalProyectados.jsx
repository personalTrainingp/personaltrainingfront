import React from 'react'
import { Modal, Table } from 'react-bootstrap'
import { TableProyectados } from '../DataTables/TableProyectados'
import { agruparConceptos } from '../helpers/agrupamientosOficiales'

export const ModalProyectados = ({data, fechas=[], show, onHide, anio=2026, mes=4}) => {
  return (
    <Modal show={show} onHide={()=>onHide()} size='xl'>
        <Modal.Header>
            PROYECTADOS
        </Modal.Header>
        <Modal.Body>
            <TableProyectados data={data} fechas={fechas} mes={mes} anio={anio}/>
        </Modal.Body>
    </Modal>
  )
}

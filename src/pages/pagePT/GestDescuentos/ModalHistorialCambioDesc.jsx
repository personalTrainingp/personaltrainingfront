import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import DataTable from 'react-data-table-component';
import { columns } from './ColumnsSet';
import { useImpuestosStore } from '@/hooks/hookApi/useImpuestosStore';
import { useSelector } from 'react-redux';

export const ModalHistorialCambioDesc = ({show, onHide, id_impuesto}) => {
    const cancelModal = () =>{
        onHide();
    }
    const { obtenerHistoricoImpuesto } = useImpuestosStore()
    const { dataHistoricoImpuestxImpuest } = useSelector(e=>e.impuestos)
    useEffect(() => {
      obtenerHistoricoImpuesto(id_impuesto)
    }, [id_impuesto])
  return (
    <Modal show={show} onHide={cancelModal}>
        <Modal.Header>
            <Modal.Title>Historial de cambios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <DataTable
							columns={columns}
							data={dataHistoricoImpuestxImpuest}
							dense={true}
              noDataComponent={<p>No hay cambios</p>}
            />
        </Modal.Body>
    </Modal>
  )
}

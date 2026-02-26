import React from 'react'
import { Modal, Table } from 'react-bootstrap'

export const ModalTableItems = ({show, onHide, id, items={}, onOpenModalCustom}) => {
    console.log({items});
    
  return (
    <Modal show={show} onHide={onHide} size='xl'>
        <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='tab-scroll-container'>
                <Table>
                    <thead>
                        <tr className={`bg-change text-white text-center text-uppercase fs-4`}>
                            <th className='p-2 text-white'>Acciones</th>
                            <th className='p-2 text-white'>Instituto / Colaborador</th>
                            <th className='p-2 text-white'>Descripción / Eventos</th>
                            <th className='p-2 text-white'>Fecha<br /> Comprobante</th>
                            <th className='p-2 text-white'>Fecha<br /> Pago</th>
                            <th className='p-2 text-end text-white'>Monto</th>
                            <th className='p-2 text-white'>Documento</th>
                            <th className='p-2 text-white'>Forma Pago</th>
                            <th className='p-2 text-white'>N° Comprobante</th>
                            <th className='p-2 text-white'>N° Operación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            items?.map(f=>{
                                return (
                                    <tr key={f.id}>
                                        <td onClick={() => onOpenModalCustom(f.id)}>
                                            <i className='pi pi-pencil fw-bold text-primary cursor-pointer p-2 rounded hover-bg-light' title="Editar" />
                                        </td>
                                        <td>{f.tb_Proveedor?.razon_social_prov}</td>
                                        <td>{f.descripcion}</td>
                                        <td>{f.fecha_comprobante}</td>
                                        <td>{f.fecha_pago}</td>
                                        <td>{f.monto}</td>
                                        <td>{f.parametro_comprobante?.label_param}</td>
                                        <td>{f.parametro_forma_pago?.label_param}</td>
                                        <td>{f.n_comprabante}</td>
                                        <td>{f.n_operacion|| 'EFECTIVO'}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>
        </Modal.Body>
    </Modal>
  )
}

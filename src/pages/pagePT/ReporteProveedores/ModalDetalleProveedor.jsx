import React from 'react'
import { Modal, Table } from 'react-bootstrap'
import dayjs from 'dayjs'
import { NumberFormatMoney } from '@/components/CurrencyMask'

// Muestra el detalle de los items (egresos y/o cuentas por pagar) que se suman
// en una celda del reporte de proveedores.
export const ModalDetalleProveedor = ({ show, onHide, title, items = [] }) => {
    return (
        <Modal show={show} onHide={onHide} size='xl'>
            <Modal.Header closeButton>
                <Modal.Title className='fs-2'>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table responsive striped className='fs-4'>
                    <thead>
                        <tr>
                            <th>TIPO</th>
                            <th>MARCA</th>
                            <th>FECHA COMPROBANTE</th>
                            <th>N° DOC.</th>
                            <th>DETALLE</th>
                            <th>MONEDA</th>
                            <th>MONTO</th>
                            <th>TC</th>
                            <th>MONTO S/.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            items.length === 0 && (
                                <tr>
                                    <td colSpan={9} className='text-center'>Sin registros</td>
                                </tr>
                            )
                        }
                        {
                            items.map((item, i) => {
                                const esEgreso = item.tipo === 'EGRESO'
                                const detalle = esEgreso ? item.descripcion : item.descripcion?.split(':').slice(1).join(':').trim()
                                const nDoc = esEgreso ? item.n_comprabante : item.n_operacion
                                const tc = Number(item.tc || 0)
                                return (
                                    <tr key={`${item.tipo}-${item.id}-${i}`}>
                                        <td>
                                            <span className={`badge ${esEgreso ? 'bg-danger' : 'bg-primary'}`}>{item.tipo}</span>
                                        </td>
                                        <td>{item.empresaLabel}</td>
                                        <td>{item.fecha_comprobante ? dayjs.utc(item.fecha_comprobante).format('DD/MM/YYYY') : ''}</td>
                                        <td>{nDoc}</td>
                                        <td>{detalle}</td>
                                        <td>{item.moneda}</td>
                                        <td><NumberFormatMoney amount={item.monto} /></td>
                                        <td>{tc ? tc.toFixed(3) : '-'}</td>
                                        <td><NumberFormatMoney amount={Number(item.monto || 0) * tc} /></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    )
}

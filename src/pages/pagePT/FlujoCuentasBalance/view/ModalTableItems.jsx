import { DateMaskStr } from '@/components/CurrencyMask';
import { DataTableCR } from '@/components/DataView/DataTableCR';
import React from 'react'
import { Modal, Table } from 'react-bootstrap'

export const ModalTableItems = ({show, onHide, id, items={}, onOpenModalCustom}) => {
    console.log({items});
    const columns = [
        {id: 0, header: '', render: (row)=>{
            return (
                <div onClick={() => onOpenModalCustom(row.id)}>
                    <i className='pi pi-pencil fw-bold text-primary cursor-pointer p-2 rounded hover-bg-light' title="Editar" />
                </div>
            )
        }},
        {id: 1, header: (<>Instituto /<br/> Colaborador</>), render:(row)=>{
            return (
                <>
                {row.descripcion.split(':')[0]}
                </>
            )
        }},
        {id: 2, header: (<>Descripción /<br/> Eventos</>), render:(row)=>{
            return (
                <>
                {row.descripcion.split(':')[1]}
                </>
            )
        }},
        {id: 3, header: (<>FECHA <br/> COMPROBANTE</>), render:(row)=>{
            return (
                <>
                {DateMaskStr(row.fecha_comprobante, 'dddd DD [DE] MMMM [DEL] YYYY')}
                </>
            )
        }},
        {id: 3, header: (<>FECHA <br/> PAGO</>), render:(row)=>{
            return (
                <>
                {DateMaskStr(row.fecha_pago, 'dddd DD [DE] MMMM [DEL] YYYY')}
                </>
            )
        }},
        {id: 4, header: (<>MONTO</>), render:(row)=>{
            return (
                <>
                {row.monto}
                </>
            )
        }},
        {id: 5, header: (<>DOCUMENTO</>), render:(row)=>{
            return (
                <>
                {row.parametro_comprobante?.label_param}
                </>
            )
        }},
        {id: 6, header: (<>FORMA <br/> PAGO</>), render:(row)=>{
            return (
                <>
                {row.parametro_forma_pago?.label_param}
                </>
            )
        }},
        {id: 7, header: (<>N° <br/> COMPROBANTE</>), render:(row)=>{
            return (
                <>
                {row.n_comprabante}
                </>
            )
        }},
        {id: 8, header: (<>N° <br/> OPERACION</>), render:(row)=>{
            return (
                <>
                {row.n_operacion}
                </>
            )
        }},
    ]
  return (
    <Modal show={show} onHide={onHide} fullscreen>
        <Modal.Header closeButton >
            <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body >
            <DataTableCR
                columns={columns}
                data={items}
            />
        </Modal.Body>
    </Modal>
  )
}

import { DateMaskStr, NumberFormatMoney } from '@/components/CurrencyMask';
import { DataTableCR } from '@/components/DataView/DataTableCR';
import React from 'react'
import { Modal, Table } from 'react-bootstrap'

export const ModalTableItems = ({show, onHide, id, items={}, onOpenModalCustom, bgTotal}) => {
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
        {id: 4, header: (<>MONTO <br/> S/.</>), render:(row)=>{
            return (
                <>
                <NumberFormatMoney amount={row.monto}/>
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
                bgHeader={bgTotal}
                data={items}
                responsive
                stickyHeight={'80vh'}
                stickyHeader
            />
        </Modal.Body>
    </Modal>
  )
}

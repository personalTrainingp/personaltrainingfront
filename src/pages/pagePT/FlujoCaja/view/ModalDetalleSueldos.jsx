import React from 'react'
import { Modal, Table } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { arrayCargoEmpl } from '@/types/type'

// RR.HH. (ADMINISTRATIVO / COLABORADOR): contratos cuyo sueldo forma el proyectado
export const ModalDetalleSueldos = ({show, onHide, concepto = '', items = []}) => {
  const filas = [...items].sort((a, b)=>`${a.nombre_empl} ${a.apPaterno_empl}`.localeCompare(`${b.nombre_empl} ${b.apPaterno_empl}`))
  const total = filas.reduce((suma, f)=>suma + Number(f.sueldo || 0), 0)
  return (
    <Modal show={show} onHide={onHide} size='lg' centered>
        <Modal.Header closeButton>
            <Modal.Title>SUELDOS PROYECTADOS - {concepto}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Table striped bordered hover responsive className='mb-0'>
                <thead className='bg-change text-white'>
                    <tr>
                        <th className='text-white'>#</th>
                        <th className='text-white'>NOMBRES Y APELLIDOS</th>
                        <th className='text-white'>CARGO</th>
                        <th className='text-white text-end'>SUELDO</th>
                    </tr>
                </thead>
                <tbody>
                    {filas.length === 0 && (
                        <tr><td colSpan={4} className='text-center'>No hay contratos con este concepto</td></tr>
                    )}
                    {filas.map((f, i)=>(
                        <tr key={f.id}>
                            <td>{i+1}</td>
                            <td>{[f.nombre_empl, f.apPaterno_empl, f.apMaterno_empl].filter(Boolean).join(' ')}</td>
                            <td>{arrayCargoEmpl.find(c=>c.value===Number(f.cargo_empl))?.label ?? '-'}</td>
                            <td className='text-end'><NumberFormatMoney amount={Number(f.sueldo || 0)}/></td>
                        </tr>
                    ))}
                </tbody>
                {filas.length > 0 && (
                    <tfoot>
                        <tr className='fw-bold'>
                            <td colSpan={3} className='text-end'>TOTAL</td>
                            <td className='text-end'><NumberFormatMoney amount={total}/></td>
                        </tr>
                    </tfoot>
                )}
            </Table>
        </Modal.Body>
    </Modal>
  )
}

import React from 'react'
import { Table } from 'react-bootstrap'

export const TablePagos = ({dataPagos, classNameTablePrincipal, fmt, totalPagado}) => {
  return (
    <Table size="sm" bordered responsive>
      <thead>
        <tr>
          <th>ID Pago</th>
          <th>Fecha Pago</th>
          <th>Descripción</th>
          <th>Moneda</th>
          <th className="text-end">Monto</th>
        </tr>
      </thead>
      <tbody>
        {dataPagos.map((pago) => (
          <tr key={pago.id}>
            <td>{pago.id}</td>
            <td>{pago?.fec_pago ?? '-'}</td>
            <td>{pago?.descripcion ?? '-'}</td>
            <td>{pago?.moneda ?? '-'}</td>
            <td className="text-end">{fmt(pago?.monto)}</td>
          </tr>
        ))}
      </tbody>
      {/* FOOTER TABLA DE PAGOS (contrato) */}
      <tfoot>
        <tr className={`${classNameTablePrincipal} text-white fw-semibold`}>
          <td colSpan={4} className="text-end">TOTAL PAGOS:</td>
          <td className="text-end">{fmt(totalPagado)}</td>
        </tr>
      </tfoot>
    </Table>
  )
}

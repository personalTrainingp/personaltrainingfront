import dayjs from 'dayjs'
import React from 'react'
import { Table } from 'react-bootstrap'

export const DataTablePenalidad = ({dataView, totalPenalidades, classNameTablePrincipal, fmt}) => {
  return (
    <Table size="sm" bordered responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Fecha</th>
          <th>observacion</th>
          <th>monto</th>
        </tr>
      </thead>
      <tbody>
        {dataView.map((pago) => (
          <tr key={pago.id}>
            <td>{pago.id}</td>
            <td>{dayjs.utc(pago?.fecha).format('dddd DD [de] MMMM [del] YYYY')}</td>
            <td>{pago?.observacion ?? '-'}</td>
            <td className="text-end">{fmt(pago?.monto)}</td>
          </tr>
        ))}
      </tbody>
      {/* FOOTER TABLA DE PAGOS (contrato) */}
      <tfoot>
        <tr className={`${classNameTablePrincipal} text-white fw-semibold`}>
          <td colSpan={4} className="text-end">TOTAL PENALIDADES:</td>
          <td className="text-end">{fmt(totalPenalidades)}</td>
        </tr>
      </tfoot>
    </Table>
  )
}

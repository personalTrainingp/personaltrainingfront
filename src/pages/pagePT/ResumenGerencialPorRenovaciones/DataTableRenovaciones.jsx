import { DataTableCR } from '@/components/DataView/DataTableCR'
import React from 'react'
import { Table } from 'react-bootstrap'

export const DataTableOrigen = ({dataSeguimiento}) => {
  return (
    <>
    <Table>
      <tbody>
        <tr className='bg-change'>
          <th className='text-white fs-3'>METRICAS</th>
          <th className='text-white fs-3'>ENERO</th>
        </tr>
        <tr>
          <th className='fs-4'>RENOVACIONES DEL MES</th>
          <td className='fs-4'>asdf</td>
        </tr>
        <tr>
          <th className='fs-4'>VENCIMIENTOS</th>
          <td className='fs-4'>asdf</td>
        </tr>
      </tbody>
    </Table>
    </>
  )
}

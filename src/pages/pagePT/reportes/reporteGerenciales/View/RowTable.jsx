import React from 'react'
import { Table } from 'react-bootstrap'

export const RowTable = ({bgTotal, nombreHeader, montoHeader}) => {
  return (
    <Table style={{width: '90%'}}>
            <thead className={`${bgTotal}`}>
                <tr>
                    <th className='text-white'>{nombreHeader}</th>
                    <th className='text-white'>{montoHeader}</th>
                </tr>
          </thead>
    </Table>
  )
}

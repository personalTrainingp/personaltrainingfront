import React from 'react'
import { Table } from 'react-bootstrap'

export const TableResumen = () => {
  return (
    <div className="table-responsive">
        <Table className="tabla-egresos" style={{ width: '100%' }} bordered>
            <thead>
                <tr>
                    <th className={`fw-bold fs-2 bg-white-1 border-top-10 border-bottom-10 border-left-10 border-right-10`}>
                        <div className='text-black'>
                            RESULTADO ANUAL
                        </div>
                    </th>
                </tr>
            </thead>
        </Table>
    </div>
  )
}

import React from 'react'
import { Table } from 'react-bootstrap'

export const DataTable = () => {
  return (
    <div>
        <Table>
            <thead>
                <tr>
                    <th>PARIENTE</th>
                    <th>NOMBRE DEL PARIENTE</th>
                    <th>telefono</th>
                    <th>email</th>
                    <th>obsevacion</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>PARIENTE</th>
                    <th>NOMBRE DEL PARIENTE</th>
                    <th>telefono</th>
                    <th>email</th>
                    <th>obsevacion</th>
                </tr>
            </tbody>
        </Table>
    </div>
  )
}

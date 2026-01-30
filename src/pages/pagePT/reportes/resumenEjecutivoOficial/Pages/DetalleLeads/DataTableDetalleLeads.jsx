import React from 'react'
import { Table } from 'react-bootstrap'

export const DataTableDetalleLeads = ({dataMesesYanio}) => {
    const dataConMesesYanio = dataMesesYanio.map(d=>{
        return {
            ...d
        }
    })
  return (
    <Table  style={{width: '100%'}}  bordered>
        <thead>
            <tr>
                <th></th>
                {
                    dataConMesesYanio.map(d=>{
                        return (
                            <th>{d.fecha}</th>
                        )
                    })
                }
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Inversion Meta</td>
                {
                    dataConMesesYanio.map(d=>{
                        return (
                            <th>{d.fecha}</th>
                        )
                    })
                }
            </tr>
            <tr>
                <td>CANTIDAD LEADS META</td>
                {
                    dataConMesesYanio.map(d=>{
                        return (
                            <th>{d.fecha}</th>
                        )
                    })
                }
            </tr>
            <tr>
                <td>COSTO POR LEAD META</td>
                {
                    dataConMesesYanio.map(d=>{
                        return (
                            <th>{d.fecha}</th>
                        )
                    })
                }
            </tr>
            <tr>
                <td>COSTO ADQUISICION DE CLIENTES META</td>
                {
                    dataConMesesYanio.map(d=>{
                        return (
                            <th>{d.fecha}</th>
                        )
                    })
                }
            </tr>
        </tbody>
    </Table>
  )
}

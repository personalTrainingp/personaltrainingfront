import React, { useEffect } from 'react'
import { useDeudasProveedoresStore } from './useDeudasProveedoresStore'
import { Table } from 'react-bootstrap'

export const TableDeudasProveedores = ({id_empresa}) => {
    const { dataContratosProv, obtenerContratosProveedores } = useDeudasProveedoresStore()
    useEffect(() => {
        obtenerContratosProveedores(id_empresa)
    }, [id_empresa])
    
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>PROVEEDOR</th>
            <th>MONTO TOTAL</th>
            {/* <th>MANO DE OBRA DOLARES</th> */}
          </tr>
        </thead>
        <tbody>
          {
            dataContratosProv.map(e=>{
              return (
                <tr>
                  <td>{e.items[0]?.prov?.razon_social_prov}</td>
                  <td>{e.monto_contratos_total-e.gastos_monto_soles}</td>
                  {/* <td>{e.mano_obra_dolares_total}</td> */}
                </tr>
              )
            })
          }
        </tbody>
      </Table>
    </div>
  )
}

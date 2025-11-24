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
      {/* <pre>
        {JSON.stringify(dataContratosProv, null, 2)}
      </pre> */}
      <Table>
        <thead>
          <tr>
            <th>PROVEEDOR</th>
            <th>MANO DE OBRA SOLES</th>
            {/* <th>MANO DE OBRA DOLARES</th> */}
          </tr>
        </thead>
        <tbody>
          {
            dataContratosProv.map(e=>{
              return (
                <tr>
                  <td>{e.ruc}</td>
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

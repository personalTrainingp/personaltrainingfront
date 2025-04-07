import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useKardexStore } from './hook/useKardexStore'

export const KardexxArticulo = ({id_articulo, movimiento}) => {
    const { obtenerKardexXArticuloXMovimiento, postKardexxMovimientoxArticulo } = useKardexStore()
    useEffect(() => {
        obtenerKardexXArticuloXMovimiento({id_articulo, movimiento})
    }, [])
    
  return (
        <Table className="table-centered mb-0" striped responsive>
          <thead className='bg-primary fs-4'>
            <tr>
                  <th className={`text-white`} >
                    CANTIDAD
                  </th>
                  <th className={`text-white`} >
                    FECHA DE MOV.
                  </th>
                  <th className={`text-white`} >
                    EMPRESA
                  </th>
                  <th className={`text-white`} >
                    LUGAR
                  </th>
                  <th className={`text-white`} >
                    MOTIVO
                  </th>
                  <th className={`text-white`} >
                    OBSERVACION
                  </th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td>
                  <li className={`d-flex flex-row justify-content-between p-1 text-primary`}>
                    TRANSFERENCIAS
                  </li>
                </td>
                <td>
                  <li className={`d-flex flex-row justify-content-between p-1 float-end`}>

                  </li>
                </td>
              </tr>
          </tbody>
        </Table>
  )
}

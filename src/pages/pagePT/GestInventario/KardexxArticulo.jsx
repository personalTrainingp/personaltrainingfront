import React from 'react'
import { Table } from 'react-bootstrap'

export const KardexxArticulo = ({id_articulo, movimiento}) => {
  return (
        <Table className="table-centered mb-0" striped responsive>
          <thead className='bg-primary fs-2'>
            <tr>
                  <th className={`text-white`} >
                    
                  </th>
                  <th className={`text-white`} >
                    CANTIDAD
                  </th>
                  <th className={`text-white`} >
                    FECHA DE MOVIMIENTO
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
                    <span style={{fontSize: '35px'}} className={`fw-bold ml-3`}>{'INVERSION'}</span>
                  </li>
                </td>
                <td>
                  <li className={`d-flex flex-row justify-content-between p-1 float-end`}>
                    <span style={{fontSize: '45px'}} className={`fw-bold ml-3`}></span>
                  </li>
                </td>
              </tr>
          </tbody>
        </Table>
  )
}

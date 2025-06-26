import React, { useEffect, useState } from 'react'
import { useKardexStore } from './hook/useKardexStore';
import { Table } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { ModalCustomMovimientoKardex } from './ModalCustomMovimientoKardex';
import { Dialog } from 'primereact/dialog';

export const MovimientoItems = ({onShowInventario, idArticulo, movimiento, id_enterprice}) => {
  const { obtenerKardexXArticuloXMovimiento, dataMovimientos } = useKardexStore()
  useEffect(() => {
    obtenerKardexXArticuloXMovimiento(idArticulo, movimiento)
  }, [])
  
  const [isOpenModalCustomMovKardex, setIsOpenModalCustomMovKardex] = useState(false)
  const onOpenModalCustomMovKardex= ()=>{
    setIsOpenModalCustomMovKardex(true)
  }
  const onCloseModalCustomMovKardex= ()=>{
    setIsOpenModalCustomMovKardex(false)
  }
  return (
    <div>
      <Button label='AGREGAR' onClick={onOpenModalCustomMovKardex}/>

              <Table className="table-centered mb-0 mt-2" striped responsive>
                <thead className='bg-primary fs-4'>
                  <tr>
                        <th className={`text-white`} >
                          CANTIDAD
                        </th>
                        <th className={`text-white`} >
                          FECHA DE MOV.
                        </th>
                        <th className={`text-white`} >
                          ZONA
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
            {
              dataMovimientos.map(d=>{
                return (
                  <tr>
                    <td>
                      <li className={`d-flex flex-row justify-content-between p-1`}>
                        {d.cantidad}
                      </li>
                    </td>
                    <td>{d.fecha_cambio}</td>
                    <td>
                      <li className={`d-flex flex-row justify-content-between p-1 float-end`}>
                        {d.parametro_lugar_destino.nombre_zona}
                      </li>
                    </td>
                    <td>
                      <li className={`d-flex flex-row justify-content-between p-1 float-end`}>
                        {d.parametro_motivo.label_param}
                      </li>
                    </td>
                    <td>
                      {d.observacion}
                    </td>
                  </tr>
                )
              })
            }
                </tbody>
              </Table>
      <ModalCustomMovimientoKardex id_enterprice={id_enterprice} idArticulo={idArticulo} show={isOpenModalCustomMovKardex} movimiento={movimiento} onHide={onCloseModalCustomMovKardex}/>
    </div>
  )
}

import React, { useState } from 'react'
import { ItemContrato } from './ItemContrato'
import { Table } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { ModalAgregarJornada } from './Jornada/ModalAgregarJornada'

export const DataTableContratos = () => {
  const [isOpenModalVerAsistencia, setisOpenModalVerAsistencia] = useState({isOpenModal: false, fecha_inicio: '', fecha_fin: ''})
  return (
    <div>
      <Table>
                  <thead className='bg-primary'>
                      <tr>
                          <th>CARGO</th>
                          <th>MONTO A GANAR</th>
                          <th>FECHA DE INICIO</th>
                          <th>FECHA DE FIN</th>
                          <th>MIS ASISTENCIAS</th>
                          <th></th>
                          <th></th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <th>SISTEMAS</th>
                          <th>
                            <div className=''>
                              <NumberFormatMoney amount={1300}/>
                            </div>
                          </th>
                          <th>21/09/2024</th>
                          <th>21/10/2025</th>
                          <th>
                            <div className='' onClick={()=>setisOpenModalVerAsistencia({isOpenModal:true, fecha_fin:'21/09/2025', fecha_inicio: '21/10/2024'})}>
                              VER
                            </div>
                          </th>
                          <th>
                            <i className='text-primary cursor-pointer'>EDITAR</i>
                          </th>
                          <th>
                            <i className='text-primary cursor-pointer'>DELETE</i>
                          </th>
                      </tr>
                  </tbody>
              </Table>
              <ModalAgregarJornada 
                    onHide={()=>setisOpenModalVerAsistencia({isOpenModal: false, fecha_fin: '', fecha_inicio: ''})}
                    show={isOpenModalVerAsistencia.isOpenModal}
                    arrayFecha={[new Date(isOpenModalVerAsistencia.fecha_inicio), new Date(isOpenModalVerAsistencia.fecha_fin)]}
                    horarios={
                      [
                        {horario:'09:00'}, 
                        {horario:'11:00'}, 
                        {horario:'10:00'}, 
                        {horario:'07:00'}, {horario:'14:00'}, {horario:'06:00'}, {horario:'06:30'} , {horario:'08:00'}
                      ]
                    }
              />
    </div>
  )
}

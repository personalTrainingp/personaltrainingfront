import React, { useEffect, useState } from 'react'
import { ItemContrato } from './ItemContrato'
import { Table } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { ModalCustomJornada } from './Jornada/ModalCustomJornada'
import { Button } from 'primereact/button'
import { ModalCustomContrato } from './ModalCustomContrato'
import { useContratoColaboradorStore } from './useContratoColaboradorStore'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'

export const DataTableContratos = ({id_empleado}) => {
  const [isOpenModalVerAsistencia, setisOpenModalVerAsistencia] = useState({isOpenModal: false, fecha_inicio: '', fecha_fin: '', id: 0})
  const [isOpenModalCustomContrato, setisOpenModalCustomContrato] = useState({isOpen: false})
  const { obtenerContratosxColaborador } = useContratoColaboradorStore()
  const { dataView } = useSelector(e=>e.DATA)
  const onClickVerAsistencia=(asistencia, id)=>{
    setisOpenModalVerAsistencia({fecha_fin: asistencia.fecha_fin, fecha_inicio: asistencia.fecha_inicio, isOpenModal: true, id: id})
  }
  const onClickCustomContrato = ()=>{
    setisOpenModalCustomContrato({isOpen: true})
  }

  useEffect(() => {
    obtenerContratosxColaborador(id_empleado)
  }, [id_empleado])
  return (
    <div>
      <div className='mb-2'>
        <Button label='AGREGAR CONTRATO' onClick={onClickCustomContrato}/>
      </div>
      <Table>
                  <thead className='bg-primary'>
                      <tr>
                          <th className='text-white'>SUELDO</th>
                          <th className='text-white'>FECHA DE INICIO</th>
                          <th className='text-white'>FECHA DE FIN</th>
                          <th className='text-white'>DIAS LABORABLES</th>
                          <th className='text-white'>OBSERVACIONES</th>
                          <th className='text-white'></th>
                      </tr>
                  </thead>
                  <tbody>
                        {
                          dataView.map(d=>{
                            return (
                        <tr>
                          <th>
                            <div className=''>
                              {/* {JSON.stringify(d, null, 2)} */}
                              <NumberFormatMoney amount={d.sueldo}/>
                            </div>
                          </th>
                          <th>{dayjs.utc(d.fecha_inicio).format('dddd DD [DE] MMMM [DEL] YYYY')} {dayjs.utc(d.fecha_inicio).format('YYYY-MM-DD')}</th>
                          <th>{dayjs.utc(d.fecha_fin).format('dddd DD [DE] MMMM [DEL] YYYY')}</th>
                          <th>
                            <div className='' onClick={()=>onClickVerAsistencia({isOpenModal:true, fecha_fin:dayjs.utc(d.fecha_fin).format('YYYY-MM-DD'), fecha_inicio: dayjs.utc(d.fecha_inicio).format('YYYY-MM-DD')}, d?.id)}>
                              VER
                            </div>
                          </th>
                          <th>
                            {d.observacion}
                          </th>
                          <th>
                            <div className='d-flex gap-2'>
                              <div>
                                <i className='text-primary cursor-pointer'>DELETE</i>
                              </div>
                            </div>
                          </th>
                      </tr>
                            )
                          })
                        }
                  </tbody>
              </Table>
              <ModalCustomContrato id_empleado={id_empleado} show={isOpenModalCustomContrato.isOpen} onHide={()=>setisOpenModalCustomContrato({isOpen: false})}/>
              <ModalCustomJornada 
                    onHide={()=>setisOpenModalVerAsistencia({isOpenModal: false, fecha_fin: '', fecha_inicio: ''})}
                    show={isOpenModalVerAsistencia.isOpenModal}
                    id_contrato={isOpenModalVerAsistencia.id}
                    arrayFecha={[new Date(isOpenModalVerAsistencia.fecha_inicio), new Date(isOpenModalVerAsistencia.fecha_fin)]}
                    data={[
    { id_tipo_horario: 0, fecha: '2025-10-30', hora_inicio: '12:00', minutos: 60, observacion: '' },
    { id_tipo_horario: 1500, fecha: '2025-10-30', hora_inicio: '12:00', minutos: 30, observacion: 'refrigerio' },
    { id_tipo_horario: 0, fecha: '2025-10-31', hora_inicio: '15:00', minutos: 45, observacion: '' },
  ]}
              />
    </div>
  )
}

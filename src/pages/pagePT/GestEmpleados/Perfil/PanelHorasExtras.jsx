import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { ModalReportAsistencia } from './ModalReportAsistencia'
import {  ModalHorasEspeciales } from './ModalHorasEspeciales'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { Table } from 'react-bootstrap'
import { ModalPermisos } from './ModalPermisos'
import { ModalHorasExtras } from './ModalHorasExtras'

export const PanelHorasExtras = () => {

  const [isOpenModalReportAsistencia, setisOpenModalReportAsistencia] = useState(false)
  const [dataPeriodoParamSelect, setdataPeriodoParamSelect] = useState({id_param: '', fecha_hasta: '', fecha_desde:''})
  const { DataPeriodoParam, obtenerParametroPorEntidadyGrupo_PERIODO } = useTerminoStore()
  const onOpenModalReportAsistencia = (id_param, fecha_hasta, fecha_desde)=>{
      setisOpenModalReportAsistencia(true)
      setdataPeriodoParamSelect({id_param, fecha_desde, fecha_hasta})
  }
  const onCloseModalReportAsistencia = ()=>{
      setisOpenModalReportAsistencia(false)
  }
  useEffect(() => {
    obtenerParametroPorEntidadyGrupo_PERIODO('EMPLEADO', 'PERIODO_ASISTENCIA')
  }, [])
return (
  <>
                      <Button onClick={onOpenModalReportAsistencia} className='m-2'>AGREGAR HORAS EXTRAS</Button>
                      
                  <Table
                      // style={{tableLayout: 'fixed'}}
                      className="table-centered mb-0"
                      hover
                      responsive
                  >
                      <thead className="bg-primary">
                          <tr>
                              <th className='text-white p-1'>TIPO</th>
                              <th className='text-white p-1'>FECHA</th>
                              <th className='text-white p-1'>TIEMPO</th>
                              <th className='text-white p-1'>SUELDO</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>HORAS EXTRAS POR DIAS FERIADOS</td>
                              <td>MARTES 21 DE MAYO DEL 2024</td>
                              <td>3 HORAS CON 20 MINUTOS</td>
                              <td>200 SOLES</td>
                          </tr>
                          <tr>
                              <td>MANDADO DEL GERENTE</td>
                              <td>SABADO 21 DE JUNIO DEL 2024</td>
                              <td>2 HORAS CON 20 MINUTOS</td>
                              <td>200 SOLES</td>
                          </tr>
                      </tbody>
                  </Table>
                      <ModalHorasExtras show={isOpenModalReportAsistencia} onHide={onCloseModalReportAsistencia}/>
  </>
)
}

import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { ModalReportAsistencia } from './ModalReportAsistencia'
import {  ModalHorasEspeciales } from './ModalHorasEspeciales'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { Table } from 'react-bootstrap'
import { ModalPermisos } from './ModalPermisos'
import { ModalTardanzasJustificadas } from './ModalTardanzasJustificadas'

export const PanelTardanzasJustificadas = () => {

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
                      <Button onClick={onOpenModalReportAsistencia} className='m-2'>AGREGAR TARDANZAS JUSTIFICADAS</Button>
                      
                  <Table
                      // style={{tableLayout: 'fixed'}}
                      className="table-centered mb-0"
                      hover
                      responsive
                  >
                      <thead className="bg-primary">
                          <tr>
                              <th className='text-white p-1'>FECHA</th>
                              <th className='text-white p-1'>MINUTOS</th>
                              <th className='text-white p-1'>OBSERVACION</th>
                              <th className='text-white p-1'>¿ES CON GOCE DE SUELDO?</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>21 DE MAYO DEL 2024</td>
                              <td>40 MINUTOS</td>
                              <td>POR ORDENES DEL SR. LUIS ALBERTO, SE DIRIGIO AL DIRECTORIO Y NO PUDO IR A SU PUESTO DE TRABAJO</td>
                              <td>SI</td>
                          </tr>
                          <tr>
                              <td>21 DE JUNIO DEL 2024</td>
                              <td>50 MINUTOS</td>
                              <td>SE LEVANTO CON FIEBRE, PERO VINO</td>
                              <td>SI</td>
                          </tr>
                      </tbody>
                  </Table>
                      <ModalTardanzasJustificadas show={isOpenModalReportAsistencia} onHide={onCloseModalReportAsistencia}/>
  </>
)
}

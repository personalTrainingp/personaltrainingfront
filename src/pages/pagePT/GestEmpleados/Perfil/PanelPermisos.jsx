import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { ModalReportAsistencia } from './ModalReportAsistencia'
import {  ModalHorasEspeciales } from './ModalHorasEspeciales'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { Table } from 'react-bootstrap'
import { ModalPermisos } from './ModalPermisos'

export const PanelPermisos = () => {

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
                      <Button onClick={onOpenModalReportAsistencia} className='m-2'>AGREGAR PERMISOS</Button>
                      
                  <Table
                      // style={{tableLayout: 'fixed'}}
                      className="table-centered mb-0"
                      hover
                      responsive
                  >
                      <thead className="bg-primary">
                          <tr>
                              <th className='text-white p-1'>PERMISO</th>
                              <th className='text-white p-1'>FECHA INICIO</th>
                              <th className='text-white p-1'>FECHA FINAL</th>
                              <th className='text-white p-1'>¿ES CON GOCE DE SUELDO?</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>PERMISO CON CERTIFICADO MEDICO</td>
                              <td>MARTES 21 DE MAYO DEL 2024</td>
                              <td>VIERNES 21 DE JUNIO DEL 2024</td>
                              <td>SI</td>
                          </tr>
                          <tr>
                              <td>PERMISO SIN CERTIFICADO MEDICO</td>
                              <td>MIERCOLES 22 DE MAYO DEL 2024</td>
                              <td>JUEVES 23 DE MAYO DEL 2024</td>
                              <td>NO</td>
                          </tr>
                      </tbody>
                  </Table>
                      <ModalPermisos show={isOpenModalReportAsistencia} onHide={onCloseModalReportAsistencia}/>
  </>
)
}

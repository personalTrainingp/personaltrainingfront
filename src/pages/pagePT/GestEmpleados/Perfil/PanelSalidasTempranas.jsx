import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { ModalReportAsistencia } from './ModalReportAsistencia'
import {  ModalHorasEspeciales } from './ModalHorasEspeciales'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { Table } from 'react-bootstrap'
import { ModalPermisos } from './ModalPermisos'
import { ModalTardanzasJustificadas } from './ModalTardanzasJustificadas'
import { ModalSalidasTempranas } from './ModalSalidasTempranas'

export const PanelSalidasTempranas = () => {

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
                        <Button onClick={onOpenModalReportAsistencia} className='m-2'>AGREGAR SALIDA TEMPRANA JUSTIFICADA</Button>
                        
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
                                <th className='text-white p-1'>¿CON GOCE DE SUELDO?</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>MARTES 21 DE MAYO DEL 2024</td>
                                <td>40 MINUTOS</td>
                                <td>recibe una llamada urgente sobre un problema familiar</td>
                                <td>SI</td>
                            </tr>
                            <tr>
                                <td>VIERNES 21 DE JUNIO DEL 2024</td>
                                <td>2 HORAS CON 10 MINUTOS</td>
                                <td>se siente mal durante la jornada laboral y solicita permiso para retirarse antes de tiempo para ir al médico o descansar</td>
                                <td>SI</td>
                            </tr>
                        </tbody>
                    </Table>
                        <ModalSalidasTempranas show={isOpenModalReportAsistencia} onHide={onCloseModalReportAsistencia}/>
    </>
  )
}

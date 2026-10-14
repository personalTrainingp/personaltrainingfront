import React, { useEffect, useMemo, useState } from 'react'
import { Card, Col, Modal, Row, Spinner, Table } from 'react-bootstrap'
import { TabPanel, TabView } from 'primereact/tabview'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { arrayTareasComercial } from '@/types/type'
import { useGestionComercialStore } from './useGestionComercialStore'

// El numero va debajo del card (fuera), para que todos queden alineados aunque el texto ocupe 2 lineas
const ResumenItem = ({label, valor, icon, activo, exito, onClick})=>(
  <div className='d-flex flex-column h-100 cursor-pointer' onClick={onClick}>
    <Card className={`shadow-sm flex-grow-1 mb-1 ${activo ? 'bg-primary text-white' : ''}`}>
      <Card.Body className='py-2 text-center d-flex flex-column justify-content-center'>
        {icon && <i className={`${icon} fs-4 mb-1`}></i>}
        <div className={`small ${activo ? '' : 'text-muted'}`}>{label}</div>
      </Card.Body>
    </Card>
    <div className={`fw-bold fs-3 text-center ${exito ? 'text-success' : ''}`}>{valor}</div>
  </div>
)

export const ModalReporteTareas = ({show, onHide}) => {
  const { obtenerTareasReporte, dataTareasReporte, isLoadingTareasReporte } = useGestionComercialStore()
  const {dataView} = useSelector(e=>e.COMERCIAL)
  // Click en un card filtra la tabla por ese tipo de tarea; otro click lo quita
  const [filtroTarea, setfiltroTarea] = useState(null)
  const [tabActivo, settabActivo] = useState(0)
  useEffect(() => {
    if (show) {
      obtenerTareasReporte()
      setfiltroTarea(null)
      settabActivo(0)
    }
  }, [show])

  // Un tab por asesor que tiene prospectos; cada tarea se asigna al asesor de su prospecto
  const asesores = useMemo(() => {
    const prospectosxId = new Map((dataView ?? []).map(p=>[p.id, p]))
    const grupos = new Map()
    for (const p of dataView ?? []) {
      if (!p.id_empl) continue
      if (!grupos.has(p.id_empl)) grupos.set(p.id_empl, {id_empl: p.id_empl, nombre: p.empleado?.nombres_apellidos_empl ?? `ASESOR ${p.id_empl}`, prospectos: [], tareas: []})
      grupos.get(p.id_empl).prospectos.push(p)
    }
    for (const t of dataTareasReporte) {
      const prospecto = prospectosxId.get(t.id_prospecto)
      if (!prospecto || !grupos.has(prospecto.id_empl)) continue
      grupos.get(prospecto.id_empl).tareas.push({...t, prospecto})
    }
    return [...grupos.values()].sort((a, b)=>b.prospectos.length - a.prospectos.length)
  }, [dataView, dataTareasReporte])

  return (
    <Modal show={show} onHide={onHide} fullscreen>
        <Modal.Header closeButton>
            <Modal.Title>REPORTE DE TAREAS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {
                isLoadingTareasReporte ? (
                    <div className='text-center py-4'><Spinner animation='border'/></div>
                ) : asesores.length === 0 ? (
                    <div className='text-center text-muted py-4'>NO HAY ASESORES CON PROSPECTOS</div>
                ) : (
                    <TabView scrollable activeIndex={tabActivo} onTabChange={(e)=>{settabActivo(e.index); setfiltroTarea(null)}}>
                        {
                            asesores.map((a)=>{
                                const tareasFiltradas = filtroTarea ? a.tareas.filter(t=>t.id_tarea===filtroTarea) : a.tareas
                                const tipoFiltro = arrayTareasComercial.find(e=>e.value===filtroTarea)
                                return (
                                    <TabPanel key={a.id_empl} header={`${a.nombre} (${a.prospectos.length})`}>
                                        <Row className='g-2 mb-3'>
                                            {
                                                arrayTareasComercial.map(tipo=>(
                                                    <Col xs={6} md={3} lg key={tipo.value}>
                                                        <ResumenItem label={tipo.label.toUpperCase()} valor={a.tareas.filter(t=>t.id_tarea===tipo.value).length} icon={tipo.icon} exito={tipo.exito} activo={filtroTarea===tipo.value} onClick={()=>setfiltroTarea(filtroTarea===tipo.value ? null : tipo.value)}/>
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                        {
                                            tipoFiltro && (
                                                <div className='mb-2'>
                                                    FILTRANDO POR: <strong>{tipoFiltro.label.toUpperCase()}</strong>
                                                    <span className='ms-2 text-primary text-decoration-underline cursor-pointer' onClick={()=>setfiltroTarea(null)}>VER TODAS</span>
                                                </div>
                                            )
                                        }
                                        {
                                            tareasFiltradas.length === 0 ? (
                                                <div className='text-center text-muted py-4'>{tipoFiltro ? 'NO HAY TAREAS DE ESTE TIPO' : 'ESTE ASESOR NO TIENE TAREAS REGISTRADAS'}</div>
                                            ) : (
                                                <Table responsive striped hover size='sm' className='mb-0'>
                                                    <thead>
                                                        <tr>
                                                            <th>FECHA</th>
                                                            <th>PROSPECTO</th>
                                                            <th>CELULAR</th>
                                                            <th>ESTATUS</th>
                                                            <th>TAREA</th>
                                                            <th>OBSERVACION</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            tareasFiltradas.map(t=>{
                                                                const tipo = arrayTareasComercial.find(e=>e.value===t.id_tarea)
                                                                return (
                                                                    <tr key={t.id}>
                                                                        <td className='text-nowrap'>{dayjs(t.fecha).format('DD/MM/YYYY hh:mm A')}</td>
                                                                        <td>{`${t.prospecto.nombres ?? ''} ${t.prospecto.apellidos ?? ''}`}</td>
                                                                        <td>{t.prospecto.celular}</td>
                                                                        <td>{t.prospecto.parametro_estado?.label_param}</td>
                                                                        <td className='text-nowrap'>{tipo && <i className={`${tipo.icon} me-1`}></i>}{tipo?.label ?? `Tarea ${t.id_tarea}`}</td>
                                                                        <td>{t.observacion}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </Table>
                                            )
                                        }
                                    </TabPanel>
                                )
                            })
                        }
                    </TabView>
                )
            }
        </Modal.Body>
    </Modal>
  )
}

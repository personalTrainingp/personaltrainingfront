import React, { useEffect, useState } from 'react'
import { Card, Modal } from 'react-bootstrap'
import { Button } from 'primereact/button'
import { Timeline } from 'primereact/timeline'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { arrayTareasComercial } from '@/types/type'
import { useGestionComercialStore } from './useGestionComercialStore'
import { ModalAgregarTarea } from './ModalAgregarTarea'

export const ModalTareas = ({show, onHide, lead=null}) => {
  const { obtenerTareasxProspecto, postTareaProspecto, dataTareas } = useGestionComercialStore()
  const [isOpenModalAgregarTarea, setisOpenModalAgregarTarea] = useState(false)
  useEffect(() => {
    if (show && lead?.id) obtenerTareasxProspecto(lead.id)
  }, [show, lead?.id])
  const onRegistrarTarea = ({ id_tarea, observacion, fecha })=>{
    return postTareaProspecto({ id_prospecto: lead.id, id_tarea, observacion, fecha })
  }
  return (
    <>
    <Modal show={show && !isOpenModalAgregarTarea} onHide={onHide} size='lg'>
        <Modal.Header closeButton>
            <Modal.Title>
                TAREAS {lead ? `- ${lead.nombres ?? ''} ${lead.apellidos ?? ''}` : ''}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Button icon='pi pi-plus' label='Agregar tarea' className='mb-3' onClick={()=>setisOpenModalAgregarTarea(true)}/>
            {
                dataTareas.length === 0 ? (
                    <div className='text-center text-muted py-4'>NO HAY TAREAS REGISTRADAS</div>
                ) : (
                    // cronograma de actividades: del ultimo al primero
                    <Timeline
                        value={[...dataTareas].sort((a, b)=>new Date(b.fecha) - new Date(a.fecha))}
                        align='left'
                        className='timeline-tareas'
                        marker={(t)=>{
                            const tarea = arrayTareasComercial.find(a=>a.value===t.id_tarea)
                            return (
                                <span
                                    className='d-flex align-items-center justify-content-center rounded-circle text-white bg-primary shadow-sm'
                                    style={{ width: '36px', height: '36px' }}
                                >
                                    <i className={tarea?.icon ?? 'pi pi-list-check'}></i>
                                </span>
                            )
                        }}
                        content={(t)=>{
                            const tarea = arrayTareasComercial.find(a=>a.value===t.id_tarea)
                            return (
                                <Card className='mb-3 shadow-sm'>
                                    <Card.Body className='py-2'>
                                        <div className='fw-bold fs-5'>{tarea?.label ?? `Tarea ${t.id_tarea}`}</div>
                                        <small className='text-muted'>
                                            <i className='pi pi-clock me-1'></i>
                                            {dayjs(t.fecha).locale('es').format('dddd D [de] MMMM [de] YYYY, hh:mm A')}
                                        </small>
                                        {
                                            t.observacion && (
                                                <div className='mt-1'>{t.observacion}</div>
                                            )
                                        }
                                    </Card.Body>
                                </Card>
                            )
                        }}
                    />
                )
            }
        </Modal.Body>
    </Modal>
    <ModalAgregarTarea
        show={show && isOpenModalAgregarTarea}
        onHide={()=>setisOpenModalAgregarTarea(false)}
        onRegistrar={onRegistrarTarea}
    />
    </>
  )
}

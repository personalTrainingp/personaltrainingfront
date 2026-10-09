import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Button } from 'primereact/button'
import dayjs from 'dayjs'
import { arrayTareasComercial } from '@/types/type'

const fechaActual = ()=>dayjs().format('YYYY-MM-DDTHH:mm')

// Al elegir una tarea se registra en el lead con la fecha y hora elegida (por defecto, la actual)
export const ModalAgregarTarea = ({show, onHide, onRegistrar}) => {
  const [observacion, setobservacion] = useState('')
  const [fecha, setfecha] = useState(fechaActual)
  const [isSaving, setisSaving] = useState(false)
  useEffect(() => {
    if (show) setfecha(fechaActual())
  }, [show])
  const cerrar = ()=>{
    setobservacion('')
    onHide()
  }
  const onClickTarea = async (id_tarea)=>{
    setisSaving(true)
    const ok = await onRegistrar({ id_tarea, observacion, fecha: dayjs(fecha).toISOString() })
    setisSaving(false)
    if (ok) cerrar()
  }
  return (
    <Modal show={show} onHide={cerrar} size='md' centered>
        <Modal.Header closeButton>
            <Modal.Title>AGREGAR TAREA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <label className='form-label fw-bold'>FECHA DE TAREA</label>
            <input
                type='datetime-local'
                className='form-control mb-3'
                value={fecha}
                onChange={(e)=>setfecha(e.target.value)}
            />
            <label className='form-label fw-bold'>OBSERVACION</label>
            <textarea
                className='form-control mb-3'
                rows={3}
                value={observacion}
                onChange={(e)=>setobservacion(e.target.value)}
                placeholder='(opcional)'
            />
            <div className='d-flex flex-column gap-2'>
                {
                    arrayTareasComercial.map(t=>(
                        <Button
                            key={t.value}
                            icon={t.icon}
                            label={t.label}
                            onClick={()=>onClickTarea(t.value)}
                            disabled={isSaving || !fecha}
                            outlined
                            className='w-100'
                        />
                    ))
                }
            </div>
        </Modal.Body>
    </Modal>
  )
}

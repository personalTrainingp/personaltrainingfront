import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Button } from 'primereact/button'
import { arrayTareasComercial } from '@/types/type'

// Al elegir una tarea se registra en el lead con la fecha y hora actual
export const ModalAgregarTarea = ({show, onHide, onRegistrar}) => {
  const [observacion, setobservacion] = useState('')
  const [isSaving, setisSaving] = useState(false)
  const cerrar = ()=>{
    setobservacion('')
    onHide()
  }
  const onClickTarea = async (id_tarea)=>{
    setisSaving(true)
    const ok = await onRegistrar({ id_tarea, observacion })
    setisSaving(false)
    if (ok) cerrar()
  }
  return (
    <Modal show={show} onHide={cerrar} size='md' centered>
        <Modal.Header closeButton>
            <Modal.Title>AGREGAR TAREA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                            disabled={isSaving}
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

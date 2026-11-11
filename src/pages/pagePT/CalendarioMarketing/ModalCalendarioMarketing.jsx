import React, { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Col, Row } from 'react-bootstrap'
import Select from 'react-select'
import Swal from 'sweetalert2'
import { urlArchivo, archivosDelEvento } from './useCalendarioMarketing'
import { colorTipo } from './CalendarioMesDia'

const formVacio = {
  fecha_inicio: '',
  fecha_fin: '',
  id_tipo: null,
  titulo: '',
  observacion: '',
}

export const ModalCalendarioMarketing = ({ show, onHide, item, dataTipos = [], onGuardar, onDeleteArchivo }) => {
  const [form, setForm] = useState(formVacio)
  const [files, setFiles] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!show) return
    setFiles([])
    setForm(
      item
        ? {
            fecha_inicio: item.fecha_inicio ?? '',
            fecha_fin: item.fecha_fin ?? '',
            id_tipo: item.id_tipo,
            titulo: item.titulo ?? '',
            observacion: item.observacion ?? '',
          }
        : formVacio
    )
  }, [show, item?.id])

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onChangeFiles = (e) => {
    const nuevos = Array.from(e.target.files ?? [])
    setFiles((prev) => [...prev, ...nuevos])
    e.target.value = ''
  }
  const quitarFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.id_tipo) {
      Swal.fire({ icon: 'error', title: 'Seleccione el tipo', timer: 3000, showConfirmButton: false })
      return
    }
    if (form.fecha_fin && form.fecha_fin < form.fecha_inicio) {
      Swal.fire({ icon: 'error', title: 'La fecha fin no puede ser menor a la fecha inicio', timer: 3000, showConfirmButton: false })
      return
    }
    setIsSaving(true)
    await onGuardar(form, files)
    setIsSaving(false)
    onHide()
  }

  const archivosExistentes = archivosDelEvento(item)

  return (
    <Dialog header={item ? 'Editar evento de marketing' : 'Agregar evento de marketing'} style={{ width: '40rem' }} visible={show} onHide={onHide}>
      <form onSubmit={onSubmit}>
        <Row>
          <Col md={6}>
            <div className='mb-2'>
              <label className='form-label'>FECHA INICIO:</label>
              <input type='date' className='form-control' name='fecha_inicio' value={form.fecha_inicio} onChange={onChange} required />
            </div>
          </Col>
          <Col md={6}>
            <div className='mb-2'>
              <label className='form-label'>FECHA FIN:</label>
              <input type='date' className='form-control' name='fecha_fin' value={form.fecha_fin} min={form.fecha_inicio} onChange={onChange} />
            </div>
          </Col>
          <Col md={12}>
            <div className='mb-2'>
              <label className='form-label'>TIPO:</label>
              <Select
                placeholder='Seleccione el tipo'
                className='react-select'
                classNamePrefix='react-select'
                options={dataTipos}
                value={dataTipos.find((o) => o.value === form.id_tipo) ?? null}
                onChange={(o) => setForm((f) => ({ ...f, id_tipo: o?.value ?? null }))}
                formatOptionLabel={(o) => (
                  <span className='d-inline-flex align-items-center gap-2'>
                    <span className='rounded-circle' style={{ width: 12, height: 12, background: colorTipo(o.label).bg, display: 'inline-block' }} />
                    {o.label}
                  </span>
                )}
              />
            </div>
          </Col>
          <Col md={12}>
            <div className='mb-2'>
              <label className='form-label'>TITULO:</label>
              <input className='form-control' name='titulo' value={form.titulo} onChange={onChange} maxLength={150} required />
            </div>
          </Col>
          <Col md={12}>
            <div className='mb-2'>
              <label className='form-label'>OBSERVACION:</label>
              <textarea className='form-control' name='observacion' rows={3} value={form.observacion} onChange={onChange} maxLength={1000} />
            </div>
          </Col>
          <Col md={12}>
            <div className='mb-2'>
              <label className='form-label'>FOTOS / DOCUMENTOS:</label>
              <input
                type='file'
                className='form-control'
                multiple
                accept='image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'
                onChange={onChangeFiles}
              />
              {files.length > 0 && (
                <ul className='list-unstyled mt-2 mb-0'>
                  {files.map((f, i) => (
                    <li key={`${f.name}-${i}`} className='d-flex align-items-center gap-2'>
                      <i className='pi pi-upload'></i>
                      <span className='text-truncate'>{f.name}</span>
                      <Button type='button' icon='pi pi-times' rounded text severity='danger' size='small' onClick={() => quitarFile(i)} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Col>
          {archivosExistentes.length > 0 && (
            <Col md={12}>
              <div className='mb-2'>
                <label className='form-label'>ARCHIVOS GUARDADOS:</label>
                <ul className='list-unstyled mb-0'>
                  {archivosExistentes.map((img) => (
                    <li key={img.id} className='d-flex align-items-center gap-2'>
                      <i className='pi pi-paperclip'></i>
                      <a href={urlArchivo(img)} target='_blank' rel='noreferrer' className='text-truncate'>{img.name_image}</a>
                      <Button type='button' icon='pi pi-trash' rounded text severity='danger' size='small' onClick={() => onDeleteArchivo(img.id)} />
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          )}
          <Col md={12} className='d-flex justify-content-end mt-2'>
            <Button type='button' label='CANCELAR' text onClick={onHide} className='me-2' />
            <Button type='submit' label={item ? 'ACTUALIZAR' : 'GUARDAR'} loading={isSaving} />
          </Col>
        </Row>
      </form>
    </Dialog>
  )
}

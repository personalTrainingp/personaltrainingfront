import React, { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { ArchivosActa } from './ArchivosActa'

const formVacio = { titulo: '', observacion: '' }
const ACCEPT = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'

export const ModalActa = ({ show, onHide, item, onGuardar, onEliminarArchivo }) => {
  const [form, setForm] = useState(formVacio)
  const [files, setFiles] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!show) return
    setFiles([])
    setForm(item ? { titulo: item.titulo ?? '', observacion: item.observacion ?? '' } : formVacio)
  }, [show, item?.id])

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onChangeFiles = (e) => {
    const nuevos = Array.from(e.target.files ?? [])
    setFiles((prev) => [...prev, ...nuevos])
    e.target.value = ''
  }
  const quitarFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

  const confirmarEliminarArchivo = (img) => {
    confirmDialog({
      header: 'Eliminar archivo',
      message: `¿Quieres eliminar "${img.name_image}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => onEliminarArchivo(img.id),
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    const ok = await onGuardar(form, files)
    setIsSaving(false)
    if (ok) onHide()
  }

  const archivosExistentes = item?.archivos ?? []

  return (
    <Dialog header={item ? 'Editar acta' : 'Agregar acta'} style={{ width: '40rem' }} breakpoints={{ '768px': '95vw' }} visible={show} onHide={onHide}>
      <form onSubmit={onSubmit}>
        <div className='mb-2'>
          <label className='form-label'>TITULO:</label>
          <input className='form-control' name='titulo' value={form.titulo} onChange={onChange} maxLength={200} required autoFocus />
        </div>
        <div className='mb-2'>
          <label className='form-label'>OBSERVACION:</label>
          <textarea className='form-control' name='observacion' rows={6} value={form.observacion} onChange={onChange} maxLength={4000} />
        </div>
        <div className='mb-3'>
          <label className='form-label'>DOCUMENTOS / FOTOS:</label>
          {archivosExistentes.length > 0 && (
            <div className='mb-2 pt-2'>
              <ArchivosActa archivos={archivosExistentes} onEliminar={confirmarEliminarArchivo} size={56} />
            </div>
          )}
          <input type='file' className='form-control' multiple accept={ACCEPT} onChange={onChangeFiles} />
          {files.length > 0 && (
            <ul className='list-unstyled mt-2 mb-0'>
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`} className='d-flex align-items-center justify-content-between border rounded px-2 py-1 mb-1'>
                  <span className='text-truncate small'><i className='pi pi-paperclip me-1'></i>{f.name}</span>
                  <Button type='button' icon='pi pi-times' text rounded severity='danger' size='small' aria-label='Quitar' onClick={() => quitarFile(i)} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className='d-flex justify-content-end gap-2'>
          <Button type='button' label='CANCELAR' text onClick={onHide} disabled={isSaving} />
          <Button type='submit' label={item ? 'ACTUALIZAR' : 'GUARDAR'} loading={isSaving} />
        </div>
      </form>
    </Dialog>
  )
}

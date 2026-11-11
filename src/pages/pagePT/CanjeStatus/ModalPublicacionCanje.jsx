import React, { useEffect, useMemo, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Col, Row } from 'react-bootstrap'
import Select from 'react-select'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import { TIPOS_PUBLICACION } from './useCanjeStatus'

const nuevoForm = ({ id_cli = null, id_tipo = null, fecha = null } = {}) => ({
  id_cli,
  titulo: '',
  id_tipo,
  fecha: fecha ?? dayjs().format('YYYY-MM-DD'),
})

// dataClientes puede venir agrupado: [{ label, options: [...] }] o plano: [{ value, label }]
// idCliFijo: el cliente ya viene elegido y no se puede cambiar (ej. desde status influencer)
export const ModalPublicacionCanje = ({ show, onHide, item, dataClientes = [], onGuardar, idCliFijo = null, idTipoInicial = null, fechaInicial = null }) => {
  const [form, setForm] = useState(nuevoForm)
  const [isSaving, setIsSaving] = useState(false)
  const todosClientes = useMemo(() => dataClientes.flatMap((g) => g.options ?? [g]), [dataClientes])

  useEffect(() => {
    if (!show) return
    setForm(
      item
        ? { id_cli: item.id_cli, titulo: item.titulo ?? '', id_tipo: item.id_tipo, fecha: item.fecha ?? '' }
        : nuevoForm({ id_cli: idCliFijo, id_tipo: idTipoInicial, fecha: fechaInicial })
    )
  }, [show, item?.id])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.id_cli || !form.id_tipo) {
      Swal.fire({ icon: 'error', title: 'Seleccione el cliente y el tipo', timer: 3000, showConfirmButton: false })
      return
    }
    setIsSaving(true)
    const ok = await onGuardar(form)
    setIsSaving(false)
    if (ok) onHide()
  }

  return (
    <Dialog header={item ? 'Editar publicación' : 'Agregar publicación'} style={{ width: '34rem' }} visible={show} onHide={onHide}>
      <form onSubmit={onSubmit}>
        <Row>
          <Col md={12}>
            <div className='mb-2'>
              <label className='form-label'>CLIENTE:</label>
              <Select
                placeholder='Buscar cliente por DNI o nombre'
                className='react-select'
                classNamePrefix='react-select'
                options={dataClientes}
                value={todosClientes.find((o) => o.value === form.id_cli) ?? null}
                onChange={(o) => setForm((f) => ({ ...f, id_cli: o?.value ?? null }))}
                isDisabled={!!idCliFijo}
              />
            </div>
          </Col>
          <Col md={6}>
            <div className='mb-2'>
              <label className='form-label'>TIPO:</label>
              <Select
                placeholder='Reel o historia'
                className='react-select'
                classNamePrefix='react-select'
                options={TIPOS_PUBLICACION}
                value={TIPOS_PUBLICACION.find((o) => o.value === form.id_tipo) ?? null}
                onChange={(o) => setForm((f) => ({ ...f, id_tipo: o?.value ?? null }))}
              />
            </div>
          </Col>
          <Col md={6}>
            <div className='mb-2'>
              <label className='form-label'>FECHA:</label>
              <input
                type='date'
                className='form-control'
                value={form.fecha}
                onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
                required
              />
            </div>
          </Col>
          <Col md={12}>
            <div className='mb-2'>
              <label className='form-label'>TITULO:</label>
              <input
                className='form-control'
                value={form.titulo}
                maxLength={200}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                required
              />
            </div>
          </Col>
          <Col md={12} className='d-flex justify-content-end mt-2'>
            <Button type='button' label='CANCELAR' text onClick={onHide} className='me-2' />
            <Button type='submit' label={item ? 'ACTUALIZAR' : 'GUARDAR'} loading={isSaving} />
          </Col>
        </Row>
      </form>
    </Dialog>
  )
}

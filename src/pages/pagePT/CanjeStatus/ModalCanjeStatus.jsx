import React, { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Col, Row } from 'react-bootstrap'
import Select from 'react-select'
import Swal from 'sweetalert2'
import { labelTipoSocio, esCanjeInfluencer } from './useCanjeStatus'

const formVacio = {
  id_cli: null,
  contrato: false,
  n_reel_acuerdo_x_mes: 0,
  n_historia_acuerdo_x_mes: 0,
  link: '',
  observacion: '',
}

export const ModalCanjeStatus = ({ show, onHide, item, dataClientes = [], onGuardar, titulo = 'status de canje' }) => {
  const [form, setForm] = useState(formVacio)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!show) return
    setForm(
      item
        ? {
            id_cli: item.id_cli,
            contrato: !!item.contrato,
            n_reel_acuerdo_x_mes: item.n_reel_acuerdo_x_mes ?? 0,
            n_historia_acuerdo_x_mes: item.n_historia_acuerdo_x_mes ?? 0,
            link: item.link ?? '',
            observacion: item.observacion ?? '',
          }
        : formVacio
    )
  }, [show, item?.id])

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  const tipoSocio = dataClientes.find((o) => o.value === form.id_cli)?.tipoCli_cli
  const mostrarLink = esCanjeInfluencer(tipoSocio)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.id_cli) {
      Swal.fire({ icon: 'error', title: 'Seleccione el cliente', timer: 3000, showConfirmButton: false })
      return
    }
    setIsSaving(true)
    // si el socio no es canje influencer no se guarda link
    const ok = await onGuardar({ ...form, link: mostrarLink ? form.link : '' })
    setIsSaving(false)
    if (ok) onHide()
  }

  return (
    <Dialog header={item ? `Editar ${titulo}` : `Agregar ${titulo}`} style={{ width: '34rem' }} visible={show} onHide={onHide}>
      <form onSubmit={onSubmit}>
        <Row>
          <Col md={12}>
            <div className='mb-2'>
              <label className='form-label'>SOCIO:</label>
              <Select
                placeholder='Buscar cliente por DNI o nombre'
                className='react-select'
                classNamePrefix='react-select'
                options={dataClientes}
                value={dataClientes.find((o) => o.value === form.id_cli) ?? null}
                onChange={(o) => setForm((f) => ({ ...f, id_cli: o?.value ?? null }))}
              />
              {form.id_cli && (
                <small className='text-muted'>
                  TIPO DE SOCIO: <strong>{labelTipoSocio(tipoSocio) || 'SIN TIPO'}</strong>
                </small>
              )}
            </div>
          </Col>
          {mostrarLink && (
            <Col md={12}>
              <div className='mb-2'>
                <label className='form-label'>LINK DEL PERFIL:</label>
                <input type='text' className='form-control' name='link' placeholder='https://www.instagram.com/usuario' value={form.link} onChange={onChange} maxLength={500} />
              </div>
            </Col>
          )}
          <Col md={12}>
            <div className='form-check form-switch mb-3'>
              <input
                className='form-check-input'
                type='checkbox'
                id='contrato'
                checked={form.contrato}
                onChange={(e) => setForm((f) => ({ ...f, contrato: e.target.checked }))}
              />
              <label className='form-check-label' htmlFor='contrato'>TIENE CONTRATO</label>
            </div>
          </Col>
          <Col md={6}>
            <div className='mb-2'>
              <label className='form-label'>N° REELS ACORDADOS X MES:</label>
              <input type='number' min={0} className='form-control' name='n_reel_acuerdo_x_mes' value={form.n_reel_acuerdo_x_mes} onChange={onChange} required />
            </div>
          </Col>
          <Col md={6}>
            <div className='mb-2'>
              <label className='form-label'>N° HISTORIAS ACORDADAS X MES:</label>
              <input type='number' min={0} className='form-control' name='n_historia_acuerdo_x_mes' value={form.n_historia_acuerdo_x_mes} onChange={onChange} required />
            </div>
          </Col>
          <Col md={12}>
            <div className='mb-2'>
              <label className='form-label'>OBSERVACION:</label>
              <textarea className='form-control' name='observacion' rows={3} placeholder='Comentario sobre el influencer' value={form.observacion} onChange={onChange} maxLength={1000} />
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

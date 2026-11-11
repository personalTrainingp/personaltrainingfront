import React, { useMemo, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Table } from 'react-bootstrap'
import dayjs from 'dayjs'
import { MESES } from '../GestionMetas/meses'
import { labelTipo } from '../CanjeStatus/useCanjeStatus'
import { ModalPublicacionCanje } from '../CanjeStatus/ModalPublicacionCanje'

// Reels e historias de un influencer en el mes/año seleccionado
export const ModalPublicacionesInfluencer = ({
  show,
  onHide,
  influencer,
  mes,
  anio,
  dataPublicaciones = [],
  dataClientes = [],
  guardarPublicacion,
  eliminarPublicacion,
}) => {
  const [modal, setModal] = useState({ isOpen: false, item: null, id_tipo: null })
  const periodo = `${anio}-${String(mes).padStart(2, '0')}`

  // si el mes elegido es el actual se propone hoy, si no el primer día de ese mes
  const fechaInicial = periodo === dayjs().format('YYYY-MM') ? dayjs().format('YYYY-MM-DD') : `${periodo}-01`

  const publicaciones = useMemo(
    () =>
      influencer
        ? dataPublicaciones
            .filter((p) => p.id_cli === influencer.id_cli && p.fecha?.startsWith(periodo))
            .sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : a.id - b.id))
        : [],
    [dataPublicaciones, influencer, periodo]
  )
  const reels = publicaciones.filter((p) => p.id_tipo === 1).length
  const historias = publicaciones.filter((p) => p.id_tipo === 2).length

  const confirmarEliminar = (p) => {
    confirmDialog({
      header: 'Eliminar publicación',
      message: `¿Quieres eliminar "${p.titulo}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => eliminarPublicacion(p.id),
    })
  }

  if (!influencer) return null

  return (
    <Dialog
      header={`REELS E HISTORIAS — ${influencer.nombre} (${MESES[mes - 1]} ${anio})`}
      style={{ width: '50rem' }}
      breakpoints={{ '960px': '95vw' }}
      visible={show}
      onHide={onHide}
    >
      <div className='d-flex flex-wrap align-items-center gap-3 mb-3'>
        <span className={`badge fs-6 ${reels >= influencer.n_reel_acuerdo_x_mes ? 'bg-success' : 'bg-warning text-dark'}`}>
          REELS: {reels} / {influencer.n_reel_acuerdo_x_mes}
        </span>
        <span className={`badge fs-6 ${historias >= influencer.n_historia_acuerdo_x_mes ? 'bg-success' : 'bg-warning text-dark'}`}>
          HISTORIAS: {historias} / {influencer.n_historia_acuerdo_x_mes}
        </span>
        <div className='ms-auto d-flex gap-2'>
          <Button label='AGREGAR REEL' icon='pi pi-plus' size='small' onClick={() => setModal({ isOpen: true, item: null, id_tipo: 1 })} />
          <Button label='AGREGAR HISTORIA' icon='pi pi-plus' size='small' severity='info' onClick={() => setModal({ isOpen: true, item: null, id_tipo: 2 })} />
        </div>
      </div>

      <ModalPublicacionCanje
        show={modal.isOpen}
        item={modal.item}
        dataClientes={dataClientes}
        idCliFijo={influencer.id_cli}
        idTipoInicial={modal.id_tipo}
        fechaInicial={fechaInicial}
        onHide={() => setModal({ isOpen: false, item: null, id_tipo: null })}
        onGuardar={(form) => guardarPublicacion(modal.item?.id, form)}
      />

      <Table responsive hover size='sm'>
        <thead>
          <tr>
            <th>#</th>
            <th>FECHA</th>
            <th>TIPO</th>
            <th>TITULO</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {publicaciones.length === 0 && (
            <tr><td colSpan={5} className='text-center'>No hay reels ni historias en este mes</td></tr>
          )}
          {publicaciones.map((p, i) => (
            <tr key={p.id}>
              <td>{i + 1}</td>
              <td className='text-nowrap'>{dayjs(p.fecha).format('DD/MM/YYYY')}</td>
              <td>
                <span className={`badge ${p.id_tipo === 1 ? 'bg-primary' : 'bg-info text-dark'}`}>{labelTipo(p.id_tipo)}</span>
              </td>
              <td>{p.titulo}</td>
              <td className='text-nowrap text-end'>
                <Button icon='pi pi-pencil' rounded text size='small' aria-label='Editar' onClick={() => setModal({ isOpen: true, item: p, id_tipo: p.id_tipo })} />
                <Button icon='pi pi-trash' rounded text severity='danger' size='small' aria-label='Eliminar' onClick={() => confirmarEliminar(p)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Dialog>
  )
}

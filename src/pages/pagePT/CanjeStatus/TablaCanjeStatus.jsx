import React, { useMemo, useState } from 'react'
import { Button } from 'primereact/button'
import { Table } from 'react-bootstrap'
import { confirmDialog } from 'primereact/confirmdialog'
import dayjs from 'dayjs'
import { nombreCliente } from './useCanjeStatus'
import { ModalCanjeStatus } from './ModalCanjeStatus'
import { LinkPerfil } from './LinkPerfil'

const Avance = ({ hecho, acuerdo }) => {
  const ok = acuerdo > 0 && hecho >= acuerdo
  return (
    <span className={`badge ${ok ? 'bg-success' : hecho > 0 ? 'bg-warning text-dark' : 'bg-secondary'}`}>
      {hecho} / {acuerdo}
    </span>
  )
}

export const TablaCanjeStatus = ({ dataStatus, dataPublicaciones, dataClientes, isLoading, guardarStatus, eliminarStatus }) => {
  const [modal, setModal] = useState({ isOpen: false, item: null })
  const mesActual = dayjs().format('YYYY-MM')

  // publicaciones del mes actual por cliente: { id_cli: { reel, historia } }
  const avanceMes = useMemo(() => {
    const map = {}
    for (const p of dataPublicaciones) {
      if (!p.fecha?.startsWith(mesActual)) continue
      map[p.id_cli] ??= { reel: 0, historia: 0 }
      if (p.id_tipo === 1) map[p.id_cli].reel++
      if (p.id_tipo === 2) map[p.id_cli].historia++
    }
    return map
  }, [dataPublicaciones, mesActual])

  const confirmarEliminar = (item) => {
    confirmDialog({
      header: 'Eliminar status de canje',
      message: `¿Quieres eliminar el status de canje de ${nombreCliente(item.cliente)}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => eliminarStatus(item.id),
    })
  }

  return (
    <div>
      <div className='d-flex justify-content-end mb-2'>
        <Button label='AGREGAR' icon='pi pi-plus' onClick={() => setModal({ isOpen: true, item: null })} />
      </div>
      <ModalCanjeStatus
        show={modal.isOpen}
        item={modal.item}
        dataClientes={dataClientes}
        onHide={() => setModal({ isOpen: false, item: null })}
        onGuardar={(form) => guardarStatus(modal.item?.id, form)}
      />
      <Table responsive hover>
        <thead>
          <tr>
            <th>#</th>
            <th>CLIENTE</th>
            <th>LINK</th>
            <th>CONTRATO</th>
            <th>REELS ACORDADOS / MES</th>
            <th>HISTORIAS ACORDADAS / MES</th>
            <th>REELS {dayjs().format('MMM').toUpperCase()}</th>
            <th>HISTORIAS {dayjs().format('MMM').toUpperCase()}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && dataStatus.length === 0 && (
            <tr><td colSpan={9} className='text-center'>Cargando...</td></tr>
          )}
          {!isLoading && dataStatus.length === 0 && (
            <tr><td colSpan={9} className='text-center'>No hay registros</td></tr>
          )}
          {dataStatus.map((d, index) => {
            const av = avanceMes[d.id_cli] ?? { reel: 0, historia: 0 }
            return (
              <tr key={d.id}>
                <td>{index + 1}</td>
                <td>{nombreCliente(d.cliente)}</td>
                <td><LinkPerfil link={d.link} tipoCli={d.cliente?.tipoCli_cli} /></td>
                <td>
                  <span className={`badge ${d.contrato ? 'bg-success' : 'bg-secondary'}`}>{d.contrato ? 'SÍ' : 'NO'}</span>
                </td>
                <td>{d.n_reel_acuerdo_x_mes}</td>
                <td>{d.n_historia_acuerdo_x_mes}</td>
                <td><Avance hecho={av.reel} acuerdo={d.n_reel_acuerdo_x_mes} /></td>
                <td><Avance hecho={av.historia} acuerdo={d.n_historia_acuerdo_x_mes} /></td>
                <td className='text-nowrap'>
                  <Button label='EDITAR' size='small' outlined className='me-2' onClick={() => setModal({ isOpen: true, item: d })} />
                  <Button label='ELIMINAR' size='small' outlined severity='danger' onClick={() => confirmarEliminar(d)} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

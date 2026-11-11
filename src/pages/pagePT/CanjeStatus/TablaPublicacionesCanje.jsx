import React, { useMemo, useState } from 'react'
import { Button } from 'primereact/button'
import { Table } from 'react-bootstrap'
import { confirmDialog } from 'primereact/confirmdialog'
import Select from 'react-select'
import dayjs from 'dayjs'
import { TIPOS_PUBLICACION, labelTipo, nombreCliente } from './useCanjeStatus'
import { ModalPublicacionCanje } from './ModalPublicacionCanje'

export const TablaPublicacionesCanje = ({ dataPublicaciones, dataStatus, dataClientes, isLoading, guardarPublicacion, eliminarPublicacion }) => {
  const [modal, setModal] = useState({ isOpen: false, item: null })
  const [filtroCli, setFiltroCli] = useState(null)
  const [filtroTipo, setFiltroTipo] = useState(null)
  const [filtroMes, setFiltroMes] = useState('') // YYYY-MM

  // en el filtro solo aparecen los clientes que tienen publicaciones
  const opcionesCliente = useMemo(() => {
    const ids = new Set(dataPublicaciones.map((p) => p.id_cli))
    return dataClientes.filter((c) => ids.has(c.value))
  }, [dataPublicaciones, dataClientes])

  // en el modal se priorizan los clientes con status de canje
  const clientesModal = useMemo(() => {
    const ids = new Set(dataStatus.map((s) => s.id_cli))
    const conStatus = dataClientes.filter((c) => ids.has(c.value))
    const otros = dataClientes.filter((c) => !ids.has(c.value))
    return [
      { label: 'CON STATUS DE CANJE', options: conStatus },
      { label: 'OTROS CLIENTES', options: otros },
    ]
  }, [dataStatus, dataClientes])

  const filtradas = useMemo(
    () =>
      dataPublicaciones.filter(
        (p) =>
          (!filtroCli || p.id_cli === filtroCli) &&
          (!filtroTipo || p.id_tipo === filtroTipo) &&
          (!filtroMes || p.fecha?.startsWith(filtroMes))
      ),
    [dataPublicaciones, filtroCli, filtroTipo, filtroMes]
  )

  const confirmarEliminar = (item) => {
    confirmDialog({
      header: 'Eliminar publicación',
      message: `¿Quieres eliminar "${item.titulo}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => eliminarPublicacion(item.id),
    })
  }

  return (
    <div>
      <div className='d-flex flex-wrap gap-2 align-items-end mb-2'>
        <div style={{ minWidth: 260 }}>
          <label className='form-label mb-0'>CLIENTE</label>
          <Select
            isClearable
            placeholder='Todos'
            className='react-select'
            classNamePrefix='react-select'
            options={opcionesCliente}
            value={opcionesCliente.find((o) => o.value === filtroCli) ?? null}
            onChange={(o) => setFiltroCli(o?.value ?? null)}
          />
        </div>
        <div style={{ minWidth: 160 }}>
          <label className='form-label mb-0'>TIPO</label>
          <Select
            isClearable
            placeholder='Todos'
            className='react-select'
            classNamePrefix='react-select'
            options={TIPOS_PUBLICACION}
            value={TIPOS_PUBLICACION.find((o) => o.value === filtroTipo) ?? null}
            onChange={(o) => setFiltroTipo(o?.value ?? null)}
          />
        </div>
        <div>
          <label className='form-label mb-0'>MES</label>
          <input type='month' className='form-control' value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)} />
        </div>
        <div className='ms-auto'>
          <Button label='AGREGAR' icon='pi pi-plus' onClick={() => setModal({ isOpen: true, item: null })} />
        </div>
      </div>
      <ModalPublicacionCanje
        show={modal.isOpen}
        item={modal.item}
        dataClientes={clientesModal}
        onHide={() => setModal({ isOpen: false, item: null })}
        onGuardar={(form) => guardarPublicacion(modal.item?.id, form)}
      />
      <Table responsive hover>
        <thead>
          <tr>
            <th>#</th>
            <th>FECHA</th>
            <th>CLIENTE</th>
            <th>TIPO</th>
            <th>TITULO</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && dataPublicaciones.length === 0 && (
            <tr><td colSpan={6} className='text-center'>Cargando...</td></tr>
          )}
          {!isLoading && filtradas.length === 0 && (
            <tr><td colSpan={6} className='text-center'>No hay registros</td></tr>
          )}
          {filtradas.map((d, index) => (
            <tr key={d.id}>
              <td>{index + 1}</td>
              <td className='text-nowrap'>{d.fecha ? dayjs(d.fecha).format('DD/MM/YYYY') : ''}</td>
              <td>{nombreCliente(d.cliente)}</td>
              <td>
                <span className={`badge ${d.id_tipo === 1 ? 'bg-primary' : 'bg-info text-dark'}`}>{labelTipo(d.id_tipo)}</span>
              </td>
              <td>{d.titulo}</td>
              <td className='text-nowrap'>
                <Button label='EDITAR' size='small' outlined className='me-2' onClick={() => setModal({ isOpen: true, item: d })} />
                <Button label='ELIMINAR' size='small' outlined severity='danger' onClick={() => confirmarEliminar(d)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

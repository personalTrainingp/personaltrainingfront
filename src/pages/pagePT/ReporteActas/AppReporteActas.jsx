import React, { useEffect, useState } from 'react'
import { PageBreadcrumb } from '@/components'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { ProgressSpinner } from 'primereact/progressspinner'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import dayjs from 'dayjs'
import { useActas } from './useActas'
import { ModalActa } from './ModalActa'
import { ArchivosActa } from './ArchivosActa'

export const AppReporteActas = () => {
  const [modal, setModal] = useState({ isOpen: false, item: null })
  const { dataActas, isLoading, obtenerActas, guardarActa, eliminarActa, eliminarArchivo } = useActas()

  useEffect(() => {
    obtenerActas()
  }, [])

  const confirmarEliminar = (row) => {
    confirmDialog({
      header: 'Eliminar acta',
      message: `¿Quieres eliminar el acta "${row.titulo}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => eliminarActa(row.id),
    })
  }

  const columns = [
    { id: 'fecha', header: 'FECHA', render: (row) => <span className='text-nowrap'>{dayjs(row.createdAt).format('DD/MM/YYYY hh:mm A')}</span> },
    { id: 'titulo', header: 'TITULO', render: (row) => <span className='fw-bold'>{row.titulo}</span> },
    {
      id: 'observacion', header: 'OBSERVACION', render: (row) => (
        <div style={{ whiteSpace: 'pre-wrap', maxWidth: 500 }}>{row.observacion || <span className='text-muted'>—</span>}</div>
      )
    },
    { id: 'archivos', header: 'DOCUMENTOS', render: (row) => <ArchivosActa archivos={row.archivos ?? []} /> },
    {
      id: 'acciones', header: 'ACCIONES', cellAlign: 'center', render: (row) => (
        <div className='d-flex justify-content-center gap-2'>
          <Button icon='pi pi-pencil' rounded outlined aria-label='Editar' onClick={() => setModal({ isOpen: true, item: row })} />
          <Button icon='pi pi-trash' rounded outlined severity='danger' aria-label='Eliminar' onClick={() => confirmarEliminar(row)} />
        </div>
      )
    },
  ]

  return (
    <>
      <PageBreadcrumb title={'REPORTE ACTAS'} />
      <div className='d-flex justify-content-end mb-3'>
        <Button label='AGREGAR ACTA' icon='pi pi-plus' onClick={() => setModal({ isOpen: true, item: null })} />
      </div>
      <ModalActa
        show={modal.isOpen}
        item={modal.item ? dataActas.find((a) => a.id === modal.item.id) ?? modal.item : null}
        onHide={() => setModal({ isOpen: false, item: null })}
        onGuardar={(form, files) => guardarActa(modal.item?.id, form, files)}
        onEliminarArchivo={eliminarArchivo}
      />
      {isLoading && dataActas.length === 0
        ? (
          <div className='d-flex flex-column align-items-center justify-content-center py-5'>
            <ProgressSpinner style={{ width: 60, height: 60 }} strokeWidth='4' />
            <span className='mt-2 text-muted'>Cargando actas...</span>
          </div>
        )
        : <DataTableCR columns={columns} data={dataActas} exportable={false} />}
    </>
  )
}

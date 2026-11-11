import React, { useEffect, useMemo, useState } from 'react'
import { CalendarioMesDia, MESES, diasDelEvento, eventoEnMesDia, BadgeTipo, labelTipoEvento } from './CalendarioMesDia'
import { Button } from 'primereact/button'
import { Table } from 'react-bootstrap'
import { confirmDialog } from 'primereact/confirmdialog'
import dayjs from 'dayjs'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useCalendarioMarketing, urlArchivo, archivosDelEvento } from './useCalendarioMarketing'
import { ModalCalendarioMarketing } from './ModalCalendarioMarketing'

export const ENTIDAD_TIPO = 'calendario-marketing'
export const GRUPO_TIPO = 'tipo'

const esImagen = (ext = '') => ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext.toLowerCase())
const formatFecha = (f) => (f ? dayjs(f).format('DD/MM/YYYY') : '')

export const App = ({ id_empresa }) => {
  const [modal, setModal] = useState({ isOpen: false, item: null })
  const [mes, setMes] = useState(dayjs().month() + 1)
  const [dia, setDia] = useState(null)
  const {
    dataCalendario,
    isLoading,
    obtenerCalendario,
    postCalendario,
    updateCalendario,
    deleteCalendario,
    deleteArchivo,
  } = useCalendarioMarketing()
  const { obtenerParametroPorEntidadyGrupo, DataGeneral: dataTipos } = useTerminoStore()

  useEffect(() => {
    obtenerCalendario(id_empresa)
    obtenerParametroPorEntidadyGrupo(ENTIDAD_TIPO, GRUPO_TIPO)
  }, [id_empresa])

  // precalcula los "MM-DD" de cada evento (sin año)
  const eventos = useMemo(
    () => dataCalendario.map((d) => ({ ...d, _dias: diasDelEvento(d) })),
    [dataCalendario]
  )
  const eventosFiltrados = useMemo(
    () => eventos.filter((d) => eventoEnMesDia(d, mes, dia)),
    [eventos, mes, dia]
  )

  const abrirModal = (item = null) => setModal({ isOpen: true, item })
  const cerrarModal = () => setModal({ isOpen: false, item: null })

  const onGuardar = async (formState, files) => {
    if (modal.item) {
      await updateCalendario(modal.item.id, formState, files, id_empresa)
    } else {
      await postCalendario(formState, files, id_empresa)
    }
  }

  const confirmarEliminar = (item) => {
    confirmDialog({
      header: 'Eliminar evento',
      message: `¿Quieres eliminar "${item.titulo}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => deleteCalendario(item.id, id_empresa),
    })
  }

  // mantiene el item del modal sincronizado cuando se elimina un archivo
  const itemModal = modal.item ? dataCalendario.find((d) => d.id === modal.item.id) ?? modal.item : null

  return (
    <div>
      <div className='d-flex justify-content-between align-items-center my-3'>
        <h4 className='m-0'>CALENDARIO DE MARKETING</h4>
        <Button label='AGREGAR' icon='pi pi-plus' onClick={() => abrirModal()} />
      </div>
      <ModalCalendarioMarketing
        show={modal.isOpen}
        onHide={cerrarModal}
        item={itemModal}
        dataTipos={dataTipos}
        onGuardar={onGuardar}
        onDeleteArchivo={(id_image) => deleteArchivo(id_image, id_empresa)}
      />
      <CalendarioMesDia eventos={eventos} dataTipos={dataTipos} mes={mes} dia={dia} onChangeMes={setMes} onChangeDia={setDia} />
      <h5 className='mt-3'>
        {dia ? `${dia} DE ${MESES[mes - 1]}` : MESES[mes - 1]} ({eventosFiltrados.length})
      </h5>
      <Table responsive hover>
        <thead>
          <tr>
            <th>#</th>
            <th>FECHA INICIO</th>
            <th>FECHA FIN</th>
            <th>TIPO</th>
            <th>TITULO</th>
            <th>OBSERVACION</th>
            <th>ARCHIVOS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && dataCalendario.length === 0 && (
            <tr><td colSpan={8} className='text-center'>Cargando...</td></tr>
          )}
          {!isLoading && eventosFiltrados.length === 0 && (
            <tr><td colSpan={8} className='text-center'>No hay registros</td></tr>
          )}
          {eventosFiltrados.map((d, index) => (
            <tr key={d.id}>
              <td>{index + 1}</td>
              <td className='text-nowrap'>{formatFecha(d.fecha_inicio)}</td>
              <td className='text-nowrap'>{formatFecha(d.fecha_fin)}</td>
              <td><BadgeTipo label={labelTipoEvento(d, dataTipos)} /></td>
              <td>{d.titulo}</td>
              <td style={{ whiteSpace: 'pre-wrap' }}>{d.observacion}</td>
              <td>
                <div className='d-flex flex-wrap gap-2'>
                  {archivosDelEvento(d).map((img) => (
                    <a key={img.id} href={urlArchivo(img)} target='_blank' rel='noreferrer' title={img.name_image}>
                      {esImagen(img.extension_image) ? (
                        <img src={urlArchivo(img)} alt={img.name_image} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                      ) : (
                        <i className='pi pi-file' style={{ fontSize: '1.6rem' }}></i>
                      )}
                    </a>
                  ))}
                </div>
              </td>
              <td className='text-nowrap'>
                <Button label='EDITAR' size='small' outlined className='me-2' onClick={() => abrirModal(d)} />
                <Button label='ELIMINAR' size='small' outlined severity='danger' onClick={() => confirmarEliminar(d)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

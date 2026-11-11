import React, { useEffect, useMemo, useState } from 'react'
import config from '@/config'
import { PageBreadcrumb } from '@/components'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import dayjs from 'dayjs'
import { MESES } from '../GestionMetas/meses'
import { SelectorTexto } from '../GestionComercial/ModalReporteTareas'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useCanjeStatus, nombreCliente, labelTipoSocio, esCanjeInfluencer } from '../CanjeStatus/useCanjeStatus'
import { ModalCanjeStatus } from '../CanjeStatus/ModalCanjeStatus'
import { LinkPerfil } from '../CanjeStatus/LinkPerfil'
import { ModalPublicacionesInfluencer } from './ModalPublicacionesInfluencer'

const ANIO_INICIAL = 2024

// Los influencers son los registros de tb_canjeStatus (cliente + contrato + acuerdo de reels/historias).
// El status se calcula con las publicaciones (tb_publicacionesCanje) del mes y año seleccionados.

const iniciales = (nombre)=>(nombre || '?').split(' ').filter(Boolean).map(p=>p[0]).join('').slice(0, 2).toUpperCase()

// foto vigente del cliente: la ultima de tb_images, igual que el perfil
const fotoCliente = (cliente)=>{
  const imagenes = [...(cliente?.tb_images ?? [])].sort((a, b)=>a.id - b.id)
  const nameImage = imagenes.at(-1)?.name_image
  return nameImage ? `${config.API_IMG.AVATAR_CLI}${nameImage}` : null
}

const textoAcuerdo = (reels, historias)=>{
  const partes = []
  if (reels) partes.push(`${reels} ${reels === 1 ? 'reel' : 'reels'}`)
  if (historias) partes.push(`${historias} ${historias === 1 ? 'historia' : 'historias'}`)
  return partes.length ? `${partes.join(' y ')} mensuales` : 'Sin acuerdo'
}

const textoFalta = (n, singular, plural)=>`${n} ${n === 1 ? singular : plural}`

const calcularStatus = ({ reelsHechos, historiasHechas, reelsAcuerdo, historiasAcuerdo })=>{
  const faltaReels = Math.max(reelsAcuerdo - reelsHechos, 0)
  const faltaHistorias = Math.max(historiasAcuerdo - historiasHechas, 0)
  if (!faltaReels && !faltaHistorias) return { cumplio: true, texto: 'CUMPLIO' }
  const partes = []
  if (faltaReels) partes.push(textoFalta(faltaReels, 'REEL', 'REELS'))
  if (faltaHistorias) partes.push(textoFalta(faltaHistorias, 'HISTORIA', 'HISTORIAS'))
  return { cumplio: false, texto: `LE FALTA ${partes.join(' Y ')}` }
}

export const AppStatusInfluencer = ({ embebido = false, id_empresa = 598 }) => {
  const [mes, setmes] = useState(()=>dayjs().month() + 1)
  const [anio, setanio] = useState(()=>dayjs().year())
  const [modal, setModal] = useState({ isOpen: false, item: null })
  const [idPublicaciones, setIdPublicaciones] = useState(null) // id del status cuyo modal de reels/historias está abierto
  const anios = Array.from({length: dayjs().year() - ANIO_INICIAL + 1}, (_, i)=>ANIO_INICIAL + i)
  const {
    dataStatus,
    dataPublicaciones,
    dataClientes,
    isLoading,
    obtenerTodo,
    guardarStatus,
    eliminarStatus,
    guardarPublicacion,
    eliminarPublicacion,
  } = useCanjeStatus(id_empresa)

  useEffect(() => {
    obtenerTodo()
  }, [id_empresa])

  const dataInfluencers = useMemo(()=>{
    const periodo = `${anio}-${String(mes).padStart(2, '0')}`
    const hechos = {}
    for (const p of dataPublicaciones) {
      if (!p.fecha?.startsWith(periodo)) continue
      hechos[p.id_cli] ??= { reel: 0, historia: 0 }
      if (p.id_tipo === 1) hechos[p.id_cli].reel++
      if (p.id_tipo === 2) hechos[p.id_cli].historia++
    }
    return dataStatus.map(s=>{
      const h = hechos[s.id_cli] ?? { reel: 0, historia: 0 }
      return {
        ...s,
        nombre: nombreCliente(s.cliente),
        foto: fotoCliente(s.cliente),
        tipoSocio: labelTipoSocio(s.cliente?.tipoCli_cli),
        acuerdo: textoAcuerdo(s.n_reel_acuerdo_x_mes, s.n_historia_acuerdo_x_mes),
        avance: `${h.reel}/${s.n_reel_acuerdo_x_mes} reels · ${h.historia}/${s.n_historia_acuerdo_x_mes} historias`,
        status: calcularStatus({
          reelsHechos: h.reel,
          historiasHechas: h.historia,
          reelsAcuerdo: s.n_reel_acuerdo_x_mes,
          historiasAcuerdo: s.n_historia_acuerdo_x_mes,
        }),
      }
    })
  }, [dataStatus, dataPublicaciones, mes, anio])

  // arriba los "canje influencer"; abajo, en otra tabla, el resto de tipos de socio
  const influencers = useMemo(()=>dataInfluencers.filter(i=>esCanjeInfluencer(i.cliente?.tipoCli_cli)), [dataInfluencers])
  const otrosCanjes = useMemo(()=>dataInfluencers.filter(i=>!esCanjeInfluencer(i.cliente?.tipoCli_cli)), [dataInfluencers])

  const confirmarEliminar = (row)=>{
    confirmDialog({
      header: 'Eliminar influencer',
      message: `¿Quieres eliminar a ${row.nombre}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: ()=>eliminarStatus(row.id),
    })
  }

  const columns = [
    {
      id: 'foto', header: 'FOTO', cellAlign: 'center', render: (row)=>(
        row.foto
          ? <img src={row.foto} alt={row.nombre} className='rounded-circle' style={{ width: 100, height: 100, objectFit: 'cover' }}/>
          : <div className='rounded-circle bg-secondary text-white fw-bold d-inline-flex align-items-center justify-content-center' style={{ width: 100, height: 100 }}>{iniciales(row.nombre)}</div>
      )
    },
    { id: 'nombre', header: 'NOMBRE', render: (row)=>row.nombre },
    {
      id: 'tipoSocio', header: 'TIPO DE SOCIO', render: (row)=>(
        row.tipoSocio
          ? <span className='fw-bold'>{row.tipoSocio}</span>
          : <span className='text-muted'>SIN TIPO</span>
      )
    },
    { id: 'link', header: 'LINK', cellAlign: 'center', render: (row)=><LinkPerfil link={row.link} tipoCli={row.cliente?.tipoCli_cli}/> },
    {
      id: 'contrato', header: 'CONTRATO', cellAlign: 'center', render: (row)=>(
        <span className={`badge ${row.contrato ? 'bg-success' : 'bg-danger'}`}>{row.contrato ? 'SI' : 'NO'}</span>
      )
    },
    { id: 'acuerdo', header: 'ACUERDO', render: (row)=>row.acuerdo },
    {
      id: 'status', header: 'STATUS', render: (row)=>(
        <div>
          <span className={`badge ${row.status.cumplio ? 'bg-success' : 'bg-warning text-dark'}`}>{row.status.texto}</span>
          <div className='small text-muted mt-1'>{row.avance}</div>
        </div>
      )
    },
    {
      id: 'observacion', header: 'OBSERVACION', render: (row)=>(
        <div style={{ whiteSpace: 'pre-wrap', maxWidth: 260 }}>{row.observacion || <span className='text-muted'>—</span>}</div>
      )
    },
    ...(embebido ? [] : [{
      id: 'acciones', header: 'ACCIONES', cellAlign: 'center', render: (row)=>(
        <div className='d-flex justify-content-center gap-2'>
          <Button icon='pi pi-video' rounded outlined severity='info' aria-label='Reels e historias' tooltip='Reels e historias' tooltipOptions={{ position: 'top' }} onClick={()=>setIdPublicaciones(row.id)}/>
          <Button icon='pi pi-pencil' rounded outlined aria-label='Editar' onClick={()=>setModal({ isOpen: true, item: row })}/>
          <Button icon='pi pi-trash' rounded outlined severity='danger' aria-label='Eliminar' onClick={()=>confirmarEliminar(row)}/>
        </div>
      )
    }]),
  ]

  // una sola tabla: primero los canje influencer, luego una fila separadora y los otros canjes.
  // los otros canjes no muestran link, contrato, acuerdo ni status
  const SOLO_INFLUENCER = ['link', 'contrato', 'acuerdo', 'status']
  const columnsTabla = columns.map(c=>SOLO_INFLUENCER.includes(c.id)
    ? { ...c, render: (row, i)=>esCanjeInfluencer(row.cliente?.tipoCli_cli) ? c.render(row, i) : null }
    : c)
  const dataTabla = otrosCanjes.length
    ? [...influencers, { __grupo: `OTROS CANJES (${otrosCanjes.length})` }, ...otrosCanjes]
    : influencers

  return (
    <>
      {/* dentro de otra pantalla (ej. informe gerencial) va como seccion, sin cambiar el titulo de la pagina */}
      {embebido ? <h4 className='mb-2'>STATUS INFLUENCER</h4> : <PageBreadcrumb title={'STATUS INFLUENCER'}/>}
      <div className='d-flex align-items-center gap-3 flex-wrap mb-3'>
        <SelectorTexto id='statusInfluencerMes' valor={mes} onChange={setmes} opciones={MESES.map((nombre, i)=>({value: i + 1, label: nombre}))}/>
        <SelectorTexto id='statusInfluencerAnio' valor={anio} onChange={setanio} opciones={anios.map(a=>({value: a, label: a}))}/>
        {!embebido && (
          <Button className='ms-auto' label='AGREGAR CANJE' icon='pi pi-plus' onClick={()=>setModal({ isOpen: true, item: null })}/>
        )}
      </div>
      {!embebido && (
        <ModalCanjeStatus
          titulo='influencer'
          show={modal.isOpen}
          item={modal.item}
          dataClientes={dataClientes}
          onHide={()=>setModal({ isOpen: false, item: null })}
          onGuardar={(form)=>guardarStatus(modal.item?.id, form)}
        />
      )}
      {!embebido && (
        <ModalPublicacionesInfluencer
          show={!!idPublicaciones}
          onHide={()=>setIdPublicaciones(null)}
          influencer={dataInfluencers.find(i=>i.id === idPublicaciones) ?? null}
          mes={mes}
          anio={anio}
          dataPublicaciones={dataPublicaciones}
          dataClientes={dataClientes}
          guardarPublicacion={guardarPublicacion}
          eliminarPublicacion={eliminarPublicacion}
        />
      )}
      {isLoading
        ? (
          <div className='d-flex flex-column align-items-center justify-content-center py-5'>
            <ProgressSpinner style={{ width: 60, height: 60 }} strokeWidth='4'/>
            <span className='mt-2 text-muted'>Cargando influencers...</span>
          </div>
        )
        : <DataTableCR columns={columnsTabla} data={dataTabla} exportable={false} tituloSuperior={`CANJE INFLUENCER (${influencers.length})`}/>}
    </>
  )
}

import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Dropdown, Form, Modal, ProgressBar, Row, Spinner, Table } from 'react-bootstrap'
import { TabPanel, TabView } from 'primereact/tabview'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { arrayTareasComercial } from '@/types/type'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { MESES } from '../GestionMetas/meses'
import { useGestionComercialStore } from './useGestionComercialStore'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { dniTieneHuella } from '../GestionEventosAsistencia/pinHuellero'
import { Button as BotonIcono } from 'primereact/button'
import { ModalComentario } from './ModalComentario'

// Las tareas de exito van en verde ISESAC con texto blanco; el card que esta filtrando la tabla se distingue en azul
const ResumenItem = ({label, valor, icon, activo, exito, onClick})=>(
  <div className='d-flex flex-column h-100 cursor-pointer' onClick={onClick}>
    <Card className={`shadow-sm flex-grow-1 mb-1 ${activo ? 'bg-primary text-white' : exito ? 'bg-greenISESAC text-white' : ''}`}>
      <Card.Body className='py-2 text-center d-flex flex-column justify-content-center'>
        {icon && <i className={`${icon} fs-3 mb-1`}></i>}
        <div className={`fs-3 ${activo || exito ? '' : 'text-muted'}`}>{label}</div>
        <div className='fw-bold fs-3 text-center'>{valor}</div>
      </Card.Body>
    </Card>
  </div>
)

// Timing = (cuota / ultimo dia del mes de la cuota) * dias transcurridos de ese mes.
// Mes de la cuota ya cerrado: transcurrieron todos sus dias. Mes futuro: aun no hay timing (null)
const calcularTiming = (meta, hoy = dayjs())=>{
  const mesCuota = dayjs(new Date(meta.anio, meta.mes - 1, 1))
  if (mesCuota.isAfter(hoy, 'month')) return null
  const diasDelMes = mesCuota.daysInMonth()
  const diasTranscurridos = mesCuota.isSame(hoy, 'month') ? hoy.date() : diasDelMes
  return { timing: (meta.meta_asesor / diasDelMes) * diasTranscurridos, diasDelMes, diasTranscurridos }
}

// Semana del mes: empieza el 1, 8, 15, 22 o 29 y termina 7 dias despues contando inicio y fin (1-8, 8-15, 15-22, 22-29, 29-fin). Mes actual: la semana de hoy.
// Mes cerrado: su ultimo bloque. Mes futuro: el primero
const semanaDelMes = (mes, anio, hoy = dayjs())=>{
  const mesCuota = dayjs(new Date(anio, mes - 1, 1))
  const diasDelMes = mesCuota.daysInMonth()
  const dia = mesCuota.isSame(hoy, 'month') ? hoy.date() : mesCuota.isBefore(hoy, 'month') ? diasDelMes : 1
  const numero = Math.floor((dia - 1) / 7)
  const diaInicio = numero * 7 + 1
  const diaFin = Math.min(diaInicio + 7, diasDelMes)
  // Dias contando el inicio y el fin (+1). Quedan: desde hoy (incluido) hasta el fin; mes cerrado 0, mes futuro todos
  const diasSemana = diaFin - diaInicio + 1
  const diasQuedan = mesCuota.isSame(hoy, 'month') ? diaFin - dia + 1 : mesCuota.isBefore(hoy, 'month') ? 0 : diasSemana
  return {
    numero: numero + 1,
    desde: mesCuota.date(diaInicio).format('YYYY-MM-DD'),
    hasta: mesCuota.date(diaFin).format('YYYY-MM-DD'),
    diaInicio, diaFin, diasDelMes, diasSemana, diasQuedan,
  }
}

// Dias que faltan del mes de la cuota, contando hoy. Mes cerrado: 0. Mes futuro: todos sus dias
const diasFaltanMes = (meta, hoy = dayjs())=>{
  const mesCuota = dayjs(new Date(meta.anio, meta.mes - 1, 1))
  if (mesCuota.isBefore(hoy, 'month')) return 0
  if (mesCuota.isAfter(hoy, 'month')) return mesCuota.daysInMonth()
  return mesCuota.daysInMonth() - hoy.date() + 1
}

// Orden del reporte: hoy, luego las proximas (de la mas cercana a la mas lejana) y al final las anteriores (de la mas reciente a la mas antigua)
const ordenarTareas = (tareas)=>{
  const hoy = dayjs().format('YYYY-MM-DD')
  const grupoDe = (t)=>{
    const fecha = dayjs(t.fecha).format('YYYY-MM-DD')
    return fecha === hoy ? 0 : fecha > hoy ? 1 : 2
  }
  return [...tareas].sort((a, b)=>{
    const grupoA = grupoDe(a)
    const diferencia = dayjs(a.fecha).valueOf() - dayjs(b.fecha).valueOf()
    return grupoA - grupoDe(b) || (grupoA === 2 ? -diferencia : diferencia)
  })
}

// Columna TIEMPO: nombre del dia si esta cerca de hoy; si no, HACE [n] DIAS o DENTRO DE [n] DIAS
const ETIQUETAS_TIEMPO = { '-2': 'ANTEAYER', '-1': 'AYER', 0: 'HOY', 1: 'MAÑANA', 2: 'PASADO MAÑANA' }
const diasDesdeHoy = (t)=>dayjs(t.fecha).startOf('day').diff(dayjs().startOf('day'), 'day')
const etiquetaTiempo = (t)=>{
  const dias = diasDesdeHoy(t)
  return ETIQUETAS_TIEMPO[dias] ?? (dias < 0 ? `HACE ${-dias} DÍAS` : `DENTRO DE ${dias} DÍAS`)
}

// Columnas de la tabla: valor es lo que se compara al ordenar con las flechas
const COLUMNAS_TAREAS = [
  { key: 'fecha', titulo: 'FECHA', valor: (t)=>t.fecha ? dayjs(t.fecha).valueOf() : null },
  // ordena por dias, no por el texto: de lo mas antiguo a lo mas lejano
  { key: 'tiempo', titulo: 'TIEMPO', valor: (t)=>t.fecha ? diasDesdeHoy(t) : null },
  { key: 'prospecto', titulo: 'PROSPECTO', valor: (t)=>`${t.prospecto.nombres ?? ''} ${t.prospecto.apellidos ?? ''}`.trim() },
  { key: 'celular', titulo: 'CELULAR', valor: (t)=>t.prospecto.celular },
  { key: 'status', titulo: 'STATUS', valor: (t)=>t.prospecto.parametro_estado?.label_param },
  { key: 'tarea', titulo: 'TAREA', valor: (t)=>t.id_tarea === null ? null : arrayTareasComercial.find(e=>e.value===t.id_tarea)?.label ?? `Tarea ${t.id_tarea}` },
  { key: 'observacion', titulo: 'OBSERVACION', valor: (t)=>t.observacion },
]
// orden: {key, direccion: 'asc' | 'desc'}; sin orden queda el predeterminado. Los vacios siempre van al final
const aplicarOrdenColumna = (tareas, orden)=>{
  const columna = COLUMNAS_TAREAS.find(c=>c.key === orden?.key)
  if (!columna) return tareas
  const signo = orden.direccion === 'asc' ? 1 : -1
  const vacio = (v)=>v === null || v === undefined || String(v).trim() === ''
  return [...tareas].sort((a, b)=>{
    const va = columna.valor(a)
    const vb = columna.valor(b)
    if (vacio(va) || vacio(vb)) return vacio(va) - vacio(vb)
    return signo * (typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb), 'es', {numeric: true, sensitivity: 'base'}))
  })
}
// Cada clic en una columna: ascendente, descendente y de vuelta al orden predeterminado
const siguienteOrden = (orden, key)=>{
  if (orden?.key !== key) return {key, direccion: 'asc'}
  return orden.direccion === 'asc' ? {key, direccion: 'desc'} : null
}

const ANIO_INICIAL = 2024
const ID_ESTADO_CONVERTIDO = 1673
// mes de 1 a 12, en hora local como la columna FECHA
const filtrarPorMes = (registros, mes, anio, campoFecha = 'fecha')=>registros.filter(r=>{
  const fecha = dayjs(r[campoFecha])
  return fecha.month() + 1 === mes && fecha.year() === anio
})
// Un mismo cliente puede estar registrado como varios prospectos: queda uno por cliente (y uno por id).
// Se prefiere el CONVERTIDO y, entre iguales, el registro mas reciente. Sin cliente vinculado no se puede agrupar
const unicosPorCliente = (leads)=>{
  const convertido = (p)=>p.parametro_estado?.id_param === ID_ESTADO_CONVERTIDO
  const mejor = (a, b)=>convertido(a) !== convertido(b) ? (convertido(a) ? a : b) : (dayjs(a.fecha_registro).isBefore(b.fecha_registro) ? b : a)
  const elegidos = new Map()
  for (const p of leads) {
    const clave = p.id_cli ? `cli-${p.id_cli}` : `id-${p.id}`
    const previo = elegidos.get(clave)
    elegidos.set(clave, previo ? mejor(previo, p) : p)
  }
  return [...elegidos.values()]
}
// Leads registrados en el mes (sin repetir cliente) y cuantos de ellos hoy tienen status CONVERTIDO; un mes sin leads da 0.0%
const resumenConversion = (prospectos, mes, anio)=>{
  const leadsDelMes = unicosPorCliente(filtrarPorMes(prospectos, mes, anio, 'fecha_registro'))
  const convertidos = leadsDelMes.filter(p=>p.parametro_estado?.id_param === ID_ESTADO_CONVERTIDO)
  const porcentaje = leadsDelMes.length === 0 ? '0.0' : ((convertidos.length / leadsDelMes.length) * 100).toFixed(1)
  return { prospectos: leadsDelMes.length, convertidos: convertidos.length, porcentaje, leadsDelMes, leadsConvertidos: convertidos }
}
// id_cli -> DNI. El DNI sale del label de los clientes: "DNI | NOMBRE"
const mapearDniPorCliente = (clientes)=>new Map(clientes.map(c=>[c.value, String(c.label ?? '').split('|')[0].trim()]))
// Un lead sin cliente vinculado o sin DNI no se puede buscar en el huellero: cuenta como sin huella
const leadsSinHuella = (leads, dniPorCliente, pines)=>leads.filter(l=>{
  const dni = dniPorCliente.get(l.id_cli)
  return !(Boolean(dni) && dniTieneHuella(pines, dni))
})
// Un lead sin cliente vinculado o sin membresia no tiene contrato firmado: cuenta como sin contrato (CANJE no cuenta)
const leadsSinContrato = (leads, contratosPorCliente)=>leads.filter(l=>!['CON CONTRATO', 'CANJE'].includes(contratosPorCliente.get(l.id_cli)))
// Un lead sin cliente vinculado o sin ventas no se puede verificar: cuenta como sin foto
const leadsSinFoto = (leads, clientesConFoto)=>leads.filter(l=>!clientesConFoto.has(l.id_cli))

// Al ver leads en la tabla, cada lead es una fila con su ultima tarea (cualquier fecha); sin tareas, las columnas de tarea quedan vacias
const filasDeLeads = (leads, tareas)=>{
  const ultimaTarea = new Map()
  for (const t of tareas) {
    const previa = ultimaTarea.get(t.id_prospecto)
    if (!previa || dayjs(t.fecha).isAfter(previa.fecha)) ultimaTarea.set(t.id_prospecto, t)
  }
  return leads.map(p=>{
    const t = ultimaTarea.get(p.id)
    return { id: `lead-${p.id}`, fecha: t?.fecha ?? null, id_tarea: t?.id_tarea ?? null, observacion: t?.observacion ?? '', prospecto: p }
  })
}

// Rango de fechas (YYYY-MM-DD, ambos incluidos); un extremo vacio no limita
const filtrarPorRango = (tareas, desde, hasta)=>tareas.filter(t=>{
  const fecha = dayjs(t.fecha).format('YYYY-MM-DD')
  return (!desde || fecha >= desde) && (!hasta || fecha <= hasta)
})

// Se ve como texto; al hacer click muestra las opciones. opciones: [{value, label}]
export const SelectorTexto = ({id, valor, opciones, onChange})=>(
  <Dropdown onSelect={(key)=>onChange(Number(key))}>
    <Dropdown.Toggle id={id} variant='link' className='fw-bold text-primary text-decoration-none p-0 border-0' style={{fontSize: '2.25rem'}}>
      {opciones.find(o=>o.value===valor)?.label}
    </Dropdown.Toggle>
    <Dropdown.Menu>
      {opciones.map(o=><Dropdown.Item key={o.value} eventKey={o.value} active={o.value===valor}>{o.label}</Dropdown.Item>)}
    </Dropdown.Menu>
  </Dropdown>
)

// Comentarios CRM del mes (ya filtrados por el backend) de los prospectos del asesor y de sus socios vinculados
const TablaComentarios = ({prospectos, comentarios})=>{
  const filas = useMemo(()=>{
    if (comentarios === null) return null
    const ids = new Set(prospectos.map(p=>p.id))
    return comentarios.filter(c=>ids.has(c.id_prospecto))
  }, [prospectos, comentarios])
  if (filas === null) return <div className='text-center py-4'><Spinner animation='border'/></div>
  if (filas.length === 0) return <div className='text-center text-muted py-4'>NO HAY COMENTARIOS EN ESTE MES</div>
  return (
    <Table responsive striped hover size='sm' className='mb-0'>
      <thead>
        <tr>
          <th className='bg-change text-white text-nowrap'>FECHA</th>
          <th className='bg-change text-white text-nowrap'>COMENTARIO</th>
          <th className='bg-change text-white text-nowrap'>PROSPECTO O SOCIO</th>
        </tr>
      </thead>
      <tbody>
        {
          filas.map(c=>{
            const nombre = `${c.nombres ?? ''} ${c.apellidos ?? ''}`.trim()
            return (
              <tr key={`${c.origen}-${c.id_comentario}-${c.id_prospecto}`}>
                <td className='text-nowrap'>{dayjs(c.fec_registro).format('dddd DD [DE] MMMM [DEL] YYYY [A LAS] hh:mm A')}<div className='text-muted'>{c.nombres_apellidos_user}</div></td>
                <td><div style={{minWidth: '250px', whiteSpace: 'pre-wrap'}}>{c.comentario_com}</div></td>
                <td className='text-nowrap'><span className={`fw-bold ${c.origen === 'SOCIO' ? 'text-ISESAC' : 'text-primary'}`}>{c.origen}</span>: {c.origen === 'SOCIO' ? `${nombre} (CLI${c.id_cli})` : nombre}</td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
  )
}

export const ModalReporteTareas = ({show, onHide}) => {
  const { obtenerTareasReporte, dataTareasReporte, isLoadingTareasReporte, obtenerUltimasMetasAsesores, dataUltimasMetas, obtenerVentasSemanaxAsesor, ventasSemanaxAsesor, obtenerComentariosCRM, comentariosCRM, obtenerPinesConHuella, pinesConHuella, obtenerClientes, dataClientes, obtenerContratosPorCliente, contratosPorCliente, obtenerClientesConFoto, clientesConFoto } = useGestionComercialStore()
  const {dataView} = useSelector(e=>e.COMERCIAL)
  const dniPorCliente = useMemo(()=>mapearDniPorCliente(dataClientes), [dataClientes])
  const huellasListas = pinesConHuella !== null && dataClientes.length > 0
  // Click en un card filtra la tabla por ese tipo de tarea; otro click lo quita
  const [filtroTarea, setfiltroTarea] = useState(null)
  // Click en un numero de leads (prospectos, convertidos, sin contrato/huella/foto) muestra esos leads en la tabla; otro click lo quita
  const [filtroLeads, setfiltroLeads] = useState(null)
  const elegirFiltroTarea = (valor)=>{ setfiltroTarea(valor); setfiltroLeads(null); setvistaAsesor(0) }
  const elegirFiltroLeads = (key)=>{ setfiltroLeads(filtroLeads === key ? null : key); setfiltroTarea(null); setvistaAsesor(0) }
  const quitarFiltros = ()=>{ setfiltroTarea(null); setfiltroLeads(null) }
  const [tabActivo, settabActivo] = useState(0)
  // Dentro de cada asesor: 0 = TAREAS, 1 = COMENTARIOS
  const [vistaAsesor, setvistaAsesor] = useState(0)
  // Comentarios del prospecto de la fila (y los del cliente vinculado), como en la tabla principal
  const [comentario, setcomentario] = useState({show: false, uid: '', id_cli: null})
  const [ordenColumna, setordenColumna] = useState(null)
  // Rango de la tabla, dentro del mes elegido; vacio muestra todo el mes
  const [fechaDesde, setfechaDesde] = useState('')
  const [fechaHasta, setfechaHasta] = useState('')
  const hayRango = Boolean(fechaDesde || fechaHasta)
  const quitarRango = ()=>{
    setfechaDesde('')
    setfechaHasta('')
  }
  const [mes, setmes] = useState(()=>dayjs().month() + 1)
  const [anio, setanio] = useState(()=>dayjs().year())
  const inicioMes = dayjs(new Date(anio, mes - 1, 1)).format('YYYY-MM-DD')
  const finMes = dayjs(new Date(anio, mes - 1, 1)).endOf('month').format('YYYY-MM-DD')
  const anios = Array.from({length: dayjs().year() - ANIO_INICIAL + 1}, (_, i)=>ANIO_INICIAL + i)
  useEffect(() => {
    if (show) {
      obtenerTareasReporte()
      obtenerPinesConHuella()
      obtenerClientes()
      obtenerContratosPorCliente()
      obtenerClientesConFoto()
      quitarFiltros()
      settabActivo(0)
      setvistaAsesor(0)
      setordenColumna(null)
      quitarRango()
      setmes(dayjs().month() + 1)
      setanio(dayjs().year())
    }
  }, [show])
  // Cuota, timing y alcance son los del mes elegido
  useEffect(() => {
    if (show) {
      obtenerUltimasMetasAsesores(mes, anio)
      // Tab COMENTARIOS: una sola consulta con los comentarios CRM del mes de todos los asesores
      obtenerComentariosCRM(mes, anio)
    }
  }, [show, mes, anio])
  // Avance semanal: membresias vendidas por cada asesor en la semana (bloque de 7 dias) del mes elegido
  const semana = useMemo(()=>semanaDelMes(mes, anio), [mes, anio, show])
  useEffect(() => {
    if (show) obtenerVentasSemanaxAsesor(semana.desde, semana.hasta)
  }, [show, semana.desde, semana.hasta])

  // Un tab por asesor que tiene prospectos; cada tarea va al asesor que la registro (id_empl de la tarea).
  // Tareas antiguas sin id_empl: van al asesor de su prospecto
  const asesores = useMemo(() => {
    const prospectosxId = new Map((dataView ?? []).map(p=>[p.id, p]))
    const grupos = new Map()
    for (const p of dataView ?? []) {
      if (!p.id_empl) continue
      if (!grupos.has(p.id_empl)) grupos.set(p.id_empl, {id_empl: p.id_empl, nombre: p.empleado?.nombres_apellidos_empl ?? `ASESOR ${p.id_empl}`, prospectos: [], tareas: []})
      grupos.get(p.id_empl).prospectos.push(p)
    }
    for (const t of dataTareasReporte) {
      const prospecto = prospectosxId.get(t.id_prospecto)
      if (!prospecto) continue
      const id_empl = t.id_empl ?? prospecto.id_empl
      if (!grupos.has(id_empl)) continue
      grupos.get(id_empl).tareas.push({...t, prospecto})
    }
    return [...grupos.values()]
      .map(g=>({...g, tareas: ordenarTareas(g.tareas)}))
      .sort((a, b)=>b.prospectos.length - a.prospectos.length)
  }, [dataView, dataTareasReporte])

  return (
    <Modal show={show} onHide={onHide} fullscreen>
        <Modal.Header closeButton>
            <Modal.Title>REPORTE DE TAREAS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='d-flex align-items-center gap-3 flex-wrap mb-3'>
                <SelectorTexto id='reporteTareasMes' valor={mes} onChange={(valor)=>{setmes(valor); quitarRango(); setfiltroLeads(null)}} opciones={MESES.map((nombre, i)=>({value: i + 1, label: nombre}))}/>
                <SelectorTexto id='reporteTareasAnio' valor={anio} onChange={(valor)=>{setanio(valor); quitarRango(); setfiltroLeads(null)}} opciones={anios.map(a=>({value: a, label: a}))}/>
            </div>
            {
                isLoadingTareasReporte ? (
                    <div className='text-center py-4'><Spinner animation='border'/></div>
                ) : asesores.length === 0 ? (
                    <div className='text-center text-muted py-4'>NO HAY ASESORES CON PROSPECTOS</div>
                ) : (
                    <TabView scrollable activeIndex={tabActivo} onTabChange={(e)=>{settabActivo(e.index); quitarFiltros()}}>
                        {
                            asesores.map((a, indice)=>{
                                const tareasDelMes = filtrarPorMes(a.tareas, mes, anio)
                                const tipoFiltro = arrayTareasComercial.find(e=>e.value===filtroTarea)
                                const ultimaMeta = dataUltimasMetas.find(m=>m.id_asesor===a.id_empl)
                                const timing = ultimaMeta && calcularTiming(ultimaMeta)
                                const conversion = resumenConversion(a.prospectos, mes, anio)
                                const sinHuella = huellasListas ? leadsSinHuella(conversion.leadsConvertidos, dniPorCliente, pinesConHuella) : null
                                const sinContrato = contratosPorCliente ? leadsSinContrato(conversion.leadsConvertidos, contratosPorCliente) : null
                                const sinFoto = clientesConFoto ? leadsSinFoto(conversion.leadsConvertidos, clientesConFoto) : null
                                // Grupos de leads que se pueden ver en la tabla al hacer click en su numero
                                const gruposLeads = {
                                    prospectos: { titulo: 'PROSPECTOS DEL MES', leads: conversion.leadsDelMes },
                                    convertidos: { titulo: 'CONVERTIDOS', leads: conversion.leadsConvertidos },
                                    sinContrato: { titulo: 'CONVERTIDOS SIN CONTRATO', leads: sinContrato },
                                    sinHuella: { titulo: 'CONVERTIDOS SIN HUELLA', leads: sinHuella },
                                    sinFoto: { titulo: 'CONVERTIDOS SIN FOTO', leads: sinFoto },
                                }
                                const grupoLeads = filtroLeads && gruposLeads[filtroLeads]
                                const filasTabla = grupoLeads
                                    ? filasDeLeads(grupoLeads.leads ?? [], a.tareas)
                                    : filtrarPorRango(tareasDelMes, fechaDesde, fechaHasta).filter(t=>!filtroTarea || t.id_tarea===filtroTarea)
                                const tareasFiltradas = aplicarOrdenColumna(filasTabla, ordenColumna)
                                // Numero clickeable; subrayado cuando es el que esta mostrando la tabla
                                const NumeroLeads = ({grupo, className})=>(
                                    <span
                                        className={`${className} cursor-pointer ${filtroLeads === grupo ? 'text-decoration-underline' : ''}`}
                                        title='Click para ver en la tabla'
                                        onClick={()=>gruposLeads[grupo].leads && elegirFiltroLeads(grupo)}
                                    >
                                        {gruposLeads[grupo].leads?.length ?? '...'}
                                    </span>
                                )
                                const contenidoTareas = (
                                    <>
                                        {
                                            (tipoFiltro || grupoLeads) && (
                                                <div className='mb-2'>
                                                    {grupoLeads ? 'VIENDO: ' : 'FILTRANDO POR: '}<strong>{grupoLeads ? `${grupoLeads.titulo} (ÚLTIMA TAREA DE CADA UNO)` : tipoFiltro.label.toUpperCase()}</strong>
                                                    <span className='ms-2 text-primary text-decoration-underline cursor-pointer' onClick={quitarFiltros}>VER TODAS LAS TAREAS</span>
                                                </div>
                                            )
                                        }
                                        <div className={`d-flex align-items-end gap-2 flex-wrap mb-2 ${grupoLeads ? 'd-none' : ''}`}>
                                            <Form.Group controlId={`reporteTareasDesde${a.id_empl}`}>
                                                <Form.Label className='fw-bold mb-1'>DESDE</Form.Label>
                                                <Form.Control type='date' value={fechaDesde} min={inicioMes} max={fechaHasta || finMes} onChange={(e)=>setfechaDesde(e.target.value)}/>
                                            </Form.Group>
                                            <Form.Group controlId={`reporteTareasHasta${a.id_empl}`}>
                                                <Form.Label className='fw-bold mb-1'>HASTA</Form.Label>
                                                <Form.Control type='date' value={fechaHasta} min={fechaDesde || inicioMes} max={finMes} onChange={(e)=>setfechaHasta(e.target.value)}/>
                                            </Form.Group>
                                            {hayRango && <Button variant='link' onClick={quitarRango}>Toda las tareas</Button>}
                                        </div>
                                        {
                                            tareasFiltradas.length === 0 ? (
                                                <div className='text-center text-muted py-4'>{grupoLeads ? 'NO HAY LEADS EN ESTE GRUPO' : `NO HAY TAREAS ${tipoFiltro ? 'DE ESTE TIPO ' : ''}${hayRango ? 'EN ESTE RANGO DE FECHAS' : 'EN ESTE MES'}`}</div>
                                            ) : (
                                                <Table responsive striped hover size='sm' className='mb-0'>
                                                    <thead>
                                                        <tr>
                                                            {
                                                                COLUMNAS_TAREAS.map(c=>(
                                                                    <th
                                                                        key={c.key}
                                                                        className='bg-change text-white cursor-pointer text-nowrap user-select-none'
                                                                        title='Click para ordenar'
                                                                        aria-sort={ordenColumna?.key === c.key ? (ordenColumna.direccion === 'asc' ? 'ascending' : 'descending') : 'none'}
                                                                        onClick={()=>setordenColumna(siguienteOrden(ordenColumna, c.key))}
                                                                    >
                                                                        {c.titulo} <small>{ordenColumna?.key === c.key ? (ordenColumna.direccion === 'asc' ? '▲' : '▼') : '▲▼'}</small>
                                                                    </th>
                                                                ))
                                                            }
                                                            <th className='bg-change text-white text-nowrap'>COMENTARIOS</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            tareasFiltradas.map(t=>{
                                                                const tipo = arrayTareasComercial.find(e=>e.value===t.id_tarea)
                                                                return (
                                                                    <tr key={t.id}>
                                                                        <td className='text-nowrap'>{t.fecha ? dayjs(t.fecha).format('dddd DD [DE] MMMM [DEL] YYYY [A LAS] hh:mm A') : ''}</td>
                                                                        <td className='text-nowrap fw-bold'>{t.fecha ? etiquetaTiempo(t) : ''}</td>
                                                                        <td>{`${t.prospecto.nombres ?? ''} ${t.prospecto.apellidos ?? ''}`}</td>
                                                                        <td>{t.prospecto.celular}</td>
                                                                        <td>{t.prospecto.parametro_estado?.label_param}</td>
                                                                        <td className='text-nowrap'><div className={tipo?.exito ? 'text-ISESAC' : ''}>{t.id_tarea === null ? <span className='text-muted'>SIN TAREAS</span> : <>{tipo && <i className={`${tipo.icon} me-1`}></i>}{tipo?.label ?? `Tarea ${t.id_tarea}`}</>}</div></td>
                                                                        <td> <div className='' style={{width: '180px'}}>{t.observacion}</div></td>
                                                                        <td className='text-center'>
                                                                            <BotonIcono icon='pi pi-comment' rounded outlined severity='danger' onClick={()=>setcomentario({show: true, uid: t.prospecto.uid_comentario ?? '', id_cli: t.prospecto.id_cli ?? null})}/>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </Table>
                                            )
                                        }
                                    </>
                                )
                                return (
                                    <TabPanel key={a.id_empl} header={<span className={indice === tabActivo ? '' : 'text-black'}>{`${a.nombre.trim().split(' ')[0]} (${conversion.porcentaje}%)`}</span>}>
                                        <Row className='g-2 mb-3'>
                                            <Col xs={12} sm={6} lg={4} xl={2}>
                                                <Card className='shadow-sm h-100 mb-0 p-0 m-0'>
                                                    <Card.Body className='py-2'>
                                                        <div className='fs-2 text-black'>CUOTA MES</div>
                                                        {
                                                            ultimaMeta ? (
                                                                <>
                                                                    <div className='text-primary fw-bold fs-3'><SymbolSoles classN={'text-ISESAC'} numero={<NumberFormatMoney className='text-ISESAC fs-2' amount={ultimaMeta.meta_asesor}/>}/> </div>
                                                                    <div className='fs-2 text-black mt-1'>CUOTA SEMANAL</div>
                                                                    <div className='text-primary fw-bold fs-3'><SymbolSoles classN={'text-ISESAC'} numero={<NumberFormatMoney className='text-ISESAC fs-2' amount={ultimaMeta.meta_asesor / 4}/>}/> </div>
                                                                </>
                                                            ) : (
                                                                <div className='text-black py-2'>SIN CUOTA EN ESTE MES</div>
                                                            )
                                                        }
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            {
                                                timing && (
                                                    <Col xs={12} sm={6} lg={4} xl={2}>
                                                        <Card className='shadow-sm h-100 mb-0'>
                                                            <Card.Body className='py-2'>
                                                                <div className='fs-2 text-black'>AVANCE FECHA</div>
                                                                <div className='text-primary fw-bold fs-3'></div>
                                                                <div className='text-black fw-bold fs-3'>VAS: <span className='mr-2'><SymbolSoles classN={'text-ISESAC'} numero={<NumberFormatMoney className='text-ISESAC fs-3' amount={ultimaMeta.monto_vendido}/>}/></span></div>
                                                                {
                                                                    ultimaMeta.monto_vendido >= ultimaMeta.meta_asesor ? (
                                                                        <div className='fs-3 text-ISESAC'>¡CUOTA CUMPLIDA!</div>
                                                                    ) : (
                                                                        <div className='fs-3'>FALTAN: <SymbolSoles classN={'text-change'} numero={<NumberFormatMoney className='text-change fs-3' amount={timing.timing-ultimaMeta.monto_vendido}/>}/></div>
                                                                    )
                                                                }
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                )
                                            }
                                            {
                                                ultimaMeta && (()=>{
                                                    // Misma cuota semanal que se muestra bajo CUOTA MES: cuota del mes / 4 semanas. FALTAN = cuota semanal - vendido en la semana
                                                    const cuotaSemana = ultimaMeta.meta_asesor / 4
                                                    const vendidoSemana = ventasSemanaxAsesor?.[a.id_empl] ?? 0
                                                    return (
                                                        <Col xs={12} sm={6} lg={4} xl={2}>
                                                            <Card className='shadow-sm h-100 mb-0'>
                                                                <Card.Body className='py-2'>
                                                                    <div className='fs-2 text-black'>AVANCE SEMANAL</div>
                                                                    <div className='text-black fs-4'>SEMANA {semana.numero}: DEL {dayjs(semana.desde).format('DD')} AL {dayjs(semana.hasta).format('DD')} </div>
                                                                    {/* <div className='text-black fs-4'>{semana.diasQuedan === 0 ? 'SEMANA CERRADA' : `QUEDAN ${semana.diasQuedan} ${semana.diasQuedan === 1 ? 'DÍA' : 'DÍAS'} (CON HOY)`}</div> */}
                                                                    {
                                                                        ventasSemanaxAsesor === null ? (
                                                                            <div className='py-2'><Spinner animation='border' size='sm'/></div>
                                                                        ) : (
                                                                            <>
                                                                                <div className='text-black fw-bold fs-3'>VAS: <span className='mr-2'><SymbolSoles classN={'text-ISESAC'} numero={<NumberFormatMoney className='text-ISESAC fs-3' amount={vendidoSemana}/>}/></span></div>
                                                                                {
                                                                                    vendidoSemana >= cuotaSemana ? (
                                                                                        <div className='fs-3 text-ISESAC'>¡CUOTA SEMANAL CUMPLIDA!</div>
                                                                                    ) : (
                                                                                        <div className='fs-3'>FALTAN: <SymbolSoles classN={'text-change'} numero={<NumberFormatMoney className='text-change fs-3' amount={cuotaSemana - vendidoSemana}/>}/></div>
                                                                                    )
                                                                                }
                                                                            </>
                                                                        )
                                                                    }
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    )
                                                })()
                                            }
                                            {
                                                ultimaMeta && (()=>{
                                                    const alcance = (ultimaMeta.monto_vendido / ultimaMeta.meta_asesor) * 100
                                                    const diasFaltan = diasFaltanMes(ultimaMeta)
                                                    return (
                                                        <>
                                                        <Col xs={12} sm={6} lg={4} xl={2}>
                                                            <Card className='shadow-sm h-100 mb-0'>
                                                                <Card.Body className='py-2'>
                                                                    <div className='fs-2 text-black'>AVANCE CUOTA</div>
                                                                    <div className='text-black fw-bold fs-3'>VAS: <SymbolSoles classN={'text-ISESAC'} numero={<NumberFormatMoney className='text-ISESAC fs-3' amount={ultimaMeta.monto_vendido}/>}/></div>
                                                                    {
                                                                        alcance >= 100 ? (
                                                                            <div className='fs-3 text-ISESAC'>¡CUOTA CUMPLIDA!</div>
                                                                        ) : (
                                                                            <div className='fs-3'>FALTAN: <SymbolSoles classN={'text-change'} numero={<NumberFormatMoney className='text-change fs-3' amount={ultimaMeta.meta_asesor - ultimaMeta.monto_vendido}/>}/></div>
                                                                        )
                                                                    }
                                                                    <div className='fs-4'>{alcance.toFixed(2)}% de la CUOTA</div>
                                                                    <ProgressBar now={Math.min(alcance, 100)} variant={alcance >= 90 ? 'success' : alcance >= 50 ? 'warning' : 'primary'} className='mt-1' style={{height: 6}}/>
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                        <Col xs={12} sm={6} lg={4} xl={2}>
                                                            <Card className='shadow-sm h-100 mb-0'>
                                                                <Card.Body className='py-2'>
                                                                    <div className='fs-2 text-black'>VENTA DIARIA APROXIMADA</div>
                                                                    {
                                                                        alcance >= 100 ? (
                                                                            <div className='fs-3 text-ISESAC'>¡CUOTA CUMPLIDA!</div>
                                                                        ) : diasFaltan === 0 ? (
                                                                            <div className='fs-3 text-black'>MES CERRADO</div>
                                                                        ) : (
                                                                            <>
                                                                                <div className='fw-bold fs-3'><SymbolSoles classN={'text-orange'} numero={<NumberFormatMoney className='text-orange fs-2' amount={(ultimaMeta.meta_asesor - ultimaMeta.monto_vendido) / diasFaltan}/>}/></div>
                                                                                <div className='fs-4'>POR DÍA, FALTAN {diasFaltan} {diasFaltan === 1 ? 'DÍA' : 'DÍAS'}</div>
                                                                            </>
                                                                        )
                                                                    }
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                        </>
                                                    )
                                                })()
                                            }
                                            <Col xs={12} sm={6} lg={4} xl={2}>
                                                <Card className='shadow-sm h-100 mb-0'>
                                                    <Card.Body className='py-2'>
                                                        <div className='fs-2 text-black'>LEADS DEL MES</div>
                                                        <div className='fw-bold fs-3'>PROSPECTOS: <NumeroLeads grupo='prospectos' className='text-primary'/></div>
                                                        <div className='fw-bold fs-3'>CONVERTIDOS: <NumeroLeads grupo='convertidos' className='text-ISESAC'/></div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            {/* <Col xs={12} sm={6} lg={4} xl={2}>
                                                <Card className='shadow-sm h-100 mb-0'>
                                                    <Card.Body className='py-2'>
                                                        <div className='fs-2 text-muted'>HUELLAS</div>
                                                        <div className='fw-bold fs-3'>CON HUELLA: <span className='text-ISESAC'>{huellas?.conHuella ?? '...'}</span></div>
                                                        <div className='fw-bold fs-3'>SIN HUELLA: <span className='text-change'>{huellas?.sinHuella ?? '...'}</span></div>
                                                    </Card.Body>
                                                </Card>
                                            </Col> */}
                                            <Col xs={12} sm={6} lg={4} xl={2}>
                                                <Card className='shadow-sm h-100 mb-0'>
                                                    <Card.Body className='py-2'>
                                                        <div className='fs-2 text-black'>CONTRATO</div>
                                                        <div className='fw-bold fs-3'>SIN: <NumeroLeads grupo='sinContrato' className='text-change'/></div>
                                                        <div className='fs-2 text-black'>HUELLA</div>
                                                        <div className='fw-bold fs-3'>SIN: <NumeroLeads grupo='sinHuella' className='text-change'/></div>
                                                        <div className='fs-2 text-black'>FOTO</div>
                                                        <div className='fw-bold fs-3'>SIN: <NumeroLeads grupo='sinFoto' className='text-change'/></div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row className='g-2 mb-3'>
                                            {
                                                arrayTareasComercial.map(tipo=>(
                                                    <Col xs={6} md={3} lg xl={2} key={tipo.value}>
                                                        <ResumenItem label={tipo.label.toUpperCase()} valor={tareasDelMes.filter(t=>t.id_tarea===tipo.value).length} icon={tipo.icon} exito={tipo.exito} activo={filtroTarea===tipo.value} onClick={()=>elegirFiltroTarea(filtroTarea===tipo.value ? null : tipo.value)}/>
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                        {
                                            // Al ver un grupo de leads (click en un numero) se muestra solo la tabla, sin los tabs TAREAS / COMENTARIOS
                                            grupoLeads ? contenidoTareas : (
                                                <TabView activeIndex={vistaAsesor} onTabChange={(e)=>setvistaAsesor(e.index)}>
                                                    <TabPanel header='TAREAS'>{contenidoTareas}</TabPanel>
                                                    <TabPanel header='COMENTARIOS'>
                                                        <TablaComentarios prospectos={a.prospectos} comentarios={comentariosCRM}/>
                                                    </TabPanel>
                                                </TabView>
                                            )
                                        }
                                    </TabPanel>
                                )
                            })
                        }
                    </TabView>
                )
            }
        </Modal.Body>
        <ModalComentario show={comentario.show} onHide={()=>setcomentario({show: false, uid: '', id_cli: null})} uid_comentario={comentario.uid} id_cli={comentario.id_cli} encima/>
    </Modal>
  )
}

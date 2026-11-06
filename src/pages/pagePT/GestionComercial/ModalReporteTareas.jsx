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

// El numero va debajo del card (fuera), para que todos queden alineados aunque el texto ocupe 2 lineas
const ResumenItem = ({label, valor, icon, activo, exito, onClick})=>(
  <div className='d-flex flex-column h-100 cursor-pointer' onClick={onClick}>
    <Card className={`shadow-sm flex-grow-1 mb-1 ${activo ? 'bg-primary text-white' : ''}`}>
      <Card.Body className='py-2 text-center d-flex flex-column justify-content-center'>
        {icon && <i className={`${icon} fs-4 mb-1`}></i>}
        <div className={`small ${activo ? '' : 'text-muted'}`}>{label}</div>
      </Card.Body>
    </Card>
    <div className={`fw-bold fs-3 text-center ${exito ? 'text-ISESAC' : ''}`}>{valor}</div>
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
  { key: 'fecha', titulo: 'FECHA', valor: (t)=>dayjs(t.fecha).valueOf() },
  // ordena por dias, no por el texto: de lo mas antiguo a lo mas lejano
  { key: 'tiempo', titulo: 'TIEMPO', valor: (t)=>diasDesdeHoy(t) },
  { key: 'prospecto', titulo: 'PROSPECTO', valor: (t)=>`${t.prospecto.nombres ?? ''} ${t.prospecto.apellidos ?? ''}`.trim() },
  { key: 'celular', titulo: 'CELULAR', valor: (t)=>t.prospecto.celular },
  { key: 'status', titulo: 'STATUS', valor: (t)=>t.prospecto.parametro_estado?.label_param },
  { key: 'tarea', titulo: 'TAREA', valor: (t)=>arrayTareasComercial.find(e=>e.value===t.id_tarea)?.label ?? `Tarea ${t.id_tarea}` },
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
// mes de 1 a 12, en hora local como la columna FECHA
const filtrarPorMes = (tareas, mes, anio)=>tareas.filter(t=>{
  const fecha = dayjs(t.fecha)
  return fecha.month() + 1 === mes && fecha.year() === anio
})

// Rango de fechas (YYYY-MM-DD, ambos incluidos); un extremo vacio no limita
const filtrarPorRango = (tareas, desde, hasta)=>tareas.filter(t=>{
  const fecha = dayjs(t.fecha).format('YYYY-MM-DD')
  return (!desde || fecha >= desde) && (!hasta || fecha <= hasta)
})

// Se ve como texto; al hacer click muestra las opciones. opciones: [{value, label}]
const SelectorTexto = ({id, valor, opciones, onChange})=>(
  <Dropdown onSelect={(key)=>onChange(Number(key))}>
    <Dropdown.Toggle id={id} variant='link' className='fw-bold text-primary text-decoration-none p-0 border-0' style={{fontSize: '2.25rem'}}>
      {opciones.find(o=>o.value===valor)?.label}
    </Dropdown.Toggle>
    <Dropdown.Menu>
      {opciones.map(o=><Dropdown.Item key={o.value} eventKey={o.value} active={o.value===valor}>{o.label}</Dropdown.Item>)}
    </Dropdown.Menu>
  </Dropdown>
)

export const ModalReporteTareas = ({show, onHide}) => {
  const { obtenerTareasReporte, dataTareasReporte, isLoadingTareasReporte, obtenerUltimasMetasAsesores, dataUltimasMetas } = useGestionComercialStore()
  const {dataView} = useSelector(e=>e.COMERCIAL)
  // Click en un card filtra la tabla por ese tipo de tarea; otro click lo quita
  const [filtroTarea, setfiltroTarea] = useState(null)
  const [tabActivo, settabActivo] = useState(0)
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
      setfiltroTarea(null)
      settabActivo(0)
      setordenColumna(null)
      quitarRango()
      setmes(dayjs().month() + 1)
      setanio(dayjs().year())
    }
  }, [show])
  // Cuota, timing y alcance son los del mes elegido
  useEffect(() => {
    if (show) obtenerUltimasMetasAsesores(mes, anio)
  }, [show, mes, anio])

  // Un tab por asesor que tiene prospectos; cada tarea se asigna al asesor de su prospecto
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
      if (!prospecto || !grupos.has(prospecto.id_empl)) continue
      grupos.get(prospecto.id_empl).tareas.push({...t, prospecto})
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
                <SelectorTexto id='reporteTareasMes' valor={mes} onChange={(valor)=>{setmes(valor); quitarRango()}} opciones={MESES.map((nombre, i)=>({value: i + 1, label: nombre}))}/>
                <SelectorTexto id='reporteTareasAnio' valor={anio} onChange={(valor)=>{setanio(valor); quitarRango()}} opciones={anios.map(a=>({value: a, label: a}))}/>
            </div>
            {
                isLoadingTareasReporte ? (
                    <div className='text-center py-4'><Spinner animation='border'/></div>
                ) : asesores.length === 0 ? (
                    <div className='text-center text-muted py-4'>NO HAY ASESORES CON PROSPECTOS</div>
                ) : (
                    <TabView scrollable activeIndex={tabActivo} onTabChange={(e)=>{settabActivo(e.index); setfiltroTarea(null)}}>
                        {
                            asesores.map((a)=>{
                                const tareasDelMes = filtrarPorMes(a.tareas, mes, anio)
                                const tareasFiltradas = aplicarOrdenColumna(
                                    filtrarPorRango(tareasDelMes, fechaDesde, fechaHasta).filter(t=>!filtroTarea || t.id_tarea===filtroTarea),
                                    ordenColumna
                                )
                                const tipoFiltro = arrayTareasComercial.find(e=>e.value===filtroTarea)
                                const ultimaMeta = dataUltimasMetas.find(m=>m.id_asesor===a.id_empl)
                                const timing = ultimaMeta && calcularTiming(ultimaMeta)
                                return (
                                    <TabPanel key={a.id_empl} header={`${a.nombre.trim().split(' ')[0]} (${a.prospectos.length})`}>
                                        <Row className='g-2 mb-3'>
                                            <Col xs={12} sm={6} lg={4} xl={3}>
                                                <Card className='shadow-sm h-100 mb-0'>
                                                    <Card.Body className='py-2'>
                                                        <div className='fs-2 text-muted'>CUOTA MES</div>
                                                        {
                                                            ultimaMeta ? (
                                                                <>
                                                                    <div className='text-primary fw-bold fs-3'><SymbolSoles classN={'text-ISESAC'} numero={<NumberFormatMoney className='text-ISESAC fs-2' amount={ultimaMeta.meta_asesor}/>}/> </div>
                                                                </>
                                                            ) : (
                                                                <div className='text-muted py-2'>SIN CUOTA EN ESTE MES</div>
                                                            )
                                                        }
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            {
                                                timing && (
                                                    <Col xs={12} sm={6} lg={4} xl={3}>
                                                        <Card className='shadow-sm h-100 mb-0'>
                                                            <Card.Body className='py-2'>
                                                                <div className='fs-2 text-muted'>AVANCE FECHA</div>
                                                                <div className='text-primary fw-bold fs-3'></div>
                                                                <div className='text-black fw-bold fs-3'>VAS: <span className='mr-2'><SymbolSoles classN={'text-ISESAC'} numero={<NumberFormatMoney className='text-ISESAC fs-3' amount={ultimaMeta.monto_vendido}/>}/></span></div>
                                                                {
                                                                    ultimaMeta.monto_vendido >= ultimaMeta.meta_asesor ? (
                                                                        <div className='fs-3 text-change'>¡CUOTA CUMPLIDA!</div>
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
                                                    const alcance = (ultimaMeta.monto_vendido / ultimaMeta.meta_asesor) * 100
                                                    return (
                                                        <Col xs={12} sm={6} lg={4} xl={3}>
                                                            <Card className='shadow-sm h-100 mb-0'>
                                                                <Card.Body className='py-2'>
                                                                    <div className='fs-2 text-muted'>AVANCE CUOTA</div>
                                                                    <div className={`fw-bold fs-3 ${alcance >= 100 ? 'text-ISESAC' : 'text-primary'}`}><SymbolSoles numero={<NumberFormatMoney className='fs-2' amount={ultimaMeta.monto_vendido}/>}/></div>
                                                                    <div className='fs-4'>{alcance.toFixed(2)}% de la CUOTA</div>
                                                                    <ProgressBar now={Math.min(alcance, 100)} variant={alcance >= 90 ? 'success' : alcance >= 50 ? 'warning' : 'primary'} className='mt-1' style={{height: 6}}/>
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    )
                                                })()
                                            }
                                        </Row>
                                        <Row className='g-2 mb-3'>
                                            {
                                                arrayTareasComercial.map(tipo=>(
                                                    <Col xs={6} md={3} lg key={tipo.value}>
                                                        <ResumenItem label={tipo.label.toUpperCase()} valor={tareasDelMes.filter(t=>t.id_tarea===tipo.value).length} icon={tipo.icon} exito={tipo.exito} activo={filtroTarea===tipo.value} onClick={()=>setfiltroTarea(filtroTarea===tipo.value ? null : tipo.value)}/>
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                        {
                                            tipoFiltro && (
                                                <div className='mb-2'>
                                                    FILTRANDO POR: <strong>{tipoFiltro.label.toUpperCase()}</strong>
                                                    <span className='ms-2 text-primary text-decoration-underline cursor-pointer' onClick={()=>setfiltroTarea(null)}>VER TODAS</span>
                                                </div>
                                            )
                                        }
                                        <div className='d-flex align-items-end gap-2 flex-wrap mb-2'>
                                            <Form.Group controlId={`reporteTareasDesde${a.id_empl}`}>
                                                <Form.Label className='fw-bold mb-1'>DESDE</Form.Label>
                                                <Form.Control type='date' value={fechaDesde} min={inicioMes} max={fechaHasta || finMes} onChange={(e)=>setfechaDesde(e.target.value)}/>
                                            </Form.Group>
                                            <Form.Group controlId={`reporteTareasHasta${a.id_empl}`}>
                                                <Form.Label className='fw-bold mb-1'>HASTA</Form.Label>
                                                <Form.Control type='date' value={fechaHasta} min={fechaDesde || inicioMes} max={finMes} onChange={(e)=>setfechaHasta(e.target.value)}/>
                                            </Form.Group>
                                            {hayRango && <Button variant='link' onClick={quitarRango}>Quitar fechas</Button>}
                                        </div>
                                        {
                                            tareasFiltradas.length === 0 ? (
                                                <div className='text-center text-muted py-4'>{`NO HAY TAREAS ${tipoFiltro ? 'DE ESTE TIPO ' : ''}${hayRango ? 'EN ESTE RANGO DE FECHAS' : 'EN ESTE MES'}`}</div>
                                            ) : (
                                                <Table responsive striped hover size='sm' className='mb-0'>
                                                    <thead>
                                                        <tr>
                                                            {
                                                                COLUMNAS_TAREAS.map(c=>(
                                                                    <th
                                                                        key={c.key}
                                                                        className='cursor-pointer text-nowrap user-select-none'
                                                                        title='Click para ordenar'
                                                                        aria-sort={ordenColumna?.key === c.key ? (ordenColumna.direccion === 'asc' ? 'ascending' : 'descending') : 'none'}
                                                                        onClick={()=>setordenColumna(siguienteOrden(ordenColumna, c.key))}
                                                                    >
                                                                        {c.titulo} <small>{ordenColumna?.key === c.key ? (ordenColumna.direccion === 'asc' ? '▲' : '▼') : '▲▼'}</small>
                                                                    </th>
                                                                ))
                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            tareasFiltradas.map(t=>{
                                                                const tipo = arrayTareasComercial.find(e=>e.value===t.id_tarea)
                                                                return (
                                                                    <tr key={t.id}>
                                                                        <td className='text-nowrap'>{dayjs(t.fecha).format('dddd DD [DE] MMMM [DEL] YYYY [A LAS] hh:mm A')}</td>
                                                                        <td className='text-nowrap fw-bold'>{etiquetaTiempo(t)}</td>
                                                                        <td>{`${t.prospecto.nombres ?? ''} ${t.prospecto.apellidos ?? ''}`}</td>
                                                                        <td>{t.prospecto.celular}</td>
                                                                        <td>{t.prospecto.parametro_estado?.label_param}</td>
                                                                        <td className='text-nowrap'>{tipo && <i className={`${tipo.icon} me-1`}></i>}{tipo?.label ?? `Tarea ${t.id_tarea}`}</td>
                                                                        <td>{t.observacion}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </Table>
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
    </Modal>
  )
}

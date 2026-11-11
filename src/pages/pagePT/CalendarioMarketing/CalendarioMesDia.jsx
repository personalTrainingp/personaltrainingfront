import React, { useMemo, useState } from 'react'
import { Button } from 'primereact/button'
import dayjs from 'dayjs'
import { urlArchivo } from './useCalendarioMarketing'

export const MESES = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SETIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
]

const clave = (mes, dia) => `${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`

// devuelve el conjunto de "MM-DD" que cubre el evento (ignorando el año)
export const diasDelEvento = (ev) => {
  const set = new Set()
  if (!ev.fecha_inicio) return set
  let d = dayjs(ev.fecha_inicio)
  let fin = dayjs(ev.fecha_fin || ev.fecha_inicio)
  if (fin.isBefore(d)) fin = d
  for (let i = 0; i <= 366 && !d.isAfter(fin); i++) {
    set.add(clave(d.month() + 1, d.date()))
    d = d.add(1, 'day')
  }
  return set
}

export const eventoEnMesDia = (ev, mes, dia = null) => {
  const dias = ev._dias ?? diasDelEvento(ev)
  if (dia) return dias.has(clave(mes, dia))
  for (const k of dias) if (k.startsWith(`${String(mes).padStart(2, '0')}-`)) return true
  return false
}

const DIAS_SEMANA = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO']
// colores por tipo (se compara por nombre, asi no depende del id del parametro)
export const COLORES_TIPO = [
  { clave: 'CONTENIDO', label: 'CONTENIDO', descripcion: 'PUBLICACIONES DEL MES', bg: '#0d6efd', color: '#fff' },
  { clave: 'PROCESO', label: 'PROCESO', descripcion: 'PRODUCCION SIGUIENTE MES', bg: '#fd7e14', color: '#fff' },
  { clave: 'PRODUCCION', label: 'PRODUCCION', descripcion: 'GRABACIONES Y ENTREGAS', bg: '#ffc107', color: '#212529' },
  { clave: 'EVENTO', label: 'EVENTO', bg: '#198754', color: '#fff' },
]
const SIN_TIPO = { bg: '#6c757d', color: '#fff' }
const normalizar = (t = '') => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim()
export const colorTipo = (label) => COLORES_TIPO.find((c) => normalizar(label).startsWith(c.clave)) ?? SIN_TIPO
export const labelTipoEvento = (ev, dataTipos = []) => ev.tipo?.label_param ?? dataTipos.find((t) => t.value === ev.id_tipo)?.label ?? ''

// fotos del evento (imagenes de tb_image con uid_location = uid_images)
const FotosEvento = ({ imagenes = [], size = 34, max = 3 }) => {
  if (!imagenes.length) return null
  const visibles = imagenes.slice(0, max)
  const resto = imagenes.length - visibles.length
  return (
    <div className='d-flex flex-wrap gap-1 mt-1'>
      {visibles.map((img) => (
        <a
          key={img.id}
          href={urlArchivo(img)}
          target='_blank'
          rel='noreferrer'
          title={img.name_image}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={urlArchivo(img)}
            alt={img.name_image}
            className='rounded'
            style={{ width: size, height: size, objectFit: 'cover', border: '2px solid rgba(255,255,255,.8)', background: '#fff' }}
          />
        </a>
      ))}
      {resto > 0 && (
        <span
          className='rounded d-inline-flex align-items-center justify-content-center fw-bold'
          style={{ width: size, height: size, background: 'rgba(0,0,0,.25)', color: '#fff', fontSize: 12 }}
        >
          +{resto}
        </span>
      )}
    </div>
  )
}

export const BadgeTipo = ({ label }) => {
  if (!label) return null
  const c = colorTipo(label)
  return <span className='badge' style={{ background: c.bg, color: c.color }}>{label}</span>
}

// calendario mensual con columnas de lunes a domingo.
// el año solo sirve para ubicar los dias en la semana: los eventos se filtran por mes y dia
export const CalendarioMesDia = ({ eventos = [], dataTipos = [], mes, dia, onChangeMes, onChangeDia }) => {
  const [anio, setAnio] = useState(() => dayjs().year())
  const [vista, setVista] = useState('mes') // 'mes' | 'lista'
  const primerDia = dayjs(`${anio}-${String(mes).padStart(2, '0')}-01`)
  const totalDias = primerDia.daysInMonth()
  const offset = (primerDia.day() + 6) % 7 // lunes = 0
  const hoy = dayjs()

  const eventosPorDia = useMemo(() => {
    const map = {}
    for (let d = 1; d <= totalDias; d++) {
      map[d] = eventos.filter((ev) => eventoEnMesDia(ev, mes, d))
    }
    return map
  }, [eventos, mes, totalDias])

  // celdas: vacias al inicio, dias del mes, vacias al final hasta completar la semana
  const celdas = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ]
  while (celdas.length % 7) celdas.push(null)

  const cambiarMes = (delta) => {
    const nuevo = primerDia.add(delta, 'month')
    setAnio(nuevo.year())
    onChangeMes(nuevo.month() + 1)
    onChangeDia(null)
  }
  const irHoy = () => {
    setAnio(hoy.year())
    onChangeMes(hoy.month() + 1)
    onChangeDia(hoy.date())
  }

  return (
    <div className='mb-3 border rounded shadow-sm overflow-hidden bg-white'>
      <div className='d-flex flex-wrap align-items-center gap-2 p-2 border-bottom'>
        <Button icon='pi pi-chevron-left' text rounded onClick={() => cambiarMes(-1)} aria-label='Mes anterior' />
        <h4 className='m-0 text-center' style={{ minWidth: 220 }}>{MESES[mes - 1]} {anio}</h4>
        <Button icon='pi pi-chevron-right' text rounded onClick={() => cambiarMes(1)} aria-label='Mes siguiente' />
        <Button label='HOY' size='small' outlined onClick={irHoy} />
        <div className='ms-auto d-flex align-items-center gap-2'>
          {dia && (
            <Button label={`Ver todo ${MESES[mes - 1]}`} size='small' text icon='pi pi-times' onClick={() => onChangeDia(null)} />
          )}
          <div className='btn-group btn-group-sm' role='group' aria-label='Vista'>
            {[['mes', 'MES'], ['lista', 'LISTA']].map(([v, l]) => (
              <button
                key={v}
                type='button'
                className={`btn fw-bold ${vista === v ? 'bg-change text-white' : 'btn-outline-secondary'}`}
                onClick={() => setVista(v)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className='d-flex flex-wrap align-items-center gap-3 px-3 py-2 border-bottom small'>
        {COLORES_TIPO.map((c) => (
          <span key={c.clave} className='d-inline-flex align-items-center gap-1 fw-bold'>
            <span className='rounded' style={{ width: 14, height: 14, background: c.bg, display: 'inline-block' }} />
            {c.label}
            {c.descripcion && <span className='fw-normal text-muted'>- {c.descripcion}</span>}
          </span>
        ))}
      </div>
      {vista === 'lista' && (
        <ListaMes
          anio={anio}
          mes={mes}
          totalDias={totalDias}
          eventosPorDia={eventosPorDia}
          dataTipos={dataTipos}
          dia={dia}
          hoy={hoy}
          onChangeDia={onChangeDia}
        />
      )}
      {vista === 'mes' && <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 700 }}>
          <div className='bg-change text-white fw-bold text-center' style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {DIAS_SEMANA.map((d) => <div key={d} className='py-2 small'>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {celdas.map((n, i) => {
              const finDeSemana = i % 7 >= 5
              if (!n) {
                return <div key={`v${i}`} className='border-end border-bottom' style={{ minHeight: 110, background: '#f3f4f6' }} />
              }
              const evs = eventosPorDia[n] ?? []
              const activo = dia === n
              const esHoy = hoy.year() === anio && hoy.month() + 1 === mes && hoy.date() === n
              return (
                <div
                  key={n}
                  role='button'
                  onClick={() => onChangeDia(activo ? null : n)}
                  className='border-end border-bottom p-1'
                  style={{
                    minHeight: 110,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    background: activo ? 'rgba(13,110,253,.12)' : finDeSemana ? '#fafafa' : '#fff',
                    boxShadow: activo ? 'inset 0 0 0 2px #0d6efd' : 'none',
                    transition: 'background .15s',
                  }}
                >
                  <div className='d-flex justify-content-between align-items-center mb-1'>
                    <span
                      className={`fw-bold d-inline-flex align-items-center justify-content-center rounded-circle ${esHoy ? 'bg-change text-white' : ''}`}
                      style={{ width: 28, height: 28 }}
                    >
                      {n}
                    </span>
                    {evs.length > 0 && <span className='badge rounded-pill bg-secondary'>{evs.length}</span>}
                  </div>
                  {evs.slice(0, 3).map((ev) => {
                    const tipo = labelTipoEvento(ev, dataTipos)
                    const c = colorTipo(tipo)
                    return (
                      <div
                        key={ev.id}
                        className='rounded px-2 py-1 mb-1'
                        style={{ background: c.bg, color: c.color, lineHeight: 1.3 }}
                        title={tipo ? `${tipo}: ${ev.titulo}` : ev.titulo}
                      >
                        {tipo && <div className='text-truncate fw-bold' style={{ fontSize: 11, opacity: 0.85, letterSpacing: 0.5 }}>{tipo}</div>}
                        <div className='text-truncate fw-semibold' style={{ fontSize: 14 }}>{ev.titulo}</div>
                        <FotosEvento imagenes={ev.imagenes ?? []} />
                      </div>
                    )
                  })}
                  {evs.length > 3 && <div className='text-muted fw-semibold' style={{ fontSize: 13 }}>+{evs.length - 3} más</div>}
                </div>
              )
            })}
          </div>
        </div>
      </div>}
    </div>
  )
}

const NOMBRES_DIA = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']

// vista lista: solo los dias del mes que tienen eventos, en orden
const ListaMes = ({ anio, mes, totalDias, eventosPorDia, dataTipos, dia, hoy, onChangeDia }) => {
  const dias = []
  for (let d = 1; d <= totalDias; d++) {
    if ((eventosPorDia[d] ?? []).length) dias.push(d)
  }
  if (!dias.length) {
    return <div className='text-center text-muted py-5'>No hay eventos en {MESES[mes - 1]}</div>
  }
  return (
    <div>
      {dias.map((d) => {
        const fecha = dayjs(`${anio}-${String(mes).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
        const esHoy = fecha.isSame(hoy, 'day')
        const activo = dia === d
        return (
          <div key={d} className='border-bottom'>
            <div
              role='button'
              onClick={() => onChangeDia(activo ? null : d)}
              className='d-flex justify-content-between align-items-center px-3 py-2 fw-bold'
              style={{ background: activo ? 'rgba(13,110,253,.12)' : '#f3f4f6', cursor: 'pointer' }}
            >
              <span className='d-flex align-items-center gap-2'>
                <span
                  className={`d-inline-flex align-items-center justify-content-center rounded-circle ${esHoy ? 'bg-change text-white' : ''}`}
                  style={{ width: 30, height: 30 }}
                >
                  {d}
                </span>
                {NOMBRES_DIA[fecha.day()]}
              </span>
              <span className='text-muted small'>{fecha.format('DD/MM/YYYY')}</span>
            </div>
            {eventosPorDia[d].map((ev) => {
              const tipo = labelTipoEvento(ev, dataTipos)
              const c = colorTipo(tipo)
              return (
                <div key={ev.id} className='d-flex align-items-start gap-3 px-3 py-2'>
                  <span className='rounded-circle flex-shrink-0 mt-1' style={{ width: 12, height: 12, background: c.bg }} />
                  <div style={{ minWidth: 0 }}>
                    {tipo && <div className='fw-bold' style={{ fontSize: 11, color: c.bg === '#ffc107' ? '#b38600' : c.bg }}>{tipo}</div>}
                    <div className='fw-semibold' style={{ fontSize: 15 }}>{ev.titulo}</div>
                    {ev.observacion && <div className='text-muted small' style={{ whiteSpace: 'pre-wrap' }}>{ev.observacion}</div>}
                    <FotosEvento imagenes={ev.imagenes ?? []} size={64} max={8} />
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

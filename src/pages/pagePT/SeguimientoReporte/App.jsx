import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Alert, Button, Col, Form, Row, Table } from 'react-bootstrap'
import { PageBreadcrumb } from '@/components'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { useReporteSeguimientoStore } from './useReporteSeguimientoStore'
import { AGRUPACIONES, agrupar, edadCliente, generoCliente, horarioCliente } from './agrupaciones'

const pct = (n, total) => (total === 0 ? '0.00' : ((n / total) * 100).toFixed(2))

export const App = () => {
  const { clientes, isLoading, error, obtenerReporte } = useReporteSeguimientoStore()
  // Socios activos a esta fecha (por defecto hoy): su ultima membresia vence ese dia o despues
  const [fecha, setfecha] = useState(dayjs().format('YYYY-MM-DD'))
  // Fecha con la que se obtuvo el reporte (la edad se calcula a esa fecha)
  const [fechaConsultada, setfechaConsultada] = useState(fecha)
  // Click en una fila de un card: filtra la tabla de clientes (otro click lo quita)
  // Filtro cruzado: { [titulo del card]: label de la fila tocada }. Tocar una fila filtra los demas
  // cards y la tabla; se pueden combinar filtros de varios cards. Otro toque en la misma fila lo quita.
  const [filtros, setfiltros] = useState({})
  const onTocarFila = (titulo, label) => {
    setfiltros((prev) => {
      if (prev[titulo] === label) {
        const { [titulo]: _, ...resto } = prev
        return resto
      }
      return { ...prev, [titulo]: label }
    })
  }
  // Orden de la tabla de cada card: { [titulo]: { col: 'label'|'cantidad'|'monto', dir: 'asc'|'desc' } }
  // click en el encabezado: asc -> desc -> orden por defecto
  const [ordenCards, setordenCards] = useState({})
  const onOrdenarCard = (titulo, col) => {
    setordenCards((prev) => {
      const actual = prev[titulo]
      if (!actual || actual.col !== col) return { ...prev, [titulo]: { col, dir: 'asc' } }
      if (actual.dir === 'asc') return { ...prev, [titulo]: { col, dir: 'desc' } }
      const { [titulo]: _, ...resto } = prev
      return resto
    })
  }
  const filasOrdenadas = (titulo, filas) => {
    const orden = ordenCards[titulo]
    if (!orden) return filas
    const dir = orden.dir === 'desc' ? -1 : 1
    return [...filas].sort((a, b) =>
      orden.col === 'label'
        ? a.label.localeCompare(b.label, 'es', { numeric: true }) * dir
        : (a[orden.col] - b[orden.col]) * dir
    )
  }
  const iconoOrden = (titulo, col) => {
    const orden = ordenCards[titulo]
    // sin orden: blanco tenue (el encabezado es rojo CHANGE)
    if (orden?.col !== col) return 'pi-sort-alt opacity-50'
    return orden.dir === 'asc' ? 'pi-sort-amount-up-alt' : 'pi-sort-amount-down'
  }

  const buscar = (e) => {
    e?.preventDefault()
    setfiltros({})
    setfechaConsultada(fecha)
    obtenerReporte(fecha)
  }
  useEffect(() => { buscar() }, [])

  // ¿El socio cumple los filtros activos? (excepto el del card indicado)
  const cumpleFiltros = (c, excepto = null) =>
    Object.entries(filtros).every(([titulo, label]) =>
      titulo === excepto || AGRUPACIONES.find((a) => a.titulo === titulo).clave(c, fechaConsultada) === label
    )
  // Cada card se calcula con los socios que cumplen los filtros de los OTROS cards, asi sigue
  // mostrando todas sus filas (la elegida resaltada) y se puede cambiar de fila.
  const grupos = useMemo(
    () => AGRUPACIONES.map((a) => {
      const base = clientes.filter((c) => cumpleFiltros(c, a.titulo))
      const filas = agrupar(base, a, fechaConsultada)
      const elegida = filtros[a.titulo]
      // si la fila elegida se quedo sin socios por otro filtro, se muestra en 0 para poder quitarla
      if (elegida !== undefined && !filas.some((f) => f.label === elegida)) {
        filas.push({ label: elegida, items: [], cantidad: 0, monto: 0 })
      }
      return { titulo: a.titulo, filas, total: base.length }
    }),
    [clientes, fechaConsultada, filtros]
  )
  const dataTabla = useMemo(() => clientes.filter((c) => cumpleFiltros(c)), [clientes, fechaConsultada, filtros])
  const hayFiltros = Object.keys(filtros).length > 0
  const montoTotal = dataTabla.reduce((t, c) => t + c.monto, 0)

  const columns = [
    { id: 0, header: '#', render: (row, i) => i + 1 },
    // todas ordenables asc/desc (click en el encabezado)
    { id: 1, header: 'SOCIO', accessor: 'nombre', sortable: true, render: (row) => (<><div>{row.nombre}</div><small className='text-muted'>DNI: {row.dni || '-'}</small></>) },
    { id: 2, header: 'GENERO', accessor: (row) => generoCliente(row), sortable: true, render: (row) => generoCliente(row) },
    // numerico para ordenar bien (sin dato = -1, queda al inicio en asc)
    { id: 3, header: 'EDAD', accessor: (row) => edadCliente(row, fechaConsultada) ?? -1, sortable: true, render: (row) => edadCliente(row, fechaConsultada) ?? '-' },
    { id: 4, header: 'DISTRITO', accessor: 'distrito', sortable: true, render: (row) => row.distrito || '-' },
    { id: 5, header: 'HORARIO', accessor: 'horario', sortable: true, render: (row) => horarioCliente(row) },
    { id: 6, header: 'PROGRAMA', accessor: 'programa', sortable: true, render: (row) => row.programa || '-' },
    { id: 7, header: 'MONTO', accessor: 'monto', sortable: true, render: (row) => <NumberFormatMoney amount={row.monto}/> },
    { id: 8, header: 'VENCE', accessor: 'vence', sortable: true, render: (row) => row.vence },
  ]
  const columnsExports = [
    { id: 'nombre', exportHeader: 'SOCIO', exportValue: (row) => row.nombre },
    { id: 'dni', exportHeader: 'DNI', exportValue: (row) => row.dni },
    { id: 'genero', exportHeader: 'GENERO', exportValue: (row) => generoCliente(row) },
    { id: 'edad', exportHeader: 'EDAD', exportValue: (row) => edadCliente(row, fechaConsultada) ?? '' },
    { id: 'distrito', exportHeader: 'DISTRITO', exportValue: (row) => row.distrito || '' },
    { id: 'horario', exportHeader: 'HORARIO', exportValue: (row) => horarioCliente(row) },
    { id: 'programa', exportHeader: 'PROGRAMA', exportValue: (row) => row.programa || '' },
    { id: 'monto', exportHeader: 'MONTO S/.', exportValue: (row) => row.monto },
    { id: 'vence', exportHeader: 'FECHA VENCIMIENTO', exportValue: (row) => row.vence },
  ]

  return (
    <div>
      <PageBreadcrumb title={'REPORTE DE SEGUIMIENTO'}/>
      <Form onSubmit={buscar} className='d-flex flex-wrap align-items-end gap-3 mb-3'>
        <Form.Group>
          <Form.Label>Fecha</Form.Label>
          <Form.Control type='date' value={fecha} onChange={(e) => setfecha(e.target.value)} required/>
        </Form.Group>
        <Button type='submit' disabled={isLoading}>
          <i className={`pi ${isLoading ? 'pi-spin pi-spinner' : 'pi-search'} me-2`}></i>
          {isLoading ? 'Buscando...' : 'Buscar'}
        </Button>
        <div className='fs-4 ms-md-3'>
          {hayFiltros
            ? <><b className='text-change'>{dataTabla.length}</b> de {clientes.length} socios activos al {fechaConsultada}</>
            : <><b className='text-change'>{clientes.length}</b> socios activos al {fechaConsultada}</>}
          <span className='mx-2'>·</span>
          <b className='text-change'><NumberFormatMoney amount={montoTotal}/></b>
        </div>
      </Form>
      {error && <Alert variant='danger'>{error}</Alert>}

      <Row>
        {
          grupos.map((g) => (
            <Col key={g.titulo} md={6} className='mb-3'>
              {/* la tabla ocupa todo el ancho del card (sin margen interno a los costados) */}
              <div className='card h-100 mb-0 overflow-hidden'>
                <div className='fs-3 fw-bold px-3 pt-3 pb-2'>{g.titulo}</div>
                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  <Table size='sm' hover className='mb-0 w-100'>
                    <thead>
                      <tr>
                        {
                          [
                            { col: 'label', texto: g.titulo, className: 'ps-3' },
                            { col: 'cantidad', texto: 'SOCIOS', className: 'text-end' },
                            // % sale de la cantidad de socios
                            { col: 'cantidad', texto: '%', className: 'text-end', key: 'pct' },
                            { col: 'monto', texto: 'MONTO S/.', className: 'text-end pe-3' },
                          ].map((h) => (
                            <th
                              key={h.key ?? h.col}
                              className={`${h.className} bg-change text-white cursor-pointer text-nowrap`}
                              onClick={() => onOrdenarCard(g.titulo, h.col)}
                              title='Click para ordenar'
                            >
                              {h.texto}
                              <i className={`pi ${iconoOrden(g.titulo, h.col)} ms-1`} style={{ fontSize: '10px' }}></i>
                            </th>
                          ))
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        filasOrdenadas(g.titulo, g.filas).map((f) => {
                          const activo = filtros[g.titulo] === f.label
                          return (
                            <tr
                              key={f.label}
                              className={`cursor-pointer ${activo ? 'table-primary fw-bold' : ''}`}
                              onClick={() => onTocarFila(g.titulo, f.label)}
                              title={activo ? 'Quitar filtro' : 'Filtrar los demas cards y la tabla'}
                            >
                              <td className='ps-3'>{f.label}</td>
                              <td className='text-end'>{f.cantidad}</td>
                              <td className='text-end'>{pct(f.cantidad, g.total)}</td>
                              <td className='text-end pe-3'><NumberFormatMoney amount={f.monto}/></td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          ))
        }
      </Row>

      {
        hayFiltros && (
          <div className='mb-2 fs-5 d-flex flex-wrap align-items-center gap-2'>
            Mostrando <b>{dataTabla.length}</b> socios:
            {
              Object.entries(filtros).map(([titulo, label]) => (
                <span key={titulo} className='badge bg-change fs-6'>
                  {titulo}: {label}
                  <i className='pi pi-times ms-2 cursor-pointer' style={{ fontSize: '10px' }} onClick={() => onTocarFila(titulo, label)} title='Quitar este filtro'></i>
                </span>
              ))
            }
            <a className='ms-2 text-danger cursor-pointer' onClick={() => setfiltros({})}>Quitar filtros</a>
          </div>
        )
      }
      <DataTableCR
        columns={columns}
        data={dataTabla}
        exportExtraColumns={columnsExports}
        exportFileName={`reporte-seguimiento_activos_${fechaConsultada}`}
      />
    </div>
  )
}

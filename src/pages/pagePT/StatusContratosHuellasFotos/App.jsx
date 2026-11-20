import React, { useEffect, useMemo, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { PageBreadcrumb } from '@/components'
import { PTApi } from '@/common'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { hoyPeru, useSeguimientoStore } from '../Seguimientoficial/useSeguimientoStore'

// Misma regla que la pantalla de Contratos: el cliente tiene foto si alguna de sus ventas tiene imagen
const mapearClientesConFoto = (ventas) =>
  new Set((ventas ?? []).filter((v) => v.tb_cliente?.tb_images?.length > 0).map((v) => v.id_cli))

const pct = (n, total) => (total === 0 ? '0.00' : ((n / total) * 100).toFixed(2))

// Socios activos (su ultima membresia vence hoy o despues): contratos, huellas y fotos
export const App = () => {
  const { obtenerSeguimientoxFecha, dataSeguimientoxFecha, tieneHuella } = useSeguimientoStore()
  // id_cli con foto; null mientras se consulta
  const [clientesConFoto, setclientesConFoto] = useState(null)
  useEffect(() => {
    obtenerSeguimientoxFecha()
    const obtenerClientesConFoto = async () => {
      try {
        const { data } = await PTApi.get('/venta/obtener-contratos-clientes/598')
        setclientesConFoto(mapearClientesConFoto(data.datacontratosConMembresias))
      } catch (error) {
        console.log(error)
        setclientesConFoto(new Set())
      }
    }
    obtenerClientesConFoto()
  }, [])

  const activos = useMemo(() => {
    const hoy = hoyPeru()
    return dataSeguimientoxFecha.filter((f) => f.fecha_vencimiento >= hoy)
  }, [dataSeguimientoxFecha])

  const huellasCargando = tieneHuella('') === null
  const fotosCargando = clientesConFoto === null
  const tieneFoto = (f) => (fotosCargando ? null : clientesConFoto.has(f.id_cli))
  const contar = (filtro) => activos.filter(filtro).length
  const total = activos.length
  const tarjetas = [
    {
      titulo: 'CONTRATOS',
      items: [
        { label: 'SIN CONTRATO', filtro: (f) => f.contrato === 'SIN CONTRATO' },
        { label: 'CON CONTRATO', filtro: (f) => f.contrato === 'CON CONTRATO' },
        { label: 'CANJE', filtro: (f) => f.contrato === 'CANJE' },
      ],
    },
    {
      titulo: 'HUELLAS',
      cargando: huellasCargando,
      items: [
        { label: 'SIN HUELLA', filtro: (f) => tieneHuella(f.dni) === false },
        { label: 'CON HUELLA', filtro: (f) => tieneHuella(f.dni) === true },
      ],
    },
    {
      titulo: 'FOTOS',
      cargando: fotosCargando,
      items: [
        { label: 'SIN FOTO', filtro: (f) => tieneFoto(f) === false },
        { label: 'CON FOTO', filtro: (f) => tieneFoto(f) === true },
      ],
    },
  ].map((t) => ({ ...t, items: t.items.map((r) => ({ ...r, cargando: t.cargando, valor: t.cargando ? 0 : contar(r.filtro) })) }))

  // Click en un numero filtra la tabla; otro click lo quita
  const [filtroReporte, setfiltroReporte] = useState(null)
  const filtroActivo = tarjetas.flatMap((t) => t.items).find((r) => r.label === filtroReporte)
  const dataTabla = filtroActivo ? activos.filter(filtroActivo.filtro) : activos
  const onClickReporte = (r) => {
    if (r.cargando) return
    setfiltroReporte((actual) => (actual === r.label ? null : r.label))
  }

  const textoHuella = (f) => ({ true: 'CON HUELLA', false: 'SIN HUELLA' })[tieneHuella(f.dni)] ?? '...'
  const textoFoto = (f) => ({ true: 'CON FOTO', false: 'SIN FOTO' })[tieneFoto(f)] ?? '...'
  const Estado = ({ texto }) => (
    <span className={`fw-bold ${texto.startsWith('CON') ? 'text-ISESAC' : texto.startsWith('SIN') ? 'text-change' : 'text-muted'}`}>{texto}</span>
  )
  const columns = [
    { id: 0, header: '#', render: (row, index) => <div style={{ fontSize: '18px' }}>{index + 1}</div> },
    {
      id: 1, header: 'SOCIO', accessor: 'nombres_apellidos_cli', render: (row) => (
        <div style={{ fontSize: '15px' }}>
          <div>{`${row.nombres_cli} ${row.apPaterno_cli} ${row.apMaterno_cli}`}</div>
          <div>DNI: {row.dni}</div>
          <div>TELEFONO: {row.tel_cli}</div>
        </div>
      ),
    },
    { id: 2, header: 'PROGRAMA', render: (row) => <div style={{ fontSize: '15px' }}>{row.nombre_programa}</div> },
    { id: 3, header: <>FECHA DE<br />VENCIMIENTO</>, render: (row) => <div style={{ fontSize: '15px' }}>{row.fecha_vencimiento_}</div> },
    { id: 4, header: 'CONTRATO', render: (row) => <Estado texto={row.contrato} /> },
    { id: 5, header: 'HUELLA', render: (row) => <Estado texto={textoHuella(row)} /> },
    { id: 6, header: 'FOTO', render: (row) => <Estado texto={textoFoto(row)} /> },
  ]
  const columnsExports = [
    { id: 'id_cli', exportHeader: 'ID_CLI', exportValue: (row) => row.id_cli },
    { id: 'cliente', exportHeader: 'SOCIO', exportValue: (row) => `${row.nombres_cli} ${row.apPaterno_cli} ${row.apMaterno_cli}` },
    { id: 'dni', exportHeader: 'DNI', exportValue: (row) => row.dni },
    { id: 'telefono', exportHeader: 'TELEFONO', exportValue: (row) => row.tel_cli },
    { id: 'programa', exportHeader: 'PROGRAMA', exportValue: (row) => row.nombre_programa },
    { id: 'vencimiento', exportHeader: 'FECHA DE VENCIMIENTO', exportValue: (row) => row.fecha_vencimiento },
    { id: 'contrato', exportHeader: 'CONTRATO', exportValue: (row) => row.contrato },
    { id: 'huella', exportHeader: 'HUELLA', exportValue: (row) => textoHuella(row) },
    { id: 'foto', exportHeader: 'FOTO', exportValue: (row) => textoFoto(row) },
  ]

  return (
    <>
      <PageBreadcrumb title='STATUS CONTRATOS, HUELLAS Y FOTOS' subName='Seguimiento' />
      <div className='fs-2 fw-bold text-change mb-2'>
        SOCIOS ACTIVOS <span className='text-black mx-1'>TOTAL</span> <span className='text-black'>{total}</span>
      </div>
      <Row className='g-2 mb-3'>
        {tarjetas.map((t) => (
          <Col xs={12} md={4} key={t.titulo}>
            <div className='card p-3 h-100 mb-0'>
              <div className='fs-3 fw-bold'>{t.titulo}</div>
              <ul className='list-unstyled mb-0'>
                {t.items.map((r) => (
                  <li
                    key={r.label}
                    onClick={() => onClickReporte(r)}
                    className={`d-flex justify-content-between align-items-center px-2 my-1 rounded fs-4 ${r.cargando ? '' : 'cursor-pointer'}`}
                    style={{ border: `2px solid ${filtroReporte === r.label ? 'currentColor' : 'transparent'}` }}
                    title={filtroReporte === r.label ? 'Quitar filtro' : `Filtrar la tabla: ${r.label}`}
                  >
                    <span>{r.label}</span>
                    {r.cargando
                      ? <span className='text-muted'>...</span>
                      : <span><b className='text-change fs-3'>{r.valor}</b> <span className='fs-3'>/ {pct(r.valor, total)}%</span></span>}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        ))}
      </Row>
      {filtroActivo && (
        <div className='mb-2 fs-5'>
          Mostrando <b>{dataTabla.length}</b> socios: <b>{filtroActivo.label}</b>
          <a className='ms-3 text-danger cursor-pointer' onClick={() => setfiltroReporte(null)}>Quitar filtro</a>
        </div>
      )}
      <DataTableCR
        exportable={true}
        exportExtraColumns={columnsExports}
        exportFileName='socios-activos-contratos-huellas-fotos'
        columns={columns}
        data={dataTabla}
      />
    </>
  )
}

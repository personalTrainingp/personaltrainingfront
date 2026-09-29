import React, { useEffect, useState } from 'react'
import { TabPanel, TabView } from 'primereact/tabview'
import { SelectButton } from 'primereact/selectbutton'
import { Dialog } from 'primereact/dialog'
import { ColorEmpresa } from '@/components/ColorEmpresa'
import { PageBreadcrumb } from '@/components'
import { PTApi } from '@/common'
import { DateMaskStr, NumberFormatMoney } from '@/components/CurrencyMask'
import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'

const anios = [2026, 2025, 2024]

const meses = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SETIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
]

const opcionesVista = [
  { label: 'MESES', value: 'meses' },
  { label: 'CONCEPTOS', value: 'conceptos' },
]

const tiposCuenta = [
  { tipo: 'PorCobrar', label: 'CUENTAS POR COBRAR' },
  { tipo: 'PorPagar', label: 'CUENTAS POR PAGAR' },
]

// Suma de montos separando soles y dolares
const sumarMontos = (cuentas) =>
  cuentas.reduce(
    (acc, c) => {
      if (c.moneda === 'PEN') acc.PEN += Number(c.monto) || 0
      else acc.USD += Number(c.monto) || 0
      return acc
    },
    { PEN: 0, USD: 0 }
  )

const CeldaMonto = ({ cuentas, className = '', style, onClick }) => {
  const { PEN, USD } = sumarMontos(cuentas)
  return (
    <td
      className={className}
      style={onClick ? { ...style, cursor: 'pointer', textDecoration: 'underline' } : style}
      onClick={onClick}
    >
      {PEN !== 0 && (
        <div>
          <SymbolSoles fontSizeS={'font-15'} />
          <NumberFormatMoney amount={PEN} />
        </div>
      )}
      {USD !== 0 && (
        <div className="text-color-dolar fw-bold">
          <SymbolDolar fontSizeS={'font-15'} />
          <NumberFormatMoney amount={USD} />
        </div>
      )}
      {PEN === 0 && USD === 0 && '-'}
    </td>
  )
}

// Proveedores unicos (id_prov) de una lista de cuentas
const obtenerProveedores = (cuentas) =>
  cuentas.reduce((acc, cuenta) => {
    if (!acc.some((p) => p.id_prov === cuenta.id_prov)) {
      acc.push({ id_prov: cuenta.id_prov, razon_social: cuenta?.proveedor_empresa?.razon_social_prov })
    }
    return acc
  }, [])

// Columna TOTAL fija a la derecha al hacer scroll horizontal
const stickyTotal = { position: 'sticky', right: 0, zIndex: 1 }

// Separa la descripcion "CONCEPTO: PROVEEDOR"; sin ":" queda sin concepto
const separarDescripcion = (descripcion) => {
  const texto = String(descripcion ?? '')
  const indice = texto.indexOf(':')
  if (indice === -1) return { concepto: null, proveedor: texto.trim() || null }
  return {
    concepto: texto.slice(0, indice).trim() || null,
    proveedor: texto.slice(indice + 1).trim() || null,
  }
}

const normalizarOperacion = (op) => String(op ?? '').trim()
const normalizarMonto = (monto) => Math.round((Number(monto) || 0) * 100)

// Filas del detalle: cada cuenta balance busca un gasto con el mismo n_operacion Y el mismo monto
// (un gasto solo se usa una vez). Con match: concepto y proveedor del gasto.
// Sin match: concepto y proveedor salen de la descripcion de la cuenta.
// Se agrupan por concepto + proveedor
const obtenerFilasDetalle = (cuentas, egresos) => {
  const egresosUsados = new Set()
  const items = cuentas.map((c) => {
    const operacion = normalizarOperacion(c.n_operacion)
    const egreso =
      operacion === ''
        ? undefined
        : egresos.find(
            (e) =>
              !egresosUsados.has(e.id) &&
              normalizarOperacion(e.n_operacion) === operacion &&
              normalizarMonto(e.monto) === normalizarMonto(c.monto)
          )
    const base = {
      key: `cuenta-${c.id}`,
      id: c.id,
      monto: c.monto,
      moneda: c.moneda,
      fecha: c.fecha_comprobante,
      n_operacion: c.n_operacion,
      descripcion: c.descripcion,
    }
    if (!egreso) {
      return { ...base, origen: 'CUENTA BALANCE', ...separarDescripcion(c.descripcion) }
    }
    egresosUsados.add(egreso.id)
    return {
      ...base,
      origen: 'GASTO',
      esMatch: true,
      id_gasto: egreso.id,
      concepto: egreso.tb_parametros_gasto?.nombre_gasto || null,
      proveedor: egreso.tb_Proveedor?.razon_social_prov || null,
      empresa: egreso.empresaGasto,
    }
  })

  const grupos = items.reduce((acc, i) => {
    const concepto = i.concepto || null
    const proveedor = i.proveedor || '-'
    const empresa = i.empresa || '-'
    const grupo = acc.find((g) => g.concepto === concepto && g.proveedor === proveedor && g.empresa === empresa)
    if (grupo) grupo.items.push(i)
    else acc.push({ key: `${concepto ?? 'sin-concepto'}-${proveedor}-${empresa}`, concepto, proveedor, empresa, items: [i] })
    return acc
  }, [])
  // Los "SIN CONCEPTO" van al final
  return [...grupos.filter((g) => g.concepto), ...grupos.filter((g) => !g.concepto)]
}

const estiloSinConcepto = { backgroundColor: '#000', color: '#fff' }


// Modal con cada item que se sumo en un monto
const ModalItemsMonto = ({ seleccion, onHide, classNameEmpresa }) => {
  const items = seleccion?.items ?? []
  return (
    <Dialog visible={seleccion !== null} onHide={onHide} header={seleccion?.titulo} style={{ width: '80rem' }}>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className={classNameEmpresa}>
            <tr>
              <th className="text-white">ID CUENTA</th>
              <th className="text-white">ID GASTO</th>
              <th className="text-white">ORIGEN</th>
              <th className="text-white">FECHA</th>
              <th className="text-white">N° OPERACION</th>
              <th className="text-white">CONCEPTO</th>
              <th className="text-white">PROVEEDOR</th>
              <th className="text-white">EMPRESA (GASTO)</th>
              <th className="text-white">DESCRIPCION</th>
              <th className="text-white">MONTO</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.key}>
                <td>{i.id}</td>
                <td>{i.id_gasto ?? '-'}</td>
                <td>{i.origen}</td>
                <td>{i.fecha ? DateMaskStr(i.fecha, 'DD/MM/YYYY') : '-'}</td>
                <td>{i.n_operacion || '-'}</td>
                <td>{i.concepto || 'SIN CONCEPTO'}</td>
                <td>{i.proveedor || '-'}</td>
                <td>{i.empresa || '-'}</td>
                <td>{i.descripcion || '-'}</td>
                <CeldaMonto cuentas={[i]} />
              </tr>
            ))}
            <tr className="fw-bold">
              <td colSpan={9}>TOTAL ({items.length} items)</td>
              <CeldaMonto cuentas={items} className="fw-bold" />
            </tr>
          </tbody>
        </table>
      </div>
    </Dialog>
  )
}

const TablaDetalleEgresos = ({ cuentas, egresos, classNameEmpresa }) => {
  const [seleccion, setseleccion] = useState(null)
  const filas = obtenerFilasDetalle(cuentas, egresos)
  if (filas.length === 0) {
    return <div className="fs-4 p-3 text-center">No hay registros</div>
  }
  const todosLosItems = filas.flatMap((f) => f.items)
  return (
    <div className="table-responsive">
      <ModalItemsMonto seleccion={seleccion} onHide={() => setseleccion(null)} classNameEmpresa={classNameEmpresa} />
      <table className="table table-bordered table-hover">
        <thead className={classNameEmpresa}>
          <tr>
            <th className="text-white">CONCEPTO</th>
            <th className="text-white">MONTO</th>
            <th className="text-white">PROVEEDOR</th>
            <th className="text-white">EMPRESA (GASTO)</th>
            <th className="text-white">N° ITEMS</th>
            <th className="text-white">GASTOS CON MATCH (N° OPERACION + MONTO)</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => {
            const estilo = f.concepto ? undefined : estiloSinConcepto
            return (
              <tr key={f.key}>
                <td style={estilo}>{f.concepto || 'SIN CONCEPTO'}</td>
                <CeldaMonto
                  cuentas={f.items}
                  style={estilo}
                  onClick={() => setseleccion({ titulo: `${f.concepto || 'SIN CONCEPTO'} - ${f.proveedor || '-'}`, items: f.items })}
                />
                <td style={estilo}>{f.proveedor || '-'}</td>
                <td style={estilo}>{f.empresa}</td>
                <td style={estilo}>{f.items.length}</td>
                <td style={estilo}>{f.items.filter((i) => i.esMatch).length}</td>
              </tr>
            )
          })}
          <tr className="fw-bold">
            <td>TOTAL</td>
            <CeldaMonto
              cuentas={todosLosItems}
              className="fw-bold"
              onClick={() => setseleccion({ titulo: 'TOTAL', items: todosLosItems })}
            />
            <td></td>
            <td></td>
            <td>{todosLosItems.length}</td>
            <td>{todosLosItems.filter((i) => i.esMatch).length}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const ModalDetalleMes = ({ show, onHide, titulo, cuentas, egresos, classNameEmpresa }) => {
  return (
    <Dialog visible={show} onHide={onHide} header={titulo} style={{ width: '60rem' }}>
      <TablaDetalleEgresos cuentas={cuentas} egresos={egresos} classNameEmpresa={classNameEmpresa} />
    </Dialog>
  )
}

const TablaProveedor = ({ proveedor, cuentas, egresos, classNameEmpresa, vista }) => {
  const [mesSeleccionado, setmesSeleccionado] = useState(null)

  if (vista === 'conceptos') {
    return (
      <div className="mb-5">
        <h1>{proveedor.razon_social || '-'} ({proveedor.id_prov})</h1>
        <TablaDetalleEgresos cuentas={cuentas} egresos={egresos} classNameEmpresa={classNameEmpresa} />
      </div>
    )
  }

  const columnas = meses.map((mes, i) => ({
    key: mes,
    header: mes,
    cuentas: cuentas.filter((c) => Number(DateMaskStr(c.fecha_comprobante, 'M')) === i + 1),
  }))
  return (
    <div className="mb-5">
      <h1>{proveedor.razon_social || '-'} ({proveedor.id_prov})</h1>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className={classNameEmpresa}>
            <tr>
              {columnas.map((col) => (
                <th
                  key={col.key}
                  className="text-white"
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => setmesSeleccionado(col)}
                >
                  {col.header}
                </th>
              ))}
              <th className={classNameEmpresa} style={stickyTotal}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {columnas.map((col) => (
                <CeldaMonto key={col.key} cuentas={col.cuentas} />
              ))}
              <CeldaMonto cuentas={cuentas} className="fw-bold bg-white" style={stickyTotal} />
            </tr>
          </tbody>
        </table>
      </div>
      <ModalDetalleMes
        show={mesSeleccionado !== null}
        onHide={() => setmesSeleccionado(null)}
        titulo={`${mesSeleccionado?.header ?? ''} - ${proveedor.razon_social || ''}`}
        cuentas={mesSeleccionado?.cuentas ?? []}
        egresos={egresos}
        classNameEmpresa={classNameEmpresa}
      />
    </div>
  )
}

const TablasxAnio = ({ anio, cuentasxTipo, egresos, classNameEmpresa, vista, setVista }) => {
  // anio = null -> "TODOS": sin filtrar por año
  const esDelAnio = (c) => anio === null || Number(DateMaskStr(c.fecha_comprobante, 'YYYY')) === anio

  return (
    <div>
      <div className="d-flex justify-content-center mb-4">
        <SelectButton value={vista} onChange={(e) => e.value && setVista(e.value)} options={opcionesVista} />
      </div>
      {tiposCuenta.map(({ tipo, label }) => {
        const cuentasAnio = cuentasxTipo[tipo].filter(esDelAnio)
        const proveedores = obtenerProveedores(cuentasAnio)
        return (
          <div key={tipo} className="mb-5">
            <h1 className={`text-center fw-bolder p-2 ${classNameEmpresa}`}>{label}</h1>
            {proveedores.length === 0 ? (
              <div className="fs-3 p-3 text-center">No hay {label.toLowerCase()} registradas{anio !== null && ` en ${anio}`}</div>
            ) : (
              proveedores.map((p) => (
                <TablaProveedor
                  key={p.id_prov}
                  vista={vista}
                  egresos={egresos}
                  proveedor={p}
                  cuentas={cuentasAnio.filter((c) => c.id_prov === p.id_prov)}
                  classNameEmpresa={classNameEmpresa}
                />
              ))
            )}
          </div>
        )
      })}
    </div>
  )
}

const ViewDetalleCuentasBalance = ({ id_empresa, classNameEmpresa, egresos }) => {
  const [cuentasxTipo, setcuentasxTipo] = useState({ PorCobrar: [], PorPagar: [] })
  const [vista, setVista] = useState('meses')

  useEffect(() => {
    const obtenerCuentas = async () => {
      try {
        const respuestas = await Promise.all(
          tiposCuenta.map(({ tipo }) => PTApi.get(`/cuenta-balance/${id_empresa}/${tipo}`))
        )
        setcuentasxTipo({
          PorCobrar: respuestas[0].data?.cuentasBalances || [],
          PorPagar: respuestas[1].data?.cuentasBalances || [],
        })
      } catch (error) {
        console.log(error)
      }
    }
    obtenerCuentas()
  }, [id_empresa])

  return (
    <TabView>
      {anios.map((anio) => (
        <TabPanel key={anio} header={<div className='fs-1'>{anio}</div>}>
          <TablasxAnio anio={anio} cuentasxTipo={cuentasxTipo} egresos={egresos} classNameEmpresa={classNameEmpresa} vista={vista} setVista={setVista}/>
        </TabPanel>
      ))}
      <TabPanel header={<div className='fs-1'>TODOS</div>}>
        <TablasxAnio anio={null} cuentasxTipo={cuentasxTipo} egresos={egresos} classNameEmpresa={classNameEmpresa} vista={vista} setVista={setVista}/>
      </TabPanel>
    </TabView>
  )
}

const empresas = [
  { id_empresa: 598, nombre: 'CHANGE' },
  { id_empresa: 601, nombre: 'CIRCUS' },
  { id_empresa: 599, nombre: 'REDUCTO' },
  { id_empresa: 800, nombre: 'RAL' },
]

export const App = () => {
  // Todos los gastos de todas las empresas, marcados con el nombre de su empresa
  const [egresos, setegresos] = useState([])

  useEffect(() => {
    const obtenerTodosLosEgresos = async () => {
      try {
        const respuestas = await Promise.all(
          empresas.map(({ id_empresa }) => PTApi.get(`/egreso/empresa/${id_empresa}`))
        )
        setegresos(
          respuestas.flatMap((r, i) =>
            (r.data?.gastos || []).map((g) => ({ ...g, empresaGasto: empresas[i].nombre }))
          )
        )
      } catch (error) {
        console.log(error)
      }
    }
    obtenerTodosLosEgresos()
  }, [])

  return (
    <div>
      <PageBreadcrumb title={'REPORTE DETALLE DE CUENTAS BALANCE'}/>
      <ColorEmpresa
        childrenChange={
          <ViewDetalleCuentasBalance id_empresa={598} egresos={egresos} classNameEmpresa={'bg-change text-white'}/>
        }
        childrenCircus={
          <ViewDetalleCuentasBalance id_empresa={601} egresos={egresos} classNameEmpresa={'bg-circus text-white'}/>
        }
        childrenReducto={
          <ViewDetalleCuentasBalance id_empresa={599} egresos={egresos} classNameEmpresa={'bg-greenISESAC text-white'}/>
        }
        childrenRal={
          <ViewDetalleCuentasBalance id_empresa={800} egresos={egresos} classNameEmpresa={'bg-ral text-white'}/>
        }
      />
    </div>
  )
}

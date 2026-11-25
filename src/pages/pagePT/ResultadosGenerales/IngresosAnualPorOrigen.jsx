import React, { useEffect, useMemo, useState } from 'react'
import { DateMaskStr1 } from '@/components/CurrencyMask'
import { arrayOrigenDeCliente } from '@/types/type'
import { FILAS } from '../FlujoCaja/view/IngresosComparativoAnual'
import { ModalTableItems } from '../FlujoCaja/view/ModalTableItems'
import { useFlujoCaja } from '../FlujoCaja/hook/useFlujoCajaStore'
import { TablaMesesPorAnio } from './TablaMesesPorAnio'
import { originMap } from '../reportes/resumenEjecutivo/hooks/useResumenUtils'

const FILAS_ANIO = FILAS.filter((f) => f.label !== 'TOTAL ACUMULADO')

const ORIGENES_EXCLUIDOS = [25]

const ID_GASTO_PROGRAMAS = 1148

// Toda suma de ventas de esta pantalla es solo por programas (sin suplementos ni accesorios).
// Solo las ventas traen id_origen (aunque sea null); los ingresos manuales no.
const esVentaPrograma = (item) => item.id_gasto === ID_GASTO_PROGRAMAS && item.id_origen !== undefined
// Dia de fecha_venta con la misma conversion que usa agruparPorDia para ubicar el mes
const diaVenta = (item) => DateMaskStr1(item.fecha_venta).date()
const claveOrigen = (item) => Number(item.id_origen) || 0

const tituloOrigen = (id) => {
  const origen = arrayOrigenDeCliente.find((o) => o.value === id)
  const label = id === 0 ? 'SIN ORIGEN' : origen?.label ?? originMap[id] ?? `ORIGEN ${id}`
  return label.trim().toUpperCase()
}

// Ventas de programas con los ingresos del flujo de caja: TOTAL y una tabla por origen
export const IngresosAnualPorOrigen = ({ id_empresa, classNameEmpresa, initDay, cutDay }) => {
  // un hook por año (FILAS_ANIO): cantidad fija, se respetan las reglas de hooks
  const ingresos = [useFlujoCaja(), useFlujoCaja(), useFlujoCaja()]
  const [cargando, setcargando] = useState(true)
  // un solo boton para todas las tablas; cada año ordena sus meses por separado
  const [mayorAMenor, setmayorAMenor] = useState(false)
  const [itemsModal, setitemsModal] = useState(null)

  useEffect(() => {
    Promise.all(
      FILAS_ANIO.map((f, i) => ingresos[i].obtenerIngresosxFecha(id_empresa, f.arrayFechas))
    ).finally(() => setcargando(false))
  }, [])

  const flujos = ingresos.map((e) => e.dataIngresosxFecha.flujoxGrupo)

  // ventas de programas por año, cortadas en cada mes por los dias de inicio y corte
  const ventasPorAnio = useMemo(() => FILAS_ANIO.map((f, i) => ({
    anio: f.anio,
    ventas: (flujos[i] ?? [])
      .filter((g) => g.id !== 121) // mismo grupo que excluye el flujo de caja
      .flatMap((g) => g.itemsxDia ?? [])
      .flatMap((d) => (d.items ?? []).map((item) => ({ mes: Number(d.mes), item })))
      .filter(({ item }) => {
        if (!esVentaPrograma(item)) return false
        const dia = diaVenta(item)
        return dia >= initDay && dia <= cutDay
      }),
  })), [...flujos, initDay, cutDay])

  // origenes con total distinto de 0, de mayor a menor total acumulado
  const origenes = useMemo(() => {
    const totales = new Map()
    ventasPorAnio.flatMap((a) => a.ventas).forEach(({ item }) => {
      const id = claveOrigen(item)
      totales.set(id, (totales.get(id) ?? 0) + (Number(item.monto) || 0))
    })
    return [...totales]
      .filter(([id, total]) => !ORIGENES_EXCLUIDOS.includes(id) && Math.abs(total) >= 0.005)
      .sort(([idA, totalA], [idB, totalB]) => totalB - totalA || idA - idB)
      .map(([id]) => ({
        id,
        titulo: tituloOrigen(id),
        ventasPorAnio: ventasPorAnio.map((a) => ({
          ...a, ventas: a.ventas.filter(({ item }) => claveOrigen(item) === id),
        })),
      }))
  }, [ventasPorAnio])

  if (cargando) return <div className='fs-3 text-center my-4'>Cargando ingresos por origen...</div>

  return (
    <div className='mt-5'>
      <div className='text-end mb-2'>
          <button
              type='button'
              className={`btn btn-lg ${mayorAMenor ? 'btn-dark' : 'btn-outline-dark'}`}
              aria-pressed={mayorAMenor}
              title={mayorAMenor ? 'Volver al orden de enero a diciembre' : 'Ordenar los meses de todas las tablas'}
              onClick={() => setmayorAMenor((actual) => !actual)}
          >
              <i className={`pi ${mayorAMenor ? 'pi-calendar' : 'pi-sort-amount-down'} me-2`} />
              {mayorAMenor ? 'ENERO A DICIEMBRE' : 'MAYOR A MENOR'}
          </button>
      </div>
      {/* TOTAL VENTAS: todos los programas, incluidos los origenes sin tabla propia */}
      {[{ id: 'total', titulo: 'TOTAL VENTAS', ventasPorAnio }, ...origenes].map((t) => (
        <TablaMesesPorAnio
          key={`${t.id}-${mayorAMenor}`} // el boton general reinicia las flechas de cada año
          titulo={t.titulo}
          ventasPorAnio={t.ventasPorAnio}
          mayorAMenor={mayorAMenor}
          onClickItems={setitemsModal}
          classNameMes={classNameEmpresa}
          classNameAnio={classNameEmpresa}
        />
      ))}
      <ModalTableItems
        link=''
        bgHeader={classNameEmpresa}
        textEmpresa='textEmpresa'
        isShowConceptos={false}
        show={itemsModal !== null}
        onHide={() => setitemsModal(null)}
        items={itemsModal ?? []}
        id_empresa={id_empresa}
      />
    </div>
  )
}

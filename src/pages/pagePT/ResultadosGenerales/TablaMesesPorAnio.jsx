import React, { useState } from 'react'
import { Table } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { anioCantidad } from '../FlujoCaja/view/TrItem'
import { MESES_UPPER } from '../reportes/resumenEjecutivo/hooks/useResumenUtils'

const sumar = (items) => items.reduce((total, item) => total + (Number(item.monto) || 0), 0)

// Una columna por año; cada celda lleva su mes y su monto.
// ventasPorAnio: [{ anio, ventas: [{ mes, item }] }]
// mayorAMenor es el orden inicial de todos los años; la flecha de cada año lo cambia solo en esa columna.
export const TablaMesesPorAnio = ({ titulo, ventasPorAnio, mayorAMenor, onClickItems, classNameMes, classNameAnio }) => {
  const [ordenAnio, setordenAnio] = useState({})
  const estaOrdenado = (anio) => ordenAnio[anio] ?? mayorAMenor
  const columnas = ventasPorAnio.map(({ anio, ventas }) => {
    const meses = MESES_UPPER.map((nombre, i) => {
      const items = ventas.filter((v) => v.mes === i + 1).map((v) => v.item)
      return { mes: i + 1, nombre, items, monto: sumar(items) }
    })
    if (estaOrdenado(anio)) meses.sort((a, b) => b.monto - a.monto || a.mes - b.mes)
    const items = ventas.map((v) => v.item)
    const total = sumar(items)
    return { anio, meses, items, total, promedio: total / anioCantidad(anio) }
  })
  const itemsTotal = columnas.flatMap((c) => c.items)

  return (
    <div className='mx-auto' style={{ maxWidth: '1300px', marginBottom: '100px' }}>
      <div style={{ fontSize: '70px' }} className='text-black text-center'>{titulo}</div>
      <div className='table-responsive'>
        <Table className='fs-2 text-center align-middle' style={{ tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: '32px 16px' }}>
          <thead>
            <tr>
              {columnas.map((c) => {
                const ordenado = estaOrdenado(c.anio)
                return (
                  <th key={c.anio} className={`fs-1 text-center border-0 ${classNameAnio}`}>
                    <span>{c.anio}</span>
                    <button
                      type='button'
                      className='btn btn-link text-white p-0 ms-3'
                      aria-pressed={ordenado}
                      aria-label={`Ordenar ${c.anio} de mayor a menor`}
                      title={ordenado ? 'Volver al orden de enero a diciembre' : 'Ordenar de mayor a menor'}
                      onClick={() => setordenAnio((actual) => ({ ...actual, [c.anio]: !ordenado }))}
                    >
                      <i className={`pi ${ordenado ? 'pi-sort-amount-down' : 'pi-sort-alt'} fs-2`} />
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {MESES_UPPER.map((_, fila) => (
              <tr key={fila}>
                {columnas.map((c) => {
                  const m = c.meses[fila]
                  return (
                    <td key={c.anio} className='p-0 border cursor-pointer' onClick={() => onClickItems(m.items)}>
                      <div className={`${classNameMes} py-2`}>{m.nombre}</div>
                      <div className='py-3'><NumberFormatMoney className='' amount={m.monto} /></div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
          <tfoot className='fw-bold'>
            <tr>
              {columnas.map((c) => (
                <td key={c.anio} className='py-3 border cursor-pointer' onClick={() => onClickItems(c.items)}>
                  <div>TOTAL ANUAL</div>
                  <div className='fs-1'><NumberFormatMoney className='' amount={c.total} /></div>
                </td>
              ))}
            </tr>
            <tr>
              {columnas.map((c) => (
                <td key={c.anio} className='py-3 border'>
                  <div>PROMEDIO MENSUAL</div>
                  <div><NumberFormatMoney className='' amount={c.promedio} /></div>
                </td>
              ))}
            </tr>
            <tr>
              <td colSpan={columnas.length} className='py-3 border cursor-pointer' onClick={() => onClickItems(itemsTotal)}>
                <div>TOTAL ACUMULADO</div>
                <div className='fs-1'><NumberFormatMoney className='' amount={sumar(itemsTotal)} /></div>
              </td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </div>
  )
}

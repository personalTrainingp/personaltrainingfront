import { NumberFormatMoney } from '@/components/CurrencyMask'
import React, { useEffect, useMemo } from 'react'
import { Table } from 'react-bootstrap'
import { useCuentasStore } from './hook/useCuentasStore'

export const TableCuentas = ({ bgTotal, mesesSeleccionadosNums = [], mesesNombres = [], idEmpresa, tipoCuenta, header }) => {
  const { dataCuentasBalance: dataCuentasPagar, obtenerCuentasBalance: obtenerCuentasPagar } = useCuentasStore()
  const { dataCuentasBalance: dataCuentasCobrar, obtenerCuentasBalance: obtenerCuentasCobrar } = useCuentasStore()

  useEffect(() => {
    obtenerCuentasPagar(idEmpresa, tipoCuenta)
    obtenerCuentasCobrar(idEmpresa, 'PorCobrar')
  }, [idEmpresa, tipoCuenta])

  // --- helpers ---
  const monthIndexFromISO = (iso) => {
    const d = new Date(iso)
    if (!Number.isFinite(d.getTime())) return null
    return d.getUTCMonth() + 1 // 1..12
  }

  // --- agrupar como la imagen: PRESTAMOS -> (razon_social_prov x mes) ---
  const tablePrestamos = useMemo(() => {
    const list = Array.isArray(dataCuentasPagar) ? dataCuentasPagar : []

    const label = list?.[0]?.concepto?.label_param || 'PRESTAMOS'

    const rowsMap = new Map()
    for (const item of list) {
      // si quieres filtrar SOLO PRESTAMOS:
      if (item?.concepto?.label_param !== 'PRESTAMOS') continue

      const proveedor = item?.tb_Proveedor?.razon_social_prov?.trim() || 'SIN PROVEEDOR'
      const mesNum = monthIndexFromISO(item?.fecha_comprobante)
      if (!mesNum) continue

      // Solo meses seleccionados
      if (!mesesSeleccionadosNums.includes(mesNum)) continue

      const monto = Number(item?.monto ?? 0) || 0

      if (!rowsMap.has(proveedor)) {
        const base = { proveedor, total: 0 }
        // init meses
        for (const m of mesesSeleccionadosNums) base[m] = 0
        rowsMap.set(proveedor, base)
      }

      const row = rowsMap.get(proveedor)
      row[mesNum] += monto
      row.total += monto
    }

    const rows = Array.from(rowsMap.values()).sort((a, b) =>
      a.proveedor.localeCompare(b.proveedor, 'es')
    )

    // totales por mes (fila final)
    const totalMes = {}
    for (const m of mesesSeleccionadosNums) totalMes[m] = 0
    let granTotal = 0

    for (const r of rows) {
      for (const m of mesesSeleccionadosNums) totalMes[m] += Number(r[m] || 0)
      granTotal += Number(r.total || 0)
    }

    return { label, rows, totalMes, granTotal }
  }, [dataCuentasPagar, mesesSeleccionadosNums])
  const totalesPorMes = Array(12).fill(0);
  const cuentasCobrar = dataCuentasCobrar.forEach(({ fecha_comprobante, monto }) => {
  const mes = new Date(fecha_comprobante).getMonth(); // 0 = Enero
  totalesPorMes[mes] += monto;
});

  const totalesPorMes1 = Array(12).fill(0);
  const cuentasPagar = dataCuentasPagar.forEach(({ fecha_comprobante, monto }) => {
  const mes = new Date(fecha_comprobante).getMonth(); // 0 = Enero
  totalesPorMes1[mes] += monto;
});
  return (
    <>
    {
        tablePrestamos.rows.length ===0 ? (<></>):(
            <>
                                    <p className='text-center' style={{fontSize: '60px'}}>{header}</p>
            <div className="table-responsive" style={{ width: '95vw' }}>
                <Table className="tabla-egresos" bordered>
                <colgroup>
                    <col style={{ width: 350 }} />
                    {mesesSeleccionadosNums.map((mesNum) => (
                    <col key={mesNum} style={{ width: 150 }} />
                    ))}
                    <col className={`${bgTotal}`} style={{ width: 150 }} />
                </colgroup>

                <thead className={`${bgTotal}`}>
                    <tr>
                    <th className={`fs-1 text-white`}>
                        <div className={`p-1 rounded rounded-3`}
                                            style={{
                                            width: 450,
                                            hyphens: 'auto',
                                            wordBreak: 'break-word',
                                            overflowWrap: 'break-word',
                                            whiteSpace: 'normal',
                                            lineHeight: '1.2',
                                            }}
                                            
                                            lang="es" >
                            {tablePrestamos.label}
                        </div>
                    </th>
                    {mesesNombres.map((m) => (
                        <th key={m} className="text-white text-center p-1 fs-2" style={{ background: '#0019ff' }}>
                        {m}
                        </th>
                    ))}
                    <th className={`text-white text-center fs-2 ${bgTotal}`} style={{ background: '#0019ff' }}>
                        TOTAL
                    </th>
                    </tr>
                </thead>

                <tbody>
                    {tablePrestamos.rows.length === 0 ? (
                    <tr>
                        <td colSpan={1 + mesesSeleccionadosNums.length + 1} className="text-center">
                        Sin datos
                        </td>
                    </tr>
                    ) : (
                    <>
                        {tablePrestamos.rows.map((row) => (
                        <tr key={row.proveedor}>
                            <td className="fw-bold fs-2 sticky-td" style={{color: `${bgTotal}`}}>
                                <div className="bg-white py-3">
                                    {row.proveedor}
                                </div>
                            </td>

                            {mesesSeleccionadosNums.map((mesNum) => (
                            <td key={mesNum} className="text-end">
                                <div className={`cursor-text-primary fs-2 bg-porsiaca text-right `}
                                                            style={{ width: 150 }}>
                                {row[mesNum] ? <NumberFormatMoney amount={row[mesNum]} /> : ''}

                                </div>
                            </td>
                            ))}

                            <td className={`text-end fw-bold ${bgTotal} fs-2`}>
                            {row.total ? <NumberFormatMoney amount={row.total} /> : ''}
                            </td>
                        </tr>
                        ))}

                        {/* fila total */}
                        <tr className={bgTotal}>
                        <td className="fw-bold fs-2"> <div className='fs-2'>
                            TOTAL
                            </div>
                            </td>

                        {mesesSeleccionadosNums.map((mesNum) => (
                            <td key={mesNum}  className="text-center fs-1" >
                                <div className={`cursor-text-primary fs-2 bg-porsiaca text-right ${bgTotal}`} style={{ width: 150 }}>
                                    {tablePrestamos.totalMes[mesNum]
                                        ? <NumberFormatMoney amount={tablePrestamos.totalMes[mesNum]} />
                                        : ''}
                                </div>
                            </td>
                        ))}

                        <td className="text-end fw-bold text-white fs-2">
                            {tablePrestamos.granTotal ? <NumberFormatMoney amount={tablePrestamos.granTotal} /> : ''}
                        </td>
                        </tr>
                    </>
                    )}
                </tbody>
                {
                    tipoCuenta==='PorCobrar'?(
                        <>
                        </>
                    ):(
                        <>
                                <tr>
                                    <td className="fw-bold fs-2 sticky-td">
                                        <div className="bg-white py-3 text-black">
                                            SALDO A PAGAR
                                        </div>
                                    </td>
                                    {totalesPorMes?.map((mesNum, i) => {
                                        
                                        return(
                                            <td
                                                key={mesNum}
                                                className="text-center fs-2 fw-bold"
                                                
                                            >
                                                <div  className={`bg-porsiaca text-right px-2 text-black`}>
                                                    <NumberFormatMoney amount={mesNum} />
                                                </div>
                                            </td>
                                        )
                                    }
                                    )}
                                    <td className="text-center fw-bolder" style={{fontSize: '35px'}}>
                                        <div className='bg-porsiaca text-right text-black'>
                                            <NumberFormatMoney amount={0} />
                                        </div>
                                    </td>
                                    <td className="text-center fw-bolder fs-1">
                                        <div className='bg-porsiaca text-right text-white'>
                                            100
                                        </div>
                                    </td>
                                </tr>
                        </>
                    )
                }
                </Table>
            </div>
            </>
        )
    }
    </>
  )
}

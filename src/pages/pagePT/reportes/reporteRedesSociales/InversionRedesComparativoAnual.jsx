import React, { useEffect, useMemo, useState } from 'react'
import { Table } from 'react-bootstrap'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/es'
import PTApi from '@/common/api/PTApi'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { generarMesYanio } from '../../FlujoCaja/helpers/generarMesYanio'

dayjs.extend(utc)

// Inversion en redes (tb_leadsDia: monto por dia y red) con el mismo formato de tabla que
// FLUJO DE CAJA > COMPARATIVO ANUAL > INGRESOS: filas por año, columnas por mes, TOTAL ANUAL y PROMEDIO MENSUAL.
// META se guarda en dolares: se muestra en soles (convertida con el tipo de cambio (TC) de la pagina) y en dolares.
// TIKTOK ya esta en soles. convertirConTC: multiplicar el monto guardado por el TC
const REDES = [
    { titulo: 'INVERSION META', moneda: 'S/', id_red: 1515, convertirConTC: true },
    { titulo: 'INVERSION META', moneda: 'USD $', id_red: 1515, convertirConTC: false },
    { titulo: 'INVERSION TIKTOK', moneda: 'S/', id_red: 1514, convertirConTC: false },
]
// mismo TC por defecto que el resumen ejecutivo
const TC_POR_DEFECTO = 3.37
const ANIO_ACTUAL = dayjs().year()
const ANIOS = Array.from({ length: ANIO_ACTUAL - 2024 + 1 }, (_, i) => ANIO_ACTUAL - i) // 2026, 2025, 2024
const ID_EMPRESA = 598
const classNameTotal = 'text-center border-left-10 border-right-10'
// los totales siempre mas grandes que los meses (como en TrItemVentas)
const fontSizeTotal = (esTotal) => (esTotal ? '55px' : '35px')
// cabecera de meses: fondo rojo, letras blancas (--bs-table-bg para que bootstrap no lo tape)
const ROJO = '#c00000'
const estiloMes = { width: '240px', backgroundColor: ROJO, '--bs-table-bg': ROJO, color: '#ffffff' }

// suma por red -> año -> mes (1..12). fecha llega como "YYYY-MM-DD 00:00:00 +00:00" = dia de Lima: se toma en UTC
const agruparInversion = (leads = []) => {
    const acc = {}
    for (const l of leads) {
        if (!l?.fecha) continue
        const f = dayjs.utc(l.fecha)
        const red = Number(l.id_red)
        acc[red] ??= {}
        acc[red][f.year()] ??= {}
        acc[red][f.year()][f.month() + 1] = (acc[red][f.year()][f.month() + 1] ?? 0) + Number(l.monto ?? 0)
    }
    return acc
}

// promedio mensual: entre los meses que tuvieron inversion (no castiga los meses sin pauta)
const promedio = (montos) => {
    const conInversion = montos.filter((m) => m > 0)
    return conInversion.length ? conInversion.reduce((t, m) => t + m, 0) / conInversion.length : 0
}

const TablaInversionRed = ({ titulo, moneda, porAnio = {}, factor = 1 }) => {
    const meses = generarMesYanio(new Date(ANIO_ACTUAL, 0, 1), new Date(ANIO_ACTUAL, 11, 31))
    const filas = ANIOS.map((anio) => {
        const montos = meses.map((m) => (porAnio[anio]?.[m.mes] ?? 0) * factor)
        return { label: String(anio), montos, total: montos.reduce((t, m) => t + m, 0), promedio: promedio(montos) }
    })
    const montosTodos = filas.flatMap((f) => f.montos)
    const filaTotal = { label: 'TOTAL ACUMULADO', total: montosTodos.reduce((t, m) => t + m, 0), promedio: promedio(montosTodos) }
    return (
        <div>
            <div style={{ fontSize: '70px' }} className='text-black text-center'>{titulo} <span className='fs-1'>({moneda})</span></div>
            <div className='tab-scroll-container'>
                <Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
                    <thead>
                        <tr>
                            <th style={{ width: '300px' }} className='fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white text-center'><div className='text-black text-center'>AÑO / MES</div></th>
                            {meses.map((e) => (
                                <th key={e.mes} className='text-center' style={estiloMes}>{e.mesSTR}</th>
                            ))}
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{ width: '340px' }}>TOTAL ANUAL</th>
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{ width: '340px' }}>PROMEDIO MENSUAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filas.map((f) => (
                            <tr key={f.label}>
                                <td className={`border-left-10 border-right-10 sticky-td-${ID_EMPRESA} text-center text-white fs-1`}>{f.label}</td>
                                {f.montos.map((m, i) => (
                                    <td key={i} className='text-center'><NumberFormatMoney className='fs-2' amount={m} /></td>
                                ))}
                                <td className={classNameTotal}><NumberFormatMoney className='' style={{ fontSize: fontSizeTotal(false) }} amount={f.total} /></td>
                                <td className={classNameTotal}><NumberFormatMoney className='' style={{ fontSize: fontSizeTotal(false) }} amount={f.promedio} /></td>
                            </tr>
                        ))}
                        <tr>
                            <td className={`border-left-10 border-right-10 sticky-td-${ID_EMPRESA} text-center text-white fs-1`}>{filaTotal.label}</td>
                            {meses.map((e) => <td key={e.mes}></td>)}
                            <td className={`${classNameTotal} border-bottom-10`}><NumberFormatMoney className='' style={{ fontSize: fontSizeTotal(true) }} amount={filaTotal.total} /></td>
                            <td className={`${classNameTotal} border-bottom-10`}><NumberFormatMoney className='' style={{ fontSize: fontSizeTotal(true) }} amount={filaTotal.promedio} /></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export const InversionRedesComparativoAnual = ({ tasaCambio }) => {
    const tc = Number(tasaCambio) || TC_POR_DEFECTO
    const [leads, setleads] = useState([])
    useEffect(() => {
        PTApi.get(`/lead/leads/${ID_EMPRESA}`)
            .then(({ data }) => setleads(data.leads ?? []))
            .catch((error) => console.log(error))
    }, [])
    const inversion = useMemo(() => agruparInversion(leads), [leads])
    return (
        <>
            {REDES.map((r) => (
                <TablaInversionRed key={`${r.id_red}-${r.moneda}`} titulo={r.titulo} moneda={r.moneda} porAnio={inversion[r.id_red]} factor={r.convertirConTC ? tc : 1} />
            ))}
        </>
    )
}

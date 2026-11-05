import React, { useEffect, useState } from 'react'
import { Form, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { usePlanillaStore } from './usePlanillaStore'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { arrayCargoEmpl } from '@/types/type'
import config from '@/config'
import sinAvatar from '@/assets/images/sinPhoto.jpg'
import { ModalReportAsistencia } from '../GestEmpleados/Perfil/ModalReportAsistencia'
import { MESES } from '../reportes/resumenEjecutivo/hooks/useResumenUtils'
dayjs.extend(utc)

const formatFecha = (fecha)=> fecha ? dayjs.utc(fecha).format('DD/MM/YYYY') : '-'
// Días del mes con que se calcula el sueldo por día
const DIAS_MES = 30
// Por el momento: faltas que se le quitan a cada uno por días no laborables (aún no cargados como feriados)
const FALTAS_NO_LABORABLES = 1
// Días que no asistió, sin contar los no laborables (mínimo 0). null / undefined si no se puede calcular
const diasNoAsistioDe = (c)=> typeof c.dias_no_asistio === 'number'
    ? Math.max(0, c.dias_no_asistio - FALTAS_NO_LABORABLES)
    : c.dias_no_asistio
// Descuento = días que no asistió x sueldo por día. null si no se puede calcular (sin sueldo o sin horario)
const descuentoDe = (c)=> c.sueldo!=null && typeof diasNoAsistioDe(c) === 'number'
    ? diasNoAsistioDe(c) * Number(c.sueldo) / DIAS_MES
    : null
const montoAPagarDe = (c)=>{
    const descuento = descuentoDe(c)
    return descuento === null ? null : Number(c.sueldo) - descuento
}
// Minutos trabajados por día (9 horas): el sueldo por minuto es proporcional a ellos
const MINUTOS_DIA = 9 * 60
const sueldoPorMinutoDe = (c)=> Number(c.sueldo) / DIAS_MES / MINUTOS_DIA
// Descuento por tardanza = minutos de tardanza x sueldo por minuto. null si no se puede calcular
const descuentoTardanzaDe = (c)=> c.sueldo!=null && typeof c.minutos_tardanza === 'number'
    ? c.minutos_tardanza * sueldoPorMinutoDe(c)
    : null
// Descuento por salidas tempranas sin goce de sueldo (registradas en perfil-colaborador)
const descuentoSalidaDe = (c)=> c.sueldo!=null ? (Number(c.minutos_salida_sin_goce) || 0) * sueldoPorMinutoDe(c) : 0
// Pago de horas extras = minutos x sueldo por minuto x recargo (1 = sin recargo)
const RECARGO_HORA_EXTRA = 1
const pagoHorasExtrasDe = (c)=> c.sueldo!=null ? (Number(c.minutos_extra) || 0) * sueldoPorMinutoDe(c) * RECARGO_HORA_EXTRA : 0
// Sueldo neto = monto a pagar (sin las faltas) - descuento por tardanza - salidas tempranas + horas extras
const sueldoNetoDe = (c)=>{
    const montoAPagar = montoAPagarDe(c)
    const descuentoTardanza = descuentoTardanzaDe(c)
    return montoAPagar === null || descuentoTardanza === null
        ? null
        : montoAPagar - descuentoTardanza - descuentoSalidaDe(c) + pagoHorasExtrasDe(c)
}
// "2 H 10 MIN"
const formatMinutos = (minutos)=>{
    const horas = Math.floor(minutos / 60)
    const resto = minutos % 60
    return [horas > 0 && `${horas} H`, (resto > 0 || horas === 0) && `${resto} MIN`].filter(Boolean).join(' ')
}
const labelJornada = (semanas)=> semanas >= 2 ? 'INTERSEMANA' : semanas === 1 ? 'SEMANAL' : 'SIN JORNADA'
const ANIO_INICIAL = 2024
const SIN_CONCEPTO = 'SIN CONCEPTO'
const INACTIVO_VIGENTE = 'PERSONAL INACTIVO CON CONTRATO VIGENTE'
// Vigente hoy: ya empezó y no tiene fecha fin, o aún no llega a ella
const contratoVigente = (c)=>{
    const hoy = dayjs().format('YYYY-MM-DD')
    return dayjs.utc(c.fecha_desde).format('YYYY-MM-DD') <= hoy
        && (!c.fecha_hasta || dayjs.utc(c.fecha_hasta).format('YYYY-MM-DD') >= hoy)
}
// Una sección por concepto del contrato vigente; los contratos sin concepto van al final
const agruparPorConcepto = (data)=>{
    const grupos = {}
    data.forEach((c)=>{
        const concepto = c.concepto || SIN_CONCEPTO
        if(!grupos[concepto]) grupos[concepto] = {concepto, id_gasto: c.id_gasto, filas: []}
        grupos[concepto].filas.push(c)
    })
    return Object.values(grupos).sort((a, b)=>
        (a.concepto === SIN_CONCEPTO) - (b.concepto === SIN_CONCEPTO) || a.id_gasto - b.id_gasto
    )
}
const sumar = (filas, valorDe)=> filas.reduce((total, c)=>total + (Number(valorDe(c)) || 0), 0)
// Fila de columnas: se repite debajo del título de cada concepto
const CabeceraColumnas = ()=>(
    <tr>
        <th className='bg-change text-white fs-5'>N°</th>
        <th className='bg-change text-white fs-5'>COLABORADOR</th>
        <th className='bg-change text-white fs-5'>CARGO</th>
        {/* <th className='bg-change text-white fs-5'>INGRESO</th> */}
        <th className='bg-change text-white fs-5'>HONORARIO</th>
        <th className='bg-change text-white fs-5'>COSTO <br/> POR DIA</th>
        <th className='bg-change text-white fs-5'>DIAS QUE <br/> NO ASISTIO</th>
        <th className='bg-change text-white fs-5'>DESCUENTO</th>
        {/* <th className='bg-change text-white fs-5'>MONTO A <br/> PAGAR</th> */}
        <th className='bg-change text-white fs-5'>MINUTOS DE <br/> TARDANZA</th>
        <th className='bg-change text-white fs-5'>DESCUENTO <br/> TARDANZA</th>
        <th className='bg-change text-white fs-5'>SALIDAS TEMPRANAS <br/> SIN GOCE</th>
        <th className='bg-change text-white fs-5'>HORAS <br/> EXTRAS</th>
        <th className='bg-change text-white fs-5'>PAGO <br/> NETO</th>
        <th className='bg-change text-white fs-5'>ASISTENCIAS</th>
    </tr>
)

// Colaboradores con contrato: el contrato (planilla) más reciente de cada uno
export const TablePlanilla = () => {
    const { obtenerColaboradoresConContrato, dataColaboradoresConContrato } = usePlanillaStore()
    const [verInactivos, setverInactivos] = useState(false)
    // contrato cuyas asistencias se están viendo
    const [contratoAsistencia, setcontratoAsistencia] = useState(null)
    const hoy = dayjs()
    const anioActual = hoy.year()
    const mesActual = hoy.month() + 1
    const [mes, setmes] = useState(mesActual)
    const [anio, setanio] = useState(anioActual)
    const anios = Array.from({length: anioActual - ANIO_INICIAL + 1}, (_, i)=>ANIO_INICIAL + i)
    useEffect(() => {
        obtenerColaboradoresConContrato(598, mes, anio)
    }, [mes, anio])
    // estado_empl es el estado de hoy: en un mes ya cerrado, quien hoy está inactivo igual trabajó en ese mes
    const mesCerrado = anio * 12 + mes < anioActual * 12 + mesActual
    const activos = dataColaboradoresConContrato.filter(c=>c.estado_empl || mesCerrado)
    const inactivosVigentes = dataColaboradoresConContrato.filter(c=>!c.estado_empl && !mesCerrado && contratoVigente(c))
    const inactivosSinVigencia = dataColaboradoresConContrato.filter(c=>!c.estado_empl && !mesCerrado && !contratoVigente(c))
    const data = [...activos, ...inactivosVigentes, ...(verInactivos ? inactivosSinVigencia : [])]
    const totalSueldos = data.reduce((total, c)=>total + (Number(c.sueldo) || 0), 0)
    const totalMontoAPagar = data.reduce((total, c)=>total + (montoAPagarDe(c) ?? 0), 0)
    const sinMontoAPagar = data.filter(c=>montoAPagarDe(c) === null).length
    const totalSueldoNeto = data.reduce((total, c)=>total + (sueldoNetoDe(c) ?? 0), 0)
    const inactivos = inactivosSinVigencia.length
    const grupos = [
        ...agruparPorConcepto(data.filter(c=>!inactivosVigentes.includes(c))),
        ...(inactivosVigentes.length > 0 ? [{concepto: INACTIVO_VIGENTE, filas: inactivosVigentes}] : []),
    ]
    const filasEnOrden = grupos.flatMap(g=>g.filas)

  return (
    <div>
        {/* <div className='d-flex align-items-center gap-4 mb-2'>
            <span className='fs-3 fw-bold'>
                {data.length} <span className='fs-4'>colaboradores con contrato</span>
            </span>
            <span className='fs-4'>
                TOTAL SUELDOS: <b><NumberFormatMoney amount={totalSueldos} className=''/></b>
            </span>
            <span className='fs-4' title={sinMontoAPagar > 0 ? `No incluye ${sinMontoAPagar} colaborador(es) sin horario o sin sueldo` : ''}>
                TOTAL A PAGAR: <b className='text-success'><NumberFormatMoney amount={totalMontoAPagar} className=''/></b>
                {sinMontoAPagar > 0 && <span className='fs-6 text-muted ms-1'>(no incluye {sinMontoAPagar} sin horario)</span>}
            </span>
            <span className='fs-4' title='Total a pagar - descuentos por tardanza'>
                TOTAL NETO: <b className='text-success'><NumberFormatMoney amount={totalSueldoNeto} className=''/></b>
            </span>
            {inactivos > 0 && (
                <div className='form-check mb-0'>
                    <input type='checkbox' className='form-check-input' id='verInactivos' checked={verInactivos} onChange={(e)=>setverInactivos(e.target.checked)}/>
                    <label className='form-check-label' htmlFor='verInactivos'>Ver también inactivos sin contrato vigente ({inactivos})</label>
                </div>
            )}
        </div> */}
        <div className='d-flex gap-3 mb-3'>
            <Form.Group controlId='planillaMes' style={{width: '220px'}}>
                <Form.Label className='fw-bold fs-5'>MES</Form.Label>
                <Form.Select value={mes} onChange={(e)=>setmes(Number(e.target.value))} className='fs-5 fw-bold'>
                    {MESES.map((nombre, i)=><option key={nombre} value={i + 1}>{nombre.toUpperCase()}</option>)}
                </Form.Select>
            </Form.Group>
            <Form.Group controlId='planillaAnio' style={{width: '140px'}}>
                <Form.Label className='fw-bold fs-5'>AÑO</Form.Label>
                <Form.Select value={anio} onChange={(e)=>setanio(Number(e.target.value))} className='fs-5 fw-bold'>
                    {anios.map(a=><option key={a} value={a}>{a}</option>)}
                </Form.Select>
            </Form.Group>
        </div>
        <Table className='bg-white mb-0' bordered responsive>
            <thead className='bg-change'>
                <tr>
                    <th className='text-white fs-3 text-center' colSpan={13}>
                        PLANILLA
                    </th>
                </tr>
            </thead>
            <tbody>
                {grupos.map(({concepto, filas})=>(
                <React.Fragment key={concepto}>
                    <tr>
                        <td className='fs-4 fw-bold text-center bg-change text-white' colSpan={13}>{concepto} ({filas.length})</td>
                    </tr>
                    <CabeceraColumnas/>
                    {filas.map((c)=>(
                        <tr key={c.id}>
                            <td className='fs-5'>{filasEnOrden.indexOf(c)+1}</td>
                            <td className='fs-5'>
                                <Link to={`/perfil-colaborador/${c.uid_empleado}`} className='fw-bold' style={{textDecoration: 'underline'}}>
                                    {[c.nombre_empl, c.apPaterno_empl, c.apMaterno_empl].filter(Boolean).join(' ')}
                                </Link>
                            </td>
                            <td className='fs-5'>{arrayCargoEmpl.find(f=>f.value===Number(c.cargo_empl))?.label ?? '-'}</td>
                            {/* <td className='fs-5'>{formatFecha(c.fecha_desde)}</td> */}
                            <td className='fs-4'>{c.sueldo!=null ? <NumberFormatMoney amount={c.sueldo} className=''/> : '-'}</td>
                            <td className='fs-4' title={`Sueldo / ${DIAS_MES} días`}>{c.sueldo!=null ? <NumberFormatMoney amount={Number(c.sueldo) / DIAS_MES} className=''/> : '-'}</td>
                            <td className='fs-5 fw-bold text-center'>
                                {diasNoAsistioDe(c) === null
                                    ? <span className='text-muted fw-normal'>SIN HORARIO</span>
                                    : diasNoAsistioDe(c) === undefined
                                        ? '-'
                                        : <span title={`${c.dias_no_asistio} de ${c.dias_laborables} días con horario hasta ayer, menos ${FALTAS_NO_LABORABLES} no laborable(s)`}>{diasNoAsistioDe(c)}</span>}
                                {c.dias_permiso_goce > 0 && <div className='text-muted fw-normal' style={{fontSize: '12px'}}>{c.dias_permiso_goce} con permiso</div>}
                            </td>
                            <td className='fs-4 fw-bold' title={`Días que no asistió x sueldo por día (sueldo / ${DIAS_MES})`}>
                                {descuentoDe(c) !== null ? <NumberFormatMoney amount={descuentoDe(c)} className='text-change'/> : '-'}
                            </td>
                            {/* <td className='fs-5 fw-bold text-success' title='Sueldo - descuento'>
                                {montoAPagarDe(c) !== null ? <NumberFormatMoney amount={montoAPagarDe(c)} className=''/> : '-'}
                            </td> */}
                            <td className='fs-4 text-center'>
                                {/* días asistidos con horario: primera marcación - hora de entrada */}
                                {c.minutos_tardanza === null
                                    ? <span className='text-muted'>SIN HORARIO</span>
                                    : c.minutos_tardanza === undefined
                                        ? '-'
                                        : (
                                            <span title={`${c.minutos_tardanza} min en ${c.dias_tardanza} día(s) con tardanza`}>
                                                <b className={c.minutos_tardanza > 0 ? 'text-change' : ''}>{c.minutos_tardanza} min</b>
                                                {c.dias_tardanza > 0 && <div className='text-muted' style={{fontSize: '12px'}}>{c.dias_tardanza} día(s)</div>}
                                                {c.minutos_tardanza_justificados > 0 && <div className='text-muted' style={{fontSize: '12px'}}>{c.minutos_tardanza_justificados} min justificados</div>}
                                            </span>
                                        )}
                            </td>
                            <td className='fs-4 fw-bold' title={c.sueldo!=null ? `${c.minutos_tardanza ?? 0} min x ${sueldoPorMinutoDe(c).toFixed(4)} por minuto (sueldo / ${DIAS_MES} / ${MINUTOS_DIA})` : ''}>
                                {descuentoTardanzaDe(c) !== null ? <NumberFormatMoney amount={descuentoTardanzaDe(c)} className='text-change'/> : '-'}
                            </td>
                            <td className='fs-4 text-center' title='Minutos x sueldo por minuto'>
                                {c.minutos_salida_sin_goce > 0
                                    ? <><NumberFormatMoney amount={descuentoSalidaDe(c)} className='text-change'/><div className='text-muted' style={{fontSize: '12px'}}>{formatMinutos(c.minutos_salida_sin_goce)}</div></>
                                    : '-'}
                            </td>
                            <td className='fs-4 text-center' title={`Minutos x sueldo por minuto x ${RECARGO_HORA_EXTRA}`}>
                                {c.minutos_extra > 0 && c.sueldo!=null
                                    ? <><NumberFormatMoney amount={pagoHorasExtrasDe(c)} className='text-ISESAC'/><div className='text-muted' style={{fontSize: '12px'}}>{formatMinutos(c.minutos_extra)}</div></>
                                    : '-'}
                            </td>
                            <td className='fs-4 fw-bold' title='Monto a pagar - descuento por tardanza - salidas tempranas sin goce + horas extras'>
                                {sueldoNetoDe(c) !== null ? <NumberFormatMoney amount={sueldoNetoDe(c)} className='text-ISESAC'/> : '-'}
                            </td>
                            <td className='fs-5'>
                                <a onClick={()=>setcontratoAsistencia(c)} className='text-primary fw-bold cursor-pointer' style={{textDecoration: 'underline'}}>VER</a>
                            </td>
                        </tr>
                    ))}
                    <tr className='fw-bold'>
                        <td className='fs-4 bg-change text-white' colSpan={3}>TOTAL {concepto}</td>
                        <td className='fs-4 bg-change text-white'><NumberFormatMoney amount={sumar(filas, c=>c.sueldo)} className=''/></td>
                        <td className='bg-change' colSpan={7}></td>
                        <td className='fs-4 bg-change text-white'><NumberFormatMoney amount={sumar(filas, sueldoNetoDe)} className=''/></td>
                        <td className='bg-change'></td>
                    </tr>
                </React.Fragment>
                ))}
            </tbody>
            <tfoot>
                <tr className='fw-bold'>
                    <td className='fs-5 bg-change text-white' colSpan={3}>TOTAL GENERAL</td>
                    <td className='fs-3 bg-change text-white'><NumberFormatMoney amount={totalSueldos} className=''/></td>
                    <td className='bg-change' colSpan={7}></td>
                    <td className='fs-3 bg-change text-white'><NumberFormatMoney amount={totalSueldoNeto} className=''/></td>
                    <td className='bg-change'></td>
                </tr>
            </tfoot>
        </Table>
        <ModalReportAsistencia
            show={contratoAsistencia!==null}
            onHide={()=>setcontratoAsistencia(null)}
            uid_empl={contratoAsistencia?.uid_empleado}
            id_planilla={contratoAsistencia?.id ?? 0}
            avatarImage={contratoAsistencia?.avatar ? `${config.API_IMG.AVATAR_EMPL}${contratoAsistencia.avatar}` : sinAvatar}
        />
    </div>
  )
}

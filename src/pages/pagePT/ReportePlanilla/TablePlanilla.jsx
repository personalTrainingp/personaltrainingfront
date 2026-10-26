import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { usePlanillaStore } from './usePlanillaStore'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { arrayCargoEmpl } from '@/types/type'
import config from '@/config'
import sinAvatar from '@/assets/images/sinPhoto.jpg'
import { ModalReportAsistencia } from '../GestEmpleados/Perfil/ModalReportAsistencia'
dayjs.extend(utc)

const formatFecha = (fecha)=> fecha ? dayjs.utc(fecha).format('DD/MM/YYYY') : '-'
// Días del mes con que se calcula el sueldo por día
const DIAS_MES = 31
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
// Sueldo neto = monto a pagar (sin las faltas) - descuento por tardanza
const sueldoNetoDe = (c)=>{
    const montoAPagar = montoAPagarDe(c)
    const descuentoTardanza = descuentoTardanzaDe(c)
    return montoAPagar === null || descuentoTardanza === null ? null : montoAPagar - descuentoTardanza
}
const labelJornada = (semanas)=> semanas >= 2 ? 'INTERSEMANA' : semanas === 1 ? 'SEMANAL' : 'SIN JORNADA'

// Colaboradores con contrato: el contrato (planilla) más reciente de cada uno
export const TablePlanilla = () => {
    const { obtenerColaboradoresConContrato, dataColaboradoresConContrato } = usePlanillaStore()
    const [verInactivos, setverInactivos] = useState(false)
    // contrato cuyas asistencias se están viendo
    const [contratoAsistencia, setcontratoAsistencia] = useState(null)
    useEffect(() => {
        obtenerColaboradoresConContrato(598)
    }, [])
    const data = verInactivos ? dataColaboradoresConContrato : dataColaboradoresConContrato.filter(c=>c.estado_empl)
    const totalSueldos = data.reduce((total, c)=>total + (Number(c.sueldo) || 0), 0)
    const totalMontoAPagar = data.reduce((total, c)=>total + (montoAPagarDe(c) ?? 0), 0)
    const sinMontoAPagar = data.filter(c=>montoAPagarDe(c) === null).length
    const totalSueldoNeto = data.reduce((total, c)=>total + (sueldoNetoDe(c) ?? 0), 0)
    const inactivos = dataColaboradoresConContrato.length - dataColaboradoresConContrato.filter(c=>c.estado_empl).length

  return (
    <div>
        <div className='d-flex align-items-center gap-4 mb-2'>
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
                    <label className='form-check-label' htmlFor='verInactivos'>Ver también inactivos ({inactivos})</label>
                </div>
            )}
        </div>
        <Table className='bg-white mb-0' bordered hover responsive>
            <thead className='bg-change'>
                <tr>
                    <th className='text-white fs-3 text-center' colSpan={18}>
                        PLANILLA
                    </th>
                </tr>
                <tr>
                    <th className='text-white fs-5'>N°</th>
                    <th className='text-white fs-5'>COLABORADOR</th>
                    <th className='text-white fs-5'>CARGO</th>
                    <th className='text-white fs-5'>FECHA DESDE</th>
                    <th className='text-white fs-5'>SUELDO</th>
                    <th className='text-white fs-5'>SUELDO <br/> POR DIA</th>
                    <th className='text-white fs-5'>DIAS QUE <br/> NO ASISTIO</th>
                    <th className='text-white fs-5'>DESCUENTO</th>
                    <th className='text-white fs-5'>MONTO A <br/> PAGAR</th>
                    <th className='text-white fs-5'>MINUTOS DE <br/> TARDANZA</th>
                    <th className='text-white fs-5'>DESCUENTO <br/> TARDANZA</th>
                    <th className='text-white fs-5'>SUELDO <br/> NETO</th>
                    <th className='text-white fs-5'>ASISTENCIAS</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((c, i)=>(
                        <tr key={c.id}>
                            <td className='fs-6'>{i+1}</td>
                            <td className='fs-6'>
                                <Link to={`/perfil-colaborador/${c.uid_empleado}`} className='fw-bold' style={{textDecoration: 'underline'}}>
                                    {[c.nombre_empl, c.apPaterno_empl, c.apMaterno_empl].filter(Boolean).join(' ')}
                                </Link>
                            </td>
                            <td className='fs-6'>{arrayCargoEmpl.find(f=>f.value===Number(c.cargo_empl))?.label ?? '-'}</td>
                            <td className='fs-6'>{formatFecha(c.fecha_desde)}</td>
                            <td className='fs-6'>{c.sueldo!=null ? <NumberFormatMoney amount={c.sueldo} className=''/> : '-'}</td>
                            <td className='fs-6' title={`Sueldo / ${DIAS_MES} días`}>{c.sueldo!=null ? <NumberFormatMoney amount={Number(c.sueldo) / DIAS_MES} className=''/> : '-'}</td>
                            <td className='fs-6 fw-bold text-center'>
                                {/* según el horario del contrato (editar jornada); sin horario no se puede calcular */}
                                {diasNoAsistioDe(c) === null
                                    ? <span className='text-muted fw-normal'>SIN HORARIO</span>
                                    : diasNoAsistioDe(c) === undefined
                                        ? '-'
                                        : <span title={`${c.dias_no_asistio} de ${c.dias_laborables} días con horario hasta ayer, menos ${FALTAS_NO_LABORABLES} no laborable(s)`}>{diasNoAsistioDe(c)}</span>}
                            </td>
                            <td className='fs-6 fw-bold text-danger' title={`Días que no asistió x sueldo por día (sueldo / ${DIAS_MES})`}>
                                {descuentoDe(c) !== null ? <NumberFormatMoney amount={descuentoDe(c)} className=''/> : '-'}
                            </td>
                            <td className='fs-6 fw-bold text-success' title='Sueldo - descuento'>
                                {montoAPagarDe(c) !== null ? <NumberFormatMoney amount={montoAPagarDe(c)} className=''/> : '-'}
                            </td>
                            <td className='fs-6 text-center'>
                                {/* días asistidos con horario: primera marcación - hora de entrada */}
                                {c.minutos_tardanza === null
                                    ? <span className='text-muted'>SIN HORARIO</span>
                                    : c.minutos_tardanza === undefined
                                        ? '-'
                                        : (
                                            <span title={`${c.minutos_tardanza} min en ${c.dias_tardanza} día(s) con tardanza`}>
                                                <b className={c.minutos_tardanza > 0 ? 'text-danger' : ''}>{c.minutos_tardanza} min</b>
                                                {c.dias_tardanza > 0 && <div className='text-muted' style={{fontSize: '12px'}}>{c.dias_tardanza} día(s)</div>}
                                            </span>
                                        )}
                            </td>
                            <td className='fs-6 fw-bold text-danger' title={c.sueldo!=null ? `${c.minutos_tardanza ?? 0} min x ${sueldoPorMinutoDe(c).toFixed(4)} por minuto (sueldo / ${DIAS_MES} / ${MINUTOS_DIA})` : ''}>
                                {descuentoTardanzaDe(c) !== null ? <NumberFormatMoney amount={descuentoTardanzaDe(c)} className=''/> : '-'}
                            </td>
                            <td className='fs-6 fw-bold text-success' title='Monto a pagar - descuento por tardanza'>
                                {sueldoNetoDe(c) !== null ? <NumberFormatMoney amount={sueldoNetoDe(c)} className=''/> : '-'}
                            </td>
                            <td className='fs-6'>
                                <a onClick={()=>setcontratoAsistencia(c)} className='text-primary fw-bold cursor-pointer' style={{textDecoration: 'underline'}}>VER</a>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
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

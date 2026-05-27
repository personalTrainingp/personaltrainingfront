import { PageBreadcrumb } from '@/components'
import { useSeguimientoOficialStore } from '@/hooks/useSeguimientoOficialStore';
import React, { useEffect } from 'react'
import { Col, Row, Table } from 'react-bootstrap';
import { generarHoras } from './generarHoras';
import dayjs from 'dayjs';
import { NumberFormatMoney } from '@/components/CurrencyMask';
export const ReporteSeguimiento = () => {
    // const { obtenerSeguimientoxFecha, dataSeguimientoxFecha } = useSeguimientoOficialStore()
    // useEffect(() => {
    //     obtenerSeguimientoxFecha(["2026-05-23T12:00:00.000Z", "2030-03-16T12:00:00.000Z"])
    // }, [])
    const dataImaginaria = [
        {horario: '05:00', len: 12, nombre_programa: 'CHANGE 45'},
        {horario: '06:00', len: 16, nombre_programa: 'CHANGE 45'},
        {horario: '07:00', len: 16, nombre_programa: 'CHANGE 45'},
        {horario: '08:00', len: 16, nombre_programa: 'CHANGE 45'},
        {horario: '09:00', len: 7, nombre_programa: 'CHANGE 45'},
        {horario: '10:00', len: 7, nombre_programa: 'CHANGE 45'},
        {horario: '11:00', len: 7, nombre_programa: 'CHANGE 45'},
        {horario: '13:00', len: 7, nombre_programa: 'CHANGE 45'},
        {horario: '17:00', len: 8, nombre_programa: 'CHANGE 45'},
        {horario: '18:00', len: 8, nombre_programa: 'CHANGE 45'},
        {horario: '19:00', len: 16, nombre_programa: 'CHANGE 45'},
        {horario: '20:00', len: 16, nombre_programa: 'CHANGE 45'},
        {horario: '21:00', len: 16, nombre_programa: 'CHANGE 45'},
        // 
        {horario: '05:30', len: 14, nombre_programa: 'CHANGE 45-2'},
        {horario: '06:30', len: 16, nombre_programa: 'CHANGE 45-2'},
        {horario: '07:30', len: 16, nombre_programa: 'CHANGE 45-2'},
        {horario: '08:30', len: 16, nombre_programa: 'CHANGE 45-2'},
        {horario: '09:30', len: 7, nombre_programa: 'CHANGE 45-2'},
        {horario: '10:30', len: 7, nombre_programa: 'CHANGE 45-2'},
        {horario: '11:30', len: 7, nombre_programa: 'CHANGE 45-2'},
        {horario: '13:30', len: 15, nombre_programa: 'CHANGE 45-2'},
        {horario: '17:30', len: 8, nombre_programa: 'CHANGE 45-2'},
        {horario: '18:30', len: 16, nombre_programa: 'CHANGE 45-2'},
        {horario: '19:30', len: 16, nombre_programa: 'CHANGE 45-2'},
        {horario: '20:30', len: 16, nombre_programa: 'CHANGE 45-2'},
        // 
        {horario: '05:00', len: 10, nombre_programa: 'FS 45'},
        {horario: '06:00', len: 10, nombre_programa: 'FS 45'},
        {horario: '07:00', len: 10, nombre_programa: 'FS 45'},
        {horario: '08:00', len: 4, nombre_programa: 'FS 45'},
        {horario: '09:00', len: 4, nombre_programa: 'FS 45'},
        {horario: '10:00', len: 4, nombre_programa: 'FS 45'},
        {horario: '11:00', len: 4, nombre_programa: 'FS 45'},
        {horario: '17:00', len: 5, nombre_programa: 'FS 45'},
        {horario: '18:00', len: 5, nombre_programa: 'FS 45'},
        {horario: '19:00', len: 10, nombre_programa: 'FS 45'},
        {horario: '20:00', len: 10, nombre_programa: 'FS 45'},
        {horario: '21:00', len: 10, nombre_programa: 'FS 45'},
        // 
        {horario: '05:00', len: 12, nombre_programa: 'FISIO MUSCLE'},
        {horario: '06:00', len: 12, nombre_programa: 'FISIO MUSCLE'},
        {horario: '07:00', len: 12, nombre_programa: 'FISIO MUSCLE'},
        {horario: '08:00', len: 4, nombre_programa: 'FISIO MUSCLE'},
        {horario: '09:00', len: 4, nombre_programa: 'FISIO MUSCLE'},
        {horario: '10:00', len: 4, nombre_programa: 'FISIO MUSCLE'},
        {horario: '11:00', len: 4, nombre_programa: 'FISIO MUSCLE'},
        {horario: '17:00', len: 5, nombre_programa: 'FISIO MUSCLE'},
        {horario: '18:00', len: 5, nombre_programa: 'FISIO MUSCLE'},
        {horario: '19:00', len: 10, nombre_programa: 'FISIO MUSCLE'},
        {horario: '20:00', len: 10, nombre_programa: 'FISIO MUSCLE'},
        {horario: '21:00', len: 10, nombre_programa: 'FISIO MUSCLE'},
    ]
    const dataHorarios = [
        // ...dataSeguimiento,
        ...dataImaginaria
    ]
    // const dataSeguimiento = agruparPorHora(dataSeguimientoxFecha).map(m=>{
    //     return {
    //         nombre_programa: m.items[0].nombre_programa,
    //         len: m.items.length,
    //         horario: m.items[0].horario
    //     }
    // })
    const dataSemanas = [
            { semana: 12, porc: 51.47, ticket_medio: 1231, pgm: 'CHANGE 45' },
            { semana: 16, porc: 21.02, ticket_medio: 1461, pgm: 'CHANGE 45' },
            { semana: 24, porc: 13.03, ticket_medio: 1846, pgm: 'CHANGE 45' },
            { semana: 48, porc: 5.73, ticket_medio: 2956, pgm: 'CHANGE 45' },
            { semana: 4, porc: 5.8, ticket_medio: 443, pgm: 'CHANGE 45' },
            { semana: 8, porc: 2.95, ticket_medio: 711, pgm: 'CHANGE 45' },

            { semana: 24, porc: 40.77, ticket_medio: 1764, pgm: 'FS 45' },
            { semana: 12, porc: 32.62, ticket_medio: 1170, pgm: 'FS 45' },
            { semana: 16, porc: 16.94, ticket_medio: 1385, pgm: 'FS 45' },
            { semana: 4, porc: 6.16, ticket_medio: 452, pgm: 'FS 45' },
            { semana: 48, porc: 2.04, ticket_medio: 2999, pgm: 'FS 45' },
            { semana: 8, porc: 1.47, ticket_medio: 719, pgm: 'FS 45' },

            { semana: 12, porc: 44.81, ticket_medio: 1191, pgm: 'FISIO MUSCLE' },
            { semana: 24, porc: 23.76, ticket_medio: 1858, pgm: 'FISIO MUSCLE' },
            { semana: 16, porc: 17.35, ticket_medio: 1442, pgm: 'FISIO MUSCLE' },
            { semana: 48, porc: 6.09, ticket_medio: 2699, pgm: 'FISIO MUSCLE' },
            { semana: 4, porc: 5.63, ticket_medio: 576, pgm: 'FISIO MUSCLE' },
            { semana: 8, porc: 2.36, ticket_medio: 627, pgm: 'FISIO MUSCLE' },
    ]
    const filtroChange = dataSemanas.filter(f=>f.pgm==='CHANGE 45')
    const semanasConPgm = [...dataSemanas, ...filtroChange.map(m=>{return {...m, pgm: 'CHANGE 45-2'}})]
  return (
    <>
        <PageBreadcrumb subName={'T'} title={'CUPOS DISPONIBLES DE VENTAS POR TURNO'}/>
        <div className='d-flex flex-column align-items-center justify-content-center'>
            <h1 style={{fontSize: '70px'}} className='text-center d-flex flex-column'>CHANGE 45 <span className='' style={{fontSize: '45px'}}>(TURNO OPTIMO PROYECTADO)</span></h1>
                <TableHorario dataSeguimientoxFecha={dataHorarios} nombre_pgm={'CHANGE 45'} horaInicio='05:00' horaFin='21:00'/>
                <TableVentas semanas={semanasConPgm} dataSeguimientoxFecha={dataHorarios} nombre_pgm={'CHANGE 45'} horaInicio='05:30' horaFin='20:30'/>
            
            <h1 style={{marginTop: '100px', fontSize: '70px'}} className='text-center d-flex flex-column'>CHANGE 45  <span className='' style={{fontSize: '45px'}}>(TURNO PROYECTADO MEDIAS HORAS)</span></h1>
                <TableHorario dataSeguimientoxFecha={dataHorarios} nombre_pgm={'CHANGE 45-2'} className={'bg-change-pastel'} horaInicio='05:30' horaFin='20:30'/>
                <TableVentas semanas={semanasConPgm} dataSeguimientoxFecha={dataHorarios} nombre_pgm={'CHANGE 45-2'} className={'bg-change-pastel'} horaInicio='05:30' horaFin='20:30'/>
            
            <h1 style={{fontSize: '70px', marginTop: '100px'}} className='text-center'>FS 45</h1>
            <TableHorario dataSeguimientoxFecha={dataHorarios} nombre_pgm={'FS 45'} horaInicio='05:00' horaFin='21:00'/>
            <TableVentas semanas={semanasConPgm} dataSeguimientoxFecha={dataHorarios} nombre_pgm={'FS 45'} horaInicio='05:30' horaFin='20:30'/>
            
            <h1 style={{fontSize: '70px', marginTop: '100px'}} className='text-center'>FISIO MUSCLE</h1>
            <TableHorario dataSeguimientoxFecha={dataHorarios} nombre_pgm={'FISIO MUSCLE'} horaInicio='05:00' horaFin='21:00'/>
            <TableVentas semanas={semanasConPgm} dataSeguimientoxFecha={dataHorarios} nombre_pgm={'FISIO MUSCLE'} horaInicio='05:30' horaFin='20:30'/>
        </div>
    </>
  )
}

function agruparPorAA(data) {
  const grupos = {};

  data?.forEach(item => {
    const nombre_fp = `${dayjs(item.horario, 'HH:mm').format('A')}` || 'AA';
    if (!grupos[nombre_fp]) {
      grupos[nombre_fp] = {
        nombre_fp,
        items: []
      };
    }
    grupos[nombre_fp].items.push(item);
  });
  return Object.values(grupos);
}

function agruparPorHora(data) {
  const grupos = {};

  data?.forEach(item => {
    const nombre_fp = `${item?.horario} | ${item.nombre_programa}` || '00:00 | SIN';
    if (!grupos[nombre_fp]) {
      grupos[nombre_fp] = {
        nombre_fp,
        items: []
      };
    }
    grupos[nombre_fp].items.push(item);
  });
  return Object.values(grupos);
}

export const TableHorario = ({nombre_pgm, dataSeguimientoxFecha, horaInicio='05:00', horaFin='21:00', className='bg-change'}) => {
  return (
    <>
    <div >
        <Table className='tabla-egresos' >
                <thead>
                    <tr>
                        <th className={`${className} text-white fs-3`}>TURNOS</th>
                        {
                            agruparPorAA(generarHoras(horaInicio, horaFin, 60).filter(f=>f.hora!=='12'&&f.hora!=='14'&& f.hora!=='15' && f.hora!=='16')).map(m=>(
                                <th colSpan={m.items.length} className={`${className} fs-3 text-white text-center`}>{m.nombre_fp}</th>
                            ))
                        }
                        <th className={` ${className} text-white fs-3`}>TOTAL</th>
                    </tr>
                    <tr>
                        <th className={`${className} text-white fs-3`}>HORARIOS</th>
                        {
                            generarHoras(horaInicio, horaFin, 60).filter(f=>f.hora!=='12'&&f.hora!=='14'&& f.hora!=='15' && f.hora!=='16').map(m=>(
                                <th className={`${className} text-white fs-3`}>{dayjs(m.horario, 'HH:mm').format('h:mm')}</th>
                            ))
                        }
                        <th className={`${className} text-white fs-3`}></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th className={`${className} text-white fs-3`}>ESTACIÓN 1 / MIN</th>
                        {
                            generarHoras(horaInicio, horaFin, 60).filter(f=>f.hora!=='12'&&f.hora!=='14'&& f.hora!=='15' && f.hora!=='16').map(m=>(
                                <td className='fs-3 text-center'>{'25'}</td>
                            ))
                        }
                        <td className={`${className} fs-3 text-white text-center`}>25</td>
                    </tr>
                    <tr>
                        <td className={`${className} text-white fs-3`}>ESTACIÓN 2 / MIN</td>
                        {
                            generarHoras(horaInicio, horaFin, 60).filter(f=>f.hora!=='12'&&f.hora!=='14'&& f.hora!=='15' && f.hora!=='16').map(m=>(
                                <td className='fs-3 text-center'>{'20'}</td>
                            ))
                        }
                        <td className={`${className} fs-3 text-white text-center`}>20</td>
                    </tr>
                    <tr>
                        <td className={`${className} text-white fs-3`}>{'TERMINO'}</td>
                        {
                            generarHoras(horaInicio, horaFin, 60).filter(f=>f.hora!=='12'&&f.hora!=='14'&& f.hora!=='15' && f.hora!=='16').map(m=>(
                                <td className='fs-3'>{dayjs(m.horario, 'HH:mm').add(45, 'minute').format('h:mm')}</td>
                            ))
                        }
                        <td className={`${className} fs-3`}></td>
                    </tr>
                    <tr>
                        <td className={`${className} text-white fs-3`}>AFORO</td>
                        {
                            generarHoras(horaInicio, horaFin, 60).filter(f=>f.hora!=='12'&&f.hora!=='14'&& f.hora!=='15' && f.hora!=='16').map(m=>(
                                <td className='text-center fs-3'>{dataSeguimientoxFecha.filter(f=>f.horario===m.horario && f.nombre_programa===nombre_pgm).reduce((total, item)=>total+item.len,0)}</td>
                            ))
                        }
                        <td className={`${className} text-white fs-3 text-center`}>
                            {
                                generarHoras(horaInicio, horaFin, 60).filter(f=>f.hora!=='12'&&f.hora!=='14'&& f.hora!=='15' && f.hora!=='16').map(m=>{
                                    const dataH = dataSeguimientoxFecha.filter(f=>f.horario===m.horario && f.nombre_programa===nombre_pgm).reduce((total, item)=>total+item.len,0)
                                    return {
                                        len1: Number(dataH)
                                    }
                                }).reduce((total, item)=>total+item.len1,0)
                            }
                        </td>
                    </tr>
                    <tr>
                        <td className={`${className} text-white fs-3`}>AUSENTISMO</td>
                        {
                            generarHoras(horaInicio, horaFin, 60).filter(f=>f.hora!=='12'&&f.hora!=='14'&& f.hora!=='15' && f.hora!=='16').map(m=>(
                                <td className='text-center fs-3'>{(dataSeguimientoxFecha.filter(f=>f.horario===m.horario && f.nombre_programa===nombre_pgm).reduce((total, item)=>total+item.len,0)/3).toFixed(0)}</td>
                            ))
                        }
                        <td className={`${className} text-white fs-3 text-center`}>
                            {
                                generarHoras(horaInicio, horaFin, 60).filter(f=>f.hora!=='12'&&f.hora!=='14'&& f.hora!=='15' && f.hora!=='16').map(m=>{
                                    const dataH = dataSeguimientoxFecha.filter(f=>f.horario===m.horario && f.nombre_programa===nombre_pgm).reduce((total, item)=>total+item.len,0)/3
                                    return {
                                        len1: Number(dataH)
                                    }
                                }).reduce((total, item)=>total+item.len1,0).toFixed(0)
                            }
                        </td>
                    </tr>
                    <tr>
                        <td className={`${className} text-white fs-3`}>TOTAL AFORO</td>
                        {
                            generarHoras(horaInicio, horaFin, 60).filter(f=>f.hora!=='12'&&f.hora!=='14'&& f.hora!=='15' && f.hora!=='16').map(m=>{
                                const seguimiento = dataSeguimientoxFecha.filter(f=>f.horario===m.horario && f.nombre_programa===nombre_pgm).reduce((total, item)=>total+item.len,0)
                                return (
                                    <td className='text-center fs-3'>{Number(seguimiento+Number((seguimiento/3).toFixed(0)))}</td>
                                )
                            })
                        }
                        
                        <td className={`${className} text-white text-center fs-2`}>
                            {
                                generarHoras(horaInicio, horaFin, 60).filter(f=>f.hora!=='12'&&f.hora!=='14'&& f.hora!=='15' && f.hora!=='16').map(m=>{
                                    const seguimiento = dataSeguimientoxFecha.filter(f=>f.horario===m.horario && f.nombre_programa===nombre_pgm).reduce((total, item)=>total+item.len,0)
                                    return {
                                        len1: Number(seguimiento+Number((seguimiento/3)))
                                    }
                                }).reduce((total, item)=>total+item.len1,0).toFixed(0)
                            }
                        </td>
                    </tr>
                </tbody>
        </Table>
    </div>
    </>
  )
}

export const TableVentas = ({nombre_pgm='', semanas=[], dataSeguimientoxFecha, horaInicio='05:00', horaFin='21:00', className='bg-change'}) => {
    const data = semanas.filter(f=>f.pgm===nombre_pgm)
    const seg = Number(dataSeguimientoxFecha.filter(f=>f.nombre_programa===nombre_pgm).reduce((total, item)=>total+item.len, 0))
    const ventasProy = Number((seg+Number(seg/3)))
    const dataT = data.map(m=>{
        return {
            ...m,
            consolidado: (m.ticket_medio*(m.porc/100)*ventasProy),
            prom_mensual: ((m.ticket_medio*(m.porc/100)*ventasProy)/(m.semana/4))
        }
    })
    const sumaPorc = dataT.reduce((total, item)=>total+item.porc, 0).toFixed(2)
    const sumaticketMedio = dataT.reduce((total, item)=>total+item.ticket_medio, 0)
    const sumaconsolidado = dataT.reduce((total, item)=>total+item.consolidado, 0)
    const sumapromMensual = dataT.reduce((total, item)=>total+item.prom_mensual, 0)
    const ticketCambiar = 1420
  return (
    <>
        <div className='d-flex justify-content-center flex-column'>
            <div className='d-flex'>
                <Table className='tabla-egresos m-1' >
                        <tbody>
                            <tr>
                                <th className={`text-white fs-3 text-center ${className}`}>VENTA MAXIMA SEGUN AFORO</th>
                                <td className={`text-white fs-3 text-center ${className}`}><span className='fs-2'>{Number((seg+Number(seg/3))).toFixed(0)}</span></td>
                            </tr>
                        </tbody>
                </Table>
                <Table className='tabla-egresos m-1' >
                        <tbody>
                            <tr>
                                <td className={`text-white fs-3 text-center ${className}`}>TICKET PROMEDIO PROYECTADO</td>
                                <td className={`text-white fs-3 text-center ${className}`}><NumberFormatMoney amount={ticketCambiar}/></td>
                            </tr>
                        </tbody>
                </Table>
                <Table className='tabla-egresos m-1' >
                        <tbody>
                            <tr>
                                <td className={`text-white fs-3 text-center ${className}`}>TOTAL PROYECTADO</td>
                                <td className={`text-white fs-3 text-center ${className}`}><NumberFormatMoney amount={sumaconsolidado}/></td>
                            </tr>
                        </tbody>
                </Table>
            </div>
            <div className='d-flex align-items-center text-center justify-content-center'>
                <Table className='tabla-egresos' >
                    <thead>
                        <tr>
                            <th className={`text-white fs-3 ${className}`}>PLAN</th>
                            <th className={`text-white fs-3 ${className}`}>%</th>
                            <th className={`text-white fs-3 ${className}`}>TICKET MEDIO <br/> S/.</th>
                            <th className={`text-white fs-3 ${className}`}>CONSOLIDADO <br/> S/.</th>
                            <th className={`text-white fs-3 ${className}`}>PROM. MENSUAL <br/> S/.</th>
                        </tr>
                    </thead>
                        <tbody>
                            {
                                data.map(m=>{
                                    return (
                                        <tr>
                                            <td className={`text-white fs-2 text-center ${className}`}>{m.semana} semanas</td>
                                            <td>
                                                <NumberFormatMoney
                                                    amount=
                                                    {((m.porc)).toFixed(2)}
                                                />
                                            </td>
                                            <td>
                                                <NumberFormatMoney
                                                    amount=
                                                    {(m.ticket_medio).toFixed(2)}
                                                />
                                            </td>
                                            <td>
                                                <NumberFormatMoney
                                                    amount=
                                                {(m.ticket_medio*(m.porc/100)*ventasProy).toFixed(2)}
                                                />
                                            </td>
                                            <td>
                                                <NumberFormatMoney
                                                    amount=
                                                    {((m.ticket_medio*(m.porc/100)*ventasProy)/(m.semana/4)).toFixed(2)}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td className={`text-white fs-2 text-center ${className}`}>TOTAL</td>
                                <td className={`text-white fs-2 text-center ${className}`}><NumberFormatMoney amount={sumaPorc}/></td>
                                <td className={`text-white fs-2 text-center ${className}`}><NumberFormatMoney amount={sumaticketMedio/dataT.length}/></td>
                                <td className={`text-white fs-2 text-center ${className}`}>
                                    <NumberFormatMoney
                                        amount=
                                        {sumaconsolidado}
                                    />
                                </td>
                                <td className={`text-white fs-2 text-center ${className}`}>
                                    <NumberFormatMoney
                                        amount=
                                        {sumapromMensual}
                                    />
                                </td>
                            </tr>
                        </tbody>
                </Table>
            </div>
        </div>
    </>
  )
}
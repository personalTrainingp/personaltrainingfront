import { PageBreadcrumb } from '@/components'
import { useSeguimientoOficialStore } from '@/hooks/useSeguimientoOficialStore';
import React, { useEffect } from 'react'
import { Col, Row, Table } from 'react-bootstrap';
import { generarHoras } from './generarHoras';
import dayjs from 'dayjs';
import { NumberFormatMoney } from '@/components/CurrencyMask';
export const ReporteSeguimiento = () => {
    const { obtenerSeguimientoxFecha, dataSeguimientoxFecha, obtenerVentasMembresias,  } = useSeguimientoOficialStore()
    useEffect(() => {
        obtenerSeguimientoxFecha(["2026-05-29T12:00:00.000Z", "2030-03-16T12:00:00.000Z"])
    }, [])
    
    const dataImaginaria = [
        {horario: '05:00', len: 12, nombre_programa: 'CHANGE 45 - i'},
        {horario: '06:00', len: 16, nombre_programa: 'CHANGE 45 - i'},
        {horario: '07:00', len: 16, nombre_programa: 'CHANGE 45 - i'},
        {horario: '08:00', len: 16, nombre_programa: 'CHANGE 45 - i'},
        {horario: '09:00', len: 7, nombre_programa: 'CHANGE 45 - i'},
        {horario: '10:00', len: 7, nombre_programa: 'CHANGE 45 - i'},
        {horario: '11:00', len: 7, nombre_programa: 'CHANGE 45 - i'},
        {horario: '13:00', len: 7, nombre_programa: 'CHANGE 45 - i'},
        {horario: '17:00', len: 8, nombre_programa: 'CHANGE 45 - i'},
        {horario: '18:00', len: 8, nombre_programa: 'CHANGE 45 - i'},
        {horario: '19:00', len: 16, nombre_programa: 'CHANGE 45 - i'},
        {horario: '20:00', len: 16, nombre_programa: 'CHANGE 45 - i'},
        {horario: '21:00', len: 16, nombre_programa: 'CHANGE 45 - i'},
        // 
        {horario: '05:00', len: 10, nombre_programa: 'FS 45 - i'},
        {horario: '06:00', len: 10, nombre_programa: 'FS 45 - i'},
        {horario: '07:00', len: 10, nombre_programa: 'FS 45 - i'},
        {horario: '08:00', len: 4, nombre_programa: 'FS 45 - i'},
        {horario: '09:00', len: 4, nombre_programa: 'FS 45 - i'},
        {horario: '10:00', len: 4, nombre_programa: 'FS 45 - i'},
        {horario: '11:00', len: 4, nombre_programa: 'FS 45 - i'},
        {horario: '17:00', len: 5, nombre_programa: 'FS 45 - i'},
        {horario: '18:00', len: 5, nombre_programa: 'FS 45 - i'},
        {horario: '19:00', len: 10, nombre_programa: 'FS 45 - i'},
        {horario: '20:00', len: 10, nombre_programa: 'FS 45 - i'},
        {horario: '21:00', len: 10, nombre_programa: 'FS 45 - i'},
        // 
        {horario: '05:00', len: 12, nombre_programa: 'FISIO MUSCLE - i'},
        {horario: '06:00', len: 12, nombre_programa: 'FISIO MUSCLE - i'},
        {horario: '07:00', len: 12, nombre_programa: 'FISIO MUSCLE - i'},
        {horario: '08:00', len: 4, nombre_programa: 'FISIO MUSCLE - i'},
        {horario: '09:00', len: 4, nombre_programa: 'FISIO MUSCLE - i'},
        {horario: '10:00', len: 4, nombre_programa: 'FISIO MUSCLE - i'},
        {horario: '11:00', len: 4, nombre_programa: 'FISIO MUSCLE - i'},
        {horario: '17:00', len: 5, nombre_programa: 'FISIO MUSCLE - i'},
        {horario: '18:00', len: 5, nombre_programa: 'FISIO MUSCLE - i'},
        {horario: '19:00', len: 10, nombre_programa: 'FISIO MUSCLE - i'},
        {horario: '20:00', len: 10, nombre_programa: 'FISIO MUSCLE - i'},
        {horario: '21:00', len: 10, nombre_programa: 'FISIO MUSCLE - i'},
    ]
    const dataImgMAP = dataImaginaria.map(m=>{
        return {
            ...m,
            aforoTotal: Number(m.len)+Number(m.len/3)
        }
    })
    const dataHorarios = [
        ...agruparPorHora(dataSeguimientoxFecha),
        ...dataImgMAP
    ]
  return (
    <>
        <PageBreadcrumb subName={'T'} title={'CUPOS DISPONIBLES DE VENTAS POR TURNO'}/>
        <div className='d-flex flex-column align-items-center justify-content-center'>
            <h1 style={{fontSize: '70px'}} className='text-center d-flex flex-column'>CHANGE 45 </h1>
                <TableHorario dataSeguimientoxFecha={dataHorarios} nombre_pgm={'CHANGE 45'} horaInicio='05:00' horaFin='21:00'/>
                {/* <TableVentas semanas={semanasConPgm} dataSeguimientoxFecha={dataHorarios} nombre_pgm={'CHANGE 45'} horaInicio='05:30' horaFin='20:30'/> */}
            
            <h1 style={{fontSize: '70px', marginTop: '100px'}} className='text-center'>FS 45</h1>
            <TableHorario dataSeguimientoxFecha={dataHorarios} nombre_pgm={'FS 45'} horaInicio='05:00' horaFin='21:00'/>
            {/* <TableVentas semanas={semanasConPgm} dataSeguimientoxFecha={dataHorarios} nombre_pgm={'FS 45'} horaInicio='05:30' horaFin='20:30'/> */}
            
            <h1 style={{fontSize: '70px', marginTop: '100px'}} className='text-center'>FISIO MUSCLE</h1>
            <TableHorario dataSeguimientoxFecha={dataHorarios} nombre_pgm={'FISIO MUSCLE'} horaInicio='05:00' horaFin='21:00'/>
            {/* <TableVentas semanas={semanasConPgm} dataSeguimientoxFecha={dataHorarios} nombre_pgm={'FISIO MUSCLE'} horaInicio='05:30' horaFin='20:30'/> */}
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
  return Object.values(grupos).map(m=>{
    return {
        nombre_fp: m.nombre_fp,
        horario: m.items[0].horario,
        nombre_programa: m.items[0].nombre_programa,
        len: m.items.length
    }
  });
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
                        <td className={`${className} text-white fs-3`}>AFORO REAL</td>
                        {
                            generarHoras(horaInicio, horaFin, 60).filter(f=>f.hora!=='12'&&f.hora!=='14'&& f.hora!=='15' && f.hora!=='16').map(m=>(
                                <td className={`text-center text-white fs-2 ${dataSeguimientoxFecha.filter(f=>f.horario===m.horario && f.nombre_programa===`${nombre_pgm}`).reduce((total, item)=>total+item.len,0)>dataSeguimientoxFecha.filter(f=>f.horario===m.horario && f.nombre_programa===`${nombre_pgm} - i`).reduce((total, item)=>total+item.aforoTotal,0)?'bg-601':'bg-change'}`}>{dataSeguimientoxFecha.filter(f=>f.horario===m.horario && f.nombre_programa===`${nombre_pgm}`).reduce((total, item)=>total+item.len,0)}</td>
                            ))
                        }
                        <td className={`${className} bg-change text-white fs-2 text-center`}>
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
                        <td className={`${className} bg-change-pastel text-white fs-3`}>AUSENTISMO</td>
                        {
                            generarHoras(horaInicio, horaFin, 60).filter(f=>f.hora!=='12'&&f.hora!=='14'&& f.hora!=='15' && f.hora!=='16').map(m=>(
                                <td className='text-center bg-change-pastel fs-3'>{(dataSeguimientoxFecha.filter(f=>f.horario===m.horario && f.nombre_programa===nombre_pgm).reduce((total, item)=>total+item.len,0)/3).toFixed(0)}</td>
                            ))
                        }
                        <td className={`${className} bg-change-pastel text-black fs-3 text-center`}>
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
                        <td className={`${className} bg-change-pastel text-white fs-3`}>TOTAL AFORO</td>
                        {
                            generarHoras(horaInicio, horaFin, 60).filter(f=>f.hora!=='12'&&f.hora!=='14'&& f.hora!=='15' && f.hora!=='16').map(m=>{
                                const seguimiento = dataSeguimientoxFecha.filter(f=>f.horario===m.horario && f.nombre_programa===nombre_pgm).reduce((total, item)=>total+item.len,0)
                                return (
                                    <td className='text-center bg-change-pastel fs-3'>{Number(seguimiento+Number((seguimiento/3).toFixed(0)))}</td>
                                )
                            })
                        }
                        
                        <td className={`${className}  bg-change-pastel text-black text-center fs-2`}>
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
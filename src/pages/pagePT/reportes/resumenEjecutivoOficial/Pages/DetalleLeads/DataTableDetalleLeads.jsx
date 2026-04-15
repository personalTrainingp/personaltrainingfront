import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useGestVentasStore } from '../../useGestVentasStore'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { useSelector } from 'react-redux'
import { FechaCorte } from '@/components/RangeCalendars/FechaRange'

export const DataTableDetalleLeads = ({dataMesesYanio, MESES}) => {
        const { corte } = useSelector((e) => e.DATA);
        const { obtenerVentasxEmpresa, dataVentasxEmpresa } = useGestVentasStore()
        useEffect(() => {
            obtenerVentasxEmpresa(598)
        }, [])
        
    const dataConMesesYanio = dataMesesYanio.map(d=>{
        const dataVentas = dataVentasxEmpresa.filter(f=> `${f.fecha.anio}-${f.fecha.mes}`==`${d.anio}-${d.mes}` && corte.dia.includes(f.fecha.dia))
        const dataSumaVentas = dataVentas.reduce((total, item)=>total+item.montoTotal, 0)
        const dataCantidad=dataVentas.length;
        return {
            ...d,
            dataVentas,
            dataSumaVentas,
            dataCantidad
        }
    })
  return (
    <>
    <FechaCorte corte={corte.corte} inicio={corte.inicio}/>
    <div className='text-center'>
            <span className='fs-1'>
                VENTAS RENOVACION
            </span>
    </div>
    <div className="table-responsive" style={{ width: '100%' }}>
        <Table  className="tabla-egresos" style={{width: '100%'}}  bordered>
            <thead className='bg-change'>
                <tr className='fs-2' style={{width: '350px'}}>
                    <th className='fs-2' style={{width: '350px'}}></th>
                    {
                        dataConMesesYanio.filter(f=>f.anio===2025).map(d=>{
                            return (
                                <th className='fs-2 text-center text-white' style={{width: '240px'}}>
                                    {dayjs.utc(`${d.fecha}-15`, 'YYYY-M-DD').format('MMMM')}
                                    {JSON.stringify(d.fecha.mes, null, 2)}
                                </th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white' style={{width: '240px'}}>2026</td>
                    {
                        dataConMesesYanio.filter(f=>f.anio===2026).map(d=>{
                            return (
                                <td>
                                    <NumberFormatMoney
                                        amount=
                                    {d.dataVentas.reduce((total, item)=>total+item.montoTotal, 0)}
                                    />
                                </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>2025</td>
                    {
                        dataConMesesYanio.filter(f=>f.anio===2025).map(d=>{
                            return (
                                <td>
                                    <NumberFormatMoney
                                        amount=
                                    {d.dataVentas.reduce((total, item)=>total+item.montoTotal, 0)}
                                    /></td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>2024</td>
                    {
                        dataConMesesYanio.filter(f=>f.anio===2024).map(d=>{
                            return (
                                <td>
                                    <NumberFormatMoney
                                        amount=
                                    {d.dataVentas.reduce((total, item)=>total+item.montoTotal, 0)}
                                    />
                                </td>
                            )
                        })
                    }
                </tr>
                {/* <tr>
                    <td className='sticky-td-598 fs-3 text-white'>TOTAL</td>
                    {
                        dataConMesesYanio.map(d=>{
                            return (
                                <td>{d.dataVentas.reduce((total, item)=>total+item.montoTotal, 0)}</td>
                            )
                        })
                    }
                </tr> */}
            </tbody>
        </Table>
        </div>
    <div className='text-center'>
            <span className='fs-1'>
                SOCIOS RENOVACION
            </span>
    </div>
    <div className="table-responsive" style={{ width: '100%' }}>
        <Table  className="tabla-egresos" style={{width: '100%'}}  bordered>
            <thead className='bg-change'>
                <tr className='fs-2' style={{width: '350px'}}>
                    <th className='fs-2' style={{width: '350px'}}></th>
                    {
                        dataConMesesYanio.filter(f=>f.anio===2025).map(d=>{
                            return (
                                <th className='fs-2 text-center text-white' style={{width: '240px'}}>
                                    {dayjs.utc(`${d.fecha}-15`, 'YYYY-M-DD').format('MMMM')}
                                </th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white' style={{width: '240px'}}>2026</td>
                    {
                        dataConMesesYanio.filter(f=>f.anio===2026).map(d=>{
                            return (
                                <td className='fs-2'>
                                        {d.dataCantidad}
                                </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>2025</td>
                    {
                        dataConMesesYanio.filter(f=>f.anio===2025).map(d=>{
                            return (
                                <td className='fs-2'>
                                        {d.dataCantidad}
                                    </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>2024</td>
                    {
                        dataConMesesYanio.filter(f=>f.anio===2024).map(d=>{
                            return (
                                <td className='fs-2'>
                                        {d.dataCantidad}
                                </td>
                            )
                        })
                    }
                </tr>
                {/* <tr>
                    <td className='sticky-td-598 fs-3 text-white'>TOTAL</td>
                    {
                        dataConMesesYanio.map(d=>{
                            return (
                                <td>{d.dataVentas.reduce((total, item)=>total+item.montoTotal, 0)}</td>
                            )
                        })
                    }
                </tr> */}
            </tbody>
        </Table>
    </div>
    </>
  )
}

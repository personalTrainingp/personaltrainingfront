import React from 'react'
import { Table } from 'react-bootstrap'
import {  NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';

export const DataTableMetas = ({data, arrayFechas=[], nombreCategoriaVenta, dataCuotaMetaDelMes=[]}) => {
    const fechaSeleccionada = '2026-1'
    const dataConMes = arrayFechas.map(arr=>{
        const dataFiltradaMes =  data?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio)
        const dataMetaFiltradaMes =  dataCuotaMetaDelMes?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio)
        const montoTotal = dataFiltradaMes?.reduce((total, item) => total + (item?.montoTotal || 0), 0)
        const cantTotal = dataFiltradaMes?.reduce((total, item) => total + (item?.cantidadTotal || 0), 0)
        const montoMeta = dataMetaFiltradaMes?.reduce((total, item) => total + (item?.meta || 0), 0)
        const porcentajeDeAvance = montoMeta
  ? (montoTotal / montoMeta) * 100
  : 0;
        return {
            ...arr,
            items: dataFiltradaMes,
            montoTotal,
            montoMeta,
            cantTotal: dataFiltradaMes.length,
            porcentajeDeAvance
        }
    })
    console.log({dataCuotaMetaDelMes, dataConMes});
    
  return (
        <Table className="tabla-egresos" style={{width: '100%'}}  bordered>
            <thead>
                <tr className='bg-change'>
                    <th className='fs-2' style={{width: '350px'}}>
                        <div className='text-change'>
                            {nombreCategoriaVenta}
                        </div>
                    </th>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <th className={`fs-2 text-center text-white ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} style={{width: '240px'}}>{dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')}<br/>{dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('YYYY')}</th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>META</td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} ><NumberFormatMoney amount={d.montoMeta}/></td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>MONTO VENTA</td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} ><NumberFormatMoney amount={d.montoTotal}/></td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>SOCIOS</td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} >{d.cantTotal}</td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>% AVANCE</td>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} ><NumberFormatMoney amount={d.porcentajeDeAvance}/></td>
                            )
                        })
                    }
                </tr>
            </tbody>
        </Table>
  )
}

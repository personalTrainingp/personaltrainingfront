import React from 'react'
import { Table } from 'react-bootstrap'
import {  NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';

export const DataTable1 = ({data, arrayFechas=[], nombreCategoriaVenta}) => {
    const fechaSeleccionada = '2026-1'
    const dataConMes = arrayFechas.map(arr=>{
        const dataFiltradaMes =  data?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio)
        return {
            ...arr,
            items: dataFiltradaMes,
            montoTotal: dataFiltradaMes?.reduce((total, item) => total + (item?.montoTotal || 0), 0),
        }
    })
    const objFechaSeleccionada = dataConMes.find(f=>f.fecha===fechaSeleccionada);
  return (
    <div className="table-responsive" style={{ width: '100%' }}>
        <Table className="tabla-egresos" style={{width: '100%'}}  bordered>
            <thead>
                <tr className='bg-change'>
                    <th className='bg-white-1 fs-2'>
                        <div className='text-change'>
                            {nombreCategoriaVenta}
                        </div>
                    </th>
                    {
                        dataConMes.map((d, i)=>{
                            return (
                                <th className='fs-2 text-center text-white'>{dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM YYYY')}</th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>VENTAS</td>
                    {
                        dataConMes.map((d, i)=>{
                            const restarConFechaSeleccionada=
                             objFechaSeleccionada.montoTotal===d.montoTotal
                             ?objFechaSeleccionada.montoTotal:
                             objFechaSeleccionada.montoTotal-d.montoTotal
                            return (
                                <td className='fs-3 text-center' style={{width: '100px'}}><NumberFormatMoney amount={restarConFechaSeleccionada}/></td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>%</td>
                    {
                        dataConMes.map((d, i)=>{
                            const restarConFechaSeleccionada=
                             objFechaSeleccionada.montoTotal===d.montoTotal
                             ?objFechaSeleccionada.montoTotal:
                             objFechaSeleccionada.montoTotal-d.montoTotal

                             const porcentaje = objFechaSeleccionada.montoTotal === 0
                                ? 0
                                : (restarConFechaSeleccionada /
                                    Math.max(restarConFechaSeleccionada, objFechaSeleccionada.montoTotal)) * 100;
                            return (

                                <td className='text-center fs-3'>
                                    <NumberFormatMoney amount={porcentaje}/>
                                </td>
                            )
                        })
                    }
                </tr>
            </tbody>
        </Table>
    </div>
  )
}

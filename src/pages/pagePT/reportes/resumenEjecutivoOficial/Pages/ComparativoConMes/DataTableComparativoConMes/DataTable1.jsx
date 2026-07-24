import React from 'react'
import { Button, Table } from 'react-bootstrap'
import {  NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';

export const DataTable1 = ({data, arrayFechas=[], nombreCategoriaVenta, dataCuotaMetaDelMes=[]}) => {
    const date = new Date();
    const anioActual = date.getFullYear();
    const mesActual = date.getMonth() + 1; // Los meses en JavaScript son base 0, por lo que se suma 1
    const diaActual = date.getDate();
    const fechaSeleccionada = `${anioActual}-${mesActual}`;
    const dataConMes = arrayFechas.map(arr=>{
        const dataFiltradaMes =  data?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio && f.dia<=diaActual)
        return {
            ...arr,
            items: dataFiltradaMes,
            montoTotal: dataFiltradaMes?.reduce((total, item) => total + (item?.montoTotal || 0), 0),
        }
    })
    const objFechaSeleccionada = dataConMes.find(f=>f.fecha===fechaSeleccionada);
    const [orden, setOrden] = React.useState("desc");
    const dataConMesOrdenado = [...dataConMes].sort((a, b) => {
        return orden === "desc"
            ? b.montoTotal - a.montoTotal
            : a.montoTotal - b.montoTotal;
    });
  return (
    <>
        <Table className="tabla-egresos" style={{width: '100%'}}  bordered>
            <thead>
                <tr className='bg-change'>
                    <th className='bg-white-1 fs-2' style={{width: '250px'}}>
                        <div className='text-change'>
                            {nombreCategoriaVenta}
                            <Button
                                variant="primary"
                                className="mb-3"
                                onClick={() =>
                                    setOrden((o) => (o === "desc" ? "asc" : "desc"))
                                }
                            >
                                Ordenar ventas {orden === "desc" ? "↓" : "↑"}
                            </Button>
                        </div>
                    </th>
                    {
                        dataConMesOrdenado.map((d, i)=>{
                            return (
                                <th className={`fs-2 text-center text-white ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} style={{width: '240px'}}>{dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')}<br/>{dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('YYYY')}</th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>VENTAS</td>
                    {
                        dataConMesOrdenado.map((d, i)=>{
                            return (
                                <td className={`fs-3 text-center ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`} ><NumberFormatMoney amount={d.montoTotal}/></td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>%</td>
                    {
                        dataConMesOrdenado.map((d, i)=>{
                            const restarConFechaSeleccionada=
                             objFechaSeleccionada.montoTotal===d.montoTotal
                             ?objFechaSeleccionada.montoTotal:
                             d.montoTotal-objFechaSeleccionada.montoTotal

                             const porcentaje = objFechaSeleccionada.montoTotal === 0
                                ? 0
                                : (restarConFechaSeleccionada /
                                    Math.max(restarConFechaSeleccionada, objFechaSeleccionada.montoTotal)) * 100;
                            return (

                                <td className={`text-center fs-3 ${dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')==='diciembre'?'border-right-10':''}`}>
                                    <NumberFormatMoney amount={porcentaje}/>
                                </td>
                            )
                        })
                    }
                </tr>
            </tbody>
        </Table>
    </>
  )
}

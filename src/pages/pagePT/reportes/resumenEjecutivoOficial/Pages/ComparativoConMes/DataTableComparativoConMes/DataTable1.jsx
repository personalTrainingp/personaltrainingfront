import React, { useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'
import {  NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
const stickyStyle = {
    position: "sticky",
    right: 0,
    background: "#fff",
    zIndex: 20,
    minWidth: "240px",
    width: "240px",
    boxShadow: "-3px 0 5px rgba(0,0,0,.15)"
};
const stickyHeaderStyle = {
    ...stickyStyle,
    zIndex: 30
};
export const DataTable1 = ({data, arrayFechas=[], nombreCategoriaVenta, dataCuotaMetaDelMes=[]}) => {
    const date = new Date();
    const anioActual = date.getFullYear();
    const mesActual = date.getMonth() + 1; // Los meses en JavaScript son base 0, por lo que se suma 1
    const diaActual = date.getDate();
    const { fecha } = useSelector((e) => e.DATA);
    
    const fechaSeleccionada = `${fecha.split('-')[0]}-${fecha.split('-')[1]}`;
    const dataConMes = arrayFechas.map(arr=>{
        const dataFiltradaMes =  data?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio)
        const dataFiltradaMesCorte =  data?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio && f.dia<=diaActual)
        return {
            ...arr,
            items: dataFiltradaMes,
            montoTotal: dataFiltradaMes?.reduce((total, item) => total + (item?.montoTotal || 0), 0),
            montoCorte: dataFiltradaMesCorte?.reduce((total, item) => total + (item?.montoTotal || 0), 0)
        }
    })
    const objFechaSeleccionada = dataConMes.find(f=>f.fecha===fechaSeleccionada);
        const otrosMeses = dataConMes.filter(
            (f) => f.fecha !== fechaSeleccionada
        );
    const otrosMesesOrdenados = [...otrosMeses].sort((a,b) => b.montoTotal - a.montoTotal).slice(0, 4).sort((a,b) => a.montoTotal - b.montoTotal);
          const dataConMesOrdenado = objFechaSeleccionada
    ? [...otrosMesesOrdenados, objFechaSeleccionada]
    : otrosMesesOrdenados;
    const esFechaSeleccionada = (d) => d.fecha === fechaSeleccionada;
  return (
    <>
    {fecha}
        <Table className="tabla-egresos" style={{width: '100%'}}>
            <thead>
                <tr className='bg-change'>
                    <th className='bg-white-1 fs-2' style={{width: '250px'}}>
                        <div className='text-change'>
                            {nombreCategoriaVenta}
                        </div>
                    </th>
                    {
                        dataConMesOrdenado.map((d, i, arr)=>{
                            return (
                                <th className={`fs-2 text-center bg-change text-white`} style={esFechaSeleccionada(d) ? stickyHeaderStyle : { width: "240px" }}>{dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')}<br/>{dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('YYYY')}</th>
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
                                <td style={esFechaSeleccionada(d) ? stickyStyle : {}} className={`fs-3 text-center`} >
                                    <NumberFormatMoney amount={objFechaSeleccionada?.montoTotal-d.montoTotal===0?d.montoTotal:objFechaSeleccionada?.montoTotal-d.montoTotal}/>
                                </td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>%</td>
                    {
                        dataConMesOrdenado.map((d, i, arr)=>{
                            const restarConFechaSeleccionada=
                             objFechaSeleccionada?.montoTotal===d?.montoTotal
                             ?objFechaSeleccionada?.montoTotal:
                             d?.montoTotal-objFechaSeleccionada?.montoTotal

                             const porcentaje = objFechaSeleccionada?.montoTotal === 0
                                ? 0
                                : (restarConFechaSeleccionada /
                                    Math.max(restarConFechaSeleccionada, objFechaSeleccionada?.montoTotal)) * 100;
                            return (

                                <td style={esFechaSeleccionada(d) ? stickyStyle : {}} className={`text-center fs-3 `}>
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

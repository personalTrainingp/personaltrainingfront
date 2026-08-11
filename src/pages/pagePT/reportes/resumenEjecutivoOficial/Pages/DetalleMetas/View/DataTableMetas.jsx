import React from 'react'
import { Button, Table } from 'react-bootstrap'
import {  NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

export const DataTableMetas = ({label, data, arrayFechas=[], corte, nombreCategoriaVenta, dataCuotaMetaDelMes=[], nombreDeComparativo='VENTA TOTAL AL CORTE', labelMontoVenta='MONTO VENTA ALCANZADA'}) => {
    
        const { fecha } = useSelector((e) => e.DATA);
    const fechaSeleccionada = `${fecha.split('-')[0]}-${fecha.split('-')[1]}`;
    const esFechaSeleccionada = (d) => d.fecha === fechaSeleccionada;

    const stickyStyle = {
        position: "sticky",
        right: 0,
        background: "#fff",
        minWidth: "240px",
        width: "240px",
        zIndex: 10,
        boxShadow: "-3px 0 5px rgba(0,0,0,.15)"
    };

    const stickyHeaderStyle = {
        ...stickyStyle,
        zIndex: 20
    };
    const dataConMes = arrayFechas.map(arr=>{
        const dataFiltradaMes =  data?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio)
        const dataCorte = data?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio).filter((el) => corte.dia.includes(el.dia))
        const dataMetaFiltradaMes =  dataCuotaMetaDelMes?.filter((f)=>f.mes===arr.mes && f.anio===arr.anio)
        const montoTotal = dataFiltradaMes?.reduce((total, item) => total + (item?.montoTotal || 0), 0)
        const montoCorte = dataCorte?.reduce((total, item) => total + (item?.montoTotal || 0), 0)
        const montoMeta = dataMetaFiltradaMes?.reduce((total, item) => total + (item?.meta || 0), 0)
        return {
            ...arr,
            montoTotal,
            montoCorte,
            montoMeta,
        }
    }).sort((a,b)=>b.montoCorte-a.montoCorte)
    const dataMesActual = dataConMes.filter((d)=>d.mes===Number(fecha.split('-')[1]) && d.anio===Number(fecha.split('-')[0]))
    const dataMejoresMesesMasActual = [...dataConMes.slice(0, 4), ...dataMesActual]
  return (
    <div style={{ overflowX: "auto" }}>
        <Table className="tabla-egresos" style={{width: '100%'}}  bordered>
            <thead>
                <tr className='bg-change'>
                    <th className='fs-2 bg-change' style={{width: '350px'}}>
                        <div className='text-change'>
                            {nombreCategoriaVenta}
                        </div>
                    </th>
                    {
                        dataMejoresMesesMasActual.map((d, i)=>{
                            return (
                                <th
    className={`fs-2 text-center bg-change text-white ${
        dayjs(`${d.anio}-${d.mes}-1`).format("MMMM") === "diciembre"
            ? "border-right-10"
            : ""
    }`}
    style={
        esFechaSeleccionada(d)
            ? stickyHeaderStyle
            : { width: "240px" }
    }
>{dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('YYYY')}<br/>{dayjs(`${d.anio}-${d.mes}-1`, 'YYYY-M-D').format('MMMM')}</th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>{nombreDeComparativo}</td>
                    {
                        dataMejoresMesesMasActual.map((d, i)=>{
                            return (
                                <td
    className={`fs-3 text-center ${
        dayjs(`${d.anio}-${d.mes}-1`).format("MMMM") === "diciembre"
            ? "border-right-10"
            : ""
    }`}
    style={esFechaSeleccionada(d) ? stickyStyle : {}}
><NumberFormatMoney className='fs-1' amount={d.montoMeta}/></td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>
                        <div className=''>
                            MONTO RESTANTE DE CUOTA
                        </div>
                    </td>
                    {
                        dataMejoresMesesMasActual.map((d, i)=>{
                            return (
                                <td
    className={`fs-3 text-center ${
        dayjs(`${d.anio}-${d.mes}-1`).format("MMMM") === "diciembre"
            ? "border-right-10"
            : ""
    }`}
    style={esFechaSeleccionada(d) ? stickyStyle : {}}
><NumberFormatMoney className='fs-1' amount={d.montoMeta-d.montoTotal}/></td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>
                        <div className=''>
                            % RESTANTE PARA CUOTA
                        </div>
                    </td>
                    {
                        dataMejoresMesesMasActual.map((d, i)=>{
                            return (
                                <td
    className={`fs-3 text-center ${
        dayjs(`${d.anio}-${d.mes}-1`).format("MMMM") === "diciembre"
            ? "border-right-10"
            : ""
    }`}
    style={esFechaSeleccionada(d) ? stickyStyle : {}}
><NumberFormatMoney className='fs-1' amount={d.montoMeta>d.montoTotal?((d.montoMeta-d.montoTotal)/d.montoMeta)*100:0}/></td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>
                        <div className=''>
                            MONTO DE AVANCE DE CUOTA
                        </div>
                    </td>
                    {
                        dataMejoresMesesMasActual.map((d, i)=>{
                            return (
                                <td
    className={`fs-3 text-center ${
        dayjs(`${d.anio}-${d.mes}-1`).format("MMMM") === "diciembre"
            ? "border-right-10"
            : ""
    }`}
    style={esFechaSeleccionada(d) ? stickyStyle : {}}
><NumberFormatMoney className='fs-1' amount={d.montoTotal}/></td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>
                        <div className=''>
                            % ALCANCE DE CUOTA
                        </div>
                    </td>
                    {
                        dataMejoresMesesMasActual.map((d, i)=>{
                            return (
                                <td
    className={`fs-3 text-center ${
        dayjs(`${d.anio}-${d.mes}-1`).format("MMMM") === "diciembre"
            ? "border-right-10"
            : ""
    }`}
    style={esFechaSeleccionada(d) ? stickyStyle : {}}
><NumberFormatMoney className='fs-1' amount={(d.montoTotal/d.montoMeta)*100}/></td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>
                        <div className=''>
                            VENTA TOTAL AL {corte.dia[corte.dia.length-1]}
                        </div>
                    </td>
                    {
                        dataMejoresMesesMasActual.map((d, i)=>{
                            return (
                                <td
    className={`fs-3 text-center ${
        dayjs(`${d.anio}-${d.mes}-1`).format("MMMM") === "diciembre"
            ? "border-right-10"
            : ""
    }`}
    style={esFechaSeleccionada(d) ? stickyStyle : {}}
><NumberFormatMoney className='fs-1' amount={(d.montoCorte)}/></td>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td className='sticky-td-598 fs-3 text-white'>
                        <div className=''>
                            VENTA TOTAL MES
                        </div>
                    </td>
                    {
                        dataMejoresMesesMasActual.map((d, i)=>{
                            return (
                                <td
    className={`fs-3 text-center ${
        dayjs(`${d.anio}-${d.mes}-1`).format("MMMM") === "diciembre"
            ? "border-right-10"
            : ""
    }`}
    style={esFechaSeleccionada(d) ? stickyStyle : {}}
><NumberFormatMoney className='fs-1' amount={(d.montoTotal)}/></td>
                            )
                        })
                    }
                </tr>
            </tbody>
        </Table>
    </div>

  )
}

import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useGestVentasStore } from '../../useGestVentasStore'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { useSelector } from 'react-redux'
import { FechaCorte } from '@/components/RangeCalendars/FechaRange'
import { Esqueleto } from './Esqueleto'

export const DataTableDetalleLeads = ({dataMesesYanio, MESES}) => {
        const { corte } = useSelector((e) => e.DATA);
        const fechaActual = new Date()
        const anioActual = fechaActual.getFullYear()
        const mesActual = fechaActual.getMonth()+1
        const diaActual = fechaActual.getDate()
        const diasDelMes = new Date(anioActual,mesActual,0).getDate();
        const { obtenerVentasxEmpresa, dataVentasRenovacionesxEmpresa, dataVentasGeneral } = useGestVentasStore()
        useEffect(() => {
            obtenerVentasxEmpresa(598)
        }, [])
    const dataVentasRenovacionesxMESES = dataMesesYanio.map(d=>{
        const dataVentasRenovaciones = dataVentasRenovacionesxEmpresa?.filter(f=> `${f.fecha.anio}-${f.fecha.mes}`==`${d.anio}-${d.mes}` && corte.dia.includes(f.fecha.dia))
        const sumaVentasRenovaciones = dataVentasRenovaciones.reduce((total, item)=>total+item.montoTotal, 0)
        return {
            ...d,
            monto: <NumberFormatMoney amount={sumaVentasRenovaciones}/>,
        }
    })
    const dataCantidadRenovacionesxMESES = dataMesesYanio.map(d=>{
        const dataVentasRenovaciones = dataVentasRenovacionesxEmpresa?.filter(f=> `${f.fecha.anio}-${f.fecha.mes}`==`${d.anio}-${d.mes}` && corte.dia.includes(f.fecha.dia))
        return {
            ...d,
            monto: dataVentasRenovaciones.length,
        }
    })
    const dataAlcanceCaRenovacionesxMESES = dataMesesYanio.map(d=>{
        const dataVentas = dataVentasGeneral?.filter(f=> `${f.fecha.anio}-${f.fecha.mes}`==`${d.anio}-${d.mes}` && corte.dia.includes(f.fecha.dia))
        const dataVentasRenovaciones = dataVentasRenovacionesxEmpresa?.filter(f=> `${f.fecha.anio}-${f.fecha.mes}`==`${d.anio}-${d.mes}` && corte.dia.includes(f.fecha.dia))
        const sumaVentasRenovaciones = dataVentasRenovaciones.reduce((total, item)=>total+item.montoTotal, 0)
        const sumaVentasGenerales = dataVentas.reduce((total, item)=>total+item.montoTotal, 0)
        
        return {
            ...d,

            monto: !sumaVentasGenerales?'0.00':((sumaVentasRenovaciones/sumaVentasGenerales)*100).toFixed(2),

        }
    })
    
    const dataAlcanceCaRenovacionesxANIO = dataMesesYanio.map(d=>{
        const dataalcanceRenovacionesxMES = dataAlcanceCaRenovacionesxMESES?.filter(f=> f.anio==d.anio)
        .reduce((total, item)=>total+item.monto, 0)
        
        // const dataVentasRenovaciones = dataVentasRenovacionesxEmpresa?.filter(f=> `${f.fecha.anio}`==`${d.anio}` && corte.dia.includes(f.fecha.dia))
        // const sumaVentasRenovaciones = dataVentasRenovaciones.reduce((total, item)=>total+item.montoTotal, 0)
        // const sumaVentasMesActual = dataVentasRenovacionesxEmpresa?.filter(f=> `${f.fecha.anio}-${f.fecha.mes}`==`${anioActual}-${mesActual}`).reduce((total, item)=>total+item.montoTotal, 0)
        // const sumaVentasGenerales = dataVentas.reduce((total, item)=>total+item.montoTotal, 0)
        // let mesActivo = false;
        // if(`${d.anio}-${d.mes}`===`${anioActual}-${mesActual}`){
        //     if(corte.inicio ===1 && corte.corte<=diaActual){
        //         mesActivo=true
        //     }
        // }
        return {
            ...d,
            monto: 0,
            dataalcanceRenovacionesxMES
        }
    })
  return (
    <>
    <pre>
        {
            JSON.stringify(dataAlcanceCaRenovacionesxANIO, null, 2)
        }
    </pre>
    <FechaCorte corte={corte.corte} inicio={corte.inicio}/>
    <Esqueleto dataMontoAnio={dataAlcanceCaRenovacionesxANIO} labelTitle='VENTAS RENOVACIONES' dataConMesesYanio={dataVentasRenovacionesxMESES} dataMES={MESES} />
    <Esqueleto dataMontoAnio={dataAlcanceCaRenovacionesxANIO} labelTitle='SOCIOS RENOVACIONES' dataConMesesYanio={dataCantidadRenovacionesxMESES} dataMES={MESES}/>
    <Esqueleto dataMontoAnio={dataAlcanceCaRenovacionesxANIO} labelTitle='% ALCANCE RENOVACIONES' dataConMesesYanio={dataAlcanceCaRenovacionesxMESES} dataMES={MESES} />
    </>
  )
}

function dataTotalFormular(anio=2024) {
    const hoy = new Date()
  // Año actual
const year = hoy.getFullYear();

// Mes actual (0 = enero, 11 = diciembre)
const month = hoy.getMonth()+ 1;
const ultimaFecha = new Date(year, month , 0);
const diaUltimaFecha = ultimaFecha.getDate()
const diaActual = hoy.getDate()
if(anio===year){
  return diaActual==diaUltimaFecha?0:month;
}else{
  return 12;
}
}
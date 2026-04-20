import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useGestVentasStore } from '../../useGestVentasStore'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { useSelector } from 'react-redux'
import { FechaCorte } from '@/components/RangeCalendars/FechaRange'
import { Esqueleto } from './Esqueleto'

export const DataTableDetalleLeads = ({dataMesesYanio, MESES, dataVentasRenovacionesxEmpresa, dataVentasGeneral, label='', label2024, label2026}) => {
        const { corte } = useSelector((e) => e.DATA);
        const fechaActual = new Date()
        const anioActual = fechaActual.getFullYear()
        const mesActual = fechaActual.getMonth()+1
    const dataVentasRenovacionesxMESES = dataMesesYanio.map(d=>{
        const dataVentasRenovaciones = dataVentasRenovacionesxEmpresa?.filter(f=> `${f.fecha.anio}-${f.fecha.mes}`==`${d.anio}-${d.mes}` && corte.dia.includes(f.fecha.dia))
        const sumaVentasRenovaciones = dataVentasRenovaciones.reduce((total, item)=>total+item.montoTotal, 0)
        return {
            ...d,
            monto: <NumberFormatMoney amount={sumaVentasRenovaciones}/>,
            monto_: sumaVentasRenovaciones
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
            monto_:!sumaVentasGenerales?0:((sumaVentasRenovaciones/sumaVentasGenerales)*100), 
            monto: !sumaVentasGenerales?'0.00':((sumaVentasRenovaciones/sumaVentasGenerales)*100).toFixed(2),

        }
    })
    
    const dataAlcanceCaRenovacionesxANIO = dataMesesYanio.map(d=>{
        const dataalcanceRenovacionesxMES = dataAlcanceCaRenovacionesxMESES?.filter(f=> f.anio==d.anio)
        .reduce((total, item)=>total+item.monto_, 0)
        return {
            ...d,
            monto: (dataalcanceRenovacionesxMES/(d.anio==2025?12: d.anio==2024?4:3)).toFixed(2)
        }
    })
    
    const dataMontoRenovacionesxANIO = dataMesesYanio.map(d=>{
        const dataalcanceRenovacionesxMES = dataVentasRenovacionesxMESES?.filter(f=> f.anio==d.anio)
        .reduce((total, item)=>total+item.monto_, 0)
        return {
            ...d,
            monto: <NumberFormatMoney amount={dataalcanceRenovacionesxMES}/>
        }
    })
    const dataCantidadRenovacionesxANIO = dataMesesYanio.map(d=>{
        const dataalcanceRenovacionesxMES = dataCantidadRenovacionesxMESES?.filter(f=> f.anio==d.anio)
        .reduce((total, item)=>total+item.monto, 0)
        return {
            ...d,
            monto: dataalcanceRenovacionesxMES
        }
    })
  return (
    <>
    <FechaCorte corte={corte.corte} inicio={corte.inicio}/>
    <Esqueleto labelTotalX='TOTAL VENTAS' dataMontoAnio={dataMontoRenovacionesxANIO} labelTitle={`VENTAS ${label}`} dataConMesesYanio={dataVentasRenovacionesxMESES} dataMES={MESES} />
    <Esqueleto labelTotalX='TOTAL SOCIOS' dataMontoAnio={dataCantidadRenovacionesxANIO} labelTitle={`SOCIOS ${label}`} dataConMesesYanio={dataCantidadRenovacionesxMESES} dataMES={MESES}/>
    <Esqueleto labelTotalX='% PROMEDIO' dataMontoAnio={dataAlcanceCaRenovacionesxANIO} labelTitle={`% ALCANCE ${label}`} dataConMesesYanio={dataAlcanceCaRenovacionesxMESES} dataMES={MESES} />
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
    if (anio=2024) {
        return 4;
    }
  return 12;
}
}
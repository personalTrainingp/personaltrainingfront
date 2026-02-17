import React, { useEffect } from 'react'
import { DataTableMetas } from './View/DataTableMetas'
import { sumarMontoTotal, useInformeEjecutivoStore } from '../../useInformeEjecutivoStore';
import { useSelector } from 'react-redux';
import { generarMesYanio } from '../../helpers/generarMesYanio';
import { FechaCorte } from '@/components/RangeCalendars/FechaRange';
import { agruparPorMesDiaFechaVenta } from '../../helpers/agruparPorMesDiaFechaVenta';

export const AppDetalleMetas = () => {
        const { obtenerVentas, dataVentas,  } = useInformeEjecutivoStore()
        const { corte } = useSelector((e) => e.DATA);
    
        useEffect(() => {
            obtenerVentas(['2025-01-02 15:45:47.6640000 +00:00','2025-12-04 20:42:20.4490000 +00:00'])
        }, [])
        const dataMetasCuotasMembresias=[
            {mes: 1, anio: 2026, meta: 110000},
            {mes: 12, anio: 2025, meta: 90000},
            {mes: 11, anio: 2025, meta: 90000},
            {mes: 10, anio: 2025, meta: 85000},
            {mes: 9, anio: 2025, meta: 75000},
            {mes: 8, anio: 2025, meta: 70000},
            {mes: 7, anio: 2025, meta: 60000},
            {mes: 6, anio: 2025, meta: 60000},
            {mes: 5, anio: 2025, meta: 55000},
            {mes: 4, anio: 2025, meta: 55000},
            {mes: 3, anio: 2025, meta: 50000},
            {mes: 2, anio: 2025, meta: 50000},
            {mes: 1, anio: 2025, meta: 50000},
        ]
        const dataMetasCuotasMembresiaRenovaciones=[
            {mes: 1, anio: 2026, meta: 40000},
            {mes: 12, anio: 2025, meta: 40000},
        ]
        console.log({dme: dataVentas.dataMembresias?.filter((el) => corte.dia.includes(el.dia))});
        
  return (
    <div>
                <FechaCorte corte={corte.corte} inicio={corte.inicio}/>
        <div className='text-center fs-1'>CUOTAS DEL MES</div>
        <div className='text-center fs-1'>
            MEMBRESIAS
        </div>
        <div  className="table-responsive" style={{ width: '100%' }}>
            <DataTableMetas arrayFechas={generarMesYanio('2024-09-01 15:45:47.6640000 +00:00')} data={dataVentas.dataMembresias?.filter((el) => corte.dia.includes(el.dia))}  dataCuotaMetaDelMes={dataMetasCuotasMembresias}/>
        </div>
        <div className='text-center fs-1'>
            RENOVACIONES
        </div>
        <div  className="table-responsive" style={{ width: '100%' }}>
            <DataTableMetas arrayFechas={generarMesYanio('2024-09-01 15:45:47.6640000 +00:00')} data={dataVentas.dataMembresiasRenovaciones?.filter((el) => corte.dia.includes(el.dia))}  dataCuotaMetaDelMes={dataVentas.dataMembresias?.filter((el) => corte.dia.includes(el.dia)).map(d=>{return {...d,meta: d.montoTotal}})}/>
        </div>
        <div className='text-center fs-1'>
            REINSCRIPCIONES
        </div>
        <div  className="table-responsive" style={{ width: '100%' }}>
            <DataTableMetas arrayFechas={generarMesYanio('2024-09-01 15:45:47.6640000 +00:00')} data={dataVentas.dataMembresiasReinscripciones?.filter((el) => corte.dia.includes(el.dia))}  dataCuotaMetaDelMes={dataVentas.dataMembresias?.filter((el) => corte.dia.includes(el.dia)).map(d=>{return {...d,meta: d.montoTotal}})}/>
        </div>
        <div className='text-center text-change' style={{fontSize: '80px'}}>
            RENOVACIONES
        </div>
        {
            dataVentas.renovacionesxEmpl.map(d=>{
                return (
                    <div  className="table-responsive" style={{ width: '100%' }}>
                        <p className='text-center fs-1'>{d.nombre_empl}</p>
                        <DataTableMetas arrayFechas={generarMesYanio('2024-09-01 15:45:47.6640000 +00:00')} data={sumarMontoTotal(agruparPorMesDiaFechaVenta((d.items)))?.filter((el) => corte.dia.includes(el.dia))}  dataCuotaMetaDelMes={[]}/>
                    </div>
                )
            })
        }
    </div>
  )
}

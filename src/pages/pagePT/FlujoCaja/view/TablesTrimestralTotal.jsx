import React, { useEffect, useState } from 'react'
import { ViewResumenTotal } from '../ViewResumenTotal'
import { generarMesYanio } from '../helpers/generarMesYanio'
import { Table } from 'react-bootstrap'
import { TdItem } from './TdItem'
import { TrItemVentas } from './TrItem'
import { ComparativaVentasxAnio } from './ComparativaVentasxAnio'
export const TablesTrimestralTotal = ({id_empresa}) => {
  return (
    <div>
        <ComparativaVentasxAnio id_empresa={id_empresa}/>
    </div>
  )
}

const TablePorMeses = ({generarMes,  id_empresa})=>{
    const anio2026_trimestre1 = ['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']
    const anio2025_trimestre1 = ['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']
    const anio2024_trimestre1 = ['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']
    const anioTotal_trimestre1 = ['2024-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']
    return (
        <Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
                    <thead>
                        <tr>
                            <th style={{width: '20%'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white text-center`}><div className='text-black text-center'>AÑO / MES</div></th>
                            {
                                generarMesYanio(generarMes[0], generarMes[1]).map(e=>{
                                    return (
                                        <th className='text-center' 
                                        style={{width: '200px'}}>{e.mesSTR}</th>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' 
                            style={{width: '20%'}}>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemVentas arrayDates={[generarMes[0], generarMes[1]]} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026_trimestre1} id_empresa={id_empresa}/>
                        <TrItemVentas arrayDates={[generarMes[0], generarMes[1]]} className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025_trimestre1} id_empresa={id_empresa}/>
                        <TrItemVentas 
                            arrayDates={[generarMes[0], generarMes[1]]}
                        className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={anio2024_trimestre1} id_empresa={id_empresa}/>
                        <TrItemVentas 
                            className={'fs-1'} 
                            classNameTotal={'text-center border-left-10 border-right-10 border-bottom-10 '} 
                            label='TOTAL MENSUAL' 
                            arrayFechas={anioTotal_trimestre1} 
                            arrayDates={[generarMes[0], generarMes[1]]}
                            id_empresa={id_empresa}/>
                    </tbody>
                </Table>
    )
}
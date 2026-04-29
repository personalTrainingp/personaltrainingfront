import React, { useEffect, useState } from 'react'
import { ViewResumenTotal } from '../ViewResumenTotal'
import { generarMesYanio } from '../helpers/generarMesYanio'
import { Table } from 'react-bootstrap'
import { TdItem } from './TdItem'
import { TrItemVentas, TrItemEgresos, TrItemUtilidad, TrItemInventario } from './TrItem'
import dayjs from 'dayjs'
export const TablesTrimestralTotal = ({classNameEmpresa, bgPastel, id_empresa}) => {
    const anio2026_trimestre1 = ['2026-01-01 15:45:47.6640000 +00:00', '2026-03-31 15:45:47.6640000 +00:00']
    const anio2025_trimestre1 = ['2025-01-01 15:45:47.6640000 +00:00', '2025-03-31 15:45:47.6640000 +00:00']
    const anio2024_trimestre1 = ['2024-01-01 15:45:47.6640000 +00:00', '2024-03-31 15:45:47.6640000 +00:00']
    const anioTotal_trimestre1 = ['2024-01-01 15:45:47.6640000 +00:00', '2026-03-31 15:45:47.6640000 +00:00']

    const anio2026_trimestre2 = ['2026-04-01 15:45:47.6640000 +00:00', '2026-03-31 15:45:47.6640000 +00:00']
    const anio2025_trimestre2 = ['2025-04-01 15:45:47.6640000 +00:00', '2025-03-31 15:45:47.6640000 +00:00']
    const anio2024_trimestre2 = ['2024-04-01 15:45:47.6640000 +00:00', '2024-03-31 15:45:47.6640000 +00:00']
    const anioTotal_trimestre2 = ['2024-04-01 15:45:47.6640000 +00:00', '2026-03-31 15:45:47.6640000 +00:00']

  return (
    <div>
        <div>
            <div style={{fontSize: '70px'}} className='text-black text-center'>INGRESOS</div>
            <div className='tab-scroll-container'>
                <Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
                    <thead>
                        <tr>
                            <th style={{width: '300px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white text-center`}><div className='text-black text-center'>AÑO / MES</div></th>
                            {
                                generarMesYanio(new Date(anio2026_trimestre1[0]), new Date(anio2026_trimestre1[1])).map(e=>{
                                    return (
                                        <th className='text-center' style={{width: '240px'}}>{e.mesSTR}</th>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '340px'}}>TOTAL ANUAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemVentas className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026_trimestre1} id_empresa={id_empresa}/>
                        <TrItemVentas className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025_trimestre1} id_empresa={id_empresa}/>
                        <TrItemVentas className={'fs-2'} classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={anio2024_trimestre1} id_empresa={id_empresa}/>
                        <TrItemVentas className={'fs-1'} classNameTotal={'text-center border-left-10 border-right-10 border-bottom-10 '} label='TOTAL MENSUAL' arrayFechas={anioTotal_trimestre1} id_empresa={id_empresa}/>
                    </tbody>
                </Table>
            </div>
        </div>
    </div>
  )
}

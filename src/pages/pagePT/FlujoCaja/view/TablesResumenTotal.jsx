import React, { useEffect, useState } from 'react'
import { ViewResumenTotal } from '../ViewResumenTotal'
import { generarMesYanio } from '../helpers/generarMesYanio'
import { useFlujoCaja } from '../hook/useFlujoCajaStore'
import { Table } from 'react-bootstrap'
import { TdItem } from './TdItem'
import { TrItemVentas, TrItemEgresos } from './TrItem'
import dayjs from 'dayjs'
export const TablesResumenTotal = ({classNameEmpresa, bgPastel, id_empresa}) => {
    const anio2026 = ['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']
    const anio2025 = ['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']
    const anio2024 = ['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']
    const anioTotal = ['2024-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']

  return (
    <div>
        <div>
            <div style={{fontSize: '70px'}} className='text-black text-center'>INGRESOS</div>
            <div className='tab-scroll-container'>
                <Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
                    <thead>
                        <tr>
                            <th style={{width: '300px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white`}><div className='text-black'>Resultado <br/> anual</div></th>
                            {
                                generarMesYanio(new Date(anio2026[0]), new Date(anio2026[1])).map(e=>{
                                    return (
                                        <th className='text-center' style={{width: '240px'}}>{e.mesSTR}</th>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '240px'}}>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemVentas classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026} id_empresa={id_empresa}/>
                        <TrItemVentas classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025} id_empresa={id_empresa}/>
                        <TrItemVentas classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={anio2024} id_empresa={id_empresa}/>
                        <TrItemVentas classNameTotal={'text-center border-left-10 border-right-10 border-bottom-10 '} label='TOTAL' arrayFechas={anioTotal} id_empresa={id_empresa}/>
                    </tbody>
                </Table>
            </div>
        </div>
        <div>
            <div style={{fontSize: '70px'}} className='text-black text-center'>EGRESOS</div>
            <div className='tab-scroll-container'>
                <Table className='tabla-egresos fs-3' style={{ width: '100%' }} bordered>
                    <thead>
                        <tr>
                            <th style={{width: '300px'}} className={`fs-1 sticky-td-white border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white`}><div className='text-black'>Resultado <br/> anual</div></th>
                            {
                                generarMesYanio(new Date(anio2026[0]), new Date(anio2026[1])).map(e=>{
                                    return (
                                        <th className='text-center' style={{width: '240px'}}>{e.mesSTR}</th>
                                    )
                                })
                            }
                            <th className='text-center border-top-10 border-bottom-10 border-left-10 border-right-10' style={{width: '240px'}}>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemEgresos classNameTotal={'text-center border-left-10 border-right-10'} label='2026' arrayFechas={anio2026} id_empresa={id_empresa}/>
                        <TrItemEgresos classNameTotal={'text-center border-left-10 border-right-10'} label='2025' arrayFechas={anio2025} id_empresa={id_empresa}/>
                        <TrItemEgresos classNameTotal={'text-center border-left-10 border-right-10'} label='2024' arrayFechas={anio2024} id_empresa={id_empresa}/>
                        <TrItemEgresos classNameTotal={'text-center border-left-10 border-right-10 border-bottom-10'} label='TOTAL' arrayFechas={anioTotal} id_empresa={id_empresa}/>
                    </tbody>
                </Table>
            </div>
        </div>
        <div>
            <h1>UTILIDAD</h1>
            <div className='tab-scroll-container'>

            </div>
        </div>
    </div>
  )
}

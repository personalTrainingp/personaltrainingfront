import React, { useEffect, useState } from 'react'
import { ViewResumenTotal } from '../ViewResumenTotal'
import { generarMesYanio } from '../helpers/generarMesYanio'
import { useFlujoCaja } from '../hook/useFlujoCajaStore'
import { Table } from 'react-bootstrap'
import { TdItem } from './TdItem'
import { TrItemVentas } from './TrItemVentas'
import dayjs from 'dayjs'
export const TablesResumenTotal = ({classNameEmpresa, bgPastel, id_empresa}) => {
    // const { obtenerEgresosxFecha:obtenerEgresos2026, dataGastosxFecha:dataEgresos2026, 
    //         obtenerIngresosxFecha:obtenerIngresos2026, dataIngresosxFecha:dataIngresos2026 } = useFlujoCaja()
    const anio2026 = ['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']
    const anio2025 = ['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']
    const anio2024 = ['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']
    const anioTotal = ['2024-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']
    // useEffect(() => {
    //     obtenerEgresosxFecha(id_empresa, anio2026)
    //     obtenerIngresosxFecha(id_empresa, anio2026)
    // }, [])
    // console.log({dataGastosxFecha, dataIngresosxFecha});
    
  return (
    <div>
        {/* <pre>
            {
                JSON.stringify(dataGastosxFecha, null, 2)
            }
        </pre> */}
        <div>
            <h1>VENTAS</h1>
            <div className='tab-scroll-container'>
                <Table className='table-egresos fs-3' style={{ width: '100%' }} bordered>
                    <thead>
                        <tr>
                            <th style={{width: '500px'}} className={`fs-1 border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white sticky-td-${id_empresa}-white text-black `}>RESULTADO ANUAL</th>
                            {
                                generarMesYanio(new Date(anio2026[0]), new Date(anio2026[1])).map(e=>{
                                    return (
                                        <th>{e.mesSTR}</th>
                                    )
                                })
                            }
                            <th>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemVentas label='AÑO 2026' arrayFechas={anio2026} id_empresa={id_empresa}/>
                        <TrItemVentas label='AÑO 2025' arrayFechas={anio2025} id_empresa={id_empresa}/>
                        <TrItemVentas label='AÑO 2024' arrayFechas={anio2024} id_empresa={id_empresa}/>
                        <TrItemVentas label='TOTAL' arrayFechas={anioTotal} id_empresa={id_empresa}/>
                    </tbody>
                </Table>
            </div>
        </div>
        <div>
            <h1>EGRESOS</h1>
            <div className='tab-scroll-container'>
                <Table className='table-egresos fs-3' style={{ width: '100%' }} bordered>
                    <thead>
                        <tr>
                            <th style={{width: '500px'}} className={`fs-1 border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white sticky-td-${id_empresa}-white text-black `}>RESULTADO ANUAL</th>
                            {
                                generarMesYanio(new Date(anio2026[0]), new Date(anio2026[1])).map(e=>{
                                    return (
                                        <th>{e.mesSTR}</th>
                                    )
                                })
                            }
                            <th>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrItemVentas label='AÑO 2026' arrayFechas={anio2026} id_empresa={id_empresa}/>
                        <TrItemVentas label='AÑO 2025' arrayFechas={anio2025} id_empresa={id_empresa}/>
                        <TrItemVentas label='AÑO 2024' arrayFechas={anio2024} id_empresa={id_empresa}/>
                        <TrItemVentas label='TOTAL' arrayFechas={anioTotal} id_empresa={id_empresa}/>
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

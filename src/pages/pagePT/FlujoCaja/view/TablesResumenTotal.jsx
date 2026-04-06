import React, { useEffect, useState } from 'react'
import { ViewResumenTotal } from '../ViewResumenTotal'
import { generarMesYanio } from '../helpers/generarMesYanio'
import { useFlujoCaja } from '../hook/useFlujoCajaStore'
import { Table } from 'react-bootstrap'
export const TablesResumenTotal = ({classNameEmpresa, bgPastel, id_empresa}) => {
    const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja()
    const anio2026 = ['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']
    const anio2025 = ['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']
    const anio2024 = ['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']
    const anioTotal = ['2024-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']
    const [data, setdata] = useState({isOpen: false, items: [], header: ''})
    useEffect(() => {
        obtenerEgresosxFecha(id_empresa)
        obtenerIngresosxFecha(id_empresa)
    }, [])
    console.log({dataGastosxFecha, dataIngresosxFecha});
    
  return (
    <div>
        <div>
            <h1>VENTAS</h1>
            <div className='tab-scroll-container'>
                <Table className='table-egresos fs-3' style={{ width: '100%' }} bordered>
                    <thead>
                        <tr>
                            <th style={{width: '500px'}} className={` text-break fs-1 border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white sticky-td-${id_empresa}-white text-black `}>RESULTADO ANUAL</th>
                            {
                                generarMesYanio(new Date(anio2026[0]), new Date(anio2026[1])).map(e=>{
                                    return (
                                        <th>{JSON.stringify(e.fecha)}</th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <tr>AÑO 2026</tr>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
        <div>
            <h1>EGRESOS</h1>
            <div className='tab-scroll-container'>
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

import React, { useEffect, useState } from 'react'
import { ViewResumenTotal } from '../ViewResumenTotal'
import { generarMesYanio } from '../helpers/generarMesYanio'
import { useFlujoCaja } from '../hook/useFlujoCaja'
export const TablesResumenTotal = ({classNameEmpresa, bgPastel, arrayFecha=[], id_empresa}) => {
    const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja()
    const [data, setdata] = useState({isOpen: false, items: [], header: ''})
    const [isOpenModalCustomGasto, setisOpenModalCustomGasto] = useState({isOpen: false, id: 0})
    useEffect(() => {
        obtenerEgresosxFecha(id_empresa, arrayFecha)
        obtenerIngresosxFecha(id_empresa, arrayFecha)
    }, [])
    console.log({dataIngresosxFecha, dataGastosxFecha});
    const onOpenModalTableItems = (data)=>{
        setdata({isOpen: true, items: data, header: ''})
    }
    const onCloseModalTableItems = ()=>{
        setdata({isOpen: false, items: [], header: ''})
    }
    const onOpenModalCustomGasto = (id)=>{
        setisOpenModalCustomGasto({isOpen: true, id: id})
    }
    const onCloseModalCustomGasto = ()=>{
        setisOpenModalCustomGasto({isOpen: false, id: 0})
    }
    const anio2026 = ['2026-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']
    const anio2025 = ['2025-01-01 15:45:47.6640000 +00:00', '2025-12-31 15:45:47.6640000 +00:00']
    const anio2024 = ['2024-01-01 15:45:47.6640000 +00:00', '2024-12-31 15:45:47.6640000 +00:00']
    const anioTotal = ['2024-01-01 15:45:47.6640000 +00:00', '2026-12-31 15:45:47.6640000 +00:00']
  return (
    <div>
        <div>
            <h1>TOTAL</h1>
            <div className='tab-scroll-container'>
                <ViewResumenTotal
                    onOpenModalTableItems={onOpenModalTableItems}  
                    bgPastel={bgPastel} 
                    bgTotal={classNameEmpresa} 
                    anio={anioTotal}
                    id_enterprice={id_empresa} 
                    fechas={generarMesYanio(new Date(anioTotal[0]), new Date(anioTotal[1]))} />
            </div>
        </div>
        <div>
            <h1>2026</h1>
            <div className='tab-scroll-container'>
                <ViewResumenTotal
                    onOpenModalTableItems={onOpenModalTableItems}  
                    bgPastel={bgPastel} 
                    bgTotal={classNameEmpresa}
                    anio={anio2026}
                    id_enterprice={id_empresa} 
                    fechas={generarMesYanio(new Date(anio2026[0]), new Date(anio2026[1]))} />
            </div>
        </div>
        <div>
            <h1>2025</h1>
            <div className='tab-scroll-container'>
                <ViewResumenTotal
                    onOpenModalTableItems={onOpenModalTableItems}  
                    bgPastel={bgPastel} 
                    bgTotal={classNameEmpresa} 
                    id_enterprice={id_empresa} 
                    anio={anio2025}
                    fechas={generarMesYanio(new Date(anio2025[0]), new Date(anio2025[1]))} />
            </div>
        </div>
        <div>
            <h1>2024</h1>
            <div className='tab-scroll-container'>
                <ViewResumenTotal
                    onOpenModalTableItems={onOpenModalTableItems}  
                    bgPastel={bgPastel} 
                    bgTotal={classNameEmpresa} 
                    id_enterprice={id_empresa} 
                    anio={anio2024}
                    fechas={generarMesYanio(new Date(anio2024[0]), new Date(anio2024[1]))} />
            </div>
        </div>
    </div>
  )
}

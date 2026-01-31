import React, { useEffect } from 'react'
import { FechaCorte } from '@/components/RangeCalendars/FechaRange'
import { useSelector } from 'react-redux'
import { useInformeEjecutivoStore } from '../../useInformeEjecutivoStore'
import { DataTable1 } from './DataTableComparativoConMes/DataTable1'
import { generarMesYanio } from '../../helpers/generarMesYanio'

export const AppComparativoConMes = ({titulo}) => {
    const { obtenerVentas, dataVentas } = useInformeEjecutivoStore()
    const { corte } = useSelector((e) => e.DATA);

    useEffect(() => {
        obtenerVentas(['2025-01-02 15:45:47.6640000 +00:00','2025-12-04 20:42:20.4490000 +00:00'])
    }, [])
    const totalMap = [...dataVentas.dataMembresias, ...dataVentas.dataProductos17,...dataVentas.dataProductos18, ...dataVentas.dataMFMap]
    
  return (
    <div>
        <div className='fs-1'>
          {titulo}
        </div>
        
    <div className="table-responsive" style={{ width: '100%' }}>
        <DataTable1 nombreCategoriaVenta={'MEMBRESIAS'} data={dataVentas.dataMembresias?.filter((el) => corte.dia.includes(el.dia))} arrayFechas={generarMesYanio('2024-09-01 15:45:47.6640000 +00:00')}/>
        <DataTable1 nombreCategoriaVenta={'SUPLEMENTOS'} data={dataVentas.dataProductos17?.filter((el) => corte.dia.includes(el.dia))} arrayFechas={generarMesYanio('2024-09-01 15:45:47.6640000 +00:00')}/>
        <DataTable1 nombreCategoriaVenta={'ACCESORIOS'} data={dataVentas.dataProductos18?.filter((el) => corte.dia.includes(el.dia))} arrayFechas={generarMesYanio('2024-09-01 15:45:47.6640000 +00:00')}/>
        <DataTable1 nombreCategoriaVenta={'MONKEY FIT'} data={dataVentas.dataMFMap?.filter((el) => corte.dia.includes(el.dia))} arrayFechas={generarMesYanio('2024-09-01 15:45:47.6640000 +00:00')}/>
        <DataTable1 nombreCategoriaVenta={'TOTAL'} data={totalMap?.filter((el) => corte.dia.includes(el.dia))} arrayFechas={generarMesYanio('2024-09-01 15:45:47.6640000 +00:00')}/>
    </div>
    </div>
  )
}

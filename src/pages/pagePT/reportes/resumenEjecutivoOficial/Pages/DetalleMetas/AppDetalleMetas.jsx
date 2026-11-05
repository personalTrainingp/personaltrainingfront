import React, { useEffect } from 'react'
import { DataTableMetas } from './View/DataTableMetas'
import { sumarMontoTotal, useInformeEjecutivoStore } from '../../useInformeEjecutivoStore';
import { useSelector } from 'react-redux';
import { generarMesYanio } from '../../helpers/generarMesYanio';
import { FechaCorte } from '@/components/RangeCalendars/FechaRange';
import { agruparPorMesDiaFechaVenta } from '../../helpers/agruparPorMesDiaFechaVenta';
import { cuotasMonto } from '@/types/type';

export const AppDetalleMetas = ({corte, titulo}) => {
        const { obtenerVentas, dataVentas,  } = useInformeEjecutivoStore()
        useEffect(() => {
            obtenerVentas(['2025-01-02 15:45:47.6640000 +00:00','2025-12-04 20:42:20.4490000 +00:00'])
        }, [])
        const dataMetasCuotasMembresiaRenovaciones=[
            {mes: 1, anio: 2026, meta: 40000},
            {mes: 12, anio: 2025, meta: 40000},
        ]
  return (
    <div>
        {/* <div className='text-center fs-1'>CUOTAS DEL MES</div> */}
        <div className='fs-1 text-center'>
          {titulo}
        </div>
        <div  className="table-responsive" style={{ width: '100%' }}>
            <DataTableMetas label={'TOTAL'} labelMontoVenta={'VENTA TOTAL AL CORTE'} nombreDeComparativo='CUOTA DEL MES' arrayFechas={generarMesYanio('2024-09-01 15:45:47.6640000 +00:00')} data={[...dataVentas.dataMembresias, ...dataVentas.dataProductos17,...dataVentas.dataProductos18, ...dataVentas.dataMFMap]} corte={corte}  dataCuotaMetaDelMes={cuotasMonto}/>
        </div>
    </div>
  )
}

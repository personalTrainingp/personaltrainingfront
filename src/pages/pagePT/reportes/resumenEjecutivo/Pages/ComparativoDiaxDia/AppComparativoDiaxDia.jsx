import React, { useEffect } from 'react'
import { DataCalendario } from './View/DataCalendario'
import { useInformeEjecutivoStore } from '../../useInformeEjecutivoStore';
import { useSelector } from 'react-redux';

export const AppComparativoDiaxDia = () => {
    const { obtenerVentas, dataVentas } = useInformeEjecutivoStore()
    const { corte } = useSelector((e) => e.DATA);

    useEffect(() => {
        obtenerVentas(['2025-01-02 15:45:47.6640000 +00:00','2025-12-04 20:42:20.4490000 +00:00'])
    }, [])
  return (
    <div>
        <DataCalendario data={dataVentas.dataMembresias}/>
    </div>
  )
}

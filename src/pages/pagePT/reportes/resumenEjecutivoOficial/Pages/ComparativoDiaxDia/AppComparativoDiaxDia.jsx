import React, { useEffect } from 'react'
import { DataCalendario } from './View/DataCalendario'
import { useInformeEjecutivoStore } from '../../useInformeEjecutivoStore';
import { useSelector } from 'react-redux';

export const AppComparativoDiaxDia = () => {
    const { obtenerVentas, dataVentas } = useInformeEjecutivoStore()
    const { corte } = useSelector((e) => e.DATA);
    const corteAnio = corte?.fecha?.split('-')[0]
    const corteMes = corte?.fecha?.split('-')[1]
    useEffect(() => {
        obtenerVentas(['2025-01-02 15:45:47.6640000 +00:00','2025-12-04 20:42:20.4490000 +00:00'])
    }, [])
    const dataVt = dataVentas.dataMembresias
    const dataAlterada = dataVentas.dataMembresias?.filter(
  ({ mes, anio, dia }) =>
    Number(mes) === Number(corteMes) &&
    Number(anio) === Number(corteAnio) &&
    corte?.dia?.includes(Number(dia))
);
  return (
    <div>
      
        <DataCalendario data={dataAlterada} diaFin={corte?.dia?.[corte?.dia?.length - 1] || 31} initialMonth={(corteMes)} initialYear={(corteAnio)}/>
    </div>
  )
}

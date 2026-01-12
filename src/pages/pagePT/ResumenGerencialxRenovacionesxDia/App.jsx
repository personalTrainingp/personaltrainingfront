import { PageBreadcrumb } from '@/components'
import { FechaCorte } from '@/components/RangeCalendars/FechaRange'
import React, { useEffect, useState } from 'react'
import { DataTableOrigen } from './DataTableOrigen'
import { useRenovacionesStore } from './hook/useRenovacionesStore'
import { Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { App2 } from './App2'
import { agruparPorMesDiaFechaVenta } from './helpers/agruparPorMesDiaFechaVenta'
import { agruparPorMes } from './helpers/agruparPorMes'

export const App = () => {
  const { obtenerVentas, dataVentasMembresia } = useRenovacionesStore()
	const { corte } = useSelector((e) => e.DATA);
  useEffect(() => {
    obtenerVentas()
  }, [])
  
  const filtroDiaVentasMembresiaxMes = agruparPorMesDiaFechaVenta(
    dataVentasMembresia
  ).filter((el) => corte.dia.includes(el.dia));
			const ventasMembresiaxCorteDeDia = agruparPorMes(filtroDiaVentasMembresiaxMes);
      console.log({ventasMembresiaxCorteDeDia});
      
  return (
    <div>
      <PageBreadcrumb title={'DETALLE RENOVACIONES X DIA'}/>
      <FechaCorte corte={corte.corte} inicio={corte.inicio}/>
      <App2 dataVentasMembresia={ventasMembresiaxCorteDeDia}/>
    </div>
  )
}
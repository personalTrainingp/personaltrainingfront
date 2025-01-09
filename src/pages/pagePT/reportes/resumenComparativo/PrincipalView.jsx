import { PageBreadcrumb } from '@/components'
import React from 'react'
import { VentasMesGrafico } from './HistoricoVentasMembresias/VentasMesGrafico'
import { ResumenComparativo } from './ResumenComparativo'

export const PrincipalView = () => {
  return (
    <>
        
            <PageBreadcrumb title={'RESUMEN PARA MARKETING'} subName={''}/>
            <VentasMesGrafico/>
            <ResumenComparativo/>
    </>
  )
}

import { PageBreadcrumb } from '@/components'
import React from 'react'
import { VentasMesGrafico } from './HistoricoVentasMembresias/VentasMesGrafico'
import { ResumenComparativo } from './ResumenComparativo'
import { useSelector } from 'react-redux'

export const PrincipalView = () => {
  const {viewSubTitle} = useSelector(d=>d.ui)
  return (
    <>
        
            <PageBreadcrumb title={`comparativa`} topTitle={<h1 style={{fontSize: '37px', color: 'black'}}>{viewSubTitle}</h1>} subName={''}/>
            {/* <VentasMesGrafico/> */}
            <ResumenComparativo/>
    </>
  )
}

import { PageBreadcrumb } from '@/components'
import React from 'react'
import { useSelector } from 'react-redux'
import { ResumenComparativo } from './ResumenComparativo'

export const PrincipalView = () => {
  const {viewSubTitle} = useSelector(d=>d.ui)
  return (
    <>
        
            <PageBreadcrumb title={`COMPARATIVA DEMOGRAFICA TOTAL`} topTitle={<h1 style={{fontSize: '37px', color: 'black'}}>{viewSubTitle}</h1>} subName={''}/>
            {/* <VentasMesGrafico/> */}
            <ResumenComparativo/>
    </>
  )
}

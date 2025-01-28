import React, { useEffect } from 'react'
import { TablePrincipal } from './TablePrincipal'
import { PageBreadcrumb } from '@/components'

export const PrincipalView = () => {
    useEffect(() => {
        
    }, [])
    
  return (
    <>
    <PageBreadcrumb title={'SESIONES ACTIVOS'}/>
    <TablePrincipal/>
    </>
  )
}

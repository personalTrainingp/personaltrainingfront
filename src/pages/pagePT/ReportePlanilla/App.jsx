import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { PageBreadcrumb } from '@/components'
import { confirmDialog } from 'primereact/confirmdialog'
import { TablePlanilla } from './TablePlanilla'
export const App = () => {
  const [isOpenModalCustomLead, setisOpenModalCustomLead] = useState({isOpen: false, id: 0, id_empresa: 598, formUpdating: {}})
  
  return (
    <>
      <PageBreadcrumb title={'PLANILLA'}/>
      <TablePlanilla/>
    </>
  )
}

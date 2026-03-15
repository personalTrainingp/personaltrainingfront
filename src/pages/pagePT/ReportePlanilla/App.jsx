import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { PageBreadcrumb } from '@/components'
import { confirmDialog } from 'primereact/confirmdialog'
import { TablePlanilla } from './TablePlanilla'
export const App = () => {
  const [isOpenModalCustomLead, setisOpenModalCustomLead] = useState({isOpen: false, id: 0, id_empresa: 598, formUpdating: {}})
  const onClickCustomLead = (id, id_empresa, formUpdating)=>{
    setisOpenModalCustomLead({isOpen: true, id: id, id_empresa, formUpdating})
  }
  const onDeleteItemLead = (id, id_empresa)=>{
    confirmDialog({
      header: 'Confirmar eliminación',
      message: '¿Está seguro de eliminar este lead?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

      },
      reject: () => {
          // nothing to do
      }
    })
  }
  
  return (
    <>
      <PageBreadcrumb title={'PLANILLA'}/>
      <TablePlanilla/>
    </>
  )
}

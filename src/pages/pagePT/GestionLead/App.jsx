import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useGestionLeadStore } from './useGestionLeadStore'
import { PageBreadcrumb } from '@/components'
import { Button } from 'primereact/button'
import { TableGestionLead } from './TableGestionLead'
import { ModalCustomLead } from './ModalCustomLead'
import { useSelector } from 'react-redux'
import { confirmDialog } from 'primereact/confirmdialog'

export const App = () => {
  const { obtenerLeads, deleteLead } = useGestionLeadStore()
  const { dataView } = useSelector(e=>e.DATA)
  const [isOpenModalCustomLead, setisOpenModalCustomLead] = useState({isOpen: false, id: 0})
  const onClickCustomLead = (id)=>{
    setisOpenModalCustomLead({isOpen: true, id: id})
  }
  const onDeleteItemLead = (id)=>{
    confirmDialog({
      header: 'Confirmar eliminación',
      message: '¿Está seguro de eliminar este lead?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        deleteLead(id)
      },
      reject: () => {
          // nothing to do
      }
    })
  }
  useEffect(() => {
    obtenerLeads(598)
  }, [])
  
  return (
    <>
      <PageBreadcrumb title={'GESTION DE LEADS'}/>
      <Row> 
        <Col lg={12}>
        <Button label='AGREGAR LEAD' onClick={()=>onClickCustomLead(0)}/>
        </Col>
        <Col lg={12}>
          <TableGestionLead onDeleteItemLead={onDeleteItemLead} onClickCustomLead={onClickCustomLead} data={dataView}/>
        </Col>
      </Row>
      <ModalCustomLead id={isOpenModalCustomLead.id} onHide={()=>setisOpenModalCustomLead({isOpen: false, id: 0})} show={isOpenModalCustomLead.isOpen}/>
    </>
  )
}

import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useGestionLeadStore } from './useGestionMonkFitStore'
import { PageBreadcrumb } from '@/components'
import { Button } from 'primereact/button'
import { TableGestionLead } from './TableGestionReservaMonkFit'
import { ModalCustomLead } from './ModalCustomReservaMonkFit'
import { confirmDialog } from 'primereact/confirmdialog'
import { TabPanel, TabView } from 'primereact/tabview'

export const App = () => {
  const { deleteLead } = useGestionLeadStore()
  const [isOpenModalCustomLead, setisOpenModalCustomLead] = useState({isOpen: false, id: 0, id_empresa: 598, formUpdating: {}})
  const onClickCustomLead = (id, id_empresa, formUpdating)=>{
    setisOpenModalCustomLead({isOpen: true, id: id, id_empresa, formUpdating})
  }
  const onDeleteItemLead = (id, id_empresa)=>{
    confirmDialog({
      header: 'Confirmar eliminación',
      message: '¿Está seguro de eliminar esta reserva?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        deleteLead(id, id_empresa)
      },
      reject: () => {
          // nothing to do
      }
    })
  }
  
  return (
    <>
      <PageBreadcrumb title={'GESTION DE LEADS'}/>
      <Row> 
        <Col lg={12}>
          <TabView>
              <TableGestionLead id_empresa={598} onDeleteItemLead={onDeleteItemLead} onClickCustomLead={onClickCustomLead}/>
          </TabView>
        </Col>
      </Row>
      <ModalCustomLead formUpdating={isOpenModalCustomLead?.formUpdating} id_empresa={isOpenModalCustomLead.id_empresa} id={isOpenModalCustomLead.id} onHide={()=>setisOpenModalCustomLead({isOpen: false, id: 0})} show={isOpenModalCustomLead.isOpen}/>
    </>
  )
}

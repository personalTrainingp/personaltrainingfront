import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useGestionLeadStore } from './useGestionLeadStore'
import { PageBreadcrumb } from '@/components'
import { Button } from 'primereact/button'
import { TableGestionLead } from './TableGestionLead'
import { ModalCustomLead } from './ModalCustomLead'
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
      message: '¿Está seguro de eliminar este lead?',
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
            <TabPanel header='CHANGE'>
              <TableGestionLead id_empresa={598} onDeleteItemLead={onDeleteItemLead} onClickCustomLead={onClickCustomLead}/>
            </TabPanel>
            <TabPanel header='CIRCUS'>
              <TableGestionLead id_empresa={599} onDeleteItemLead={onDeleteItemLead} onClickCustomLead={onClickCustomLead}/>
            </TabPanel>
          </TabView>
        </Col>
      </Row>
      <ModalCustomLead formUpdating={isOpenModalCustomLead?.formUpdating} id_empresa={isOpenModalCustomLead.id_empresa} id={isOpenModalCustomLead.id} onHide={()=>setisOpenModalCustomLead({isOpen: false, id: 0})} show={isOpenModalCustomLead.isOpen}/>
    </>
  )
}

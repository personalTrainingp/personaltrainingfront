import React, { useState } from 'react'
import { Button, Card, Col, Row, Table } from 'react-bootstrap'
import { ModalCambioPrograma } from './ModalCambioPrograma'
import { PageBreadcrumb } from '@/components'
import { FormatTable } from '@/components/ComponentTable/FormatTable'
import TableCambioPrograma from './TableCambioPrograma'

export const ViewTableGestionCambioPrograma = () => {
    const [isOpenModalCambioPrograma, setisOpenModalCambioPrograma] = useState(false)
    const onOpenModalCambioPrograma = () => {
        setisOpenModalCambioPrograma(true)
    }
    const onCloseModalCambioPrograma = ()=>{
        setisOpenModalCambioPrograma(false)
    }
  return (
    <Row>
        <PageBreadcrumb title={'Cambio de programa'}/>
        <ModalCambioPrograma onHide={onCloseModalCambioPrograma} show={isOpenModalCambioPrograma}/>
        {/* <Col xxl={1}>
        </Col> */}
        <Col xxl={12}>
        <Button onClick={onOpenModalCambioPrograma}>Cambiar programa</Button>
        <TableCambioPrograma/>
        </Col>
        {/* <Col xxl={1}>
        </Col> */}
    </Row>
  )
}

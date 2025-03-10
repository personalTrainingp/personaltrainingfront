import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { Card, Col, Row, Table } from 'react-bootstrap'
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
        <Button label='Cambio de programa' onClick={onOpenModalCambioPrograma}/>
        <Card>
            <Card.Body>
                <TableCambioPrograma/>
            </Card.Body>
        </Card>
        </Col>
        {/* <Col xxl={1}>
        </Col> */}
    </Row>
  )
}

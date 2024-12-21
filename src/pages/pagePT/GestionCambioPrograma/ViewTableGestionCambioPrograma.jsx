import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { ModalCambioPrograma } from './ModalCambioPrograma'

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
        <ModalCambioPrograma onHide={onCloseModalCambioPrograma} show={isOpenModalCambioPrograma}/>
        <Col xxl={1}>
        </Col>
        <Col xxl={10}>
        <Button label='Cambio de programa' onClick={onOpenModalCambioPrograma}/>
        <Card>
            <Card.Body>

            </Card.Body>
        </Card>
        </Col>
        <Col xxl={1}>
        </Col>
    </Row>
  )
}

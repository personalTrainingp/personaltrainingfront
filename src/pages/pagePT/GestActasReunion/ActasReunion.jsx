import { PageBreadcrumb } from '@/components'
import React, { useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { DataTableActaReunion } from './DataTableActaReunion'
import { ModalActaReunion } from './ModalActaReunion'
// import { ModalTipoCambio } from './ModalTipoCambio'
// import { DataTableTipoCambio } from './DataTableTipoCambio'

export const ActasReunion = () => {
    const [isOpenModalTipoCambio, setisOpenModalTipoCambio] = useState(false)
    const onOpenModalTipoCambio = () =>{
        setisOpenModalTipoCambio(true)
    }
    const onCloseModalTipoCambio = () =>{
        setisOpenModalTipoCambio(false)
    }
  return (
    <>
        <PageBreadcrumb title={'Acta de reunion'} subName={'T'}/>
        <Row>
            <Col xxl={1}>
            </Col>
            <Col xxl={10}>
                <Card>
                    <Card.Header>
                        <Card.Title>
                            <Button onClick={onOpenModalTipoCambio}>
                                Agregar Acta Reunion
                            </Button>
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <DataTableActaReunion/>
                    </Card.Body>
                </Card>
            </Col>
            <Col xxl={1}>
            </Col>
        </Row>
        <ModalActaReunion show={isOpenModalTipoCambio} onHide={onCloseModalTipoCambio}/>
    </>
  )
}

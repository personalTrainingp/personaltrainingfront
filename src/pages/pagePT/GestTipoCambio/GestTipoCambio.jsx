import { PageBreadcrumb } from '@/components'
import React, { useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { ModalTipoCambio } from './ModalTipoCambio'
import { DataTableTipoCambio } from './DataTableTipoCambio'

export const GestTipoCambio = () => {
    const [isOpenModalTipoCambio, setisOpenModalTipoCambio] = useState(false)
    const onOpenModalTipoCambio = () =>{
        setisOpenModalTipoCambio(true)
    }
    const onCloseModalTipoCambio = () =>{
        setisOpenModalTipoCambio(false)
    }
  return (
    <>
        <PageBreadcrumb title={'Tipo de cambio'} subName={'T'}/>
        <Row>
            <Col xxl={1}>
            </Col>
            <Col xxl={10}>
                <Card>
                    <Card.Header>
                        <Card.Title>
                            <Button onClick={onOpenModalTipoCambio}>
                                Agregar Tipo de cambio
                            </Button>
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <DataTableTipoCambio/>
                    </Card.Body>
                </Card>
            </Col>
            <Col xxl={1}>
            </Col>
        </Row>
        <ModalTipoCambio show={isOpenModalTipoCambio} onHide={onCloseModalTipoCambio}/>
    </>
  )
}

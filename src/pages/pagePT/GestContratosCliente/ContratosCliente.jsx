import { PageBreadcrumb } from '@/components'
import React, { useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { DataTableContratoCliente } from './DataTableContratoCliente'
// import { ModalTipoCambio } from './ModalTipoCambio'
// import { DataTableTipoCambio } from './DataTableTipoCambio'

export const ContratosCliente = () => {
    const [isOpenModalTipoCambio, setisOpenModalTipoCambio] = useState(false)
    const onOpenModalTipoCambio = () =>{
        setisOpenModalTipoCambio(true)
    }
    
    const onCloseModalTipoCambio = () =>{
        setisOpenModalTipoCambio(false)
    }
  return (
    <>
        <PageBreadcrumb title={'CONTRATOS DE SOCIOS'} subName={'T'}/>
        <Row>
            <Col xxl={1}>
            </Col>
            <Col xxl={10}>
                <Card>
                    <Card.Body>
                        <DataTableContratoCliente/>
                    </Card.Body>
                </Card>
            </Col>
            <Col xxl={1}>
            </Col>
        </Row>
        {/* <ModalTipoCambio show={isOpenModalTipoCambio} onHide={onCloseModalTipoCambio}/> */}
    </>
    )
}

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
        <PageBreadcrumb title={'SITUACION DE CONTRATOS DE SOCIOS'} subName={'T'}/>
        <Row>
            <Col xxl={12}>
                <Card>
                    <Card.Body>
                        <DataTableContratoCliente/>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        {/* */}
    </>
    )
}

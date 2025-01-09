import { PageBreadcrumb } from '@/components'
import { Button } from 'primereact/button'
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { DataTable } from './DataTable'

export const PrincipalView = () => {
  return (
    <>
        <PageBreadcrumb title={'REPORTE DE PLANILLA'}/>
        <br/>
            <Button label='AGREGAR PLANILLA'/>
        <Card>
            <Row>
                <Col xxl={1}>
                </Col>
                <Col xxl={10}>
                    <DataTable/>
                </Col>
                <Col xxl={1}>
                </Col>
            </Row>
        </Card>
    </>
  )
}

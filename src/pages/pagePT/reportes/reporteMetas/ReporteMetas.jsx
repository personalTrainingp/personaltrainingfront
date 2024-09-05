import React from 'react'
import { MetaTitle } from './MetaTitle'
import { PageBreadcrumb } from '@/components'
import { Col, Row } from 'react-bootstrap'
import { MetaPorAsesor } from './MetaPorAsesor'
import { MetaPorItem } from './MetaPorItem'

export const ReporteMetas = () => {
  return (
    <>
    <PageBreadcrumb title="Ventas por metas" subName="Ventas" />
    <Row>
        <Col lg={3}>
            <MetaTitle dataMeta={''}/>
            <MetaPorAsesor dataAsesores={''}/>
        </Col>
        <Col lg={9}>
            <MetaPorItem/>
        </Col>
    </Row>

    </>
  )
}

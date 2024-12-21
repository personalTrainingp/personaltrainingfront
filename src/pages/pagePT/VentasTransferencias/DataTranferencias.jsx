import { PageBreadcrumb } from '@/components'
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { TableView } from './TableView'
import { FechaRange } from '@/components/RangeCalendars/FechaRange'
import { useSelector } from 'react-redux'

export const DataTranferencias = () => {
          const { RANGE_DATE } = useSelector(e=>e.DATA)
  return (
    <>
    <PageBreadcrumb title={'TRANSFERENCIAS'}/>
        <FechaRange rangoFechas={RANGE_DATE}/>
        <br/>
    <Row>
        <Col xxl={1}>
        </Col>
        
        <Col xxl={10}>
            <TableView RANGE_DATE={RANGE_DATE}/>
        </Col>
        
        <Col xxl={1}>
        </Col>
    </Row>
    </>
  )
}

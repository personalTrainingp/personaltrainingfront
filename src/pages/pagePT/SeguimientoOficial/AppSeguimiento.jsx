import React, { useEffect } from 'react'
import { useSeguimientoStore } from './useSeguimientoStore'
import { Col, Row } from 'react-bootstrap'
import { TableSeguimientos } from './TableSeguimientos'

export const AppSeguimiento = () => {
    
  return (
    <div>
      <Row>
        <Col lg={4}>
          <TableSeguimientos rangeDate={["2026-02-10T00:00:00.000Z", "2028-03-16T00:00:00.000Z"]}/>
        </Col>
        <Col lg={4}>
          <TableSeguimientos rangeDate={[ "2025-12-10T00:00:00.000Z","2026-02-10T00:00:00.000Z"]}/>
        </Col>
        <Col lg={4}>
          <TableSeguimientos rangeDate={["2024-09-16T00:00:00.000Z","2025-12-10T00:00:00.000Z"]}/>
        </Col>
      </Row>
    </div>
  )
}

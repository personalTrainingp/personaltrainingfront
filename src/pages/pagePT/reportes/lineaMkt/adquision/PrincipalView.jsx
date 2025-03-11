import { PageBreadcrumb } from '@/components'
import { Button } from 'primereact/button'
import React, { useEffect } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { ItemTable } from './ItemTable'
import { useAdquisicionStore } from './useAdquisicionStore'

export const PrincipalView = () => {
  const { obtenerTodoVentas, data } = useAdquisicionStore()
  useEffect(() => {
    obtenerTodoVentas()
  }, [])
  console.log(data, "obsera");
  
  return (
    <>
    <PageBreadcrumb title={'ADQUISICION'}/>
    <Row>
      <Col lg={12}>
        <Card>
          <Card.Body>
            <Row>
              <ItemTable />
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    </>
  )
}

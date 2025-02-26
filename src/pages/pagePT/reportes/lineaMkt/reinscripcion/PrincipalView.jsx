import { PageBreadcrumb } from '@/components'
import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'

export const PrincipalView = () => {
  return (
    <>
    <PageBreadcrumb title={'REINSCRIPCIONES'}/>
    <Row>
      <Col lg={12}>
        <Card>
          <Card.Header>
            <Button label='AGREGAR MES'/>
          </Card.Header>
          <Card.Body>
            <Row>
              
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    </>
  )
}

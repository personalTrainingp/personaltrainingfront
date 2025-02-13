import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { ModalAddMesResChange } from './ModalAddMesResChange'
import { useSelector } from 'react-redux'
import { TableEstadist } from './TableEstadist'

export const PrincipalView = () => {
  const [isOpenModalAddMesResChange, setisOpenModalAddMesResChange] = useState(false)
  const {dataF} = useSelector(e=>e.DATA)
  const onOpenModalAddMesResChange = () => {
    setisOpenModalAddMesResChange(true)
  }
  const onCloseModalAddMesResChange = () => {
    setisOpenModalAddMesResChange(false)
  }
  
  return (
    <>
      <Row>
        <Col lg={1}>
        </Col>
        <Col lg={10}>
        <Card>
          <Card.Header>
            <Button label='AGREGAR MES' onClick={onOpenModalAddMesResChange}/>
          </Card.Header>
          <Card.Body>
            {
              dataF.map((f, index)=>{
                
                return (
                  <TableEstadist data={f} key={index}/>
                )
              })
            }
          </Card.Body>
        </Card>
        </Col>
        <Col lg={1}>
        </Col>
      </Row>
      <ModalAddMesResChange show={isOpenModalAddMesResChange} onHide={onCloseModalAddMesResChange}/>
    </>
  )
}

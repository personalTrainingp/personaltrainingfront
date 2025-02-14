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
        <Col lg={12}>
        <Card>
          <Card.Header>
            <Button label='AGREGAR MES' onClick={onOpenModalAddMesResChange}/>
          </Card.Header>
          <Card.Body>
            <Row>
              {
                dataF.map((f, index)=>{
                  
                  return (
                    <Col lg={4}>
                      <TableEstadist data={f} key={index}/>
                    </Col>
                  )
                })
              }
            </Row>
          </Card.Body>
        </Card>
        </Col>
      </Row>
      <ModalAddMesResChange show={isOpenModalAddMesResChange} onHide={onCloseModalAddMesResChange}/>
    </>
  )
}

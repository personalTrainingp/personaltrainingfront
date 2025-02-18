import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { ModalAddMesResChange } from './ModalAddMesResChange'
import { useSelector } from 'react-redux'
import { TableEstadist } from './TableEstadist'
import { PageBreadcrumb } from '@/components'
import { useResultadosChange } from './useResultadosChange'

export const PrincipalView = () => {
  const [isOpenModalAddMesResChange, setisOpenModalAddMesResChange] = useState(false)
  const { obtenerTodoVentas, data } = useResultadosChange()
  const {dataRes} = useSelector(e=>e.DATA)
  const onOpenModalAddMesResChange = () => {
    setisOpenModalAddMesResChange(true)
  }
  const onCloseModalAddMesResChange = () => {
    setisOpenModalAddMesResChange(false)
  }
  useEffect(() => {
    obtenerTodoVentas()
  }, [])
  console.log(dataRes);
  
  
  return (
    <>
    <PageBreadcrumb title={'RESULTADOS CHANGE'}/>
      <Row>
        <Col lg={12}>
        <Card>
          <Card.Header>
            <Button label='AGREGAR MES' onClick={onOpenModalAddMesResChange}/>
          </Card.Header>
          <Card.Body>
            <Row>
              {
                data.map((f, index)=>{
                  
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

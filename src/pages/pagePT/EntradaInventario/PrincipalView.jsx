import { FormatTable } from '@/components/ComponentTable/FormatTable'
import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { ModalEntradaInventario } from './ModalEntradaInventario'

export const PrincipalView = () => {
  const [isModalEntradaInventario, setisModalEntradaInventario] = useState(false)
  const onOpenModalEntradaInventario = () => {
    setisModalEntradaInventario(true)
  }
  const onCloseModalEntradaInventario = ()=>{
    setisModalEntradaInventario(false)
  }
  const dataForTable = [
    {header: '', isSortable: true, value: '1', tFood: '', order: 3},
    {header: 'ITEM', isSortable: true, value: 4, tFood: 'TOTAL', order: 3},
    {header: 'CANTIDAD', isSortable: true, value: 4, tFood: '', order: 3},
    {header: 'FECHA DE ENTRADA', isSortable: true, value: 4, tFood: '', order: 3},
    {header: 'MOTIVO', isSortable: true, value: 4, tFood: '', order: 3},
    {header: 'OBSERVACION', isSortable: true, value: 4, tFood: '', order: 3},
  ]
  return (
    <>
    <Row>
      <Col lg={1}>
      </Col>
      <Col lg={10}>
        <Card>
          <Card.Header>
            <Button onClick={onOpenModalEntradaInventario}>AGREGAR ENTRADA</Button>
          </Card.Header>
          <Card.Body>
            <FormatTable data={[dataForTable]}/>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={1}>
      </Col>
    </Row>
    <ModalEntradaInventario onHide={onCloseModalEntradaInventario} show={isModalEntradaInventario}/>
    </>
  )
}

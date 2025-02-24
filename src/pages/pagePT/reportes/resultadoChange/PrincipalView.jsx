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

  const dataPrueba = [
    {
      fecha: 'septiembre 2024',
      inversion: 16.77,
      facturacion: 0,
      numero_mensajes: 2,
      numero_cierre: 0,
      ticket_medio: 0,
    },
    {
      fecha: 'octubre 2024',
      inversion: 427,
      facturacion: 6261,
      numero_cierre: 3,
      numero_mensajes: 348,
      ticket_medio: 2087,
    },
    {
      fecha: 'noviembre 2024',
      inversion: 248,
      facturacion: 5325,
      numero_cierre: 10,
      numero_mensajes: 282,
      ticket_medio: 591.67,
    },
    {
      fecha: 'diciembre 2024',
      inversion: 838,
      facturacion: 25192,
      numero_cierre: 38,
      numero_mensajes: 787,
      ticket_medio: 662.95,
    },
    {
      fecha: 'enero 2025',
      inversion: 919,
      facturacion: 19523,
      numero_cierre: 19,
      numero_mensajes: 1155,
      ticket_medio: 1096.95,
    },
    {
      fecha: 'febrero 2025',
      inversion: 805,
      facturacion: 16654,
      numero_cierre: 17,
      numero_mensajes: 996,
      ticket_medio: 969.65,
    }
  ]
  
  return (
    <>
    <PageBreadcrumb title={'RESULTADOS por INVERSION DIGITAL'}/>
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
                  const dataInv = dataPrueba.map(m=>{return {...m, inversion: m.inversion*3.75}}).find((p)=>p.fecha ===f.fecha)
                  const acumula = {...f, ...dataInv}
                  return (
                    <Col lg={4}>
                      <TableEstadist data={acumula} onOpenModalAddMesResChange={onOpenModalAddMesResChange} key={index}/>
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

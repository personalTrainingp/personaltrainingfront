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
      inversion: 4.47,
      numero_mensajes: 2
    },
    {
      fecha: 'octubre 2024',
      inversion: 113.86,
      numero_mensajes: 348
    },
    {
      fecha: 'noviembre 2024',
      inversion: 66.13,
      numero_mensajes: 282
    },
    {
      fecha: 'diciembre 2024',
      inversion: 223.46,
      numero_mensajes: 787
    },
    {
      fecha: 'enero 2025',
      inversion: 245.06,
      numero_mensajes: 1155
    },
    {
      fecha: 'febrero 2025',
      inversion: 805,
      numero_mensajes: 996
    }
  ]
  
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

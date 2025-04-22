import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { ModalAddMesResChange } from './ModalAddMesResChange'
import { useSelector } from 'react-redux'
import { TableEstadist } from './TableEstadist'
import { PageBreadcrumb } from '@/components'
import { useResultadosChange } from './useResultadosChange'
import { ModalVistaSocios } from './ModalVistaSocios'
import { GrafLineal } from './GrafLineal'

export const PrincipalView = () => {
  const [isOpenModalAddMesResChange, setisOpenModalAddMesResChange] = useState(false)
  const { obtenerTodoVentas, data } = useResultadosChange()
  const [isOpenModalViewVentas, setisOpenModalViewVentas] = useState(false)
  const [rowViewModal, setRowViewModal] = useState({})
  const {dataRes} = useSelector(e=>e.DATA)
  const onOpenModalAddMesResChange = () => {
    setisOpenModalAddMesResChange(true)
  }
  const onCloseModalAddMesResChange = () => {
    setisOpenModalAddMesResChange(false)
  }
  const onOpenModalDataViewVentas = (row)=>{
    setisOpenModalViewVentas(true)
    setRowViewModal(row)
  }
  const onCloseModalDataViewVentas = ()=>{
    setisOpenModalViewVentas(false)
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
      // ticket_medio: 0,
    },
    {
      fecha: 'octubre 2024',
      inversion: 427,
      facturacion: 6261,
      numero_cierre: 3,
      numero_mensajes: 348,
      // ticket_medio: 2087,
    },
    {
      fecha: 'noviembre 2024',
      inversion: 248,
      facturacion: 5325,
      numero_cierre: 10,
      numero_mensajes: 282,
      // ticket_medio: 591.67,
    },
    {
      fecha: 'diciembre 2024',
      inversion: 838,
      facturacion: 25192,
      numero_cierre: 38,
      numero_mensajes: 787,
      // ticket_medio: 662.95,
    },
    {
      fecha: 'enero 2025',
      inversion: 919,
      facturacion: 19523,
      numero_cierre: 19,
      numero_mensajes: 1155,
      // ticket_medio: 1096.95,
    },
    {
      fecha: 'febrero 2025',
      inversion: 1006.89,
      facturacion: 29824,
      numero_cierre: 27,
      numero_mensajes: 1080,
      // ticket_medio: 969.65,
    },
    {
      fecha: 'marzo 2025',
      inversion: 1133.6,
      facturacion: 13383,
      numero_cierre: 17,
      numero_mensajes: 1354,
    },
    {
      fecha: 'abril 2025',
      inversion: 789.85,
      facturacion: 17129,
      numero_cierre: 13,
      numero_mensajes: 725,
    }
  ]

  const dataInv = data.map((f, index)=>{
    // const dae = dataPrueba.filter(g=>g.fecha===f.fecha)
    const daeFind = dataPrueba.find(g=>g.fecha===f.fecha)
    const inversion = daeFind?.inversion*3.75
    const acumula = {...f, ...daeFind}
    return { 
      ...acumula,
      inversion: inversion,
      facturacion: daeFind?.facturacion,
      numero_cierre: daeFind?.numero_cierre,
      cac: (inversion/daeFind?.numero_cierre||0).toFixed(2),
      ticket_medio: (daeFind?.facturacion/daeFind?.numero_cierre)||0,
      conversor: ((daeFind?.numero_cierre/daeFind?.numero_mensajes)*100).toFixed(2),
      roas: (daeFind?.facturacion/inversion).toFixed(0)
    }
  })

  console.log({dataInv});
  
  
  return (
    <>
    <PageBreadcrumb title={'RESULTADOS por INVERSION DIGITAL'}/>
      <Row>
        <Col lg={12}>
          {/* <GrafLineal data={dataInv}/> */}
        </Col>
        <Col lg={12}>
        <Card>
          <Card.Body>
            <Row>
              {
                dataInv.map((f, index)=>{
                  const acumula = {...f}
                  return (
                    <Col lg={4}>
                      <TableEstadist onDataViewVentas={()=>onOpenModalDataViewVentas(f)} data={acumula} onOpenModalAddMesResChange={onOpenModalAddMesResChange} key={index}/>
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
      {
        rowViewModal &&
      <ModalVistaSocios data={rowViewModal} show={isOpenModalViewVentas} onHide={onCloseModalDataViewVentas}/>
      }
    </>
  )
}

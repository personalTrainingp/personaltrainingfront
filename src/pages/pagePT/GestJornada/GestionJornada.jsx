import { PageBreadcrumb } from '@/components'
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import { useInventarioStore } from '@/hooks/hookApi/useInventarioStore'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import sinImage from '@/assets/images/SinImage.jpg'
import { Image } from 'primereact/image'
import { TabPanel, TabView } from 'primereact/tabview'
import { Button } from 'primereact/button'
import { ModalJornada } from './ModalJornada'

export const GestionJornada = () => {
    const [isOpenModalJornada, setisOpenModalJornada] = useState(false)
    const onOpenModalJornada = ()=>{
        setisOpenModalJornada(true)
    }
    const onCloseModalJornada = ()=>{
        setisOpenModalJornada(false)
    }
  return (
    <>
    <PageBreadcrumb title={'JORNADAS'} subName={'T'}/>
        <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col sm={5}>
                                    <Button label='Agregar jornada' onClick={onOpenModalJornada}/>
                                </Col>
                                <Col sm={7}>
                                </Col>
                            </Row>
                            

                        </Card.Body>
                    </Card>
				</Col>
                <ModalJornada show={isOpenModalJornada} onHide={onCloseModalJornada}/>
        </Row>
    </>
  )
}

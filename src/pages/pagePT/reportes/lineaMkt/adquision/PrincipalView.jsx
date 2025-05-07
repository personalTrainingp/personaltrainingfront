import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { ModalFilterRangeFechas } from './ModalFilterRangeFechas'
import { useAdquisicionStore } from './useAdquisicionStore'

export const PrincipalView = () => {
    const [isOpenModalRangeFechas, setisOpenModalRangeFechas] = useState(false)
    const { obtenerTodoVentas } = useAdquisicionStore()
    useEffect(() => {
        obtenerTodoVentas()
    }, [])
    
    const onOpenModalRangeFechas = ()=>{
        setisOpenModalRangeFechas(true)
    }
    const onCloseModalRangeFechas = ()=>{
        setisOpenModalRangeFechas(false)
    }
  return (
    <>
        <Row>
            <Col lg={4}>
                <Card>
                    <Card.Header>
                        <div className='float-end'>
                            <Button text icon={'pi pi-times'}/>
                        </div>
                    </Card.Header>
                </Card>
            </Col>
            <Col lg={4}>
                <Card className='h-100 p-2'>
                    <div className='p-2 h-100 cursor-pointer' onClick={onOpenModalRangeFechas} style={{border: '4px dashed gray', boxSizing: 'border-box'}}>
                        <div className='m-auto text-center align-content-center h-100 fs-2'>
                            AGREGAR PERIODO
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
        <ModalFilterRangeFechas show={isOpenModalRangeFechas} onHide={onCloseModalRangeFechas}/>
    </>
  )
}

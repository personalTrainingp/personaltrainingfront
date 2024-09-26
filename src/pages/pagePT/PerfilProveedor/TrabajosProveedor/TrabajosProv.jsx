import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { ModalTrabajoProv } from './ModalTrabajoProv'
import { ItemTrabajoProv } from './ItemTrabajoProv'

export const TrabajosProv = () => {
    const [isModalTrabajoProv, setisModalTrabajoProv] = useState(false)
    const onOpenModalTrabajoProv = ()=>{
        setisModalTrabajoProv(true)
    }
    const onCloseModalTrabajoProv = ()=>{
        setisModalTrabajoProv(false)
    }
  return (
    <>
        <Row>
            <Col xxl={12}>
                <Button label='agregar Trabajo' onClick={onOpenModalTrabajoProv}/>
            </Col>
            <Col xxl={12} className='mt-4'>
                <ul className="list-unstyled">
                    <ItemTrabajoProv/>
                    <ItemTrabajoProv/>
                    <ItemTrabajoProv/>
                    <ItemTrabajoProv/>
                    <ItemTrabajoProv/>
                    <ItemTrabajoProv/>
                </ul>
            </Col>
        </Row>
        <ModalTrabajoProv onHide={onCloseModalTrabajoProv} show={isModalTrabajoProv}/>
    </>
  )
}

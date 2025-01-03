import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Col, Row } from 'react-bootstrap'

export const ModalFechasParaComparar = ({show, onHide}) => {
    const footerTemplate = (
        <>
        <Button label='COMPARAR FECHAS'/>
        <Button label='CANCELAR' text/>
        </>
    )
  return (
    <Dialog footer={footerTemplate} position='top' style={{width: '50rem'}} header={'FECHAS PARA COMPARAR'} visible={show} onHide={onHide}>
        <h4>FECHA 1</h4>
        <Row>
            <Col xxl={6}>
                <div>
                    <label>DESDE</label>
                    <input
                        type='date'
                        className='form-control'
                    />
                </div>
            </Col>
            <Col xxl={6}>
            <div>
                    <label>DESDE</label>
                    <input
                        type='date'
                        className='form-control'
                    />
                </div>
            </Col>
        </Row>
        <Button className='text-center w-100' label='AGREGAR MAS FECHAS' text/>
    </Dialog>   
  )
}

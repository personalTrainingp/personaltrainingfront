import { InputText } from 'primereact/inputtext'
import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'

export const ModalCustomGasto = ({show, onHide, id, isCopy}) => {
    const onSubmit = ()=>{

    }
    const cancelarGasto = ()=>{
        onHide()
    }
  return (
    <>
    <Modal show={show} onHide={cancelarGasto} size='lg'>
        <Modal.Header>
            <Modal.Title>
                AGREGAR GASTO { id }
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form>
                <Row>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputText/>
                        </div>
                    </Col>
                </Row>
            </form>
        </Modal.Body>
    </Modal>
    </>
  )
}

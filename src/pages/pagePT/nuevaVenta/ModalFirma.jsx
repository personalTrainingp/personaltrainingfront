import { onSetFirmaPgm } from '@/store/uiNuevaVenta/uiNuevaVenta'
import React, { useRef } from 'react'
import {Modal, Button, Col, Row} from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import SignaturePad from 'react-signature-canvas'

export const ModalFirma = ({detalleVentaPrograma, show, onHide, dataFirma}) => {
    const refCanvas = useRef({})
    const dispatch = useDispatch()
    const CloseModalFirma = ()=>{
        onHide()
    }
    const limpiarFirma = ()=>{
        refCanvas.current.clear()
    }
    const GuardarFirma = ()=>{
        // console.log(refCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
        const canvas = refCanvas.current.getCanvas();
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF'; // Establecer el color del trazo en blanco
        const base64firma = refCanvas.current.getTrimmedCanvas().toDataURL("image/png")
        dispatch(onSetFirmaPgm(base64firma))
        onHide()
    }
  return (
    <>
    <Modal show={show} backdrop={'static'} size='lg'>
        <Modal.Header>
            <Modal.Title>Firma</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
                <Col lg={8}>
                    <SignaturePad penColor='black' maxWidth={3} minWidth={3} canvasProps={{className: 'signatureCanvas'}} ref={refCanvas} />
                </Col>
                <Col lg={4}>
                    <Button onClick={CloseModalFirma}>Cerrar</Button>
                    <Button onClick={GuardarFirma}>Guardar</Button>
                </Col>
            </Row>
        </Modal.Body>
    </Modal>
    </>
  )
}

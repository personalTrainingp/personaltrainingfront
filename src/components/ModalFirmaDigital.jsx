import { helperFunctions } from '@/common/helpers/helperFunctions'
import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
import { onSetBase64Firma } from '@/store/data/dataSlice'
import { onSetFirmaPgm } from '@/store/uiNuevaVenta/uiNuevaVenta'
import { Button } from 'primereact/button'
import React, { useRef } from 'react'
import {Modal, Col, Row} from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import SignaturePad from 'react-signature-canvas'

export const ModalFirmaDigital = ({idVenta, idCli, show, onHide}) => {
    const { base64ToFile } = helperFunctions()
    const { agregarFirmaEnContratoCliente } = useVentasStore()
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
        const file = base64ToFile(
            base64firma,
            `firma_cli${idCli}.png`
        );
        
        console.log(file);
        agregarFirmaEnContratoCliente(file, idVenta, idCli)
        dispatch(onSetBase64Firma(file))
        // dispatch(onSetFirmaPgm(base64firma))
        onHide()
    }
    
  return (
    <>
    <Modal show={show} backdrop={'static'} size='lg'>
        <Modal.Header>
            <Modal.Title>Firma DIGITAL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
                <Col lg={12}>
                    <SignaturePad penColor='black' maxWidth={3} minWidth={3} canvasProps={{className: 'signatureCanvas'}} ref={refCanvas} />
                </Col>
                <Col lg={12}>
                    <div className='d-flex justify-content-center'>
                        <Button className='m-2' onClick={CloseModalFirma} outlined severity='danger'>Cerrar</Button>
                        <Button className='m-2' onClick={GuardarFirma}>Guardar</Button>
                    </div>
                </Col>
            </Row>
        </Modal.Body>
    </Modal>
    </>
  )
}

import { Dialog } from 'primereact/dialog'
import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { ModalCargarFirma } from './ModalCargarFirma'
import { ModalFirmaDigital } from './ModalFirmaDigital'

export const ModalIsFirma = ({show, onHide, idVenta, idCli}) => {
  const [isOpenModalFirmaDigital, setisOpenModalFirmaDigital] = useState(false)
  const [ isOpenModalCargarFirma, setisOpenModalCargarFirma ] = useState(false)
  const onOpenModalFirmaDigital = () => {
    setisOpenModalFirmaDigital(true)
    onHide()
  }
  const onCloseModalFirmaDigital = () => {
    setisOpenModalFirmaDigital(false)
  }
  const onOpenModalCargarFirma = () => {
    setisOpenModalCargarFirma(true)
    onHide()
  }
  const onCloseModalCargarFirma = () => {
    setisOpenModalCargarFirma(false)
  }
  
  
  return (
    <>
        <Dialog visible={show} onHide={onHide}>
            <Row>
              <Col xxl={6}>
                <Card className='p-2 hover cursor-pointer' onClick={onOpenModalFirmaDigital} style={{width: '400px', height: '100px', fontSize: '20px', justifyContent: 'center', fontWeight: 'bolder', textAlign: 'center'}}>
                  Firma digital
                </Card>
              </Col>
              <Col xxl={6}>
              <Card className='p-2 hover cursor-pointer' onClick={onOpenModalCargarFirma} style={{width: '400px', height: '100px', fontSize: '20px', justifyContent: 'center', fontWeight: 'bolder', textAlign: 'center'}}>
                Cargar firma
              </Card>
              </Col>
            </Row>
        </Dialog>
        <ModalFirmaDigital idCli={idCli} idVenta={idVenta} onHide={onCloseModalFirmaDigital} show={isOpenModalFirmaDigital}/>
        <ModalCargarFirma idCli={idCli} idVenta={idVenta} onHide={onCloseModalCargarFirma} show={isOpenModalCargarFirma}/>
    </>

  )
}

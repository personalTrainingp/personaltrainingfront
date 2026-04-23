import { Dialog } from 'primereact/dialog'
import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { ModalCargarFirma } from './ModalCargarFirma'
import { ModalFirmaDigital } from './ModalFirmaDigital'

export const ModalIsFirma = ({show, onHide, idVenta=3, idCli}) => {
  const [isOpenModalFirmaDigital, setisOpenModalFirmaDigital] = useState({isOpen: false, idcli: 0, idventa: 0})
  const [ isOpenModalCargarFirma, setisOpenModalCargarFirma ] = useState({isOpen: false, idcli: 0, idventa: 0})
  const onOpenModalFirmaDigital = (idcli=0, idventa=0) => {
    setisOpenModalFirmaDigital({isOpen: true, idcli, idventa})
    onHide()
  }
  const onCloseModalFirmaDigital = () => {
    setisOpenModalFirmaDigital({isOpen: false, idcli: 0, idventa: 0})
  }
  const onOpenModalCargarFirma = (idcli, idventa) => {
    setisOpenModalCargarFirma({isOpen: true, idcli, idventa})
    onHide()
  }
  const onCloseModalCargarFirma = () => {
    setisOpenModalCargarFirma({isOpen: false, idcli: 0, idventa: 0})
  }
  
  
  return (
    <>
        <Dialog visible={show} onHide={onHide}>
          {idVenta}a
          <br/>
          {idCli}d
            <Row>
              <Col xxl={6}>
                <Card className='p-2 hover cursor-pointer' onClick={()=>onOpenModalFirmaDigital(idCli, idVenta)} style={{width: '400px', height: '100px', fontSize: '20px', justifyContent: 'center', fontWeight: 'bolder', textAlign: 'center'}}>
                  Firma digital
                </Card>
              </Col>
              <Col xxl={6}>
              <Card className='p-2 hover cursor-pointer' onClick={()=>onOpenModalCargarFirma(idCli, idVenta)} style={{width: '400px', height: '100px', fontSize: '20px', justifyContent: 'center', fontWeight: 'bolder', textAlign: 'center'}}>
                Cargar firma
              </Card>
              </Col>
            </Row>
        </Dialog>
          <ModalFirmaDigital idCli={isOpenModalFirmaDigital.idcli} idVenta={isOpenModalFirmaDigital.idventa} onHide={onCloseModalFirmaDigital} show={isOpenModalFirmaDigital.isOpen}/>
          <ModalCargarFirma idCli={isOpenModalCargarFirma.idcli} idVenta={isOpenModalCargarFirma.idventa} onHide={onCloseModalCargarFirma} show={isOpenModalCargarFirma.isOpen}/>
    </>

  )
}

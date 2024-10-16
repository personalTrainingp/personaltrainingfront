import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { ModalTrabajoProv } from './ModalTrabajoProv'
import { ItemTrabajoProv } from './ItemTrabajoProv'
import { ModalReportePagos } from '../ReportePagos/ModalReportePagos'
import { useSelector } from 'react-redux'
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore'
import { ScrollPanel } from 'primereact/scrollpanel'
import { ModalIsFirma } from '@/components/ModalIsFirma'

export const TrabajosProv = ({id_prov, nombre_prov}) => {
    const [isModalTrabajoProv, setisModalTrabajoProv] = useState(false)
    const [isOpenModalReportePagos, setisOpenModalReportePagos] = useState(false)
    const [objContrato, setobjContrato] = useState({})
    const [isOpenModalFirma, setisOpenModalFirma] = useState(false)
    const [codigo_pago, setcodigo_pago] = useState('')
    const [tipo_cambio, settipo_cambio] = useState('')
    const [monto, setmonto] = useState(0)
    const { dataContratoProv } = useSelector(e=>e.prov)
    const { ObtenerContratosProvxID } = useProveedorStore()
    useEffect(() => {
        ObtenerContratosProvxID(id_prov)
    }, [])
    
    const onOpenModalTrabajoProv = ()=>{
        setisModalTrabajoProv(true)
    }
    const onCloseModalTrabajoProv = ()=>{
        setisModalTrabajoProv(false)
    }
    const onOpenModalVerPagos = (codigo, tipo_moneda, monto, obj)=>{
        console.log(obj);
        setobjContrato(obj)
        setisOpenModalReportePagos(true)
        setcodigo_pago(codigo)
        settipo_cambio(tipo_moneda)
        setmonto(monto)
    }
    const onCloseModalVerPagos = ()=>{
        setisOpenModalReportePagos(false)
        setcodigo_pago(0)
    }
    
    const onOpenModalFirma = ()=>{
        setisOpenModalFirma(true)
    }
    const onCloseModalFirma = ()=>{
        setisOpenModalFirma(false)
    }


  return (
    <>
        <Row>
            <Col xxl={12}>
                <Button label='agregar Trabajo' onClick={onOpenModalTrabajoProv}/>
            </Col>
            <Col xxl={12} className='mt-4'>
            
            <ScrollPanel style={{ width: '100%', height: '34rem' }} className="custombar2">
                <ul className="list-unstyled">
                    {
                        dataContratoProv.map(c=>(
                            <>
                            <ItemTrabajoProv 
                            key={c.id}
                            tipo_moneda={c.tipo_moneda}
                            codigo={c.cod_trabajo} 
                            observacion={c.observacion}
                            fec_inicia={c.fecha_inicio} 
                            fec_termina={c.fecha_fin} 
                            hora_fin={c.hora_fin} 
                            monto={c.monto_contrato}  
                            onOpenModalFirma={()=>onOpenModalFirma()}
                            onOpenModalVerPagos={()=>onOpenModalVerPagos(c.cod_trabajo, c.tipo_moneda, c.monto_contrato, c)}/>
                            </>
                        ))
                    }
                </ul>
            </ScrollPanel>
            </Col>
        </Row>
        <ModalTrabajoProv id_prov={id_prov} onHide={onCloseModalTrabajoProv} show={isModalTrabajoProv}/>
        <ModalIsFirma onHide={onCloseModalFirma} show={isOpenModalFirma}/>
        <ModalReportePagos 
        nombre_prov={nombre_prov} 
        objContrato={objContrato}
        monto={monto} tipo_moneda={tipo_cambio} codigo_pago={codigo_pago} onHide={onCloseModalVerPagos} show={isOpenModalReportePagos}/>
    </>
  )
}

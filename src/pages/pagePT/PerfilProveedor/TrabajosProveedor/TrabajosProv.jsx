import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { ModalTrabajoProv } from './ModalTrabajoProv'
import { ItemTrabajoProv } from './ItemTrabajoProv'
import { ModalReportePagos } from '../ReportePagos/ModalReportePagos'
import { useSelector } from 'react-redux'
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore'
import { ScrollPanel } from 'primereact/scrollpanel'

export const TrabajosProv = ({id_prov}) => {
    const [isModalTrabajoProv, setisModalTrabajoProv] = useState(false)
    const [isOpenModalReportePagos, setisOpenModalReportePagos] = useState(false)
    const [codigo_pago, setcodigo_pago] = useState('')
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
    const onOpenModalVerPagos = (codigo)=>{
        setisOpenModalReportePagos(true)
        setcodigo_pago(codigo)
    }
    const onCloseModalVerPagos = ()=>{
        setisOpenModalReportePagos(false)
    }
    console.log(dataContratoProv);
    
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
                            codigo={c.cod_trabajo} 
                            observacion={c.observacion}
                            fec_inicia={c.fecha_inicio} 
                            fec_termina={c.fecha_fin} 
                            hora_fin={c.hora_fin} 
                            monto={c.monto_contrato}  
                            onOpenModalVerPagos={()=>onOpenModalVerPagos(c.cod_trabajo)}/>
                            </>
                        ))
                    }
                </ul>
            </ScrollPanel>
            </Col>
        </Row>
        <ModalTrabajoProv id_prov={id_prov} onHide={onCloseModalTrabajoProv} show={isModalTrabajoProv}/>
        <ModalReportePagos codigo_pago={codigo_pago} onHide={onCloseModalVerPagos} show={isOpenModalReportePagos}/>
    </>
  )
}

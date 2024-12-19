import React, { useEffect } from 'react'
import { useMembresiaxCliente } from './useMembresiaxCliente'
import { Card, Col, Row } from 'react-bootstrap'
import { PageBreadcrumb } from '@/components'
import { arrayFacturas } from '@/types/type'

export const ViewMembresiaxCliente = () => {
    const { obtenerClientesMembretados, data } = useMembresiaxCliente()
    useEffect(() => {
        obtenerClientesMembretados()
    }, [])
  return (
    <>
    <PageBreadcrumb title={'MEMBRESIAS'}/>
    <Row>
        {
            data.map(d=>(
                <Col lg={4}>
                    <Card>
                        <Card.Header className='bg-black text-white'>
                            <h2 className='text-truncate'>{d.nombres_apellidos_cli}</h2>
                        </Card.Header>
                        <Card.Body className='px-0'>
                            {
                                d.membresias.map(m=>{
                                    const labelComprobante = arrayFacturas.find(f=>f.value ===m.id_tipoFactura).label
                                    return (
                                        <div className='border-bottom-1 p-2 mb-2 fs-3'>
                                        {labelComprobante} {m.numero_transac}
                                        <br/>
                                        <span>{m.detalle_membresia.tb_ProgramaTraining?.name_pgm}</span>
                                        <br/>
                                        <span>{m.detalle_membresia.tb_semana_training?.sesiones} SESIONES</span>
                                        </div>
                                    )
                                })
                            }
                            <div className='text-center'>
                            <a className='text-center cursor-pointer'>VER MAS(7)</a>
                            </div>
                            {/* Aquí se mostrarán los clientes membretados */}
                        </Card.Body>
                    </Card>
                </Col>
            ))
        }
    </Row>
    </>
  )
}

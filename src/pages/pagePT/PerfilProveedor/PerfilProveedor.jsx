import { PageBreadcrumb } from '@/components'
import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { Card, Col, ProgressBar, Row, Table } from 'react-bootstrap'
import { Badge } from 'primereact/badge'
import { Link, useParams } from 'react-router-dom'
import { TabPanel, TabView } from 'primereact/tabview'
import { TrabajosProv } from './TrabajosProveedor/TrabajosProv'
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import { SectionComentarios } from './SectionComentarios'
import { SectionInfoProv } from './SectionInfoProv'
import { ScrollPanel } from 'primereact/scrollpanel'
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore'
import { Loading } from '@/components/Loading'
export const PerfilProv = () => {
    const {uid} = useParams()
    
    const { obtenerProveedorxUID, isLoading, proveedor } = useProveedorStore()
  useEffect(() => {
    obtenerProveedorxUID(uid)
  }, [])
  if(!isLoading){
    return (
      <Loading show={isLoading}/>
    )
  }
  console.log(proveedor);
  
  return (
    <>
        <Link  to={'/gestion-proveedores'} className='mt-3'><i className='mdi mdi-chevron-left'></i>Regresar</Link>
        <br/>
        <Row>
            <Col xxl={3}>
                <Card style={{height: '85vh', width: '100%'}}>
                    <Card.Body>
                    <div className='' style={{height: '600px', width: '100%'}}>
                        <div className='d-flex align-items-center flex-column'>
                        <img src={`${sinAvatar}`} className='rounded-circle' width={150} height={150}/>
                        <div className='m-2 text-center'>
                            <span className='fs-3 fw-bold'>
                                <p className='mb-0 pb-0'>
                                <span>
                                    {proveedor.razon_social_prov}
                                </span>
                                <br/>
                                <span className='font-15'>
                                {proveedor.parametro_oficio?.label_param} 
                                </span>
                                </p>
                                </span>
                            <span className='text-center'>{proveedor.estado_prov?
                                <Badge value="Activo" size="xlarge" severity="success"></Badge>
                                : 
                                <Badge value="INACTIVO" size="xlarge" severity="danger"></Badge>
                                }</span>
                        </div>
                        </div>
                        
				<Table responsive className="table table-sm table-centered mb-2 font-14">
					<tbody>
						<tr className='my-2'>
							<td>Pendientes</td>
							<td>4</td>
						</tr>
						<tr className='my-2'>
							<td>Completados</td>
							<td>2</td>
						</tr>
                        <tr className='my-2'>
							<td>Cancelados</td>
							<td>2</td>
						</tr>
                        <tr className='my-2'>
							<td>RETENIDOS</td>
							<td>2</td>
						</tr>
					</tbody>
				</Table>
                    </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col xxl={9}>
                <Card  style={{height: '85vh', width: '100%'}}>
                    <Card.Header>
                    </Card.Header>
                    <Card.Body>
                        <TabView>
                            <TabPanel header={'Informacion del proveedor'}>
                                <ScrollPanel style={{ width: '100%', height: '65vh' }} className="custombar2">
                                    <SectionInfoProv dataProv={proveedor}/>
                                </ScrollPanel>
                            </TabPanel>
                            <TabPanel header={'Comentarios'}>
                                <ScrollPanel style={{ width: '100%', height: '65vh' }} className="custombar3">
                                    <SectionComentarios data={proveedor}/>
                                </ScrollPanel>
                            </TabPanel>
                            <TabPanel header={'Contrato del proveedor'}>
                                <ScrollPanel  style={{ width: '100%', height: '65vh' }} className="custombar4">
                                    <TrabajosProv nombre_prov={proveedor.razon_social_prov} id_prov={proveedor.id} uid={uid}/>
                                </ScrollPanel>
                            </TabPanel>
                            <TabPanel header={'Documentos adjuntos'}>
                                
                            </TabPanel>
                        </TabView>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
  )
}

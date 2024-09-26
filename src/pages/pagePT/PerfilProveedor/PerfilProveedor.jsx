import { PageBreadcrumb } from '@/components'
import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { Card, Col, ProgressBar, Row, Table } from 'react-bootstrap'
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
    console.log(uid);
    
    const { obtenerProveedorxUID, isLoading, proveedor } = useProveedorStore()
  useEffect(() => {
    obtenerProveedorxUID(uid)
  }, [])
  if(!isLoading){
    return (
      <Loading show={isLoading}/>
    )
  }
  return (
    <>
        <Link  to={'/gestion-proveedores'} className='mt-3'><i className='mdi mdi-chevron-left'></i>Regresar</Link>
        <Row>
            <Col xxl={3}>
                <Card>
                    <Card.Body>
                    <div className='' style={{height: '600px', width: '100%'}}>
                        <div className='d-flex align-items-center flex-column'>
                        <img src={`${sinAvatar}`} className='rounded-circle' width={150} height={150}/>
                        <div className='m-2 text-center'>
                            <span className='fs-2 fw-bold'><p className='mb-0 pb-0'>ELECTRICISTA - ISAI SALOMON CUEVA HUARINGA</p></span>
                            <span className='text-center'>ACTIVO</span>
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
					</tbody>
				</Table>
                    </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col xxl={9}>
                <Card>
                    <Card.Header>
                        <TabView>
                            <TabPanel header={'Informacion del proveedor'}>
                                <ScrollPanel style={{ width: '100%', height: '34rem' }} className="custombar2">
                                    <SectionInfoProv dataProv={proveedor}/>
                                </ScrollPanel>
                            </TabPanel>
                            <TabPanel header={'Comentarios'}>
                                <ScrollPanel style={{ width: '100%', height: '34rem' }} className="custombar2">
                                    <SectionComentarios data={proveedor}/>
                                </ScrollPanel>
                            </TabPanel>
                            <TabPanel header={'Contrato del proveedor'}>
                                <ScrollPanel style={{ width: '100%', height: '34rem' }} className="custombar2">
                                    <TrabajosProv uid={uid}/>
                                </ScrollPanel>
                            </TabPanel>
                            <TabPanel header={'Presupuesto del proveedor'}>
                                <TrabajosProv uid={uid}/>
                            </TabPanel>
                            <TabPanel header={'Documentos adjuntos'}>
                                
                            </TabPanel>
                        </TabView>
                    </Card.Header>
                    <Card.Body>
                        
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
  )
}

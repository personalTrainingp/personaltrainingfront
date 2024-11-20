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
import config from '@/config'
import { useSelector } from 'react-redux'
import { Image } from 'primereact/image'
import { SectionFacturacionProv } from './SectionFacturacionProv'
import { SectionContactoEmergencia } from './SectionContactoEmergencia'
export const PerfilProv = () => {
    const {uid} = useParams()
    
    const { obtenerProveedorxUID, isLoading } = useProveedorStore()
    const { proveedor } = useSelector(e=>e.prov)
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
        <div className='my-2 py-2 btn btn-primary'>
            <Link  to={'/gestion-proveedores'} className='fs-5 text-white'><i className='mdi mdi-chevron-left'></i>Regresar</Link>
        </div>
        <Row>
            <Col xxl={3}>
                <Card style={{height: '85vh', width: '100%'}}>
                    <Card.Body>
                    <div className='' style={{height: '600px', width: '100%'}}>
                        <div className='d-flex align-items-center flex-column'>
                        {/* <img src={`${proveedor.tb_images?.length!==0?`${config.API_IMG.AVATARES_PROV}${proveedor.tb_images[proveedor.tb_images.length-1]?.name_image}`:sinAvatar}`} className='rounded-circle' width={150} height={150}/> */}
                        <Image src={`${proveedor.tb_image?.length!==0?`${config.API_IMG.AVATARES_PROV}${proveedor.tb_image?.name_image}`:sinAvatar}`} className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="250" />
                            <div className='m-2 text-center'>
                                <span className='fs-3 fw-bold'>
                                    <p className='mb-0 pb-0'>
                                    <span className='fs-2 text-primary'>
                                        {proveedor.parametro_oficio?.label_param} 
                                    </span>
                                    <br/>
                                    <span className='fs-1'>
                                        {proveedor.nombre_contacto}
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
                            <TabPanel header={'CONTACTO'}>
                                <ScrollPanel style={{ width: '100%', height: '55vh' }} className="custombar2">
                                    <SectionInfoProv dataProv={proveedor}/>
                                </ScrollPanel>
                            </TabPanel>
                            <TabPanel header={'FACTURACION'}>
                                <ScrollPanel style={{ width: '100%', height: '55vh' }} className="custombar2">
                                    <SectionFacturacionProv dataProv={proveedor}/>
                                </ScrollPanel>
                            </TabPanel>
                            {/* <TabPanel header={'CONTACTO DE EMERGENCIA'}>
                                <ScrollPanel style={{ width: '100%', height: '65vh' }} className="custombar2">
                                    <SectionContactoEmergencia dataProv={proveedor}/>
                                </ScrollPanel>
                            </TabPanel> */}
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

import React, { useEffect } from 'react'
import { Card, Col, Row, Tab, Tabs } from 'react-bootstrap';
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import "react-form-wizard-component/dist/style.css";
import { Link, redirect, useParams } from 'react-router-dom';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';
import { useSelector } from 'react-redux';
import Error404AltPage from '@/pages/otherpages/Error404Alt';
import config from '@/config';
import { InformacionGeneralEmpleado } from './InformacionGeneralEmpleado';
import { Badge } from 'primereact/badge';
import { Image } from 'primereact/image';
import { TabPanel, TabView } from 'primereact/tabview';
import { ScrollPanel } from 'primereact/scrollpanel';
import { ReporteAsistencia } from './ReporteAsistencia';
import { PanelPermisos } from './PanelPermisos';
import { PanelHorasExtras } from './PanelHorasExtras';
import { PanelTardanzasJustificadas } from './PanelTardanzasJustificadas';
import { PanelSalidasTempranas } from './PanelSalidasTempranas';

export const PerfilEmpleado = () => {
  const { uid } = useParams()
	const { obtenerUsuarioEmpleado } = useUsuarioStore()
	const {userEmpleado, status}  = useSelector(e=>e.authEmpl)
  useEffect(() => {
    obtenerUsuarioEmpleado(uid)
  }, [])
  if(userEmpleado.id_empl==null){
    return (
      <>
      Cargando
      </>
    )
  }
  console.log(userEmpleado);
  
  if(userEmpleado==null){
    return <Error404AltPage/>;
  }
  const avatarImage=userEmpleado?.tb_images?.length===0?sinAvatar:`${config.API_IMG.AVATAR_EMPL}${userEmpleado.tb_images[userEmpleado.tb_images?.length-1]?.name_image}`
  return (
    <>
    
    <div className='my-2 py-2 btn btn-primary'>
        <Link  to={'/gestion-empleados'} className='fs-5 text-white'><i className='mdi mdi-chevron-left'></i>Regresar</Link>
    </div>
    <Row>
      <Col xxl={3}>
      <Card style={{height: '85vh', width: '100%'}}>
                    <Card.Body>
                    <div className='' style={{height: '600px', width: '100%'}}>
                        <div className='d-flex align-items-center flex-column'>
                        {/* <img src={`${proveedor.tb_images?.length!==0?`${config.API_IMG.AVATARES_PROV}${proveedor.tb_images[proveedor.tb_images.length-1]?.name_image}`:sinAvatar}`} className='rounded-circle' width={150} height={150}/> */}
                        <Image src={avatarImage} className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="250" />
                            <div className='m-2 text-center'>
                                <span className='fs-3 fw-bold'>
                                    <p className='mb-0 pb-0'>
          <span className='fs-1 fw-bold'><p className='mb-0 pb-0'>{userEmpleado.nombre_empl} {userEmpleado.apPaterno_empl} {userEmpleado.apMaterno_empl}</p></span>
                                    </p>
                                    </span>
                                {/* <span className='text-center'>{proveedor.estado_prov? */}
                                    <Badge value="Activo" size="xlarge" severity="success"></Badge>
                                    {/* :  */}
                                    {/* <Badge value="INACTIVO" size="xlarge" severity="danger"></Badge> */}
                                    {/* }</span> */}
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
                        <TabView scrollable>
                            <TabPanel header={'INFORMACION BASICA'}>
                                <ScrollPanel style={{ width: '100%', height: '55vh' }} className="custombar2">
                                  <InformacionGeneralEmpleado data={userEmpleado}/>
                                </ScrollPanel>
                            </TabPanel>
                            <TabPanel header={'Documentos adjuntos'}>
                                
                            </TabPanel>
                            <TabPanel header={'NOMINAS'}>
                                <ReporteAsistencia uid_empl={uid} avatarImage={avatarImage}/>
                            </TabPanel>
                            <TabPanel header={'PERMISOS'}>
                              <PanelPermisos/>
                            </TabPanel>
                            <TabPanel header={'TARDANZAS JUSTIFICADAS'}>
                            <PanelTardanzasJustificadas/>
                            </TabPanel>
                            <TabPanel header={'HORAS EXTRAS'}>
                            <PanelHorasExtras/>
                            </TabPanel>
                            <TabPanel header={'SALIDAS TEMPRANAS'}>
                            <PanelSalidasTempranas/>
                            </TabPanel>
                        </TabView>
                    </Card.Body>
                </Card>
            </Col>
    </Row>
    </>
  );
}

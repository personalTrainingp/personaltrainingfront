import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Tab, TabPane, Tabs } from 'react-bootstrap';
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import "react-form-wizard-component/dist/style.css";
import { Link, redirect, useParams } from 'react-router-dom';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';
import { useSelector } from 'react-redux';
import { InformacionGeneralCliente } from './InformacionGeneralCliente';
import Error404AltPage from '@/pages/otherpages/Error404Alt';
import config from '@/config';
import { ComprasxCliente } from './ComprasxCliente';
import { ModalExtensionRegalo } from './ModalExtensionRegalo';
import { ModalExtensionCongelamiento } from './ModalExtensionCongelamiento';
import { SectionComentarios } from './SectionComentarios';
import { TabPanel, TabView } from 'primereact/tabview';
import { ScrollPanel } from 'primereact/scrollpanel';
import { ReportesxCliente } from './ReportesxCliente';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import Swal from 'sweetalert2';
import { ScreenNutricionista } from './ScreenNutricionista';
import { SectionFiles } from './SectionFiles';
import { Image } from 'primereact/image';
import { PanelMembresias } from './PanelMembresias/PanelMembresias';
import { Button } from 'primereact/button';
// import './ScrollPanelDemo.css';
export const PerfilCliente = () => {
  const { uid } = useParams()
  const { obtenerOneUsuarioCliente, loading, loadingData } = useUsuarioStore()
  const { obtenerUltimaMembresiaPorCliente, dataUltimaMembresia, isLoading:loadingUltimaMembresia } = useTerminoStore()
  const [isOpenModalRegalos, setisOpenModalRegalos] = useState(false)
  const [isOpenModalCongelamiento, setisOpenModalCongelamiento] = useState(false)
  
  const [dataVentas, setdataVentas] = useState([])
  // const [isOpenModalRegalos, setisOpenModal] = useState(false)
  const { status, userCliente } = useSelector(e=>e.authClient)
  
  useEffect(() => {
    obtenerUltimaMembresiaPorCliente(uid)
    obtenerOneUsuarioCliente(uid)
  }, [])
  if(loadingData && loadingUltimaMembresia){
    return (
      <>
      Cargando...
      </>
    )
  }
  const modalOpenRegalos = ()=>{
    
    if(!dataUltimaMembresia[0]){
      return Swal.fire({
				icon: 'error',
				title: 'NO HAY NINGUNA MEMBRESIA',
				showConfirmButton: false,
				timer: 2500,
			});
    }
    setisOpenModalRegalos(true)
    setdataVentas(dataUltimaMembresia)

  }
  const modalCloseRegalos = ()=>{
    setisOpenModalRegalos(false)
  }
  const modalOpenCongelamiento = ()=>{
    if(!dataUltimaMembresia[0]){
      return Swal.fire({
				icon: 'error',
				title: 'NO HAY NINGUNA MEMBRESIA',
				showConfirmButton: false,
				timer: 2500,
			});
    }
    setisOpenModalCongelamiento(true)
    setdataVentas(dataUltimaMembresia)
  }
  const modalCloseCongelamiento = ()=>{
    setisOpenModalCongelamiento(false)
  }
  if(!userCliente){
    return <Error404AltPage/>;
  }
  
  const avatarUrl = userCliente?.tb_images&&userCliente?.tb_images[userCliente.tb_images?.length-1]?.name_image
  
  return (
    <>
    {/* <Link  to={'/gestion-clientes'} className='mt-3'><i className='mdi mdi-chevron-left'></i>Regresar</Link> */}
    {isOpenModalRegalos &&
      <ModalExtensionRegalo onHide={modalCloseRegalos} show={isOpenModalRegalos} id_cli={userCliente?.id_cli} dataUltimaMembresia={dataUltimaMembresia}/>
    }
    {
      isOpenModalCongelamiento && (
        <ModalExtensionCongelamiento onHide={modalCloseCongelamiento} show={isOpenModalCongelamiento} id_cli={userCliente.id_cli} dataUltimaMembresia={dataUltimaMembresia}/>
      )
    }
    <Row>
      
    <Col lg={3}>
            <Card className='mt-3 p-3'  style={{width: '100%', height: '85vh'}}>
              <div className='' style={{height: '100%', width: '100%'}}>
                <div className='d-flex align-items-center flex-column'>
                  <Image indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="170"  src={`${avatarUrl==null?sinAvatar:`${config.API_IMG.AVATAR_CLI}${avatarUrl}`}`} className='rounded-circle'/>
                  <div className='m-2 text-center'>
                    <span className='fs-2 fw-bold'><p className='mb-0 pb-0'>{userCliente.nombre_cli} {userCliente.apPaterno_cli} {userCliente.apMaterno_cli}</p></span>
                    <span className='text-center'>ACTIVO</span>
                  </div>
                  <Button className='m-1' style={{background: '#FF5757'}} label='CREAR REGALOS' onClick={modalOpenRegalos}/>
                  <Button className='m-1' style={{background: '#06B6D4'}} label='CREAR CONGELAMIENTO' onClick={modalOpenCongelamiento}/>
                  
                </div>
              </div>
            </Card>
          </Col>
          <Col lg={9}>
        <Card className='mt-3 p-3' style={{width: '100%', height: '85vh'}}>
              <TabView>
                <TabPanel header='Informacion basica'>
                  <ScrollPanel style={{ width: '100%', height: '55vh' }} className="custombar2">
                      <InformacionGeneralCliente data={userCliente}/>
                  </ScrollPanel>
                </TabPanel>
                <TabPanel header='MEMBRESIAS'>
                  <ScrollPanel style={{ width: '100%', height: '55vh' }} className="custombar2">
                      <PanelMembresias id_cli={userCliente.id_cli}/>
                  </ScrollPanel>
                </TabPanel>
                <TabPanel header='Documentos adjuntos'>
                <ScrollPanel style={{ width: '100%', height: '55vh' }} className="custombar2">
                  <SectionFiles uid_file={userCliente.uid_file_adj}/>
                </ScrollPanel>
                </TabPanel>
                <TabPanel header='Comentarios'>
                <ScrollPanel style={{ width: '100%', height: '55vh' }} className="custombar2">
                  <SectionComentarios data={userCliente}/>
                </ScrollPanel>
                </TabPanel>
                <TabPanel header='Compras'>
                <ScrollPanel style={{ width: '100%', height: '55vh' }} className="custombar2">
                  <ComprasxCliente uid={uid} dataVenta={userCliente.tb_venta}/>
                </ScrollPanel>
                </TabPanel>
                <TabPanel header='Reportes'>
                <ScrollPanel style={{ width: '100%', height: '55vh' }} className="custombar2">
                  <ReportesxCliente uid={uid} dataVenta={userCliente.tb_venta}/>
                </ScrollPanel>
                </TabPanel>
                <TabPanel header='NUTRICIONISTA'>
                <ScrollPanel style={{ width: '100%', height: '55vh' }} className="custombar2">
                  {/* <ReportesxCliente uid={uid} dataVenta={userCliente.tb_venta}/> */}
                  <ScreenNutricionista id_cli={userCliente?.id_cli} dataCli={userCliente}/>
                </ScrollPanel>
                </TabPanel>
              </TabView>
        </Card>
          </Col>
    </Row>
    </>
  );
}

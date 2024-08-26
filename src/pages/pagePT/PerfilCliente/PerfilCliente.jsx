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
import { ConfirmDialog } from 'primereact/confirmdialog';
import Swal from 'sweetalert2';
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
  
  
  // console.log(userCliente.urlImg, config.API_IMG.AVATARES);
  return (
    <>
    <Link  to={'/gestion-clientes'} className='mt-3'><i className='mdi mdi-chevron-left'></i>Regresar</Link>
    
    <ModalExtensionRegalo onHide={modalCloseRegalos} show={isOpenModalRegalos} id_cli={userCliente?.id_cli} dataUltimaMembresia={dataUltimaMembresia}/>
    <ModalExtensionCongelamiento onHide={modalCloseCongelamiento} show={isOpenModalCongelamiento} id_cli={userCliente.id_cli} dataUltimaMembresia={dataUltimaMembresia}/>
    <Row>
      <Col lg={4}>
        <Card className='mt-3 p-3'>
          <div className='' style={{height: '600px', width: '100%'}}>
            <div className='d-flex align-items-center flex-column'>
              <img src={`${userCliente.urlImg==null?sinAvatar:`${config.API_IMG.AVATARES}${userCliente.urlImg}`}`} className='rounded-circle' width={150} height={150}/>
              <div className='m-2 text-center'>
                <span className='fs-2 fw-bold'><p className='mb-0 pb-0'>{userCliente.nombre_cli} {userCliente.apPaterno_cli} {userCliente.apMaterno_cli}</p></span>
                <span className='text-center'>ACTIVO</span>
              </div>
              <div className='btn btn-danger m-1' onClick={modalOpenRegalos}>
                CREAR REGALOS
              </div>
              <div className='btn btn-info m-1' onClick={modalOpenCongelamiento}>
                CREAR CONGELAMIENTO
              </div>
            </div>
          </div>
        </Card>
      </Col>
      <Col lg={8}>
    <Card className='mt-3 p-3'>
      <div className='flex-auto'>
          <TabView>
            <TabPanel header='Informacion basica'>
              <ScrollPanel style={{ width: '100%', height: '500px' }} className="custombar2">
                  <InformacionGeneralCliente data={userCliente}/>
              </ScrollPanel>
            </TabPanel>
            <TabPanel header='Comentarios'>
            <ScrollPanel style={{ width: '100%', height: '500px' }} className="custombar2">
              <SectionComentarios data={userCliente}/>
            </ScrollPanel>
            </TabPanel>
            <TabPanel header='Compras'>
            <ScrollPanel style={{ width: '100%', height: '500px' }} className="custombar2">
              <ComprasxCliente uid={uid} dataVenta={userCliente.tb_venta}/>
            </ScrollPanel>
            </TabPanel>
            <TabPanel header='Reportes'>
            <ScrollPanel style={{ width: '100%', height: '500px' }} className="custombar2">
              <ReportesxCliente uid={uid} dataVenta={userCliente.tb_venta}/>
            </ScrollPanel>
            </TabPanel>
            <TabPanel header='DIETAS'>
            <ScrollPanel style={{ width: '100%', height: '500px' }} className="custombar2">
              <ReportesxCliente uid={uid} dataVenta={userCliente.tb_venta}/>
            </ScrollPanel>
            </TabPanel>
          </TabView>
      </div>
    </Card>
      </Col>
    </Row>
    </>
  );
}

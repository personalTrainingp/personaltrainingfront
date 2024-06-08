import React, { useEffect } from 'react'
import { Card, Col, Row, Tab, Tabs } from 'react-bootstrap';
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import FormWizard from "react-form-wizard-component";
import "react-form-wizard-component/dist/style.css";
import { Link, redirect, useParams } from 'react-router-dom';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';
import { useSelector } from 'react-redux';
import { InformacionGeneralCliente } from './InformacionGeneralCliente';
import Error404AltPage from '@/pages/otherpages/Error404Alt';
import config from '@/config';

export const PerfilCliente = () => {
  const { uid } = useParams()
  const { obtenerOneUsuarioCliente } = useUsuarioStore()
  const { status, userCliente } = useSelector(e=>e.authClient)
  useEffect(() => {
    obtenerOneUsuarioCliente(uid)
  }, [])
  if(status==="load"){
    return (
      <>
      Cargando
      </>
    )
  }
  if(userCliente==null){
    return <Error404AltPage/>;
  }
  // console.log(userCliente.urlImg, config.API_IMG.AVATARES);
  return (
    <>
    <Link  to={'/gestion-clientes'} className='mt-3'><i className='mdi mdi-chevron-left'></i>Regresar</Link>
    <Card className='mt-3 p-3'>
      <div className='d-flex align-items-center'>
        <img src={`${userCliente.urlImg==null?sinAvatar:`${config.API_IMG.AVATARES}${userCliente.urlImg}`}`} className='rounded-circle' width={150} height={150}/>
        <div className='m-2'>
          <span className='fs-1 fw-bold'><p className='mb-0 pb-0'>{userCliente.nombre_cli} {userCliente.apPaterno_cli} {userCliente.apMaterno_cli}</p></span>
          <span className=''>ACTIVO</span>
        </div>
      </div>
    </Card>
    <Card className='mt-3 p-3'>
      <Tabs>
        <Tab eventKey='infoBasic' title='Informacion basica'>
          <InformacionGeneralCliente data={userCliente}/>
        </Tab>
        <Tab eventKey='infoComentarios' title='Comentarios'>
          
        </Tab>
        <Tab eventKey='pays' title='Compras'>
          
        </Tab>
      </Tabs>
    </Card>
    </>
  );
}

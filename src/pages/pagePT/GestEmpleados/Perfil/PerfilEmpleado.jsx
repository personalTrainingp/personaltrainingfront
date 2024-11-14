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

export const PerfilEmpleado = () => {
  const { uid } = useParams()
	const { obtenerUsuarioEmpleado } = useUsuarioStore()
	const {userEmpleado, status}  = useSelector(e=>e.authEmpl)
  useEffect(() => {
    obtenerUsuarioEmpleado(uid)
  }, [])
  if(status==="load"){
    return (
      <>
      Cargando
      </>
    )
  }
  console.log(userEmpleado,`${config.API_IMG.AVATAR_EMPL}${userEmpleado.tb_image?.name_image}`);
  
  if(userEmpleado==null){
    return <Error404AltPage/>;
  }
  return (
    <>
    
    <div className='my-2 py-2 btn btn-primary'>
        <Link  to={'/gestion-empleados'} className='fs-5 text-white'><i className='mdi mdi-chevron-left'></i>Regresar</Link>
    </div>
    <Card className='mt-3 p-3'>
      <div className='d-flex align-items-center'>
        <img src={`${userEmpleado.tb_image==null?sinAvatar:`${config.API_IMG.AVATAR_EMPL}${userEmpleado.tb_image?.name_image}`}`} className='rounded-circle' width={150} height={150}/>
        <div className='m-2'>
          <span className='fs-1 fw-bold'><p className='mb-0 pb-0'>{userEmpleado.nombre_empl} {userEmpleado.apPaterno_empl} {userEmpleado.apMaterno_empl}</p></span>
          <span className=''>ACTIVO</span>
        </div>
      </div>
    </Card>
    <Card className='mt-3 p-3'>
      <Tabs>
        <Tab eventKey='infoBasic' title='Informacion basica'>
        <InformacionGeneralEmpleado data={userEmpleado}/>
        </Tab>
        <Tab eventKey='infoComentarios' title='Comentarios'>
          
        </Tab>
        {/* <Tab eventKey='pays' title='Compras'>
          
        </Tab> */}
      </Tabs>
    </Card>
    </>
  );
}

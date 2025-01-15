import React, { useEffect, useState } from 'react'
import {Modal, Row, Col, Tab, Tabs, Button, ModalBody} from 'react-bootstrap'
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import Select from 'react-select'
import { LayoutInfoContacEmergencia } from '../GestEmpleados/LayoutInfoContacEmergencia';
import { LayoutInfoContacto } from '../GestEmpleados/LayoutInfoContacto';
import { useForm } from '@/hooks/useForm';
import { onResetComentario, onReset_CE, onSetUsuarioCliente } from '@/store/usuario/usuarioSlice';
import { useDispatch } from 'react-redux';
import { LayoutComentario } from '../GestEmpleados/LayoutComentario';
import { useSelector } from 'react-redux';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { SectionComentario } from '@/components/Comentario/SectionComentario';


const regUsuarioCliente= {
    nombre_cli: '',
    apPaterno_cli: '',
    apMaterno_cli: '',
    fecNac_cli: '',
    fecha_nacimiento: '',
    estCivil_cli: 0,
    sexo_cli: 0,
    tipoDoc_cli: 0,
    numDoc_cli: '',
    nacionalidad_cli: 15,
    ubigeo_distrito_cli: 0,
    direccion_cli: '',
    tipoCli_cli: 0,
    trabajo_cli: '',
    cargo_cli: '',
    email_cli: '',
    tel_cli: '',
}   
const registerImgAvatar={
    imgAvatar_BASE64: ''
}
export const ModalComentarios = ({uid_comentario, show, onHide}) => {
    const [selectedFile, setSelectedFile] = useState(sinAvatar);
    const  { startRegisterUsuarioCliente, loading } = useUsuarioStore()
    const dispatch = useDispatch()


  

  return (
    <>
    {loading ? (<Modal size='sm' show={loading}>
        <ModalBody>
        <div className='d-flex flex-column align-items-center justify-content-center text-center' style={{height: '15vh'}}>
				<span className="loader-box2"></span>
                <br/>
                <p className='fw-bold font-16'>
                    Si demora mucho, comprobar su conexion a internet
                </p>
		</div>
        </ModalBody>
    </Modal> ) : (
    <Modal show={show} onHide={onHide} size='lg' backdrop={'static'}>
    <Modal.Header>
        <Modal.Title>COMENTARIOS</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <SectionComentario uid_comentario={uid_comentario}/>
    </Modal.Body>
    </Modal>
    )
    }
    </>
  )
}

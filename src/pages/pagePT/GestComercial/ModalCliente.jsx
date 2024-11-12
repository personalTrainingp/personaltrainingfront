import { arrayDistrito, arrayEstadoCivil, arrayEstados, arrayNacionalidad, arraySexo, arrayTipoCliente, arrayTipoDoc, filtrarDuplicados } from '@/types/type'
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


const regUsuarioCliente= {
    nombre_cli: '',
    apPaterno_cli: '',
    apMaterno_cli: '',
    fecNac_cli: '',
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
export const ModalCliente = ({show, onHide}) => {
	const [selectedFile, setSelectedFile] = useState(sinAvatar);
    const [selectedAvatar, setselectedAvatar] = useState(null)
    const resetAvatar = ()=>{
        setSelectedFile(sinAvatar)
    }
    const { usuarioCliente, dataContactsEmerg, comentarios } = useSelector(e=>e.usuario)
    const  { startRegisterUsuarioCliente, loading } = useUsuarioStore()
    const { obtenerDistritosxDepxProvincia, dataDistritos } = useTerminoStore()
    const dispatch = useDispatch()
    const { 
            formState,
            nombre_cli, 
            apPaterno_cli, 
            apMaterno_cli, 
            fecNac_cli, 
            estCivil_cli, 
            sexo_cli, 
            tipoDoc_cli, 
            numDoc_cli, 
            nacionalidad_cli, 
            ubigeo_distrito_cli, 
            direccion_cli, 
            tipoCli_cli, 
            trabajo_cli, 
            cargo_cli, 
            tel_cli,
            email_cli,
            onResetForm,
            onInputChange,
            onInputChangeReact} = useForm(regUsuarioCliente)


    const { formState: formStateAvatar, onFileChange: onRegisterFileChange } = useForm(registerImgAvatar)
    const { DataAsesores, obtenerParametrosAsesores } = useTerminoStore()
    useEffect(() => {
        dispatch(onSetUsuarioCliente(formState))
    }, [formState])

  const onSubmitAgregarCliente = ()=>{
          startRegisterUsuarioCliente({...usuarioCliente, dataContactsEmerg: dataContactsEmerg, comentarios}, selectedAvatar)
          btnCancelModal()
  }
  const btnCancelModal = ()=>{
        onHide()
        onResetForm()
        resetAvatar()
        dispatch(onResetComentario())
        dispatch(onReset_CE())
  }
  useEffect(() => {
    obtenerDistritosxDepxProvincia(1501, 15)
    obtenerParametrosAsesores()
  }, [])
  

    const ViewDataImg = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedFile(reader.result);
        };
        reader.readAsDataURL(file);
        setselectedAvatar(file)
    };
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
    <Modal show={show} onHide={onHide} size='xl' backdrop={'static'}>
    <Modal.Header>
        <Modal.Title>Agregar</Modal.Title>
    </Modal.Header>
    <Modal.Body>
				<Row>
					<Col xl={12} className="">
						<form>
                            <Row>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="tipoDoc_cli" className="form-label">
                                            ASESOR*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'tipoDoc_cli')}
											name="tipoDoc_cli"
											placeholder={'Seleccione el tipo de doc'}
											className="react-select"
											classNamePrefix="react-select"
											options={DataAsesores}
											value={DataAsesores.find(
												(option) => option.value === tipoDoc_cli
											)}
											required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="fecNac_cli" className="form-label">
                                            Fecha de registro*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            name="fecNac_cli"
                                            value={fecNac_cli}
                                            onChange={onInputChange}
                                            id="fecNac_cli"
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="nombre_cli" className="form-label">
                                            Nombres*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="nombre_cli"
                                            id="nombre_cli"
                                            value={nombre_cli}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="apPaterno_cli" className="form-label">
                                            Apellidos*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="apPaterno_cli"
                                            value={apPaterno_cli}
                                            onChange={onInputChange}
                                            id="apPaterno_cli"
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="apPaterno_cli" className="form-label">
                                            CELULAR*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="apPaterno_cli"
                                            value={apPaterno_cli}
                                            onChange={onInputChange}
                                            id="apPaterno_cli"
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="tipoDoc_cli" className="form-label">
                                            DISTRITO*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'tipoDoc_cli')}
											name="tipoDoc_cli"
											placeholder={'Seleccione el tipo de doc'}
											className="react-select"
											classNamePrefix="react-select"
											options={arrayTipoDoc}
											value={arrayTipoDoc.find(
												(option) => option.value === tipoDoc_cli
											)}
											required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="tipoDoc_cli" className="form-label">
                                            CANAL*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'tipoDoc_cli')}
											name="tipoDoc_cli"
											placeholder={'Seleccione el tipo de doc'}
											className="react-select"
											classNamePrefix="react-select"
											options={arrayTipoDoc}
											value={arrayTipoDoc.find(
												(option) => option.value === tipoDoc_cli
											)}
											required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="tipoDoc_cli" className="form-label">
                                            CAMPAÑA*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'tipoDoc_cli')}
											name="tipoDoc_cli"
											placeholder={'Seleccione el tipo de doc'}
											className="react-select"
											classNamePrefix="react-select"
											options={arrayTipoDoc}
											value={arrayTipoDoc.find(
												(option) => option.value === tipoDoc_cli
											)}
											required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="numDoc_cli" className="form-label">
                                            PLAN S/.*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            name="numDoc_cli"
                                            id="numDoc_cli"
                                            value={numDoc_cli}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="numDoc_cli" className="form-label">
                                            FECHA DE CITA*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            name="numDoc_cli"
                                            id="numDoc_cli"
                                            value={numDoc_cli}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="nacionalidad_cli" className="form-label">
                                            ESTADO*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'nacionalidad_cli')}
											name="nacionalidad_cli"
											placeholder={'Seleccione la nacionalidad'}
											className="react-select"
											classNamePrefix="react-select"
											options={arrayNacionalidad}
											value={arrayNacionalidad.find(
												(option) => option.value === nacionalidad_cli
											)}
											required
										/>
                                    </div>
                                </Col>
                            </Row>
                            
						</form>
					</Col>
				</Row>
                <Button className='me-3' onClick={onSubmitAgregarCliente}>Guardar</Button>
                <a className='text-danger' onClick={btnCancelModal}>Cancelar</a>
    </Modal.Body>
    </Modal>
    )
    }
    </>
  )
}

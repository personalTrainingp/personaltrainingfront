import { arrayDistrito, arrayEstadoCivil, arrayEstados, arrayNacionalidad, arraySexo, arrayTipoCliente, arrayTipoDoc } from '@/types/type'
import React, { useEffect, useRef, useState } from 'react'
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
import { Loading } from '@/components/Loading';
import { Toast } from 'primereact/toast';
import { clearErrorMessage } from '@/store/usuario/usuarioClienteSlice';


const regUsuarioCliente= {
    nombre_cli: '',
    apPaterno_cli: '',
    apMaterno_cli: '',
    fecha_nacimiento: '',
    estCivil_cli: 0,
    sexo_cli: 0,
    tipoDoc_cli: 0,
    numDoc_cli: '',
    nacionalidad_cli: 15,
    ubigeo_distrito_trabajo: 0,
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
    const [isShow, setisShow] = useState(show)
    const refToast = useRef(null)
	const [selectedFile, setSelectedFile] = useState(sinAvatar);
    const [selectedAvatar, setselectedAvatar] = useState(null)
        const { errorMessage } = useSelector(e=>e.authClient)
    const showToastCliente = (severity, summary, detail, label, life)=>{
        refToast.current.show({
          severity: severity,
          summary: summary,
          detail: detail,
          label: label,
          life: life
        });
      }
    const resetAvatar = ()=>{
        setSelectedFile(sinAvatar)
    }
    const { usuarioCliente, dataContactsEmerg, comentarios } = useSelector(e=>e.usuario)
    const  { startRegisterUsuarioCliente, loading } = useUsuarioStore()
    const { obtenerDistritosxDepxProvincia:obtenerDistritosDeLima, dataDistritos:distritosDeLima } = useTerminoStore()
    const { obtenerDistritosxDepxProvincia:obtenerDistritosDeCallao, dataDistritos:distritosDeCallao } = useTerminoStore()
    const dispatch = useDispatch()
    const { 
            formState,
            nombre_cli, 
            apPaterno_cli, 
            apMaterno_cli, 
            fecha_nacimiento,
            estCivil_cli, 
            sexo_cli, 
            tipoDoc_cli, 
            numDoc_cli, 
            nacionalidad_cli, 
            ubigeo_distrito_cli,
            ubigeo_distrito_trabajo, 
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
    useEffect(() => {
        dispatch(onSetUsuarioCliente(formState))
    }, [formState])

  const onSubmitAgregarCliente = ()=>{
        dispatch(clearErrorMessage())
          startRegisterUsuarioCliente({...usuarioCliente, dataContactsEmerg: dataContactsEmerg, comentarios}, selectedAvatar, btnCancelModal, showToastCliente)
  }
  const btnCancelModal = ()=>{
        onHide()
        onResetForm()
        dispatch(clearErrorMessage())
        resetAvatar()
        dispatch(onResetComentario())
        dispatch(onReset_CE())
  }
  useEffect(() => {
    obtenerDistritosDeLima(1501, 15)
    obtenerDistritosDeCallao(701, 7)
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
    const dataDistritos = [
        ...distritosDeLima,
        ...distritosDeCallao
    ]
    // console.log({formStateAvatar.imgAvatar_BASE64});
    
  return (
    <>
            <Toast  ref={refToast}/>
    {loading ? (<Loading show={loading}/> ) : (
    <Modal show={show} onHide={onHide} size='xl' backdrop={'static'}>
    <Modal.Header>
        <Modal.Title>Agregar socio</Modal.Title>
    </Modal.Header>
    <Modal.Body>
				<Row>
					<Col xl={3} className="">
						<div className="d-flex justify-content-center">
							<img src={selectedFile} width={180} height={180} />
						</div>
						<input 
                            type="file" 
                            className="m-2 fs-6"
                            accept="image/png, image/jpeg, image/jpg"
                            name="imgAvatar_BASE64"
                            onChange={(e)=>{
                                onRegisterFileChange(e)
                                ViewDataImg(e)
                            }} 
                            />
					</Col>
					<Col xl={9} className="">
						<form>
                            <Row>
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
                                            placeholder="Nombres completo"
                                            // required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="apPaterno_cli" className="form-label">
                                            Apellido paterno*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="apPaterno_cli"
                                            value={apPaterno_cli}
                                            onChange={onInputChange}
                                            id="apPaterno_cli"
                                            placeholder="Apellido paterno"
                                            // required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="apMaterno_cli" className="form-label">
                                            Apellido materno*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="apMaterno_cli"
                                            value={apMaterno_cli}
                                            onChange={onInputChange}
                                            id="apMaterno_cli"
                                            placeholder="Apellido materno"
                                            // required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="fecha_nacimiento" className="form-label">
                                            Fecha de nacimiento*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            name="fecha_nacimiento"
                                            value={fecha_nacimiento}
                                            onChange={onInputChange}
                                            id="fecha_nacimiento"
                                            placeholder="Fecha de nacimiento"
                                            // required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="estCivil_cli" className="form-label">
                                            Estado civil*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'estCivil_cli')}
											name="estCivil_cli"
											placeholder={'Seleccione el estado civil'}
											className="react-select"
											classNamePrefix="react-select"
											options={arrayEstadoCivil}
											value={arrayEstadoCivil.find(
												(option) => option.value === estCivil_cli
											)}
											// required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="sexo_cli" className="form-label">
                                            Sexo*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'sexo_cli')}
											name="sexo_cli"
											placeholder={'Seleccione el sexo'}
											className="react-select"
											classNamePrefix="react-select"
											options={arraySexo}
											value={arraySexo.find(
												(option) => option.value === sexo_cli
											)}
											// required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="tipoDoc_cli" className="form-label">
                                            Tipo de documento*
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
											// required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="numDoc_cli" className="form-label">
                                            Documento de identidad*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            name="numDoc_cli"
                                            id="numDoc_cli"
                                            value={numDoc_cli}
                                            onChange={onInputChange}
                                            placeholder="Documento de identidad"
                                            // required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="nacionalidad_cli" className="form-label">
                                            Nacionalidad*
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
											// required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="ubigeo_distrito_cli" className="form-label">
                                            Distrito*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'ubigeo_distrito_cli')}
											name="ubigeo_distrito_cli"
											placeholder={'Seleccione el distrito'}
											className="react-select"
											classNamePrefix="react-select"
											options={dataDistritos}
											value={dataDistritos.find(
												(option) => option.value === ubigeo_distrito_cli
											)}
											// required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="direccion_cli" className="form-label">
                                            Direccion
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="direccion_cli"
                                            id="direccion_cli"
                                            value={direccion_cli}
                                            onChange={onInputChange}
                                            placeholder="direccion"
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="tipoCli_cli" className="form-label">
                                            Tipo de socio*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'tipoCli_cli')}
											name="tipoCli_cli"
											placeholder={'Seleccione el tipo de socio'}
											className="react-select"
											classNamePrefix="react-select"
											options={arrayTipoCliente}
											value={arrayTipoCliente.find(
												(option) => option.value === tipoCli_cli
											)}
											// required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="ubigeo_distrito_trabajo" className="form-label">
                                            Distrito del trabajo*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'ubigeo_distrito_trabajo')}
											name="ubigeo_distrito_trabajo"
											placeholder={'Seleccione el distrito de trabajo'}
											className="react-select"
											classNamePrefix="react-select"
											options={dataDistritos}
											value={dataDistritos.find(
												(option) => option.value === ubigeo_distrito_trabajo
											)}
											// required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="trabajo_cli" className="form-label">
                                            Trabajo
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="trabajo_cli"
                                            id="trabajo_cli"
                                            value={trabajo_cli}
                                            onChange={onInputChange}
                                            placeholder="Trabajo"
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="cargo_cli" className="form-label">
                                            Cargo
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="cargo_cli"
                                            id="cargo_cli"
                                            value={cargo_cli}
                                            onChange={onInputChange}
                                            placeholder="Cargo"
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="email_cli" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            className="form-control"
                                            type="email"
                                            name="email_cli"
                                            id="email_cli"
                                            value={email_cli}
                                            onChange={onInputChange}
                                            placeholder="email"
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="tel_cli" className="form-label">
                                            Telefono
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="tel_cli"
                                            id="tel_cli"
                                            value={tel_cli}
                                            onChange={onInputChange}
                                            placeholder="telefono"
                                        />
                                    </div>
                                </Col>
                            </Row>
                            
						</form>
					</Col>
				</Row>
				<Row className="">
                    <Tabs>
                        <Tab eventKey={'infoContacEmerg'} title={'Informacion de contacto de emergencia'}>
                            <LayoutInfoContacEmergencia 
                                />
                        </Tab>
                        <Tab eventKey={'infoContac'} title={'Informacion de contacto del socio'}>
                            <LayoutInfoContacto/>
                        </Tab>
                        <Tab eventKey={'comentarios'} title={'Comentario'}>
                            <LayoutComentario/>
                        </Tab>
                        {/* <Tab eventKey={'docanex'} title={'Documentos anexados'}>
                            <LayoutInfoContacto/>
                        </Tab> */}
                    </Tabs>
                </Row>
                <Button className='me-3' onClick={onSubmitAgregarCliente}>Guardar socio</Button>
                <a className='text-danger' onClick={btnCancelModal}>Cancelar</a>
                <br/>
                {
                    errorMessage?.map(e=>{
                        return (
                            <div key={e} className="alert alert-danger" role="alert">
                                {e}
                            </div>
                        )
                    })
                }
    </Modal.Body>
    </Modal>
    )
    }
    </>
  )
}

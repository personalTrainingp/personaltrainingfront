import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row, Tab, Tabs  } from 'react-bootstrap';
import Select from 'react-select';
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import { useForm } from '@/hooks/useForm';
import { arrayCargoEmpl, arrayDepartamentoEmpl, arrayDistrito, arrayEstadoCivil, arrayEstados, arrayNacionalidad, arraySexo, arrayTipoJornadaEmpl } from '@/types/type';
import { LayoutInfoLaboral } from './LayoutInfoLaboral';
import { LayoutInfoContacEmergencia } from './LayoutInfoContacEmergencia';
import { LayoutInfoContacto } from './LayoutInfoContacto';
import { LayoutDocAnex } from './LayoutDocAnex';
import { LayoutInfoFinan } from './LayoutInfoFinan';
import { useSelector } from 'react-redux';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';
import { useDispatch } from 'react-redux';
import { onResetComentario, onReset_CE, onSetUsuarioEmpleado } from '@/store/usuario/usuarioSlice';
import { LayoutComentario } from './LayoutComentario';
import { arrayTipoDoc } from '../../../types/type';
const registroEmpleado={
    nombre_empl: '',
    apPaterno_empl: '',
    apMaterno_empl: '',
    fecNac_empl: '',
    sexo_empl: 0,
    estCivil_empl: 0,
    tipoDoc_empl: 0,
    numDoc_empl: '',
    nacionalidad_empl: 0,
    distrito_empl: 0,
    direccion_empl: '',
    email_empl: '',
    telefono_empl: '',
    fecContrato_empl: '',
    cargo_empl: 0,
    departamento_empl: 0,
    salario_empl: 0,
    tipoContrato_empl: 0,
    horario_empl: ''
}
const registerImgAvatar={
    imgAvatar_BASE64: ''
}
export const ModalEmpleado = ({ show, onHide }) => {
    const dispatch = useDispatch()
	const [selectedFile, setSelectedFile] = useState(sinAvatar);
    const resetAvatar = ()=>{
        setSelectedFile(sinAvatar)
    }
    const { usuarioEmpleado, dataContactsEmerg, comentarios } = useSelector(e=>e.usuario)
    const { 
        formState,
        nombre_empl,
        apPaterno_empl,
        apMaterno_empl,
        fecNac_empl,
        sexo_empl,
        estCivil_empl,
        tipoDoc_empl,
        numDoc_empl,
        nacionalidad_empl,
        distrito_empl,
        direccion_empl,
        email_empl,
        telefono_empl,
        fecContrato_empl,
        cargo_empl,
        departamento_empl,
        salario_empl,
        tipoContrato_empl,
        email_corporativo,
        horario_empl,
        onResetForm,
        onInputChange,
        onInputChangeReact} = useForm(registroEmpleado)
        
    const { formState: formStateAvatar, onFileChange: onRegisterFileChange } = useForm(registerImgAvatar)
    useEffect(() => {
        dispatch(onSetUsuarioEmpleado(formState))
    }, [formState])
    const  { startRegisterUsuarioEmpleado } = useUsuarioStore()
    // const { onInputChangeReact } = useForm()
    
  const onSubmitAgregarEmpleado = ()=>{
    
    const formData = new FormData();
    formData.append('avatar', formStateAvatar.imgAvatar_BASE64);
        startRegisterUsuarioEmpleado({...usuarioEmpleado, dataContactsEmerg: dataContactsEmerg, comentarios}, formData)
    btnCancelModal()
}
  const btnCancelModal = ()=>{
    onHide()
    onResetForm()
    resetAvatar()
    dispatch(onResetComentario())
    dispatch(onReset_CE())
}
const ViewDataImg = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        setSelectedFile(reader.result);
    };
    reader.readAsDataURL(file);
};
	return (
		<Modal show={show} onHide={onHide} size="xl">
			<Modal.Header>Registrar empleado</Modal.Header>
			<Modal.Body>
				<Row>
					<Col xl={3} className="">
						<div className="d-flex justify-content-center">
							<img src={selectedFile} width={180} height={180} />
						</div>
						<input
                         accept="image/png, image/jpeg, image/jpg"
                         name="imgAvatar_BASE64"
                         onChange={(e)=>{
                             onRegisterFileChange(e)
                             ViewDataImg(e)
                         }} 
                         type="file" className="m-2 fs-6" />
					</Col>
					<Col xl={9} className="">
						<form>
                            <Row>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="nombre_empl" className="form-label">
                                            Nombres*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="nombre_empl"
                                            id="nombre_empl"
                                            placeholder="Nombres completos"
                                            value={nombre_empl}
                                            onChange={onInputChange}
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="apPaterno_empl" className="form-label">
                                            Apellido paterno*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="apPaterno_empl"
                                            id="apPaterno_empl"
                                            value={apPaterno_empl}
                                            placeholder="Apellido Paterno"
                                            onChange={onInputChange}
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="apMaterno_empl" className="form-label">
                                            Apellido materno*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="apMaterno_empl"
                                            id="apMaterno_empl"
                                            value={apMaterno_empl}
                                            placeholder="Apellido materno"
                                            onChange={onInputChange}
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="fecNac_empl" className="form-label">
                                            Fecha de nacimiento*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            name="fecNac_empl"
                                            id="fecNac_empl"
                                            placeholder="fecha de nacimiento"
                                            value={fecNac_empl}
                                            onChange={onInputChange}
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="estCivil_empl" className="form-label">
                                            Estado civil*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'estCivil_empl')}
											name="estCivil_empl"
											placeholder={'Seleccione el estado civil'}
											className="react-select"
											classNamePrefix="react-select"
											options={arrayEstadoCivil}
											value={arrayEstadoCivil.find(
												(option) => option.value === estCivil_empl
											)}
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="sexo_empl" className="form-label">
                                            Sexo*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'sexo_empl')}
											name="sexo_empl"
											placeholder={'Seleccione el sexo'}
											className="react-select"
											classNamePrefix="react-select"
											options={arraySexo}
											value={arraySexo.find(
												(option) => option.value === sexo_empl
											)}
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="tipoDoc_empl" className="form-label">
                                            Tipo de documento*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'tipoDoc_empl')}
											name="tipoDoc_empl"
											placeholder={'Seleccione el tipo de doc'}
											className="react-select"
											classNamePrefix="react-select"
											options={arrayTipoDoc}
											value={arrayTipoDoc.find(
												(option) => option.value === tipoDoc_empl
											)}
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="numDoc_empl" className="form-label">
                                            Documento de identidad*
                                        </label>
                                        <input
                                            className="form-control"
                                            name="numDoc_empl"
                                            id="numDoc_empl"
                                            value={numDoc_empl}
                                            onChange={onInputChange}
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="nacionalidad_empl" className="form-label">
                                            Nacionalidad*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'nacionalidad_empl')}
											name="nacionalidad_empl"
											placeholder={'Seleccione la nacionalidad'}
											className="react-select"
											classNamePrefix="react-select"
											options={arrayNacionalidad}
											value={arrayNacionalidad.find(
												(option) => option.value === nacionalidad_empl
											)}
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="distrito_empl" className="form-label">
                                            Distrito*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'distrito_empl')}
											name="distrito_empl"
											placeholder={'Seleccione el distrito'}
											className="react-select"
											classNamePrefix="react-select"
											options={arrayDistrito}
											value={arrayDistrito.find(
												(option) => option.value === distrito_empl
											)}
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="direccion_empl" className="form-label">
                                            Direccion*
                                        </label>
                                        <input
                                            className="form-control"
                                            name="direccion_empl"
                                            id="direccion_empl"
                                            placeholder="direccion"
                                            value={direccion_empl}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="fecContrato_empl" className="form-label">
                                            Fecha de contrato*
                                        </label>
                                        <input
                                            className="form-control"
                                            name="fecContrato_empl"
                                            id="fecContrato_empl"
                                            type='date'
                                            value={fecContrato_empl}
                                            onChange={onInputChange}
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="horario_empl" className="form-label">
                                            Horario de trabajo*
                                        </label>
                                        <input
                                            className="form-control"
                                            name="horario_empl"
                                            id="horario_empl"
                                            type='time'
                                            value={horario_empl}
                                            onChange={onInputChange}
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="cargo_empl" className="form-label">
                                            Cargo*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'cargo_empl')}
											name="cargo_empl"
											placeholder={'Seleccione el cargo'}
											className="react-select"
											classNamePrefix="react-select"
											options={arrayCargoEmpl}
											value={arrayCargoEmpl.find(
												(option) => option.value === cargo_empl
											)}
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="departamento_empl" className="form-label">
                                            Departamento*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'departamento_empl')}
											name="departamento_empl"
											placeholder={'Seleccione el departamento'}
											className="react-select"
											classNamePrefix="react-select"
											options={arrayDepartamentoEmpl}
											value={arrayDepartamentoEmpl.find(
												(option) => option.value === departamento_empl
											)}
											required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="salario_empl" className="form-label">
                                            Salario*
                                        </label>
                                        <input
                                            className="form-control"
                                            name="salario_empl"
                                            id="salario_empl"
                                            placeholder="Stock"
                                            value={salario_empl}
                                            onChange={onInputChange}
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="salario_empl" className="form-label">
                                            Jornada laboral*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'tipoContrato_empl')}
											name="tipoContrato_empl"
											placeholder={'Seleccione la jornada'}
											className="react-select"
											classNamePrefix="react-select"
											options={arrayTipoJornadaEmpl}
											value={arrayTipoJornadaEmpl.find(
												(option) => option.value === tipoContrato_empl
											)}
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="email_empl" className="form-label">
                                            Email*
                                        </label>
                                        <input
                                            className="form-control"
                                            name="email_empl"
                                            id="email_empl"
                                            placeholder="Stock"
                                            value={email_empl}
                                            onChange={onInputChange}
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="email_corporativo" className="form-label">
                                            Email corporativo*
                                        </label>
                                        <input
                                            className="form-control"
                                            name="email_corporativo"
                                            id="email_corporativo"
                                            placeholder="Stock"
                                            type='email'
                                            value={email_corporativo}
                                            onChange={onInputChange}
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="telefono_empl" className="form-label">
                                            Telefono*
                                        </label>
                                        <input
                                            className="form-control"
                                            name="telefono_empl"
                                            id="telefono_empl"
                                            placeholder="Stock"
                                            value={telefono_empl}
                                            onChange={onInputChange}
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
                            <LayoutInfoContacEmergencia/>
                        </Tab>
                        <Tab eventKey={'comentarios'} title={'Comentario'}>
                            <LayoutComentario/>
                        </Tab>
                        {/* <Tab eventKey={'infoFinan'} title={'Informacion financiera'}>
                            <LayoutInfoFinan/>
                        </Tab>
                        <Tab eventKey={'infoDocAnex'} title={'Documentos anexados'}>
                            <LayoutDocAnex/>
                        </Tab> */}
                    </Tabs>
                </Row>
                
                <Button className='me-3' onClick={onSubmitAgregarEmpleado}>Guardar Empleado</Button>
                <a className='text-danger' onClick={btnCancelModal}>Cancelar</a>
			</Modal.Body>
		</Modal>
	);
};

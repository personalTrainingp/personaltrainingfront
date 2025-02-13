import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore'
import { useForm } from '@/hooks/useForm'
import { arrayEstadoCivil, arrayNacionalidad, arraySexo, arrayTipoCliente, arrayTipoDoc } from '@/types/type'
import dayjs from 'dayjs'
import { locale } from 'primereact/api'
import { Button } from 'primereact/button'
import {  confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link, redirect } from 'react-router-dom'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { useAuthStore } from '@/hooks/useAuthStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import sinAvatar from '@/assets/images/sinPhoto.jpg';


locale('es');

const registerImgAvatar={
    imgAvatar_BASE64: ''
}
export const InformacionGeneralCliente = ({data}) => {
    // console.log(data);
    // console.log(data, "info?");
    const navigate = useNavigate();
    // const { obtenerUser } = useAuthStore()
    
        const { obtenerDistritosxDepxProvincia:obtenerDistritosDeLima, dataDistritos:distritosDeLima } = useTerminoStore()
        const { obtenerDistritosxDepxProvincia:obtenerDistritosDeCallao, dataDistritos:distritosDeCallao } = useTerminoStore()

    
        const [selectedFile, setSelectedFile] = useState(sinAvatar);
    // console.log(user);
    
    const { formState, 
        nombre_cli, 
        apPaterno_cli, 
        apMaterno_cli, 
        fecha_nacimiento,
        sexo_cli, 
        estCivil_cli, 
        tipoDoc_cli, 
        numDoc_cli, 
        nacionalidad_cli, 
        ubigeo_distrito_cli, //distrito
        ubigeo_distrito_trabajo,
        direccion_cli, 
        tipoCli_cli, 
        trabajo_cli, 
        cargo_cli, 
        email_cli, 
        tel_cli,
        onInputChange, onInputChangeReact, onFileChange } = useForm(data)
        
            const { formState: formStateAvatar, onFileChange: onRegisterFileChange } = useForm(registerImgAvatar)
        const { eliminarOneUsuarioCliente, startUpdateUsuarioCliente }  = useUsuarioStore()
        const toast = useRef(null);

        const accept = () => {
            toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        }
    
        const reject = () => {
            toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
        const confirm1 = () => {
            
        };
        const onEliminarCliente = ()=>{
            confirmDialog({
                message: '¿Estas seguro (a) de eliminar el socio?',
                header: 'Eliminar socio',
                icon: 'pi pi-question-circle',
                defaultFocus: 'accept',
                accept:()=>{
                    eliminarOneUsuarioCliente(data.uid)
                    // Redirigir o mostrar un enlace después de la eliminación
                    navigate('/gestion-clientes'); // Redirige a otra ruta después de la eliminación
                },
                reject
            });
            // eliminarOneUsuarioCliente(data.uid)
            // startUpdateUsuarioCliente(formState, uid)
        }
        
        const onUpdateCliente = () =>{
            confirmDialog({
                message: '¿Estas seguro (a) de editar la informacion del socio?',
                header: 'Editar socio',
                icon: 'pi pi-question-circle',
                defaultFocus: 'accept',
                accept: ()=>{
                    startUpdateUsuarioCliente(formState, data.uid, formStateAvatar.imgAvatar_BASE64)
                },
                reject
            });
            // console.log(formState, data.uid);
            // startUpdateUsuarioCliente(formState, data.uid)
        }
        
          useEffect(() => {
            obtenerDistritosDeLima(1501, 15)
            obtenerDistritosDeCallao(701, 7)
          }, [])
          
    const dataDistritos = [
        ...distritosDeLima,
        ...distritosDeCallao
    ]
    const ViewDataImg = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedFile(reader.result);
        };
        reader.readAsDataURL(file);
    };
    // console.log(dataDistritos.find(e=>e.value===`${ubigeo_distrito_trabajo}`), ubigeo_distrito_trabajo, "ubi");
        
  return (
    <>
    
    <Toast ref={toast} />
    
    <Row>
					<Col xl={12} className="">
						<form>
                            <Row>
                                <Col xl={12}>
                                {/* <Button label='ACTUALIZAR FOTO' /> */}
							    <img src={selectedFile} width={180} height={180} />
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
                                            required
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
                                            required
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
                                            required
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
                                            required
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
											required
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
											required
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
											required
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
                                            required
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
											required
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
											required
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
											required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="id_distrito_trabajo" className="form-label">
                                            Distrito del trabajo*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'ubigeo_distrito_trabajo')}
											name="ubigeo_distrito_trabajo"
											placeholder={'Seleccione el distrito de trabajo'}
											className="react-select"
											classNamePrefix="react-select"
											options={dataDistritos}
											value={dataDistritos.find(e=>e.value===`${ubigeo_distrito_trabajo}`)}
											required
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
                    <Row>
                        <Col xl={4}>
                            <Button label='ACTUALIZAR' onClick={onUpdateCliente}/>
                        </Col>
                        <Col xl={4}>
                            <Button label='ELIMINAR' onClick={onEliminarCliente}/>
                        </Col>
                    </Row>
				</Row>
    </>
  )
}

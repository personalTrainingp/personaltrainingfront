import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore'
import { useForm } from '@/hooks/useForm'
import { arrayCargoEmpl, arrayDepartamentoEmpl, arrayDistrito, arrayEstadoCivil, arrayNacionalidad, arraySexo, arrayTipoCliente, arrayTipoDoc, arrayTipoJornadaEmpl } from '@/types/type'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import Select from 'react-select'
import sinAvatar from '@/assets/images/sinPhoto.jpg';

/*
id_cli(pin):7
uid_avatar(pin):"6350cee2-3ac8-4bad-ac9c-31c2db45a3e4"
uid(pin):"f7e9e9fb-00f4-4078-aa78-6440b19e77a7"
nombre_cli(pin):"Carlos"
apPaterno_cli(pin):"Rosales"
apMaterno_cli(pin):"Morales"
fecNac_cli(pin):"2002-09-21T00:00:00.000Z"
sexo_cli(pin):1
estCivil_cli(pin):4
tipoDoc_cli(pin):6
numDoc_cli(pin):"60936591"
nacionalidad_cli(pin):0
ubigeo_distrito_cli(pin):0
direccion_cli(pin):"Urb Serafín Cornelio"
tipoCli_cli(pin):"11"
trabajo_cli(pin):"PROGRAMADOR"
cargo_cli(pin):"DESARROLLADOR"
email_cli(pin):"carlodl2lzebe@gmail.com"
tel_cli(pin):"933102718"
uid_comentario(pin):"614b010f-c025-40e5-9e1b-29a6dbe7c67b"
uid_contactsEmergencia(pin):"338478cc-9c50-4c6c-b2c1-a28e0d4ddadb"
estado_cli(pin):true
flag(pin):true
*/

const registerImgAvatar={
    imgAvatar_BASE64: ''
}
export const InformacionGeneralEmpleado = ({data}) => {
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
        ubigeo_distrito_empl,
        direccion_empl,
        email_empl,
        telefono_empl,
        fecContrato_empl,
        cargo_empl,
        departamento_empl,
        salario_empl,
        email_corporativo,
        tipoContrato_empl,
        horario_empl,
        onInputChange, onInputChangeReact, onFileChange } = useForm(data)
        
	const [selectedFile, setSelectedFile] = useState(sinAvatar);
    
    const { formState: formStateAvatar, onFileChange: onRegisterFileChange } = useForm(registerImgAvatar)
        const { startUpdateUsuarioEmpleado } = useUsuarioStore()
        const onUpdateEmpleado = ()=>{
            startUpdateUsuarioEmpleado(formState, data.uid, formStateAvatar.imgAvatar_BASE64, data.uid)
        }
        
  return (
    <>
    <Row>
        <Col xl={12}>
            <div className="m-2">
                <label htmlFor="nombre_empl" className="form-label">
                    FOTO*
                </label>
                <input
                    accept="image/png, image/jpeg, image/jpg"
                    className="form-control"
                    type="file"
                    name="imgAvatar_BASE64"
                    id="imgAvatar_BASE64"
                    onChange={(e)=>{
                        onRegisterFileChange(e)
                    }} 
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
            <div className="m-2">
                <label htmlFor="nombre_empl" className="form-label">
                    Nombres*
                </label>
                <input
                    className="form-control"
                    type="text"
                    name="nombre_empl"
                    id="nombre_empl"
                    value={nombre_empl}
                    onChange={onInputChange}
                    placeholder="Nombres completo"
                    required
                />
            </div>
        </Col>
        <Col xl={3}>
            <div className="m-2">
                <label htmlFor="apPaterno_empl" className="form-label">
                    Apellido paterno*
                </label>
                <input
                    className="form-control"
                    type="text"
                    name="apPaterno_empl"
                    id="apPaterno_empl"
                    value={apPaterno_empl}
                    onChange={onInputChange}
                    placeholder="Apellido paterno"
                    required
                />
            </div>
        </Col>
        <Col xl={3}>
            <div className="m-2">
                <label htmlFor="apMaterno_empl" className="form-label">
                    Apellido materno*
                </label>
                <input
                    className="form-control"
                    type="text"
                    name="apMaterno_empl"
                    id="apMaterno_empl"
                    value={apMaterno_empl}
                    onChange={onInputChange}
                    placeholder="Apellido materno"
                    required
                />
            </div>
        </Col>
        <Col xl={3}>
            <div className="m-2">
                <label htmlFor="fecNac_empl" className="form-label">
                    Fec. de nacimiento*
                </label>
                <input
                    className="form-control"
                    type="date"
                    name="fecNac_empl"
                    id="fecNac_empl"
                    value={ fecNac_empl<='1900-01-01'?'':fecNac_empl}
                    onChange={onInputChange}
                    required
                />
            </div>
        </Col>
        <Col xl={3}>
            <div className="m-2">
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
                    required
                />
            </div>
        </Col>
        <Col xl={3}>
            <div className="m-2">
                <label htmlFor="estCivil_empl" className="form-label">
                    Est. civil*
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
                    required
                />
            </div>
        </Col>
        <Col xl={3}>
            <div className="m-2">
                <label htmlFor="fecNac_cli" className="form-label">
                    Tipo de documento*
                </label>
                <Select
                    onChange={(e) => onInputChangeReact(e, 'tipoDoc_empl')}
                    name="tipoDoc_empl"
                    placeholder={'Seleccione el tipo de documento'}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={arrayTipoDoc}
                    value={arrayTipoDoc.find(
                        (option) => option.value === tipoDoc_empl
                    )}
                    required
                />
            </div>
        </Col>
        <Col xl={3}>
            <div className="m-2">
                <label htmlFor="numDoc_empl" className="form-label">
                    N. del documento*
                </label>
                <input
                    className="form-control"
                    type="text"
                    name="numDoc_empl"
                    id="numDoc_empl"
                    value={numDoc_empl}
                    onChange={onInputChange}
                    placeholder="Numero del documento"
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
            <div className="m-2">
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
                    required
                />
            </div>
        </Col>
        <Col xl={5}>
        <div className="m-2">
                <label htmlFor="direccion_empl" className="form-label">
                    Direccion*
                </label>
                <input
                    className="form-control"
                    type="text"
                    name="direccion_empl"
                    id="direccion_empl"
                    value={direccion_empl}
                    onChange={onInputChange}
                    placeholder="Direccion"
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
        <div className="m-2">
                <label htmlFor="ubigeo_distrito_empl" className="form-label">
                    Distrito*
                </label>
                <Select
                    onChange={(e) => onInputChangeReact(e, 'ubigeo_distrito_empl')}
                    name="ubigeo_distrito_empl"
                    placeholder={'Seleccione el distrito'}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={arrayDistrito}
                    value={arrayDistrito.find(
                        (option) => option.value === ubigeo_distrito_empl
                    )}
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
        <div className="m-2">
                <label htmlFor="email_empl" className="form-label">
                    Email*
                </label>
                <input
                    className="form-control"
                    name="email_empl"
                    id="email_empl"
                    value={email_empl}
                    onChange={onInputChange}
                    placeholder="E.J: JHON@gmail.com"
                    required
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
        <div className="m-2">
                <label htmlFor="telefono_empl" className="form-label">
                    Telefono*
                </label>
                <input
                    className="form-control"
                    name="telefono_empl"
                    id="telefono_empl"
                    value={telefono_empl}
                    onChange={onInputChange}
                    placeholder="E.J: 999 999 999"
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
        <div className="m-2">
                <label htmlFor="fecContrato_empl" className="form-label">
                    Fecha de contrato*
                </label>
                <input
                    className="form-control"
                    type="date"
                    name="fecContrato_empl"
                    id="fecContrato_empl"
                    value={fecContrato_empl<='1900-01-01'?'':fecContrato_empl}
                    onChange={onInputChange}
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
        <div className="m-2">
                <label htmlFor="fecContrato_empl" className="form-label">
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
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
        <div className="m-2">
                <label htmlFor="departamento_empl" className="form-label">
                    Departamento*
                </label>
                <Select
                    onChange={(e) => onInputChangeReact(e, 'departamento_empl')}
                    name="cargo_empl"
                    placeholder={'Seleccione el cargo'}
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
        <div className="m-2">
                <label htmlFor="salario_empl" className="form-label">
                    Salario*
                </label>
                <input
                    className="form-control"
                    name="salario_empl"
                    id="salario_empl"
                    value={salario_empl}
                    onChange={onInputChange}
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
        <div className="m-2">
                <label htmlFor="tipoContrato_empl" className="form-label">
                    Tipo de jornada*
                </label>
                <Select
                    onChange={(e) => onInputChangeReact(e, 'tipoContrato_empl')}
                    name="cargo_empl"
                    placeholder={'Seleccionar la jornada'}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={arrayTipoJornadaEmpl}
                    value={arrayTipoJornadaEmpl.find(
                        (option) => option.value === tipoContrato_empl
                    )}
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
            <div className="m-2">
                <label htmlFor="horario_empl" className="form-label">
                    Horario*
                </label>
                <input
                    className="form-control"
                    name="horario_empl"
                    type='time'
                    id="horario_empl"
                    value={horario_empl}
                    onChange={onInputChange}
                    required
                />
            </div>
        </Col>
        <Button onClick={onUpdateEmpleado}>Guardar</Button>
    </Row>
    </>
  )
}

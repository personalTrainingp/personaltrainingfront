import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore'
import { useForm } from '@/hooks/useForm'
import { arrayDistrito, arrayEstadoCivil, arrayNacionalidad, arraySexo, arrayTipoCliente, arrayTipoDoc } from '@/types/type'
import dayjs from 'dayjs'
import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { Link, redirect } from 'react-router-dom'
import Select from 'react-select'
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
export const InformacionGeneralCliente = ({data}) => {
    // console.log(data);
    const { formState, 
        nombre_cli, 
        apPaterno_cli, 
        apMaterno_cli, 
        fecNac_cli, 
        sexo_cli, 
        estCivil_cli, 
        tipoDoc_cli, 
        numDoc_cli, 
        nacionalidad_cli, 
        ubigeo_distrito_cli, //distrito
        direccion_cli, 
        tipoCli_cli, 
        trabajo_cli, 
        cargo_cli, 
        email_cli, 
        tel_cli,
        onInputChange, onInputChangeReact, onFileChange } = useForm(data)
        const { eliminarOneUsuarioCliente, startUpdateUsuarioCliente }  = useUsuarioStore()
        const onEliminarCliente = ()=>{
            eliminarOneUsuarioCliente(data.uid)
            // startUpdateUsuarioCliente(formState, uid)
        }
        const onUpdateCliente = () =>{
            // console.log(formState, data.uid);
            startUpdateUsuarioCliente(formState, data.uid)
        }
  return (
    <>
    <Row>
        <Col xl={4}>
            <div className="m-2">
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
            <div className="m-2">
                <label htmlFor="apPaterno_cli" className="form-label">
                    Apellido paterno*
                </label>
                <input
                    className="form-control"
                    type="text"
                    name="apPaterno_cli"
                    id="apPaterno_cli"
                    value={apPaterno_cli}
                    onChange={onInputChange}
                    placeholder="Apellido paterno"
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
            <div className="m-2">
                <label htmlFor="apMaterno_cli" className="form-label">
                    Apellido materno*
                </label>
                <input
                    className="form-control"
                    type="text"
                    name="apMaterno_cli"
                    id="apMaterno_cli"
                    value={apMaterno_cli}
                    onChange={onInputChange}
                    placeholder="Apellido materno"
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
            <div className="m-2">
                <label htmlFor="fecNac_cli" className="form-label">
                    Fecha de nacimiento*
                </label>
                <input
                    className="form-control"
                    type="date"
                    name="fecNac_cli"
                    id="fecNac_cli"
                    value={dayjs(fecNac_cli).format('YYYY-MM-DD')}
                    onChange={onInputChange}
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
            <div className="m-2">
                <label htmlFor="fecNac_cli" className="form-label">
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
                    ) || 0}
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
            <div className="m-2">
                <label htmlFor="fecNac_cli" className="form-label">
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
                    ) || 0}
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
            <div className="m-2">
                <label htmlFor="fecNac_cli" className="form-label">
                    Tipo de documento*
                </label>
                <Select
                    onChange={(e) => onInputChangeReact(e, 'tipoDoc_cli')}
                    name="tipoDoc_cli"
                    placeholder={'Seleccione el tipo de documento'}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={arrayTipoDoc}
                    value={arrayTipoDoc.find(
                        (option) => option.value === tipoDoc_cli
                    ) || 0}
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
            <div className="m-2">
                <label htmlFor="numDoc_cli" className="form-label">
                    Numero del documento*
                </label>
                <input
                    className="form-control"
                    type="text"
                    name="numDoc_cli"
                    id="numDoc_cli"
                    value={numDoc_cli}
                    onChange={onInputChange}
                    placeholder="Numero del documento"
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
            <div className="m-2">
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
                    ) || 0}
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
        <div className="m-2">
                <label htmlFor="direccion_cli" className="form-label">
                    Direccion*
                </label>
                <input
                    className="form-control"
                    type="text"
                    name="direccion_cli"
                    id="direccion_cli"
                    value={direccion_cli}
                    onChange={onInputChange}
                    placeholder="Direccion"
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
        <div className="m-2">
                <label htmlFor="ubigeo_distrito_cli" className="form-label">
                    Distrito*
                </label>
                <Select
                    onChange={(e) => onInputChangeReact(e, 'ubigeo_distrito_cli')}
                    name="ubigeo_distrito_cli"
                    placeholder={'Seleccione el distrito'}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={arrayDistrito}
                    value={arrayDistrito.find(
                        (option) => option.value === ubigeo_distrito_cli
                    ) || 0}
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
            <div className="m-2">
                <label htmlFor="tipoCli_cli" className="form-label">
                    Tipo de cliente*
                </label>
                <Select
                    onChange={(e) => onInputChangeReact(e, 'tipoCli_cli')}
                    name="tipoCli_cli"
                    placeholder={'Seleccione el tipo de cliente'}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={arrayTipoCliente}
                    value={arrayTipoCliente.find(
                        (option) => option.value === tipoCli_cli
                    ) || 0}
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
        <div className="m-2">
                <label htmlFor="trabajo_cli" className="form-label">
                    Trabajo*
                </label>
                <input
                    className="form-control"
                    type="text"
                    name="trabajo_cli"
                    id="trabajo_cli"
                    value={trabajo_cli}
                    onChange={onInputChange}
                    placeholder="E.J: "
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
        <div className="m-2">
                <label htmlFor="cargo_cli" className="form-label">
                    Cargo*
                </label>
                <input
                    className="form-control"
                    type="text"
                    name="cargo_cli"
                    id="cargo_cli"
                    value={cargo_cli}
                    onChange={onInputChange}
                    placeholder="E.J: "
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
        <div className="m-2">
                <label htmlFor="email_cli" className="form-label">
                    Email*
                </label>
                <input
                    className="form-control"
                    type="email"
                    name="email_cli"
                    id="email_cli"
                    value={email_cli}
                    onChange={onInputChange}
                    placeholder="E.J: JHON@gmail.com"
                    required
                />
            </div>
        </Col>
        <Col xl={4}>
        <div className="m-2">
                <label htmlFor="tel_cli" className="form-label">
                    Telefono*
                </label>
                <input
                    className="form-control"
                    type="tel"
                    name="tel_cli"
                    id="tel_cli"
                    value={tel_cli}
                    onChange={onInputChange}
                    placeholder="E.J: 999 999 999"
                    required
                />
            </div>
        </Col>
        <Col xl={3}>
            <Button className='m-2' onClick={onUpdateCliente}>Guardar</Button>
            <Link onClick={onEliminarCliente} to={'/venta/gestion-clientes'} className='bg-danger m-2'>Eliminar cliente</Link>
        </Col>
    </Row>
    </>
  )
}

import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore'
import { useForm } from '@/hooks/useForm'
import { arrayDistrito, arrayEstadoCivil, arrayNacionalidad, arraySexo, arrayTipoCliente, arrayTipoDoc, filtrarDuplicados } from '@/types/type'
import dayjs from 'dayjs'
import { locale } from 'primereact/api'
import { Button } from 'primereact/button'
import {  confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link, redirect } from 'react-router-dom'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { useAuthStore } from '@/hooks/useAuthStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'


locale('es');
export const InformacionGeneralCliente = ({data}) => {
    // console.log(data);
    // console.log(data, "info?");
    const navigate = useNavigate();
    // const { obtenerUser } = useAuthStore()
    const { obtenerDistritosxDepxProvincia, dataDistritos } = useTerminoStore()

    useEffect(() => {
        obtenerDistritosxDepxProvincia(1501, 15)
    }, [])
    
    // console.log(user);
    
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
                    startUpdateUsuarioCliente(formState, data.uid)
                },
                reject
            });
            // console.log(formState, data.uid);
            // startUpdateUsuarioCliente(formState, data.uid)
        }
  return (
    <>
    
    <Toast ref={toast} />
    <Row>
        <Col xl={12}>
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
        <Col xl={12}>
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
        <Col xl={12}>
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
        <Col xl={12}>
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
        <Col xl={12}>
            <div className="m-2">
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
                    ) || 0}
                    required
                />
            </div>
        </Col>
        <Col xl={12}>
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
        <Col xl={12}>
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
        <Col xl={12}>
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
        <Col xl={12}>
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
        <Col xl={12}>
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
        <Col xl={12}>
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
                    options={dataDistritos}
                    value={dataDistritos.find(
                        (option) => option.value === ubigeo_distrito_cli
                    ) || 0}
                    required
                />
            </div>
        </Col>
        <Col xl={12}>
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
        <Col xl={12}>
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
        <Col xl={12}>
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
        <Col xl={12}>
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
        <Col xl={12}>
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
        <Col xl={12} className='mt-4'>
            {/* <Button className='m-2' onClick={onUpdateCliente}>Guardar</Button> */}
            <Row>
                <Col xl={3}>
                    <Button label="Editar Socio" rounded onClick={onUpdateCliente}/>
                </Col>
                <Col xl={3}>
                    <Button label="Eliminar Socio" severity='danger' rounded onClick={onEliminarCliente}/>
                </Col>
            </Row>
        </Col>
    </Row>
    </>
  )
}

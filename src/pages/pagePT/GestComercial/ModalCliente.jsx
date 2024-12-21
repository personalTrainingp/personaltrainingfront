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
import { useProspectoLeadsStore } from '@/hooks/hookApi/useProspectoLeadsStore';
import dayjs from 'dayjs';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';


const regUsuariosLeads= {
    nombres: '', 
    apellido_materno: '', 
    celular: '', 
    id_empl: 0, 
    id_canal: 0, 
    id_campania: 0, 
    ubigeo_distrito: '',
    plan_lead: '',
    fecha_cita: '',
    fecha_registro: '',
    id_estado_lead: 0,
    ultimo_dia_seguimiento: '',
}
export const ModalCliente = ({show, onHide, data}) => {
	const [selectedFile, setSelectedFile] = useState(sinAvatar)
    const  {  loading } = useUsuarioStore()
    const { obtenerDistritosxDepxProvincia, dataDistritos } = useTerminoStore()
    const dispatch = useDispatch()
    const { 
            formState,
            nombres, 
            apellido_materno, 
            celular, 
            id_empl, 
            id_canal, 
            id_campania, 
            ubigeo_distrito,
            plan_lead,
            fecha_cita,
            fecha_registro,
            id_estado_lead,
            ultimo_dia_seguimiento,
            onResetForm,
            onInputChange,
            onInputChangeReact} = useForm(data?data:regUsuariosLeads)
    const { DataAsesores, obtenerParametrosAsesores } = useTerminoStore()
    const { obtenerParametroPorEntidadyGrupo:obtenerParametroxCanal, DataGeneral:dataCanal }  = useTerminoStore()
    const { obtenerParametroPorEntidadyGrupo:obtenerParametroxCampania, DataGeneral:dataCampania }  = useTerminoStore()
    const { obtenerParametroPorEntidadyGrupo:obtenerParametroxEstadoLead, DataGeneral:dataEstadoLead }  = useTerminoStore()
    const { obtenerProspectosLeads, startRegisterProspecto, startRegisterProspectoLead, startUpdateProspectoLead } = useProspectoLeadsStore()
    // console.log(data);
        
    useEffect(() => {
        dispatch(onSetUsuarioCliente(formState))
    }, [formState])
  const btnCancelModal = ()=>{
        onHide()
        onResetForm()
  }
  useEffect(() => {
    obtenerDistritosxDepxProvincia(1501, 15)
    obtenerParametrosAsesores()
    obtenerParametroxCanal('lead-social', 'canal')
    obtenerParametroxCampania('lead-social', 'campaña')
    obtenerParametroxEstadoLead('lead-social', 'estado')
  }, [])
  const submitProspectosLeads = async(e)=>{
    e.preventDefault()
        if(data){
            // console.log("con");
            
            // setshowLoading(true)
            await startUpdateProspectoLead(data.id, formState)
            // setshowLoading(false)
            // console.log("sin ");
            // showToast('success', 'Editar gasto', 'Gasto editado correctamente', 'success')
            btnCancelModal()
            return;
        }
                // setshowLoading(true)
    await startRegisterProspectoLead(formState)
    btnCancelModal()
  }
  console.log(formState);
  
  return (
    <>
    {(
    <Modal show={show} onHide={onHide} size='xl' backdrop={'static'}>
    <Modal.Header>
        <Modal.Title>{data?'ACTUALIZAR':'AGREGAR'}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
				<Row>
					<Col xl={12} className="">
						<form onSubmit={submitProspectosLeads}>
                            <Row>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="id_empl" className="form-label">
                                            ASESOR*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'id_empl')}
											name="id_empl"
											placeholder={'Seleccionar al asesor'}
											className="react-select"
											classNamePrefix="react-select"
											options={DataAsesores}
											value={DataAsesores.find(
												(option) => option.value === id_empl
											)}
											required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="fecha_registro" className="form-label">
                                            Fecha de registro*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            name="fecha_registro"
                                            value={fecha_registro}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="nombres" className="form-label">
                                            Nombres*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="nombres"
                                            id="nombres"
                                            value={nombres}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="apellido_materno" className="form-label">
                                            Apellidos*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="apellido_materno"
                                            value={apellido_materno}
                                            onChange={onInputChange}
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
                                            name="celular"
                                            value={celular}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="ubigeo_distrito" className="form-label">
                                            DISTRITO*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'ubigeo_distrito')}
											name="ubigeo_distrito"
											placeholder={'Seleccionar el distrito'}
											className="react-select"
											classNamePrefix="react-select"
											options={dataDistritos}
											value={dataDistritos.find(
												(option) => option.value === ubigeo_distrito
											)}
											required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="id_canal" className="form-label">
                                            CANAL*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'id_canal')}
											name="id_canal"
											placeholder={'Seleccione el canal'}
											className="react-select"
											classNamePrefix="react-select"
											options={dataCanal}
											value={dataCanal.find(
												(option) => option.value === id_canal
											)}
											required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="id_campania" className="form-label">
                                            CAMPAÑA*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'id_campania')}
											name="id_campania"
											placeholder={'Seleccione la campaña'}
											className="react-select"
											classNamePrefix="react-select"
											options={dataCampania}
											value={dataCampania.find(
												(option) => option.value === id_campania
											)}
											required
										/>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="plan_lead" className="form-label">
                                            PLAN <SymbolSoles/>*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="plan_lead"
                                            value={plan_lead}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="fecha_cita" className="form-label">
                                            FECHA DE CITA*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            name="fecha_cita"
                                            value={fecha_cita}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="ultimo_dia_seguimiento" className="form-label">
                                            ULTIMO DIA DE SEGUIMIENTO*
                                        </label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            name="ultimo_dia_seguimiento"
                                            value={ultimo_dia_seguimiento}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="mb-2">
                                        <label htmlFor="id_estado_lead" className="form-label">
                                            ESTADO*
                                        </label>
										<Select
											onChange={(e) => onInputChangeReact(e, 'id_estado_lead')}
											name="id_estado_lead"
											placeholder={'Seleccionar el estado'}
											className="react-select"
											classNamePrefix="react-select"
											options={dataEstadoLead}
											value={dataEstadoLead.find(
												(option) => option.value === id_estado_lead
											)}
											required
										/>
                                    </div>
                                </Col>
                            </Row>
                            <Button className='me-3' type='submit'>Guardar</Button>
                            <a className='text-danger' onClick={btnCancelModal}>Cancelar</a>
						</form>
					</Col>
				</Row>
    </Modal.Body>
    </Modal>
    )
    }
    </>
  )
}

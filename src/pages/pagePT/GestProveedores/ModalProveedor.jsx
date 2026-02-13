import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { arrayEmpresaFinan, arrayEstados, arrayTarjetasTemp } from '@/types/type'
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { ModalAgregarTermino } from './ModalAgregarTermino';
import { useSelector } from 'react-redux';
import { useTerminologiaStore } from './useTerminologiaStore';
import { InputSelect, InputText } from '@/components/InputText';
const registerProvedor = {
    ruc_prov: '', 
	razon_social_prov: '', 
	tel_prov: '',
	cel_prov: '', 
	email_prov: '', 
	direc_prov: '', 
	dni_vend_prov: '',
	nombre_vend_prov: '',
	cel_vend_prov: '',
	email_vend_prov: '',
	estado_prov: false,
    id_oficio: 0,
    nombre_contacto: '',
    es_agente: false,
    id_empresa: 0
}
const registerImgAvatar={
    imgAvatar_BASE64: ''
}
export const ModalProveedor = ({status, dataProv, onHide, show, id, onShow, onCloseModalProveedor}) => {
    const { dataViewTerm } = useSelector(e=>e.TERM)
    const { startRegisterProveedor, message, isLoading, actualizarProveedor, obtenerProveedor, proveedor } = useProveedorStore()
	const [selectedFile, setSelectedFile] = useState(sinAvatar);
    const [selectedAvatar, setselectedAvatar] = useState(null)
    const { formState: formStateAvatar, onFileChange: onRegisterFileChange } = useForm(registerImgAvatar)
    const [isOpenModalTerminoOficio, setisOpenModalTerminoOficio] = useState({isOpen: false, id: 0})
    const { ruc_prov, 
            razon_social_prov, 
            tel_prov,
            cel_prov, 
            email_prov, 
            direc_prov, 
            dni_vend_prov,
			nombre_vend_prov,
			cel_vend_prov,
			email_vend_prov,
            estado_prov,
            nombre_contacto,
            cci,
            n_cuenta,
            id_tarjeta,
            id_empresa,
            id_oficio,
            es_agente,
            formState, onResetForm, onInputChange, onInputChangeReact } = useForm((id==0?registerProvedor:proveedor))
            const { comboOficio, obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
            const { obtenerTerminologiaSistema } = useTerminologiaStore()
            const [visible, setVisible] = useState(false);
          
            const toastBC = useRef(null);
            useEffect(() => {
              if (visible && !isLoading) {
                toastBC.current?.show({
                  severity: `${message.ok?'success':'danger'}`,
                  summary: message.msg,
                  life: 1500,  // Duración del toast en milisegundos (3 segundos)
                //   sticky: true,
                  position: 'top-right'
                });
              }
            }, [visible, isLoading]);
            
            useEffect(() => {
                if(show){
                    obtenerTerminologiaSistema('proveedor', 'tipo_oficio')
                    obtenerParametroPorEntidadyGrupo('formapago', 'banco')
                }
            }, [show])
            useEffect(() => {
                if (id!==0) {
                    obtenerProveedor(id)
                }
            }, [id])
            



            const clear = () => {
                toastBC.current.clear();
                setVisible(false);
            };
            
            const submitProveedor = async(e)=>{
                e.preventDefault()
                if(dataProv){
                    // console.log("actualizaro");
                    actualizarProveedor(formState, dataProv.id)
                    setVisible(true);
                    onCancelForm()
                    return;
                }
                setVisible(true);
                onCancelForm()
                await startRegisterProveedor(formState, estado_prov, es_agente, selectedAvatar, id_empresa)
            }
            
            const onCancelForm = ()=>{
                onCloseModalProveedor()
            }
            const onClickOpenModalCustomOficios = ()=>{
                setisOpenModalTerminoOficio({isOpen: true, id: 0})
                onHide()
            }
            const onClickCloseModalCustomOficios = ()=>{
                setisOpenModalTerminoOficio({isOpen: false, id: 0})
                onShow()
            }
            
            const ViewDataImg = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = () => {
                    setSelectedFile(reader.result);
                };
                reader.readAsDataURL(file);
                setselectedAvatar(file)
            };
            const onInputChangeProv = (e)=>{
                onInputChange(e)
            }
  return (
    <>
        <Toast ref={toastBC} onRemove={clear} />
    <ModalAgregarTermino show={isOpenModalTerminoOficio.isOpen} onHide={onClickCloseModalCustomOficios} terminoAgregar={'OFICIO'} entidad={'proveedor'} grupo={'tipo_oficio'} titulo={'Oficio'}/>
    <Modal onHide={onCancelForm} show={show} size='lg' backdrop={'static'}>
        {status=='loading'?'Cargando....':(
            <>
                <Modal.Header>
                    <Modal.Title>
                        {dataProv?'Actualizar proveedor':'Registrar proveedor'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={submitProveedor}>
                        <Row>
                            <Col lg={12}>
                                <div className='m-4'>
                                    <InputSelect label={'EMPRESA'} nameInput={'id_empresa'} onChange={onInputChangeProv} options={arrayEmpresaFinan} value={id_empresa} required/>
                                </div>
                            </Col>
                            <Col lg={12}>
                                <p className='fw-bold fs-5 text-decoration-underline'>
                                    FOTO DEL PROVEEDOR
                                </p>
                            </Col>
                            <Col lg={12}>
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
                            <Col lg={12}>
                                <p className='fw-bold fs-5 text-decoration-underline'>
                                    Datos del Contacto
                                </p>
                            </Col>
                            <Col lg={12}>
                            <div className='mb-4'>
                                <InputText label={'NOMBRE DEL CONTACTO'} nameInput={'nombre_contacto'} onChange={onInputChangeProv} value={nombre_contacto} required/>
                            </div>
                            </Col>
                            <Col lg={12}>
                                <p className='fw-bold fs-5 text-decoration-underline'>
                                Datos del proveedor
                                </p>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-4'>
                                    <InputText label={'RUC'} onChange={onInputChangeProv} nameInput={'ruc_prov'} value={ruc_prov} required/>
                                </div>
                            </Col>
                            <Col lg={8}>
                                <div className='mb-4'>
                                    <InputText label={'Razon social'} onChange={onInputChangeProv} nameInput={'razon_social_prov'} value={razon_social_prov} required/>
                                </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <InputText label={'N° Celular'} nameInput={'cel_prov'} value={cel_prov} onChange={onInputChangeProv} required/>
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <InputText label={'N° Telefono'} nameInput={'tel_prov'} value={tel_prov} onChange={onInputChangeProv} required/>
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <InputText label={'Correo'} nameInput={'email_prov'} value={email_prov} onChange={onInputChangeProv} required/>
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <InputSelect label={'BANCO'} nameInput={'id_tarjeta'} onChange={onInputChangeProv} required options={DataGeneral} value={id_tarjeta} />
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <InputText label={'Numero de cuenta'} nameInput={'n_cuenta'} value={n_cuenta} onChange={onInputChangeProv} required/>
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <InputText label={'CCI'} nameInput={'cci'} value={cci} onChange={onInputChangeProv} required/>
                            </div>
                            </Col>
                            <Col lg={12}>
                            <div className="mb-4">
                                <InputText label={'Direccion'} nameInput={'direc_prov'} value={direc_prov} onChange={onInputChangeProv} required/>
                            </div>
                            </Col>
                            <Col lg={12}>
                                <Row>
                                    <Col lg={10}>
                                        <div className="mb-4">
                                            <InputSelect label={'Servicio y/o producto'} nameInput={'id_oficio'} onChange={onInputChangeProv} required options={dataViewTerm.map(e=>{return {label: e.label_param, value: e.id_param}})} value={id_oficio} />
                                        </div>
                                    </Col>
                                    <Col lg={2}>
                                        <div className='h-100 text-center d-flex align-items-center'>
                                            <Button onClick={()=>onClickOpenModalCustomOficios(0)}>+</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={12}>
                                <div className="mb-4">
                                    <InputSelect label={'Estado'} nameInput={'estado_prov'} onChange={onInputChangeProv} required options={arrayEstados} value={estado_prov} />
                                </div>
                            </Col>
                            <Col lg={12}>
                                <p className='fw-bold fs-5 text-decoration-underline'>
                                Datos del representante
                                </p>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-4">
                                    <InputText label={'DNI'} nameInput={'dni_vend_prov'} value={dni_vend_prov} onChange={onInputChangeProv} required/>
                                </div>
                            </Col>
                            <Col lg={8}>
                                <div className="mb-4">
                                    <InputText label={'Nombres'} nameInput={'nombre_vend_prov'} value={nombre_vend_prov} onChange={onInputChangeProv} required/>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-4">
                                    <InputText label={'N° celular'} nameInput={'cel_vend_prov'} value={cel_vend_prov} onChange={onInputChangeProv} required/>
                                </div>
                            </Col>
                            <Col lg={8}>
                                <div className="mb-4">
                                    <InputText label={'Correo'} nameInput={'email_vend_prov'} value={email_vend_prov} onChange={onInputChangeProv} required/>
                                </div>
                            </Col>
                            <Col lg={12}>
                                <div className='mb-4'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name='es_agente' onChange={onInputChange} checked={es_agente} id="flexCheckDefault"/>
                                        <label className="form-check-label" for="flexCheckDefault">
                                            ¿Si es un gasto? marcar la casilla.
                                        </label>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={12}>
                                <Button type='submit'>
                                {dataProv?'Actualizar':'Registrar'}
                                </Button>
                                <a className='m-3 text-danger' onClick={onCancelForm} style={{cursor: 'pointer'}}>Cancelar</a>
                            </Col>
                        </Row>
                    </form>
                </Modal.Body>
            </>
        )
        }
    </Modal>
    </>
  )
}

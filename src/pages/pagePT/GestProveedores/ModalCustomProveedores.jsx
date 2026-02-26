import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { InputSelect, InputText } from '@/components/InputText';
import { useForm } from '@/hooks/useForm';
import { useGestionProveedoresStore } from './useGestionProveedoresStore';
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { arrayEmpresaFinan, arrayEstados } from '@/types/type';
import { Button } from 'primereact/button';
import { ModalAgregarTermino } from './ModalAgregarTermino';

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
export const ModalCustomProveedores = ({onShow, show, onHide, id=0, isCopy=false, id_enterprice, tipo, estado, onCloseModalProvPst}) => {
        const [selectedFile, setSelectedFile] = useState(sinAvatar);
        const [selectedAvatar, setselectedAvatar] = useState(null)
        const { obtenerProveedorxID, dataProveedor, postProveedor } = useGestionProveedoresStore()
        const { obtenerParametroPorEntidadyGrupo:obtenerFormaPago, DataGeneral:dataFormaPago } = useTerminoStore()
        const { obtenerParametroPorEntidadyGrupo:obtenerTipoOficio, DataGeneral:dataTipoOficio } = useTerminoStore()
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
                id_oficio,
                es_agente,
                id_empresa,
                nombre_contacto,
                cci,
                n_cuenta,
                id_tarjeta,
                formState, onResetForm, onInputChange, onInputChangeReact } = useForm((id==0?registerProvedor:dataProveedor))
        useEffect(() => {
                if(show){
                    obtenerTipoOficio('proveedor', 'tipo_oficio')
                    obtenerFormaPago('formapago', 'banco')
                }
            }, [show])
        useEffect(() => {
            if (id!==0) {
                obtenerProveedorxID(id)
            }
        }, [id])
        const onSubmit = ()=>{
            postProveedor(formState, id_enterprice, tipo, estado)
            cancelar()
        }
        const cancelar = ()=>{
            onHide()
            onCloseModalProvPst()
            onResetForm()
        }
        
        const onCancelForm = ()=>{
            onHide()
            onResetForm()
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
        const onClickOpenModalCustomOficios = ()=>{
            setisOpenModalTerminoOficio({isOpen: true, id: 0})
            onHide()
        }
        const onClickCloseModalCustomOficios = ()=>{
            setisOpenModalTerminoOficio({isOpen: false, id: 0})
            onShow()
        }
  return (
    <>
        <ModalAgregarTermino show={isOpenModalTerminoOficio.isOpen} onHide={onClickCloseModalCustomOficios} terminoAgregar={'Servicio y/o producto'} entidad={'proveedor'} grupo={'tipo_oficio'} titulo={'Oficio'}/>
    <Modal show={show} onHide={onHide} size='xl'>
        <Modal.Header>
            AGREGAR PROVEEDOR
        </Modal.Header>
        <Modal.Body>
            <form>
                    <Row>
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
                            <div className='m-4'>
                                <InputSelect label={'EMPRESA'} nameInput={'id_empresa'} onChange={onInputChangeProv} options={arrayEmpresaFinan} value={id_empresa} required/>
                            </div>
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
                            <InputSelect label={'BANCO'} nameInput={'id_tarjeta'} onChange={onInputChangeProv} required options={dataFormaPago} value={id_tarjeta} />
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
                                        <InputSelect label={'Servicio y/o producto'} nameInput={'id_oficio'} onChange={onInputChangeProv} required options={dataTipoOficio} value={id_oficio} />
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
                            <Button onClick={()=>onSubmit()}>
                            {'Registrar'}
                            </Button>
                            <a className='m-3 text-danger' onClick={onCancelForm} style={{cursor: 'pointer'}}>Cancelar</a>
                        </Col>
                    </Row>
            </form> 
        </Modal.Body>
    </Modal>
    </>
  )
}

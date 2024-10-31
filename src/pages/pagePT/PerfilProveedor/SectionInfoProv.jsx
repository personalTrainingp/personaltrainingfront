import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { arrayEstados, arrayEstadosCitas, arrayPersonalTest, arrayTarjetasTemp } from '@/types/type'
import { confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import Select from 'react-select'
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import { Image } from 'primereact/image'
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
	estado_prov: true,
    nombre_contacto: '',
    es_agente: false,
    id_oficio: 0,
}

const registerImgAvatar={
    imgAvatar_BASE64: ''
}
export const SectionInfoProv = ({dataProv}) => {
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
        cci,
        n_cuenta,
        id_tarjeta,
        id_oficio,
        es_agente,
        nombre_contacto,
        formState, onResetForm, onInputChange, onInputChangeReact } = useForm(dataProv?dataProv:registerProvedor)
        
	const [selectedFile, setSelectedFile] = useState(sinAvatar);
    const resetAvatar = ()=>{
        setSelectedFile(sinAvatar)
    }
    const { formState: formStateAvatar, onFileChange: onRegisterFileChange } = useForm(registerImgAvatar)
        const { startRegisterProveedor, message, isLoading, actualizarProveedor } = useProveedorStore()
        const { comboOficio, obtenerOficios, obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
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
                obtenerOficios()
                obtenerParametroPorEntidadyGrupo('formapago', 'banco')
            }, [])
            
            const confirmDeleteGastoxID = ()=>{
                confirmDialog({
                    message: 'Seguro que quiero eliminar el gasto?',
                    header: 'Eliminar gasto',
                    icon: 'pi pi-info-circle',
                    defaultFocus: 'reject',
                    acceptClassName: 'p-button-danger',
                    accept:  onAcceptDeleteGasto,
                });
            }
            

            const clear = () => {
                toastBC.current.clear();
                setVisible(false);
            };
            
            const submitProveedor = async(e)=>{
                e.preventDefault()
                if(dataProv){
                    // console.log("actualizaro");
                    actualizarProveedor(formState, dataProv.id, formStateAvatar.imgAvatar_BASE64, dataProv.uid)
                    setVisible(true);
                    return;
                }
                setVisible(true);
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
    <>
        <form onSubmit={submitProveedor}>
                        <Row>
                            <Col lg={12}>
                                <div className='mb-4'>
                                    <div className="form-check">
                                        <input
                                        accept="image/png, image/jpeg, image/jpg"
                                        name="imgAvatar_BASE64"
                                        onChange={(e)=>{
                                            onRegisterFileChange(e)
                                            ViewDataImg(e)
                                        }} 
                                        type="file" className="fs-6" />
                                        <img src={selectedFile} style={{width: '100px', height: '100px'}}/>
                                    </div>
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
                            {/* <Col lg={12}>
                                <p className='fw-bold fs-5 text-decoration-underline'>
                                CONTACTO
                                </p>
                            </Col> */}
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="nombre_contacto" className="form-label">
                                    NOMBRES Y APELLIDOS COMPLETOS*
                                </label>
                                <input
                                    className="form-control"
                                    name="nombre_contacto"
                                    id="nombre_contacto"
                                    value={nombre_contacto}
                                    onChange={onInputChange}
                                    placeholder=""
                                    required
                                />
                            </div>
                            </Col>
                            <Col lg={2}>
                            <div className="mb-4">
                                <label htmlFor="tel_prov" className="form-label">
                                    CELULAR*
                                </label>
                                <input
                                    className="form-control"
                                    name="tel_prov"
                                    id="tel_prov"
                                    value={tel_prov}
                                    onChange={onInputChange}
                                    placeholder=""
                                    required
                                />
                            </div>
                            </Col>
                            <Col lg={6}>
                            <div className="mb-4">
                                <label htmlFor="nombre_contacto" className="form-label">
                                    CORREO PERSONAL*
                                </label>
                                <input
                                    className="form-control"
                                    name="nombre_contacto"
                                    id="nombre_contacto"
                                    value={''}
                                    onChange={onInputChange}
                                    placeholder=""
                                    required
                                />
                            </div>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-4">
                                    <label htmlFor="id_oficio" className="form-label">
                                        Servicio y/o producto*
                                    </label>
                                    
                                    <Select
                                        onChange={(e) => onInputChangeReact(e, 'id_oficio')}
                                        name="id_oficio"
                                        placeholder={'Seleccione el oficio'}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        options={comboOficio}
                                        value={comboOficio.find(
                                            (option) => option.value === id_oficio
                                        )}
                                    />
                                </div>
                            </Col>
                            <Col lg={12}>
                            <p className='fw-bold fs-4 text-primary text-decoration-underline'>
                                EMERGENCIA
                            </p>
                            </Col>
                            <Col lg={2}>
                                <div className="mb-4">
                                    <label htmlFor="id_oficio" className="form-label">
                                        FAMILIARIDAD*
                                    </label>
                                    <Select
                                        onChange={(e) => onInputChangeReact(e, 'id_oficio')}
                                        name="id_oficio"
                                        placeholder={'familia'}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        options={arrayPersonalTest}
                                        value={arrayPersonalTest.find(
                                            (option) => option.value === id_oficio
                                        )}
                                    />
                                </div>
                            </Col>
                            
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="nombre_contacto" className="form-label">
                                    NOMBRES Y APELLIDOS COMPLETOS*
                                </label>
                                <input
                                    className="form-control"
                                    name="nombre_contacto"
                                    id="nombre_contacto"
                                    value={nombre_contacto}
                                    onChange={onInputChange}
                                    placeholder=""
                                    required
                                />
                            </div>
                            </Col>
                            <Col lg={2}>
                            <div className="mb-4">
                                <label htmlFor="tel_prov" className="form-label">
                                    CELULAR*
                                </label>
                                <input
                                    className="form-control"
                                    name="tel_prov"
                                    id="tel_prov"
                                    value={tel_prov}
                                    onChange={onInputChange}
                                    placeholder=""
                                    required
                                />
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="nombre_contacto" className="form-label">
                                    CORREO*
                                </label>
                                <input
                                    className="form-control"
                                    name="nombre_contacto"
                                    id="nombre_contacto"
                                    value={''}
                                    onChange={onInputChange}
                                    placeholder=""
                                    required
                                />
                            </div>
                            </Col>
                            <Col lg={12}>
                                <Button type='submit'>
                                Actualizar
                                </Button>
                            </Col>
                        </Row>
                    </form>
    </>
  )
}

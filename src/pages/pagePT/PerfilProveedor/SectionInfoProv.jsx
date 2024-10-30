import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { arrayEstados, arrayTarjetasTemp } from '@/types/type'
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
                                            ¿Si es un agente? marcar la casilla.
                                        </label>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={12}>
                                <p className='fw-bold fs-5 text-decoration-underline'>
                                Nombre del contacto
                                </p>
                            </Col>
                            <Col lg={12}>
                            <div className="mb-4">
                                <label htmlFor="nombre_contacto" className="form-label">
                                    nombre del contacto*
                                </label>
                                <input
                                    className="form-control"
                                    name="nombre_contacto"
                                    id="nombre_contacto"
                                    value={nombre_contacto}
                                    onChange={onInputChange}
                                    placeholder="00000000000000"
                                    required
                                />
                            </div>
                            </Col>
                            <Col lg={12}>
                                <p className='fw-bold fs-5 text-decoration-underline'>
                                Datos del proveedor
                                </p>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="ruc_prov" className="form-label">
                                    Ruc*
                                </label>
                                <input
                                    className="form-control"
                                    name="ruc_prov"
                                    id="ruc_prov"
                                    value={ruc_prov}
                                    onChange={onInputChange}
                                    placeholder="00000000000000"
                                    required
                                />
                            </div>
                            </Col>
                            <Col lg={8}>
                            <div className="mb-4">
                                <label htmlFor="razon_social_prov" className="form-label">
                                    Razon social*
                                </label>
                                <input
                                    className="form-control"
                                    name="razon_social_prov"
                                    id="razon_social_prov"
                                    value={razon_social_prov}
                                    onChange={onInputChange}
                                    placeholder="EJ. Distribuidora lima"
                                    required
                                />
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="cel_prov" className="form-label">
                                    N° Celular*
                                </label>
                                <input
                                    className="form-control"
                                    name="cel_prov"
                                    id="cel_prov"
                                    value={cel_prov}
                                    onChange={onInputChange}
                                    placeholder="EJ. 999 999 999"
                                />
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="tel_prov" className="form-label">
                                    N° Telefono*
                                </label>
                                <input
                                    className="form-control"
                                    name="tel_prov"
                                    id="tel_prov"
                                    value={tel_prov}
                                    onChange={onInputChange}
                                    placeholder="EJ. 321 5650"
                                />
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="email_prov" className="form-label">
                                    Correo*
                                </label>
                                <input
                                    className="form-control"
                                    name="email_prov"
                                    id="email_prov"
                                    value={email_prov}
                                    onChange={onInputChange}
                                    placeholder="EJ. EXAMPLE@GMAIL.COM"
                                />
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="id_tarjeta" className="form-label">
                                    BANCO
                                </label>
                                <Select
                                        onChange={(e) => onInputChangeReact(e, 'id_tarjeta')}
                                        name="id_tarjeta"
                                        placeholder={'Seleccione el banco'}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        options={DataGeneral}
                                        value={DataGeneral.find(
                                            (option) => option.value === id_tarjeta
                                        )}
                                    />
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="n_cuenta" className="form-label">
                                    Numero de cuenta*
                                </label>
                                <input
                                    className="form-control"
                                    name="n_cuenta"
                                    id="n_cuenta"
                                    value={n_cuenta}
                                    onChange={onInputChange}
                                    placeholder="EJ. 0000000000"
                                />
                            </div>
                            </Col>
                            <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="cci" className="form-label">
                                    CCI*
                                </label>
                                <input
                                    className="form-control"
                                    name="cci"
                                    id="cci"
                                    value={cci}
                                    onChange={onInputChange}
                                    placeholder="EJ. 00000000000000000000"
                                />
                            </div>
                            </Col>
                            <Col lg={8}>
                            <div className="mb-4">
                                <label htmlFor="direc_prov" className="form-label">
                                    Direccion*
                                </label>
                                <input
                                    className="form-control"
                                    name="direc_prov"
                                    id="direc_prov"
                                    value={direc_prov}
                                    onChange={onInputChange}
                                    placeholder="EJ. JR LAS PERLAS"
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
                            <Col lg={4}>
                                <div className="mb-4">
                                    <label htmlFor="estado_prov" className="form-label">
                                        Estado*
                                    </label>
                                    
                                    <Select
                                        onChange={(e) => onInputChangeReact(e, 'estado_prov')}
                                        name="estado_prov"
                                        placeholder={'Seleccione el estado'}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        options={arrayEstados}
                                        value={arrayEstados.find(
                                            (option) => option.value === estado_prov
                                        )}
                                        required
                                    />
                                </div>
                            </Col>
                            <Col lg={12}>
                                <p className='fw-bold fs-5 text-decoration-underline'>
                                Datos del representante
                                </p>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-4">
                                    <label htmlFor="dni_vend_prov" className="form-label">
                                        Dni*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="dni_vend_prov"
                                        id="dni_vend_prov"
                                        value={dni_vend_prov}
                                        onChange={onInputChange}
                                        placeholder="60606061"
                                    />
                                </div>
                            </Col>
                            <Col lg={8}>
                                <div className="mb-4">
                                    <label htmlFor="nombre_vend_prov" className="form-label">
                                        Nombres*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="nombre_vend_prov"
                                        id="nombre_vend_prov"
                                        value={nombre_vend_prov}
                                        onChange={onInputChange}
                                        placeholder="Jhon Doe"
                                    />
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-4">
                                    <label htmlFor="cel_vend_prov" className="form-label">
                                        N° celular*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="cel_vend_prov"
                                        id="cel_vend_prov"
                                        value={cel_vend_prov}
                                        onChange={onInputChange}
                                        placeholder="999999999"
                                    />
                                </div>
                            </Col>
                            <Col lg={8}>
                                <div className="mb-4">
                                    <label htmlFor="email_vend_prov" className="form-label">
                                        Correo*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="email_vend_prov"
                                        id="email_vend_prov"
                                        value={email_vend_prov}
                                        onChange={onInputChange}
                                        placeholder="EJ. VENDEDOR@GMAIL.COM"
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

import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { arrayDepartamento, arrayEstados, arrayTarjetasTemp } from '@/types/type'
import { confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import Select from 'react-select'
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import { Image } from 'primereact/image'
import { Link } from 'react-router-dom'
const registerProvedor = {
    
    ruc_prov: '', 
    id_tarjeta: 0,
    n_cuenta: '',
    cci: '',
    razon_social_prov: '', 
    tel_prov: '',
    cel_prov: '', 
    email_prov: '', 
    direc_prov: '', 
    estado_prov: true,
    titular_cci: '',

    ubigeo_distrito: '',
    id_departamento: 0,


        
        dni_vend_prov: '',
        nombre_vend_prov: '',
        cel_vend_prov: '',
        email_vend_prov: '',
}

const registerImgAvatar={
    imgAvatar_BASE64: ''
}
export const SectionFacturacionProv = ({dataProv}) => {
    const { 
        estado_prov,
        ruc_prov, 

        razon_social_prov, 
        cel_prov, 
        email_prov, 

        tel_prov,
        titular_cci,
        id_tarjeta,
        n_cuenta,
        cci,

        direc_prov, 
        ubigeo_distrito,
        id_departamento,
        
        dni_vend_prov,
        nombre_vend_prov,
        cel_vend_prov,
        email_vend_prov,
        formState, onResetForm, onInputChange, onInputChangeReact } = useForm(dataProv?dataProv:registerProvedor)
        
	const [selectedFile, setSelectedFile] = useState(sinAvatar);
    const resetAvatar = ()=>{
        setSelectedFile(sinAvatar)
    }
    const { formState: formStateAvatar, onFileChange: onRegisterFileChange } = useForm(registerImgAvatar)
        const { startRegisterProveedor, message, isLoading, actualizarProveedor } = useProveedorStore()
        const { comboOficio, obtenerOficios, obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
        const { obtenerDistritosxDepxProvincia, dataDistritos } = useTerminoStore()
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
                obtenerDistritosxDepxProvincia(0,0)
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
                        <Col lg={2}>
                            <div className="mb-4" style={{width: '120px'}}>
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
                            <Col lg={2}>
                            <div className="mb-4" style={{width: '140px'}}>
                                <label htmlFor="ruc_prov" className="form-label text-primary">
                                    Ruc*
                                </label>
                                <input
                                    className="form-control"
                                    name="ruc_prov"
                                    id="ruc_prov"
                                    value={ruc_prov}
                                    onChange={onInputChange}
                                    placeholder=""
                                    required
                                />
                            </div>
                            </Col>
                            <Col lg={8}>
                            </Col>
                            <Col lg={3}>
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
                                    placeholder=""
                                    required
                                />
                            </div>
                            </Col>
                            <Col xs={12} sm={12} md={2} lg={3}>
                                <div className="mb-4" >
                                    <label htmlFor="cel_prov" className="form-label">
                                        N° Celular*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="cel_prov"
                                        id="cel_prov"
                                        value={cel_prov}
                                        onChange={onInputChange}
                                        placeholder=""
                                    />
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={2} lg={3}>
                                <div className="mb-4" >
                                    <label htmlFor="email_prov" className="form-label">
                                        Correo corporativo*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="email_prov"
                                        id="email_prov"
                                        value={email_prov}
                                        onChange={onInputChange}
                                        placeholder=""
                                    />
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3}>
                                <div className="mb-4" >
                                    <label htmlFor="tel_prov" className="form-label">
                                        N° Telefono*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="tel_prov"
                                        id="tel_prov"
                                        value={tel_prov}
                                        onChange={onInputChange}
                                        placeholder=""
                                    />
                                </div>
                            </Col>

                            <Col xs={12} sm={12} md={3} lg={3} >
                            <div className="mb-4">
                                <label htmlFor="titular_cci" className="form-label">
                                    BENEFICIARIO*
                                </label>
                                <input
                                    className="form-control"
                                    name="titular_cci"
                                    id="titular_cci"
                                    value={titular_cci}
                                    onChange={onInputChange}
                                    placeholder=""
                                />
                            </div>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} >
                                <div className="mb-4" >
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

                            <Col xs={12} sm={12} md={3} lg={3} >
                                <div className="mb-4" >
                                    <label htmlFor="n_cuenta" className="form-label">
                                        Cuenta*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="n_cuenta"
                                        id="n_cuenta"
                                        value={n_cuenta}
                                        onChange={onInputChange}
                                        placeholder=""
                                    />
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={2} lg={2} >
                                <div className="mb-4" >
                                    <label htmlFor="cci" className="form-label">
                                        CCI*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="cci"
                                        id="cci"
                                        value={cci}
                                        onChange={onInputChange}
                                        placeholder=""
                                    />
                                </div>
                            </Col>

                            <Col lg={6}>
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
                                    placeholder=""
                                />
                            </div>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} >
                                <div className="mb-4" >
                                    <label htmlFor="ubigeo_distrito" className="form-label">
                                        DISTRITO
                                    </label>
                                    <Select
                                            onChange={(e) => onInputChangeReact(e, 'ubigeo_distrito')}
                                            name="ubigeo_distrito"
                                            placeholder={'Seleccione DISTRITO'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={dataDistritos}
                                            value={dataDistritos.find((option)=>option.value===ubigeo_distrito)}
                                        />
                                </div>
                            </Col>

                            <Col xs={12} sm={12} md={3} lg={3} >
                                <div className="mb-4" >
                                    <label htmlFor="id_tarjeta" className="form-label">
                                        DEPARTAMENTO
                                    </label>
                                    <Select
                                            onChange={(e) => onInputChangeReact(e, 'id_tarjeta')}
                                            name="id_tarjeta"
                                            placeholder={'Seleccione DEPARTAMENTO'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={arrayDepartamento}
                                            value={arrayDepartamento.find(
                                                (option) => option.value === id_departamento
                                            )}
                                        />
                                </div>
                            </Col>
  
                            <Col lg={12}>
                                <p className='fw-bold fs-4 text-primary text-decoration-underline'>
                                Datos del representante
                                </p>
                            </Col>
                            
                            <div className="mb-4" style={{width: '120px'}}>
                                    <label htmlFor="dni_vend_prov" className="form-label">
                                        Dni*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="dni_vend_prov"
                                        id="dni_vend_prov"
                                        value={dni_vend_prov}
                                        onChange={onInputChange}
                                        placeholder=""
                                    />
                                </div>
                            <Col lg={4}>
                                <div className="mb-4">
                                    <label htmlFor="nombre_vend_prov" className="form-label">
                                        Nombres y apellidos*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="nombre_vend_prov"
                                        id="nombre_vend_prov"
                                        value={nombre_vend_prov}
                                        onChange={onInputChange}
                                        placeholder=""
                                    />
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={2} lg={2} >
                                <div className="mb-4" >
                                        <label htmlFor="cel_vend_prov" className="form-label">
                                            N° celular*
                                        </label>
                                        <input
                                            className="form-control"
                                            name="cel_vend_prov"
                                            id="cel_vend_prov"
                                            value={cel_vend_prov}
                                            onChange={onInputChange}
                                            placeholder=""
                                        />
                                    </div>
                            </Col>
                            <Col  md={3} lg={4}>
                                <div className="mb-4">
                                    <label htmlFor="email_vend_prov" className="form-label">
                                        Correo corporativo*
                                    </label>
                                    <input
                                        className="form-control"
                                        name="email_vend_prov"
                                        id="email_vend_prov"
                                        value={email_vend_prov}
                                        onChange={onInputChange}
                                        placeholder=""
                                    />
                                </div>
                            </Col>
                            <Col lg={12}>
                                <div className='m-2 py-2 btn btn-primary'>
                                    <Link  to={'/gestion-proveedores'} className='fs-5 text-white'><i className='mdi mdi-chevron-left'></i>Regresar</Link>
                                </div>
                                <Button type='submit'>
                                Actualizar
                                </Button>
                            </Col>
                        </Row>
                    </form>
    </>
  )
}

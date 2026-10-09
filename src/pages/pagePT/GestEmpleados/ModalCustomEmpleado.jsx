import { ImagenUploader } from '@/components/ImagenUploader'
import { InputButton, InputDate, InputSelect, InputText } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { useEmpleadosStore } from './useEmpleadosStore'
import { arrayDistrito, arrayEstadoCivil, arrayNacionalidad, arraySexo, arrayTipoDoc } from '@/types/type'
const registroEmpleado={
    nombre_empl: '',
    apPaterno_empl: '',
    apMaterno_empl: '',
    fecNac_empl: '',
    sexo_empl: 0,
    estCivil_empl: 0,
    tipoDoc_empl: 0,
    numDoc_empl: '',
    nacionalidad_empl: 0,
    distrito_empl: 0,
    direccion_empl: '',
    email_empl: '',
    telefono_empl: '',
    fecContrato_empl: '',
    cargo_empl: 0,
    departamento_empl: 0,
    salario_empl: 0,
    tipoContrato_empl: 0,
    horario_empl: ''
}
const registerImgAvatar={
    imgAvatar_BASE64: ''
}
export const ModalCustomEmpleado = ({show, onHide, id, isCopy, id_empresa, id_estado}) => {
    const { formState, onInputChange, onResetForm,
    nombre_empl,
    apPaterno_empl,
    apMaterno_empl,
    fecNac_empl,
    sexo_empl,
    estCivil_empl,
    tipoDoc_empl,
    numDoc_empl,
    nacionalidad_empl,
    distrito_empl,
    direccion_empl,
    email_empl,
    telefono_empl,
    cargo_empl,
    departamento_empl } = useForm(registroEmpleado)
    const [selectedAvatar, setselectedAvatar] = useState(null)
    const { formState: formStateAvatar, onFileChange: onRegisterFileChange, onResetForm:resetFile } = useForm(registerImgAvatar)
    const [showLoading, setshowLoading] = useState(false)
    const { postEmpleado } = useEmpleadosStore()
    const ViewDataImg = (e) => {
        setselectedAvatar(e.target.files[0])
    };
    const onClickCancelModal = ()=>{
        onResetForm()
        resetFile()
        setselectedAvatar(null)
        onHide()
    }
    const submitEmpleado = async(e)=>{
        e.preventDefault()
        setshowLoading(true)
        await postEmpleado({...formState, id_empresa, id_estado}, selectedAvatar, id_empresa, id_estado)
        setshowLoading(false)
        onClickCancelModal()
    }
  return (
    <Modal show={show} onHide={onClickCancelModal} size='xl'>
        <Modal.Header>
            <Modal.Title>
                AGREGAR COLABORADOR
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form id='form-custom-empleado' onSubmit={submitEmpleado}>
                <Row>
                    <Col lg={3}>
                        <div className='mb-2'>
                            <ImagenUploader
                                name={'imgAvatar_BASE64'}
                                height='300px'
                                onChange={(e)=>{
                                    onRegisterFileChange(e)
                                    ViewDataImg(e)
                                }}
                                />
                        </div>
                    </Col>
                    <Col lg={9}>
                        <Row>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <InputText label={'Nombres'} nameInput={'nombre_empl'} value={nombre_empl} onChange={onInputChange} required/>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <InputText label={'Apellido paterno'} nameInput={'apPaterno_empl'} value={apPaterno_empl} onChange={onInputChange} required/>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <InputText label={'Apellido materno'} nameInput={'apMaterno_empl'} value={apMaterno_empl} onChange={onInputChange} required/>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <InputDate label={'Fecha de nacimiento'} nameInput={'fecNac_empl'} value={fecNac_empl} onChange={onInputChange} required/>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <InputSelect label={'Sexo'} nameInput={'sexo_empl'} value={sexo_empl} onChange={onInputChange} options={arraySexo} required/>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <InputSelect label={'ESTADO CIVIL'} nameInput={'estCivil_empl'} value={estCivil_empl} onChange={onInputChange} options={arrayEstadoCivil} required/>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <InputSelect label={'TIPO DE DOCUMENTO'} nameInput={'tipoDoc_empl'} value={tipoDoc_empl} onChange={onInputChange} options={arrayTipoDoc} required/>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <InputText label={'DOCUMENTO DE IDENTIDAD'} nameInput={'numDoc_empl'} value={numDoc_empl} onChange={onInputChange} required/>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <InputSelect label={'NACIONALIDAD'} nameInput={'nacionalidad_empl'} value={nacionalidad_empl} onChange={onInputChange} options={arrayNacionalidad} required/>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <InputSelect label={'DISTRITO'} nameInput={'distrito_empl'} value={distrito_empl} onChange={onInputChange} options={arrayDistrito} required/>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <InputText label={'DIRECCION'} nameInput={'direccion_empl'} value={direccion_empl} onChange={onInputChange} required/>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <InputText label={'EMAIL'} nameInput={'email_empl'} value={email_empl} onChange={onInputChange} required/>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='mb-2'>
                                    <InputText label={'TELEFONO'} nameInput={'telefono_empl'} value={telefono_empl} onChange={onInputChange} required/>
                                </div>
                            </Col>
                        </Row>
                    </Col>


                </Row>
            </form>
        </Modal.Body>
        <Modal.Footer>
            <InputButton label={'CANCELAR'} variant={'outline-danger'} onClick={onClickCancelModal} disabled={showLoading}/>
            <InputButton label={showLoading?'AGREGANDO...':'AGREGAR'} type='submit' form='form-custom-empleado' disabled={showLoading}/>
        </Modal.Footer>
    </Modal>
  )
}

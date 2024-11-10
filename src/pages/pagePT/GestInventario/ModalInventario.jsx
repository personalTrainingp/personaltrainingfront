import { useInventarioStore } from '@/hooks/hookApi/useInventarioStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, ModalBody, Row } from 'react-bootstrap'
import Select from 'react-select'
const registerArticulo={
    producto: '',
    id_marca: '',
    cantidad: 0,
    lugar_compra_cotizacion: '',
    valor_unitario_depreciado: 0,
    valor_unitario_actual: 0,
    observacion: '',
    descripcion: '',
    valor_total: 0,
    id_lugar: 0
}
const registerImgAvatar={
    imgAvatar_BASE64: ''
}
export const ModalInventario = ({onHide, show, data, isLoading, onShow, showToast, id_enterprice}) => {
	const [selectedFile, setSelectedFile] = useState(sinAvatar);
    const [selectedAvatar, setselectedAvatar] = useState(null)
    const onClickCancelModal = ()=>{
        onHide()
        onResetForm()
    }
    const resetAvatar = ()=>{
        setSelectedFile(sinAvatar)
    }
    const [showLoading, setshowLoading] = useState(false)
    const { obtenerArticulo, obtenerArticulos, startRegisterArticulos, articulo } = useInventarioStore()
    const { DataGeneral:dataMarcas, obtenerParametroPorEntidadyGrupo:obtenerMarcas } = useTerminoStore()
    const { DataGeneral:dataLugares, obtenerParametroPorEntidadyGrupo:obtenerLugares } = useTerminoStore()
    const { formState, 
            producto,
            id_marca,
            cantidad,
            lugar_compra_cotizacion,
            valor_unitario_depreciado,
            valor_unitario_actual,
            valor_total,
            observacion,
            descripcion,
            id_lugar,
            onInputChange,  
            onResetForm,
            onInputChangeReact
        } = useForm(data?data:registerArticulo)
        
    const { formState: formStateAvatar, onFileChange: onRegisterFileChange } = useForm(registerImgAvatar)
        useEffect(() => {
            obtenerArticulos(id_enterprice)
            obtenerLugares('articulo', 'lugar_encuentro')
            obtenerMarcas('producto', 'marca')
        }, [])
        
        
        const submitGasto = async(e)=>{
            e.preventDefault()
            if(data){
                // console.log("con");
                
                setshowLoading(true)
                // await startActualizarGastos(formState, data.id, id_enterprice)
                setshowLoading(false)
                // console.log("sin ");
                // showToast('success', 'Editar gasto', 'Gasto editado correctamente', 'success')
                onClickCancelModal()
                return;
            }
            setshowLoading(true)
            await startRegisterArticulos(formState, id_enterprice, selectedAvatar)
            setshowLoading(false)
            // showToast(objetoToast);
            onClickCancelModal()
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
  return (
    <>
    {(showLoading)?(
        <Modal size='sm' show={showLoading}>
        <ModalBody>
        <div className='d-flex flex-column align-items-center justify-content-center text-center' style={{height: '15vh'}}>
				<span className="loader-box2"></span>
                <br/>
                <p className='fw-bold font-16'>
                    Si demora mucho, comprobar su conexion a internet
                </p>
		</div>
        </ModalBody>
    </Modal> 
    ):(
        <>
            <Modal size='xl' onHide={onClickCancelModal} show={show}>
                <Modal.Header>
                    <Modal.Title>
                        {data?'Actualizar Gasto':'REGISTRAR ARTICULO'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(isLoading) ? (
                        <>
                        {isLoading && 'Cargando Datos'}
                        </>
                    ):(
                        <form onSubmit={submitGasto}>
                            <Row>
                                <Col lg={12}>
                                <div className="mb-4">
                                        <label htmlFor="imgAvatar_BASE64" className="form-label">
                                            IMAGEN DEL ARTICULO
                                        </label>
                                        <input
                                                className="form-control"
                                                type='file'
                                                accept="image/*"
                                                name="imgAvatar_BASE64"
                                                onChange={(e)=>{
                                                    onRegisterFileChange(e)
                                                    ViewDataImg(e)
                                                }} 
                                            />
                                    </div>
                                </Col>
                                <Col lg={4}>    
                                    <div className="mb-4">
                                        <label htmlFor="producto" className="form-label">
                                            ARTICULO
                                        </label>
                                        <input
                                                className="form-control"
                                                name="producto"
                                                id="producto"
                                                value={producto}
                                                onChange={onInputChange}
                                                placeholder=""
                                            />
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="mb-4">
                                        <label htmlFor="marca" className="form-label">
                                            MARCA
                                        </label>
                                        <Select
                                            onChange={(e) => onInputChangeReact(e, 'id_marca')}
                                            name="id_marca"
                                            placeholder={'Seleccionar la marca'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={dataMarcas}
                                            value={dataMarcas.find(
                                                (option) => option.value === id_marca
                                            )||0}
                                            
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="mb-4">
                                        <label htmlFor="marca" className="form-label">
                                            UBICACION
                                        </label>
                                        <Select
                                            onChange={(e) => onInputChangeReact(e, 'id_lugar')}
                                            name="id_lugar"
                                            placeholder={'Seleccionar el lugar'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={dataLugares}
                                            value={dataLugares.find(
                                                (option) => option.value === id_lugar
                                            )||0}
                                            
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="mb-4">
                                        <label htmlFor="cantidad" className="form-label">
                                            CANTIDAD
                                        </label>
                                        <input
                                                className="form-control"
                                                name="cantidad"
                                                id="cantidad"
                                                value={cantidad}
                                                onChange={onInputChange}
                                                placeholder=""
                                            />
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="mb-4">
                                        <label htmlFor="lugar_compra_cotizacion" className="form-label">
                                            LUGAR DE COMPRA O COTIZACION
                                        </label>
                                        <input
                                                className="form-control"
                                                name="lugar_compra_cotizacion"
                                                id="lugar_compra_cotizacion"
                                                value={lugar_compra_cotizacion}
                                                onChange={onInputChange}
                                                placeholder=""
                                            />
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="mb-4">
                                        <label htmlFor="valor_unitario_depreciado" className="form-label">
                                            VALOR UNIT. DEPRECIADO
                                        </label>
                                        <input
                                                className="form-control"
                                                name="valor_unitario_depreciado"
                                                id="valor_unitario_depreciado"
                                                value={valor_unitario_depreciado}
                                                onChange={onInputChange}
                                                placeholder=""
                                            />
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="mb-4">
                                        <label htmlFor="valor_total" className="form-label">
                                            VALOR TOTAL
                                        </label>
                                        <input
                                                className="form-control"
                                                name="valor_total"
                                                id="valor_total"
                                                value={valor_total}
                                                onChange={onInputChange}
                                                placeholder=""
                                            />
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="mb-4">
                                        <label htmlFor="valor_unitario_actual" className="form-label">
                                            VALOR UNIT. ACTUAL
                                        </label>
                                        <input
                                                className="form-control"
                                                name="valor_unitario_actual"
                                                id="valor_unitario_actual"
                                                value={valor_unitario_actual}
                                                onChange={onInputChange}
                                                placeholder="E"
                                            />
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="mb-4">
                                        <label htmlFor="descripcion" className="form-label">
                                            DESCRIPCION
                                        </label>
                                        <textarea
                                                className="form-control"
                                                name="descripcion"
                                                id="descripcion"
                                                value={descripcion}
                                                onChange={onInputChange}
                                                placeholder=""
                                                required
                                            />
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="mb-4">
                                        <label htmlFor="observacion" className="form-label">
                                            OBSERVACIONES
                                        </label>
                                        <textarea
                                                className="form-control"
                                                name="observacion"
                                                id="observacion"
                                                value={observacion}
                                                onChange={onInputChange}
                                                placeholder=""
                                                required
                                            />
                                    </div>
                                </Col>
                                <Col>
                                    <Button className='mx-2' type='submit'>Guardar</Button>
                                    <a className='mx-2' style={{cursor: 'pointer', color: 'red'}} onClick={onClickCancelModal}>Cancelar</a>
                                </Col>
                            </Row>
                        </form>
                    )
                    }
                </Modal.Body>
            </Modal>
        </>
    ) 

    }
    </>
  )
}

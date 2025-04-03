import { useInventarioStore } from '@/hooks/hookApi/useInventarioStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, ModalBody, Row } from 'react-bootstrap'
import Select from 'react-select'
import { NumberFormatMoney } from '@/components/CurrencyMask';
const registerArticulo={
    producto: '',
    id_marca: '',
    id_lugar: 0,
    fecha_entrada: '',
    cantidad: 1,
    costo_unitario: 0,
    costo_unitario_dolares: 0,
    mano_obra_dolares: 0,
    mano_obra_soles: 0,
    nivel: 0,
    costo_total_dolares: 0,
    costo_total_soles: 0,
    descripcion: '',
}
const registerImgAvatar={
    imgAvatar_BASE64: ''
}
export const ModalInventario = ({onHide, show, data, isLoading, onShow, showToast, id_enterprice, id_zona}) => {
	const [selectedFile, setSelectedFile] = useState(sinAvatar);
    const [selectedAvatar, setselectedAvatar] = useState(null)
    
    const resetAvatar = ()=>{
        setSelectedFile(sinAvatar)
    }
    const [showLoading, setshowLoading] = useState(false)
    const { obtenerArticulo, obtenerArticulos, actualizarArticulo, startRegisterArticulos, articulo } = useInventarioStore()
    const { DataGeneral:dataMarcas, obtenerParametroPorEntidadyGrupo:obtenerMarcas } = useTerminoStore()
    // const { DataGeneral:dataLugares, obtenerParametroPorEntidadyGrupo:obtenerLugares } = useTerminoStore()
    const { obtenerZonas, dataZonas } =  useTerminoStore()
    const { formState, 
            producto,
            id_marca,
            cantidad,
            costo_unitario,
            costo_unitario_dolares,
            mano_obra_soles,
            mano_obra_dolares,
            fecha_entrada,
            descripcion,
            id_lugar,
            onInputChange,  
            onResetForm,
            onInputChangeReact
        } = useForm(data?data:registerArticulo)
    const { formState: formStateAvatar, onFileChange: onRegisterFileChange } = useForm(registerImgAvatar)
    const [costo_total_s, setcosto_total_s] = useState(0)
    const [costo_total_d, setcosto_total_d] = useState(0)
        useEffect(() => {
            setcosto_total_s(Number(costo_unitario*cantidad) + Number(mano_obra_soles))
        }, [costo_unitario, cantidad, mano_obra_soles])

        useEffect(() => {
            setcosto_total_d(Number(costo_unitario_dolares*cantidad) + Number(mano_obra_dolares))
        }, [costo_unitario_dolares, cantidad, mano_obra_dolares])
        
        useEffect(() => {
            obtenerArticulos(id_enterprice, true)
            obtenerZonas(id_zona)
            obtenerMarcas('articulo', 'marca')
        }, [])
        
        
        const submitGasto = async(e)=>{
            e.preventDefault()
            if(data){
                // console.log("con");
                
                setshowLoading(true)
                await actualizarArticulo({costo_total_soles: costo_total_s, costo_total_dolares: costo_total_d,...formState}, data.id, selectedAvatar, id_enterprice)
                setshowLoading(false)
                // console.log("sin ");
                // showToast('success', 'Editar gasto', 'Gasto editado correctamente', 'success')
                onClickCancelModal()
                return;
            }
            setshowLoading(true)
            await startRegisterArticulos({costo_total_soles: costo_total_s, costo_total_dolares: costo_total_d,...formState}, id_enterprice, selectedAvatar)
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
        const onClickCancelModal = ()=>{
            onResetForm()
            onHide()
        }
  return (
    <>
    {(showLoading)?(
        <Modal size='sm' show={showLoading}>
        <ModalBody>
        <div className='d-flex flex-column align-items-center justify-content-center text-center' style={{height: '15vh'}}>
				<span className="loader-box2"></span>
		</div>
        </ModalBody>
    </Modal> 
    ):(
        <>
            <Modal size='xl' onHide={onClickCancelModal} show={show}>
                <Modal.Header>
                    <Modal.Title>
                        {data?'ACTUALIZAR ARTICULO':'REGISTRAR ARTICULO'}
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
                                            FOTO DEL ARTICULO
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
                                            ITEM
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
                                            options={dataZonas}
                                            value={dataZonas.find(
                                                (option) => option.value === id_lugar
                                            )||0}
                                            
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="mb-4">
                                        <label htmlFor="fecha_entrada" className="form-label">
                                            FECHA DE ENTRADA
                                        </label>
                                        <input
                                                className="form-control"
                                                name="fecha_entrada"
                                                id="fecha_entrada"
                                                value={fecha_entrada}
                                                type='date'
                                                onChange={onInputChange}
                                                placeholder=""
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
                                        <label htmlFor="costo_unitario" className="form-label">
                                            COSTO UNITARIO SOLES
                                        </label>
                                        <input
                                                className="form-control"
                                                name="costo_unitario"
                                                id="costo_unitario"
                                                value={costo_unitario}
                                                onChange={onInputChange}
                                                placeholder=""
                                            />
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="mb-4">
                                        <label htmlFor="costo_unitario_dolares" className="form-label">
                                            COSTO UNITARIO DOLARES
                                        </label>
                                        <input
                                                className="form-control"
                                                name="costo_unitario_dolares"
                                                id="costo_unitario_dolares"
                                                value={costo_unitario_dolares}
                                                onChange={onInputChange}
                                                placeholder=""
                                            />
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="mb-4">
                                        <label htmlFor="mano_obra_soles" className="form-label">
                                            COSTO MANO OBRA SOLES
                                        </label>
                                        <input
                                                className="form-control"
                                                name="mano_obra_soles"
                                                id="mano_obra_soles"
                                                value={mano_obra_soles}
                                                onChange={onInputChange}
                                                placeholder=""
                                            />
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="mb-4">
                                        <label htmlFor="mano_obra_dolares" className="form-label">
                                            COSTO MANO OBRA DOLARES
                                        </label>
                                        <input
                                                className="form-control"
                                                name="mano_obra_dolares"
                                                id="mano_obra_dolares"
                                                value={mano_obra_dolares}
                                                onChange={onInputChange}
                                                placeholder=""
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
                                    <div>
                                        COSTO TOTAL EN SOLES: <NumberFormatMoney amount={costo_total_s}/>
                                    </div>
                                    <div>
                                        COSTO TOTAL EN DOLARES: <NumberFormatMoney amount={costo_total_d}/>
                                    </div>
                                </Col>
                                {/* <Col lg={12}>
                                    <div className="mb-4">
                                        <label htmlFor="observacion" className="form-label">
                                            OBSERVACIONES
                                        </label>
                                        <textarea
                                                className="form-control"
                                                name="observacion"
                                                id="observacion"
                                                value={descripcion}
                                                onChange={onInputChange}
                                                placeholder=""
                                                required
                                            />
                                    </div>
                                </Col> */}
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

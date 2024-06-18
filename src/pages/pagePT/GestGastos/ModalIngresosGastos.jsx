import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { arrayEstados, arrayFinanzas, arrayMonedas } from '@/types/type'
import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { ModalProveedor } from '../GestProveedores/ModalProveedor'
const registerIvsG={
    id_tipoGasto: 0,
    id_gasto: 0,
    grupo: '',
    moneda: '',
    monto: '',
    id_tipo_comprobante: 0,
    n_comprabante: '',
    impuesto_igv: false,
    impuesto_renta: false,
    fec_pago: '',
    id_forma_pago: 0,
    id_banco_pago: 0,
    n_operacion: '',
    id_rubro: 0,
    descripcion: '',
    id_prov: 0
}
export const ModalIngresosGastos = ({onHide, show, data, isLoading, onShow, showToast}) => {
    const onClickCancelModal = ()=>{
        onHide()
        onResetForm()
    }
    const [grupoGasto, setgrupoGasto] = useState([])
    const [gastoxGrupo, setgastoxGrupo] = useState([])
    const {dataParametrosGastos} = useSelector(e=>e.finanzas)
    const { obtenerParametroPorEntidadyGrupo: obtenerParametroTipoComprobante, DataGeneral: DataTipoComprobante } = useTerminoStore()
    // const { obtenerParametroPorEntidadyGrupo: obtenerParametroFormaPago, DataGeneral: DataFormaPago } = useTerminoStore()
    const { obtenerParametrosProductoProveedor, DataProducProveedor } = useTerminoStore()
    const { obtenerParametrosFormaPago, DataFormaPago } = useTerminoStore()
    const { obtenerParametrosBancos, DataBancos } = useTerminoStore()
    const { startRegistrarGastos, startActualizarGastos } = useGf_GvStore()
    const { formState, 
            id_tipoGasto, 
            id_gasto,
            grupo,
            moneda, 
            monto, 
            id_tipo_comprobante, 
            n_comprabante, 
            impuesto_igv,
            impuesto_renta,
            fec_pago, 
            id_forma_pago, 
            id_banco_pago,
            n_operacion, 
            id_rubro,
            id_prov, 
            descripcion, 
            onInputChange, 
            onInputChangeReact, 
            onResetForm ,
            onInputChangeFunction
        } = useForm(data?data:registerIvsG)
        const arrayGrupo = dataParametrosGastos.map(e=>{
            return {
                label: e.grupo.replace(/\s/g, ''),
                value: e.grupo.replace(/\s/g, ''),
                id_tipoGasto: e.id_tipoGasto,
            }
        })
        const group = arrayGrupo.reduce((acc, item) => {
            if (!acc.some(obj => obj.value === item.value)) {
                acc.push(item);
              }
              return acc;
        }, [])
        const dataGasto = dataParametrosGastos.map(e=>{
            return {
                value: e.id,
                label: e.nombre_gasto,
                grupo: e.grupo
            }
        })
        useEffect(() => {
            onInputChangeFunction("grupo", 0)
        }, [id_tipoGasto])
        
        useEffect(() => {
            if(data){
                onInputChangeFunction("id_gasto", id_gasto)
                return;
            }
            onInputChangeFunction("id_gasto", 0)
        }, [grupo, id_tipoGasto])
        
        useEffect(() => {
            const grupos = group.filter(e=>e.id_tipoGasto===id_tipoGasto)||[]
            setgrupoGasto(grupos)
            setgastoxGrupo([])
        }, [id_tipoGasto])

        useEffect(() => {
            const gastos = dataGasto.filter(e=>e.grupo===grupo)||[]
            setgastoxGrupo(gastos)
        }, [grupo])

        useEffect(() => {
            obtenerParametroTipoComprobante('finanzas', 'tipo_comprabante')
            obtenerParametrosProductoProveedor()
            obtenerParametrosFormaPago()
            obtenerParametrosBancos()
        }, [])
        
        const submitGasto = async(e)=>{
            e.preventDefault()
            if(data!=0){
                startActualizarGastos(formState, data.id)
            }
            await startRegistrarGastos(formState)
            showToast('success', 'Guardar gasto', 'Gasto agregado correctamente', 'success')
            onClickCancelModal()
        }
        const [openModalProv, setopenModalProv] = useState(false)
        const onOpenModalProveedor = ()=>{
            setopenModalProv(true)
            onHide()
        }
        const onCloseModalProveedor=()=>{
            setopenModalProv(false)
            onShow()
        }
  return (
    <>
    <Modal size='xl' onHide={onClickCancelModal} show={show}>
        <Modal.Header>
            <Modal.Title>
                {data?'Actualizar Gasto':'Registro Gasto'}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {isLoading ? (
                <>
                Cargando...
                </>
            ):(
                <form onSubmit={submitGasto}>
                    <Row>
                        <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="id_tipoGasto" className="form-label">
                                    Tipo de gasto*
                                </label>
                                <Select
                                    onChange={(e) => onInputChangeReact(e, 'id_tipoGasto')}
                                    name="id_tipoGasto"
                                    placeholder={'Seleccione el tipo de gasto'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={arrayFinanzas}
                                    value={arrayFinanzas.find(
                                        (option) => option.value === id_tipoGasto
                                    )||0}
                                    required
                                />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="grupo" className="form-label">
                                    Grupo*
                                </label>
                                <Select
                                    onChange={(e) => onInputChangeReact(e, 'grupo')}
                                    name="grupo"
                                    placeholder={'Seleccionar el grupo'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={grupoGasto||[]}
                                    value={grupoGasto.find(
                                        (option)=>option.value==grupo
                                    )||''}
                                    required
                                />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="id_gasto" className="form-label">
                                    Gastos*
                                </label>
                                <Select
                                    onChange={(e) => onInputChangeReact(e, 'id_gasto')}
                                    name="id_gasto"
                                    placeholder={'Seleccionar el gasto'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={gastoxGrupo}
                                    value={gastoxGrupo.find(
                                        (option)=>option.value === id_gasto
                                    )||0}
                                    required
                                />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="moneda" className="form-label">
                                    Tipo de Moneda*
                                </label>
                                <Select
                                    onChange={(e) => onInputChangeReact(e, 'moneda')}
                                    name="moneda"
                                    placeholder={'Seleccionar la moneda'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={arrayMonedas}
                                    value={arrayMonedas.find(
                                        (option) => option.value === moneda
                                    )}
                                    required
                                />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="monto" className="form-label">
                                    Monto*
                                </label>
                                <input
                                        className="form-control"
                                        name="monto"
                                        id="monto"
                                        value={monto}
                                        onChange={onInputChange}
                                        placeholder="EJ. 0.00"
                                        required
                                    />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="id_tipo_comprobante" className="form-label">
                                    Tipo de comprobante*
                                </label>
                                <Select
                                    onChange={(e) => onInputChangeReact(e, 'id_tipo_comprobante')}
                                    name="id_tipo_comprobante"
                                    placeholder={'Seleccionar el tipo de comprobante'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={DataTipoComprobante}
                                    value={DataTipoComprobante.find(
                                        (option) => option.value === id_tipo_comprobante
                                    )}
                                    required
                                />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="n_comprabante" className="form-label">
                                    Numero de comprobante
                                </label>
                                <input
                                        className="form-control"
                                        name="n_comprabante"
                                        id="n_comprabante"
                                        value={n_comprabante}
                                        onChange={onInputChange}
                                        placeholder="EJ. 6060606"
                                    />
                            </div>
                        </Col>
                        <Col lg={4}>
                                <label htmlFor="n_comprabante" className="form-label ">
                                    Impuesto
                                </label>
                            <div className="mb-4">
                                <label
                                    className='mx-2'
                                >
                                    IGV
                                    <input
                                    type="checkbox"
                                    onChange={onInputChange}
                                    checked={impuesto_igv}
                                    name='impuesto_igv'
                                    className='mx-2'
                                    />
                                </label>
                                <label
                                    className='mx-2'
                                >
                                    RENTA
                                    <input
                                    type="checkbox"
                                    onChange={onInputChange}
                                    checked={impuesto_renta}
                                    name='impuesto_renta'
                                    />
                                </label>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="n_comprabante" className="form-label">
                                    fecha de pago
                                </label>
                                <input
                                        className="form-control"
                                        type='date'
                                        name="fec_pago"
                                        id="fec_pago"
                                        value={fec_pago}
                                        onChange={onInputChange}
                                        placeholder="EJ. 20-02-24"
                                    />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="id_forma_pago" className="form-label">
                                    Forma de pago*
                                </label>
                                <Select
                                    onChange={(e) => onInputChangeReact(e, 'id_forma_pago')}
                                    name="id_forma_pago"
                                    placeholder={'Seleccionar la forma de pago'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={DataFormaPago}
                                    value={DataFormaPago.find(
                                        (option)=>option.value==id_forma_pago
                                    )||0}
                                    required
                                />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="id_banco_pago" className="form-label">
                                    Banco*
                                </label>
                                <Select
                                    onChange={(e) => onInputChangeReact(e, 'id_banco_pago')}
                                    name="id_banco_pago"
                                    placeholder={'Seleccionar el banco'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={DataBancos}
                                    value={DataBancos.find(
                                        (option)=>option.value==id_banco_pago
                                    )||0}
                                    required
                                />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="n_operacion" className="form-label">
                                    Numero de operacion
                                </label>
                                <input
                                        className="form-control"
                                        name="n_operacion"
                                        id="n_operacion"
                                        value={n_operacion}
                                        onChange={onInputChange}
                                        placeholder="EJ. 12341234"
                                    />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="id_prov" className="form-label">
                                    Proveedor*
                                </label>
                                <Select
                                    onChange={(e) => onInputChangeReact(e, 'id_prov')}
                                    name="id_prov"
                                    placeholder={'Seleccionar el proveedor'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={DataProducProveedor}
                                    value={DataProducProveedor.find(
                                        (option)=>option.value === id_prov
                                    )||0}
                                    required
                                />
                            </div>
                        </Col>
                        <Col lg={2}>
                        <div className="mb-4">
                            <Button onClick={onOpenModalProveedor}>+</Button>
                        </div>
                        </Col>
                        {/* <Col lg={4}>
                            <div className="mb-4">
                                <label htmlFor="id_rubro" className="form-label">
                                    Rubro*
                                </label>
                                <Select
                                    onChange={(e) => onInputChangeReact(e, 'id_rubro')}
                                    name="id_rubro"
                                    placeholder={'Seleccionar el proveedor'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={DataProducProveedor}
                                    value={DataProducProveedor.find(
                                        (option)=>option.value === id_rubro
                                    )||0}
                                    required
                                />
                            </div>
                        </Col> */}
                        <Col lg={12}>
                            <div className="mb-4">
                                <label htmlFor="descripcion" className="form-label">
                                    Descripcion
                                </label>
                                <textarea
                                        className="form-control"
                                        name="descripcion"
                                        id="descripcion"
                                        value={descripcion}
                                        onChange={onInputChange}
                                        placeholder="EJ. comentario u observacion"
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
    <ModalProveedor show={openModalProv} onHide={onCloseModalProveedor}/>
    </>
  )
}

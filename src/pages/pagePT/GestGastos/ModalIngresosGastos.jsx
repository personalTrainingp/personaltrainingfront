import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { arrayEmpresa, arrayEmpresaFinan, arrayEstados, arrayFinanzas, arrayMonedas } from '@/types/type'
import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, ModalBody, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { ModalProveedor } from '../GestProveedores/ModalProveedor'
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore'
import { useTipoCambioStore } from '@/hooks/hookApi/useTipoCambioStore'
import { CurrencyMask } from '@/components/CurrencyMask'
import { InputText } from 'primereact/inputtext'
import { useProveedoresStore } from './useProveedoresStore'
const registerIvsG={
    id_empresa: 0,
    id_tipoGasto: 0,
    id_gasto: 0,
    grupo: '',
    moneda: '',
    monto: '0',
    id_tipo_comprobante: 0,
    n_comprabante: '',
    impuesto_igv: false,
    impuesto_renta: false,
    fec_pago: '',
    fec_comprobante: '',
    id_forma_pago: 0,
    id_banco_pago: 0,
    n_operacion: '',
    id_rubro: 0,
    descripcion: '',
    id_contrato_prov: 0,
    id_prov: 0,
    esCompra: false,
    id_estado_gasto: 0
}
export const ModalIngresosGastos = ({isCopy, setisCopyHide, onHide, show, data, isLoading, onShow, showToast, id_enterprice}) => {
    const onClickCancelModal = ()=>{
        onHide()
        onResetForm()
        setid_empresa(id_enterprice)
        setisCopyHide()
    }
    const [grupoGasto, setgrupoGasto] = useState([])
    const [openModalProv, setopenModalProv] = useState(false)
    const [gastoxGrupo, setgastoxGrupo] = useState([])
    const [loadingRegister, setloadingRegister] = useState(false)
        const [isAddGrupo, setisAddGrupo] = useState(false)
    const { obtenerParametrosGastosFinanzas, registrarParametrosGastosFinanzas, isLoadingParametros } = useGf_GvStore()
    const { dataTrabajosProv, obtenerTrabajosxProv } = useProveedoresStore()
    useEffect(() => {
        if(show){
            obtenerParametrosGastosFinanzas()
        }
    }, [show, isLoadingParametros])
    const {dataParametrosGastos} = useSelector(e=>e.finanzas)
    const { obtenerParametroPorEntidadyGrupo: obtenerParametroTipoComprobante, DataGeneral: DataTipoComprobante } = useTerminoStore()
    const { obtenerParametroPorEntidadyGrupo: obtenerParametroEstadoGasto, DataGeneral: DataEstadosGasto } = useTerminoStore()
    const {obtenerParametrosProveedor} = useProveedorStore()
    // const { obtenerParametroPorEntidadyGrupo: obtenerParametroFormaPago, DataGeneral: DataFormaPago } = useTerminoStore()
    const { obtenerParametrosFormaPago, DataFormaPago } = useTerminoStore()
    const { obtenerParametrosBancos, DataBancos } = useTerminoStore()
    const { startRegistrarGastos, startActualizarGastos, objetoToast, isLoadingData } = useGf_GvStore()
    const [showLoading, setshowLoading] = useState(false)
    const [loadingParametros, setloadingParametros] = useState(false)
	const { dataProvCOMBO } = useSelector(e=>e.prov)
    const [id_empresa, setid_empresa] = useState(0)
    const { formState, 
            id_tipoGasto, 
            id_gasto,
            grupo,
            moneda, 
            monto, 
            id_tipo_comprobante, 
            id_estado_gasto,
            n_comprabante, 
            impuesto_igv,
            impuesto_renta,
            fec_pago, 
            fec_comprobante,
            id_forma_pago, 
            id_banco_pago,
            n_operacion, 
            id_prov, 
            id_contrato_prov,
            descripcion, 
            esCompra,
            onInputChange, 
            onInputChangeReact, 
            onResetForm,
            onInputChangeMonto,
            onInputChangeFunction
        } = useForm(data?data:registerIvsG)
        useEffect(() => {
            setid_empresa(id_enterprice)
        }, [id_enterprice])
        
        useEffect(() => {
            if(!data){
                onInputChangeFunction("grupo", 0)
            }
        }, [id_tipoGasto, id_empresa])
        useEffect(() => {
            if(!data){
                onInputChangeFunction("id_gasto", 0)
            }
        }, [id_tipoGasto, grupo, id_empresa])
        
        useEffect(() => {
            const grupos = dataParametrosGastos.find(e=>e.id_empresa==id_empresa)?.tipo_gasto?.find(e=>e.id_tipoGasto===id_tipoGasto)?.grupos||[]
            setgrupoGasto(grupos)
        }, [id_tipoGasto, id_empresa])
        useEffect(() => {
            const conceptos = dataParametrosGastos.find(e=>e.id_empresa==id_empresa)?.tipo_gasto?.find(e=>e.id_tipoGasto===id_tipoGasto)?.grupos.find(g=>g.value==grupo)?.conceptos||[]
            setgastoxGrupo(conceptos)
        }, [grupo, id_tipoGasto, id_empresa])
        
        
        useEffect(() => {
            if(show){
                obtenerParametroTipoComprobante('finanzas', 'tipo_comprabante')
                obtenerParametroEstadoGasto('egresos', 'estado-gasto')
                obtenerParametrosProveedor()
                obtenerParametrosFormaPago()
                obtenerParametrosBancos()
            }
        }, [show])
        useEffect(() => {
            if(!openModalProv){
                obtenerParametrosProveedor()
            }
        }, [openModalProv])
        
        const submitGasto = async(e)=>{
            e.preventDefault()
            if(data){
                // console.log("con");
                
                if(isCopy){
                    setshowLoading(true)
                    const {  id, ...valores } = formState;
                    console.log("valores repetidos", valores);
                    
                    await startRegistrarGastos(valores, id_enterprice)
                    setshowLoading(false)
                    return;
                }
                setshowLoading(true)
                await startActualizarGastos(formState, data.id, id_enterprice)
                setshowLoading(false)
                // console.log("sin ");
                // showToast('success', 'Editar gasto', 'Gasto editado correctamente', 'success')
                onClickCancelModal()
                return;
            }
            setshowLoading(true)
            await startRegistrarGastos(formState, id_enterprice)
            setshowLoading(false)
            // showToast(objetoToast);
            onClickCancelModal()
        }
        const onOpenModalProveedor = ()=>{
            setopenModalProv(true)
            onHide()
        }
        const onCloseModalProveedor=()=>{
            setopenModalProv(false)
            onShow()
        }
        const onClickAgregarGrupo = (valueSelect)=>{
            // console.log({id_empresa, valueSelect, id_tipoGasto}, formState);
            setisAddGrupo(false)
            registrarParametrosGastosFinanzas({id_empresa, grupo: valueSelect, id_tipoGasto})
            setisAddGrupo(true)
        }
        const onClickSaveAndNew=async(e)=>{
            e.preventDefault()
            if(data){
                // console.log("con");
                
                setshowLoading(true)
                await startActualizarGastos(formState, data.id, id_enterprice)
                setshowLoading(false)
                // console.log("sin ");
                // showToast('success', 'Editar gasto', 'Gasto editado correctamente', 'success')
                onClickCancelModal()
                return;
            }
            setshowLoading(true)
            await startRegistrarGastos(formState, id_enterprice)
            setshowLoading(false)
        }
        const onViewSelectionNotResult = (nameSelect, valueSelect)=>{
            if(nameSelect==='grupo'){
                if(id_tipoGasto!==0 && id_empresa!==0){
                    return <button className='' onClick={()=>onClickAgregarGrupo(valueSelect)}>Agregar rubro</button>
                }
            }
        }
        const onChangeProveedores = (e)=>{
            onInputChangeReact(e, 'id_prov')
            obtenerTrabajosxProv(e.value)
        }
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
                        {data? isCopy?'REGISTRO DE GASTO CON VALORES REPETIDOS': 'Actualizar Gasto':'Registro Gasto'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(isLoading||loadingParametros) ? (
                        <>

                        {loadingParametros&& 'Cargando Parametros'}
                        {isLoading && 'Cargando Datos'}
                        </>
                    ):(
                        <form onSubmit={submitGasto}>
                            <Row>
                                <Col lg={4}>
                                    <div className="mb-4">
                                        <label htmlFor="id_tipoGasto" className="form-label">
                                            EMPRESA*
                                        </label>
                                        <Select
                                            onChange={(e) => setid_empresa(e.value)}
                                            name="id_empresa"
                                            placeholder={'Seleccione el tipo de gasto'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={arrayEmpresaFinan}
                                            value={arrayEmpresaFinan.find(
                                                (option) => option.value === id_empresa
                                            )||0}
                                            required
                                        />
                                    </div>
                                </Col>
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
                                            Rubro*
                                        </label>
                                        <Select
                                            onChange={(e) => onInputChangeReact(e, 'grupo')}
                                            name="grupo"
                                            placeholder={'Seleccionar el grupo'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            noOptionsMessage={(e) => onViewSelectionNotResult('grupo', e.inputValue)}
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
                                            Conceptos*
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
                                            )||0}
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
                                    <div className="mb-4">
                                        <label htmlFor="fec_comprobante" className="form-label">
                                            fecha de comprobante
                                        </label>
                                        <input
                                                className="form-control"
                                                type='date'
                                                name="fec_comprobante"
                                                id="fec_comprobante"
                                                value={fec_comprobante}
                                                onChange={onInputChange}
                                                placeholder="EJ. 20-02-24"
                                                required
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
                                                required
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
                                        <Row>
                                            <Col xxl={10}>
                                                <Select
                                                    onChange={onChangeProveedores}
                                                    name="id_prov"
                                                    placeholder={'Seleccionar el proveedor'}
                                                    className="react-select"
                                                    classNamePrefix="react-select"
                                                    options={dataProvCOMBO}
                                                    value={dataProvCOMBO.find(
                                                        (option)=>option.value === id_prov
                                                    )||0}
                                                />
                                            </Col>
                                            <Col xxl={1}>
                                                <Button onClick={onOpenModalProveedor}>+</Button>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="mb-4">
                                        <label htmlFor="id_estado_gasto" className="form-label">
                                            ESTADOS*
                                        </label>
                                        <Select
                                            onChange={(e) => onInputChangeReact(e, 'id_estado_gasto')}
                                            name="id_estado_gasto"
                                            placeholder={'Seleccionar el estado'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={DataEstadosGasto||[]}
                                            value={DataEstadosGasto.find(
                                                (option)=>option.value==id_estado_gasto
                                            )||''}
                                        />
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="mb-4">
                                        <label htmlFor="id_contrato_prov" className="form-label">
                                            TRABAJOS DE PROVEEDORES
                                        </label>
                                        <Select
                                            onChange={(e) => onInputChangeReact(e, 'id_contrato_prov')}
                                            name="id_contrato_prov"
                                            placeholder={'Seleccione el trabajo del proveedor'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={dataTrabajosProv}
                                            value={dataTrabajosProv.find(
                                                (option) => option.value === id_contrato_prov
                                            )||0}
                                        />
                                    </div>
                                </Col>
                                {/* <Col lg={4}>
                                    <div className="mb-4">
                                        <label htmlFor="cod_trabajo" className="form-label">
                                            Codigo de trabajo
                                        </label>
                                        <input
                                                className="form-control"
                                                name="cod_trabajo"
                                                id="cod_trabajo"
                                                value={cod_trabajo}
                                                onChange={onInputChange}
                                                placeholder="EJ. DE1234"
                                            />
                                    </div>
                                </Col>                                                                           */}
                                <Col lg={12}>
                                <div className='mb-4'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name='esCompra' onChange={onInputChange} checked={esCompra} id="flexCheckDefault"/>
                                        <label className="form-check-label" for="flexCheckDefault">
                                            ¿Si se trata de una factura? Si es así, por favor marca la casilla.
                                        </label>
                                    </div>
                                </div>
                                </Col>
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
            {
                openModalProv&&(
                    <ModalProveedor show={openModalProv} onHide={onCloseModalProveedor}/>
                )
            }
        </>
    ) 

    }
    </>
  )
}

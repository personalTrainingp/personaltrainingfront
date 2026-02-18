import { InputButton, InputDate, InputSelect, InputSwitch, InputText, InputTextArea } from '@/components/InputText'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { arrayEmpresaFinan, arrayFinanzas, arrayMonedas, arrayTipoIngresos } from '@/types/type'
import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { useProveedoresStore } from './useProveedoresStore'
import { useTerminos2Store } from './useTerminos2Store'
import { useGastosStore } from './useGastosStore'
import { ModalProveedor } from '../GestProveedores/ModalProveedor'
import { Loading } from '@/components/Loading'
const customGasto = {
    id_tipoGasto: 0, 
    id_oficio: 0,
    id_gasto: 0,
    grupo: '',
    moneda: '', 
    monto: 0, 
    id_tipo_comprobante: 0, 
    id_estado_gasto: 1423,
    n_comprabante: '', 
    impuesto_igv: false,
    impuesto_renta: false,
    fec_pago: '', 
    fec_comprobante: '',
    id_forma_pago: 0, 
    id_banco_pago: 0,
    n_operacion: '', 
    id_prov: 0, 
    id_contrato_prov: 0,
    id_porCobrar: 0,
    descripcion: '', 
    esCompra: 0,
}
export const ModalCustomGasto = ({show, onHide, id, isCopy, id_enterprice, onOpenModalGasto}) => {
    const { obtenerGastoxID, dataGasto } = useGastosStore()
    console.log({dataGasto});
    
    const {
        formState, 
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
        id_porCobrar,
        descripcion, 
        esCompra,
        onInputChange,
        onInputChangeFunction,
        onResetForm
    } = useForm(id===0?customGasto:dataGasto)
    const { obtenerParametroPorEntidadyGrupo: obtenerParametroTipoComprobante, DataGeneral: DataTipoComprobante } = useTerminoStore()
    const { obtenerParametroPorEntidadyGrupo: obtenerParametroEstadoGasto, DataGeneral: DataEstadosGasto } = useTerminoStore()
    const { obtenerParametroPorEntidadyGrupo: obtenerParametrosFormaPago, DataGeneral: DataFormaPago } = useTerminoStore()
    const { obtenerParametroPorEntidadyGrupo: obtenerParametrosBancos, DataGeneral: DataBancos } = useTerminoStore()
    const { DataGeneral:dataOficios, obtenerParametroPorEntidadyGrupo:obtenerOficios } = useTerminoStore()
    const { dataProveedorxTipoxEmpresa, obtenerProveedorxTipoxEmpresa, obtenerContratosxProveedor, dataContratosProv } = useProveedoresStore()
    const { dataTerminologia2EmpresaxTipo, obtenerTermino2xEmpresaxTipo, dataTerm2EmpresaxConcepto, dataTerm2EmpresaxGrupo } = useTerminos2Store()
    const [dataConceptosxGrupo, setdataConceptosxGrupo] = useState([])
    const [dataGrupoxTipoGasto, setdataGrupoxTipoGasto] = useState([])
    const [dataProveedoresFiltrados, setdataProveedoresFiltrados] = useState(dataProveedorxTipoxEmpresa)
    const [isOpenModalProveedor, setOpenModalProveedor] = useState({isOpen: false, id: 0})
    const [isLoading, setisLoading] = useState(false)
    const { postGasto, updateGastoxID } = useGastosStore()
    const [id_empresa, setid_empresa] = useState(id_enterprice)
        const [id_oficio, setid_oficio] = useState(null)
    useEffect(() => {
        if(show){
            if(id!==0){
                obtenerGastoxID(id)
            }
        }
    }, [id, show])
    useEffect(() => {
        if (show) {
            obtenerContratosxProveedor(id_prov)
        }
    }, [id_prov, show])
    
    useEffect(() => {
        if(show){
            obtenerTermino2xEmpresaxTipo(id_empresa, 1573)
            obtenerProveedorxTipoxEmpresa(id_empresa, 1573)
            obtenerOficios('proveedor','tipo_oficio')
            obtenerParametroTipoComprobante('finanzas', 'tipo_comprabante')
            obtenerParametroEstadoGasto('egresos', 'estado-gasto')
            obtenerParametrosFormaPago('formapago', 'formapago')
            obtenerParametrosBancos('formapago', 'banco')
        }
    }, [id_empresa, show])
    useEffect(() => {
        if(id===0){
            onInputChangeFunction('id_gasto', 0)
        }
    }, [id_tipoGasto, grupo, id_empresa])
    useEffect(() => {
        if(id===0){
            onInputChangeFunction('grupo', 0)
        }
    }, [id_tipoGasto, id_empresa])
    useEffect(() => {
        // ALTERAR GRUPO, CUANDO LA EMPRESA O EL TIPO DE GASTO SE CAMBIE
        if (show) {
            setdataGrupoxTipoGasto(dataTerm2EmpresaxGrupo.filter(e=>e.id_tipoGasto===id_tipoGasto))
        }
    }, [id_empresa, id_tipoGasto])
    useEffect(() => {
        if(show){
            setdataConceptosxGrupo(dataTerm2EmpresaxConcepto.filter(e=>e.grupo===grupo && e.id_tipoGasto===id_tipoGasto))
        }
    }, [grupo, id_empresa, id_tipoGasto])
    
    const onSubmit = async()=>{
        cancelarGasto()
        if(isCopy){
            setisLoading(true)
            const {  id, ...valores } = formState;
            await postGasto(valores, id_enterprice)
            setisLoading(false)
        }else{
            if(id===0){
                setisLoading(true)
                await postGasto(formState, id_enterprice)
                setisLoading(false)
            }else{
                setisLoading(true)
                await updateGastoxID(id, formState, id_enterprice)
                setisLoading(false)
            }
        }
    }
    const cancelarGasto = ()=>{
        onHide()
        onResetForm()
    }
    const onOpenModalProveedor = ()=>{
        setOpenModalProveedor({isOpen: true, id:0})
        onHide()
    }
    const onCloseModalProveedor = ()=>{
        setOpenModalProveedor({isOpen: false, id:0})
        onOpenModalGasto(id, isCopy)
    }
    const onInputChangeEmpresa = (e)=>{
        setid_empresa(e.target.value)
    }
    const onInputChangeOficios = (e)=>{
        // onInputChange(e)
        setid_oficio(e.target.value)
    }
    useEffect(() => {
        if(show){
            setdataProveedoresFiltrados(id_oficio===0?dataProveedorxTipoxEmpresa:dataProveedorxTipoxEmpresa.filter(e => e.id_oficio === id_oficio))
        }
    }, [show, id_oficio, id_prov])
    console.log({id_gasto});
    
  return (
    <>
    <Loading show={isLoading}/>
    <ModalProveedor id={isOpenModalProveedor.id} onCloseModalProveedor={onCloseModalProveedor} onHide={()=>setOpenModalProveedor({isOpen: false, id:0})} onShow={onOpenModalProveedor} show={isOpenModalProveedor.isOpen}  />
    <Modal show={show} onHide={cancelarGasto} size='xl'>
        <Modal.Header>
            <Modal.Title>
                REGISTRAR GASTO { id }
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form>
                <Row>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'MARCA'} nameInput={'id_empresa'} onChange={onInputChangeEmpresa} options={arrayEmpresaFinan} value={id_empresa} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'TIPO DE GASTO'} nameInput={'id_tipoGasto'} onChange={onInputChange} options={arrayFinanzas} value={id_tipoGasto} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'RUBRO'} nameInput={'grupo'} onChange={onInputChange} options={dataGrupoxTipoGasto} value={grupo} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'CONCEPTOS'} nameInput={'id_gasto'} onChange={onInputChange} options={dataConceptosxGrupo} value={id_gasto} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'TIPO DE MONEDA'} nameInput={'moneda'} onChange={onInputChange} options={arrayMonedas} value={moneda} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputText label={'MONTO'} nameInput={'monto'} value={monto} onChange={onInputChange} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'TIPO DE COMPROBANTE'} nameInput={'id_tipo_comprobante'} onChange={onInputChange} options={DataTipoComprobante} value={id_tipo_comprobante} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputText label={'NUMERO DE COMPROBANTE'} nameInput={'n_comprabante'} value={n_comprabante} onChange={onInputChange} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputDate label={'FECHA DE COMPROBANTE'} nameInput={'fec_comprobante'} value={fec_comprobante} onChange={onInputChange} />
                        </div>
                    </Col>
                    <Col lg={4}>
                    <Row>
                        <Col lg={6}>
                            <div className='m-2'>
                                <InputSwitch label={'IGV'} nameInput={'impuesto_igv'} onChange={onInputChange} value={impuesto_igv} />
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className='m-2'>
                                <InputSwitch label={'RENTA'} nameInput={'impuesto_renta'} onChange={onInputChange} value={impuesto_renta} />
                            </div>
                        </Col>
                    </Row>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputDate label={'fecha de pago'} nameInput={'fec_pago'} value={fec_pago} onChange={onInputChange} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'FORMA DE PAGO'} nameInput={'id_forma_pago'} value={id_forma_pago} options={DataFormaPago} onChange={onInputChange} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'BANCO'} nameInput={'id_banco_pago'} value={id_banco_pago} options={DataBancos} onChange={onInputChange} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputText label={'Numero de operacion'} nameInput={'n_operacion'} value={n_operacion} onChange={onInputChange} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'oficios'} nameInput={'id_oficio'} options={[...dataOficios, {value: null, label: 'TODOS'}]} onChange={onInputChangeOficios} value={id_oficio} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2 d-flex align-items-end'>
                            <InputSelect label={'proveedor'} nameInput={'id_prov'} onChange={onInputChange} options={id_oficio===null?dataProveedorxTipoxEmpresa:dataProveedorxTipoxEmpresa.filter(e => e.id_oficio === id_oficio)} value={id_prov} />
                            <div>
                                <Button className='' onClick={onOpenModalProveedor}>+</Button>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'estados'} nameInput={'id_estado_gasto'} onChange={onInputChange} options={DataEstadosGasto} value={id_estado_gasto} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'trabajos de proveedores'} nameInput={'id_contrato_prov'} onChange={onInputChange} options={dataContratosProv.map(con=>{return {label: `${con.id}. ${con.observacion}`, value: con.id}})} value={id_contrato_prov} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'cobrar'} nameInput={'id_porCobrar'} onChange={onInputChange} options={[]} value={id_porCobrar} />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className='m-2'>
                            <InputTextArea label={'DESCRIPCION'} nameInput={'descripcion'} onChange={onInputChange} value={descripcion} />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <InputButton label={'GUARDAR'} onClick={onSubmit}/>
                        <InputButton label={'CANCELAR'} onClick={()=>cancelarGasto()} variant={'link'}/>
                    </Col>
                </Row>
            </form>
        </Modal.Body>
    </Modal>
    </>
  )
}

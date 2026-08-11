import { InputButton, InputDate, InputMoney, InputSelect, InputSwitch, InputText, InputTextArea } from '@/components/InputText'
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
import { ModalCustomProveedores } from '../GestProveedores/ModalCustomProveedores'
const customGasto = {
    id_tipoGasto: 0, 
    id_oficio: 0,
    id_gasto: 0,
    grupo: '',
    moneda: '', 
    monto: 0, 
    id_tipo_comprobante: 0, 
    id_estado_gasto: 0,
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
    id_facturado_por: 0
}
export const ModalCustomGasto = ({show, onHide, id, isCopy, id_enterprice, onOpenModalGasto, onOpenModalProveedor}) => {
    const { obtenerGastoxID, dataGasto } = useGastosStore()
      const [isOpenModalCustomProv, setisOpenModalCustomProv] = useState({id: 0, isOpen: false})
    
    const {
        formState,
        moneda, 
        monto, 
        id_tipo_comprobante, 
        id_estado_gasto,
        n_comprabante, 
        fec_comprobante,
        id_prov, 
        id_facturado_por,
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
    const { dataTerminologia2EmpresaxTipo, obtenerTermino2xEmpresaxTipo, dataTerm2EmpresaxConcepto, dataTerm2EmpresaxGrupo, isLoading:isLoadingConceptos,  } = useTerminos2Store()
    const [dataConceptosxGrupo, setdataConceptosxGrupo] = useState([])
    const [dataGrupoxTipoGasto, setdataGrupoxTipoGasto] = useState([])
    const [dataProveedoresFiltrados, setdataProveedoresFiltrados] = useState(dataProveedorxTipoxEmpresa)
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
            obtenerProveedorxTipoxEmpresa(id_empresa, 1573)
            obtenerOficios('proveedor','tipo_oficio')   
            obtenerParametroTipoComprobante('finanzas', 'tipo_comprabante')
            obtenerParametroEstadoGasto('egresos', 'estado-gasto')
            obtenerParametrosFormaPago('formapago', 'formapago')
            obtenerParametrosBancos('formapago', 'banco')
        }
    }, [id_empresa, show])
    useEffect(() => {
            obtenerTermino2xEmpresaxTipo(id_empresa, 1573)
    }, [id_empresa])
    
    const onSubmit = async()=>{
        if(isCopy){
            setisLoading(true)
            const {  id, ...valores } = formState;
            await postGasto(valores, id_enterprice)
            setisLoading(false)
            cancelarGasto()
        }else{
            if(id===0){
                setisLoading(true)
                await postGasto(formState, id_enterprice)
                setisLoading(false)
                cancelarGasto()
            }else{
                setisLoading(true)
                await updateGastoxID(id, {...formState}, id_enterprice)
                setisLoading(false)
                cancelarGasto()
            }
        }
    }
    const cancelarGasto = ()=>{
        onHide()
        onResetForm()
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
    const onCloseModalCustomProv = (id)=>{
        setisOpenModalCustomProv({id: 0, isOpen: false})
        onOpenModalGasto(id, false)
    }
    const onOpenModalCustomProv =  (id)=>{
        setisOpenModalCustomProv({id, isOpen: true})
        onHide()
    }
    const ordenFormaPago = [
        {orden: 1, values: 932},
        {orden: 2, values: 1719},
        {orden: 3, values: 167},
    ]
    const ordenFormaPagoMAP = DataFormaPago.map(f=>{
        const ordenx = ordenFormaPago.find(i=>i.values===f.value)?.orden
        return {
            ...f,
            orden: ordenx || 10000,
        }
    }).sort((a, b)=>a.orden-b.orden)
    console.log({ordenFormaPagoMAP});
    
  return (
    <>
    <Loading show={isLoading}/>
        <ModalCustomProveedores 
            onCloseModalProvPst={()=>setisOpenModalCustomProv({id, isOpen: true})} 
            onHide={()=>onCloseModalCustomProv(id)} 
            show={isOpenModalCustomProv.isOpen} 
            estado={true} 
            id_enterprice={id_empresa} 
            onShow={()=>onOpenModalCustomProv(id)} 
            tipo={1573} id={0}  />
    <Modal show={show} onHide={cancelarGasto} size='xl'>
        <Modal.Header>
            <Modal.Title>
                { id!==0?'EDITAR GASTO':'AGREGAR GASTO' }
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
                            <InputSelect label={'MONEDA'} nameInput={'moneda'} onChange={onInputChange} options={arrayMonedas} value={moneda} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2 span'>
                            <InputMoney label={'MONTO'} nameInput={'monto'} value={monto} onChange={onInputChange} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'TIPO COMPROBANTE'} nameInput={'id_tipo_comprobante'} onChange={onInputChange} options={DataTipoComprobante} value={id_tipo_comprobante} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputText label={<>n° COMPROBANTE <span className='text-change'>(obligatorio)</span></>} nameInput={'n_comprabante'} value={n_comprabante} onChange={onInputChange} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputDate label={'FECHA COMPROBANTE'} nameInput={'fec_comprobante'} value={fec_comprobante} onChange={onInputChange} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'Profesion'} nameInput={'id_oficio'} options={[...dataOficios, {value: null, label: 'TODOS'}]} onChange={onInputChangeOficios} value={id_oficio} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2 d-flex align-items-end'>
                            <InputSelect label={'proveedor'} nameInput={'id_prov'} onChange={onInputChange} options={id_oficio===null?dataProveedorxTipoxEmpresa:dataProveedorxTipoxEmpresa.filter(e => e.id_oficio === id_oficio)} value={id_prov} />
                            <div>
                                <Button className='' onClick={onOpenModalCustomProv}>+</Button>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'Facturado a'} nameInput={'id_facturado_por'} onChange={onInputChange} options={arrayEmpresaFinan} value={id_facturado_por} />
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

import { InputButton, InputDate, InputSelect, InputSwitch, InputText, InputTextArea } from '@/components/InputText'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { arrayEmpresaFinan, arrayMonedas, arrayTipoIngresos } from '@/types/type'
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { useProveedoresStore } from './useProveedoresStore'
import { useTerminos2Store } from './useTerminos2Store'
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
}
export const ModalCustomGasto = ({show, onHide, id, isCopy, id_enterprice}) => {
    const {
        formState, 
        id_empresa,
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
            id_oficio,
            id_prov, 
            id_contrato_prov,
            id_porCobrar,
            descripcion, 
            esCompra,
            onInputChange,
            onInputChangeFunction,
            onResetForm
    } = useForm(customGasto)
    const { obtenerParametroPorEntidadyGrupo: obtenerParametroTipoComprobante, DataGeneral: DataTipoComprobante } = useTerminoStore()
    const { obtenerParametroPorEntidadyGrupo: obtenerParametroEstadoGasto, DataGeneral: DataEstadosGasto } = useTerminoStore()
    const { obtenerParametroPorEntidadyGrupo: obtenerParametrosFormaPago, DataGeneral: DataFormaPago } = useTerminoStore()
    const { obtenerParametroPorEntidadyGrupo: obtenerParametrosBancos, DataGeneral: DataBancos } = useTerminoStore()
    const { DataGeneral:dataOficios, obtenerParametroPorEntidadyGrupo:obtenerOficios } = useTerminoStore()
    const { dataProveedorxTipoxEmpresa, obtenerProveedorxTipoxEmpresa } = useProveedoresStore()
    const { dataTerminologia2EmpresaxTipo, obtenerTermino2xEmpresaxTipo } = useTerminos2Store()
    const [dataConceptosxGrupo, setdataConceptosxGrupo] = useState([])
    const [dataGrupoxTipoGasto, setdataGrupoxTipoGasto] = useState([])
    useEffect(() => {
        if(show){
            obtenerOficios('proveedor','tipo_oficio')
            obtenerParametroTipoComprobante('finanzas', 'tipo_comprabante')
            obtenerParametroEstadoGasto('egresos', 'estado-gasto')
            obtenerTermino2xEmpresaxTipo(id_empresa, 1573)
            obtenerProveedorxTipoxEmpresa(id_empresa, 1573)
            obtenerParametrosFormaPago('formapago', 'formapago')
            obtenerParametrosBancos('formapago', 'banco')
        }
    }, [show, id_enterprice, id_empresa])
    console.log({dataTerminologia2EmpresaxTipo});
    useEffect(() => {
        setdataGrupoxTipoGasto(dataTerminologia2EmpresaxTipo.dataGrupos.filter(e=>e.id_tipoGasto===id_tipoGasto))
    }, [id_enterprice, id_tipoGasto])
    useEffect(() => {
        setdataConceptosxGrupo(dataTerminologia2EmpresaxTipo.dataConcepto.filter(e=>e.grupo===grupo))
    }, [id_enterprice, grupo])
    
    useEffect(() => {
        onInputChangeFunction('id_empresa', id_enterprice)
    }, [id_enterprice])
    const onSubmit = ()=>{
        cancelarGasto()
    }
    const cancelarGasto = ()=>{
        onHide()
        onResetForm()
    }
  return (
    <>
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
                            <InputSelect label={'MARCA'} nameInput={'id_empresa'} onChange={onInputChange} options={arrayEmpresaFinan} value={id_empresa} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'TIPO DE GASTO'} nameInput={'id_tipoGasto'} onChange={onInputChange} options={arrayTipoIngresos} value={id_tipoGasto} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'RUBRO'} nameInput={'grupo'} onChange={onInputChange} options={dataGrupoxTipoGasto} value={grupo} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'CONCEPTOS'} nameInput={'id_gasto'} onChange={onInputChange} options={dataConceptosxGrupo} value={id_gasto} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'TIPO DE MONEDA'} nameInput={'moneda'} onChange={onInputChange} options={arrayMonedas} value={moneda} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputText label={'MONTO'} nameInput={'monto'} value={monto} onChange={onInputChange} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'TIPO DE COMPROBANTE'} nameInput={'id_tipo_comprobante'} onChange={onInputChange} options={DataTipoComprobante} value={id_tipo_comprobante} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputText label={'NUMERO DE COMPROBANTE'} nameInput={'n_comprabante'} value={n_comprabante} onChange={onInputChange} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputDate label={'FECHA DE COMPROBANTE'} nameInput={'fec_comprobante'} value={fec_comprobante} onChange={onInputChange} required/>
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
                            <InputDate label={'fecha de pago'} nameInput={'fec_pago'} value={fec_pago} onChange={onInputChange} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'FORMA DE PAGO'} nameInput={'id_forma_pago'} value={id_forma_pago} options={DataFormaPago} onChange={onInputChange} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'BANCO'} nameInput={'id_banco_pago'} value={id_banco_pago} options={DataBancos} onChange={onInputChange} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputText label={'Numero de operacion'} nameInput={'n_operacion'} value={n_operacion} onChange={onInputChange} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'oficios'} nameInput={'id_oficio'} options={dataOficios} onChange={onInputChange} value={id_oficio} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'proveedor'} nameInput={'id_prov'} onChange={onInputChange} options={dataProveedorxTipoxEmpresa} value={id_prov} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'estados'} nameInput={'id_estado_gasto'} onChange={onInputChange} options={[]} value={id_estado_gasto} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'trabajos de proveedores'} nameInput={'id_contrato_prov'} onChange={onInputChange} options={[]} value={id_contrato_prov} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'cobrar'} nameInput={'id_porCobrar'} onChange={onInputChange} options={[]} value={id_porCobrar} required/>
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className='m-2'>
                            <InputTextArea label={'DESCRIPCION'} nameInput={'descripcion'} onChange={onInputChange} value={descripcion} required/>
                        </div>
                    </Col>
                    <Col lg={12}>
                        <InputButton label={'GUARDAR'} onClick={onSubmit}/>
                        <InputButton label={'CANCELAR'} onClick={oncancel} variant={'link'}/>
                    </Col>
                </Row>
            </form>
        </Modal.Body>
    </Modal>
    </>
  )
}

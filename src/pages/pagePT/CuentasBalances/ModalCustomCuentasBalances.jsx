import { InputButton, InputDate, InputSelect, InputText, InputTextArea } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import { arrayEmpresaFinan, arrayMonedas } from '@/types/type'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useCuentasBalances } from './hook/useCuentasBalances'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
const customCustomBalance = {
    id_concepto: 0, 
    monto:0, 
    moneda:'PEN', 
    fecha_comprobante:'', 
    id_prov:0, 
    descripcion:'',
    id_empresa: 0,
    id_banco: 0,
    id_prov__: 0,
    n_operacion: ''
}
export const ModalCustomCuentasBalances = ({show, onHide, tipo, idEmpresa, id, headerTipo}) => {
    const { postCuentasBalancesxIdEmpresaxTipo, obtenerCuentaBalancexID, dataCuentaBalance, putCuentaBalancexID, dataProveedores, obtenerParametrosProveedor } = useCuentasBalances()
    const { DataGeneral:dataConcepto, obtenerParametroPorEntidadyGrupo:obtenerDataConcepto }  = useTerminoStore()
    const { DataGeneral:dataBanco, obtenerParametroPorEntidadyGrupo:obtenerDataBanco }  = useTerminoStore()
    useEffect(() => {
        if(show){
            obtenerCuentaBalancexID(id)
        }
    }, [show])
    
    const { formState, id_concepto, id_prov__, monto, moneda, fecha_comprobante, id_prov, descripcion, id_empresa, id_banco, n_operacion, onInputChange, onResetForm } = useForm(id===0?customCustomBalance:dataCuentaBalance)
    const onSubmitCuentasBalancexIdEmpresaxTipo=()=>{
        if(id===0){
            postCuentasBalancesxIdEmpresaxTipo(formState, id_empresa, tipo)
        }else{
            putCuentaBalancexID(id, idEmpresa, tipo, formState)
        }
        onCancelarModal()
    }
    const onCancelarModal = ()=>{
        onHide()
        onResetForm()
    }
    
    useEffect(() => {
        if(show){
            obtenerDataConcepto(tipo, 'concepto')
            obtenerDataBanco('formapago','banco')
        }
    }, [show])
    useEffect(() => {
        if(show){
            obtenerParametrosProveedor(id_empresa)
        }
    }, [id_empresa])
    
  return (
    <Dialog visible={show} onHide={onCancelarModal} header={`Agregar Cuentas ${headerTipo}`} style={{width: '80rem'}}>
        <form>
            <Row>
                <Col lg={4}>
                    <div className='mb-2'>
                    <InputSelect label={'Empresa'} value={id_empresa} nameInput={'id_empresa'} onChange={onInputChange} options={arrayEmpresaFinan} required/>
                    </div>
                </Col>
                <Col lg={4}>
                    <div className='mb-2'>
                    <InputSelect label={'Concepto'} value={id_concepto} nameInput={'id_concepto'} onChange={onInputChange} options={dataConcepto} required/>
                    </div>
                </Col>
                <Col lg={4}>
                    <div className='mb-2'>
                    <InputSelect label={'Moneda'} value={moneda} nameInput={'moneda'} onChange={onInputChange} options={arrayMonedas} required/>
                    </div>
                </Col>
                <Col lg={4}>
                    <div className='mb-2'>
                        <InputText label={'Monto'} nameInput={'monto'} onChange={onInputChange} value={monto} required/>
                    </div>
                </Col>
                <Col lg={4}>
                    <div className='mb-2'>
                        <InputDate label={'Fecha de comprobante'} nameInput={'fecha_comprobante'} onChange={onInputChange} value={fecha_comprobante} required/>
                    </div>
                </Col>
                <Col lg={4}>
                    <div className='mb-2'>
                    <InputSelect label={'Empresa'} value={id_prov} nameInput={'id_prov'} onChange={onInputChange} options={dataProveedores} required/>
                    </div>
                </Col>
                <Col lg={4}>
                    <div className='mb-2'>
                    <InputSelect label={'Proveedor'} value={id_prov__} nameInput={'id_prov__'} onChange={onInputChange} options={dataProveedores} required/>
                    </div>
                </Col>
                <Col lg={4}>
                    <div className='mb-2'>
                    <InputSelect label={'Banco'} value={id_banco} nameInput={'id_banco'} onChange={onInputChange} options={dataBanco} required/>
                    </div>
                </Col>
                <Col lg={4}>
                    <div className='mb-2'>
                        <InputText label={'N° OPERACION'} nameInput={'n_operacion'} onChange={onInputChange} value={n_operacion} required/>
                    </div>
                </Col>
                <Col lg={12}>
                    <div className='mb-2'>
                        <InputTextArea label={'Descripcion'} nameInput={'descripcion'} onChange={onInputChange} value={descripcion} required />
                    </div>
                </Col>
                <Col lg={4}>
                    <InputButton label={'Guardar'} onClick={onSubmitCuentasBalancexIdEmpresaxTipo}/>
                    <InputButton label={'Cancelar'} onClick={onCancelarModal} variant={'link'}/>
                </Col>
            </Row>
        </form>
    </Dialog>
  )
}

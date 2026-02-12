import { InputButton, InputDate, InputSelect, InputText, InputTextArea } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import { arrayEmpresaFinan, arrayTipoIngresos } from '@/types/type'
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
const customGasto = {
    id_tipoGasto: 0, 
    id_gasto: 0,
    grupo: '',
    moneda: '', 
    monto: 0, 
    id_tipo_comprobante: 0, 
    id_estado_gasto: 0,
    n_comprabante: '', 
    impuesto_igv: true,
    impuesto_renta: true,
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
            onResetForm
    } = useForm(customGasto)
    const [id_empresa, setid_empresa] = useState(0)
    
    useEffect(() => {
        setid_empresa(id_enterprice)
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
                            <InputSelect label={'RUBRO'} nameInput={'id_empresa'} onChange={onInputChange} options={arrayEmpresaFinan} value={grupo} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'CONCEPTOS'} nameInput={'id_empresa'} onChange={onInputChange} options={arrayEmpresaFinan} value={id_empresa} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'TIPO DE MONEDA'} nameInput={'id_empresa'} onChange={onInputChange} options={arrayEmpresaFinan} value={id_empresa} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputText label={'MONTO'}/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'TIPO DE COMPROBANTE'} nameInput={'id_empresa'} onChange={onInputChange} options={arrayEmpresaFinan} value={id_empresa} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputText label={'NUMERO DE COMPROBANTE'}/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputDate label={'FECHA DE COMPROBANTE'}/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            {/* <InputText label={'FECHA DE COMPROBANTE'}/> */}
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputDate label={'fecha de pago'}/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'FORMA DE PAGO'}/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'BANCO'}/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputText label={'Numero de operacion'}/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'oficios'}/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'proveedor'}/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'estados'}/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'trabajos de proveedores'}/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='m-2'>
                            <InputSelect label={'cobrar'}/>
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className='m-2'>
                            <InputTextArea label={'DESCRIPCION'}/>
                        </div>
                    </Col>
                    <Col lg={12}>
                        <InputButton label={'GUARDAR'} onClick={onSubmit}/>
                    </Col>
                </Row>
            </form>
        </Modal.Body>
    </Modal>
    </>
  )
}

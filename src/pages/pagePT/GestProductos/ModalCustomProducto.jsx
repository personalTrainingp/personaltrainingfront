import { CurrencyMask } from '@/components/CurrencyMask'
import { InputButton, InputDate, InputMoney, InputSelect, InputText, InputTextArea } from '@/components/InputText'
import { useProductoStore } from '@/hooks/hookApi/useProductoStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { arrayEstados } from '@/types/type'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { useProductosStore } from './hook/useProductosStore'
const customProducto = {
			id_marca: 0,
			id_categoria: 0,
			id_presentacion: 0,
			codigo_lote: '',
			codigo_producto: '',
			codigo_contable: '',
			id_prov: 0,
			nombre_producto: '',
			prec_venta: '',
			prec_compra: '',
			stock_minimo: '',
			stock_producto: '',
			ubicacion_producto: '',
			fec_vencimiento: null,
			estado_product: true,
            descripcion: ''
}
export const ModalCustomProducto = ({onHide, show, idEmpresa, id=0}) => {
            const { startRegisterProducto, startUpdateProductoxIdProducto, dataProducto, obtenerProductoxIdProducto } = useProductosStore()
    const { 
        formState,
        id_marca,
        id_categoria,
        id_presentacion,
        codigo_lote,
        codigo_producto,
        codigo_contable,
        id_prov,
        nombre_producto,
        prec_venta,
        prec_compra,
        stock_minimo,
        stock_producto,
        ubicacion_producto,
        fec_vencimiento,
        estado_product,
        descripcion,
        onResetForm,
    onInputChange } = useForm(id==0?customProducto:dataProducto)
    const { obtenerParametrosProductoMarcas, DataProducMarca, 
            obtenerParametrosProductoCategorias, DataProducCategoria, 
            obtenerParametrosProductoPresentacion, DataProducPresentacion, 
            obtenerParametrosProductoProveedor, DataProducProveedor } = useTerminoStore()
    useEffect(() => {
        obtenerParametrosProductoMarcas()
        obtenerParametrosProductoCategorias()
        obtenerParametrosProductoPresentacion()
        obtenerParametrosProductoProveedor()
    }, [])
    useEffect(() => {
        if(id!==0){
            obtenerProductoxIdProducto(id)
        }
    }, [id, show])
    
    const submitProducto = (e)=>{
        e.preventDefault()
        if(id===0){
            startRegisterProducto(formState, idEmpresa)
        }else{
            startUpdateProductoxIdProducto(formState, idEmpresa, id)
        }
        CloseModalProducto()
    }
    const CloseModalProducto = ()=>{
        onHide()
        onResetForm()
    }
  return (
    <Dialog visible={show} onHide={CloseModalProducto} header={'AGREGAR PRODUCTO'} style={{width: '70rem'}}>
            <form onSubmit={submitProducto}>
                <Row>
                    <Col lg={4}>
                        <div className="mb-4">
                            <InputSelect label={'Marca'} nameInput={'id_marca'} onChange={onInputChange} options={DataProducMarca} placeholder='Seleccione la marca' value={id_marca} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <InputSelect label={'Categoria'} nameInput={'id_categoria'} onChange={onInputChange} options={DataProducCategoria} placeholder='Selecciona la categoria' value={id_categoria} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <InputSelect label={'Presentacion'} nameInput={'id_presentacion'} onChange={onInputChange} options={DataProducPresentacion} placeholder='Selecciona la presentacion' value={id_presentacion} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <InputText label={'codigo lote'} nameInput={'codigo_lote'} onChange={onInputChange} value={codigo_lote} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <InputText label={'codigo producto'} nameInput={'codigo_producto'} onChange={onInputChange} value={codigo_producto} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <InputText label={'codigo contable'} nameInput={'codigo_contable'} onChange={onInputChange} value={codigo_contable} required/>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <InputSelect label={'Proveedor'} nameInput={'id_prov'} onChange={onInputChange} options={DataProducProveedor} placeholder='Seleccione el proveedor' value={id_prov} required/>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <InputText label={'Nombre del producto'} nameInput={'nombre_producto'} onChange={onInputChange} value={nombre_producto} required/>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <InputMoney label={'Precio de venta'} nameInput={'prec_venta'} onChange={onInputChange} value={prec_venta} required/>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <InputMoney label={'Precio de compra'} nameInput={'prec_compra'} onChange={onInputChange} value={prec_compra} required/>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <InputText label={'Stock minimo'} nameInput={'stock_minimo'} onChange={onInputChange} value={stock_minimo} required/>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <InputText label={'Stock'} nameInput={'stock_producto'} onChange={onInputChange} value={stock_producto} required/>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <InputText label={'Ubicacion del producto'} nameInput={'ubicacion_producto'} onChange={onInputChange} value={ubicacion_producto} required/>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <InputDate label={'Fecha de vencimiento'} nameInput={'fec_vencimiento'} onChange={onInputChange} value={fec_vencimiento} required/>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <InputSelect label={'Estado'} nameInput={'estado_product'} onChange={onInputChange} options={arrayEstados} placeholder='Estado' value={estado_product} required/>
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className="mb-4">
                            <InputTextArea label={'Descripcion'} nameInput={'descripcion'} onChange={onInputChange} value={descripcion} required/>
                        </div>
                    </Col>
                    <Col lg={12}>
                        <InputButton label={'Agregar'} onClick={submitProducto}/>
                        <InputButton label={'Cancelar'} variant={'link'} onClick={CloseModalProducto} />
                    </Col>
                </Row>
            </form>
    </Dialog>
  )
}

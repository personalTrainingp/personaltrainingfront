import { CurrencyMask } from '@/components/CurrencyMask'
import { useProductoStore } from '@/hooks/hookApi/useProductoStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { arrayEstados } from '@/types/type'
import React, { useEffect } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import Select from 'react-select'
const registroProducto = {
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
			fec_vencimiento: '',
			estado_product: true,
}
export const ModalProducto = ({onHide, show, dataProducto}) => {
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
        onResetForm,
        onInputChangeReact,
    onInputChange } = useForm(dataProducto?dataProducto:registroProducto)
    const { obtenerParametrosProductoMarcas, DataProducMarca, 
            obtenerParametrosProductoCategorias, DataProducCategoria, 
            obtenerParametrosProductoPresentacion, DataProducPresentacion, 
            obtenerParametrosProductoProveedor, DataProducProveedor } = useTerminoStore()
            const { startRegisterProducto } = useProductoStore()
    useEffect(() => {
        obtenerParametrosProductoMarcas()
        obtenerParametrosProductoCategorias()
        obtenerParametrosProductoPresentacion()
        obtenerParametrosProductoProveedor()
    }, [])
    const submitProducto = (e)=>{
        e.preventDefault()
        startRegisterProducto(formState)
        CloseModalProducto()
    }
    const CloseModalProducto = ()=>{
        onHide()
        onResetForm()
    }
  return (
    <Modal show={show} onHide={CloseModalProducto} size='lg' backdrop={'static'}>
        <Modal.Header>
            <Modal.Title>Agregar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={submitProducto}>
                <Row>
                    <Col lg={4}>
                        <div className="mb-4">
                            <label htmlFor="id_marca" className="form-label">
                                Marca*
                            </label>
                            <Select
                                    onChange={(e) => onInputChangeReact(e, 'id_marca')}
                                    name="id_marca"
                                    placeholder={'Seleccione la marca'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={DataProducMarca}
                                    value={DataProducMarca.find(
                                        (option) => option.value === id_marca
                                    )}
                            />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <label htmlFor="id_categoria" className="form-label">
                                Categoria*
                            </label>
                            <Select
                                    onChange={(e) => onInputChangeReact(e, 'id_categoria')}
                                    name="id_categoria"
                                    placeholder={'Seleccione la categoria'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={DataProducCategoria}
                                    value={DataProducCategoria.find(
                                        (option) => option.value === id_categoria
                                    )}
                                    required
                            />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <label htmlFor="id_presentacion" className="form-label">
                                Presentacion*
                            </label>
                            <Select
                                    onChange={(e) => onInputChangeReact(e, 'id_presentacion')}
                                    name="id_presentacion"
                                    placeholder={'Seleccione la presentacion'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={DataProducPresentacion}
                                    value={DataProducPresentacion.find(
                                        (option) => option.value === id_presentacion
                                    )}
                                    required
                            />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <label htmlFor="codigo_lote" className="form-label">
                                Codigo de lote*
                            </label>
                            <input
                                className="form-control"
                                name="codigo_lote"
                                id="codigo_lote"
                                onChange={onInputChange}
                                value={codigo_lote}
                                placeholder="EJ. JR L123"
                            />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <label htmlFor="codigo_producto" className="form-label">
                                Codigo de producto*
                            </label>
                            <input
                                className="form-control"
                                name="codigo_producto"
                                id="codigo_producto"
                                value={codigo_producto}
                                onChange={onInputChange}
                                placeholder="EJ. 134124"
                            />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <label htmlFor="codigo_contable" className="form-label">
                                Codigo de contable*
                            </label>
                            <input
                                className="form-control"
                                name="codigo_contable"
                                id="codigo_contable"
                                value={codigo_contable}
                                onChange={onInputChange}
                                placeholder="EJ. 4123124"
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <label htmlFor="id_prov" className="form-label">
                                Proveedor*
                            </label>
                            <Select
                                    onChange={(e) => onInputChangeReact(e, 'id_prov')}
                                    name="id_prov"
                                    placeholder={'Seleccione el proveedor'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={DataProducProveedor}
                                    value={DataProducProveedor.find(
                                        (option) => option.value === id_prov
                                    )}
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <label htmlFor="nombre_producto" className="form-label">
                                Nombre del producto*
                            </label>
                            <input
                                className="form-control"
                                name="nombre_producto"
                                id="nombre_producto"
                                onChange={onInputChange}
                                placeholder="EJ. PROTEINA WHEY"
                                value={nombre_producto}
                                required
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <label htmlFor="prec_venta" className="form-label">
                                Precio de venta*
                            </label>
                            <input
                                className="form-control"
                                name="prec_venta"
                                id="prec_venta"
                                onChange={(e)=>onInputChange(CurrencyMask(e))}
                                value={prec_venta}
                                placeholder="EJ. 0.00"
                                required
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <label htmlFor="prec_compra" className="form-label">
                                Precio de compra*
                            </label>
                            <input
                                className="form-control"
                                name="prec_compra"
                                id="prec_compra"
                                onChange={(e)=>onInputChange(CurrencyMask(e))}
                                value={prec_compra}
                                placeholder="EJ. 0.00"
                                required
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <label htmlFor="stock_minimo" className="form-label">
                                Stock minimo*
                            </label>
                            <input
                                className="form-control"
                                name="stock_minimo"
                                id="stock_minimo"
                                onChange={onInputChange}
                                value={stock_minimo}
                                placeholder="EJ. 2"
                                required
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <label htmlFor="stock_producto" className="form-label">
                                Stock*
                            </label>
                            <input
                                className="form-control"
                                name="stock_producto"
                                id="stock_producto"
                                onChange={onInputChange}
                                value={stock_producto}
                                placeholder="EJ. 30"
                                required
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <label htmlFor="ubicacion_producto" className="form-label">
                                Ubicacion del producto*
                            </label>
                            <input
                                className="form-control"
                                name="ubicacion_producto"
                                id="ubicacion_producto"
                                onChange={onInputChange}
                                value={ubicacion_producto?ubicacion_producto:''}
                                placeholder="EJ. EN LAS VITRINAS DEL PRODUCTO"
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="mb-4">
                            <label htmlFor="fec_vencimiento" className="form-label">
                                Fecha de vencimiento*
                            </label>
                            <input
                                type='date'
                                className="form-control"
                                name="fec_vencimiento"
                                id="fec_vencimiento"
                                onChange={onInputChange}
                                value={fec_vencimiento}
                                placeholder="EJ. JR LAS PERLAS"
                            />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-4">
                            <label htmlFor="estado_product" className="form-label">
                                Estado*
                            </label>
                            <Select
                                    onChange={(e) => onInputChangeReact(e, 'estado_product')}
                                    name="estado_product"
                                    placeholder={'Seleccione estado'}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={arrayEstados}
                                    value={arrayEstados.find(
                                        (option) => option.value === estado_product
                                    )}
                                    required
                            />
                        </div>
                    </Col>
                    <Col lg={12}>
                        <Button type='submit'>Agregar producto</Button>
                        <a className='m-2 text-danger' style={{cursor: 'pointer'}} onClick={CloseModalProducto}>Cancelar</a>
                    </Col>
                </Row>
            </form>
        </Modal.Body>
    </Modal>
  )
}

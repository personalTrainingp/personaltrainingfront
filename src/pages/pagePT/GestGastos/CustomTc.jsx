import { useForm } from '@/hooks/useForm'
import { arrayMonedas } from '@/types/type'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Col, Row } from 'react-bootstrap'
import Select from 'react-select'
import { useTcStore } from './hooks/useTcStore'

const customTC = {
    monedaOrigen:'',
    monedaDestino:'',
    precio_compra:0.00,
    precio_venta:0.00,
    fecha:'',
}
export const CustomTc = ({show, onHide, data}) => {
    const { formState, monedaDestino, monedaOrigen, precio_compra, precio_venta, fecha, onInputChangeReact, onInputChange, onResetForm } = useForm(customTC)
    const { postTc } = useTcStore()

    const onCustomTC = async(e)=>{
        e.preventDefault()
        postTc(formState, monedaDestino, monedaOrigen)
        onCancelCustomTC()
    }
    const onCancelCustomTC = ()=>{
        onHide()
        onResetForm()
    }
  return (
    <Dialog header='AGREGAR TIPO DE CAMBIO' style={{width: '30rem'}} draggable={true} position='left' visible={show} onHide={onHide}>
        <form onSubmit={onCustomTC}>
            <Row>
                
                                                <Col lg={12}>
                                                    <div className="mb-4">
                                                        <label htmlFor="monedaOrigen" className="form-label">
                                                            Moneda Origen*
                                                        </label>
                                                        <Select
                                                            onChange={(e) => onInputChangeReact(e, 'monedaOrigen')}
                                                            name="monedaOrigen"
                                                            placeholder={'Seleccionar la moneda'}
                                                            className="react-select"
                                                            classNamePrefix="react-select"
                                                            options={arrayMonedas}
                                                            value={arrayMonedas.find(
                                                                (option) => option.value === monedaOrigen
                                                            )}
                                                            required
                                                        />
                                                    </div>
                                                </Col>
                                                <Col lg={12}>
                                                    <div className="mb-4">
                                                        <label htmlFor="monedaDestino" className="form-label">
                                                            Moneda Destino*
                                                        </label>
                                                        <Select
                                                            onChange={(e) => onInputChangeReact(e, 'monedaDestino')}
                                                            name="monedaDestino"
                                                            placeholder={'Seleccionar la moneda destion'}
                                                            className="react-select"
                                                            classNamePrefix="react-select"
                                                            options={arrayMonedas}
                                                            value={arrayMonedas.find(
                                                                (option) => option.value === monedaDestino
                                                            )}
                                                            required
                                                        />
                                                    </div>
                                                </Col>
                                                <Col lg={12}>
                                                    <div className="mb-4">
                                                        <label htmlFor="precio_compra" className="form-label">
                                                            precio Compra*
                                                        </label>
                                                        <input
                                                                className="form-control"
                                                                name="precio_compra"
                                                                id="precio_compra"
                                                                value={precio_compra}
                                                                onChange={onInputChange}
                                                                placeholder="EJ. 0.00"
                                                                required
                                                            />
                                                    </div>
                                                </Col>
                                                <Col lg={12}>
                                                    <div className="mb-4">
                                                        <label htmlFor="precio_venta" className="form-label">
                                                            precio Venta*
                                                        </label>
                                                        <input
                                                                className="form-control"
                                                                name="precio_venta"
                                                                id="precio_venta"
                                                                value={precio_venta}
                                                                onChange={onInputChange}
                                                                placeholder="EJ. 0.00"
                                                                required
                                                            />
                                                    </div>
                                                </Col>
                                                <Col lg={12}>
                                                    <div className="mb-4">
                                                        <label htmlFor="fecha" className="form-label">
                                                            fecha*
                                                        </label>
                                                        <input
                                                                className="form-control"
                                                                name="fecha"
                                                                id="fecha"
                                                                type='date'
                                                                value={fecha}
                                                                onChange={onInputChange}
                                                                required
                                                            />
                                                    </div>
                                                </Col>
                                                <Col lg={12}>
                                                    <Button label='AGREGAR' type='submit'/>
                                                    <Button label='SALIR' text onClick={onCancelCustomTC}/>
                                                </Col>
            </Row>
        </form>
    </Dialog>
  )
}

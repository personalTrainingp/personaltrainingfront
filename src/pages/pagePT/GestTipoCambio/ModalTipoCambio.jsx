import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Button, Col } from 'react-bootstrap'
const registerTipoCambio = {
    precio_venta: '',
    fecha_cambio: '',
    precio_compra: '',
    moneda: 'USD',
}
export const ModalTipoCambio = ({show, onHide}) => {
    const { formState, precio_venta, fecha_cambio, precio_compra, moneda, onInputChange, onResetForm } = useForm(registerTipoCambio)
    const onCancelButton = ()=>{
        onHide()
        onResetForm()
    }
  return (
    <Dialog header="Registrar tipo de cambio" visible={show} style={{ width: '50vw' }} onHide={onHide}>
        <form>
            <Col>
                <div className="mb-2">
                    <label htmlFor="precio_venta" className="form-label">
                        PRECIO DE VENTA*
                    </label>
                    <input
                        className="form-control"
                        name="precio_venta"
                        value={precio_venta}
                        onChange={onInputChange}
                        id="precio_venta"
                        placeholder=""
                        required
                    />
                </div>
            </Col>
            <Col>
                <div className="mb-2">
                    <label htmlFor="precio_compra" className="form-label">
                        PRECIO DE COMPRA*
                    </label>
                    <input
                        className="form-control"
                        name="precio_compra"
                        value={precio_compra}
                        onChange={onInputChange}
                        id="precio_compra"
                        placeholder=""
                        style={{ maxHeight: '100px' }}
                        required
                    />
                </div>
            </Col>
            <Col>
                <div className="mb-2">
                    <label htmlFor="precio_compra" className="form-label">
                        Fecha de cambio*
                    </label>
                    <input
                        type='date'
                        className="form-control"
                        name="precio_compra"
                        value={precio_compra}
                        onChange={onInputChange}
                        id="precio_compra"
                        placeholder="PRECIO DE VENTA"
                        style={{ maxHeight: '100px' }}
                        required
                    />
                </div>
            </Col>
                <Button type="submit">AGREGAR</Button>
                <a onClick={onCancelButton} style={{cursor: 'pointer'}} className='text-danger m-3'>Cancelar</a>
        </form>
    </Dialog>
  )
}
